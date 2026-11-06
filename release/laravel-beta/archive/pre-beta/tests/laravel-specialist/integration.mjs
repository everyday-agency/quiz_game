import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {loadReview,adapt,UNCHANGED_FILES,REVIEW_KEY} from '../../tools/build-laravel-review.mjs';
import {gradeAnswer} from '../../js/exam.mjs';
import {buildLearningNotes} from '../../js/learning-notes.mjs';
import {QUESTION_BANK as PHP} from '../../js/questions.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const read=p=>JSON.parse(readFileSync(p));
const qs=loadReview(),preservation=read('laravel-specialist/archive/preservation.json');
assert.equal(sha(JSON.stringify(PHP)),preservation.phpSha256);
for(const f of preservation.files)assert.equal(sha(readFileSync(f.path)),f.sha256,f.path);
assert.equal(sha(readFileSync('laravel-specialist/archive/legacy-laravel-600.json')),preservation.legacyArchiveSha256);
assert.deepEqual(qs.map(q=>q.id),Array.from({length:600},(_,i)=>'LAR-S26-'+String(i+1).padStart(4,'0')));
const perm=x=>x.length?x.flatMap((v,i)=>perm(x.filter((_,j)=>i!==j)).map(rest=>[v,...rest])):[[]];
for(const q of qs){
 assert.equal(q.track,'Laravel');assert.equal(q.independentEditorialReview,'pending');
 assert.equal(new Set(q.options).size,4);assert(q.learning.rationales.every(Boolean));
 for(const p of perm([0,1,2,3])){
  const options=p.map(i=>({id:q.optionIds[i],text:q.options[i],sourceText:q.coreOptions[i]}));
  assert.equal(options.filter(o=>gradeAnswer({question:q,selectedOptionId:o.id}).correct).length,1);
  const notes=buildLearningNotes(q,options);assert.equal(notes.alternatives.length,3);
  for(const a of notes.alternatives){const i=p[a.number-1];assert.notEqual(i,q.answer);assert.equal(a.reason,q.learning.rationales[i]);assert.equal(a.option,q.options[i]);}
 }
 assert(!gradeAnswer({question:q,selectedOptionId:'LQ-001'}).correct);
 assert(!gradeAnswer({question:q,selectedOptionId:'PHP-E26-0001@1:choice-1'}).correct);
}
const reordered=[{id:'INSERTION'},...qs.toReversed()];
for(const q of qs)assert.deepEqual(reordered.find(v=>v.id===q.id),q);
const authored=read('laravel-specialist/batches/batch-01.json')[0];
const old=adapt(authored,{lessonIds:[1],coverageComplete:true}),changed=adapt(authored,{lessonIds:null,coverageComplete:false});
assert.equal(old.id,changed.id);assert.deepEqual(old.optionIds,changed.optionIds);assert.equal(old.answer,changed.answer);
const root=resolve('_laravel-review');
const walk=d=>readdirSync(d).flatMap(n=>{const p=resolve(d,n);return statSync(p).isDirectory()?walk(p):[relative(root,p)];});
const expected=[...UNCHANGED_FILES,'index.html','js/app.js','js/progress.mjs','js/questions.mjs','js/laravel-bank.mjs','review.json'].sort();
assert.deepEqual(walk(root).sort(),expected);
for(const f of UNCHANGED_FILES)assert.deepEqual(readFileSync(resolve(root,f)),readFileSync(f));
assert.equal(readFileSync(resolve(root,'js/app.js'),'utf8').replace(' Laravel review answers',' PHP answers'),readFileSync('js/app.js','utf8'));
for(const f of expected.filter(f=>/\.(m?js)$/.test(f))){
 const source=readFileSync(resolve(root,f),'utf8');
 for(const m of source.matchAll(/(?:from\s*|import\s*\()(['"])(\.\.?\/[^'"\s]+)\1/g))assert(expected.includes(relative(root,resolve(root,dirname(f),m[2]))));
}
const deployed=(await import('../../_laravel-review/js/questions.mjs')).QUESTION_BANK;
assert.deepEqual(deployed,qs);
assert(qs.every(q=>!('validation' in q)&&!('probe' in q)&&!('fixtures' in q)));
const {STATS_KEY,HISTORICAL_KEYS,readProgress}=await import('../../_laravel-review/js/progress.mjs');
assert.equal(STATS_KEY,REVIEW_KEY);assert(HISTORICAL_KEYS.includes('underTheHoodPhpEngineerV1Stats'));
const storage=new Map(HISTORICAL_KEYS.map(k=>[k,JSON.stringify({answered:99,correct:80,sessions:3,best:90})]));
const initial=JSON.stringify([...storage]);const api={getItem:k=>storage.get(k)||null};
assert.deepEqual(readProgress(api),{answered:0,correct:0,sessions:0,best:0});assert.equal(JSON.stringify([...storage]),initial);
storage.set(STATS_KEY,JSON.stringify({answered:10,correct:7,sessions:1,best:70}));
assert.deepEqual(readProgress(api),{answered:10,correct:7,sessions:1,best:70});
storage.set(STATS_KEY,'bad');assert.deepEqual(readProgress(api),{answered:0,correct:0,sessions:0,best:0});
assert.deepEqual(readProgress({getItem(){throw Error('blocked');}}),{answered:0,correct:0,sessions:0,best:0});
const result={count:600,permutations:14400,distractorMappings:43200,stableIds:true,curriculumRemapping:true,php620Unchanged:true,legacyArchiveUnchanged:true,progressIsolated:true,artifactFiles:expected.length,unchangedUiFiles:UNCHANGED_FILES.length,independentApproval:'pending'};
writeFileSync('laravel-specialist/evidence/integration.json',JSON.stringify(result,null,2)+'\n');
console.log(result);
