import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import QUESTION_BANK from '../js/php-bank.mjs';
import {tokenizerFlags} from './php-tokenizer.mjs';
const batch=Number(process.env.BATCH||1);
const qs=(await import(`../laravel-specialist/authoring/batch-${String(batch).padStart(2,'0')}.mjs`)).default;
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex'),sha=v=>hash(JSON.stringify(v));
const preservation=read('laravel-specialist/archive/preservation.json');
assert.equal(QUESTION_BANK.length,620);
assert.equal(sha(QUESTION_BANK),preservation.phpSha256);
for(const f of preservation.files){
 const betaFiles=['js/questions.mjs','js/progress.mjs','js/app.js','index.html','styles.css','tools/build-site.mjs'];
 const path=betaFiles.includes(f.path)?'release/laravel-beta/archive/pre-beta/'+f.path:f.path;
 assert.equal(hash(readFileSync(path)),f.sha256,'Preserved pre-beta baseline: '+path);
}
assert.equal(hash(readFileSync('laravel-specialist/archive/legacy-laravel-600.json')),preservation.legacyArchiveSha256);
assert.equal(qs.length,100);
const ids=new Set(),objectives=new Set(),prior=[];
for(let n=1;n<batch;n++){
 const p=`laravel-specialist/batches/batch-${String(n).padStart(2,'0')}.json`;
 assert(existsSync(p),'Earlier batches must be accepted before progressing');
 prior.push(...read(p));
}
const sourceList=qs.flatMap(q=>q.context.files.filter(f=>['complete-file','fragment'].includes(f.kind)).map(f=>f.kind==='fragment'?'<?php\n'+f.source:f.source));
const php=process.env.PHP_BIN||'php';
const tokenized=spawnSync(php,['-n',...tokenizerFlags(php),'-r',String.raw`
$results = [];
foreach (json_decode(stream_get_contents(STDIN), true) as $source) {
    $code = '';
    foreach (token_get_all($source) as $token) {
        if (!is_array($token)) { $code .= $token; continue; }
        $hidden = in_array($token[0], [T_CONSTANT_ENCAPSED_STRING, T_ENCAPSED_AND_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true);
        $code .= $hidden ? preg_replace('/[^\n]/', ' ', $token[1]) : $token[1];
    }
    $results[] = $code;
}
echo json_encode($results);
`],{input:JSON.stringify(sourceList),encoding:'utf8',timeout:10000});
assert.equal(tokenized.status,0,tokenized.stderr);
const layouts=JSON.parse(tokenized.stdout);let i=0;
for(const q of [...prior,...qs]){
 assert(/^LAR-S26-\d{4}$/.test(q.id));assert(!ids.has(q.id));ids.add(q.id);
 assert(!objectives.has(q.objective.id));objectives.add(q.objective.id);
 assert.equal(q.technology,'laravel');assert.equal(q.collectionId,'laravel-specialist-review-v1');
 assert(q.revision>=1&&q.responseType==='single-choice');
 assert(['execution','debugging','code-review','implementation','testing','architecture'].includes(q.format));
 assert(['Foundation','Intermediate','Advanced'].includes(q.difficulty.level));
 assert(q.stem.length>=15&&(q.stem.length>35||q.context.files.length>0)&&q.difficulty.rationale&&q.prerequisites.length&&q.references.length,q.id+': missing self-contained task or metadata');
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);
 assert.equal(q.options.filter(o=>o.id===q.correctOptionId).length,1);
 assert(q.options.every(o=>o.rationale.length>25));
 assert.equal(q.validation.independentEditorialReview,'pending');
 assert(q.curriculum.lessonIds===null||q.curriculum.lessonIds.every(n=>Number.isInteger(n)&&n>=1&&n<=8));
 if(q.prerequisites.some(p=>/\bEloquent\b/.test(p)))assert.equal(q.curriculum.lessonIds,null,'Eloquent is not a completed lesson');
 assert(!/suppress every failure|replace (?:the )?(?:implementation|code) with a comment|reasoning check:/i.test(q.stem+' '+q.options.map(o=>o.text).join(' ')));
 if(prior.includes(q))continue;
 assert(Number(q.id.slice(-4))>(batch-1)*100&&Number(q.id.slice(-4))<=batch*100);
 for(const f of q.context.files){
  assert(!/\t/.test(f.source),'Indentation tabs: '+q.id);
  if(!['complete-file','fragment'].includes(f.kind))continue;
  const layout=layouts[i++];
  if(f.kind==='complete-file')assert(f.source.startsWith('<?php\n'));
  assert(!/\b(?:class|interface|trait) (?!implements\b|extends\b)[a-zA-Z_]\w*[^\n]*\{/.test(layout),'Class brace layout: '+q.id);
  assert(!/\{[^\n{}]+;[^\n{}]*\}/.test(layout),'Compressed block: '+q.id);
  for(const line of f.source.split('\n'))assert((line.match(/^ +/)?.[0].length||0)%4===0,'Four-space indentation: '+q.id);
 }
}
const technical=read(`laravel-specialist/evidence/batch-${batch}-technical.json`);
assert.equal(technical.sourceHash,sha(qs),'Technical evidence is stale');
for(const [key,path] of Object.entries({bootstrapSha256:'laravel-specialist/validation/bootstrap.php',runnerSha256:'tests/laravel-specialist/runtime.mjs',composerLockSha256:'laravel-specialist/validation/harness/composer.lock'}))assert.equal(technical.harness[key],hash(readFileSync(path)),'Harness evidence is stale');
assert.deepEqual(new Set(technical.reports.map(r=>r.php.slice(0,3))),new Set((process.env.REQUIRED_PHP_VERSIONS||'8.4,8.5').split(',')));
for(const r of technical.reports){assert.equal(r.records,100);assert.deepEqual(r.results.map(r=>r.id),qs.map(q=>q.id));}
const stop=new Set('a an the and or of to in for is are on from which what this that with has have its does return returns printed code request route laravel php should must how after before only no not'.split(' '));
const normalize=s=>s.toLowerCase().replace(/\$[a-z_]\w*/g,'variable').replace(/\b\d+\b/g,'number').replace(/[^a-z0-9]+/g,' ').trim();
const tokens=s=>new Set(normalize(s).split(' ').filter(w=>w.length>2&&!stop.has(w)));
const sim=(a,b)=>{const n=[...a].filter(w=>b.has(w)).length;return n/(a.size+b.size-n||1);};
const candidates=[],seen=new Set();
const legacy=read('laravel-specialist/archive/legacy-laravel-600.json');
const legacyQuestions=(legacy.questions||legacy).map(x=>x.question||x);
const corpus=[...prior.map(q=>({id:q.id,kind:'accepted',text:q.objective.text+' '+q.stem})),...legacyQuestions.map(q=>({id:q.id,kind:'legacy',text:q.prompt+' '+(q.objective||q.topic)}))];
for(const q of qs){
 const whole=normalize(JSON.stringify([q.stem,q.context,q.options.map(o=>o.text)]));assert(!seen.has(whole),'Duplicate full question');seen.add(whole);
 const t=tokens(q.objective.text+' '+q.stem);
 for(const other of corpus){const similarity=sim(t,tokens(other.text));if(similarity>=0.19)candidates.push({a:q.id,b:other.id,kind:other.kind,similarity:+similarity.toFixed(3)});}
 corpus.push({id:q.id,kind:'current',text:q.objective.text+' '+q.stem});
}
const counts=f=>Object.fromEntries([...new Set(qs.map(f))].map(k=>[k,qs.filter(q=>f(q)===k).length]));
const signals=qs.map(q=>{const key=q.options.find(o=>o.id===q.correctOptionId),others=q.options.filter(o=>o!==key);return {id:q.id,uniqueLongest:others.every(o=>key.text.length>o.text.length),uniqueShortest:others.every(o=>key.text.length<o.text.length),ratio:+(key.text.length/Math.max(...others.map(o=>o.text.length))).toFixed(2)};});
const report={batch,count:100,sourceHash:sha(qs),formats:counts(q=>q.format),difficulty:counts(q=>q.difficulty.level),topics:counts(q=>q.topic),mapped:qs.filter(q=>q.curriculum.lessonIds).length,unmapped:qs.filter(q=>!q.curriculum.lessonIds).length,keyPositions:counts(q=>q.options.findIndex(o=>o.id===q.correctOptionId)+1),wording:{uniqueLongest:signals.filter(s=>s.uniqueLongest).length,uniqueShortest:signals.filter(s=>s.uniqueShortest).length,outliers:signals.filter(s=>s.ratio>1.4)},duplicateCandidates:candidates.sort((a,b)=>b.similarity-a.similarity),limitations:'Lexical signals support human review; they do not prove semantic uniqueness or distractor quality.',preservation:'PHP 620 unchanged; pre-beta application snapshot intact; current two-subject integration checked separately',independentApproval:'pending'};
writeFileSync(`laravel-specialist/evidence/batch-${batch}-checks.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,duplicateCandidates:report.duplicateCandidates.length},null,2));
