import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {QUESTION_BANK} from '../../release/archive/pre-php-only/js/questions.mjs';
import {PHP_PILOT_QUESTIONS,PHP_PILOT_BANK} from '../../js/php-pilot/questions.mjs';
import {validatePhpQuestions,adaptPhpQuestion,PHP_FORMATS} from '../../js/php-pilot/schema.mjs';
import {gradeSession} from '../../js/exam.mjs';
import {buildLearningNotes} from '../../release/archive/pre-php-only/js/learning-notes.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const baseline=JSON.parse(readFileSync(new URL('../../php-pilot/baseline.json',import.meta.url)));
assert.equal(QUESTION_BANK.length,2500);
assert.equal(hash(JSON.stringify(QUESTION_BANK)),baseline.bankHash,'The existing 2,500-question collection changed');
for(const entry of baseline.questions){
  const q=QUESTION_BANK.find(q=>q.id===entry.id);
  assert(q);assert.equal(hash(JSON.stringify(q)),entry.sha256,`${entry.id}: content changed`);
  assert.equal(hash(JSON.stringify(buildLearningNotes(q))),entry.notesSha256,`${entry.id}: notes changed`);
}
for(const entry of baseline.files)assert.equal(hash(readFileSync(new URL('../../'+(['js/questions.mjs','js/learning-notes.mjs'].includes(entry.path)?'release/archive/pre-php-only/':'')+entry.path,import.meta.url))),entry.sha256,`${entry.path}: existing bank/grading module changed`);
assert.equal(PHP_PILOT_QUESTIONS.length,20);
assert.equal(QUESTION_BANK.filter(q=>q.track==='PHP').length,300);
assert(PHP_PILOT_BANK.every(q=>q.track==='PHP'&&!QUESTION_BANK.some(old=>old.id===q.id)));
assert.deepEqual(new Set(PHP_PILOT_QUESTIONS.map(q=>q.format)),new Set(PHP_FORMATS));

const clone = object=>structuredClone(object);
for(const mutate of [
  q=>{q.technology='laravel';},q=>{q.correctOptionId='unknown';},q=>{q.options[1].id=q.options[0].id;},
  q=>{q.context.files[0].kind='fragment';delete q.context.files[0].scope;},
  q=>{q.context.files[0].path='../outside.php';},q=>{q.options.find(o=>o.id!==q.correctOptionId).misconception=null;},
]){const bad=clone(PHP_PILOT_QUESTIONS[0]);mutate(bad);assert.throws(()=>validatePhpQuestions([bad]));}
assert.throws(()=>validatePhpQuestions([PHP_PILOT_QUESTIONS[0],PHP_PILOT_QUESTIONS[0]]));

function permutations(items){return items.length?items.flatMap((item,i)=>permutations(items.filter((_,n)=>n!==i)).map(rest=>[item,...rest])):[[]];}
const orders=permutations([0,1,2,3]);
for(const raw of PHP_PILOT_QUESTIONS){
  const q=adaptPhpQuestion(raw);
  for(const order of orders){
    const displayed=order.map(i=>({id:q.optionIds[i],sourceText:q.options[i]}));
    const result=gradeSession(displayed.map(option=>({question:q,selectedOptionId:option.id})));
    assert.equal(result.answers.filter(a=>a.correct).length,1);
    assert.equal(result.answers.find(a=>a.correct).selectedOptionId,`${raw.id}@1:${raw.correctOptionId}`);
    const notes=buildLearningNotes(q,displayed);
    assert.equal(notes.alternatives.length,3);
    for(const alternative of notes.alternatives){
      const index=q.options.indexOf(alternative.option);
      assert.equal(alternative.number,order.indexOf(index)+1);
      assert.equal(alternative.reason,raw.options[index].rationale);
    }
  }
  const reordered=adaptPhpQuestion({...raw,options:[...raw.options].reverse()});
  assert.equal(reordered.optionIds[reordered.answer],q.optionIds[q.answer],'Authoring reordering changed the keyed identity');
  assert(!q.options.some(text=>/suppress every failure|replace .* with a comment|keep the relevant mechanism|exercise the shown path|reasoning check:|evidence to inspect:/i.test(text)));
}
const before=PHP_PILOT_QUESTIONS.map(q=>[q.id,adaptPhpQuestion(q)]);
const after=new Map([...PHP_PILOT_QUESTIONS].reverse().map(q=>[q.id,adaptPhpQuestion(q)]));
for(const [id,q]of before)assert.deepEqual(after.get(id),q);

// Similarity finds candidates for editorial review; it is not semantic proof.
const tokenize=text=>new Set(text.toLowerCase().replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,' ').replace(/\$[a-z_]\w*/gi,'VARIABLE').match(/[a-z_]+|[=<>!+?&|]+/g)||[]);
const similarity=(a,b)=>{const intersection=[...a].filter(x=>b.has(x)).length;return intersection/(a.size+b.size-intersection||1);};
const snippet=q=>q.code?.files?.map(f=>f.snippet).join('\n')||q.code?.snippet||'';
const oldPhp=QUESTION_BANK.filter(q=>q.track==='PHP');
const analyses=PHP_PILOT_BANK.map(q=>{
  const text=snippet(q);
  assert(!oldPhp.some(old=>old.prompt.trim().toLowerCase()===q.prompt.trim().toLowerCase()));
  assert(!oldPhp.some(old=>snippet(old).replace(/\s/g,'')===text.replace(/\s/g,'')));
  const nearest=oldPhp.map(old=>({id:old.id,codeTokenSimilarity:similarity(tokenize(text),tokenize(snippet(old)))})).sort((a,b)=>b.codeTokenSimilarity-a.codeTokenSimilarity).slice(0,3);
  const peers=PHP_PILOT_BANK.filter(other=>other.id!==q.id).map(other=>({id:other.id,codeTokenSimilarity:similarity(tokenize(text),tokenize(snippet(other)))})).sort((a,b)=>b.codeTokenSimilarity-a.codeTokenSimilarity).slice(0,2);
  return {id:q.id,nearestExisting:nearest,nearestPilot:peers};
});
assert.equal(new Set(PHP_PILOT_BANK.map(q=>q.prompt)).size,20);
assert.equal(new Set(PHP_PILOT_BANK.map(q=>snippet(q).replace(/\s/g,''))).size,20);
const quality={
  existingRecordsPreserved:2500,existingPhpPreserved:300,newPhpItems:20,permutationsPerItem:24,
  formats:Object.fromEntries(PHP_FORMATS.map(format=>[format,PHP_PILOT_QUESTIONS.filter(q=>q.format===format).length])),
  difficulty:Object.fromEntries(['Foundation','Applied','Advanced'].map(level=>[level,PHP_PILOT_BANK.filter(q=>q.difficulty===level).length])),
  keysBySourcePosition:[0,1,2,3].map(index=>PHP_PILOT_BANK.filter(q=>q.answer===index).length),
  cueComparison:[['existingPhp',oldPhp],['newPilot',PHP_PILOT_BANK]].map(([collection,bank])=>({collection,count:bank.length,
    genericOptionCue:bank.filter(q=>q.options.some(text=>/suppress every failure|replace .* with a comment|keep the relevant mechanism|exercise the shown path/i.test(text))).length,
    paddedItems:bank.filter(q=>q.options.some(text=>/Reasoning check:|Evidence to inspect:/.test(text))).length,
    uniqueLongestKey:bank.filter(q=>q.options.filter(text=>text.length>=q.options[q.answer].length).length===1).length,
  })),similarityReviewCandidates:analyses,
  limits:'Token similarity and wording screens are review aids. They do not establish originality, plausible distractors, or calibrated difficulty by themselves.',
};
if(process.env.WRITE_TEST_REPORT==='1')writeFileSync(new URL('../../php-pilot/quality-results.json',import.meta.url),JSON.stringify(quality,null,2)+'\n');
console.log('✓ PHP-only pilot structure: 2,500 existing records/notes preserved; 20 new items; all 24 option orders per item grade and explain correctly');
