import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash,randomBytes} from 'node:crypto';
import {adapt} from './build-laravel-review.mjs';
import {TARGET_IDS} from '../laravel-specialist/authoring/focused-editorial.mjs';
const read=p=>JSON.parse(readFileSync(p)),write=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const all=Array.from({length:6},(_,i)=>read('laravel-specialist/batches/batch-'+String(i+1).padStart(2,'0')+'.json')).flat();
const mapping=read('laravel-specialist/curriculum-mappings.json').questions;
const selectionPath='laravel-specialist/evidence/focused-editorial/random-selection.json';
const pool=all.filter(q=>!TARGET_IDS.includes(q.id));
assert.equal(pool.length,593);
let selection;
if(existsSync(selectionPath)){
 selection=read(selectionPath);
}else{
 const seed=randomBytes(32).toString('hex');
 const rank=id=>createHash('sha256').update(seed+':'+id).digest('hex');
 const ids=pool.map(q=>q.id).sort((a,b)=>rank(a).localeCompare(rank(b))).slice(0,15);
 selection={seed,algorithm:'SHA-256(seed + ":" + stable ID), ascending hash; first 15 without replacement; seed drawn once with crypto.randomBytes(32)',poolSize:593,excluded:TARGET_IDS,ids,createdAt:new Date().toISOString()};
 write(selectionPath,selection);
}
assert.equal(new Set(selection.ids).size,15);assert(selection.ids.every(id=>pool.some(q=>q.id===id)));
function exportQuestions(records,title,base){
 const student=records.map(q=>adapt(q,mapping[q.id]));
 write('laravel-specialist/'+base+'.json',{title,independentEditorialApproval:'pending',note:'All student-visible text plus keys and rationales for reviewer use. The quiz randomizes display order.',questions:student});
 let md='# '+title+'\n\nIndependent editorial approval remains **pending**. All options below use source order; the quiz shuffles their displayed order. Correct keys and all rationales are included for the reviewer.\n\n';
 for(let i=0;i<records.length;i++){
  const q=records[i],view=student[i],label=String.fromCharCode(65+view.answer);
  md+='## '+q.id+' — revision '+q.revision+'\n\n';
  md+='**'+q.topic+' · '+q.difficulty.level+' · '+q.format+'**\n\n';
  md+='Learning objective: '+q.objective.text+'\n\n';
  md+='Prerequisites: '+q.prerequisites.join('; ')+'.\n\n';
  md+='Runtime: '+view.versions.label+'\n\n';
  md+='Assumptions:\n\n'+q.context.assumptions.map(a=>'- '+a).join('\n')+'\n\n';
  md+='**'+q.stem+'**\n\n';
  for(const f of q.context.files)md+='### '+f.path+' ('+f.kind+')\n\n'+(f.scope?f.scope+'\n\n':'')+'§§§'+(f.kind==='blade'?'blade':'php')+'\n'+f.source.trimEnd()+'\n§§§\n\n';
  q.options.forEach((o,j)=>md+='**'+String.fromCharCode(65+j)+'.** '+o.text+'\n\n');
  md+='**Correct answer: '+label+'** ('+q.correctOptionId+').\n\n'+q.explanation.summary+'\n\n';
  q.options.forEach((o,j)=>md+='- **'+String.fromCharCode(65+j)+':** '+o.rationale+'\n');
  md+='\nDifficulty rationale: '+q.difficulty.rationale+'\n\n';
  md+='Validation: '+q.validation.status+' — [batch evidence](evidence/batch-'+Math.ceil(Number(q.id.slice(-4))/100)+'-technical.json).\n\n';
  if(q.validation.kind==='runtime')md+='Observed stdout on both supported PHP versions: §'+q.validation.stdout+'§.\n\n';
  else md+='Documented-contract limitation: '+q.validation.reason+'\n\n';
  md+='References:\n\n'+q.references.map(url=>'- ['+url+']('+url+')').join('\n')+'\n\n';
 }
 writeFileSync('laravel-specialist/'+base+'.md',md.replaceAll('§',String.fromCharCode(96)));
}
exportQuestions(TARGET_IDS.map(id=>all.find(q=>q.id===id)),'Seven revised Laravel questions','FOCUSED_REVISED_7');
exportQuestions(selection.ids.map(id=>all.find(q=>q.id===id)),'Fifteen randomly selected unchanged Laravel questions','SPOT_CHECK_15');
console.log('Exported seven revised records and fifteen randomly selected unchanged records. Sample seed persisted; no reroll.');
