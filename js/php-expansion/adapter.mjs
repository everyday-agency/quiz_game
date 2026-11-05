// Runtime projection only: validation fixtures stay in the local authoring/evidence tree.
export function adaptExpansionQuestion(q) {
  const options = q.options.map(option => option.text);
  return {
    id:q.id, revision:q.revision, collectionId:q.collectionId, track:'PHP', topic:q.topic,
    difficulty:q.difficulty.level, prompt:q.stem, options, coreOptions:[...options],
    optionIds:q.options.map(option => `${q.id}@${q.revision}:${option.id}`),
    answer:q.options.findIndex(option => option.id === q.correctOptionId),
    explanation:q.explanation.summary,
    learning:{trace:q.explanation.trace,rationales:q.options.map(option => option.rationale)},
    ...(q.context.files.length ? {code:{language:'php',title:'Code to inspect',files:q.context.files.map(file => ({name:file.path,kind:file.kind === 'fragment' ? 'php-fragment' : 'php-file',snippet:file.source,...(file.scope ? {context:file.scope} : {})}))}} : {}),
    versions:{php:q.runtime.php.join(', '),label:`PHP ${q.runtime.php.join(' / ')} · ${q.runtime.sapi}. ${q.runtime.errorPolicy}`},
    assumptions:q.context.assumptions.join(' '), objective:q.objective.text, objectiveId:q.objective.id,
    subtopic:q.subtopic, difficultyReason:q.difficulty.rationale, format:q.format,
    prerequisites:q.prerequisites, references:q.references, status:q.status,
    validationStatus:q.validation.status, independentEditorialReview:q.validation.independentEditorialReview,
  };
}
