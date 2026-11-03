// Read-only question-bank audit. Writes no files; redirect stdout to an audit artifact.
import { QUESTION_BANK } from '../js/questions.mjs';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const hash = (value) => createHash('sha256').update(value).digest('hex');
const countBy = (items, key) => Object.fromEntries([...new Set(items.map(key))].map(value => [value, items.filter(item => key(item) === value).length]));
function groups(items, key) {
  const map = new Map();
  for (const item of items) {
    const value = key(item);
    if (!map.has(value)) map.set(value, []);
    map.get(value).push(item.id);
  }
  return [...map.entries()].filter(([, ids]) => ids.length > 1).map(([value, ids]) => ({value, ids}));
}
const scoped = QUESTION_BANK.filter(q => ['PHP', 'Laravel'].includes(q.track));
const pools = {
  all: QUESTION_BANK,
  scoped,
  originalLaravel: scoped.filter(q => q.track === 'Laravel' && Number(q.id.slice(3)) <= 300),
  Laravel: scoped.filter(q => q.track === 'Laravel'),
  PHP: scoped.filter(q => q.track === 'PHP'),
};
const repeatedOptions = [
  'Suppress every failure so callers always receive a successful-looking value',
  'Replace the implementation with a comment describing the intended result',
  'Assert only that the source file contains the title of this example',
  'Check that the code compiles without exercising the relevant runtime path',
  'Snapshot an unrelated component or endpoint and treat that as equivalent evidence',
  'The snippet changes editor hints but cannot affect the executed program',
  'The runtime skips the shown branch and supplies a safe default automatically',
];
const stats = Object.fromEntries(Object.entries(pools).map(([name, questions]) => [name, {
  count: questions.length,
  difficulties: countBy(questions, q => q.difficulty),
  codeQuestions: questions.filter(q => q.code).length,
  distinctSnippets: new Set(questions.filter(q => q.code).map(q => q.code.snippet)).size,
  uniqueExplanations: new Set(questions.map(q => q.explanation)).size,
  uniqueCorrectCores: new Set(questions.map(q => q.coreOptions[q.answer])).size,
  sourceAnswerIndices: countBy(questions, q => q.answer),
  repeatedDistractors: Object.fromEntries(repeatedOptions.map(option => [option, questions.filter(q => q.coreOptions.some((text, i) => i !== q.answer && text === option)).length])),
  totalCoreOptionCharacters: questions.reduce((n,q) => n+q.coreOptions.join('').length,0),
  totalDisplayedOptionCharacters: questions.reduce((n,q) => n+q.options.join('').length,0),
}]));
const phpSnippets = [...new Map(pools.PHP.map(q => [q.code.snippet, q])).entries()].map(([snippet, q]) => {
  // Lint only: PHP code is not executed, and no fixtures or connections are accessed.
  const result = spawnSync('php', ['-n', '-l'], {input: snippet, encoding: 'utf8', timeout: 5000});
  return {
    representativeId: q.id,
    ids: pools.PHP.filter(item => item.code.snippet === snippet).map(item => item.id),
    title: q.code.title,
    isIntegration: q.code.title.includes('integration review'),
    success: result.status === 0,
    output: (result.stdout + result.stderr).trim(),
  };
});
const findings = scoped.map(q => ({
  id: q.id,
  track: q.track,
  topic: q.topic,
  difficulty: q.difficulty,
  sha256: hash(JSON.stringify(q)),
  automatedFlags: [
    ...(q.roadmap !== undefined ? ['template_question_requires_semantic_review'] : []),
    ...(q.coreOptions.some((text,i) => i !== q.answer && repeatedOptions.includes(text)) ? ['generic_distractor'] : []),
    ...(q.track === 'PHP' && !phpSnippets.find(s => s.ids.includes(q.id)).success ? ['php_lint_failed'] : []),
  ],
  semanticApproval: 'not_certified',
}));
const trackedFiles = execFileSync('git', ['ls-files', '-z'], {encoding:'utf8'}).split('\0').filter(Boolean);
const result = {
  auditDate: '2026-11-03',
  gitCommit: execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim(),
  phpVersion: execFileSync('php', ['-n','-r','echo PHP_VERSION;'], {encoding:'utf8'}),
  sourceFiles: trackedFiles.map(path => ({path, sha256:hash(readFileSync(new URL('../'+path, import.meta.url)))})),
  stats,
  exactDuplicatePrompts: groups(QUESTION_BANK, q => q.prompt),
  normalizedDuplicatePrompts: groups(QUESTION_BANK, q => q.prompt.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()),
  scopedDuplicateOptionSets: groups(scoped, q => JSON.stringify(q.coreOptions)),
  phpLint: phpSnippets,
  questions: findings,
  fullBankManifest: QUESTION_BANK.map(q => ({id:q.id, sha256:hash(JSON.stringify(q))})),
};
console.log(JSON.stringify(result, null, 2));
