import assert from 'node:assert/strict';
import {laravelPhpFlags} from '../../tools/laravel-php-flags.mjs';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,join,dirname,delimiter} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {probes} from '../../laravel-specialist/authoring/focused-probes.mjs';
import batch4 from '../../laravel-specialist/authoring/batch-04.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const sourceHash=hash(JSON.stringify(batch4));
assert.equal(JSON.parse(readFileSync('laravel-specialist/evidence/batch-4-execution-review.json')).sourceHash,sourceHash);
const q=batch4.find(q=>q.id==='LAR-S26-0314');
const trusted=resolve('laravel-specialist/validation');
const disabled=['exec','system','shell_exec','passthru','popen','proc_open','pcntl_exec','pcntl_fork','fsockopen','pfsockopen','stream_socket_client','stream_socket_server','socket_create','socket_connect','curl_exec','curl_multi_exec','mail','dl','symlink','link'].join(',');
const flags=['-n','-d','date.timezone=UTC','-d','pcre.jit=0','-d','error_reporting=-1','-d','display_errors=stderr','-d','log_errors=0','-d','memory_limit=128M','-d','max_execution_time=5','-d','allow_url_fopen=0','-d','allow_url_include=0','-d','disable_functions='+disabled];
const results=[];
for(const php of process.env.PHP_BINARIES?.split(delimiter)||['/opt/homebrew/bin/php','/Applications/MAMP/bin/php/php8.4.17/bin/php']){
 const temp=mkdtempSync(join(tmpdir(),'laravel-focused-'));
 try{
  for(const f of q.context.files){mkdirSync(dirname(join(temp,f.path)),{recursive:true});writeFileSync(join(temp,f.path),f.source);}
  writeFileSync(join(temp,'runner.php'),'<?php\nrequire '+JSON.stringify(trusted+'/bootstrap.php')+';\n'+probes.outboxSupplement);
  const r=spawnSync(php,[...flags,...laravelPhpFlags(php),'-d','open_basedir='+temp+delimiter+trusted,join(temp,'runner.php')],{cwd:temp,env:{},encoding:'utf8',timeout:10000});
  assert.equal(r.status,0,r.stderr);assert.equal(r.stderr,'');assert.equal(r.stdout,'afterCommit=1/0;atomic=1/1;rollback=0/0;redelivery=2/1');
  results.push({php:execFileSync(php,['-n','-r','echo PHP_VERSION;'],{encoding:'utf8',env:{}}),framework:'13.40.0',id:q.id,revision:q.revision,stdout:r.stdout,exitCode:r.status});
 }finally{rmSync(temp,{recursive:true,force:true});}
}
const references=[
 ['Illuminate/Database/Concerns/ManagesTransactions.php',['$this->getPdo()->commit();','$this->transactionsManager?->commit(']],
 ['Illuminate/Queue/Queue.php',["$this->container->make('db.transactions')->addCallback("]],
 ['Illuminate/Events/Dispatcher.php',['ShouldHandleEventsAfterCommit','createCallbackForListenerRunningAfterCommits']]
].map(([path,tokens])=>{const source=readFileSync(trusted+'/harness/vendor/laravel/framework/src/'+path,'utf8');for(const token of tokens)assert(source.includes(token),path+' '+token);return{path,sha256:hash(source),tokens};});
const report={kind:'supplementary-local-witness',question:q.id,revision:q.revision,sourceHash,probeHash:hash(probes.outboxSupplement),runnerHash:hash(readFileSync('tests/laravel-specialist/focused-technical.mjs')),harnessHash:hash(readFileSync(trusted+'/bootstrap.php')),lockHash:hash(readFileSync(trusted+'/harness/composer.lock')),results,references,limitations:['The shown Redis connection is substituted with a disposable local database queue to observe the actual Laravel afterCommit enqueue path.','A deterministic exception before queue persistence represents loss in that gap; this is not a real process-kill or Redis/broker test.','The redelivery witness uses an in-memory set, not a production consumer transaction. Primary question validation remains documented-contract.']};
writeFileSync('laravel-specialist/evidence/focused-editorial/outbox-supplement.json',JSON.stringify(report,null,2)+'\n');
console.log(results);
