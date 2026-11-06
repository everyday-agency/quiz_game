import {q,file,output} from '../record.mjs';
export default [
q({n:111,revision:2,type:'E',level:'F',sub:'prohibited-field-not-discarded',needs:['Conditional prohibition','Validation failure'],why:'Separate rejecting forbidden data from excluding it from the validated result.',lessons:[6],docs:['validation#rule-prohibited-if'],ask:'The caller sends a nonempty trial_days value for a free plan. What does validation report?',code:[file(String.raw`$validator = validator(
    ['plan' => 'free', 'trial_days' => 5],
    [
        'plan' => ['required', 'in:free,paid'],
        'trial_days' => ['prohibited_if:plan,free'],
    ],
);
$validator->passes();

echo json_encode($validator->errors()->keys());`)],choices:[['["trial_days"]','The prohibition condition is true and trial_days is nonempty, so it produces an error.'],['[] because trial_days is silently removed','prohibited_if rejects the supplied nonempty value; exclude_if would instead remove an inapplicable field.'],['["plan"]','free is an allowed plan value; it activates the separate trial_days prohibition.'],['["plan","trial_days"]','The trial_days failure does not make the valid plan field fail too.']],test:output('["trial_days"]')}),
q({n:112,type:'E',sub:'exclude-inapplicable-validated-data',needs:['Conditional exclusion','Validated payload'],why:'Trace an exclusion before later rules and payload extraction.',lessons:[6],docs:['validation#rule-exclude-if'],ask:'What validated payload does this code print?',code:[file(String.raw`$validator = validator(
    ['delivery' => 'pickup', 'address' => ['unexpected']],
    [
        'delivery' => ['required', 'in:pickup,shipping'],
        'address' => ['exclude_if:delivery,pickup', 'required', 'string'],
    ],
);

echo json_encode($validator->validated());`)],choices:[['{"delivery":"pickup"}','The matching exclusion removes address from validation and the validated output before its later rules run.'],['{"delivery":"pickup","address":null}','Exclusion removes the key rather than replacing its value with null.'],['{"delivery":"pickup","address":["unexpected"]}','The excluded address is not returned as validated data.'],['A validation exception for the address string rule','The earlier matching exclusion stops processing that attribute, so its string rule is not applied.']],test:output('{"delivery":"pickup"}')}),
q({n:113,type:'D',sub:'regex-pipe-rule-parsing',needs:['Regex alternation','Rule-array parsing'],why:'Keep a regex alternation separate from the validation rule delimiter.',lessons:[6],docs:['validation#rule-regex'],ask:'A code must be exactly two uppercase letters OR four digits. The regex /^([A-Z]{2}|[0-9]{4})$/ is correct, but embedding it in one pipe-delimited rule string splits the regex. Which repair preserves that expression?',choices:[['Use [\"required\", \"regex:/^([A-Z]{2}|[0-9]{4})$/\"].','Array-form rules keep the full regex in one element, so its alternation pipe is not treated as a rule separator.'],['Use required|regex:/^[A-Z]{2}$/|regex:/^[0-9]{4}$/.','Separate regex rules are conjunctive; the input would have to satisfy both incompatible shapes.'],['Use [\"required\", \"not_regex:/^([A-Z]{2}|[0-9]{4})$/\"].','not_regex rejects the very shapes the requirement allows.'],['Escape the alternation as a literal pipe inside the original regex.','A literal pipe changes the accepted language instead of preserving the required alternatives.']],test:output('[true,true,false]',String.raw`$rules = ['code' => ['required', 'regex:/^([A-Z]{2}|[0-9]{4})$/']];
$results = [];
foreach (['AB', '1234', 'AB12'] as $value) {
    $results[] = validator(['code' => $value], $rules)->passes();
}
echo json_encode($results);`)}),
q({n:114,revision:2,type:'E',level:'F',sub:'backed-enum-rule-values',needs:['PHP backed enums','Enum validation rules'],why:'Distinguish a case name from its backed input value.',lessons:[6],docs:['validation#rule-enum'],ask:'Which submitted string passes the state rule?',code:[file(String.raw`use Illuminate\Validation\Rule;

enum ShipmentState: string
{
    case Waiting = 'queued';
    case Sent = 'sent';
}

$rules = ['state' => ['required', Rule::enum(ShipmentState::class)]];`)],choices:[['queued','The rule accepts a valid backed value, and queued is the value of ShipmentState::Waiting.'],['Waiting','Waiting is the PHP case name, not its backed string value.'],['ShipmentState::Waiting','A textual PHP expression is not evaluated into an enum case during input validation.'],['waiting','Backed enum values are not automatically lowercased from the case name; waiting is not a declared value.']],test:output('[true,false,false,false]',String.raw`require getcwd().'/probe.php';
$results = [];
foreach (['queued', 'Waiting', 'ShipmentState::Waiting', 'waiting'] as $value) {
    $results[] = validator(['state' => $value], $rules)->passes();
}
echo json_encode($results);`)}),
q({n:115,revision:2,type:'T',level:'F',sub:'date-comparison-equality-boundary',needs:['Date validation','Inclusive date comparisons'],why:'Test the equality boundary that distinguishes inclusive from strict ordering.',lessons:[6],docs:['validation#rule-after-or-equal'],ask:'A date range may start and end on the same day, but may not end earlier. A developer changes end from after_or_equal:start to after:start. Which previously valid case detects that regression?',choices:[['start=2030-04-10, end=2030-04-10','Equality passes the inclusive rule but fails the strictly-after rule.'],['start=2030-04-10, end=2030-04-11','A later date passes both rules, so it does not reveal the change.'],['start=2030-04-10, end=2030-04-09','An earlier date fails both rules and therefore does not distinguish the regression.'],['start=2030-04-10, end=not-a-date','Invalid date text is rejected regardless of the equality policy.']],test:output('[true,false]',String.raw`$data = ['start' => '2030-04-10', 'end' => '2030-04-10'];
echo json_encode([
    validator($data, ['start' => 'date', 'end' => 'date|after_or_equal:start'])->passes(),
    validator($data, ['start' => 'date', 'end' => 'date|after:start'])->passes(),
]);`)}),
q({n:116,type:'D',level:'F',sub:'confirmation-field-convention',needs:['Confirmed validation','Password-change forms'],why:'Distinguish confirmation of new input from verifying an existing account secret.',lessons:[6],docs:['validation#rule-confirmed'],ask:'A new-password form submits password and confirm_password with matching strings. The password rule is confirmed, with no custom confirmation-field parameter. Validation fails. Which input change matches the default convention?',choices:[['Rename confirm_password to password_confirmation.','The default confirmed rule compares password with the field named password_confirmation.'],['Rename confirm_password to current_password.','Current-password verification is a different concern and is not the default confirmation field.'],['Hash confirm_password before submitting it.','Confirmation compares the two supplied values; hashing one changes its value rather than fixing the field name.'],['Move confirm_password into an Authorization header.','The confirmed rule looks for its companion validation-data field, not a credential header.']],test:output('[false,true]',String.raw`echo json_encode([
    validator(['password' => 'new-secret', 'confirm_password' => 'new-secret'], ['password' => 'confirmed'])->passes(),
    validator(['password' => 'new-secret', 'password_confirmation' => 'new-secret'], ['password' => 'confirmed'])->passes(),
]);`)}),
q({n:117,type:'E',sub:'size-rule-type-semantics',needs:['Numeric rules','String-length validation'],why:'Determine which measure a size rule applies after type rules are present.',lessons:[6],docs:['validation#rule-max'],ask:'The input value is the string \"100\". Which pair is printed?',code:[file(String.raw`$data = ['quantity' => '100'];

echo json_encode([
    validator($data, ['quantity' => 'string|max:3'])->passes(),
    validator($data, ['quantity' => 'numeric|max:3'])->passes(),
]);`)],choices:[['[true,false]','The string has three characters, but its numeric value is 100, above the numeric maximum of 3.'],['[false,false]','The string rule makes max measure string length, which is exactly 3.'],['[true,true]','The numeric rule makes max compare the numeric value rather than the number of digits.'],['[false,true]','This reverses string-length and numeric-value sizing.']],test:output('[true,false]')}),
q({n:118,revision:2,type:'I',level:'F',sub:'list-consecutive-keys',needs:['PHP arrays','List validation'],why:'Reject a non-list shape instead of silently normalizing it.',lessons:[6],docs:['validation#rule-list'],ask:'An API requires items to have consecutive numeric keys starting at zero. The directly decoded input [1 => \"A\", 2 => \"B\"] must be rejected, not reindexed. Which rules enforce the shape?',choices:[['required|array|list','list requires consecutive numeric keys starting at zero, in addition to the array requirement.'],['required|array','An array can have arbitrary keys, so this permits the invalid shape.'],['required|array|min:2','The payload already has two entries; a count minimum does not establish its key sequence.'],['Apply array_values before using required|array.','Reindexing transforms the invalid shape into a list instead of rejecting it as required.']],test:output('[false,true]',String.raw`echo json_encode([
    validator(['items' => [1 => 'A', 2 => 'B']], ['items' => 'required|array|list'])->passes(),
    validator(['items' => ['A', 'B']], ['items' => 'required|array|list'])->passes(),
]);`)}),
q({n:119,type:'T',sub:'decimal-scale-and-range',needs:['Decimal representations','Numeric range rules'],why:'Test both exact decimal scale and a separate nonnegative-value condition.',lessons:[6],docs:['validation#rule-decimal','validation#rule-min'],ask:'A form requires a nonnegative price written with exactly two decimal places. Values remain strings. Under numeric|decimal:2|min:0, which result sequence applies to \"12.3\", \"12.30\", and \"-1.00\"?',choices:[['fail, pass, fail','The first lacks two decimal places, the second satisfies both scale and range, and the third violates the minimum.'],['pass, pass, fail','decimal:2 requires exactly two places, not at most two.'],['fail, pass, pass','A correctly formatted negative value still violates min:0.'],['pass, fail, fail','A trailing zero is valid and meaningful for the required input scale; the shorter representation lacks it.']],test:output('[false,true,false]',String.raw`$results = [];
foreach (['12.3', '12.30', '-1.00'] as $price) {
    $results[] = validator(['price' => $price], ['price' => 'numeric|decimal:2|min:0'])->passes();
}
echo json_encode($results);`)}),
q({n:120,type:'R',sub:'upload-content-versus-client-extension',needs:['Uploaded files','MIME validation','Untrusted client metadata'],why:'Base acceptance on inspected content instead of attacker-controlled filename and MIME declarations.',docs:['validation#rule-mimes','validation#validating-file-types'],ask:'An upload is named avatar.png and the client declares image/png, but its bytes are plain text. A valid UploadedFile reaches the action. What should a file|mimes:png rule do?',choices:[['Reject it because the content-derived type is not PNG.','The mimes rule checks the file content-derived type/extension relationship, not just its original filename or declared client MIME type.'],['Accept it because the filename ends in .png.','The client-controlled filename is not sufficient evidence of the file content type.'],['Accept it because the client sent Content-Type: image/png.','A client MIME declaration can be spoofed and is not the authoritative check used here.'],['Rename the file to .txt and accept it automatically.','Validation does not repair or rename the upload as a substitute for satisfying the rule.']],test:output('false',String.raw`$path = getcwd().'/upload.txt';
file_put_contents($path, 'This is a plain text invoice.');
$file = new Illuminate\Http\UploadedFile($path, 'avatar.png', 'image/png', null, true);
echo json_encode(validator(['avatar' => $file], ['avatar' => 'file|mimes:png'])->passes());`)}),
];
