import {swipeLeft} from '../chrome-touch.mjs';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdtemp,rm,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {PHP_PILOT_BANK} from '../../js/php-pilot/questions.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const reportDir=join(root,process.env.BROWSER_REPORT_DIR||'php-pilot');
await mkdir(reportDir,{recursive:true});
const siteRoot=resolve(root,process.env.QUIZ_SITE_DIR||'.')+'/';
const chrome=process.env.CHROME_BIN||['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(existsSync);
assert(chrome,'Install Chrome or set CHROME_BIN');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const profile=await mkdtemp(join(tmpdir(),'php-pilot-chrome-'));
const server=createServer(async(req,res)=>{
  try{
    const uri=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const path=resolve(siteRoot,'.'+(uri==='/'?'/index.html':uri));
    if(!path.startsWith(siteRoot)||!['.html','.css','.js','.mjs'].includes(extname(path))){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',{'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript'}[extname(path)]);
    res.end(await readFile(path));
  }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const child=spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let ws;
const checks=[],errors=[],seenLearn=[],seenExam=[],displayedKeyPositions=[];
const check=name=>{checks.push(name);console.log(`✓ PHP pilot browser: ${name}`);};
try{
  let port;
  for(let i=0;i<100;i++){try{port=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(100);}}
  assert(port,'Chrome failed to start');
  const tab=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
  ws=new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  const pending=new Map();let nextId=0;
  let loadCount = 0;
  ws.addEventListener('message',event=>{
    const data=JSON.parse(event.data);
    if(data.method==='Page.loadEventFired') loadCount++;
    if(data.id){const p=pending.get(data.id);pending.delete(data.id);data.error?p.reject(new Error(JSON.stringify(data.error))):p.resolve(data.result);}
    if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails);
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++nextId,timer=setTimeout(()=>reject(new Error(`CDP timeout: ${method}`)),10000);
    pending.set(id,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});ws.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const loadPage=async(method,params={})=>{
    const previous=loadCount;
    await call(method,params);
    for(let i=0;i<300;i++){if(loadCount>previous)return;await delay(50);}
    throw new Error(`Timed out waiting for page load: ${method}`);
  };
  const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await delay(30);}throw new Error(`Timed out: ${expression}`);};
  const click=async selector=>{
    const point=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw new Error('Missing control');e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
  };
  const key=async(key,code,virtual)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:virtual});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:virtual});};
  const shot=async name=>{await evaluate(`Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})))`);const r=await call('Page.captureScreenshot',{format:'png'});await writeFile(join(reportDir,`${name}.png`),Buffer.from(r.data,'base64'));};
  const stats=()=>evaluate(`({main:localStorage.getItem('underTheHoodStats'),legacy:localStorage.getItem('laravelQuizStats'),pilot:JSON.parse(localStorage.getItem('underTheHoodPhpEngineerV1Stats'))})`);
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  await loadPage('Page.navigate',{url:origin});await until(`document.querySelector('#availableCount')?.textContent==='560 available'`);
  const main={answered:37,correct:19,sessions:2,best:80},legacy={answered:11,correct:7,sessions:1,best:70};
  await evaluate(`localStorage.setItem('underTheHoodStats',${JSON.stringify(JSON.stringify(main))});localStorage.setItem('laravelQuizStats',${JSON.stringify(JSON.stringify(legacy))});`);
  await loadPage('Page.reload');
  await until(`document.querySelector('#lifetimeCount')?.textContent==='0 PHP answers'`);
  assert.equal(await evaluate(`document.querySelectorAll('#trackControl,#bankTrack,#collectionLink').length`),0);
  // Select the 20 retained pilot domains through the ordinary PHP setup controls.
  await click('#toggleTopics');
  for(const topic of new Set(PHP_PILOT_BANK.map(q=>q.topic)))await click(`#topicControl input[value=${JSON.stringify('PHP::'+topic)}]`);
  await until(`document.querySelector('#availableCount')?.textContent==='20 available'`);
  await shot('browser-pilot-home');
  check('all 20 retained pilot questions are selectable through normal PHP domain controls with separate release progress');

  const inspect=async()=>{
    const view=await evaluate(`({prompt:document.querySelector('#questionPrompt').textContent,options:[...document.querySelectorAll('.option-text')].map(e=>e.textContent),files:[...document.querySelectorAll('#questionCode pre code')].map(e=>e.textContent),context:document.querySelector('#questionContext').textContent,track:document.querySelector('#questionTrack').textContent})`);
    const q=PHP_PILOT_BANK.find(q=>q.prompt===view.prompt);assert(q,'Unexpected collection/question');
    assert.equal(view.track,'PHP');assert.deepEqual(new Set(view.options),new Set(q.options));
    assert.deepEqual(view.files,q.code.files.map(f=>f.snippet));assert(view.context.includes(q.versions.label));assert(view.context.includes(q.assumptions));
    const correct=view.options.indexOf(q.options[q.answer]);assert(correct>=0);
    displayedKeyPositions.push({id:q.id,position:correct,sourcePosition:q.answer});
    if(seenLearn.length<20){
      await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
      const fits=await evaluate(`[...document.querySelectorAll('.option-text')].every(e=>e.getBoundingClientRect().right<=e.closest('button').getBoundingClientRect().right && e.scrollWidth<=e.clientWidth+1)`);
      assert(fits,`${q.id}: option text overflows its button at 390px`);
      if(q.id==='PHP-PILOT-006'){await evaluate(`document.querySelector('#optionList').scrollIntoView({behavior:'instant'})`);await shot('browser-mobile-options');}
      if(q.id==='PHP-PILOT-015'){
        const methods=await evaluate(`[...document.querySelectorAll('#optionList .code-choice code')].map(e=>({source:e.textContent,whitespace:getComputedStyle(e).whiteSpace,font:getComputedStyle(e).fontFamily}))`);
        assert.deepEqual(methods.map(m=>m.source),view.options);
        assert(methods.every(m=>m.whitespace==='pre'&&m.font.includes('monospace')));
        // Shuffled short methods can fit on Linux fonts. Exercise an actual overflow,
        // and center that scroller itself before sending a native touch gesture.
        const target=await evaluate(`(()=>{const choices=[...document.querySelectorAll('#optionList .code-choice')];const index=choices.findIndex(e=>e.scrollWidth>e.clientWidth+1);if(index<0)throw new Error('Expected a long method choice');const e=choices[index];e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return{index,x:r.x+r.width/2,y:r.y+r.height/2,width:e.clientWidth,contentWidth:e.scrollWidth};})()`);
        await call('Emulation.setTouchEmulationEnabled',{enabled:true});
        await swipeLeft(call,target);
        try { await until(`document.querySelectorAll('#optionList .code-choice')[${target.index}].scrollLeft>0`); }
        catch(error){
          console.log('Scroll diagnostics',await call('Browser.getVersion'),target,await evaluate(`(()=>{const e=document.querySelectorAll('#optionList .code-choice')[${target.index}];const r=e.getBoundingClientRect();return{scrollLeft:e.scrollLeft,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,rect:r.toJSON(),hit:document.elementFromPoint(${target.x},${target.y})?.outerHTML.slice(0,400),viewport:{width:innerWidth,height:innerHeight}};})()`));
          await shot('browser-mobile-scroll-failure');throw error;
        }
        assert.equal(await evaluate(`document.querySelectorAll('.option-button.selected').length`),0,'Scrolling a method choice selected an answer');
        await call('Emulation.setTouchEmulationEnabled',{enabled:false});
        await evaluate(`document.querySelectorAll('#optionList .code-choice')[${target.index}].scrollLeft=0`);
        await shot('browser-mobile-method-choices');
      }
      await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
      if(q.id==='PHP-PILOT-015'){await evaluate(`document.querySelector('#optionList').scrollIntoView({behavior:'instant'})`);await shot('browser-desktop-method-choices');}
    }
    return {q,view,correct};
  };
  await click('[data-size="20"]');await click('#startButton');
  for(let i=0;i<20;i++){
    const {q,view,correct}=await inspect();seenLearn.push(q.id);
    if(i===0)await key(String(correct+1),`Digit${correct+1}`,49+correct);else await click(`.option-button[data-index="${correct}"]`);
    await click('#questionAction');
    assert.equal(await evaluate(`document.querySelector('#feedbackTitle').textContent`),'Sound reasoning');
    assert.equal(await evaluate(`document.querySelector('#feedbackText').textContent`),q.explanation);
    const notes=await evaluate(`[...document.querySelectorAll('#learningNotes .choice-analysis')].map(e=>({number:Number(e.querySelector('.choice-analysis-number').textContent),text:e.querySelector('strong').textContent,reason:e.querySelector('p').textContent}))`);
    assert.equal(notes.length,3);
    for(const note of notes){assert.equal(note.text,view.options[note.number-1]);assert.equal(note.reason,q.learning.rationales[q.options.indexOf(note.text)]);}
    if(q.id==='PHP-PILOT-015'){assert(await evaluate(`document.querySelector('#questionCode').textContent.includes('contextual fragment')`));await shot('browser-trait-feedback');}
    await click('#questionAction');
    await until(i===19?`document.querySelector('#resultsView').classList.contains('active')`:`document.querySelector('#questionNumber').textContent==='Question ${i+2} of 20'`);
  }
  assert.equal(new Set(seenLearn).size,20);assert.equal(await evaluate(`document.querySelector('#resultCount').textContent`),'20 / 20 correct');
  assert.deepEqual((await stats()).pilot,{answered:20,correct:20,sessions:1,best:100});
  check('all 20 questions render exact files/premises and fit mobile options; shuffled Learn answers and all 60 distractor rationales map correctly');

  await click('#newSession');await click('[data-mode="exam"]');await click('#startButton');
  const neutral=async count=>{
    const observed=await evaluate(`({progress:document.querySelector('#scoreMetric').textContent,streak:document.querySelector('#streakMetric').textContent,hidden:getComputedStyle(document.querySelector('#streakMetric')).display==='none',feedback:document.querySelector('#feedbackText').textContent,notes:document.querySelector('#learningNotes').textContent,flags:document.querySelectorAll('#quizView .correct,#quizView .wrong').length,panel:document.querySelector('#feedbackPanel').hidden})`);
    assert.deepEqual(observed,{progress:`${count} of 20 answered`,streak:'',hidden:true,feedback:'',notes:'',flags:0,panel:true});
    assert.deepEqual((await stats()).pilot,{answered:20,correct:20,sessions:1,best:100});
  };
  for(let i=0;i<20;i++){
    await neutral(i);const {q,correct}=await inspect();seenExam.push(q.id);
    const selected=i%2===0?correct:(correct+1)%4;
    await click(`.option-button[data-index="${selected}"]`);await neutral(i);
    if(i===19){assert.equal(await evaluate(`document.querySelector('#questionAction').textContent`),'Submit exam');await shot('browser-exam-submit');await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);await shot('browser-exam-progress');}
    await key('Enter','Enter',13);
    await until(i===19?`document.querySelector('#resultsView').classList.contains('active')`:`document.querySelector('#questionNumber').textContent==='Question ${i+2} of 20'`);
    if(i===0){
      const switching=click('#brandButton');await delay(100);await call('Page.handleJavaScriptDialog',{accept:false});await switching;
      assert.equal(await evaluate(`document.querySelector('#questionNumber').textContent`),'Question 2 of 20');
      assert(await evaluate(`document.querySelector('#quizView').classList.contains('active')`));
      await neutral(1);check('cancelling navigation preserves the in-progress exam');
    }
  }
  assert.equal(new Set(seenExam).size,20);assert.equal(await evaluate(`document.querySelector('#resultCount').textContent`),'10 / 20 correct');
  const expectedPilot={answered:40,correct:30,sessions:2,best:100};
  await key('Enter','Enter',13);assert.deepEqual((await stats()).pilot,expectedPilot);
  await shot('browser-exam-results');
  check('20-item exam stays neutral before submission, clears Learn feedback, grades 10/20, and counts completion once');
  assert(displayedKeyPositions.filter(item=>item.position!==item.sourcePosition).length>=5,'Display ordering did not change as expected');
  assert(new Set(displayedKeyPositions.map(item=>item.position)).size>1);
  check('real browser option shuffling moves keyed answers while preserving grading');

  await loadPage('Page.reload');await until(`document.querySelector('#lifetimeCount')?.textContent==='40 PHP answers'`);
  assert.deepEqual(await stats(),{main:JSON.stringify(main),legacy:JSON.stringify(legacy),pilot:expectedPilot});
  await click('[data-view="bank"]');
  await click('#bankSearch');await call('Input.insertText',{text:'PHP-PILOT-003'});
  await until(`document.querySelectorAll('.bank-question').length===1`);await click('.bank-question summary');await until(`document.querySelector('.bank-answer').dataset.enriched==='true'`);
  assert.equal(await evaluate(`document.querySelectorAll('.bank-answer > .code-lesson pre').length`),2);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate(`document.querySelector('.bank-question').scrollIntoView({behavior:'instant'})`);
  assert(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`));await shot('browser-mobile-files');
  check('pilot progress survives reload; multi-file bank review works at a 390px mobile viewport');
  await loadPage('Page.navigate',{url:origin+'/?collection=php-pilot-v1'});
  await until(`document.querySelector('#lifetimeCount')?.textContent==='40 PHP answers'`);
  assert.equal(await evaluate(`new URL(location.href).searchParams.has('collection')`),false);
  assert.equal(await evaluate(`document.querySelector('#availableCount').textContent`),'560 available');
  assert.deepEqual(await stats(),{main:JSON.stringify(main),legacy:JSON.stringify(legacy),pilot:expectedPilot});
  assert.deepEqual(errors,[]);
  check('retired pilot bookmarks open the PHP release and preserve historical/current totals and raises no JavaScript errors');
  const browser=await call('Browser.getVersion');
  await writeFile(join(reportDir,'browser-results.json'),JSON.stringify({browser:browser.product,siteDirectory:process.env.QUIZ_SITE_DIR||'.',checks,learnIds:seenLearn,examIds:seenExam,displayedKeyPositions,mainStats:main,legacyStats:legacy,pilotStats:expectedPilot,errors},null,2)+'\n');
}finally{ws?.close();child.kill('SIGTERM');await new Promise(resolve=>server.close(resolve));await delay(500);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});}
