import {q,file,output,contract} from '../record.mjs';
export default [
q({n:131,revision:2,type:'R',sub:'unique-ignore-server-identity',needs:['Unique validation','Eloquent identity','Untrusted input'],why:'Keep the excluded uniqueness row tied to the authorized update target.',docs:['validation#forcing-a-unique-rule-to-ignore-a-given-id'],ask:'An authorized update targets account 7. The caller submits account_id=9 and an email already owned by account 9. The rule ignores $request->input(\"account_id\"), so validation passes incorrectly. The server-resolved $account is account 7. Which replacement excludes only the actual record being updated?',choices:[['Rule::unique(\"accounts\", \"email\")->ignore($account)','The trusted model supplies the real update identity, so the conflicting row 9 remains part of the uniqueness check.'],['Cast the submitted account_id to int and keep using it in ignore().','Type conversion does not establish that the submitted ID is the authorized update target.'],['Ignore both the route account ID and the submitted account_id.','Excluding the unrelated row 9 would preserve the very bypass that must be prevented.'],['Remove the unique rule whenever the request contains account_id.','Presence of an attacker-controlled field cannot justify skipping the uniqueness requirement.']],test:output('[false,true]',String.raw`Illuminate\Support\Facades\Schema::create('accounts', function ($table) {
    $table->id();
    $table->string('email');
});
Illuminate\Support\Facades\DB::table('accounts')->insert([
    ['id' => 7, 'email' => 'owner@example.test'],
    ['id' => 9, 'email' => 'other@example.test'],
]);
class Account extends Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;
}
$account = Account::findOrFail(7);
$data = ['email' => 'other@example.test'];
echo json_encode([
    validator($data, ['email' => [Illuminate\Validation\Rule::unique('accounts', 'email')->ignore($account)]])->passes(),
    validator($data, ['email' => [Illuminate\Validation\Rule::unique('accounts', 'email')->ignore(9)]])->passes(),
]);`)}),
q({n:132,type:'I',sub:'tenant-scoped-unique-rule',needs:['Database uniqueness','Tenant scope','Server-selected context'],why:'Align a friendly pre-write check with a tenant-specific database invariant.',docs:['validation#adding-additional-where-clauses'],ask:'members has a unique database constraint on (account_id, email). The same email may exist in different accounts. The current account ID is selected by trusted server context. Which validation rule matches that scope for a new member?',choices:[['Rule::unique(\"members\", \"email\")->where(\"account_id\", $accountId)','The extra predicate limits the uniqueness query to the current account, matching the composite invariant.'],['Rule::unique(\"members\", \"email\")','A global email check would wrongly reject an email used only by another account.'],['Rule::unique(\"members\", \"account_id\")','This checks whether the account ID is unique among members rather than email uniqueness within that account.'],['Rule::exists(\"members\", \"email\")->where(\"account_id\", $accountId)','exists requires a matching row; that is the opposite of requiring a new email within this account.']],test:output('[true,false]',String.raw`Illuminate\Support\Facades\Schema::create('members', function ($table) {
    $table->id();
    $table->unsignedBigInteger('account_id');
    $table->string('email');
    $table->unique(['account_id', 'email']);
});
Illuminate\Support\Facades\DB::table('members')->insert(['account_id' => 8, 'email' => 'ada@example.test']);
$results = [];
foreach ([3, 8] as $accountId) {
    $results[] = validator(['email' => 'ada@example.test'], [
        'email' => [Illuminate\Validation\Rule::unique('members', 'email')->where('account_id', $accountId)],
    ])->passes();
}
echo json_encode($results);`)}),
q({n:133,type:'R',sub:'exists-eligible-record-scope',needs:['Exists validation','Database eligibility predicates'],why:'Check operational eligibility rather than mere record existence.',docs:['validation#specifying-a-custom-column-name'],ask:'A room_id must identify an existing room with bookable=true. Plain exists:rooms,id accepts a retired room whose bookable flag is false. Which rule adds the missing eligibility condition?',choices:[['Rule::exists(\"rooms\", \"id\")->where(\"bookable\", true)','The query requires both the submitted room ID and the eligibility flag to match.'],['Rule::exists(\"rooms\", \"bookable\")','That compares the submitted room ID to the flag column instead of constraining the selected room.'],['Rule::unique(\"rooms\", \"id\")->where(\"bookable\", true)','unique asks for absence of a matching row, reversing the existing-eligible-room requirement.'],['Rule::exists(\"rooms\", \"id\")->where(\"bookable\", false)','This explicitly selects the retired/nonbookable records that the requirement excludes.']],test:output('[true,false]',String.raw`Illuminate\Support\Facades\Schema::create('rooms', function ($table) {
    $table->id();
    $table->boolean('bookable');
});
Illuminate\Support\Facades\DB::table('rooms')->insert([['id' => 11, 'bookable' => true], ['id' => 12, 'bookable' => false]]);
$results = [];
foreach ([11, 12] as $id) {
    $results[] = validator(['room_id' => $id], [
        'room_id' => [Illuminate\Validation\Rule::exists('rooms', 'id')->where('bookable', true)],
    ])->passes();
}
echo json_encode($results);`)}),
q({n:134,type:'A',sub:'email-validation-versus-possession',needs:['Email validation','Email verification','Identity claims'],why:'Separate address plausibility from proof that the user controls the mailbox.',docs:['validation#rule-email','verification'],ask:'Registration validates an email address and the domain has suitable DNS records. Access to a sensitive feature requires proof that this user controls that mailbox. Which additional process establishes the missing property?',choices:[['Complete a time-limited verification challenge delivered to that address before granting the feature.','A challenge ties successful completion to receiving mail at the address; syntax and DNS checks do not prove mailbox possession.'],['Repeat the same email syntax validation on every login.','Repeating a syntax check does not demonstrate access to the mailbox.'],['Mark the email verified whenever its domain has an MX record.','Domain mail infrastructure says nothing about which user controls an individual mailbox.'],['Require the email to match its lowercase form and then mark it verified.','Normalization changes representation; it does not prove ownership.']],test:contract('Illuminate/Foundation/Auth/EmailVerificationRequest.php',['public function authorize()','getEmailForVerification()','markEmailAsVerified()'],'Laravel has a separate authenticated verification-request flow; a validation rule alone does not fulfill it. No external email or DNS service is contacted in this evidence check.')}),
q({n:135,revision:2,type:'A',sub:'validation-database-race',assume:['The database uses READ COMMITTED isolation; neither request adds a locking read or an advisory lock.'],needs:['Unique validation','Concurrent requests','Database constraints'],why:'Identify the final invariant boundary when two pre-write checks both pass.',docs:['validation#rule-unique','migrations#creating-indexes'],ask:'Two requests validate the same available slug before either inserts it. Both unique checks pass. The system must store at most one row for that slug. Which design remains correct under this interleaving?',choices:[['Enforce a database unique constraint and translate the losing insert into an appropriate conflict response.','The database enforces the invariant at the write boundary; a prior validation query cannot reserve the value against another request.'],['Rely on the two successful unique validations as reservations.','Validation checks current state but does not reserve the slug for the later insert.'],['Wrap each validation and insert in a default-isolation transaction without any uniqueness constraint.','Ordinary transactions alone do not universally prevent this check-then-insert race on a missing key.'],['Run the same unique rule twice immediately before each insert.','Another request can still interleave after the last check; repeated checking does not provide atomic enforcement.']],test:output('[true,true]:constraint',String.raw`Illuminate\Support\Facades\Schema::create('slugs', function ($table) {
    $table->id();
    $table->string('slug')->unique();
});
$rules = ['slug' => 'unique:slugs,slug'];
$data = ['slug' => 'release-notes'];
$a = validator($data, $rules)->passes();
$b = validator($data, $rules)->passes();
echo json_encode([$a, $b]).':';
Illuminate\Support\Facades\DB::table('slugs')->insert($data);
try {
    Illuminate\Support\Facades\DB::table('slugs')->insert($data);
} catch (Illuminate\Database\UniqueConstraintViolationException $e) {
    echo 'constraint';
}`)}),
q({n:136,type:'E',sub:'form-request-hook-sequence',needs:['Form Request lifecycle','Authorization','Validation hooks'],why:'Trace framework hook order independently of declaration order.',lessons:[7],docs:['validation#preparing-input-for-validation','validation#authorizing-form-requests'],ask:'This request passes validation and authorization. Which sequence is recorded during validateResolved()?',code:[file(String.raw`use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    public array $trace = [];

    public function rules(): array
    {
        $this->trace[] = 'rules';

        return ['name' => ['required']];
    }

    protected function passedValidation(): void
    {
        $this->trace[] = 'passed';
    }

    public function authorize(): bool
    {
        $this->trace[] = 'authorize';

        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->trace[] = 'prepare';
    }
}`)],assume:['The request contains name=Ada and has its Laravel container and redirector set.'],choices:[['prepare,authorize,rules,passed','Preparation occurs first, authorization is checked next, rules build the validator, and the success hook runs after validation passes.'],['rules,passed,authorize,prepare','Declaration order does not determine the framework lifecycle.'],['authorize,prepare,rules,passed','prepareForValidation precedes the authorization check, so authorize can observe prepared input.'],['prepare,rules,authorize,passed','Authorization is checked before constructing and running the normal validator.']],test:output('prepare,authorize,rules,passed',String.raw`require getcwd().'/probe.php';
$r = ProfileRequest::create('/profile', 'POST', ['name' => 'Ada']);
$r->setContainer(app())->setRedirector(app('redirect'));
$r->validateResolved();
echo implode(',', $r->trace);`)}),
q({n:137,type:'E',sub:'form-request-denial-before-action',needs:['Form Request authorization','HTTP status handling'],why:'Locate an authorization failure before controller execution even with invalid input.',lessons:[3,7],docs:['validation#authorizing-form-requests'],ask:'A POST action type-hints this request and would return \"saved\" if reached. The caller omits name and requests JSON. What status is returned under default handling?',code:[file(String.raw`use Illuminate\Foundation\Http\FormRequest;

class RestrictedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return ['name' => ['required']];
    }
}`)],choices:[['403','Authorization fails before the normal validation and action stages, so the framework returns forbidden.'],['422','The missing-name validation is not the first failing stage; authorization already denies the request.'],['200 with saved','The action is not invoked after Form Request authorization fails.'],['302 to the login page','A false authorize result is a forbidden decision, not automatically an authentication redirect.']],test:output('403',String.raw`require getcwd().'/probe.php';
app('router')->post('/restricted', fn (RestrictedRequest $request) => 'saved');
$r = Illuminate\Http\Request::create('/restricted', 'POST', [], [], [], ['HTTP_ACCEPT' => 'application/json']);
echo app(Illuminate\Contracts\Http\Kernel::class)->handle($r)->getStatusCode();`)}),
q({n:138,revision:2,type:'E',sub:'rules-method-service-injection',needs:['Service container','Form Request rules','Array maximum'],why:'Resolve a method dependency before constructing data-dependent rules.',lessons:[1,6,7],docs:['validation#creating-form-requests'],ask:'No custom binding overrides PlanLimits. Three members are submitted. Which outcome follows when Laravel validates this request?',code:[file(String.raw`use Illuminate\Foundation\Http\FormRequest;

class PlanLimits
{
    public int $members = 2;
}

class InviteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(PlanLimits $limits): array
    {
        return ['members' => ['required', 'array', 'max:'.$limits->members]];
    }
}`)],choices:[['Validation fails: the injected service produces max:2.','Laravel calls the rules method through the container, resolves PlanLimits, and applies max:2 to the members array.'],['Validation passes because rules cannot receive dependencies.','The rules method supports container injection, so its returned rules are applied.'],['A missing PlanLimits argument error occurs before validation.','Laravel supplies this concrete dependency through the container; no manual argument is required.'],['The maximum is interpreted as two bytes of JSON.','For an array-valued field, max constrains its item count rather than serialized byte length.']],test:output('members',String.raw`require getcwd().'/probe.php';
$r = InviteRequest::create('/invite', 'POST', ['members' => ['Ada', 'Grace', 'Linus']]);
$r->setContainer(app())->setRedirector(app('redirect'));
try {
    $r->validateResolved();
} catch (Illuminate\Validation\ValidationException $e) {
    echo array_key_first($e->errors());
}`)}),
q({n:139,revision:2,type:'I',level:'F',sub:'form-request-fixed-redirect-route',needs:['Form Request failure responses','Named routes'],why:'Select a stable failure destination independently of the referring page.',lessons:[2,7],docs:['validation#customizing-the-redirect-location'],ask:'A form can be submitted from several pages, but every HTML validation failure must redirect to the parameter-free named route profile.edit. Which Form Request configuration selects that route rather than the Referer?',choices:[['Set protected $redirectRoute = \"profile.edit\".','redirectRoute is resolved through the URL generator as a route name when constructing the failure redirect.'],['Set protected $redirect = \"profile.edit\".','redirect is treated as a URL/path destination, not a named-route lookup.'],['Set protected $errorBag = \"profile.edit\".','The error bag controls message grouping, not the redirect destination.'],['Return \"profile.edit\" from authorize().','Authorization decides permission; it is not a named failure-redirect selector.']],test:output('/profile/edit',String.raw`app('router')->get('/profile/edit', fn () => 'form')->name('profile.edit');
app('router')->getRoutes()->refreshNameLookups();
class FixedRedirectRequest extends Illuminate\Foundation\Http\FormRequest
{
    protected $redirectRoute = 'profile.edit';
    public function rules(): array
    {
        return ['name' => 'required'];
    }
}
$r = FixedRedirectRequest::create('/submit', 'POST');
$r->setContainer(app())->setRedirector(app('redirect'));
try {
    $r->validateResolved();
} catch (Illuminate\Validation\ValidationException $e) {
    echo parse_url($e->redirectTo, PHP_URL_PATH);
}`)}),
q({n:140,type:'E',sub:'passed-validation-snapshot',needs:['Form Request success hooks','Request mutation','Validated data'],why:'Distinguish the live request input from the validator\'s already captured dataset.',lessons:[7],docs:['validation#preparing-input-for-validation'],ask:'The request initially contains name=ada and passes its rules. After validation, what do input(\"name\") and validated(\"name\") return, respectively?',code:[file(String.raw`use Illuminate\Foundation\Http\FormRequest;

class NameRequest extends FormRequest
{
    public function rules(): array
    {
        return ['name' => ['required', 'string']];
    }

    protected function passedValidation(): void
    {
        $this->replace(['name' => strtoupper($this->input('name'))]);
    }
}`)],choices:[['ADA; ada','passedValidation changes the request bag after the validator captured and validated the original lowercase value.'],['ADA; ADA','Replacing the request input does not retroactively replace the validator\'s stored dataset.'],['ada; ada','The success hook does mutate the live request input to uppercase.'],['ada; ADA','This reverses which object is changed by the success hook.']],test:output('ADA:ada',String.raw`require getcwd().'/probe.php';
$r = NameRequest::create('/name', 'POST', ['name' => 'ada']);
$r->setContainer(app())->setRedirector(app('redirect'));
$r->validateResolved();
echo $r->input('name').':'.$r->validated('name');`)}),
];
