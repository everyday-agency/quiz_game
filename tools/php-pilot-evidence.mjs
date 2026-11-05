import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {PHP_PILOT_QUESTIONS as questions} from '../js/php-pilot/questions.mjs';
import {QUESTION_BANK} from '../release/archive/pre-php-only/js/questions.mjs';

// Export these 20 existing pilot records for review; this is not a generator.
const target=name=>new URL('../php-pilot/'+name,import.meta.url);
const json=name=>JSON.parse(readFileSync(target(name)));
const write=(name,data)=>writeFileSync(target(name),JSON.stringify(data,null,2)+'\n');
const hash=value=>createHash('sha256').update(value).digest('hex');
const results=json('runtime-results.json');
const baseline=json('baseline.json');
assert.equal(questions.length,20);
assert.equal(hash(JSON.stringify(QUESTION_BANK)),baseline.bankHash);
assert(results.length>=1&&results.every(run=>run.questionCount===20));
write('questions.json',questions);

const review=[
  ['001',['PQ-029','PQ-037'],'Array union precedence and retaining zero differ from null-coalescing defaults and filter/reindex operations. The four outputs model overwrite, replacement and recursive-merge misunderstandings.','No positivity or generic action cue; solving requires the union rule.'],
  ['002',['PQ-013','PQ-021'],'A foreach reference escaping its loop is different from closure capture or static-local retention. Every candidate is an actual PHP operation, and all four are executed.','The short key is an operation that detaches a variable; shorter wording alone is not a reliable collection-wide cue.'],
  ['003',['PQ-073','PQ-005'],'An API parameter rename breaks a named caller while preserving a positional caller. This differs from reordered named arguments and strict scalar calls across files.','Compatibility alternatives separate both-working, both-breaking and the two possible mixed outcomes.'],
  ['004',['PQ-029'],'Omitted versus explicit-null function arguments are distinct from an absent array key or a falsy stored value.','The four outcomes diagnose default selection, nullable acceptance and null coalescing.'],
  ['005',['PQ-121'],'A valid zero quantity changes the contract from an existing positive-page check; the task is choosing the failure predicate rather than repeating that input is untrusted.','All choices are common PHP validation idioms. The long-key screen flags this short expression; no padding is added.'],
  ['006',['PQ-125'],'Request media-type token parsing differs from emitting a JSON response header. Both prefix and suffix lookalikes have concrete counterexamples.','All four alternatives parse semicolon parameters. The remaining differences require understanding case handling, prefix/substring checks and exact matching; selecting the only delimiter parser is no longer a shortcut.'],
  ['007',['PQ-253','PQ-113'],'A test exposing a falsy valid line differs from generator cleanup and CSV field parsing. Newline bytes are explicit and all four test fixtures are run.','The requirement alone does not establish why the string 0 differs from 0 plus newline; PHP truthiness determines the revealing test.'],
  ['008',['PQ-113'],'The cursor overwrite after a read is a different behavior from CSV parsing and a missing escape argument.','All four outputs map to concrete stream models: append, overwrite, insertion and truncation.'],
  ['009',['PQ-229'],'The shared catch type at an intentionally broad worker boundary differs from translating a domain exception into an HTTP response.','Every option is a real PHP exception/error type. Each wrong candidate is executed and fails on a particular task.'],
  ['010',['PQ-233'],'Returning from finally replaces a pending throw; the previous lock example teaches cleanup without changing the pending outcome.','Options distinguish catch propagation, replacement, dual outcomes and a supposed language prohibition.'],
  ['011',['PQ-193','PQ-197'],'Readonly reference replacement and mutation of the referenced object differ from scalar Money construction and shallow cloning.','The four outcomes require knowing which object/property is written; no generic immutability slogan identifies the key.'],
  ['012',['PQ-193'],'An explicitly declared child constructor skipping parent initialization differs from ordinary constructor promotion in one class.','A local assignment, a fallback parent call and a separate parent instance are runnable but violate different parts of the contract.'],
  ['013',['PQ-205'],'Reading an injected clock on every decision differs from merely implementing a Clock interface or producing a timestamp once.','Caching is plausible for a long-lived object but wrong for this changing dependency; every alternative is exercised.'],
  ['014',['PQ-209'],'Precedence between a trait, a parent method and an own method differs from resolving two imported traits with insteadof/as.','The collision distractor targets confusion with the old two-trait case; the other pairs reverse one precedence rule each.'],
  ['015',['PQ-205','PQ-209'],'Implementing an abstract trait method differs from interface usage and trait conflict resolution. The fragment wrapper is explicit.','All alternatives look like plausible method declarations; only one is compatible. The three rejection diagnostics are observed.'],
  ['016',['PQ-017','PQ-197'],'Shared static class storage across instances differs from a function static local or a cloned scalar property.','The four triples represent separate storage models rather than unrelated errors.'],
  ['017',['PQ-217'],'Function lookup in a namespace differs from class import aliases. The explicit global call makes the lookup boundary observable.','The two same-namespace and mixed-output choices require namespace knowledge; the redeclaration alternative reflects global built-in restrictions.'],
  ['018',['PQ-265'],'Selecting the equality regression case differs from a general assertion using a stubbed price collaborator. All four tests have valid expectations under the contract.','A learner can select the boundary using requirements and testing knowledge; that is the intended skill, not a wording shortcut.'],
  ['019',['PQ-217','PHP-PILOT-017'],'Class names lack the global fallback available to functions. Unlike item 017, the decisive event is construction failure caught through Throwable.','The choices distinguish the intended class, missing namespaced class, concrete lookup Error and catch interface. Shared namespace vocabulary is intentional, not a renamed scenario.'],
  ['020',['PQ-233','PQ-253','PHP-PILOT-008'],'Ownership of a borrowed handle differs from closing a handle acquired by the helper, and from an ordinary overwrite. Both openness and position are requirements.','Every alternative is a resource/variable operation. The key preserves the caller’s reference; other operations violate openness or the next-line position.'],
].map(([number,related,distinction,wording])=>({id:`PHP-PILOT-${number}`,related,distinction,wording,review:'Author technical/editorial review; independent blind review and learner calibration pending'}));
write('review-notes.json',review);
const fields=['# Twenty new PHP pilot questions',
  'These are the exact records in the separate local PHP pilot. Source option order below is for review only; the application shuffles options by stable identity. Each item has one correct answer. None replaces an existing question.',
  ['| ID | Format | Difficulty / audience | Objective |','|---|---|---|---|',...questions.map(q=>`| ${q.id} | ${q.format} | ${q.difficulty.level} / ${q.difficulty.audience} | ${q.objective.text} |`)].join('\n'),
];
for(const q of questions){
  const proof=results.map(run=>({php:run.php,result:run.results.find(result=>result.id===q.id)}));
  assert(proof.every(p=>p.result.supportedOption===q.correctOptionId));
  fields.push(`## ${q.id}`,q.stem,
    `**Objective:** ${q.objective.text}\n\n**Format:** ${q.format}. **Difficulty:** ${q.difficulty.level} (${q.difficulty.audience}). ${q.difficulty.rationale}\n\n**Prerequisites:** ${q.prerequisites.join('; ')}.`,
    `**Runtime:** PHP ${q.runtime.php.join(' / ')}, ${q.runtime.sapi}; ${q.runtime.errorPolicy} ${q.runtime.extensions.length?`Required extensions: ${q.runtime.extensions.join(', ')}.`:''}`,
    `**Assumptions:** ${q.context.assumptions.join(' ')}`,
    ...q.context.files.map(f=>`**${f.path} — ${f.kind}**${f.scope?`\n\n${f.scope}`:''}\n\n\`\`\`php\n${f.source.replace(/\n$/, '')}\n\`\`\``),
    q.options.map((o,i)=>o.text.includes('\n')
      ? `${i+1}.\n\n    \`\`\`php\n${o.text.split('\n').map(line=>'    '+line).join('\n')}\n    \`\`\``
      : `${i+1}. ${o.text}`).join('\n'),
    `**Correct:** ${q.options.findIndex(o=>o.id===q.correctOptionId)+1} (${q.correctOptionId}). ${q.explanation.summary}`,
    `**Trace:** ${q.explanation.trace}`,
    '**Each option:**\n\n'+q.options.map((o,i)=>`${i+1}. ${o.rationale}${o.misconception?` Misunderstanding: ${o.misconception}`:''}`).join('\n'),
    `**Validation:** ${proof.map(p=>`PHP ${p.php}: ${p.result.observations.length} recorded case${p.result.observations.length===1?'':'s'}`).join('; ')}. ${q.validation.kind==='candidate-patches'?'All four candidate implementations were exercised; only the keyed candidate meets the requirement.':q.validation.kind==='test-cases'?'All four tests were run against the buggy and repaired implementations; only the keyed test fails before the repair.':`Observed stdout: ${JSON.stringify(proof[0].result.observations[0].stdout)}.`}`,
    `**Originality and wording review:** ${review.find(r=>r.id===q.id).distinction} ${review.find(r=>r.id===q.id).wording}`,
    `**References:** ${q.references.map((url,i)=>`[Primary reference ${i+1}](${url})`).join(', ')}`,
  );
}
writeFileSync(target('QUESTIONS.md'),fields.join('\n\n')+'\n');
write('manifest.json',{
  date:'2026-11-04',collection:'php-pilot-v1',baselineCommit:baseline.commit,
  originalCount:2500,originalPhpCount:300,originalBankHash:baseline.bankHash,newCount:20,
  questions:questions.map(q=>({id:q.id,revision:q.revision,sha256:hash(JSON.stringify(q)),objective:q.objective.id,format:q.format})),
  runtimeResultsSha256:hash(readFileSync(target('runtime-results.json'))),
  qualityResultsSha256:hash(readFileSync(target('quality-results.json'))),
});
console.log('Exported the same 20 PHP pilot records, review notes and validation manifest. No questions were generated.');
