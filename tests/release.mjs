import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {QUESTION_BANK as ACTIVE_BANK,TRACKS,DIFFICULTIES} from '../js/questions.mjs';
import {REVIEW_BANK} from '../js/php-expansion/review.mjs';
import {buildLearningNotes} from '../js/learning-notes.mjs';
import {gradeAnswer} from '../js/exam.mjs';
import {STATS_KEY,HISTORICAL_KEYS,readProgress} from '../js/progress.mjs';
const QUESTION_BANK = ACTIVE_BANK.filter(q=>q.track==='PHP');
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const sha=value=>createHash('sha256').update(value).digest('hex');
const manifest=JSON.parse(read('release/manifest.json'));
const archive=JSON.parse(read('release/archive/pre-php-only/manifest.json'));
for(const f of archive.files)assert.equal(sha(read('release/archive/pre-php-only/'+f.path)),f.sha256,f.path);
assert.equal(archive.activeCount,2500);
assert.deepEqual(archive.counts,{Laravel:600,PHP:300,TypeScript:600,React:300,MySQL:400,'Google Analytics':300});
assert.deepEqual(TRACKS,['PHP','Laravel']);assert.equal(ACTIVE_BANK.length,1220);assert.deepEqual(DIFFICULTIES,['Foundation','Intermediate','Advanced']);
assert.equal(QUESTION_BANK.length,620);assert.equal(new Set(QUESTION_BANK.map(q=>q.id)).size,620);
assert.deepEqual(QUESTION_BANK,JSON.parse(JSON.stringify(REVIEW_BANK)),'The release must preserve the reviewed JSON content exactly');
assert.equal(sha(JSON.stringify(QUESTION_BANK)),manifest.bankSha256);
const expected=[...Array.from({length:600},(_,i)=>`PHP-E26-${String(i+1).padStart(4,'0')}`),...Array.from({length:20},(_,i)=>`PHP-PILOT-${String(i+1).padStart(3,'0')}`)];
assert.deepEqual(QUESTION_BANK.map(q=>q.id),expected);
const permutations=xs=>xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest])):[[]];
for(const q of QUESTION_BANK){
 assert.equal(q.track,'PHP');assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
 assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.equal(q.optionIds.length,4);
 assert(q.objective&&q.explanation&&q.learning.trace&&q.learning.rationales.every(Boolean));
 assert.equal(sha(JSON.stringify(q)),manifest.questions.find(x=>x.id===q.id).sha256);
 for(const order of permutations([0,1,2,3])){
  const displayed=order.map(i=>({id:q.optionIds[i],text:q.options[i],sourceText:q.coreOptions[i]}));
  const graded=displayed.map(o=>gradeAnswer({question:q,selectedOptionId:o.id}));
  assert.equal(graded.filter(a=>a.correct).length,1);
  const notes=buildLearningNotes(q,displayed);assert.equal(notes.alternatives.length,3);
  for(const note of notes.alternatives){const source=order[note.number-1];assert.notEqual(source,q.answer);assert.equal(note.reason,q.learning.rationales[source]);assert.equal(note.option,q.options[source]);}
 }
 assert(!gradeAnswer({question:q,selectedOptionId:'PQ-001@1:old'}).correct,'Old IDs cannot match a new answer');
}
const reordered=[{id:'INSERTION-TEST'},...QUESTION_BANK.toReversed()];
for(const q of QUESTION_BANK)assert.deepEqual(reordered.find(x=>x.id===q.id),q);
const empty={answered:0,correct:0,sessions:0,best:0};
const storage=new Map(HISTORICAL_KEYS.map(key=>[key,JSON.stringify({answered:999,correct:888,sessions:55,best:100,missed:['PQ-001','LQ-001']})]));
storage.set('unrelated-app','keep-me');const before=JSON.stringify([...storage]);
const api={getItem:key=>storage.get(key)??null};
assert.deepEqual(readProgress(api),empty);assert.equal(JSON.stringify([...storage]),before);
storage.set(STATS_KEY,JSON.stringify({answered:10,correct:7,sessions:1,best:70}));assert.deepEqual(readProgress(api),{answered:10,correct:7,sessions:1,best:70});
storage.set(STATS_KEY,'{bad');assert.deepEqual(readProgress(api),empty);
storage.set(STATS_KEY,JSON.stringify({answered:-2,correct:500,sessions:'3',best:200}));assert.deepEqual(readProgress(api),{answered:0,correct:0,sessions:0,best:100});
assert.deepEqual(readProgress({getItem(){throw Error('disabled');}}),empty);
assert.equal(STATS_KEY,manifest.statsKey);
console.log('Release: 620 exact PHP records, all 24 answer permutations/rationales, stable IDs, complete outgoing archive and isolated/safe progress passed.');
