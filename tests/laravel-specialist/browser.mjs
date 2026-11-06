import {swipeLeft} from '../chrome-touch.mjs';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdtemp,rm,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import LARAVEL_BANK from '../../js/laravel-bank.mjs';
const REVIEW_BANK=LARAVEL_BANK;

const root=fileURLToPath(new URL('../../',import.meta.url));
const reportDir=join(root,process.env.BROWSER_REPORT_DIR||'release/laravel-beta/evidence/browser-laravel');
await mkdir(reportDir,{recursive:true});
const siteRoot=resolve(root,process.env.QUIZ_SITE_DIR||'_site')+'/';
const chrome=process.env.CHROME_BIN||['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(existsSync);
assert(chrome,'Install Chrome or set CHROME_BIN');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const profile=await mkdtemp(join(tmpdir(),'laravel-review-chrome-'));
const server=createServer(async(req,res)=>{
  try{
    let uri=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!uri.startsWith('/quiz-preview/')){res.writeHead(404).end();return;}
    uri=uri.slice('/quiz-preview'.length);
    const path=resolve(siteRoot,'.'+(uri==='/'?'/index.html':uri));
    if(!path.startsWith(siteRoot)||!['.html','.css','.js','.mjs'].includes(extname(path))){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',{'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript'}[extname(path)]);
    res.end(await readFile(path));
  }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const localOrigin=`http://127.0.0.1:${server.address().port}`;
const base=process.env.QUIZ_BASE_URL||localOrigin+'/quiz-preview/';
const origin=new URL(base).origin;
const child=spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let ws;
const checks=[],errors=[],seenLearn=[],seenExam=[],displayedKeyPositions=[];
const check=name=>{checks.push(name);console.log(`✓ Laravel Specialist browser: ${name}`);};
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
  const select=async(selector,index)=>{await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.focus();e.selectedIndex=${index};e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);assert.equal(await evaluate(`document.querySelector(${JSON.stringify(selector)}).selectedIndex`),index,selector);};
  const stats=()=>evaluate(`({main:localStorage.getItem('underTheHoodStats'),legacy:localStorage.getItem('laravelQuizStats'),pilot:localStorage.getItem('underTheHoodPhpPilotV1Stats'),preview:localStorage.getItem('underTheHoodPhpEngineerReviewV1Stats'),unrelated:localStorage.getItem('unrelated-app'),php:localStorage.getItem('underTheHoodPhpEngineerV1Stats'),laravelReview:localStorage.getItem('underTheHoodLaravelSpecialistReviewV1Stats'),release:JSON.parse(localStorage.getItem('underTheHoodLaravelSpecialistBetaV1Stats'))})`);
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  await loadPage('Page.navigate',{url:base});await until(`document.querySelector('#availableCount')?.textContent==='560 available'`);
  const main={answered:37,correct:19,sessions:2,best:80},legacy={answered:11,correct:7,sessions:1,best:70},pilot={answered:40,correct:30,sessions:2,best:100};
  await evaluate(`localStorage.setItem('underTheHoodPhpEngineerReviewV1Stats','{"answered":999,"correct":888,"sessions":55,"best":100,"missed":["PQ-001","LQ-001"]}');localStorage.setItem('underTheHoodLaravelSpecialistReviewV1Stats','{"answered":600,"correct":450,"sessions":8,"best":80}');localStorage.setItem('unrelated-app','keep-me');localStorage.setItem('underTheHoodPhpEngineerV1Stats','{"answered":620,"correct":500,"sessions":10,"best":90}');localStorage.setItem('underTheHoodStats',${JSON.stringify(JSON.stringify(main))});localStorage.setItem('laravelQuizStats',${JSON.stringify(JSON.stringify(legacy))});localStorage.setItem('underTheHoodPhpPilotV1Stats',${JSON.stringify(JSON.stringify(pilot))});`);
  const started=Date.now();
  await loadPage('Page.navigate',{url:base});
  await until(`document.querySelector('#lifetimeCount')?.textContent==='620 PHP answers'`);
  assert.deepEqual(await evaluate(`[...document.querySelector('#subjectSelect').options].map(o=>o.textContent)`),['PHP Engineer — 620 questions','Laravel Specialist (Beta) — 600 questions']);
  await select('#subjectSelect',1);
  const initialCount=REVIEW_BANK.filter(q=>q.difficulty!=='Advanced').length;
  await until(`document.querySelector('#availableCount')?.textContent==='${initialCount} available'`);
  const loadMs=Date.now()-started;
  assert.equal(await evaluate(`document.querySelector('#lifetimeCount').textContent`),'0 Laravel answers');
  assert.equal(await evaluate(`document.querySelectorAll('#trackControl,#bankTrack,#collectionLink').length`),0);
  assert.equal(await evaluate(`document.querySelector('#difficultyControl input[value="Advanced"]').checked`),false);
  await shot('review-home-desktop');
  check('Existing PHP progress survives; the regular subject selector opens 600 Laravel Beta questions with fresh isolated totals');
  const input=async(selector,text)=>{await click(selector);await call('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',commands:['selectAll']});await call('Input.insertText',{text});if(!text)await key('Backspace','Backspace',8);};
  // SelectOption equivalent: browser DOM input/change events, never application state.
  assert.equal(await evaluate(`document.querySelectorAll('.review-filters').length`),0);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`));
  await shot('review-home-mobile');
  await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  check('setup has no extra review filters on desktop/mobile; default difficulty selection remains intact');
  await click('#difficultyControl input[value="Advanced"]');await until(`document.querySelector('#availableCount').textContent==='600 available'`);
  await click('[data-size="all"]');await click('#startButton');
  const screenshots=new Set(['LAR-S26-0027','LAR-S26-0158','LAR-S26-0242','LAR-S26-0339','LAR-S26-0436','LAR-S26-0551']);
  let correctLearn=0;const renderChecks=[];
  const inspect=async()=>{
    const view=await evaluate(`({id:document.querySelector('#questionMeta').textContent.split(' · ')[0],prompt:document.querySelector('#questionPrompt').textContent,options:[...document.querySelectorAll('.option-text')].map(e=>e.textContent),files:[...document.querySelectorAll('#questionCode pre code')].map(e=>e.textContent),context:document.querySelector('#questionContext').textContent,hidden:document.querySelector('#questionCode').hidden,layout:[...document.querySelectorAll('#questionCode code')].map(e=>({whiteSpace:getComputedStyle(e).whiteSpace,align:getComputedStyle(e).textAlign,source:e.textContent,spans:e.querySelectorAll('span').length})),unsafe:document.querySelectorAll('#questionCode script,#questionCode iframe,#questionCode img').length})`);
    const q=REVIEW_BANK.find(q=>q.id===view.id);assert(q,'Unexpected ID');
    assert.equal(view.prompt,q.prompt);
    if(q.id==='LAR-S26-0437'){
      const meta=await evaluate(`document.querySelector('#questionMeta').textContent`);
      assert(meta.includes('HTTP transport failures; HTTP response status handling.'));
      assert(!meta.includes('ConnectionException'));
    }assert.deepEqual(new Set(view.options),new Set(q.options));
    assert.deepEqual(view.files,q.code?.files.map(f=>f.snippet)||[]);assert.equal(view.hidden,!q.code);
    assert(view.context.includes(q.assumptions));assert.equal(view.unsafe,0);
    assert(view.layout.every(l=>l.whiteSpace==='pre'&&l.align!=='center'&&l.align!=='justify'));
    const correct=view.options.indexOf(q.options[q.answer]);assert(correct>=0);
    displayedKeyPositions.push({id:q.id,position:correct,sourcePosition:q.answer});
    return{q,view,correct};
  };
  for(let i=0;i<600;i++){
    const {q,view,correct}=await inspect();seenLearn.push(q.id);
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),q.id+': mobile page overflow');
    assert(await evaluate(`[...document.querySelectorAll('.option-text')].every(e=>e.scrollWidth<=e.clientWidth+1)`),q.id+': mobile option overflow');
    if(screenshots.has(q.id)){await evaluate(`document.querySelector('#questionPrompt').scrollIntoView({behavior:'instant',block:'start'})`);await shot(q.id+'-mobile');}
    await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
    if(screenshots.has(q.id)){await evaluate(`document.querySelector('#questionPrompt').scrollIntoView({behavior:'instant',block:'start'})`);await shot(q.id+'-desktop');}
    const chosen=i%7===0?(correct+1)%4:correct;if(chosen===correct)correctLearn++;
    await click(`.option-button[data-index="${chosen}"]`);await click('#questionAction');
    assert.equal(await evaluate(`document.querySelector('#feedbackText').textContent`),q.explanation);
    const notes=await evaluate(`[...document.querySelectorAll('#learningNotes .choice-analysis')].map(e=>({number:Number(e.querySelector('.choice-analysis-number').textContent),text:e.querySelector('strong').textContent,reason:e.querySelector('p').textContent}))`);
    assert.equal(notes.length,3);
    for(const note of notes){assert.equal(note.text,view.options[note.number-1]);assert.equal(note.reason,q.learning.rationales[q.options.indexOf(note.text)]);}
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),q.id+': mobile feedback overflow');
    await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
    renderChecks.push({id:q.id,files:view.files.length,mobile:true,mobileFeedback:true,rationales:notes.length});
    await click('#questionAction');
    await until(i===599?`document.querySelector('#resultsView').classList.contains('active')`:`document.querySelector('#questionNumber').textContent==='Question ${i+2} of 600'`);
    if((i+1)%100===0)console.log(`Rendered and answered ${i+1}/600 review questions in desktop/mobile Chrome.`);
  }
  assert.equal(new Set(seenLearn).size,600);assert.equal(await evaluate(`document.querySelector('#resultCount').textContent`),`${correctLearn} / 600 correct`);
  const learned={answered:600,correct:correctLearn,sessions:1,best:Math.round(correctLearn/600*100)};
  assert.deepEqual((await stats()).release,learned);
  check('all 600 questions render exact sources on desktop/mobile; all 1800 distractor rationales map correctly; mixed Learn answers score correctly');
  await click('#newSession');await click('[data-size="20"]');await click('[data-mode="exam"]');await click('#startButton');
  for(let i=0;i<20;i++){
    const {q,view,correct}=await inspect();seenExam.push(q.id);
    const neutral=await evaluate(`({score:document.querySelector('#scoreMetric').textContent,streak:document.querySelector('#streakMetric').textContent,hidden:getComputedStyle(document.querySelector('#streakMetric')).display==='none',feedback:document.querySelector('#feedbackText').textContent,notes:document.querySelector('#learningNotes').textContent,flags:document.querySelectorAll('#quizView .correct,#quizView .wrong').length,panel:document.querySelector('#feedbackPanel').hidden})`);
    assert.deepEqual(neutral,{score:`${i} of 20 answered`,streak:'',hidden:true,feedback:'',notes:'',flags:0,panel:true});
    assert.deepEqual((await stats()).release,learned);
    await click(`.option-button[data-index="${i%2===0?correct:(correct+1)%4}"]`);
    if(i===5)await shot('review-exam-neutral');
    await click('#questionAction');await until(i===19?`document.querySelector('#resultsView').classList.contains('active')`:`document.querySelector('#questionNumber').textContent==='Question ${i+2} of 20'`);
  }
  assert.equal(await evaluate(`document.querySelector('#resultCount').textContent`),'10 / 20 correct');
  const finished={answered:620,correct:correctLearn+10,sessions:2,best:learned.best};
  assert.deepEqual((await stats()).release,finished);await shot('review-exam-results');
  assert(new Set(displayedKeyPositions.map(x=>x.position)).size===4);
  assert(displayedKeyPositions.filter(x=>x.position!==x.sourcePosition).length>300);
  check('20-question Exam remains neutral until submission, grades shuffled answers 10/20 and saves completion once');
  await click('#retryMissed');await until(`document.querySelector('#questionNumber').textContent==='Question 1 of 10'`);
  const retry=await inspect();assert(seenExam.includes(retry.q.id));
  await click('#exitQuiz'); // No retry answer recorded, so no confirmation is needed.
  await click('[data-view="bank"]');
  assert.equal(await evaluate(`document.querySelectorAll('.review-filters').length`),0);
  assert((await evaluate(`document.querySelector('#bankCount').textContent`)).startsWith('600 of 600 scenarios'));
  await select('#bankDifficulty',3);
  const advancedCount=REVIEW_BANK.filter(q=>q.difficulty==='Advanced').length;
  await until(`document.querySelector('#bankCount').textContent.startsWith('${advancedCount} of 600 scenarios')`);
  await select('#bankDifficulty',0);
  await select('#bankTopic',1);
  const selectedDomain=await evaluate(`document.querySelector('#bankTopic').value`);
  const topicCount=REVIEW_BANK.filter(q=>`Laravel::${q.topic}`===selectedDomain).length;
  await until(`document.querySelector('#bankCount').textContent.startsWith('${topicCount} of 600 scenarios')`);
  await select('#bankTopic',0);
  check('question bank has no extra review filters; standard topic and difficulty controls still work');

  await input('#bankSearch','LAR-S26-0158');await until(`document.querySelectorAll('.bank-question').length===1`);await click('.bank-question summary');
  await until(`document.querySelector('.bank-answer').dataset.enriched==='true'`);
  assert.equal(await evaluate(`document.querySelectorAll('.bank-answer > .code-lesson .code-file').length`),2);
  await call('Browser.grantPermissions',{origin,permissions:['clipboardReadWrite','clipboardSanitizedWrite']});
  await click('.bank-answer .code-copy');await until(`document.querySelector('.bank-answer .code-copy').textContent==='Copied'`);
  assert.equal(await evaluate('navigator.clipboard.readText()'),REVIEW_BANK.find(q=>q.id==='LAR-S26-0158').code.files[0].snippet);
  await input('#bankSearch','LAR-S26-0562');await until(`document.querySelectorAll('.bank-question').length===1`);await click('.bank-question summary');await until(`document.querySelector('.bank-answer').dataset.enriched==='true'`);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const point=await evaluate(`(()=>{const e=document.querySelector('.bank-answer .code-scroll');e.scrollIntoView({behavior:'instant',block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:Math.max(20,Math.min(innerHeight-20,r.y+40)),overflow:e.scrollWidth>e.clientWidth};})()`);
  assert(point.overflow);await call('Emulation.setTouchEmulationEnabled',{enabled:true});
  await swipeLeft(call,point);
  await until(`document.querySelector('.bank-answer .code-scroll').scrollLeft>0`);
  assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`));await shot('review-mobile-long-line-scrolled');
  await call('Emulation.setTouchEmulationEnabled',{enabled:false});
  check('missed-question retry, multi-file review, exact clipboard copy and native mobile horizontal scrolling work');
  await loadPage('Page.reload');await until(`document.querySelector('#lifetimeCount')?.textContent==='620 Laravel answers'`);
  assert.deepEqual(await stats(),{main:JSON.stringify(main),legacy:JSON.stringify(legacy),pilot:JSON.stringify(pilot),preview:'{"answered":999,"correct":888,"sessions":55,"best":100,"missed":["PQ-001","LQ-001"]}',unrelated:'keep-me',php:'{"answered":620,"correct":500,"sessions":10,"best":90}',laravelReview:'{"answered":600,"correct":450,"sessions":8,"best":80}',release:finished});
  for(const collection of ['php-pilot-v1','php-engineer-review-v1']){
    await loadPage('Page.navigate',{url:base+'?subject=laravel&collection='+collection});
    await until(`document.querySelector('#lifetimeCount')?.textContent==='620 Laravel answers'`);
    assert.equal(await evaluate(`new URL(location.href).searchParams.has('collection')`),false);
    await click('[data-view="bank"]');
    assert((await evaluate(`document.querySelector('#bankCount').textContent`)).startsWith('600 of 600 scenarios'));
  }
  await select('#subjectSelect',0);
  assert.equal(await evaluate(`document.querySelector('#lifetimeCount').textContent`),'620 PHP answers');
  await click('[data-view="bank"]');
  assert((await evaluate(`document.querySelector('#bankCount').textContent`)).startsWith('620 of 620 scenarios'));
  await select('#subjectSelect',1);
  assert.equal(await evaluate(`document.querySelector('#lifetimeCount').textContent`),'620 Laravel answers');
  await loadPage('Page.reload');
  await until(`document.querySelector('#subjectSelect')?.value==='Laravel' && document.querySelector('#lifetimeCount').textContent==='620 Laravel answers'`);
  assert.equal((await stats()).php,'{"answered":620,"correct":500,"sessions":10,"best":90}');
  assert.equal((await stats()).laravelReview,'{"answered":600,"correct":450,"sessions":8,"best":80}');
  assert.deepEqual((await stats()).release,finished);
  check('switching subjects and reloading preserves PHP, Beta and isolated review totals without merging');
  assert.deepEqual(errors,[]);check('reload preserves Laravel Beta, PHP and historical progress independently; no browser exceptions');
  const browser=await call('Browser.getVersion');
  await writeFile(join(reportDir,'browser-results.json'),JSON.stringify({browser:browser.product,siteDirectory:process.env.QUIZ_SITE_DIR||'_site',baseUrl:base,loadMs,checks,learnIds:seenLearn,examIds:seenExam,renderChecks,displayedKeyPositions,mainStats:main,legacyStats:legacy,pilotStats:pilot,releaseStats:finished,errors},null,2)+'\n');
}finally{ws?.close();child.kill('SIGTERM');await new Promise(resolve=>server.close(resolve));await delay(500);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});}
