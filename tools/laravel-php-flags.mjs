// Trusted CLI extensions only. Preserve -n and snippet sandboxing on both macOS
// (built-in extensions) and Linux CI (shared extensions); never read snippet config.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
const cache=new Map();
export function laravelPhpFlags(php){
 if(cache.has(php))return cache.get(php);
 const configured=JSON.parse(execFileSync(php,['-r','echo json_encode(["dir"=>ini_get("extension_dir"),"modules"=>get_loaded_extensions()]);'],{encoding:'utf8'}));
 const builtIn=JSON.parse(execFileSync(php,['-n','-r','echo json_encode(get_loaded_extensions());'],{encoding:'utf8'})).map(s=>s.toLowerCase());
 const required=['ctype','dom','fileinfo','iconv','mbstring','openssl','pdo','pdo_sqlite','session','tokenizer','xml','xmlwriter','intl','bcmath','sodium'];
 const flags=[];
 for(const name of required){
  if(builtIn.includes(name))continue;
  const path=join(configured.dir,name+'.so');
  assert(existsSync(path),'Required trusted PHP extension missing: '+path);
  flags.push('-d','extension='+path);
 }
 cache.set(php,flags);return flags;
}
