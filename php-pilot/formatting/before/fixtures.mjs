// Independently stated oracles. Only reviewed PHP pilot sources/variants run.
export const OUTPUTS = {
  'PHP-PILOT-001': {key:'left-precedence',stdout:'{"timeout":0,"retries":2}'},
  'PHP-PILOT-003': {key:'named-breaks',stdout:'3|Error'},
  'PHP-PILOT-004': {key:'distinct',stdout:'guest|missing'},
  'PHP-PILOT-008': {key:'overwrite',stdout:'abXd'},
  'PHP-PILOT-010': {key:'closed',stdout:'closed'},
  'PHP-PILOT-011': {key:'reference-readonly',stdout:'4|Error'},
  'PHP-PILOT-014': {key:'trait-own',stdout:'trait|own'},
  'PHP-PILOT-016': {key:'separate',stdout:'3|2|1'},
  'PHP-PILOT-017': {key:'local-global',stdout:'99|3'},
  'PHP-PILOT-019': {key:'lookup-error',stdout:'Error'},
};
export const PATCHES = {
  'PHP-PILOT-002': {marker:'/* FIX */',key:'unset-reference',stdout:'[2,4,6]'},
  'PHP-PILOT-005': {marker:'/* REJECT */ false',key:'false-sentinel',stdout:'["accept:0","accept:7","reject","reject"]'},
  'PHP-PILOT-006': {marker:'/* ACCEPT */ false',key:'type-only',stdout:'[true,true,false,false]'},
  'PHP-PILOT-009': {marker:'/* CATCH */ Exception',key:'throwable',stdout:'["RuntimeException","TypeError"]',errors:{exception:'TypeError',error:'RuntimeException',runtime:'TypeError'}},
  'PHP-PILOT-012': {marker:'/* INITIALIZE */',key:'parent-init',stdout:'Ada:admin',errors:{'local-copy':'must not be accessed before initialization','new-parent':'must not be accessed before initialization'}},
  'PHP-PILOT-013': {marker:'/* EXPIRED */ false',key:'read-clock',stdout:'[false,true]'},
  'PHP-PILOT-015': {marker:'/* METHOD */',key:'instance',stdout:'mail:ready',errors:{static:'Cannot make non static method','required-argument':'must be compatible','return-int':'must be compatible'}},
  'PHP-PILOT-020': {marker:'/* CLEANUP */ fclose($handle);',key:'detach-local',stdout:'["alpha\\n","beta\\n"]',errors:{close:'TypeError'}},
};
export const TEST_CASES = {
  'PHP-PILOT-007': {key:'zero-line',cases:[
    {option:'zero-line',contents:'0',expected:['0']},
    {option:'empty-file',contents:'',expected:[]},
    {option:'newline',contents:'0\n',expected:['0\n']},
    {option:'ordinary',contents:'A',expected:['A']},
  ],from:'while ($line = fgets($handle))',to:'while (($line = fgets($handle)) !== false)'},
  'PHP-PILOT-018': {key:'equal',cases:[
    {option:'below',args:[100,99],expected:true},
    {option:'above',args:[100,101],expected:false},
    {option:'well-below',args:[100,1],expected:true},
    {option:'equal',args:[100,100],expected:true},
  ],from:'$amount < $balance',to:'$amount <= $balance'},
};

export function executableFiles(question, option) {
  const files = question.context.files.map(file=>({path:file.path,source:file.source,kind:file.kind}));
  if (question.id==='PHP-PILOT-015') {
    const members=files.pop();
    files.push({path:'main.php',kind:'complete-file',source:`<?php\nrequire __DIR__ . '/PrefixMessage.php';\nclass Sender {\n${members.source}\n}\necho (new Sender())->message();`});
  }
  if (option) {
    const patch=PATCHES[question.id];
    let replacements=0;
    for(const file of files) if(file.source.includes(patch.marker)) {
      file.source=file.source.replace(patch.marker,option.text); replacements++;
    }
    if(replacements!==1)throw new Error(`Expected one patch target: ${question.id}`);
  }
  return files;
}

export function testCaseFiles(question, sample, repaired=false) {
  const test=TEST_CASES[question.id];
  let source=question.context.files[0].source;
  if(repaired)source=source.replace(test.from,test.to);
  if(question.id==='PHP-PILOT-007') {
    const base64=Buffer.from(sample.contents).toString('base64');
    source+=`\n$h = fopen('php://memory', 'w+');\nfwrite($h, base64_decode('${base64}'));\nrewind($h);\n$result = readLines($h);\nfclose($h);\necho json_encode($result);`;
  } else source+=`\necho json_encode(canSpend(${sample.args.join(', ')}));`;
  return [{path:'main.php',kind:'complete-file',source}];
}
