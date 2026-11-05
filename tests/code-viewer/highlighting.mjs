import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { highlightSource } from '../../js/code-highlighting.mjs';
import { QUESTION_BANK } from '../../js/questions.mjs';
import { PHP_PILOT_BANK } from '../../js/php-pilot/questions.mjs';

const manifest = JSON.parse(readFileSync(new URL('../../js/vendor/highlightjs/provenance.json', import.meta.url)));
for (const file of manifest.files) {
  const bytes = readFileSync(new URL('../../js/vendor/highlightjs/' + file.path, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
}

let sources = 0;
for (const question of [...QUESTION_BANK, ...PHP_PILOT_BANK]) {
  if (!question.code) continue;
  for (const file of question.code.files || [{ snippet: question.code.snippet }]) {
    const tokens = highlightSource(file.snippet, question.code.language);
    assert.equal(tokens.map(token => token.text).join(''), file.snippet, `${question.id}: source changed`);
    if (question.code.language === 'php') assert(tokens.some(token => token.classes), `${question.id}: PHP highlighting fell back`);
    sources++;
  }
}

const source = `<?php
namespace Demo;
// return $commentValue 99
final class Reader {
    private int $value = 42;
    public function read(): string { return "class $this->value"; }
}
$reader = new Reader();
echo strlen('function $literal'), $reader->read();
`;
const tokens = highlightSource(source, 'PHP');
const scoped = (text, scope) => tokens.some(token => token.text === text && token.classes.split(' ').includes(scope));
for (const word of ['namespace', 'final', 'class', 'private', 'public', 'function', 'return']) assert(scoped(word, 'hljs-keyword'), word);
assert(scoped('$value', 'hljs-variable'));
assert(scoped('42', 'hljs-number'));
assert(scoped('Reader', 'hljs-title'));
assert(scoped('strlen', 'invoke__'));
assert(scoped('read', 'invoke__'));
assert(tokens.some(t => t.classes.includes('hljs-comment') && t.text.includes('return $commentValue 99')));
assert(tokens.some(t => t.classes.includes('hljs-string') && t.text.includes('function $literal')));

for (const fixture of [
  '', '\t\r\n  \n', '<?php\r\n\t$value = "<&>\\\" &amp; &lt; &#x27;";\r\n',
  '<?php\n$text = <<<TEXT\n  return $name;\nTEXT;\n',
  "<?php\n$text = <<<'TEXT'\n  return $name;\nTEXT;\n",
  '<?php\n/* </code><img src=x onerror="alert(1)"><script>alert(2)</script> */\necho "&lt;script&gt;";',
  'use PrefixMessage;\n/* METHOD */',
  '<?php\n#[Example] final readonly class Label { public function __construct(public string $label) {} }',
]) {
  assert.equal(highlightSource(fixture, 'php').map(token => token.text).join(''), fixture);
}
const plain = '<img src=x onerror="alert(1)">\n  unchanged\t';
assert.deepEqual(highlightSource(plain, 'unknown'), [{ text: plain, classes: '' }]);
console.log(`✓ Code viewer: ${sources} existing/pilot source units retained exactly; PHP token categories, fragments, CRLF/tabs, entities, injection strings and vendor hashes checked`);
