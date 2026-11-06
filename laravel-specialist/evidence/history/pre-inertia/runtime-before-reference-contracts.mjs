import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,resolve,delimiter} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const batch=Number(process.env.BATCH||1),root=resolve('.');
const records=(await import(pathToFileURL(resolve(`laravel-specialist/authoring/batch-${String(batch).padStart(2,'0')}.mjs`)))).default;
const hash=x=>createHash('sha256').update(x).digest('hex');
const sourceHash=hash(JSON.stringify(records));
const approval=JSON.parse(readFileSync(`laravel-specialist/evidence/batch-${batch}-execution-review.json`));
assert.equal(approval.sourceHash,sourceHash,'Inspect changed executable fixtures before allowing execution');
assert.equal(approval.scope,'fresh temporary app; no external services');
const framework=resolve('laravel-specialist/validation/harness/vendor/laravel/framework/src');
const trusted=resolve('laravel-specialist/validation');
const disabled=['exec','system','shell_exec','passthru','popen','proc_open','pcntl_exec','pcntl_fork','fsockopen','pfsockopen','stream_socket_client','stream_socket_server','socket_create','socket_connect','curl_exec','curl_multi_exec','mail','dl','symlink','link'].join(',');
const flags=['-n','-d','date.timezone=UTC','-d','pcre.jit=0','-d','error_reporting=-1','-d','display_errors=stderr','-d','log_errors=0','-d','memory_limit=128M','-d','max_execution_time=5','-d','allow_url_fopen=0','-d','allow_url_include=0','-d',`disable_functions=${disabled}`];
const bins=process.env.PHP_BINARIES?.split(delimiter)||['/opt/homebrew/bin/php','/Applications/MAMP/bin/php/php8.4.17/bin/php'];
const reports=[];
for(const php of bins){
 assert(existsSync(php),`Missing requested runtime: ${php}`);
 const version=execFileSync(php,['-n','-r','echo PHP_VERSION;'],{env:{},encoding:'utf8'});assert(/^8\.[45]\./.test(version));
 const results=[];
 for(const q of records){
  const temp=mkdtempSync(join(tmpdir(),'laravel-specialist-'));
  try{
   const lint=[];
   for(const f of q.context.files){
    assert(!f.path.includes('..')&&!f.path.startsWith('/'));
    mkdirSync(dirname(join(temp,f.path)),{recursive:true});writeFileSync(join(temp,f.path),f.source);
    if(f.kind==='complete-file'){
     const r=spawnSync(php,[...flags,'-l',join(temp,f.path)],{env:{},encoding:'utf8',timeout:5000});
     assert.equal(r.status,0,`${q.id}: ${r.stdout}${r.stderr}`);lint.push(f.path);
    }else if(f.kind==='fragment'){
     assert(f.scope, q.id+': fragment context required');
     const r=spawnSync(php,[...flags,'-l'],{input:'<?php\n'+f.source,env:{},encoding:'utf8',timeout:5000});
     assert.equal(r.status,0,q.id+': fragment lint: '+r.stdout+r.stderr);
     lint.push({path:f.path,wrapper:'PHP opening tag; scope supplied in question metadata'});
    }else assert(['blade','configuration'].includes(f.kind));
   }
   const v=q.validation;
   if(v.kind==='documented-contract'){
    const p=resolve(framework,v.source);assert(p.startsWith(framework+'/'));
    const source=readFileSync(p,'utf8');
    for(const term of v.contains)assert(source.includes(term),`${q.id}: unsupported contract token ${term}`);
    results.push({id:q.id,kind:v.kind,execution:'not-applicable',lint,source:v.source,sourceSha256:hash(source),contract:v.reason,optionReview:q.options.map(o=>({id:o.id,key:o.id===q.correctOptionId,rationale:o.rationale}))});
   }else{
    assert.equal(v.kind,'runtime');
    const probe=v.probe||"require getcwd().'/probe.php';";
    writeFileSync(join(temp,'__runner.php'),`<?php\nrequire ${JSON.stringify(trusted+'/bootstrap.php')};\n${probe}\n`);
    const r=spawnSync(php,[...flags,'-d',`open_basedir=${temp}${delimiter}${trusted}`,join(temp,'__runner.php')],{cwd:temp,env:{},encoding:'utf8',timeout:10000,maxBuffer:1024*1024});
    assert(!r.error,r.error?.message);assert.equal(r.status,0,`${q.id}: ${r.stdout}${r.stderr}`);assert.equal(r.stderr,'',`${q.id}: unexpected diagnostics`);assert.equal(r.stdout,v.stdout,`${q.id}: output mismatch`);
    results.push({id:q.id,kind:v.kind,lint,stdout:r.stdout,exitCode:r.status,correctOptionId:q.correctOptionId,probeSha256:hash(probe)});
   }
  }finally{rmSync(temp,{recursive:true,force:true});}
 }
 reports.push({php:version,framework:'13.40.0',sourceHash,records:results.length,runtime:results.filter(r=>r.kind==='runtime').length,results});
 console.log(`Batch ${batch}, PHP ${version}, Laravel 13.40.0: ${results.length} checked (${reports.at(-1).runtime} real-framework executions).`);
}
writeFileSync(`laravel-specialist/evidence/batch-${batch}-technical.json`,JSON.stringify({batch,sourceHash,harness:{bootstrapSha256:hash(readFileSync('laravel-specialist/validation/bootstrap.php')),runnerSha256:hash(readFileSync('tests/laravel-specialist/runtime.mjs')),composerLockSha256:hash(readFileSync('laravel-specialist/validation/harness/composer.lock'))},createdAt:new Date().toISOString(),reports},null,2)+'\n');
