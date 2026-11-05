// Read-only reviewer view. Baseline content is used so finding provenance stays stable.
import {readFileSync} from 'node:fs';
const [start=1,end=start,mode='student']=process.argv.slice(2);
const lo=Number(start),hi=Number(end);let all=[];
for(let b=Math.ceil(lo/100);b<=Math.ceil(hi/100);b++)all.push(...(await import('../php-expansion/archive/editorial-2026-11-05/js/php-expansion/batches/batch-'+String(b).padStart(2,'0')+'.mjs')).default);
for(const q of all.filter(q=>Number(q.id.slice(-4))>=lo&&Number(q.id.slice(-4))<=hi)){
 console.log('\n### '+q.id+' '+q.format+' '+q.difficulty.level);
 if(mode!=='answers'){
  console.log('Prerequisites: '+q.prerequisites.join('; '));
  console.log('Assumptions: '+q.context.assumptions.filter(a=>!a.startsWith('Run in a fresh PHP process')).join(' '));
  console.log(q.stem);
  for(const f of q.context.files)console.log('FILE '+f.path+'\n'+f.source);
  q.options.forEach((o,i)=>console.log(String.fromCharCode(65+i)+') '+o.text));
 }
 if(mode!=='student'){
  console.log('Objective: '+q.objective.text+' Difficulty: '+q.difficulty.rationale);
  console.log('KEY '+String.fromCharCode(65+q.options.findIndex(o=>o.id===q.correctOptionId))+' '+q.explanation.summary+' Trace: '+q.explanation.trace);
  q.options.forEach((o,i)=>console.log(String.fromCharCode(65+i)+') '+o.rationale));
 }
}
