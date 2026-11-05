import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {PHP_PILOT_QUESTIONS} from '../js/php-pilot/questions.mjs';
import {QUESTION_BANK} from '../release/archive/pre-php-only/js/questions.mjs';
const batch=Number(process.env.BATCH||1);
const qs=(await import(`../php-expansion/authoring/batch-${String(batch).padStart(2,'0')}.mjs`)).default;
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const write=(p,v)=>writeFileSync(new URL('../'+p,import.meta.url),JSON.stringify(v,null,2)+'\n');
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const preservation=read('php-expansion/archive/preservation.json');
assert.equal(sha(QUESTION_BANK),preservation.activeBankSha256,'Archived outgoing 2500 records must remain identical');
assert.equal(sha(QUESTION_BANK.filter(q=>q.track!=='PHP')),preservation.nonPhpSha256,'Non-PHP records must remain identical');
assert.equal(sha(PHP_PILOT_QUESTIONS),preservation.pilotSha256,'Approved pilot must remain identical');
const catalog=read('js/php-expansion/curriculum.json');
const counts=key=>Object.fromEntries([...new Set(qs.map(key))].map(k=>[k,qs.filter(q=>key(q)===k).length]));
assert.equal(qs.length,100);
const target=read('php-expansion/WORK_STATE.json').batches.find(b=>b.id===batch);
assert.deepEqual(counts(q=>q.format),target.formats);
assert.deepEqual(counts(q=>q.difficulty.level),target.difficulties);
const ids=new Set([...preservation.reservedIds,...preservation.pilotIds]);
const objectives=new Set();
const sources=[];
// Layout checks inspect PHP tokens, so braces in a serialized string or a
// comment cannot be mistaken for compressed executable blocks. No code runs.
const sourceList=qs.flatMap(q=>q.context.files.map(f=>f.source));
const tokenized=spawnSync(process.env.PHP_BIN||'php',['-n','-r',`
$sources = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
$result = [];
foreach ($sources as $source) {
    $code = '';
    foreach (token_get_all($source) as $token) {
        if (!is_array($token)) {
            $code .= $token;
            continue;
        }
        $hidden = in_array($token[0], [T_CONSTANT_ENCAPSED_STRING, T_ENCAPSED_AND_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true);
        $code .= $hidden ? preg_replace('/[^\\n]/', ' ', $token[1]) : $token[1];
    }
    $result[] = $code;
}
echo json_encode($result, JSON_THROW_ON_ERROR);
`],{input:JSON.stringify(sourceList),encoding:'utf8',maxBuffer:4*1024*1024,timeout:10000});
assert.equal(tokenized.status,0,tokenized.stderr);
const layoutSources=JSON.parse(tokenized.stdout);let sourceIndex=0;
for(const q of qs){
 assert(/^PHP-E26-\d{4}$/.test(q.id)&&!ids.has(q.id),q.id);ids.add(q.id);
 const numeric=Number(q.id.slice(-4));assert(numeric>(batch-1)*100&&numeric<=batch*100);
 assert.equal(q.schemaVersion,1);assert.equal(q.technology,'php');assert.equal(q.collectionId,'php-engineer-2026');assert.equal(q.responseType,'single-choice');assert(Number.isInteger(q.revision)&&q.revision>=1);assert.equal(q.status,'draft');
 assert(q.stem.length>25&&q.subtopic&&q.topic&&q.objective.text&&q.objective.id);
 assert(!objectives.has(q.objective.id),q.id+': repeated objective');objectives.add(q.objective.id);
 assert(q.difficulty.rationale&&q.prerequisites.length&&q.runtime.sapi&&q.runtime.errorPolicy);
 assert.deepEqual(q.runtime.php,['8.4','8.5']);
 assert(q.options.length===4&&new Set(q.options.map(o=>o.id)).size===4&&new Set(q.options.map(o=>o.text)).size===4,q.id);
 assert(q.options.filter(o=>o.id===q.correctOptionId).length===1);
 for(const o of q.options){assert(/^[a-z][a-z0-9-]*$/.test(o.id)&&o.text&&o.rationale,q.id);assert(o.id===q.correctOptionId?o.misconception===null:typeof o.misconception==='string'&&o.misconception.length>10,q.id+': misconception');}
 assert(q.explanation.summary&&q.explanation.trace&&q.references.length);
 assert(q.references.every(r=>/^https:\/\//.test(r)));
 assert(q.curriculum.lessonIds===null||q.curriculum.lessonIds.every(id=>Number.isInteger(id)&&id>=1&&id<=31),q.id+': no invented lessons');
 assert(!q.curriculum.coverageComplete||q.curriculum.lessonIds?.length,q.id);
 assert(catalog.topics.some(t=>t.key===q.curriculum.repositoryTopic&&t.topic===q.topic));
 assert.equal(q.validation.independentEditorialReview,'pending');
 const paths=new Set();
 for(const f of q.context.files){
  const layout=layoutSources[sourceIndex++];
  assert(f.kind==='complete-file'&&f.source.startsWith('<?php\n')&&!paths.has(f.path));paths.add(f.path);
  assert(!/\t/.test(f.source),q.id+': indentation tabs');
  assert(!/\b(?:class|interface|trait) (?!implements\b|extends\b)[a-zA-Z_]\w*[^\n]*\{/.test(layout),q.id+': declaration braces must be multiline');
  assert(!/\{[^\n{}]+;[^\n{}]*\}/.test(layout),q.id+': compressed block');
  for(const line of f.source.split('\n')){const indent=line.match(/^ +/)?.[0].length||0;assert(indent%4===0,q.id+': four-space indentation');}
  sources.push({id:q.id,path:f.path,sha256:createHash('sha256').update(f.source).digest('hex')});
 }
 assert(!/suppress every failure|replace (?:the )?(?:implementation|code) with a comment|reasoning check:|evidence to inspect:/i.test(q.stem+' '+q.options.map(o=>o.text).join(' ')),q.id+': banned pattern');
}
const runtimes=read(`php-expansion/evidence/batch-${batch}-runtime.json`);
assert.deepEqual(new Set(runtimes.map(r=>r.php.slice(0,3))),new Set(['8.4','8.5']));
for(const r of runtimes){assert.equal(r.recordsChecked,100);assert.equal(r.sourceHash,sha(qs),'Runtime evidence must match current authored content');assert.deepEqual(r.results.map(q=>q.id),qs.map(q=>q.id));}
const normalize=s=>s.toLowerCase().replace(/\$[a-z_]\w*/g,'$var').replace(/\b\d+\b/g,'N').replace(/[^a-z0-9_$]+/g,' ').trim();
const stop=new Set('the a an of and to in is for with as this that it on from by its which what does should must are be all each both only when then code php return function public private string int bool array new echo assertion test fails displayed implementation printed prints text json result output shows against exposes defect helper supplied below complete exact'.split(' '));
const tokens=s=>new Set(normalize(s).split(' ').filter(s=>s.length>2&&!stop.has(s)));
const jaccard=(a,b)=>{const intersection=[...a].filter(t=>b.has(t)).length;return intersection/(a.size+b.size-intersection||1);};
const candidates=[];
const corpus=[...PHP_PILOT_QUESTIONS.map(q=>({id:q.id,kind:'pilot',stem:q.stem,objective:q.objective.text,code:q.context.files.map(f=>f.source).join('\n')})),...read('php-expansion/archive/original-php-300.json').questions.map(({question:q})=>({id:q.id,kind:'legacy',stem:q.prompt,objective:q.objective||q.topic,code:q.code?.snippet||q.code?.files?.map(f=>f.snippet).join('\n')||''}))];
// Compare against the current complete draft bank, including later batches.
for(let prior=1;prior<=6;prior++)if(prior!==batch){const p=(await import(`../php-expansion/authoring/batch-${String(prior).padStart(2,'0')}.mjs`)).default;corpus.push(...p.map(q=>({id:q.id,kind:'new',stem:q.stem,objective:q.objective.text,code:q.context.files.map(f=>f.source).join('\n')})));}
const seenStems=new Map();
for(const q of qs){
 // Generic output/test prompts may repeat; compare the complete student-visible task.
 const normalized=normalize(JSON.stringify([q.stem,q.context.assumptions,q.context.files,q.options.map(o=>o.text)]));assert(!seenStems.has(normalized),`${q.id}: duplicate complete student-visible task`);seenStems.set(normalized,q.id);
 const text=tokens(q.objective.text+' '+q.stem);const code=tokens(q.context.files.map(f=>f.source).join('\n'));
 for(const other of corpus){const semantic=jaccard(text,tokens(other.objective+' '+other.stem));const source=code.size>8?jaccard(code,tokens(other.code)):0;if(semantic>=0.16||source>=0.5)candidates.push({a:q.id,b:other.id,kind:other.kind,textSimilarity:+semantic.toFixed(3),codeSimilarity:+source.toFixed(3)});}
 corpus.push({id:q.id,kind:'new',stem:q.stem,objective:q.objective.text,code:q.context.files.map(f=>f.source).join('\n')});
}
const uniqueLongest=qs.filter(q=>{const key=q.options.find(o=>o.id===q.correctOptionId);return q.options.filter(o=>o.id!==key.id).every(o=>key.text.length>o.text.length);});
const uniqueShortest=qs.filter(q=>{const key=q.options.find(o=>o.id===q.correctOptionId);return q.options.filter(o=>o.id!==key.id).every(o=>key.text.length<o.text.length);});
const lengthOutliers=qs.filter(q=>q.options.find(o=>o.id===q.correctOptionId).text.length>1.45*Math.max(...q.options.filter(o=>o.id!==q.correctOptionId).map(o=>o.text.length))).map(q=>q.id);
const report={batch,count:qs.length,sourceHash:sha(qs),formats:counts(q=>q.format),difficulty:counts(q=>q.difficulty.level),topics:counts(q=>q.topic),knownLessonMappings:qs.filter(q=>q.curriculum.lessonIds?.length).length,unmapped:qs.filter(q=>q.curriculum.lessonIds===null).length,studiedCoverageEligible:qs.filter(q=>q.curriculum.coverageComplete).length,authoredKeyPositions:counts(q=>String(q.options.findIndex(o=>o.id===q.correctOptionId)+1)),wordingSignals:{uniqueLongestCorrect:uniqueLongest.length,uniqueShortestCorrect:uniqueShortest.length,lengthOutliers,interpretation:'Heuristics flag review candidates; they do not establish absence of semantic duplication or answer leakage.'},duplicateCandidates:candidates.sort((a,b)=>Math.max(b.textSimilarity,b.codeSimilarity)-Math.max(a.textSimilarity,a.codeSimilarity)),sources,preservation:'2500 active records, 2200 non-PHP records and all 20 pilot records match archived hashes',independentApproval:'pending'};
write(`php-expansion/evidence/batch-${batch}-checks.json`,report);
console.log(JSON.stringify({...report,sources:report.sources.length,duplicateCandidates:report.duplicateCandidates.length},null,2));
