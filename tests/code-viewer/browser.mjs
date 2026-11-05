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
const phase=process.env.CODE_VIEWER_PHASE||'after';
assert(['before','after'].includes(phase));
const output=resolve(root,process.env.BROWSER_REPORT_DIR||join('code-viewer',phase));
await mkdir(output,{recursive:true});
const basePath='/quiz/'; // Exercise GitHub Pages project-relative module URLs.
const siteRoot=resolve(root,process.env.QUIZ_SITE_DIR||'.')+'/';
const chrome=process.env.CHROME_BIN||['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(existsSync);
assert(chrome,'Install Chrome or set CHROME_BIN');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const profile=await mkdtemp(join(tmpdir(),'code-viewer-chrome-'));
const server=createServer(async(req,res)=>{
  try{
    const requestPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!requestPath.startsWith(basePath)){res.writeHead(404).end();return;}
    const uri='/'+requestPath.slice(basePath.length);
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
const checks=[],errors=[],requests=[];
const check=name=>{checks.push(name);console.log(`✓ Code viewer browser: ${name}`);};
try{
  let port;
  for(let i=0;i<100;i++){try{port=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(100);}}
  assert(port,'Chrome failed to start');
  const tab=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
  ws=new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  const pending=new Map();let nextId=0;
  ws.addEventListener('message',event=>{
    const data=JSON.parse(event.data);
    if(data.id){const p=pending.get(data.id);pending.delete(data.id);data.error?p.reject(new Error(JSON.stringify(data.error))):p.resolve(data.result);}
    if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails);
    if(data.method==='Network.requestWillBeSent')requests.push(data.params.request.url);
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++nextId,timer=setTimeout(()=>reject(new Error(`CDP timeout: ${method}`)),10000);
    pending.set(id,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});ws.send(JSON.stringify({id,method,params}));
  });
  const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await delay(30);}throw new Error(`Timed out: ${expression}`);};
  const click=async (selector,index=0)=>{
    const point=await evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(selector)})[${index}];if(!e)throw new Error('Missing control');e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
  };
  const key=async(key,code,virtual)=>{await call('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:virtual});await call('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:virtual});};
  const shot=async name=>{
    await evaluate(`Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})))`);
    const clip=await evaluate(`(()=>{const card=document.querySelector('.bank-question');const r=card.getBoundingClientRect();const end=card.querySelector('.bank-answer > .code-lesson').getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:end.bottom-r.top+16,scale:1};})()`);
    const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});
    await writeFile(join(output,`${name}.png`),Buffer.from(r.data,'base64'));
  };
  await call('Page.enable');await call('Runtime.enable');await call('Network.enable');
  await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+basePath});
  await until(`document.querySelector('#availableCount')?.textContent==='560 available'`);
  await click('[data-view="bank"]');
  const openQuestion=async id=>{
    await click('#bankSearch');
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',commands:['selectAll']});
    await call('Input.insertText',{text:id});
    await until(`document.querySelectorAll('.bank-question').length===1 && document.querySelector('.bank-id').textContent===${JSON.stringify(id)}`);
    await click('.bank-question summary');
    await until(`document.querySelector('.bank-answer').dataset.enriched==='true'`);
    const q=PHP_PILOT_BANK.find(q=>q.id===id);
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('.bank-answer > .code-lesson pre code')].map(e=>e.textContent)`),q.code.files.map(f=>f.snippet));
  };
  for(const id of ['PHP-PILOT-003','PHP-PILOT-013','PHP-PILOT-020']){
    await openQuestion(id);await shot(id+'-desktop');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await shot(id+'-mobile');
    await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  }
  check('matched desktop and mobile screenshots for PHP-PILOT-003, 013 and 020; exact source text retained');
  if(phase==='after'){
    const storedBefore=await evaluate(`JSON.stringify({...localStorage})`);
    await call('Browser.grantPermissions',{origin,permissions:['clipboardReadWrite','clipboardSanitizedWrite']});
    await call('Page.bringToFront');
    const clipboardBefore=await evaluate(`navigator.clipboard.readText()`);
    try {
      // Exercise every source in the actual bank UI, including fragment scope.
      for(const q of PHP_PILOT_BANK){
        await openQuestion(q.id);
        const rendered=await evaluate(`[...document.querySelectorAll('.bank-answer > .code-lesson .code-file')].map(file=>({name:file.querySelector('.code-filename').textContent,language:file.querySelector('.code-language').textContent,gutter:file.querySelector('.code-gutter').textContent,hidden:file.querySelector('.code-gutter').getAttribute('aria-hidden'),gutterDisplay:getComputedStyle(file.querySelector('.code-gutter')).display,numbersSelectable:getComputedStyle(file.querySelector('.code-gutter')).userSelect,whitespace:getComputedStyle(file.querySelector('code')).whiteSpace,alignment:getComputedStyle(file.querySelector('code')).textAlign,highlighted:file.querySelectorAll('code span').length,children:[...file.querySelector('code').querySelectorAll('*')].map(e=>e.tagName),fullHeight:file.querySelector('.code-scroll').scrollHeight<=file.querySelector('.code-scroll').clientHeight+1}))`);
        assert.equal(rendered.length,q.code.files.length);
        for(let i=0;i<rendered.length;i++){
          const file=rendered[i],source=q.code.files[i].snippet;
          assert.equal(file.name,q.code.files[i].name);assert.equal(file.language,'php');
          assert.equal(file.gutter,source.split(/\r\n|\r|\n/).map((_,j)=>j+1).join('\n'));
          assert.equal(file.hidden,'true');assert.equal(file.numbersSelectable,'none');
          assert.equal(file.gutterDisplay,'none');assert(file.fullHeight,`${q.id}: source is confined to a vertical editor viewport`);
          assert.equal(file.whitespace,'pre');assert.equal(file.alignment,'left');assert(file.highlighted>0);
          assert(file.children.every(tag=>tag==='SPAN'));
          await click('.bank-answer > .code-lesson .code-copy',i);
          await until(`document.querySelectorAll('.bank-answer > .code-lesson .code-copy')[${i}].textContent==='Copied'`);
          assert.equal(await evaluate(`navigator.clipboard.readText()`),source,`${q.id}/${file.name}: clipboard differs`);
        }
        assert.equal(await evaluate(`document.querySelectorAll('.bank-answer > .code-lesson .code-lesson-title').length`),0);
        if(q.id==='PHP-PILOT-015'){
          assert(await evaluate(`document.querySelector('.bank-answer > .code-lesson').textContent.includes('PHP contextual fragment')`));
          await shot('PHP-PILOT-015-desktop');
        }
      }
      check('all 20 pilot questions: full-height source, no redundant title/gutter, exact four-space indentation, token spans and exact clipboard copies for all 22 files/fragments');
      assert.equal(await evaluate(`JSON.stringify({...localStorage})`),storedBefore);

      // Real touch scrolling through long lines on a narrow Chrome viewport.
      await openQuestion('PHP-PILOT-013');
      await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
      await call('Emulation.setTouchEmulationEnabled',{enabled:true});
      const scroller='.bank-answer > .code-lesson .code-scroll';
      const mobile=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(scroller)});e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2,overflow:e.scrollWidth>e.clientWidth,gutter:e.querySelector('.code-gutter').getBoundingClientRect().x,pageFits:document.documentElement.scrollWidth<=innerWidth};})()`);
      assert(mobile.overflow&&mobile.pageFits);
      await call('Input.synthesizeScrollGesture',{x:mobile.x,y:mobile.y,xDistance:-180,yDistance:0,gestureSourceType:'touch'});
      await until(`document.querySelector(${JSON.stringify(scroller)}).scrollLeft>0`);
      assert.equal(await evaluate(`document.querySelector(${JSON.stringify(scroller)}).querySelector('.code-gutter').getBoundingClientRect().x`),mobile.gutter);
      await shot('PHP-PILOT-013-mobile-scrolled');
      await click('.bank-answer > .code-lesson .code-copy');
      await until(`document.querySelector('.bank-answer > .code-lesson .code-copy').textContent==='Copied'`);
      assert.equal(await evaluate(`navigator.clipboard.readText()`),PHP_PILOT_BANK.find(q=>q.id==='PHP-PILOT-013').code.files[0].snippet);
      check('390px Chrome touch scrolling reveals long PHP lines without wrapping/page overflow; hidden gutter and exact mobile copying preserve the reading view');

      // Synthetic display-only fixtures; none is added to a question collection.
      const unsafe='</code><img src=x onerror="globalThis.viewerInjected=1"><script>globalThis.viewerInjected=2</script>';
      const fixture='<?php\r\n\t// '+unsafe+'\r\n\t$value = "&lt;script&gt; '+ 'x'.repeat(400) +'";\r\n'+Array.from({length:100},(_,i)=>`    // line ${i+4}`).join('\r\n')+'\r\n';
      await evaluate(`(async()=>{const {createCodeLesson}=await import(${JSON.stringify(basePath+'js/code-viewer.mjs')});const host=document.createElement('div');host.id='viewerFixture';host.style.cssText='width:calc(100% - 32px);max-width:850px;margin:16px';host.append(createCodeLesson({language:'php',title:${JSON.stringify(unsafe)},files:[{name:${JSON.stringify(unsafe)},snippet:${JSON.stringify(fixture)},context:${JSON.stringify(unsafe)}}]},'Rendering safety fixture'));document.body.append(host);})()`);
      const fixtureView=await evaluate(`(()=>{const e=document.querySelector('#viewerFixture');const code=e.querySelector('code');const scroll=e.querySelector('.code-scroll');return{text:code.textContent,unsafeTags:e.querySelectorAll('script,img,iframe,svg').length,injected:globalThis.viewerInjected??null,vertical:scroll.scrollHeight>scroll.clientHeight,horizontal:scroll.scrollWidth>scroll.clientWidth,height:scroll.clientHeight,tabSize:getComputedStyle(code).tabSize};})()`);
      assert.equal(fixtureView.text,fixture);assert.equal(fixtureView.unsafeTags,0);assert.equal(fixtureView.injected,null);
      assert(fixtureView.vertical&&fixtureView.horizontal);assert(fixtureView.height<=448);assert.equal(fixtureView.tabSize,'4');
      await call('Emulation.setTouchEmulationEnabled',{enabled:false});
      await call('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('#viewerFixture .code-gutter')).display`),'block');
      const gutterLeft=await evaluate(`document.querySelector('#viewerFixture .code-gutter').getBoundingClientRect().x`);
      const point=await evaluate(`(()=>{const e=document.querySelector('#viewerFixture .code-scroll');e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);
      await call('Input.dispatchMouseEvent',{type:'mouseWheel',...point,deltaX:500,deltaY:0});
      await until(`document.querySelector('#viewerFixture .code-scroll').scrollLeft>0`);
      assert.equal(await evaluate(`document.querySelector('#viewerFixture .code-gutter').getBoundingClientRect().x`),gutterLeft);
      await call('Input.dispatchMouseEvent',{type:'mouseWheel',...point,deltaX:0,deltaY:500});
      await until(`document.querySelector('#viewerFixture .code-scroll').scrollTop>0`);
      await click('#viewerFixture .code-copy');await until(`document.querySelector('#viewerFixture .code-copy').textContent==='Copied'`);
      assert.equal(await evaluate(`navigator.clipboard.readText()`),fixture);
      check('long-file fixture scrolls on both axes; tabs, CRLF, trailing newline and entity text survive; malicious source/filenames/context stay inert text');

      await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Denied for test');}}})`);
      await click('#viewerFixture .code-copy');await until(`document.querySelector('#viewerFixture .code-copy').textContent==='Retry'`);
      assert(await evaluate(`document.querySelector('#viewerFixture [role="status"]').textContent.includes('Select the code')`));
      assert.equal(await evaluate(`document.querySelector('#viewerFixture code').textContent`),fixture);
      await evaluate(`delete navigator.clipboard;document.querySelector('#viewerFixture').remove()`);
      check('clipboard denial gives accessible manual-copy guidance while leaving source readable');

      await click('[data-view="home"]');await click('#toggleTopics');
      await click('#topicControl input[value="PHP::Arrays and values"]');
      await click('[data-size="10"]');await click('[data-mode="exam"]');await click('#startButton');
      await click('.option-button[data-index="0"]');
      const questionBefore=await evaluate(`document.querySelector('#questionNumber').textContent`);
      assert.equal(await evaluate(`document.querySelector('#questionAction').disabled`),false);
      await click('#questionCode .code-copy');
      await key('Enter','Enter',13);await key(' ','Space',32);
      await until(`document.querySelector('#questionCode .code-copy').textContent==='Copied'`);
      assert.equal(await evaluate(`document.querySelector('#questionNumber').textContent`),questionBefore);
      assert.deepEqual(await evaluate(`({progress:document.querySelector('#scoreMetric').textContent,feedback:document.querySelector('#feedbackPanel').hidden,markers:document.querySelectorAll('#quizView .correct,#quizView .wrong').length})`),{progress:'0 of 1 answered',feedback:true,markers:0});
      await click('#questionAction');await until(`document.querySelector('#resultsView').classList.contains('active')`);
      assert((await evaluate(`document.querySelector('#resultCount').textContent`)).endsWith('/ 1 correct'));
      check('mouse, Enter and Space copying do not submit a selected Exam answer or reveal correctness; normal navigation still records neutral progress');

      await call('Page.navigate',{url:origin+basePath});
      await until(`document.querySelector('#availableCount')?.textContent==='560 available'`);
      await click('[data-view="bank"]');await click('#bankSearch');await call('Input.insertText',{text:'PHP-E26-0193'});
      await until(`document.querySelectorAll('.bank-question').length===1`);await click('.bank-question summary');
      await until(`document.querySelector('.bank-answer').dataset.enriched==='true'`);
      assert.equal(await evaluate(`document.querySelectorAll('.bank-answer > .code-lesson').length`),0);
      assert(await evaluate(`document.querySelector('.bank-prompt').textContent.length>0 && document.querySelector('.bank-answer').textContent.length>0`));
      check('existing question without source still renders its prompt and explanation without an empty code panel');
    } finally {
      await evaluate(`delete navigator.clipboard;navigator.clipboard.writeText(${JSON.stringify(clipboardBefore)})`);
    }
    assert(requests.every(url=>url.startsWith(origin+'/')||url==='about:blank'));
    check('viewer and library load locally under a /quiz/ GitHub Pages-style subpath; no external network requests');
  }
  const browser=await call('Browser.getVersion');
  assert.deepEqual(errors,[]);
  await writeFile(join(output,'browser-results.json'),JSON.stringify({browser:browser.product,phase,siteDirectory:process.env.QUIZ_SITE_DIR||'.',checks,errors},null,2)+'\n');
}finally{ws?.close();child.kill('SIGTERM');await new Promise(resolve=>server.close(resolve));await delay(500);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});}
