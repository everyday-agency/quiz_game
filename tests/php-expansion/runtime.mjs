import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,delimiter} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL,fileURLToPath} from 'node:url';

const batch=Number(process.env.BATCH||1);
assert(Number.isInteger(batch)&&batch>=1&&batch<=6);
const root=fileURLToPath(new URL('../../',import.meta.url));
const records=(await import(pathToFileURL(join(root,`php-expansion/authoring/batch-${String(batch).padStart(2,'0')}.mjs`)))).default;
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const approved=JSON.parse(readFileSync(join(root,`php-expansion/evidence/batch-${batch}-execution-review.json`)));
assert.equal(approved.sourceHash,sha(records),'Source must be inspected and reapproved before execution');
assert.equal(approved.review,'author inspected; isolated fixtures only');
const primary=process.env.PHP_BIN||execFileSync('/bin/sh',['-c','command -v php'],{encoding:'utf8'}).trim();
const runtimes=[...new Set((process.env.PHP_BINARIES?.split(delimiter)||[primary,'/Applications/MAMP/bin/php/php8.4.17/bin/php']).filter(existsSync))];
const disabled=['exec','system','shell_exec','passthru','popen','proc_open','pcntl_exec','fsockopen','pfsockopen','stream_socket_client','stream_socket_server','stream_socket_accept','socket_create','socket_connect','curl_exec','curl_multi_exec','mail','getenv','putenv','ini_set','ini_alter','dl','symlink','link'].join(',');
const flags=['-n','-d','pcre.jit=0','-d','date.timezone=UTC','-d','serialize_precision=-1','-d','error_reporting=-1','-d','display_errors=stderr','-d','log_errors=0','-d','memory_limit=64M','-d','max_execution_time=2','-d','allow_url_fopen=0','-d','allow_url_include=0','-d',`disable_functions=${disabled}`];
const reports=[];
for(const php of runtimes){
 const version=execFileSync(php,['-n','-r','echo PHP_VERSION;'],{encoding:'utf8'});assert(/^8\.[45]\./.test(version));
 // Keep -n isolation while supporting trusted shared extensions on CI builds.
 // Only standard modules required by executable fixtures may be loaded.
 const compiled=new Set(JSON.parse(execFileSync(php,['-n','-r','echo json_encode(get_loaded_extensions());'],{encoding:'utf8'})).map(name=>name.toLowerCase()));
 const required=new Set(records.filter(q=>q.context.files.length).flatMap(q=>q.runtime.extensions).map(name=>name.toLowerCase()));
 const extensionFlags=[];
 const extensionDir=execFileSync(php,['-r','echo ini_get("extension_dir");'],{encoding:'utf8'}).trim();
 for(const name of ['ctype','pdo','pdo_sqlite','mbstring','openssl','intl','bcmath','zip','sodium']){
  if(!required.has(name)||compiled.has(name))continue;
  const module=join(extensionDir,name+'.so');assert(existsSync(module),`Required trusted extension unavailable: ${name}`);
  extensionFlags.push('-d',`extension=${module}`);
 }
 const results=[];let executions=0,linted=0,label='',expectedLint={},questionFlags=[];
 const run=(files,expectedError)=>{
  const diagnostic=typeof expectedError==='string'?{message:expectedError,exitCode:null}:expectedError;
  const temp=mkdtempSync(join(tmpdir(),'php-expansion-'));
  try{
   for(const file of files){
    assert(file.kind==='complete-file');assert(/^[a-zA-Z0-9_/-]+\.php$/.test(file.path)&&!file.path.includes('..')&&!file.path.startsWith('/'));
    mkdirSync(dirname(join(temp,file.path)),{recursive:true});writeFileSync(join(temp,file.path),file.source);
    const lint=spawnSync(php,[...flags,...extensionFlags,...questionFlags,'-l'],{input:file.source,env:{},encoding:'utf8',timeout:5000});
    assert(!lint.error);
    if(lint.status!==0){const message=expectedLint[file.path]||diagnostic?.message;assert(message&&(lint.stdout+lint.stderr).includes(message),`${label}: ${lint.stdout}${lint.stderr}`);}
    if(expectedLint[file.path])assert.notEqual(lint.status,0,`${label}: expected syntax defect in ${file.path}`);
    linted++;
   }
   const executed=spawnSync(php,[...flags,...extensionFlags,...questionFlags,'-d',`open_basedir=${temp}`,join(temp,'main.php')],{cwd:temp,env:{},encoding:'utf8',timeout:5000,maxBuffer:1024*1024});executions++;
   assert(!executed.error,executed.error?.message);assert.notEqual(executed.status,null);
   if(diagnostic){if(diagnostic.exitCode===null)assert.notEqual(executed.status,0,`${label}: expected ${diagnostic.message}; got ${executed.stdout}`);else assert.equal(executed.status,diagnostic.exitCode,label);assert(executed.stderr.includes(diagnostic.message),`${label}: ${executed.stderr}`);}
   else{assert.equal(executed.status,0,executed.stdout+executed.stderr);assert.equal(executed.stderr,'');}
   return {stdout:executed.stdout,exitCode:executed.status,expectedError:expectedError||null};
  }finally{rmSync(temp,{recursive:true,force:true});}
 };
 const patched=(q,text)=>{
  let matches=0;
  const files=q.context.files.map(f=>{if(f.source.includes(q.validation.marker)){matches++;return {...f,source:f.source.replace(q.validation.marker,text)};}return {...f};});
  assert.equal(matches,1,`${q.id}: patch target must occur in exactly one file`);return files;
 };
 for(const q of records){
  label=q.id;
  const v=q.validation;const observations=[];
  expectedLint=v.lintErrors||{};
  questionFlags=[];
  for(const [key,value] of Object.entries(v.ini||{})){assert(['zend.assertions','zend.exception_ignore_args','short_open_tag'].includes(key),'Only reviewed non-I/O fixture settings may vary');assert(['-1','0','1'].includes(String(value)));questionFlags.push('-d',`${key}=${value}`);}
  if(v.kind==='output'){
   const actual=run(q.context.files);assert.equal(actual.stdout,v.stdout,q.id);
   assert.equal(q.options.find(o=>o.id===q.correctOptionId).text,v.stdout,`${q.id}: observed answer mapping`);
   assert.equal(q.options.filter(o=>o.text===v.stdout).length,1);
   observations.push(actual);
  }else if(v.kind==='patch'){
   if(v.original){const actual=run(q.context.files,v.original.error);assert.equal(actual.stdout,v.original.stdout,q.id+': original defect');observations.push({original:true,...actual});}
   const valid=[];
   for(const option of q.options){
    label=`${q.id}/${option.id}`;
    const actual=run(patched(q,v.candidates?.[option.id]||option.text),v.errors?.[option.id]);
    const meets=actual.exitCode===0&&!actual.expectedError&&actual.stdout===v.stdout;if(meets)valid.push(option.id);observations.push({option:option.id,meets,...actual});
   }
   assert.deepEqual(valid,[q.correctOptionId],`${q.id}: exactly one candidate must satisfy all cases`);
  }else if(v.kind==='tests'){
   const exposes=[];
   for(const sample of v.cases){
    const append=files=>files.map(f=>f.path==='main.php'?{...f,source:f.source+'\n'+sample.probe+'\n'}:f);
    const original=run(append(q.context.files));
    const repaired=run(append(patched(q,v.repair)));
    assert.equal(repaired.stdout,sample.expected,`${q.id}: test expectation must hold for the repaired implementation`);
    const fails=original.stdout!==sample.expected;if(fails)exposes.push(sample.option);
    observations.push({option:sample.option,exposes: fails,expected:sample.expected,original,repaired});
   }
   assert.deepEqual(exposes,[q.correctOptionId],`${q.id}: exactly one supplied test must expose the defect`);
  }else if(v.kind==='contract'){
   const actual=run(q.context.files,v.error);assert.equal(actual.stdout,v.stdout,q.id);observations.push(actual);
   assert(v.keyEvidence&&v.counterexamples&&Object.keys(v.counterexamples).length===3,`${q.id}: contract needs a specific witness and each alternative's counterexample`);
   for(const contrast of v.contrasts||[]){
    label=`${q.id}/${contrast.name}`;
    const variant={...q,validation:{...v,marker:contrast.marker}};
    const result=run(patched(variant,contrast.replacement),contrast.error);
    assert.equal(result.stdout,contrast.stdout,label);
    observations.push({contrast:contrast.name,...result});
   }
  }else if(v.kind==='document-review'){
   assert.equal(q.context.files.length,0);
   assert(v.rule&&v.optionAudit&&Object.keys(v.optionAudit).length===4,`${q.id}: document review must justify all four alternatives`);
   observations.push({execution:'not-applicable',rule:v.rule,optionAudit:v.optionAudit});
  }else throw new Error(`${q.id}: unknown validation kind ${v.kind}`);
  results.push({id:q.id,kind:v.kind,key:q.correctOptionId,observations});
 }
 reports.push({batch,sourceHash:sha(records),php:version,recordsChecked:records.length,executions,linted,results});
 console.log(`Batch ${batch}, PHP ${version}: ${records.length} drafts checked, ${linted} lints, ${executions} isolated executions. Batch acceptance remains separate.`);
}
writeFileSync(join(root,`php-expansion/evidence/batch-${batch}-runtime.json`),JSON.stringify(reports,null,2)+'\n');
