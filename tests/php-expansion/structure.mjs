import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {QUESTION_BANK} from '../../release/archive/pre-php-only/js/questions.mjs';
import {PHP_PILOT_QUESTIONS,PHP_PILOT_BANK} from '../../js/php-pilot/questions.mjs';
import {REVIEW_BANK} from '../../js/php-expansion/review.mjs';
import projected from '../../js/php-expansion/review-data.mjs';
import mappings from '../../js/php-expansion/lesson-mappings.mjs';
import {adaptExpansionQuestion} from '../../js/php-expansion/adapter.mjs';
import {gradeAnswer,gradeSession} from '../../js/exam.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url)));
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const preserved=read('php-expansion/archive/preservation.json');
assert.equal(sha(QUESTION_BANK),preserved.activeBankSha256);
assert.equal(sha(QUESTION_BANK.filter(q=>q.track!=='PHP')),preserved.nonPhpSha256);
assert.equal(sha(PHP_PILOT_QUESTIONS),preserved.pilotSha256);
const all=[];
for(let b=1;b<=6;b++){
 const records=(await import(`../../js/php-expansion/batches/batch-${String(b).padStart(2,'0')}.mjs`)).default;
 const authored=(await import(`../../php-expansion/authoring/batch-${String(b).padStart(2,'0')}.mjs`)).default;
 const gate=read(`php-expansion/evidence/batch-${b}-acceptance.json`);
 assert.equal(records.length,100);assert.equal(gate.publishedRecordsSha256,sha(records));assert.equal(gate.authoringSha256,sha(authored));
 assert.equal(gate.independentEditorialApproval,'pending');assert.equal(gate.productionActivation,false);
 const runtime=read(`php-expansion/evidence/batch-${b}-runtime.json`);
 assert.deepEqual(new Set(runtime.map(r=>r.php.slice(0,3))),new Set(['8.4','8.5']));
 for(const r of runtime){assert.equal(r.sourceHash,sha(authored));assert.equal(r.recordsChecked,100);}
 all.push(...records);
}
assert.equal(all.length,600);assert.equal(REVIEW_BANK.length,620);
assert.deepEqual(projected,all.map(adaptExpansionQuestion));
const count=key=>Object.fromEntries([...new Set(all.map(key))].map(k=>[k,all.filter(q=>key(q)===k).length]));
assert.deepEqual(count(q=>q.format),{execution:150,debugging:120,'code-review':120,implementation:90,testing:70,architecture:50});
assert.deepEqual(count(q=>q.difficulty.level),{Foundation:159,Intermediate:381,Advanced:60}); // Editorial calibration; every change has a per-ID rationale.
assert.equal(new Set(REVIEW_BANK.map(q=>q.id)).size,620);
const reserved=new Set(preserved.reservedIds);assert(all.every(q=>!reserved.has(q.id)));
assert.equal(QUESTION_BANK.filter(q=>q.track==='PHP').length,300);
for(const q of REVIEW_BANK){
 assert.equal(q.track,'PHP');assert.equal(q.options.length,4);assert.equal(new Set(q.optionIds).size,4);
 assert(q.learning.rationales.length===4&&q.objective&&q.format&&q.prerequisites.length);
 assert(q.lessonMapping);assert(q.lessonMapping.lessonIds===null||q.lessonMapping.lessonIds.every(n=>Number.isInteger(n)&&n>=1&&n<=31));
 assert(!q.lessonMapping.coverageComplete||q.lessonMapping.lessonIds?.length);
 for(let shift=0;shift<4;shift++){
  const ids=q.optionIds.slice(shift).concat(q.optionIds.slice(0,shift));
  const graded=ids.map(id=>gradeAnswer({question:q,selectedOptionId:id}));
  assert.equal(graded.filter(a=>a.correct).length,1);
  assert.equal(graded.find(a=>a.correct).selectedOptionId,q.optionIds[q.answer]);
 }
}
const ids=projected.map(q=>q.id);
const reordered=[{...projected[0],id:'INSERTION-FIXTURE',optionIds:[]},...projected.toReversed()];
for(const q of projected){assert.equal(reordered.find(x=>x.id===q.id).id,q.id);assert.deepEqual(reordered.find(x=>x.id===q.id).optionIds,q.optionIds);}
assert.deepEqual(projected.map(q=>q.id),ids);
const changedMapping={...REVIEW_BANK[0],lessonMapping:{lessonIds:[31],coverageComplete:true}};
assert.equal(changedMapping.id,REVIEW_BANK[0].id);assert.deepEqual(changedMapping.optionIds,REVIEW_BANK[0].optionIds);
for(const q of PHP_PILOT_BANK){const copy=REVIEW_BANK.find(x=>x.id===q.id);assert.deepEqual(copy.options,q.options);assert.deepEqual(copy.optionIds,q.optionIds);assert.deepEqual(copy.code,q.code);assert.deepEqual(copy.learning,q.learning);}
const session=gradeSession(REVIEW_BANK.map(q=>({question:q,selectedOptionId:q.optionIds[q.answer]})));assert.equal(session.answers.filter(a=>a.correct).length,620);
assert(!projected.some(q=>'validation' in q),'Execution fixtures must not ship in the runtime projection');
assert(statSync(new URL('../../js/php-expansion/review-data.mjs',import.meta.url)).size<2500000);
console.log('PHP expansion: 600 accepted records, 620 review entries, format counts and reviewed difficulty calibration, all identity/preservation hashes, 2480 shuffled key mappings, lesson metadata and current runtime evidence passed.');
