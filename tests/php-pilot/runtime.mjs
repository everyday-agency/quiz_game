import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,delimiter} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {PHP_PILOT_QUESTIONS as questions} from '../../js/php-pilot/questions.mjs';
import {OUTPUTS,PATCHES,TEST_CASES,executableFiles,testCaseFiles} from './fixtures.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const manifest=JSON.parse(readFileSync(new URL('./execution-allowlist.json',import.meta.url)));
assert.equal(hash(readFileSync(new URL('./fixtures.mjs',import.meta.url))),manifest.fixtureSha256,'Unreviewed fixture change');
assert.equal(manifest.questions.length,20);
assert.deepEqual(new Set(manifest.questions.map(q=>q.id)),new Set(questions.map(q=>q.id)));
for(const q of questions)assert.equal(hash(JSON.stringify(q)),manifest.questions.find(entry=>entry.id===q.id)?.sha256,`Unreviewed question or executable change: ${q.id}`);
const primary=process.env.PHP_BIN || execFileSync('/bin/sh',['-c','command -v php'],{encoding:'utf8'}).trim();
const runtimes=[...new Set((process.env.PHP_BINARIES?.split(delimiter)||[primary,'/Applications/MAMP/bin/php/php8.4.17/bin/php']).filter(existsSync))];
assert(runtimes.length,'PHP 8.4/8.5 is required');
const disabled=['exec','system','shell_exec','passthru','popen','proc_open','pcntl_exec','fsockopen','pfsockopen','stream_socket_client','stream_socket_server','stream_socket_accept','socket_create','socket_connect','curl_exec','curl_multi_exec','mail','getenv','putenv','ini_set','ini_alter','dl','symlink','link'].join(',');
const flags=['-n','-d','pcre.jit=0','-d','error_reporting=-1','-d','display_errors=stderr','-d','log_errors=0','-d','memory_limit=32M','-d','max_execution_time=2','-d','allow_url_fopen=0','-d','allow_url_include=0','-d',`disable_functions=${disabled}`];
const report=[];
const beforeFormatting = JSON.parse(readFileSync(new URL('../../php-pilot/formatting/before/runtime-results.json', import.meta.url)));
for(const php of runtimes){
  const version=execFileSync(php,['-n','-r','echo PHP_VERSION;'],{encoding:'utf8'});
  assert(/^8\.[45]\./.test(version),`Expected PHP 8.4/8.5, got ${version}`);
  const linted=new Map(); let executions=0;
  const run=(files,expectedError)=>{
    const dir=mkdtempSync(join(tmpdir(),'php-quality-pilot-'));
    try {
      for(const file of files){
        assert(file.kind==='complete-file');
        assert(/^[a-zA-Z0-9_/-]+\.php$/.test(file.path)&&!file.path.includes('..')&&!file.path.startsWith('/'));
        mkdirSync(dirname(join(dir,file.path)),{recursive:true});writeFileSync(join(dir,file.path),file.source);
        const sha=hash(file.source);
        if(!linted.has(sha)){
          const lint=spawnSync(php,[...flags,'-l'],{input:file.source,env:{},encoding:'utf8',timeout:5000});
          assert(!lint.error,lint.error?.message);assert.notEqual(lint.status,null);
          if(lint.status!==0){assert(expectedError,lint.stdout+lint.stderr);assert((lint.stdout+lint.stderr).toLowerCase().includes(expectedError.toLowerCase()),lint.stdout+lint.stderr);}
          linted.set(sha,{status:lint.status});
        }
      }
      executions++;
      const result=spawnSync(php,[...flags,'-d',`open_basedir=${dir}`,join(dir,'main.php')],{cwd:dir,env:{},encoding:'utf8',timeout:5000,maxBuffer:1024*1024});
      assert(!result.error,result.error?.message);assert.notEqual(result.status,null,'Fixture timed out or was terminated');
      if(expectedError){assert.notEqual(result.status,0);assert(result.stderr.toLowerCase().includes(expectedError.toLowerCase()),result.stderr);}
      else {assert.equal(result.status,0,result.stdout+result.stderr);assert.equal(result.stderr,'');}
      return {exitCode:result.status,stdout:result.stdout,expectedError:expectedError||null};
    }finally{rmSync(dir,{recursive:true,force:true});}
  };
  const results=[];
  for(const question of questions){
    const output=OUTPUTS[question.id],patch=PATCHES[question.id],test=TEST_CASES[question.id];
    assert.equal([output,patch,test].filter(Boolean).length,1,`Missing/duplicate validation: ${question.id}`);
    const observations=[];let supported;
    if(output){
      const actual=run(executableFiles(question));
      assert.equal(actual.stdout,output.stdout,question.id);
      supported=[output.key];observations.push(actual);
    }else if(patch){
      supported=[];
      for(const option of question.options){
        const actual=run(executableFiles(question,option),patch.errors?.[option.id]);
        const meetsRequirement=actual.exitCode===0&&actual.stdout===patch.stdout;
        if(meetsRequirement)supported.push(option.id);
        observations.push({option:option.id,meetsRequirement,...actual});
      }
      assert.deepEqual(supported,[patch.key],`${question.id}: candidates do not yield exactly one valid choice`);
    }else{
      supported=[];
      for(const sample of test.cases){
        const original=run(testCaseFiles(question,sample));
        const fixed=run(testCaseFiles(question,sample,true));
        const expected=JSON.stringify(sample.expected);
        assert.equal(fixed.stdout,expected,`${question.id}: proposed fix fails ${sample.option}`);
        const exposesDefect=original.stdout!==expected;
        if(exposesDefect)supported.push(sample.option);
        observations.push({option:sample.option,exposesDefect,expected,original,fixed});
      }
      assert.deepEqual(supported,[test.key],`${question.id}: exactly one test must expose the stated defect`);
    }
    assert.deepEqual(supported,[question.correctOptionId],`${question.id}: key contradicts observed behavior`);
    results.push({id:question.id,supportedOption:question.correctOptionId,observations});
  }
  // Confirm the review diagnoses by exercising the relevant corrected variants.
  const extra=[];
  for(const [id,from,to,stdout] of [
    ['PHP-PILOT-003','$count','$limit','3|3'],
    ['PHP-PILOT-010',"return 'closed';",'/* cleanup without returning */','caught'],
    ['PHP-PILOT-019','new RuntimeException','new \\RuntimeException','RuntimeException'],
  ]){
    const files=executableFiles(questions.find(q=>q.id===id)).map(file=>({...file,source:file.source.replaceAll(from,to)}));
    const actual=run(files);assert.equal(actual.stdout,stdout);extra.push({id,...actual});
  }
  const previous = beforeFormatting.find(run => run.php.split('.').slice(0, 2).join('.') === version.split('.').slice(0, 2).join('.'));
  assert(previous, `Missing pre-formatting runtime evidence for ${version}`);
  assert.deepEqual(results, previous.results, 'Formatting changed a keyed result or candidate behavior');
  assert.deepEqual(extra, previous.repairChecks, 'Formatting changed a repaired behavior');
  report.push({php:version,questionCount:results.length,distinctLintedSources:linted.size,executions,results,repairChecks:extra,preFormattingBehaviorPreserved:true});
  console.log(`✓ New PHP pilot ${version}: 20 keyed answers; ${linted.size} sources/variants linted; ${executions} isolated executions`);
}
if(process.env.WRITE_TEST_REPORT==='1')writeFileSync(new URL('../../php-pilot/runtime-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
