import {q,file,output} from '../record.mjs';
const authFixture=String.raw`class FixtureAuthUser extends Illuminate\Foundation\Auth\User
{
    protected $table = 'fixture_users';
    public $timestamps = false;
}
config([
    'auth.providers.users.model' => FixtureAuthUser::class,
    'hashing.driver' => 'bcrypt',
    'hashing.bcrypt.rounds' => 4,
]);
Illuminate\Support\Facades\Schema::create('fixture_users', function ($table) {
    $table->id();
    $table->string('email');
    $table->string('password');
    $table->boolean('active');
    $table->rememberToken();
});
Illuminate\Support\Facades\DB::table('fixture_users')->insert([
    'id' => 7,
    'email' => 'ada@example.test',
    'password' => Illuminate\Support\Facades\Hash::make('fixture-password'),
    'active' => false,
]);
`;
export default [
q({n:191,type:'I',sub:'policy-additional-context-arguments',needs:['Policy resolution','Additional authorization context'],why:'Pass the resource that selects the policy before the additional method argument.',docs:['authorization#supplying-additional-context'],ask:'DocumentPolicy::publish(User $user, Document $document, string $channel) must receive channel=\"public\". The Document policy is registered normally. Which Gate call supplies the additional context in the intended positions?',choices:[['Gate::authorize(\"publish\", [$document, \"public\"])','The first argument identifies the policy resource; the remaining values become additional policy method arguments after the injected user.'],['Gate::authorize(\"publish\", [\"public\", $document])','The first argument no longer identifies the Document policy and the context order is reversed.'],['Gate::authorize(\"publish\", $document, \"public\")','The documented context is the arguments array; a third positional value is not the policy-context parameter.'],['Gate::authorize(\"public\", [$document, \"publish\"])','This changes the requested ability to public rather than passing public as the channel for publish.']],test:output('allowed:public',String.raw`class Document {}
class DocumentPolicy
{
    public function publish(Illuminate\Auth\GenericUser $user, Document $document, string $channel): bool
    {
        echo $channel;
        return true;
    }
}
$gate = new Illuminate\Auth\Access\Gate(app(), fn () => new Illuminate\Auth\GenericUser(['id' => 7]));
$gate->policy(Document::class, DocumentPolicy::class);
echo 'allowed:';
$gate->authorize('publish', [new Document(), 'public']);`)}),
q({n:192,revision:2,type:'R',level:'F',sub:'blade-permission-not-server-enforcement',needs:['Blade can directives','Endpoint authorization','Client control'],why:'Enforce permission on the operation in addition to deciding what the interface displays.',docs:['authorization#via-blade-templates'],ask:'A delete button is inside @can(\"delete\", $post), so unauthorized users never see it. The DELETE endpoint performs no policy check. Which review finding remains valid?',choices:[['The endpoint must authorize deletion too; hiding the button does not prevent a direct request.','Blade controls rendered presentation, while the server endpoint must independently enforce the permission before deleting.'],['The @can directive automatically installs authorization middleware on the DELETE route.','Rendering a conditional block does not modify the route middleware or action.'],['A CSRF token by itself proves the user may delete this particular post.','Request-forgery protection does not decide resource-specific deletion permission.'],['Using DELETE instead of POST makes the missing policy check unnecessary.','The HTTP verb does not authorize the caller for the target resource.']],test:output('hidden:denied',String.raw`$gate = app(Illuminate\Contracts\Auth\Access\Gate::class);
$gate->define('delete', fn (?Illuminate\Auth\GenericUser $user, $post) => false);
file_put_contents(resource_path('views/delete.blade.php'), '@can("delete", $post)<button>Delete</button>@endcan');
$html = view('delete', ['post' => new stdClass()])->render();
echo (str_contains($html, 'Delete') ? 'visible' : 'hidden').':';
try {
    $gate->authorize('delete', new stdClass());
} catch (Illuminate\Auth\Access\AuthorizationException $e) {
    echo 'denied';
}`)}),
q({n:193,type:'I',sub:'attempt-plaintext-against-stored-hash',needs:['Session authentication','Hashed passwords','Eloquent user provider'],why:'Give the authentication provider the original submitted credential without changing stored password semantics.',docs:['authentication#manually-authenticating-users','hashing'],ask:'The user provider stores a valid salted password hash. A login action has the submitted plaintext password. Which use of Auth::attempt follows the framework credential contract?',choices:[['Pass the submitted plaintext password in the credentials array; let the provider verify it against the stored hash.','The provider uses the configured hasher to verify the submitted password and starts a session on success; the login input should not be prehashed.'],['Hash the submitted password with Hash::make and pass that new hash as the password credential.','The new salted hash is not the original secret expected by the provider\'s password verification step.'],['Pass the stored password hash itself as the submitted password credential.','Supplying the stored hash is not proof of knowing the plaintext password and does not satisfy normal verification.'],['Temporarily replace the stored hash with the submitted plaintext before calling attempt.','Authentication does not require or justify persisting plaintext credentials.']],test:output('[true,7,true]',authFixture+String.raw`$ok = Illuminate\Support\Facades\Auth::attempt(['email' => 'ada@example.test', 'password' => 'fixture-password']);
$stored = Illuminate\Support\Facades\DB::table('fixture_users')->value('password');
echo json_encode([$ok, Illuminate\Support\Facades\Auth::id(), $stored !== 'fixture-password']);`)}),
q({n:194,type:'E',sub:'attempt-additional-query-conditions',needs:['Authentication credentials','User-provider lookup constraints'],why:'Distinguish a valid password from eligibility to be selected by the credential query.',docs:['authentication#specifying-additional-conditions'],ask:'An Eloquent user has the correct email and password but active=false. No other login callback changes the result. What does this attempt return?',code:[file(String.raw`use Illuminate\Support\Facades\Auth;

$ok = Auth::attempt([
    'email' => 'ada@example.test',
    'password' => 'fixture-password',
    'active' => true,
]);

echo json_encode($ok);`)],choices:[['false','The additional active condition participates in the user lookup, so this inactive user is not selected despite the correct password.'],['true because password verification ignores every other credential','Additional non-password credentials constrain retrieval; they are not all ignored.'],['true and the active flag is updated to true','Credential conditions filter users; attempt does not activate an account by copying that condition into the model.'],['A validation exception because active is not a password field','The provider supports extra lookup conditions; a nonmatching condition yields authentication failure.']],test:output('false',authFixture+String.raw`require getcwd().'/probe.php';`)}),
q({n:195,revision:2,type:'I',level:'F',sub:'explicit-authentication-guard',needs:['Multiple guards','Authenticated identities'],why:'Read the identity associated with the intended guard rather than the default one.',docs:['authentication#accessing-specific-guard-instances'],ask:'The default web guard contains customer 7; the admin guard contains administrator 99. An admin-only service must read the administrator identity without changing the default guard globally. Which call is appropriate?',choices:[['Auth::guard(\"admin\")->id()','Selecting the guard explicitly reads its identity while leaving the configured default guard unchanged.'],['Auth::id()','This reads the default web guard and therefore returns customer 7.'],['Auth::user(\"admin\")->id','The user accessor is not the documented guard selector; passing a guard name there does not replace guard(\"admin\").'],['request()->input(\"admin_id\")','A submitted ID is not the authenticated identity maintained by the admin guard.']],test:output('99:7',String.raw`config(['auth.guards.admin' => ['driver' => 'session', 'provider' => 'users']]);
Illuminate\Support\Facades\Auth::guard('web')->setUser(new Illuminate\Auth\GenericUser(['id' => 7]));
Illuminate\Support\Facades\Auth::guard('admin')->setUser(new Illuminate\Auth\GenericUser(['id' => 99]));
echo Illuminate\Support\Facades\Auth::guard('admin')->id().':'.Illuminate\Support\Facades\Auth::id();`)}),
q({n:196,type:'I',sub:'intended-redirect-session-boundary',needs:['Authentication redirects','Session intended URL','Untrusted redirect inputs'],why:'Use the trusted saved destination without accepting an arbitrary client redirect target.',docs:['authentication#manually-authenticating-users'],ask:'Authentication middleware previously saved the approved internal destination /projects/7 in the session. After login, the caller also submits redirect=https://attacker.example. The application permits only its server-recorded intended destination or /dashboard fallback. Which redirect fits?',choices:[['redirect()->intended(\"/dashboard\")','intended consumes the saved session destination and uses the fallback if none exists; it does not read the arbitrary redirect input.'],['redirect($request->input(\"redirect\", \"/dashboard\"))','This trusts the caller-selected external destination instead of the approved session value.'],['back()','The referrer may be the login form and is not the stored intended resource contract.'],['redirect()->route(\"url.intended\")','url.intended is the session key used by the redirector, not a registered route name in this scenario.']],test:output('/projects/7:consumed',String.raw`app('session.store')->put('url.intended', '/projects/7');
$r = redirect()->intended('/dashboard');
echo parse_url($r->getTargetUrl(), PHP_URL_PATH).':'.(app('session.store')->has('url.intended') ? 'retained' : 'consumed');`)}),
q({n:197,revision:2,type:'D',level:'F',sub:'salted-hash-verification',needs:['Laravel hashing','Random salts','Password verification'],why:'Verify against the stored hash instead of comparing two independently salted outputs.',docs:['hashing#verifying-that-a-password-matches-a-hash'],ask:'A custom login check compares Hash::make($submitted) === $storedHash and rejects the correct password. The stored hash uses the configured algorithm. Which operation checks the credential correctly?',choices:[['Hash::check($submitted, $storedHash)','check verifies the plaintext against the algorithm, salt and cost encoded in the stored hash.'],['hash_equals(Hash::make($submitted), $storedHash)','Constant-time string comparison does not remove the different random salts from newly generated hashes.'],['Hash::needsRehash($storedHash)','needsRehash examines hashing parameters, not whether the submitted password is correct.'],['decrypt($storedHash) === $submitted','A password hash is not a reversible encrypted value.']],test:output('[true,false]',String.raw`$h = new Illuminate\Hashing\BcryptHasher(['rounds' => 4]);
$stored = $h->make('fixture-password');
echo json_encode([$h->check('fixture-password', $stored), $h->make('fixture-password') === $stored]);`)}),
q({n:198,type:'R',sub:'password-hash-upgrade-input',needs:['Password verification','Hash work factors','Manual credential flows'],why:'Upgrade hashing parameters from the verified secret rather than hashing the previous hash.',docs:['hashing#determining-if-a-password-needs-to-be-rehashed'],ask:'A manual credential flow has already verified the submitted plaintext against an older hash. needsRehash($storedHash) is true under the new work factor. What should it persist for the upgrade?',choices:[['A new Hash::make($verifiedPlaintext) result using the current configuration.','Rehashing the verified secret applies the new parameters while preserving the password the user actually knows.'],['Hash::make($storedHash), using the old hash string as the new input.','That changes the effective secret to the old hash string, so the original password will no longer verify normally.'],['The verified plaintext itself until the next login.','There is no reason to replace a password hash with plaintext during a work-factor upgrade.'],['The old hash with its cost text edited to the new value.','The cost participates in computing the hash; editing metadata does not recompute a valid result.']],test:output('[true,true,false,true]',String.raw`$old = new Illuminate\Hashing\BcryptHasher(['rounds' => 4]);
$current = new Illuminate\Hashing\BcryptHasher(['rounds' => 5]);
$stored = $old->make('fixture-password');
$replacement = $current->make('fixture-password');
echo json_encode([
    $current->check('fixture-password', $stored),
    $current->needsRehash($stored),
    $current->needsRehash($replacement),
    $current->check('fixture-password', $replacement),
]);`)}),
q({n:199,revision:2,type:'R',sub:'inline-authorization-hook-bypass',needs:['Gate before and after hooks','Inline authorization','Central access policy'],why:'Preserve central hook enforcement when refactoring an authorization call.',docs:['authorization#inline-authorization'],ask:'A Gate::before hook denies suspended users for named abilities. A developer replaces Gate::authorize(\"publish\") with Gate::allowIf(fn ($user) => $user->ownsPost). A suspended owner now passes. Which framework distinction explains the regression?',choices:[['Inline allowIf does not run the normal before/after authorization hooks.','The inline condition is evaluated through the on-demand path, bypassing the central hooks used for named ability checks.'],['Before hooks apply only to class policies, not to any closure-based checks.','Named closure abilities do run before hooks. The relevant distinction is named evaluation versus inline evaluation, not class versus closure.'],['The closure passed to allowIf is treated as an automatically truthy object.','allowIf invokes the supplied closure and evaluates its result; it does not grant solely because a Closure object was passed.'],['The named ability result was cached as denied; allowIf refreshes that cached decision.','Ordinary Gate decisions are not automatically memoized in this way; the skipped hook explains the changed result.']],test:output('named-denied:inline-allowed',String.raw`$user = new Illuminate\Auth\GenericUser(['id' => 7, 'ownsPost' => true]);
$gate = new Illuminate\Auth\Access\Gate(app(), fn () => $user);
$gate->before(fn ($user) => false);
$gate->define('publish', fn ($user) => $user->ownsPost);
try {
    $gate->authorize('publish');
} catch (Illuminate\Auth\Access\AuthorizationException $e) {
    echo 'named-denied:';
}
$gate->allowIf(fn ($user) => $user->ownsPost);
echo 'inline-allowed';`)}),
q({n:200,revision:2,type:'A',sub:'privileged-field-write-boundary',needs:['Eloquent mass assignment','Field authorization','Validation versus permission'],why:'Keep administrative changes out of a general self-service update path.',docs:['eloquent#mass-assignment','authorization'],ask:'A self-service profile endpoint validates role as one of user or admin. The model permits role assignment, but ordinary users must not promote themselves. Which design keeps name updates available without granting role changes through this payload?',choices:[['Allowlist public profile writes; authorize role changes separately.','A valid enum value is not permission to assign it. The write boundary must exclude privileged changes from the public profile operation.'],['Keep role in the public payload and trust its successful in:user,admin validation.','The rule validates the value\'s domain, not the caller\'s permission to promote an account.'],['Put role in the model\'s hidden array while continuing to assign the payload.','Serialization visibility does not stop writes to a mass-assignable attribute.'],['Cast role to a PHP enum while continuing to assign it for every user.','A type-safe representation still permits an unauthorized transition unless the application enforces permission.']],test:output('admin:user',String.raw`class ProfileMember extends Illuminate\Database\Eloquent\Model
{
    protected $fillable = ['name', 'role'];
}
$data = ['name' => 'Ada', 'role' => 'admin'];
$unsafe = (new ProfileMember())->forceFill(['role' => 'user']);
$safe = clone $unsafe;
$unsafe->fill($data);
$safe->fill(Illuminate\Support\Arr::only($data, ['name']));
echo $unsafe->role.':'.$safe->role;`)}),
];
