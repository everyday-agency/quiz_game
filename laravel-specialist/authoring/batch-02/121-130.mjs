import {q,file,output,contract} from '../record.mjs';
export default [
q({n:121,revision:2,type:'I',sub:'image-dimensions-versus-size',needs:['Uploaded image validation','Pixel dimensions','File size'],why:'Enforce a visual constraint independently of byte size and content type.',docs:['validation#rule-dimensions'],ask:'An avatar must be a valid image no larger than 200 KB and at least 100 by 100 pixels. The current image|max:200 rules accept a tiny 30 by 20 PNG. Which additional rule enforces the missing requirement?',choices:[['dimensions: minimum width and height of 100 pixels','The dimensions rule checks image pixel dimensions, complementing the image-content and byte-size checks.'],['min: a minimum file size of 100 kilobytes','For an uploaded file, min measures file size in kilobytes, not width or height.'],['mimes: restrict content types to PNG and JPEG','Allowed file types do not establish minimum pixel dimensions.'],['size: require exactly 100 kilobytes','For a file, size requires a particular file size rather than a 100-pixel dimension.']],test:output('[false,true]',String.raw`$results = [];
foreach ([[30, 20], [100, 100]] as $i => [$width, $height]) {
    $image = imagecreatetruecolor($width, $height);
    $path = getcwd().'/image-'.$i.'.png';
    imagepng($image, $path);
    unset($image);
    $file = new Illuminate\Http\UploadedFile($path, 'avatar.png', null, null, true);
    $results[] = validator(['avatar' => $file], ['avatar' => 'image|max:200|dimensions:min_width=100,min_height=100'])->passes();
}
echo json_encode($results);`)}),
q({n:122,type:'E',sub:'per-item-conditional-validation',needs:['Nested arrays','Conditional validation callbacks','Fluent input'],why:'Apply a condition to each current item rather than the entire collection.',lessons:[6],docs:['validation#complex-conditional-array-validation'],ask:'Which field receives an email-validation error?',code:[file(String.raw`use Illuminate\Support\Fluent;

$validator = validator([
    'channels' => [
        ['type' => 'email', 'address' => 'not-an-email'],
        ['type' => 'other', 'address' => 'not-an-email'],
    ],
], [
    'channels.*.address' => ['required', 'string'],
]);
$validator->sometimes(
    'channels.*.address',
    'email',
    fn (Fluent $input, Fluent $item) => $item->type === 'email',
);
$validator->passes();

echo json_encode($validator->errors()->keys());`)],choices:[['["channels.0.address"]','The callback sees each current item; only the first has type=email and receives the added email rule.'],['["channels.0.address","channels.1.address"]','The email rule is added conditionally per item, not to every address once any email channel exists.'],['[]','The first item satisfies the condition and its address fails the added email rule.'],['["channels.address"]','Wildcard expansion reports the concrete indexed attribute rather than removing the item index.']],test:output('["channels.0.address"]')}),
q({n:123,type:'D',sub:'after-callback-error-recording',needs:['After validation callbacks','MessageBag errors'],why:'Make a domain check affect validation by recording an error rather than returning a boolean.',lessons:[6],docs:['validation#performing-additional-validation'],ask:'Base rules pass. An after callback detects that requested seats exceed a fixed capacity, but it merely returns false and passes() still returns true. Which callback action makes this a validation failure while preserving existing rule errors?',choices:[['Add a seats message through $validator->errors()->add(\"seats\", ...).','The validator determines failure from its error bag; adding a message records the domain failure alongside any existing errors.'],['Return false again from a second after callback.','The callback return value is not used as an implicit validation error.'],['Throw a RuntimeException with the message instead.','That changes the flow to an application exception rather than recording an ordinary validation error.'],['Replace the validator with a new empty validator inside the callback.','Creating another object does not add an error to the validator whose result the caller checks.']],test:output('[true,false]',String.raw`$a = validator(['seats' => 8], ['seats' => 'integer']);
$a->after(fn () => false);
$b = validator(['seats' => 8], ['seats' => 'integer']);
$b->after(function ($validator): void {
    $validator->errors()->add('seats', 'Capacity exceeded.');
});
echo json_encode([$a->passes(), $b->passes()]);`)}),
q({n:124,type:'D',sub:'data-aware-rule-interface',needs:['Custom validation rules','DataAwareRule','Non-HTTP validation'],why:'Use the validator contract to populate related data instead of relying on method naming alone.',lessons:[6],docs:['validation#accessing-additional-data'],ask:'A custom rule implements ValidationRule and defines setData(array $data), but does not implement DataAwareRule. An import calls Validator::make with a dataset that includes budget. The rule\'s data property remains empty. What makes Laravel supply that validator dataset automatically?',choices:[['Also implement Illuminate\\Contracts\\Validation\\DataAwareRule.','The validator checks that interface before invoking setData with the data being validated.'],['Make the data property public without changing the implemented interfaces.','Property visibility does not opt the rule into the validator\'s data-aware contract.'],['Rename setData to prepareForValidation.','prepareForValidation is a Form Request lifecycle hook, not the custom-rule data contract.'],['Read request()->input(\"budget\") inside validate instead.','The import dataset is independent of any HTTP request; global request input is not its authoritative source.']],test:output('12',String.raw`class BudgetRule implements Illuminate\Contracts\Validation\ValidationRule, Illuminate\Contracts\Validation\DataAwareRule
{
    public array $data = [];
    public function setData(array $data): static
    {
        $this->data = $data;
        return $this;
    }
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
    }
}
$rule = new BudgetRule();
validator(['budget' => 12, 'spend' => 5], ['spend' => [$rule]])->passes();
echo $rule->data['budget'];`)}),
q({n:125,type:'I',level:'F',sub:'nested-custom-message-key',needs:['Wildcard attributes','Custom validation messages'],why:'Target one rule on every nested SKU without replacing unrelated messages.',lessons:[6],docs:['validation#customizing-the-error-messages'],ask:'The rules include items.*.sku => required. A custom messages array should replace only that nested required message with \"Each item needs a SKU.\" Which key targets it?',choices:[['items.*.sku.required','Custom message keys identify the attribute pattern followed by the rule name.'],['required.items.*.sku','This reverses the attribute-and-rule order used for matching custom messages.'],['items.sku.required','Without the wildcard item index, this does not match items.0.sku and similar concrete fields.'],['items.*.required.sku','This places required inside the attribute path rather than as the rule suffix.']],test:output('Each item needs a SKU.',String.raw`$v = validator(['items' => [['sku' => '']]], ['items.*.sku' => 'required'], ['items.*.sku.required' => 'Each item needs a SKU.']);
$v->passes();
echo $v->errors()->first('items.0.sku');`)}),
q({n:126,revision:2,type:'E',level:'F',sub:'named-error-bag-isolation',needs:['Validation error bags','Multiple forms'],why:'Read the intended form\'s message without falling back to the default bag.',lessons:[4,6],docs:['validation#named-error-bags'],ask:'A view has an errors ViewErrorBag containing default.email=\"Login email required\" and billing.email=\"Billing email invalid\". What does $errors->getBag(\"billing\")->first(\"email\") return?',choices:[['Billing email invalid','getBag selects billing explicitly, so first reads the email error in that bag.'],['Login email required','That message belongs to the default bag, which was not selected.'],['Both messages concatenated','Selecting a bag does not merge it with every other named bag.'],['An empty string because email is duplicated across bags','Separate bags may contain the same field name without a collision.']],test:output('Billing email invalid',String.raw`$errors = new Illuminate\Support\ViewErrorBag();
$errors->put('default', new Illuminate\Support\MessageBag(['email' => 'Login email required']));
$errors->put('billing', new Illuminate\Support\MessageBag(['email' => 'Billing email invalid']));
echo $errors->getBag('billing')->first('email');`)}),
q({n:127,type:'T',sub:'json-validation-response-contract',needs:['JSON requests','Validation exceptions','Nested error keys'],why:'Assert the framework API error contract rather than a successful payload shape.',lessons:[3,5,6],docs:['validation#validation-error-response-format'],ask:'An API client sends Accept: application/json and items=[{\"sku\":\"\"}] to this action. Which response assertion tests the default validation failure contract?',code:[file(String.raw`use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/orders', function (Request $request) {
    $data = $request->validate(['items.*.sku' => ['required']]);

    return response()->json($data);
});`,'routes/fixture.php')],assume:['No custom exception rendering changes validation responses.'],choices:[['Assert status 422 and an errors entry keyed items.0.sku.','A JSON validation exception returns 422 with concrete attribute paths in the errors object.'],['Assert status 302 and a Location header back to the form.','That is the usual browser-form flow; this request explicitly expects JSON.'],['Assert status 200 with an empty items array.','Failed validation interrupts the action instead of silently filtering invalid items into a successful response.'],['Assert status 500 because the controller did not catch the validation exception.','The framework handles this exception as a validation response; a local catch is not required.']],test:output('422:items.0.sku',String.raw`$r = Illuminate\Http\Request::create('/orders', 'POST', ['items' => [['sku' => '']]], [], [], ['HTTP_ACCEPT' => 'application/json']);
$response = app(Illuminate\Contracts\Http\Kernel::class)->handle($r);
$body = json_decode($response->getContent(), true);
echo $response->getStatusCode().':'.array_key_first($body['errors']);`)}),
q({n:128,type:'T',sub:'web-validation-redirect-flash',needs:['Web middleware','Validation redirect','Old input'],why:'Verify the browser-form flow rather than the API response contract.',docs:['validation#displaying-the-validation-errors'],ask:'A normal HTML form request with a working web session submits title=\"\" and note=\"memo\". The action calls validate([\"title\" => \"required\"]). Its Referer is /form. Under default handling, what should a feature test observe?',choices:[['A 302 back to /form, a title error in the session, and note available as old input.','Browser validation failure redirects back and flashes both validation errors and non-sensitive input.'],['A 422 JSON body regardless of the client\'s requested representation.','Default validation handling distinguishes a browser HTML request from a JSON-expecting request.'],['A 200 response from the action with title replaced by null.','Normalization does not satisfy required, so validation interrupts the action.'],['A 302 redirect with errors, but no old input unless the action manually calls withInput.','The default validation exception handler flashes eligible input automatically on this browser redirect path.']],test:output('302:/form:true:memo',String.raw`app('router')->post('/save', function (Illuminate\Http\Request $request) {
    $request->validate(['title' => 'required']);
    return 'saved';
})->middleware('web');
$r = Illuminate\Http\Request::create('/save', 'POST', ['title' => '', 'note' => 'memo'], [], [], ['HTTP_ACCEPT' => 'text/html', 'HTTP_REFERER' => 'http://localhost/form']);
$response = app(Illuminate\Contracts\Http\Kernel::class)->handle($r);
$session = app('session.store');
echo $response->getStatusCode().':'.parse_url($response->headers->get('Location'), PHP_URL_PATH).':';
echo json_encode($session->get('errors')->getBag('default')->has('title')).':'.$session->getOldInput('note');`)}),
q({n:129,type:'R',sub:'validated-result-write-boundary',needs:['Validation output','Unruled fields','Write payload selection'],why:'Keep the validation result as the subsequent data boundary.',lessons:[3,5,6],docs:['validation#working-with-validated-input'],ask:'An action validates only name, stores the returned $data, then mistakenly passes $request->all() to a downstream writer. The caller also supplied is_admin. The writer accepts every supplied key. Which local correction preserves the validation boundary?',choices:[['Pass $data to the writer instead of $request->all().','The returned validated array contains the ruled name field; returning to all input reintroduces the unruled is_admin key.'],['Keep all() and assume a successful validate call removed unruled request keys.','Validation returns a selected result; it does not remove every unruled key from the underlying request.'],['Use $request->except(\"name\") for the write.','That excludes the validated field and retains the unruled privileged key.'],['Make name nullable while continuing to pass all input.','Changing name nullability does not restrict which other fields reach the writer.']],test:output('{"name":"Ada"}:true',String.raw`$r = Illuminate\Http\Request::create('/profile', 'POST', ['name' => 'Ada', 'is_admin' => true]);
$data = validator($r->all(), ['name' => 'required|string'])->validated();
echo json_encode($data).':'.json_encode(array_key_exists('is_admin', $r->all()));`)}),
q({n:130,type:'E',sub:'validated-input-merge-not-validation',needs:['ValidatedInput','Post-validation transformations'],why:'Recognize that a convenience merge does not rerun the validator.',lessons:[6],docs:['validation#working-with-validated-input'],ask:'What does this code print?',code:[file(String.raw`$validator = validator(['name' => 'Ada'], [
    'name' => ['required', 'string'],
    'count' => ['sometimes', 'integer'],
]);

$values = $validator->safe()->merge(['count' => 'many']);
echo json_encode($values->all());`)],choices:[['{"name":"Ada","count":"many"}','safe initially returns validated values, but merge adds the new value without applying the earlier integer rule again.'],['A validation exception for count','The missing count passed the original sometimes rule; merge does not perform a second validation pass.'],['{"name":"Ada"}','merge retains the supplied additional key instead of silently discarding it.'],['{"name":"Ada","count":0}','ValidatedInput merge does not cast the new value to an integer.']],test:output('{"name":"Ada","count":"many"}')}),
];
