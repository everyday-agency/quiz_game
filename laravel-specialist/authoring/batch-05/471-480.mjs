import {validationAssertions} from './retargeted.mjs';
import {q,file,output} from '../record.mjs';
import {feature,assertions} from './fixture.mjs';
export default [
q({n:471,type:'T',sub:'test-transactions-connection-scope',needs:['DatabaseTransactions trait','Multiple database connections','Test isolation'],why:'Identify database writes outside the test’s configured transaction cleanup boundary.',docs:['database-testing#resetting-the-database-after-each-test'],ask:'A test uses DatabaseTransactions with no connectionsToTransact override. It writes to the default connection and a separate audit connection. Which assumption is unsafe?',choices:[['Assuming the trait automatically wraps every configured connection.','By default the trait transacts the default connection; extra connections need explicit inclusion or another cleanup strategy.'],['Assuming the default connection has a wrapping test transaction.','That is the trait’s default behavior when used normally.'],['Assuming audit writes need their own verified cleanup strategy.','That is a prudent response to a connection outside the default transaction list.'],['Assuming connectionsToTransact can explicitly include audit.','The trait supports an explicit list of connections to transact.']],test:output('1:0',String.raw`config(['database.connections.audit' => config('database.connections.sqlite')]);
$t = new class
{
    use Illuminate\Foundation\Testing\DatabaseTransactions;
    public $app;
    public function beforeApplicationDestroyed($callback)
    {
    }
};
$t->app = app();
$t->beginDatabaseTransaction();
echo app('db')->connection()->transactionLevel().':'.app('db')->connection('audit')->transactionLevel();`)}),
q({n:472,type:'T',level:'F',sub:'json-structure-not-exact-contract',needs:['JSON test assertions','Additional response fields'],why:'Choose an assertion that rejects extra fields when an exact contract is required.',docs:['http-tests#assert-json-structure','http-tests#assert-exact-json'],ask:'assertJsonStructure(["id", "name"]) passes after an unwanted debug field is added. The endpoint must return exactly {"id":7,"name":"Ada"}. Which assertion catches that regression?',choices:[['assertExactJson(["id" => 7, "name" => "Ada"])','An exact JSON assertion checks the complete payload, including the absence of unexpected fields.'],['assertJsonStructure(["id", "name"]) again after decoding the response.','The same structure check still allows additional keys.'],['assertJsonFragment(["id" => 7])','A fragment assertion intentionally permits unrelated fields.'],['assertStatus(200)','A successful status does not constrain the JSON object’s keys.']],test:output('structure-passed:exact-failed',String.raw`$r = Illuminate\Testing\TestResponse::fromBaseResponse(response()->json(['id' => 7, 'name' => 'Ada', 'debug' => true]));
$r->assertJsonStructure(['id', 'name']);
echo 'structure-passed:';
try {
    $r->assertExactJson(['id' => 7, 'name' => 'Ada']);
} catch (PHPUnit\Framework\ExpectationFailedException $e) {
    echo 'exact-failed';
}`)}),
q({n:473,type:'T',level:'F',sub:'json-fragment-object-key-order',needs:['JSON object semantics','Fragment assertions'],why:'Assert a relevant subset without binding the test to serialization key ordering.',docs:['http-tests#assert-json-fragment'],ask:'A response may include extra fields and reorder object keys. The contract under test is that it contains id=7 and name="Ada". Which assertion targets that subset?',choices:[['assertJsonFragment(["id" => 7, "name" => "Ada"])','The assertion searches decoded JSON content for the fragment without requiring the whole serialized string or key order.'],['assertContent(\'{"id":7,"name":"Ada"}\')','Exact raw content is sensitive to extra fields and serialization ordering.'],['assertExactJson(["id" => 7, "name" => "Ada"])','An exact payload assertion rejects the permitted extra fields.'],['assertJsonStructure(["id", "name"])','Structure alone does not verify the required values.']],test:output('passed',String.raw`$r = Illuminate\Testing\TestResponse::fromBaseResponse(response()->json(['extra' => 1, 'name' => 'Ada', 'id' => 7]));
$r->assertJsonFragment(['id' => 7, 'name' => 'Ada']);
echo 'passed';`)}),
q({n:474,type:'T',sub:'json-path-strict-type-regression',needs:['JSON number versus string','Path assertions'],why:'Detect a type change that a loose comparison or structure check could miss.',docs:['http-tests#assert-json-path'],ask:'The API contract requires data.count to be the integer 3. A regression returns the string "3". Which assertion directly detects this type change?',choices:[['assertJsonPath("data.count", 3)','The path assertion compares the expected value strictly, so the string does not satisfy the integer expectation.'],['assertJsonStructure(["data" => ["count"]])','A structure assertion checks the path’s presence, not its scalar type.'],['Assert that json("data.count") == 3 with a loose comparison.','PHP’s loose comparison accepts the numeric string and misses the stated regression.'],['Assert that strlen((string) json("data.count")) === 1.','Both representations become the same one-character string under that check.']],test:output('type-rejected',assertions+String.raw`$r = Illuminate\Testing\TestResponse::fromBaseResponse(response()->json(['data' => ['count' => '3']]));
try {
    $r->assertJsonPath('data.count', 3);
} catch (PHPUnit\Framework\ExpectationFailedException $e) {
    echo 'type-rejected';
}`)}),
validationAssertions,
q({n:476,type:'T',level:'F',sub:'feature-expose-original-exception',needs:['Feature exception handling','Failure diagnosis'],why:'Expose an exception hidden behind the application’s rendered error response.',docs:['http-tests#exception-handling'],ask:'A feature test sees only a generic 500 response. During diagnosis it should receive the original application exception instead of its rendered response. Which test setup does that?',choices:[['Call withoutExceptionHandling before the request.','The test handler rethrows unhandled exceptions, exposing their original type and message to the test.'],['Call withoutMiddleware before the request.','Disabling middleware can change application behavior but does not specifically replace exception rendering.'],['Call followingRedirects before the request.','Redirect handling does not expose the cause of a server exception.'],['Call assertOk after the response.','That fails on status without changing the exception-handling path.']],test:output('original failure',feature+String.raw`app('router')->get('/broken', function () {
    throw new DomainException('original failure');
});
$test->exposeExceptions();
try {
    $test->get('/broken');
} catch (DomainException $e) {
    echo $e->getMessage();
}`)}),
q({n:477,type:'R',sub:'feature-authorization-middleware-enabled',needs:['Authorization middleware','Feature test boundaries'],why:'Ensure a security regression test actually exercises the control it claims to protect.',docs:['http-tests#disabling-middleware','authorization#via-middleware'],ask:'A route’s can middleware is its only authorization check. A test for forbidden access calls withoutMiddleware() before making the request. What is the central problem?',choices:[['The test removes the authorization control it needs to exercise.','Disabling all middleware bypasses the stated route protection and cannot verify its normal forbidden-access behavior.'],['withoutMiddleware changes the user’s database permissions to administrator.','It bypasses middleware execution; it does not rewrite stored user permissions.'],['can middleware runs even when all middleware is disabled.','The blanket middleware bypass includes this route middleware.'],['A 200 response proves the policy correctly denied the request.','A successful response does not establish denial, particularly after the denying control was bypassed.']],test:output('403:200',feature+String.raw`Illuminate\Support\Facades\Gate::define('view-secret', fn ($user = null) => false);
app('router')->get('/secret', fn () => 'secret')->middleware('can:view-secret');
echo $test->get('/secret')->status().':';
$test->withoutMiddleware();
echo $test->get('/secret')->status();`)}),
q({n:478,type:'T',level:'F',sub:'actingas-not-login-credential-test',needs:['Test authentication','Guard identity','Login flow'],why:'Distinguish an authenticated endpoint test from evidence that credential authentication works.',docs:['http-tests#session-and-authentication'],ask:'A test uses actingAs($user) and successfully accesses a protected route. What has it not established?',choices:[['That the login endpoint validates the user’s password correctly.','actingAs sets the test guard’s identity directly; it does not submit credentials through the login flow.'],['That the protected request can run with a supplied authenticated identity.','That is precisely the boundary the described setup can exercise.'],['That the guard can expose the supplied user during the request.','actingAs installs that user on the test guard.'],['That the request can reach the route after authentication is supplied.','The successful protected request provides evidence for that route access under the supplied identity.']],test:output('7',feature+String.raw`config(['auth.defaults.guard' => 'web', 'auth.guards.web' => ['driver' => 'session', 'provider' => 'users'], 'auth.providers.users' => ['driver' => 'database', 'table' => 'users']]);
$user = new Illuminate\Auth\GenericUser(['id' => 7, 'password' => 'unused']);
$test->actingAs($user);
app('router')->get('/me', fn () => (string) auth()->id())->middleware('auth');
echo $test->get('/me')->getContent();`)}),
q({n:479,type:'T',sub:'database-has-not-uniqueness-proof',needs:['Database assertions','Matching rows','Uniqueness requirements'],why:'Add a cardinality check when existence alone permits duplicates.',docs:['database-testing#assert-database-has','database-testing#assert-database-count'],ask:'assertDatabaseHas("subscriptions", ["user_id" => 7]) passes even if a bug inserts two subscriptions for user 7. The test permits unrelated users’ rows. What additional check targets the defect?',choices:[['Assert that the query filtered to user_id=7 has count 1.','A filtered cardinality assertion rejects duplicate rows for that user while allowing unrelated users.'],['Repeat assertDatabaseHas with the same filter twice.','Repeated existence checks do not establish that exactly one row matches.'],['Assert that the entire subscriptions table has count 1.','That incorrectly rejects the unrelated users’ rows the test permits.'],['Assert that at least one subscription has a non-null primary key.','Both duplicate rows can have distinct valid primary keys.']],test:output('exists:2',String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
Schema::create('subscriptions', function ($t) {
    $t->id();
    $t->integer('user_id');
});
DB::table('subscriptions')->insert([['user_id' => 7], ['user_id' => 7], ['user_id' => 8]]);
PHPUnit\Framework\Assert::assertTrue(DB::table('subscriptions')->where('user_id', 7)->exists());
echo 'exists:'.DB::table('subscriptions')->where('user_id', 7)->count();`)}),
q({n:480,type:'T',level:'F',sub:'scoped-time-freeze-restoration',needs:['Test clock control','Scoped callbacks'],why:'Keep a successful time-specific test section from leaving later work on a frozen clock.',docs:['mocking#interacting-with-time'],assume:['No clock was already frozen, and the callback returns normally.'],ask:'Which use of the test time helpers freezes the clock for one callback and automatically clears that freeze after the callback returns?',choices:[['$this->freezeTime(fn () => $this->assertTimeSensitiveBehavior())','The callback form scopes the clock change and restores ordinary time after normal callback completion.'],['$this->freezeTime(); $this->assertTimeSensitiveBehavior();','Without the callback or explicit travelBack, this sequence leaves the clock frozen until later cleanup.'],['$this->travelTo($instant); $this->assertTimeSensitiveBehavior();','The non-callback travelTo form also requires later restoration.'],['Carbon::setTestNow($instant); $this->assertTimeSensitiveBehavior();','Directly setting test time does not automatically clear it after the next statement.']],test:output('frozen:restored',String.raw`$t = new class
{
    use Illuminate\Foundation\Testing\Concerns\InteractsWithTime;
};
$t->freezeTime(function () {
    echo Illuminate\Support\Carbon::hasTestNow() ? 'frozen:' : 'normal:';
});
echo Illuminate\Support\Carbon::hasTestNow() ? 'frozen' : 'restored';`)}),
];
