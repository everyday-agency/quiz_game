import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { delimiter } from 'node:path';
import { tokenizerFlags } from '../../tools/php-tokenizer.mjs';
import { PHP_PILOT_QUESTIONS as questions } from '../../js/php-pilot/questions.mjs';
import { OUTPUTS, PATCHES, TEST_CASES, executableFiles, testCaseFiles } from './fixtures.mjs';
import { executableFiles as oldExecutableFiles, testCaseFiles as oldTestCaseFiles } from '../../php-pilot/formatting/before/fixtures.mjs';

const root = new URL('../../php-pilot/formatting/', import.meta.url);
const before = JSON.parse(readFileSync(new URL('before/questions.json', root)));
const approved = JSON.parse(readFileSync(new URL('before/execution-allowlist.json', root)));
const hash = value => createHash('sha256').update(value).digest('hex');
assert.equal(hash(readFileSync(new URL('before/fixtures.mjs', root))), approved.fixtureSha256);
for (const q of before) assert.equal(hash(JSON.stringify(q)), approved.questions.find(entry => entry.id === q.id).sha256);
assert.deepEqual(questions.map(q => q.id), before.map(q => q.id));

// Compare literal tokens, not whitespace-stripped strings: whitespace inside
// strings/comments is significant. token_get_all parses data; it never runs it.
const pairs = [];
const addPair = (label, oldSource, source, kind = 'complete-file') => {
  const prefix = kind === 'fragment' ? '<?php\n' : '';
  pairs.push({ label, before: prefix + oldSource, after: prefix + source });
};
const units = [];
for (const q of questions) {
  const old = before.find(item => item.id === q.id);
  const metadata = structuredClone(q);
  for (let i = 0; i < q.context.files.length; i++) {
    const file = q.context.files[i];
    let oldSource = old.context.files[i].source;
    if (q.id === 'PHP-PILOT-020') {
      // The separately reviewed edit removes the statement adjacent to the
      // marker, so replacing just the displayed comment is unambiguous.
      assert.equal(oldSource.split('/* CLEANUP */ fclose($handle);').length, 2);
      oldSource = oldSource.replace('/* CLEANUP */ fclose($handle);', '/* CLEANUP */');
      assert.equal(file.source.split('/* CLEANUP */').length, 2);
      assert.equal((file.source.match(/fclose\(/g) || []).length, 1, 'Only the caller closes the stream');
    }
    addPair(`${q.id}/${file.path}`, oldSource, file.source, file.kind);
    metadata.context.files[i].source = old.context.files[i].source;
    assert(file.source.endsWith('\n') && !file.source.endsWith('\n\n'), 'One final newline');
    assert(!/[\t\r]/.test(file.source), 'LF and four-space indentation only');
    for (const line of file.source.split('\n')) {
      assert(!/[ \t]+$/.test(line), `${q.id}: trailing whitespace`);
      assert.equal(line.match(/^ */)[0].length % 4, 0, `${q.id}: indentation`);
      assert(!/\{.+\}/.test(line), `${q.id}: compressed block`);
      assert(!/;.*\S.*;/.test(line), `${q.id}: multiple statements on a line`);
    }
    if (file.kind === 'complete-file') assert(file.source.startsWith('<?php\n\n'));
    units.push({ ...file, id: q.id });
  }
  for (let i = 0; i < q.options.length; i++) {
    if (q.id === 'PHP-PILOT-015') {
      addPair(`${q.id}/option:${q.options[i].id}`, old.options[i].text, q.options[i].text, 'fragment');
      assert.match(q.options[i].text, /^protected[^\n]+\n\{\n    return [^\n]+;\n\}$/);
      metadata.options[i].text = old.options[i].text;
    }
  }
  if (q.id === 'PHP-PILOT-020') {
    assert(q.stem.includes('replace the entire /* CLEANUP */ comment'));
    assert(q.stem.includes('Leave every other line unchanged'));
    assert(q.explanation.trace.includes('There is no fclose in the finally block'));
    metadata.stem = old.stem;
    metadata.explanation.trace = old.explanation.trace;
  }
  assert.deepEqual(metadata, old, `${q.id}: unexpected content, key, identity or schema change`);

  const compareFiles = (previous, current, label) => {
    assert.deepEqual(current.map(f => f.path), previous.map(f => f.path));
    for (let i = 0; i < current.length; i++) addPair(`${q.id}/${label}/${current[i].path}`, previous[i].source, current[i].source);
  };
  if (OUTPUTS[q.id]) compareFiles(oldExecutableFiles(old), executableFiles(q), 'observed');
  if (PATCHES[q.id]) for (const option of q.options) {
    compareFiles(oldExecutableFiles(old, old.options.find(o => o.id === option.id)), executableFiles(q, option), `candidate:${option.id}`);
  }
  if (TEST_CASES[q.id]) for (const sample of TEST_CASES[q.id].cases) for (const repaired of [false, true]) {
    compareFiles(oldTestCaseFiles(old, sample, repaired), testCaseFiles(q, sample, repaired), `test:${sample.option}:${repaired}`);
  }
}

const tokenize = String.raw`
$units = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
$result = [];
foreach ($units as $source) {
    $tokens = [];
    foreach (token_get_all($source) as $token) {
        if (is_array($token)) {
            if ($token[0] === T_WHITESPACE) { continue; }
            if ($token[0] === T_LINE || $token[0] === T_HALT_COMPILER) {
                throw new RuntimeException('Line/offset-sensitive code requires separate review.');
            }
            $tokens[] = [token_name($token[0]), $token[0] === T_OPEN_TAG ? rtrim($token[1]) : $token[1]];
        } else { $tokens[] = $token; }
    }
    $result[] = $tokens;
}
echo json_encode($result, JSON_THROW_ON_ERROR);
`;
const primary = process.env.PHP_BIN || execFileSync('/bin/sh', ['-c', 'command -v php'], { encoding: 'utf8' }).trim();
const runtimes = [...new Set((process.env.PHP_BINARIES?.split(delimiter) || [primary, '/Applications/MAMP/bin/php/php8.4.17/bin/php']).filter(existsSync))];
assert(runtimes.length);
const report = [];
for (const php of runtimes) {
  const version = execFileSync(php, ['-n', '-r', 'echo PHP_VERSION;'], { encoding: 'utf8' });
  assert(/^8\.[45]\./.test(version));
  const tokens = JSON.parse(execFileSync(php, ['-n', ...tokenizerFlags(php), '-r', tokenize], { input: JSON.stringify(pairs.flatMap(p => [p.before, p.after])), env: {}, encoding: 'utf8', timeout: 5000, maxBuffer: 4 * 1024 * 1024 }));
  pairs.forEach((pair, i) => assert.deepEqual(tokens[i * 2 + 1], tokens[i * 2], `${version}: non-whitespace token change in ${pair.label}`));
  for (const unit of units) {
    const source = unit.kind === 'fragment' ? `<?php\nclass Sender\n{\n${unit.source}\n}\n` : unit.source;
    const lint = spawnSync(php, ['-n', '-l'], { input: source, env: {}, encoding: 'utf8', timeout: 5000 });
    assert.equal(lint.status, 0, `${unit.id}/${unit.path}: ${lint.stdout}${lint.stderr}`);
  }
  report.push({ php: version, formattedFiles: units.length, tokenEquivalentPairs: pairs.length, questionIds: questions.map(q => q.id), cleanupReview: 'Only the standalone unfilled template changed behavior. Every completed answer candidate has the same PHP token stream as before. The stem now instructs replacement of the comment alone.' });
  console.log(`✓ PHP ${version}: all 22 formatted files/fragments lint; ${pairs.length} token-equivalence pairs preserve literals/operators/statement order, including all completed CLEANUP candidates`);
}
if (process.env.WRITE_TEST_REPORT === '1') writeFileSync(new URL('after/formatting-results.json', root), JSON.stringify(report, null, 2) + '\n');
