export const PHP_PILOT_COLLECTION = 'php-pilot-v1';
export const PHP_FORMATS = ['execution', 'debugging', 'code-review', 'implementation', 'testing', 'architecture'];

/** PHP-only authoring contract. Other technologies deliberately have no adapter. */
export function validatePhpQuestions(questions) {
  const ids = new Set();
  const objectives = new Set();
  const require = (condition, message) => { if (!condition) throw new Error(message); };
  for (const q of questions) {
    const fail = message => `${q.id || 'Question'}: ${message}`;
    require(q.schemaVersion === 1 && q.technology === 'php', fail('unsupported schema or technology'));
    require(q.collectionId === PHP_PILOT_COLLECTION && q.status === 'pilot', fail('unexpected collection/status'));
    require(/^PHP-PILOT-\d{3}$/.test(q.id) && !ids.has(q.id), fail('missing or duplicate stable ID')); ids.add(q.id);
    require(Number.isInteger(q.revision) && q.revision > 0, fail('invalid revision'));
    require(PHP_FORMATS.includes(q.format) && q.responseType === 'single-choice', fail('unsupported question format'));
    require(q.topic && q.objective?.id && q.objective?.text && !objectives.has(q.objective.id), fail('missing or duplicate objective')); objectives.add(q.objective.id);
    require(['Foundation','Applied','Advanced'].includes(q.difficulty?.level) && q.difficulty.rationale && ['junior','intermediate','advanced'].includes(q.difficulty.audience), fail('invalid difficulty'));
    require(Array.isArray(q.prerequisites) && q.prerequisites.length > 0, fail('missing prerequisites'));
    require(q.runtime?.php?.length && q.runtime.sapi && q.runtime.errorPolicy && Array.isArray(q.runtime.extensions), fail('missing runtime assumptions'));
    require(q.context?.assumptions?.length && q.context.files?.length, fail('missing code context'));
    const paths = new Set();
    for (const file of q.context.files) {
      require(/^[a-zA-Z0-9_/-]+\.php$/.test(file.path) && !file.path.includes('..') && !file.path.startsWith('/') && !paths.has(file.path), fail('invalid or duplicate source path')); paths.add(file.path);
      require(['complete-file','fragment'].includes(file.kind) && file.source, fail('invalid code file'));
      require(file.kind !== 'fragment' || file.scope, fail('fragment needs containing scope'));
    }
    require(q.stem && q.options?.length === 4, fail('stem and four options required'));
    require(new Set(q.options.map(o=>o.id)).size === 4 && new Set(q.options.map(o=>o.text)).size === 4, fail('duplicate options'));
    require(q.options.filter(o=>o.id===q.correctOptionId).length === 1, fail('key must resolve to exactly one option'));
    for (const option of q.options) {
      require(/^[a-z][a-z0-9-]*$/.test(option.id) && option.text && option.rationale, fail('invalid option'));
      require(option.id === q.correctOptionId ? option.misconception === null : typeof option.misconception === 'string' && option.misconception.length > 10, fail('incorrect option needs a misconception'));
    }
    require(q.explanation?.summary && q.explanation.trace && q.validation?.fixtureId && q.references?.length, fail('missing explanation or validation provenance'));
  }
  return questions;
}

export function adaptPhpQuestion(q) {
  validatePhpQuestions([q]);
  const options = q.options.map(option=>option.text);
  return {
    id:q.id, revision:q.revision, collectionId:q.collectionId, track:'PHP', topic:q.topic,
    difficulty:q.difficulty.level, prompt:q.stem, options, coreOptions:[...options],
    optionIds:q.options.map(option=>`${q.id}@${q.revision}:${option.id}`),
    answer:q.options.findIndex(option=>option.id===q.correctOptionId),
    explanation:q.explanation.summary,
    learning:{trace:q.explanation.trace,rationales:q.options.map(option=>option.rationale)},
    code:{language:'php',title:'Code to inspect',files:q.context.files.map(file=>({name:file.path,kind:file.kind==='fragment'?'php-fragment':'php-file',snippet:file.source,context:file.scope}))},
    versions:{php:q.runtime.php.join(', '),label:`PHP ${q.runtime.php.join(' / ')} · ${q.runtime.sapi}. ${q.runtime.errorPolicy}`},
    assumptions:q.context.assumptions.join(' '),
    objective:q.objective.text, difficultyReason:q.difficulty.rationale, format:q.format,
    prerequisites:q.prerequisites, references:q.references, status:q.status,
  };
}
