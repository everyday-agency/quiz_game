import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {QUESTION_BANK, SUBJECTS, TRACKS} from '../../js/questions.mjs';
import PHP from '../../js/php-bank.mjs';
import {adapt} from '../../tools/build-laravel-review.mjs';
import {gradeAnswer} from '../../js/exam.mjs';
import {buildLearningNotes} from '../../js/learning-notes.mjs';
import {STATS_KEY,LARAVEL_STATS_KEY,HISTORICAL_KEYS,readProgress} from '../../js/progress.mjs';
const read=p=>JSON.parse(readFileSync(p)),hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const baseline=read('release/laravel-beta/archive/pre-beta/laravel-600.json');
const raw=Array.from({length:6},(_,i)=>read('laravel-specialist/batches/batch-'+String(i+1).padStart(2,'0')+'.json')).flat();
const mapping=read('laravel-specialist/curriculum-mappings.json').questions;
const manifest=read('release/laravel-beta/manifest.json'),oldPhp=read('release/manifest.json');
assert.deepEqual(TRACKS,['PHP','Laravel']);assert.equal(SUBJECTS.length,2);
assert.equal(QUESTION_BANK.length,1220);assert.equal(new Set(QUESTION_BANK.map(q=>q.id)).size,1220);
assert.equal(PHP.length,620);assert.equal(hash(PHP),oldPhp.bankSha256);
assert.equal(hash(QUESTION_BANK),manifest.bankSha256);
assert.equal(SUBJECTS[0].statsKey,STATS_KEY);assert.equal(SUBJECTS[1].statsKey,LARAVEL_STATS_KEY);
assert.equal(STATS_KEY,'underTheHoodPhpEngineerV1Stats');
assert.equal(LARAVEL_STATS_KEY,'underTheHoodLaravelSpecialistBetaV1Stats');
assert(!HISTORICAL_KEYS.includes(LARAVEL_STATS_KEY));assert.notEqual(STATS_KEY,LARAVEL_STATS_KEY);
for(const q of raw){
 const previous=baseline.find(p=>p.id===q.id);
 if(q.id!=='LAR-S26-0437'){assert.deepEqual(q,previous,q.id+' changed outside scope');continue;}
 assert.equal(q.revision,previous.revision+1);
 assert.deepEqual(q.prerequisites,['HTTP transport failures; HTTP response status handling']);
 assert.deepEqual({...q,revision:previous.revision,prerequisites:previous.prerequisites},previous);
 assert.deepEqual(read('laravel-specialist/archive/revisions/'+q.id+'-r'+previous.revision+'.json'),previous);
}
const laravel=QUESTION_BANK.filter(q=>q.track==='Laravel');
assert.deepEqual(laravel.map(q=>q.id),Array.from({length:600},(_,i)=>'LAR-S26-'+String(i+1).padStart(4,'0')));
assert.deepEqual(laravel,raw.map(q=>adapt(q,mapping[q.id],'laravel-specialist-beta-v1')));
const perm=x=>x.length?x.flatMap((v,i)=>perm(x.filter((_,j)=>i!==j)).map(rest=>[v,...rest])):[[]];
for(const q of QUESTION_BANK){
 assert.equal(hash(q),manifest.questions.find(item=>item.id===q.id).sha256);
 assert.equal(new Set(q.options).size,4);assert.equal(new Set(q.optionIds).size,4);
 for(const order of perm([0,1,2,3])){
  const options=order.map(i=>({id:q.optionIds[i],text:q.options[i],sourceText:q.coreOptions[i]}));
  assert.equal(options.filter(o=>gradeAnswer({question:q,selectedOptionId:o.id}).correct).length,1);
  const notes=buildLearningNotes(q,options);assert.equal(notes.alternatives.length,3);
  for(const a of notes.alternatives){const i=order[a.number-1];assert.notEqual(i,q.answer);assert.equal(a.reason,q.learning.rationales[i]);assert.equal(a.option,q.options[i]);}
 }
 assert(!gradeAnswer({question:q,selectedOptionId:'LQ-001'}).correct);
}
const reordered=[{id:'INSERTION'},...QUESTION_BANK.toReversed()];
for(const q of QUESTION_BANK)assert.deepEqual(reordered.find(v=>v.id===q.id),q);
const authored=raw[0],old=adapt(authored,{lessonIds:[1]}),remapped=adapt(authored,{lessonIds:null});
assert.equal(old.id,remapped.id);assert.deepEqual(old.optionIds,remapped.optionIds);assert.equal(old.answer,remapped.answer);
const storage=new Map(HISTORICAL_KEYS.map(k=>[k,JSON.stringify({answered:999,correct:800,sessions:3,best:100})]));
const phpStats={answered:620,correct:500,sessions:10,best:90},empty={answered:0,correct:0,sessions:0,best:0};
storage.set(STATS_KEY,JSON.stringify(phpStats));
const before=JSON.stringify([...storage]),api={getItem:k=>storage.get(k)||null};
assert.deepEqual(readProgress(api),phpStats);assert.deepEqual(readProgress(api,LARAVEL_STATS_KEY),empty);assert.equal(JSON.stringify([...storage]),before);
storage.set(LARAVEL_STATS_KEY,JSON.stringify({answered:10,correct:7,sessions:1,best:70}));
assert.deepEqual(readProgress(api,LARAVEL_STATS_KEY),{answered:10,correct:7,sessions:1,best:70});
assert.deepEqual(readProgress(api),phpStats);
storage.set(LARAVEL_STATS_KEY,'bad');assert.deepEqual(readProgress(api,LARAVEL_STATS_KEY),empty);
assert.deepEqual(readProgress({getItem(){throw Error('blocked');}},LARAVEL_STATS_KEY),empty);
const result={count:1220,php:620,laravelBeta:600,permutations:29280,distractorMappings:87840,onlyChangedQuestion:'LAR-S26-0437',otherLaravelUnchanged:599,php620Unchanged:true,stableIds:true,curriculumRemapping:true,progressIsolated:true};
writeFileSync('release/laravel-beta/evidence/integration.json',JSON.stringify(result,null,2)+'\n');console.log(result);
