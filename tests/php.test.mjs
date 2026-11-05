import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { QUESTION_BANK } from '../release/archive/pre-php-only/js/questions.mjs';
import { PILOT_IDS } from '../js/bank/pilot.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = data => createHash('sha256').update(data).digest('hex');
const readJSON = path => JSON.parse(readFileSync(join(root, path), 'utf8'));
const allowlist = readJSON('tests/fixtures/execution-allowlist.json');
const reference = readJSON('tests/fixtures/laravel-13.0.0/manifest.json');
assert.equal(hash(readFileSync(join(root,'tests/fixtures/laravel-13.0.0/methods.json'))), reference.methodsSha256, 'Upstream probe methods changed');

const primary = process.env.PHP_BIN || execFileSync('/bin/sh', ['-c','command -v php'], {encoding:'utf8'}).trim();
const candidates = process.env.PHP_BINARIES?.split(delimiter) || [primary, '/Applications/MAMP/bin/php/php8.4.17/bin/php'];
const runtimes = [...new Set(candidates.filter(existsSync))];
assert(runtimes.length, 'PHP is required: set PHP_BIN or PHP_BINARIES');

const disabled = [
  'exec','system','shell_exec','passthru','popen','proc_open','pcntl_exec',
  'fsockopen','pfsockopen','stream_socket_client','stream_socket_server','stream_socket_accept',
  'socket_create','socket_connect','curl_exec','curl_multi_exec','mail',
  'getenv','putenv','ini_set','ini_alter','dl','symlink','link',
].join(',');
const safeFlags = ['-n','-d','pcre.jit=0','-d','error_reporting=-1','-d','display_errors=stderr','-d','log_errors=0','-d','memory_limit=32M','-d','max_execution_time=2','-d','allow_url_fopen=0','-d','allow_url_include=0','-d',`disable_functions=${disabled}`];

function lintSource(file) {
  let snippet = file.snippet;
  if (file.kind === 'laravel-fragment' && /^\s*(public|protected|private)\s+function\b/.test(snippet)) snippet = `class FragmentFixture {\n${snippet}\n}`;
  return snippet.startsWith('<?php') ? snippet : `<?php\n${snippet}`;
}
const filesToLint = new Map();
for (const question of QUESTION_BANK.filter(q => q.track === 'PHP' || (q.track === 'Laravel' && q.revision > 1))) {
  for (const file of question.code?.files || (question.code ? [{snippet:question.code.snippet,kind:'php-file'}] : [])) {
    const source = lintSource(file);
    const entry = filesToLint.get(source) || {ids:[],kind:file.kind};
    entry.ids.push(question.id);
    filesToLint.set(source, entry);
  }
}
// Never execute the bank indiscriminately. Only these reviewed code hashes run.
assert.equal(allowlist.length, 12);
assert.deepEqual(new Set(allowlist.map(q=>q.id)), new Set(QUESTION_BANK.filter(q=>PILOT_IDS.includes(q.id)&&q.validation.kind==='php-output').map(q=>q.id)));
const results = [];
for (const php of runtimes) {
  const version = execFileSync(php, ['-n','-r','echo PHP_VERSION;'], {encoding:'utf8'});
  assert(/^8\.[45]\./.test(version), `Use PHP 8.4/8.5 for these versioned fixtures, found ${version}`);
  for (const [source, metadata] of filesToLint) {
    const result = spawnSync(php, [...safeFlags,'-l'], {input:source,encoding:'utf8',env:{},timeout:5000});
    assert.equal(result.status, 0, `${metadata.ids.join(', ')} (${metadata.kind}) lint: ${result.stdout}${result.stderr}`);
  }
  const outputs = [];
  for (const approved of allowlist) {
    const question = QUESTION_BANK.find(q=>q.id===approved.id);
    assert.equal(hash(JSON.stringify(question.code.files)), approved.filesSha256, `Unreviewed executable change: ${question.id}`);
    assert.equal(question.coreOptions[question.answer], approved.correctOption, `Key changed without review: ${question.id}`);
    const dir = mkdtempSync(join(tmpdir(),'quiz-php-fixture-'));
    try {
      for (const file of question.code.files) {
        assert(/^[a-zA-Z0-9_-]+\.php$/.test(file.name), 'Unsafe fixture filename');
        writeFileSync(join(dir,file.name),file.snippet);
      }
      const entry = question.validation.entryFile || 'main.php';
      assert(question.code.files.some(file=>file.name===entry));
      const run = spawnSync(php, [...safeFlags,'-d',`open_basedir=${dir}`,join(dir,entry)], {cwd:dir,encoding:'utf8',env:{},timeout:5000,maxBuffer:1024*1024});
      assert.equal(run.status,0,`${question.id}: ${run.stdout}${run.stderr}`);
      assert.equal(run.stdout,approved.stdout,`${question.id}: unexpected output`);
      if (approved.diagnostic === 'fgetcsv-escape-deprecation') {
        assert.match(run.stderr,/Deprecated: fgetcsv\(\): .*escape/);
        assert(!/Warning:|Fatal error:|Notice:/.test(run.stderr));
      } else assert.equal(run.stderr,'',`${question.id}: unexpected diagnostic`);
      outputs.push({id:question.id,stdout:run.stdout,diagnostic:approved.diagnostic || null});
    } finally { rmSync(dir,{recursive:true,force:true}); }
  }
  const probeIds = ['LQ-489','LQ-545','LQ-046','LQ-314','LQ-453'];
  const fragments = Object.fromEntries(probeIds.map(id=>[id,QUESTION_BANK.find(q=>q.id===id).code.files[0].snippet]));
  const contract = spawnSync(php, [...safeFlags,'-d',`open_basedir=${join(root,'tests')}`,join(root,'tests/laravel-contracts.php')], {input:JSON.stringify(fragments),encoding:'utf8',env:{},timeout:5000});
  assert.equal(contract.status,0,`Laravel contract probe: ${contract.stdout}${contract.stderr}`);
  assert.equal(contract.stderr,'');
  const contracts = JSON.parse(contract.stdout);
  for (const question of QUESTION_BANK.filter(q=>PILOT_IDS.includes(q.id)&&q.validation.kind==='laravel-contract')) {
    assert(contracts.checks.some(name=>name===question.validation.case || name.startsWith(question.validation.case+':')), `Missing contract check: ${question.id}`);
  }
  results.push({php:version,lintedDistinctSources:filesToLint.size,executedPilotFixtures:outputs,laravel:contracts});
  console.log(`✓ PHP ${version}: ${filesToLint.size} distinct source/fragment lint checks, 12 isolated pilot executions, ${contracts.checks.length} pinned Laravel contract assertions`);
}
if (process.env.WRITE_TEST_REPORT === '1') writeFileSync(join(root,'remediation/php-results.json'),JSON.stringify(results,null,2)+'\n');
