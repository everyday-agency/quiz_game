import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';

// Keep -n isolation on builds where tokenizer is a shared rather than built-in module.
// Only the trusted tokenizer module is loaded; source text is parsed, never evaluated.
export function tokenizerFlags(php) {
  const probe = JSON.parse(execFileSync(php, ['-n', '-r', 'echo json_encode([function_exists("token_get_all"), ini_get("extension_dir")]);'], {env:{},encoding:'utf8',timeout:5000}));
  if (probe[0]) return [];
  const module = join(probe[1], 'tokenizer.so');
  assert(existsSync(module), `Install the trusted tokenizer extension for ${php}`);
  return ['-d', `extension=${module}`];
}
