import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {adaptExpansionQuestion} from '../js/php-expansion/adapter.mjs';
const root=new URL('../',import.meta.url);
const read=p=>JSON.parse(readFileSync(new URL(p,root)));
const records=[];
for(let batch=1;batch<=6;batch++){
  const questions=(await import(`../js/php-expansion/batches/batch-${String(batch).padStart(2,'0')}.mjs`)).default;
  const gate=read(`php-expansion/evidence/batch-${batch}-acceptance.json`);
  assert.equal(gate.disposition,'accepted-for-review');assert.equal(gate.productionActivation,false);
  assert.equal(createHash('sha256').update(JSON.stringify(questions)).digest('hex'),gate.publishedRecordsSha256);
  records.push(...questions.map(adaptExpansionQuestion));
}
assert.equal(records.length,600);
writeFileSync(new URL('js/php-expansion/review-data.mjs',root),'// Generated runtime projection of six locally validated batches; independent approval pending.\nexport default '+JSON.stringify(records)+';\n');
writeFileSync(new URL('js/php-expansion/lessons.mjs',root),'// User-supplied working outline; not a canonical curriculum.\nexport default '+JSON.stringify(read('js/php-expansion/curriculum.json').workingLessons)+';\n');
console.log('Prepared 600 review-only runtime records; no activation or deployment.');
