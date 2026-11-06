import {q,file,output,contract} from '../record.mjs';
export default [
q({n:181,revision:2,type:'D',sub:'csrf-versus-authentication-failure',needs:['Laravel 13 request-forgery middleware','Session tokens','Authentication distinction'],why:'Identify a failed request-integrity check independently of whether a user is authenticated.',docs:['csrf','authentication'],ask:'In Laravel 13.40, an authenticated browser user sends a protected POST without a CSRF token or Sec-Fetch-Site header. The route is not exempt, testing bypass is off, and normal token fallback is enabled. Under default exception handling, what does a 419 indicate?',choices:[['Request-forgery validation failed.','With neither accepted origin metadata nor a matching token, this protected POST fails the token check even if a user is authenticated.'],['The password was necessarily incorrect.','A 419 token-mismatch response does not establish a credential-verification failure.'],['The resource policy returned false.','A policy denial normally concerns authorization; the stated failure occurs at the request-forgery boundary.'],['The route does not support POST.','Unsupported HTTP methods produce a routing failure such as 405, not the stated token-mismatch status.']],test:output('419',String.raw`app()->instance('env', 'local');
$session = app('session.store');
$session->start();
$r = Illuminate\Http\Request::create('/save', 'POST');
$r->setLaravelSession($session);
$r->setUserResolver(fn () => new Illuminate\Auth\GenericUser(['id' => 7]));
$middleware = app(Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class);
try {
    $middleware->handle($r, fn () => response('saved'));
} catch (Illuminate\Session\TokenMismatchException $e) {
    echo app(Illuminate\Contracts\Debug\ExceptionHandler::class)->render($r, $e)->getStatusCode();
}`)}),
q({n:182,type:'A',sub:'webhook-narrow-csrf-exemption',needs:['External webhooks','Request-forgery exclusions','Webhook authentication'],why:'Separate browser CSRF protection from provider-to-server authentication at one endpoint.',docs:['csrf#excluding-uris','requests'],ask:'A payment provider posts signed webhooks without the browser session CSRF token. The application also serves ordinary browser payment forms. Which boundary accommodates the provider while retaining protection for those forms?',choices:[['Exempt only the webhook URI and verify the provider signature and replay constraints at that endpoint.','The external integration uses its own authenticated-message contract; the narrow exemption preserves browser-form protection elsewhere.'],['Exempt the whole payments/* prefix and treat any POST as provider-originated.','That broadens the exemption to browser forms and does not authenticate the sender.'],['Require the provider to copy a token from an arbitrary user session.','A browser session token is not the provider integration credential and does not establish the webhook signature contract.'],['Trust a submitted provider=true field instead of verifying the webhook signature.','A sender can choose that field; it does not authenticate the message.']],test:contract('Illuminate/Foundation/Configuration/Middleware.php',['public function preventRequestForgery(', 'PreventRequestForgery::except($except)'],'The middleware supports targeted URI exemptions. Provider signature/replay verification is a separate application requirement and is not claimed to be exercised against a payment service.')}),
q({n:183,revision:2,type:'T',sub:'csrf-test-environment-bypass',needs:['Laravel testing environment','Request-forgery middleware','Negative security tests'],why:'Avoid interpreting an intentionally bypassed framework test path as evidence of token enforcement.',docs:['csrf','http-tests#session-authentication'],ask:'A standard HTTP test runs in the testing environment and a tokenless protected POST succeeds. The team claims this proves token validation is broken in production. What must a focused enforcement test account for?',choices:[['Exercise a non-bypass path with explicit origin and token conditions.','A test-environment success can reflect the documented bypass, not production enforcement. Laravel 13 origin acceptance must also be controlled.'],['Tokenless success proves the middleware is disabled in every environment.','The middleware explicitly considers the environment, so this observation cannot support that global conclusion.'],['Changing only Accept to application/json forces CSRF enforcement during ordinary testing.','Accept controls response preference, not the unit-test bypass condition.'],['Asserting that the middleware class appears in the source file is sufficient to prove enforcement.','Class presence does not exercise the runtime decision or a failing token path.']],test:output('passed:blocked',String.raw`$s = app('session.store');
$s->start();
$r = Illuminate\Http\Request::create('/save', 'POST');
$r->setLaravelSession($s);
$m = app(Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class);
$m->handle($r, fn () => response('ok'));
echo 'passed:';
app()->instance('env', 'local');
try {
    $m->handle($r, fn () => response('ok'));
} catch (Illuminate\Session\TokenMismatchException $e) {
    echo 'blocked';
}`)}),
q({n:184,revision:2,type:'R',level:'F',sub:'authenticated-not-resource-authorized',needs:['Authentication','Resource authorization','Policies'],why:'Add a resource permission check after identifying the caller.',docs:['authorization#authorizing-actions'],ask:'An update endpoint has auth middleware, but every signed-in user can edit another user\'s private document by changing the document ID. Which missing boundary addresses this without blocking legitimate owners?',choices:[['Authorize update for the current user and resolved document.','Authentication identifies the caller; a resource-specific policy can decide whether that caller may update this document.'],['Add auth middleware a second time to the same route.','Repeating identity verification does not add a document ownership/permission decision.'],['Require the document ID to be an integer.','A well-formed identifier may still identify another user\'s private document.'],['Hide edit links for nonowners but leave the endpoint unchanged.','Clients can call the endpoint directly; presentation controls do not enforce server-side permission.']],test:output('[true,false]',String.raw`$owner = new Illuminate\Auth\GenericUser(['id' => 7]);
$other = new Illuminate\Auth\GenericUser(['id' => 8]);
$document = (object) ['owner_id' => 7];
$gate = new Illuminate\Auth\Access\Gate(app(), fn () => $owner);
$gate->define('update-document', fn ($user, $doc) => $user->id === $doc->owner_id);
echo json_encode([$gate->allows('update-document', $document), $gate->forUser($other)->allows('update-document', $document)]);`)}),
q({n:185,revision:2,type:'R',level:'F',sub:'policy-server-resource-not-body-claim',needs:['Policies','Trusted resource state','Untrusted form fields'],why:'Use persisted authorization facts rather than a caller-selected ownership claim.',docs:['authorization#writing-policies'],ask:'A document policy allows updates when the request body says is_owner=true. A caller can choose that value. The server-resolved document has a trusted owner_id. Which policy predicate uses the relevant authority?',choices:[['Compare the current user ID with the resolved document\'s owner_id.','The decision uses server-controlled resource ownership rather than the caller\'s unsupported ownership claim.'],['Cast the submitted is_owner field to boolean before trusting it.','Conversion changes representation but does not make the claim authoritative.'],['Require is_owner to pass the accepted validation rule before trusting it.','A caller can submit an accepted value; validation of the claim is not proof of ownership.'],['Require the is_owner key to be present and hide it in the rendered form.','A hidden form field is still client-controlled, and presence does not establish the permission.']],test:output('false',String.raw`$user = new Illuminate\Auth\GenericUser(['id' => 7]);
$document = (object) ['owner_id' => 9];
$gate = new Illuminate\Auth\Access\Gate(app(), fn () => $user);
$gate->define('update', fn ($user, $doc) => $user->id === $doc->owner_id);
$submitted = ['is_owner' => true];
echo json_encode($gate->allows('update', $document));`)}),
q({n:186,revision:2,type:'D',level:'F',sub:'gate-boolean-versus-throwing-check',needs:['Gate allows','Gate authorize','Exception control flow'],why:'Make a failed permission check interrupt the operation instead of discarding its result.',docs:['authorization#authorizing-or-throwing-exceptions'],ask:'An action calls Gate::allows(\"publish\", $post) as a standalone statement, ignores its return value, then publishes. Which standalone replacement stops the action on denial under normal handling?',choices:[['Gate::authorize(\"publish\", $post)','authorize throws an AuthorizationException when the ability is denied, interrupting the action.'],['Gate::denies(\"publish\", $post)','denies returns a boolean; ignoring it still lets the action continue.'],['Gate::inspect(\"publish\", $post)','inspect returns an authorization response for the caller to examine; simply discarding it does not enforce denial.'],['Gate::check(\"publish\", $post)','check reports a boolean result rather than throwing on a denied ability.']],test:output('continued:blocked',String.raw`$gate = new Illuminate\Auth\Access\Gate(app(), fn () => new Illuminate\Auth\GenericUser(['id' => 7]));
$gate->define('publish', fn ($user, $post) => false);
$post = new stdClass();
$gate->allows('publish', $post);
echo 'continued:';
try {
    $gate->authorize('publish', $post);
} catch (Illuminate\Auth\Access\AuthorizationException $e) {
    echo 'blocked';
}`)}),
q({n:187,type:'I',sub:'policy-not-found-denial',needs:['Authorization responses','Resource-existence privacy'],why:'Choose a deliberate HTTP denial status while retaining an authorization failure.',docs:['authorization#customizing-the-http-response-status'],ask:'A policy should deny access to a private resource with a 404 response to avoid confirming its existence. The action calls Gate::authorize normally. Which policy return value selects that denial status?',choices:[['Response::denyAsNotFound() from Illuminate\\Auth\\Access\\Response','The authorization response carries a not-found denial status into the thrown authorization exception.'],['false','A plain false denial uses the ordinary forbidden status rather than selecting 404.'],['Response::allow()','This grants the ability, so the action would be authorized to proceed.'],['null because the resource should appear absent','A null policy result does not itself select a 404 denial status.']],test:output('404',String.raw`$gate = new Illuminate\Auth\Access\Gate(app(), fn () => new Illuminate\Auth\GenericUser(['id' => 7]));
$gate->define('view-private', fn ($user) => Illuminate\Auth\Access\Response::denyAsNotFound());
try {
    $gate->authorize('view-private');
} catch (Illuminate\Auth\Access\AuthorizationException $e) {
    echo $e->status();
}`)}),
q({n:188,type:'D',sub:'authorization-before-null-fallthrough',needs:['Gate before hooks','Nullable authorization decisions'],why:'Preserve ordinary ability checks when an override has no decision to make.',docs:['authorization#intercepting-gate-checks'],ask:'A Gate::before callback grants administrators with true but returns false for everyone else. Nonadministrators are now denied even abilities whose own callback returns true. What should the before hook return when it intends to defer to the ordinary ability?',choices:[['null','A null result means no override decision, so the ordinary ability callback can run.'],['false','A non-null false result is already a denial and prevents the normal callback from supplying a different result.'],['true','That grants every deferred case instead of evaluating its ordinary permission rule.'],['Response::allow()','An allow response is an overriding grant, not a request to continue with normal checks.']],test:output('[false,true]',String.raw`$user = new Illuminate\Auth\GenericUser(['id' => 7, 'admin' => false]);
$a = new Illuminate\Auth\Access\Gate(app(), fn () => $user);
$a->before(fn ($user) => $user->admin ? true : false);
$a->define('read', fn ($user) => true);
$b = new Illuminate\Auth\Access\Gate(app(), fn () => $user);
$b->before(fn ($user) => $user->admin ? true : null);
$b->define('read', fn ($user) => true);
echo json_encode([$a->allows('read'), $b->allows('read')]);`)}),
q({n:189,type:'I',sub:'guest-policy-nullable-user',needs:['Guest authorization','Policy method signatures','Public routes'],why:'Let a deliberate public-resource policy evaluate a guest without granting every ability globally.',docs:['authorization#guest-users'],ask:'A public route should allow guests to view only documents marked public. Its policy method currently requires a non-null User, so guest checks never reach its public-flag logic. Which change enables the intended policy evaluation?',choices:[['Allow a nullable user parameter and keep the public-resource decision inside the policy.','A guest-compatible user parameter lets Laravel call the policy with null so it can decide based on the resource.'],['Make the document parameter nullable but leave the user non-nullable.','The missing argument is the guest user, not the resolved document.'],['Keep the signature and check for null only inside the method body.','The framework avoids calling a method whose user parameter does not permit guests.'],['Add a global before hook that returns true for every guest.','That grants unrelated abilities and private resources instead of applying this narrow public-document rule.']],test:output('[true,false]',String.raw`class PublicDocument
{
    public function __construct(public bool $public) {}
}
class PublicDocumentPolicy
{
    public function view(?Illuminate\Auth\GenericUser $user, PublicDocument $document): bool
    {
        return $document->public;
    }
}
$gate = new Illuminate\Auth\Access\Gate(app(), fn () => null);
$gate->policy(PublicDocument::class, PublicDocumentPolicy::class);
echo json_encode([$gate->allows('view', new PublicDocument(true)), $gate->allows('view', new PublicDocument(false))]);`)}),
q({n:190,type:'E',sub:'gate-for-user-isolation',needs:['Gate user resolution','Alternate-user checks'],why:'Evaluate a separate identity without changing the original gate or login session.',docs:['authorization#authorizing-actions'],ask:'The original gate resolves user 2. A permission is granted only to user 1. What does this sequence produce?',code:[file(String.raw`use Illuminate\Auth\Access\Gate;
use Illuminate\Auth\GenericUser;

$current = new GenericUser(['id' => 2]);
$other = new GenericUser(['id' => 1]);
$gate = new Gate(app(), fn () => $current);
$gate->define('approve', fn ($user) => $user->id === 1);

echo json_encode([
    $gate->forUser($other)->allows('approve'),
    $gate->allows('approve'),
]);`)],choices:[['[true,false]','forUser returns a gate configured for the other user; the original resolver remains user 2.'],['[true,true]','The alternate-user check does not replace the original gate\'s user resolver.'],['[false,false]','The gate returned by forUser does evaluate the supplied user 1.'],['[false,true]','This reverses the identity used by the alternate gate and original gate.']],test:output('[true,false]')}),
];
