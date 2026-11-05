import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp, rm, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { QUESTION_BANK } from '../js/questions.mjs';
import { PHP_PILOT_BANK } from '../js/php-pilot/questions.mjs';
const PILOT_IDS = PHP_PILOT_BANK.map(q => q.id);

// Real Chrome, real DOM input, isolated origin/profile. No app state injection.
const root = fileURLToPath(new URL('../', import.meta.url));
const reportDir = join(root,process.env.BROWSER_REPORT_DIR || 'remediation');
await mkdir(reportDir,{recursive:true});
const siteRoot = resolve(root,process.env.QUIZ_SITE_DIR || '.') + '/';
const chrome = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(existsSync);
assert(chrome, 'Install Chrome or set CHROME_BIN');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const profile = await mkdtemp(join(tmpdir(),'quiz-browser-'));
const server = createServer(async (req,res) => {
  try {
    const path = resolve(siteRoot, '.' + (new URL(req.url,'http://localhost').pathname === '/' ? '/index.html' : decodeURIComponent(new URL(req.url,'http://localhost').pathname)));
    if (!path.startsWith(siteRoot) || !['.html','.js','.mjs','.css'].includes(extname(path))) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript'}[extname(path)]);
    res.end(await readFile(path));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const processChrome = spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let ws;
const errors = [], checks = [], examIds = [];
const check = name => { checks.push(name); console.log(`✓ Browser: ${name}`); };
try {
  let port;
  for(let i=0;i<100;i++){ try { port=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break; }catch{ await delay(100); } }
  assert(port,'Chrome did not open a debugging port');
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
  ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let nextId=0;
  const pending = new Map();
  let loadCount = 0;
  ws.addEventListener('message',event=>{
    const data=JSON.parse(event.data);
    if(data.method==='Page.loadEventFired') loadCount++;
    if(data.id){const p=pending.get(data.id);pending.delete(data.id);data.error?p.reject(new Error(JSON.stringify(data.error))):p.resolve(data.result);}
    if(data.method==='Runtime.exceptionThrown') errors.push(data.params.exceptionDetails);
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++nextId;
    const timeout=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`));},10000);
    pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value);},reject:error=>{clearTimeout(timeout);reject(error);}});
    ws.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{
    const result=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const loadPage=async(method,params={})=>{
    const previous=loadCount;
    await call(method,params);
    for(let i=0;i<300;i++){if(loadCount>previous)return;await delay(50);}
    throw new Error(`Timed out waiting for page load: ${method}`);
  };
  const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await delay(30);}throw new Error(`Timed out: ${expression}`);};
  const click=async selector=>{
    const point=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}); if(!e)throw new Error('Missing element');e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
  };
  const key=async(key,code,virtual)=>{
    await call('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:virtual});
    await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:virtual});
  };
  const shot=async name=>{await evaluate(`Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})))`);const result=await call('Page.captureScreenshot',{format:'png'});await writeFile(join(reportDir,`${name}.png`),Buffer.from(result.data,'base64'));};
  await call('Page.enable');await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  await loadPage('Page.navigate',{url:origin});
  await until(`document.querySelector('#availableCount')?.textContent==='560 available'`);
  const legacy={answered:37,correct:19,sessions:2,best:80};
  await evaluate(`localStorage.setItem('laravelQuizStats',${JSON.stringify(JSON.stringify(legacy))});`);
  await loadPage('Page.reload');
  await until(`document.querySelector('#lifetimeCount')?.textContent==='0 PHP answers'`);
  check('legacy totals are preserved without being counted as PHP release progress');
  assert.equal(await evaluate(`document.querySelectorAll('#trackControl,#bankTrack,#collectionLink').length`),0);
  assert.equal(await evaluate(`document.querySelector('#historicalProgress').hidden`),false);
  await click('[data-size="10"]');await click('[data-mode="exam"]');await click('#startButton');
  const neutral=async count=>{
    const observed=await evaluate(`({metric:document.querySelector('#scoreMetric').textContent,streak:document.querySelector('#streakMetric').textContent,hidden:getComputedStyle(document.querySelector('#streakMetric')).display==='none',feedback:document.querySelector('#feedbackText').textContent,notes:document.querySelector('#learningNotes').textContent,flags:document.querySelectorAll('#quizView .correct,#quizView .wrong').length,feedbackHidden:document.querySelector('#feedbackPanel').hidden})`);
    assert.deepEqual(observed,{metric:`${count} of 10 answered`,streak:'',hidden:true,feedback:'',notes:'',flags:0,feedbackHidden:true});
    assert.equal(await evaluate(`localStorage.getItem('underTheHoodPhpEngineerV1Stats')`),null,'Exam must not update aggregates before submission');
  };
  for(let i=0;i<10;i++){
    await neutral(i);
    const rendered=await evaluate(`({id:document.querySelector('#questionPrompt').dataset.questionId,prompt:document.querySelector('#questionPrompt').textContent,options:[...document.querySelectorAll('.option-text')].map(e=>e.textContent)})`);
    const question=QUESTION_BANK.find(q=>q.id===rendered.id);assert(question);examIds.push(question.id);
    const correct=question.options[question.answer];
    const index=rendered.options.findIndex(option=>i%2===0?option===correct:option!==correct);
    if(i===0)await key(String(index+1),`Digit${index+1}`,49+index);else await click(`.option-button[data-index="${index}"]`);
    await neutral(i);
    if(i===9){assert.equal(await evaluate(`document.querySelector('#questionAction').textContent`),'Submit exam');await shot('browser-exam-before-submit');await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);await shot('browser-exam-neutral-progress');}
    if(i===0)await key('Enter','Enter',13);else await click('#questionAction');
    await until(i===9?`document.querySelector('#resultsView').classList.contains('active')`:`document.querySelector('#questionNumber').textContent==='Question ${i+2} of 10'`);
  }
  check('10-question exam hides correctness, score, streak and teaching notes until Submit exam (mouse and keyboard)');
  assert.equal(await evaluate(`document.querySelector('#scorePercent').textContent`),'50%');
  assert.equal(await evaluate(`document.querySelector('#resultCount').textContent`),'5 / 10 correct');
  const expectedStats={answered:10,correct:5,sessions:1,best:50};
  assert.deepEqual(await evaluate(`JSON.parse(localStorage.getItem('underTheHoodPhpEngineerV1Stats'))`),expectedStats);
  assert.deepEqual(await evaluate(`JSON.parse(localStorage.getItem('laravelQuizStats'))`),legacy);
  await key('Enter','Enter',13);
  assert.deepEqual(await evaluate(`JSON.parse(localStorage.getItem('underTheHoodPhpEngineerV1Stats'))`),expectedStats);
  await click('.missed-item summary');
  assert(await evaluate(`document.querySelector('.missed-item').textContent.includes('Your answer:') && document.querySelectorAll('.missed-item pre').length>0`));
  await shot('browser-results');
  check('shuffled keys grade 5/10; submission updates stats once; missed review retains code and selected answer');
  await click('#retryMissed');
  const learned=await evaluate(`({id:document.querySelector('#questionPrompt').dataset.questionId,prompt:document.querySelector('#questionPrompt').textContent,options:[...document.querySelectorAll('.option-text')].map(e=>e.textContent)})`);
  const learnedQuestion=QUESTION_BANK.find(q=>q.id===learned.id);
  const correctIndex=learned.options.indexOf(learnedQuestion.options[learnedQuestion.answer]);
  await click(`.option-button[data-index="${correctIndex}"]`);await click('#questionAction');
  assert.equal(await evaluate(`document.querySelector('#feedbackTitle').textContent`),'Sound reasoning');
  assert.equal(await evaluate(`document.querySelectorAll('#learningNotes .choice-analysis').length`),3);
  assert.equal(await evaluate(`document.querySelector('#streakMetric').hidden`),false);
  check('Review missed uses Learn mode with immediate feedback and three mapped distractor explanations');
  // Leave Learn through its real confirmation and start an Exam in the same page.
  const leaving=click('#exitQuiz');
  await delay(100);await call('Page.handleJavaScriptDialog',{accept:true});await leaving;
  await click('[data-size="10"]');await click('[data-mode="exam"]');await click('#startButton');
  assert(await evaluate(`document.querySelector('#feedbackPanel').hidden && document.querySelector('#feedbackText').textContent==='' && document.querySelector('#learningNotes').textContent==='' && document.querySelectorAll('#quizView .correct,#quizView .wrong').length===0 && document.querySelector('#scoreMetric').textContent==='0 of 10 answered' && document.querySelector('#streakMetric').hidden`));
  check('switching from revealed Learn feedback to Exam clears all previous correctness indicators');
  // Reload an unfinished review: saved aggregates must survive and not count it.
  await loadPage('Page.reload');await until(`document.querySelector('#lifetimeCount')?.textContent==='10 PHP answers'`);
  assert.deepEqual(await evaluate(`JSON.parse(localStorage.getItem('underTheHoodPhpEngineerV1Stats'))`),expectedStats);
  check('current local progress survives reload; unfinished review adds no aggregate counts');
  await click('[data-view="bank"]');
  const search=async id=>{
    await click('#bankSearch');
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',modifiers:process.platform==='darwin'?4:2,windowsVirtualKeyCode:65,commands:['selectAll']});
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',modifiers:process.platform==='darwin'?4:2,windowsVirtualKeyCode:65});
    await call('Input.insertText',{text:id});
    await until(`document.querySelectorAll('.bank-question').length===1 && document.querySelector('.bank-id')?.textContent===${JSON.stringify(id)}`);
    assert.equal(await evaluate(`document.querySelector('.bank-id').textContent`),id);
    await click('.bank-question summary');await until(`document.querySelector('.bank-answer').dataset.enriched==='true'`);
  };
  for(const id of [...PILOT_IDS,'PHP-E26-0355']){
    await search(id);
    const question=QUESTION_BANK.find(q=>q.id===id);
    const rendered=await evaluate(`({code:[...document.querySelectorAll('.bank-answer > .code-lesson pre code')].map(e=>e.textContent),text:document.querySelector('.bank-answer').textContent,reasons:[...document.querySelectorAll('.bank-answer .choice-analysis p:not(.choice-example)')].map(e=>e.textContent)})`);
    assert.deepEqual(rendered.code,question.code?.files.map(file=>file.snippet)||[]);
    assert(rendered.text.includes(question.coreOptions[question.answer]));
    assert(rendered.text.includes(question.versions.label));
    assert.equal(rendered.reasons.length,3);
    for(let i=0;i<4;i++)if(i!==question.answer)assert(rendered.reasons.includes(question.learning.rationales[i]));
    for(const code of rendered.code)assert((code.match(/<\?php/g)||[]).length<=1);
    if(id==='PHP-PILOT-003')await shot('browser-multiple-files');
  }
  check('all 20 retained pilot IDs and a corrected expansion record render the exact code, versions, key and three specific rationales');
  await search('PHP-PILOT-003');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate(`document.querySelector('.bank-question').scrollIntoView({behavior:'instant'});`);
  assert(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),'Mobile horizontal overflow');
  await shot('browser-mobile');
  check('mobile question details render at 390px without document overflow');
  assert.deepEqual(errors,[],'Uncaught browser errors');
  check('no uncaught JavaScript exceptions');
  const browserVersion=await call('Browser.getVersion');
  await writeFile(join(reportDir,'browser-results.json'),JSON.stringify({browser:browserVersion.product,siteDirectory:process.env.QUIZ_SITE_DIR || '.',checks,examIds,expectedStats,pilotIds:PILOT_IDS,errors},null,2)+'\n');
} finally {
  ws?.close();processChrome.kill('SIGTERM');
  await new Promise(resolve=>server.close(resolve));
  await delay(500);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});
}
