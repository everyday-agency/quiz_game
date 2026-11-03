// Audit-only probes: no browser storage, network, application edits, or database access.
import { QUESTION_BANK } from '../js/questions.mjs';
import { buildLearningNotes } from '../js/learning-notes.mjs';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const scoped = QUESTION_BANK.filter(q => ['PHP', 'Laravel'].includes(q.track));
const wordingOnly = scoped.flatMap(q => {
  const matches = q.options.map((text,index) => ({text,index})).filter(o =>
    /^(Keep the relevant mechanism because|Exercise the shown path and assert that) /.test(o.text));
  return matches.length === 1 ? [{id:q.id, correct:matches[0].index === q.answer}] : [];
});
const longestCore = scoped.filter(q => q.track==='Laravel' && Number(q.id.slice(3))<=300).map(q => {
  const lengths = q.coreOptions.map(o=>o.length);
  const longest = Math.max(...lengths);
  return {id:q.id, unique:lengths.filter(n=>n===longest).length===1, correct:lengths[q.answer]===longest};
});
const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const functionSource = name => app.slice(app.indexOf(`function ${name}(`), app.indexOf('\nfunction ',app.indexOf(`function ${name}(`)+1));
const fields = {};
const context = {
  state: {mode:'exam',session:[],current:0,selectedOption:0,answers:[],streak:0,bestStreak:0},
  $: selector => fields[selector] ||= {},
  Math,
};
vm.createContext(context);
vm.runInContext(['shuffle','materialize','recordAnswer','updateMetrics'].map(functionSource).join('\n'),context);
const q = QUESTION_BANK[0];
context.state.session = [context.materialize(q)];
context.state.selectedOption = context.state.session[0].displayOptions.findIndex(o=>o.correct);
context.recordAnswer();
const examMetricsAfterCorrectAnswer = JSON.parse(JSON.stringify(fields));
let materializationFailures = 0;
for (const question of QUESTION_BANK) {
  const materialized = context.materialize(question);
  if (materialized.displayOptions.filter(o=>o.correct).length !== 1 ||
      materialized.displayOptions.find(o=>o.correct).sourceText !== question.coreOptions[question.answer]) {
    materializationFailures++;
  }
}
// Explicit allowlist of inspected snippets that only compute values / define types.
const safeIds = ['PQ-001','PQ-013','PQ-017','PQ-025','PQ-029','PQ-037','PQ-041','PQ-049','PQ-053','PQ-061','PQ-065','PQ-073','PQ-077','PQ-085','PQ-089','PQ-193','PQ-197','PQ-205','PQ-209','PQ-245','PQ-257'];
const purePHP = safeIds.map(id => {
  const question = QUESTION_BANK.find(q=>q.id===id);
  const result = spawnSync('php',['-n','-d','error_reporting=-1'],{input:question.code.snippet,encoding:'utf8',timeout:5000});
  return {id,title:question.code.title,exitStatus:result.status,stdout:result.stdout,stderr:result.stderr};
});
const csvProbe = spawnSync('php',['-n','-d','error_reporting=-1'],{
  input:'<?php $h = fopen("php://memory", "r+"); fwrite($h, "7,ada@example.test\\n"); rewind($h); var_export(fgetcsv($h)); fclose($h);',
  encoding:'utf8',timeout:5000,
});
const trap = QUESTION_BANK.find(q=>q.id==='PQ-004');
console.log(JSON.stringify({
  wordingOnly:{attempted:wordingOnly.length,correct:wordingOnly.filter(x=>x.correct).length,ids:wordingOnly.map(x=>x.id)},
  longestCore:{scope:'LQ-001..300, unpadded core options only',uniqueMax:longestCore.filter(x=>x.unique).length,uniqueCorrect:longestCore.filter(x=>x.unique&&x.correct).length},
  examMetricsAfterCorrectAnswer,
  shuffledMaterialization:{questions:QUESTION_BANK.length,failures:materializationFailures},
  purePHP,
  csvDefaultEscape:{exitStatus:csvProbe.status,output:csvProbe.stdout+csvProbe.stderr},
  negativeStemExplanation:{id:trap.id,prompt:trap.prompt,key:trap.coreOptions[trap.answer],notes:buildLearningNotes(trap)},
},null,2));
