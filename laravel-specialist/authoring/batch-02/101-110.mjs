import {q,file,output} from '../record.mjs';
export default [
q({n:101,type:'E',sub:'bail-attribute-boundary',needs:['Validator rule order','Closure rules'],why:'Trace stopping within one field while another field continues.',lessons:[6],docs:['validation#rule-bail'],ask:'Which closure names are printed after validation?',code:[file(String.raw`$calls = [];
$validator = validator(['quantity' => 'many', 'label' => 'Box'], [
    'quantity' => [
        'bail',
        'integer',
        function ($attribute, $value, $fail) use (&$calls): void {
            $calls[] = 'quantity';
        },
    ],
    'label' => [
        function ($attribute, $value, $fail) use (&$calls): void {
            $calls[] = 'label';
        },
    ],
]);

$validator->passes();
echo json_encode($calls);`)],choices:[['["label"]','The integer failure plus bail stops the remaining quantity rule; validation still proceeds to label.'],['[]','bail applies to its own attribute, not to every later attribute.'],['["quantity","label"]','The quantity closure follows a failed rule on an attribute with bail, so it is skipped.'],['["quantity"]','This reverses the stopping scope: the quantity closure is skipped and the independent label closure runs.']],test:output('["label"]')}),
q({n:102,type:'E',sub:'stop-first-after-callbacks',needs:['Global validation stopping','After callbacks'],why:'Distinguish the attribute-rule loop from the later after-callback phase.',lessons:[6],docs:['validation#manually-creating-validators','validation#performing-additional-validation'],ask:'Both input fields are invalid. Which error keys and after-callback flag are printed?',code:[file(String.raw`$ranAfter = false;
$validator = validator(['count' => 'many'], [
    'count' => ['integer'],
    'title' => ['required'],
])->stopOnFirstFailure();

$validator->after(function () use (&$ranAfter): void {
    $ranAfter = true;
});
$validator->passes();

echo json_encode([$validator->errors()->keys(), $ranAfter]);`)],choices:[['[["count"],true]','The count failure stops later attribute validation, but registered after callbacks still execute.'],['[["count","title"],true]','stopOnFirstFailure prevents the later title attribute from being validated after count fails.'],['[["count"],false]','Stopping attribute validation does not skip the separate after-callback phase.'],['[[],false]','The first failing rule still records its error; stopping does not discard it.']],test:output('[["count"],true]')}),
q({n:103,revision:2,type:'I',level:'F',sub:'sometimes-required-patch-field',needs:['PATCH semantics','Conditional validation'],why:'Allow omission while rejecting an explicitly empty replacement.',lessons:[5,6],docs:['validation#validating-when-present'],ask:'A PATCH endpoint permits omitting display_name to leave it unchanged. If supplied, it must be a nonempty string. Which rule set expresses that distinction?',choices:[['sometimes|required|string','sometimes skips an absent field; required rejects an explicitly empty value, and string constrains the supplied type.'],['sometimes|nullable|string','This allows omission but also permits an explicitly null value, violating the nonempty replacement requirement.'],['required|string','This rejects omission even though the endpoint permits leaving the field unchanged.'],['present|string','present requires the key on every request and string alone does not reject every empty string in this context.']],test:output('[true,false,true]',String.raw`$results = [];
foreach ([[], ['display_name' => ''], ['display_name' => 'Ada']] as $data) {
    $results[] = validator($data, ['display_name' => 'sometimes|required|string'])->passes();
}
echo json_encode($results);`)}),
q({n:104,type:'D',level:'F',sub:'nullable-normalized-date',needs:['Empty-string normalization','Nullable validation'],why:'Handle a deliberate null after middleware normalization without weakening valid-date checks.',lessons:[5,6,8],docs:['validation#a-note-on-optional-fields'],ask:'An optional published_at form field arrives as an empty string and normal middleware converts it to null. The rules contain only date, so the submitted null fails. Null should mean \"not scheduled\", while other supplied values must be dates. Which rules fit?',choices:[['nullable|date','nullable lets null bypass the non-implicit date rule while non-null values still undergo date validation.'],['sometimes|date','The field is present as null, so sometimes does not skip its date rule.'],['required|date','required rejects the intended null value rather than accepting an unscheduled state.'],['present|date','present checks key presence but does not permit null to bypass date validation.']],test:output('[false,true,false]',String.raw`echo json_encode([
    validator(['published_at' => null], ['published_at' => 'date'])->passes(),
    validator(['published_at' => null], ['published_at' => 'nullable|date'])->passes(),
    validator(['published_at' => 'not-a-date'], ['published_at' => 'nullable|date'])->passes(),
]);`)}),
q({n:105,revision:2,type:'R',level:'F',sub:'array-allowed-key-boundary',needs:['Nested arrays','Array validation rules'],why:'Reject an unexpected capability flag at the input boundary.',lessons:[6],docs:['validation#rule-array'],ask:'A profile object may contain only name and timezone. Extra keys must produce validation errors, not be silently dropped. Which parent rule enforces this allowlist alongside child rules?',choices:[['profile => array:name,timezone','The array rule with named allowed keys rejects additional keys within profile.'],['profile => array','The plain array rule checks the value type but does not restrict its keys.'],['profile => required_array_keys:name,timezone','This requires listed keys but does not reject additional ones.'],['profile => nullable','Nullable addresses nullability, not the keys of a supplied object.']],test:output('[true,false]',String.raw`$rules = ['profile' => 'array:name,timezone'];
echo json_encode([
    validator(['profile' => ['name' => 'Ada']], $rules)->passes(),
    validator(['profile' => ['name' => 'Ada', 'is_admin' => true]], $rules)->passes(),
]);`)}),
q({n:106,type:'T',level:'F',sub:'wildcard-error-concrete-index',needs:['Nested wildcard rules','Error bags'],why:'Assert the actual failing item rather than a wildcard or neighboring field.',lessons:[6],docs:['validation#validating-nested-array-input'],ask:'For items.*.sku => required, items[0].sku is \"A1\" and items[1].sku is \"\". Which error key should an API test assert?',choices:[['items.1.sku','Wildcard validation expands to the concrete zero-based index of the failing second item.'],['items.*.sku','The rule uses a wildcard, but the resulting field error identifies the concrete item.'],['items.2.sku','The submitted PHP array is zero-based; the second item has index 1.'],['sku.1.items','Error paths preserve the nesting order of the input and rule.']],test:output('["items.1.sku"]',String.raw`$v = validator(['items' => [['sku' => 'A1'], ['sku' => '']]], ['items.*.sku' => 'required']);
$v->passes();
echo json_encode($v->errors()->keys());`)}),
q({n:107,type:'E',sub:'distinct-strict-comparison',needs:['Array validation','Strict PHP comparisons'],why:'Distinguish equal numeric representations from identical typed values.',lessons:[6],docs:['validation#rule-distinct'],ask:'The data is supplied directly as PHP values, with no integer rule or casts. Which pair of validation results is printed?',code:[file(String.raw`$data = ['codes' => [4, '4']];
$loose = validator($data, ['codes.*' => 'distinct'])->passes();
$strict = validator($data, ['codes.*' => 'distinct:strict'])->passes();

echo json_encode([$loose, $strict]);`)],choices:[['[false,true]','Default distinct compares loosely, while strict distinct treats integer 4 and string \"4\" as different typed values.'],['[false,false]','Strict distinct does not coerce the string into an integer before comparison.'],['[true,true]','The default loose comparison considers these two numeric representations equal.'],['[true,false]','This reverses the effect of strict comparison for values with different types.']],test:output('[false,true]')}),
q({n:108,type:'I',level:'F',sub:'affirmative-consent-rule',needs:['Boolean input','Accepted validation'],why:'Require assent rather than merely a valid boolean representation.',lessons:[6],docs:['validation#rule-accepted'],ask:'A registration form must require affirmative consent. The submitted string \"0\" must fail, while an ordinary checked checkbox value \"on\" must pass. Which rule matches?',choices:[['accepted','accepted requires one of the affirmative representations, including on, and rejects 0.'],['boolean','The boolean rule accepts false representations such as 0 and does not express required assent.'],['required','A supplied nonempty 0 value can satisfy required; that does not establish consent.'],['present','A present key says nothing about whether its value represents agreement.']],test:output('[false,true]',String.raw`echo json_encode([
    validator(['consent' => '0'], ['consent' => 'accepted'])->passes(),
    validator(['consent' => 'on'], ['consent' => 'accepted'])->passes(),
]);`)}),
q({n:109,type:'I',level:'F',sub:'discriminator-required-field',needs:['Conditional requirements','Discriminator fields'],why:'Require a value only for the business mode that needs it.',lessons:[6],docs:['validation#rule-required-if'],ask:'The valid delivery values are email and pickup. address is required for email delivery, but may be omitted for pickup. Which rule makes that conditional requirement?',choices:[['required_if:delivery,email','The address becomes required when delivery equals email.'],['required_with:delivery','delivery is present for both modes, so this would require address for pickup too.'],['required_unless:delivery,email','This requires address when delivery is not email, reversing the condition.'],['present_if:delivery,email','Presence alone permits an empty address and does not enforce the required nonempty value.']],test:output('[false,true,true]',String.raw`$rules = ['delivery' => 'required|in:email,pickup', 'address' => 'required_if:delivery,email'];
echo json_encode([
    validator(['delivery' => 'email'], $rules)->passes(),
    validator(['delivery' => 'pickup'], $rules)->passes(),
    validator(['delivery' => 'email', 'address' => 'ada@example.test'], $rules)->passes(),
]);`)}),
q({n:110,type:'E',sub:'alternative-contact-required-without',needs:['Conditional field requirements','Required emptiness'],why:'Check a pair of alternative fields without incorrectly making them exclusive.',lessons:[6],docs:['validation#rule-required-without'],ask:'With these rules, which of the following payloads fails validation?',code:[file(String.raw`$rules = [
    'email' => ['required_without:phone'],
    'phone' => ['required_without:email'],
];`)],choices:[['Both email and phone are omitted.','Each field becomes required because the other is missing, so this payload has no acceptable contact method.'],['Only email is supplied as a nonempty string.','A present email satisfies its own requirement and removes the conditional requirement for phone.'],['Only phone is supplied as a nonempty string.','A present phone satisfies its own requirement and removes the conditional requirement for email.'],['Both email and phone are nonempty strings.','required_without requires an alternative when missing; it does not prohibit supplying both.']],test:output('[false,true,true,true]',String.raw`require getcwd().'/probe.php';
$results = [];
foreach ([[], ['email' => 'a@example.test'], ['phone' => '123'], ['email' => 'a@example.test', 'phone' => '123']] as $data) {
    $results[] = validator($data, $rules)->passes();
}
echo json_encode($results);`)}),
];
