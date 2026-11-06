import {q,file,output,contract} from '../record.mjs';
export default [
q({n:141,type:'D',sub:'failed-validation-must-interrupt',needs:['Form Request failure hooks','HttpResponseException','Control flow'],why:'Interrupt request resolution rather than return a response the lifecycle ignores.',lessons:[3,7],docs:['validation#form-request-validation','responses'],ask:'A custom failedValidation method returns a JSON response with only a violations key, but the action still executes with invalid input. The desired response is that custom body with status 422. Which repair interrupts resolution correctly?',choices:[['Throw HttpResponseException containing response()->json([\"violations\" => $validator->errors()], 422).','The exception exits the validation lifecycle and carries the intended HTTP response to the kernel.'],['Return the same JSON response with status 422 again from failedValidation.','The lifecycle calls failedValidation for its interrupting behavior; it does not use a returned Response as the action result.'],['Merge violations into the request input and let the action continue.','Adding input neither stops the action nor guarantees the required failure response.'],['Call abort(422) without supplying the custom JSON response.','That interrupts execution but does not establish the required violations-only body.']],test:output('200:422:violations',String.raw`class ReturningRequest extends Illuminate\Foundation\Http\FormRequest
{
    public function rules(): array
    {
        return ['name' => 'required'];
    }
    protected function failedValidation(Illuminate\Contracts\Validation\Validator $validator)
    {
        return response()->json(['violations' => $validator->errors()], 422);
    }
}
class ThrowingRequest extends ReturningRequest
{
    protected function failedValidation(Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new Illuminate\Http\Exceptions\HttpResponseException(
            response()->json(['violations' => $validator->errors()], 422),
        );
    }
}
app('router')->post('/bad', fn (ReturningRequest $r) => 'saved');
app('router')->post('/good', fn (ThrowingRequest $r) => 'saved');
$kernel = app(Illuminate\Contracts\Http\Kernel::class);
$a = $kernel->handle(Illuminate\Http\Request::create('/bad', 'POST'));
$b = $kernel->handle(Illuminate\Http\Request::create('/good', 'POST'));
echo $a->getStatusCode().':'.$b->getStatusCode().':'.array_key_first(json_decode($b->getContent(), true));`)}),
q({n:142,type:'R',sub:'sensitive-input-dont-flash',needs:['Validation redirects','Exception configuration','Session confidentiality'],why:'Prevent a secret from being copied into old input without disabling useful form recovery.',docs:['errors','validation#repopulating-forms'],ask:'A browser form contains api_token and ordinary profile fields. On validation failure, the profile fields should be repopulated, but api_token must never be flashed into the session. The standard sensitive-field list does not contain this custom name. Which configuration is appropriate?',choices:[['Add api_token through the exception configuration\'s dontFlash list.','The validation redirect excludes configured sensitive fields from old input while retaining eligible profile fields.'],['Hide api_token in the model\'s hidden serialization list.','Model JSON visibility does not control the request input copied to the session on validation failure.'],['Use an HTML password input type for api_token and make no server change.','Browser masking does not stop the server from flashing the submitted value.'],['Remove only the api_token validation rule while keeping ordinary failure handling.','An unruled input can still be present in the request and eligible for old-input flashing.']],test:output('[false,"Ada"]',String.raw`app(Illuminate\Contracts\Debug\ExceptionHandler::class)->dontFlash(['api_token']);
app('router')->post('/settings', function (Illuminate\Http\Request $r) {
    $r->validate(['required_field' => 'required']);
})->middleware('web');
$r = Illuminate\Http\Request::create('/settings', 'POST', ['api_token' => 'secret', 'name' => 'Ada'], [], [], ['HTTP_ACCEPT' => 'text/html']);
app(Illuminate\Contracts\Http\Kernel::class)->handle($r);
$old = app('session.store')->getOldInput();
echo json_encode([array_key_exists('api_token', $old), $old['name']]);`)}),
q({n:143,type:'I',level:'F',sub:'form-request-named-error-bag',needs:['Form Requests','Named error bags'],why:'Choose a request-local error destination without changing all validation errors.',lessons:[6,7],docs:['validation#named-error-bags'],ask:'BillingRequest failures must populate the billing error bag; other Form Requests must keep the default bag. Which class property selects that local behavior?',choices:[['protected $errorBag = \"billing\";','Form Request attaches its configured error bag name to the ValidationException it throws.'],['protected $redirectRoute = \"billing\";','This selects a named redirect route, not an error bag.'],['protected $redirect = \"billing\";','This controls the redirect URL/path, not validation message grouping.'],['public $billing = true;','An arbitrary property does not configure the failure exception\'s error bag.']],test:output('billing',String.raw`class BillingRequest extends Illuminate\Foundation\Http\FormRequest
{
    protected $errorBag = 'billing';
    public function rules(): array
    {
        return ['email' => 'required'];
    }
}
$r = BillingRequest::create('/billing', 'POST');
$r->setContainer(app())->setRedirector(app('redirect'));
try {
    $r->validateResolved();
} catch (Illuminate\Validation\ValidationException $e) {
    echo $e->errorBag;
}`)}),
q({n:144,type:'I',sub:'patch-normalization-preserves-omission',needs:['prepareForValidation','Nullable PATCH fields','Input presence'],why:'Normalize actual string input without inventing a missing update or changing null semantics.',lessons:[5,7],docs:['validation#preparing-input-for-validation'],ask:'For a PATCH Form Request, omitted nickname means unchanged, null means clear, and a string should be trimmed. Only these three input forms are allowed. Which preparation preserves all three meanings?',choices:[['Merge a trimmed nickname only when the key exists and its value is a string.','This leaves omission absent, leaves null intact, and normalizes the supplied string.'],['Always merge trim((string) $this->input(\"nickname\", \"\")).','This invents an empty nickname for omission and also converts null into an empty string.'],['Call mergeIfMissing([\"nickname\" => \"\"]) and leave present values alone.','That creates a value for omission and does not trim an actually supplied string.'],['Replace all request input with [\"nickname\" => trim($value ?? \"\")].','This both loses other update fields and collapses omitted/null nickname into an empty string.']],test:output('[[],{"nickname":null},{"nickname":"Ada"}]',String.raw`class NicknameRequest extends Illuminate\Foundation\Http\FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('nickname') && is_string($this->input('nickname'))) {
            $this->merge(['nickname' => trim($this->input('nickname'))]);
        }
    }
    public function rules(): array
    {
        return ['nickname' => 'nullable|string'];
    }
}
$values = [];
foreach ([[], ['nickname' => null], ['nickname' => ' Ada ']] as $input) {
    $r = NicknameRequest::create('/profile', 'PATCH', $input);
    $r->setContainer(app())->setRedirector(app('redirect'));
    $r->validateResolved();
    $values[] = $r->all();
}
echo json_encode($values);`)}),
q({n:145,type:'A',sub:'authorization-no-write-side-effects',needs:['Form Request lifecycle','Authorization','Database transactions'],why:'Keep a quota debit atomic with the operation it pays for rather than an earlier permission check.',docs:['validation#authorizing-form-requests','database#database-transactions'],ask:'authorize() decrements a credit and returns true. Later validation or the database write may fail. The credit must be spent only if the authorized write succeeds. Which refactor puts the debit at the correct boundary?',choices:[['Keep authorize as a permission check; debit and write in one transaction after successful validation.','Authorization can run before later failures; an atomic transaction can commit the debit together with the successful operation.'],['Move the debit to prepareForValidation and leave the write in the action.','Preparation runs even earlier and does not make the debit atomic with the write.'],['Move the debit to passedValidation and keep the write in a later independent transaction.','The later write can still fail after the debit has already been committed.'],['Leave the debit in authorize and return false if validation later fails.','The earlier authorize call cannot retroactively undo its committed side effect by returning a different value later.']],test:contract('Illuminate/Validation/ValidatesWhenResolvedTrait.php',['$this->prepareForValidation()','$this->passesAuthorization()','$instance->fails()','$this->passedValidation()'],'The authorization phase precedes validation completion and the action. The required debit/write atomicity belongs to the later application transaction, not this permission hook.')}),
q({n:146,type:'T',sub:'authorization-masks-validation-test',needs:['Form Request authorization','Validation failure tests'],why:'Construct a test that actually reaches the rule under test.',lessons:[7],docs:['validation#authorizing-form-requests','http-tests#validation-assertions'],ask:'A test sends an invalid title as a user denied by the Form Request and asserts status 403. It claims to prove the title rule works. Which additional test isolates that rule?',choices:[['Send the same invalid title as an authorized user and assert a 422 title error for a JSON request.','The authorized case reaches validation; the denied case stops before the title rule can establish the claimed behavior.'],['Send a valid title as the same denied user and assert 403 again.','That strengthens authorization coverage but still does not reach title validation.'],['Send no request and assert the rules method contains the word required.','A source-string assertion does not show the rule is applied in the HTTP workflow.'],['Change the denied-user assertion from 403 to 422 without changing its setup.','The expected status would contradict the authorization stage rather than testing validation correctly.']],test:output('403:422',String.raw`class ConditionalRequest extends Illuminate\Foundation\Http\FormRequest
{
    public function authorize(): bool
    {
        return $this->attributes->get('authorized', false);
    }
    public function rules(): array
    {
        return ['title' => 'required'];
    }
}
app('router')->post('/title', fn (ConditionalRequest $r) => 'saved');
$kernel = app(Illuminate\Contracts\Http\Kernel::class);
foreach ([false, true] as $i => $authorized) {
    $r = Illuminate\Http\Request::create('/title', 'POST', [], [], [], ['HTTP_ACCEPT' => 'application/json']);
    $r->attributes->set('authorized', $authorized);
    echo ($i ? ':' : '').$kernel->handle($r)->getStatusCode();
}`)}),
q({n:147,type:'E',sub:'validation-data-envelope',needs:['Form Request validationData','Nested envelopes','Input versus validated output'],why:'Trace an alternate validation dataset without assuming the request bag is replaced.',lessons:[5,7],docs:['validation#form-request-validation'],ask:'The submitted input is {\"payload\":{\"name\":\"Ada\"},\"signature\":\"abc\"}. After successful validation, what is printed by the action expression json_encode([$request->validated(), $request->input(\"name\", \"missing\")])?',code:[file(String.raw`use Illuminate\Foundation\Http\FormRequest;

class EnvelopeRequest extends FormRequest
{
    public function validationData(): array
    {
        return $this->input('payload', []);
    }

    public function rules(): array
    {
        return ['name' => ['required', 'string']];
    }
}`)],choices:[['[{"name":"Ada"},"missing"]','The validator receives the extracted payload, while the original request still has name nested inside payload.'],['[{"name":"Ada"},"Ada"]','validationData changes the data supplied to the validator, not the shape of the underlying request input.'],['[{"payload":{"name":"Ada"},"signature":"abc"},"missing"]','The override supplies only the payload to validation, so the outer envelope is not the validated result.'],['A required-name validation exception','The override presents name at the top level of the validation dataset, satisfying the rule.']],test:output('[{"name":"Ada"},"missing"]',String.raw`require getcwd().'/probe.php';
$r = EnvelopeRequest::create('/envelope', 'POST', ['payload' => ['name' => 'Ada'], 'signature' => 'abc']);
$r->setContainer(app())->setRedirector(app('redirect'));
$r->validateResolved();
echo json_encode([$r->validated(), $r->input('name', 'missing')]);`)}),
q({n:148,type:'A',sub:'precognition-partial-success-boundary',needs:['Laravel Precognition','Form Requests','Preflight versus write operations'],why:'Interpret partial preflight success without granting a complete operation based on it.',docs:['precognition'],ask:'A correctly configured, authorized Precognition request asks to validate only email. Email is valid; a required name is omitted. It receives 204 with Precognition-Success: true. What may the client conclude?',choices:[['The requested email check passed; this does not establish full-form validity or a completed write.','Precognition can filter validation to requested fields and end before the action performs its normal operation.'],['All required fields passed, so name must have acquired a server default.','An unrequested required field can be omitted from this partial check; success does not imply a default was added.'],['The controller completed the write but chose not to return a body.','A successful precognitive check is not the ordinary action execution or a write confirmation.'],['Future submissions may skip server validation because the preflight succeeded.','Input and state can change, and the actual submission still requires its normal validation and authorization.']],test:output('204:true:0',String.raw`class PrecognitiveProfileRequest extends Illuminate\Foundation\Http\FormRequest
{
    public function rules(): array
    {
        return ['name' => 'required', 'email' => 'required|email'];
    }
}
$calls = 0;
app('router')->post('/profile', function (PrecognitiveProfileRequest $r) use (&$calls) {
    $calls++;
    return 'saved';
})->middleware(Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class);
$r = Illuminate\Http\Request::create('/profile', 'POST', ['email' => 'ada@example.test'], [], [], [
    'HTTP_ACCEPT' => 'application/json',
    'HTTP_PRECOGNITION' => 'true',
    'HTTP_PRECOGNITION_VALIDATE_ONLY' => 'email',
]);
$response = app(Illuminate\Contracts\Http\Kernel::class)->handle($r);
echo $response->getStatusCode().':'.$response->headers->get('Precognition-Success').':'.$calls;`)}),
q({n:149,type:'A',sub:'shared-rules-separate-authorization',needs:['Rule composition','Endpoint authorization','Form Requests'],why:'Reuse a shared data contract without merging distinct permission policies.',docs:['validation#creating-form-requests','validation#authorizing-form-requests'],ask:'Create and update endpoints share address-format rules but use different authorization policies and have different required fields. Which reuse boundary keeps those distinctions visible?',choices:[['Compose shared address rules into separate Form Requests, each with its own authorization and endpoint-specific rules.','Shared rule construction can be reused while each request owns the permission and requiredness decisions for its operation.'],['Use one Form Request whose authorize always returns true because both endpoints share address fields.','Shared field formats do not establish permission for either operation.'],['Put both endpoint policies in one shared address rule and run whichever returns true.','Data-format validation should not grant permission when either unrelated operation happens to be authorized.'],['Move all endpoint differences into prepareForValidation and keep one unconditional authorization result.','Input preparation does not replace explicit endpoint permission decisions.']],test:contract('Illuminate/Foundation/Http/FormRequest.php',['protected function validationRules()','public function validationData()','passesAuthorization'],'Form Requests expose separate rule and authorization boundaries. This is an architectural contract review, not a claim to execute a particular application policy.')}),
q({n:150,revision:2,type:'T',sub:'form-request-container-resolution',needs:['Form Request service provider','Object construction','Automatic validation'],why:'Exercise the framework resolution hook instead of assuming a constructor invokes validation.',lessons:[1,7],docs:['validation#form-request-validation'],ask:'A unit test only executes new SignupRequest() and sees no ValidationException despite missing required email. The request rules are correct. What must the test exercise to verify Laravel\'s automatic validation workflow?',choices:[['Resolve the request through Laravel\'s configured container.','Automatic validation is attached to container resolution of ValidatesWhenResolved objects; plain construction does not invoke that hook.'],['Assert that plain construction throws and keep the same setup.','The constructor is not the framework validation lifecycle entry point.'],['Make email a public property so construction discovers its rule.','Validation rules are not triggered by declaring matching public properties.'],['Call json_encode on the new request before checking for an exception.','Serialization does not run the Form Request resolution hook.']],test:output('constructed:validated',String.raw`class SignupRequest extends Illuminate\Foundation\Http\FormRequest
{
    public function rules(): array
    {
        return ['email' => 'required'];
    }
}
$new = new SignupRequest();
echo 'constructed:';
try {
    app(SignupRequest::class);
} catch (Illuminate\Validation\ValidationException $e) {
    echo 'validated';
}`)}),
];
