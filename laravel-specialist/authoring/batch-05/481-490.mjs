import {q,file,output} from '../record.mjs';
import {feature,assertions} from './fixture.mjs';
export default [
q({n:481,type:'T',level:'F',sub:'following-redirects-final-response',needs:['Feature test redirects','Intermediate versus final responses'],why:'Choose the response boundary that actually verifies a redirect.',docs:['http-tests#following-redirects','http-tests#assert-redirect'],ask:'A POST redirects to a page that returns 200. A test uses followingRedirects()->post(...) and then expects a redirect status on the returned TestResponse. Why does that fail?',choices:[['The helper returns the final followed response, so assert the redirect before enabling redirect following.','Following redirects consumes the intermediate redirect and exposes the destination response.'],['followingRedirects changes the controller’s redirect into a JSON response.','The helper follows requests; it does not rewrite the controller’s response format.'],['A POST can never produce a redirect in a feature test.','Redirect responses are valid and testable without following them.'],['The helper deletes the Location header from the application’s original response before routing.','The issue is which response is returned, not an application redirect being removed before it exists.']],test:output('302:200:done',feature+String.raw`app('router')->post('/submit', fn () => redirect('/done'));
app('router')->get('/done', fn () => 'done');
echo $test->post('/submit')->status().':';
$final = $test->followingRedirects()->post('/submit');
echo $final->status().':'.$final->getContent();`)}),
q({n:482,type:'T',sub:'streamed-response-assertion-executes-body',needs:['Streamed responses','Output callbacks','Feature assertions'],why:'Verify generated stream content rather than the ordinary response content slot.',docs:['http-tests#assert-streamed-content'],ask:'An endpoint uses response()->stream to echo CSV rows. Which assertion checks the emitted body rather than treating getContent() as an ordinary buffered body?',choices:[['assertStreamedContent($expectedCsv)','The streamed-content assertion captures the stream callback’s output and compares it with the expected body.'],['assertContent($expectedCsv) on the untouched streamed response','The ordinary content field is not where the callback’s emitted bytes are stored.'],['assertHeader("Content-Type", "text/csv") alone','A content type does not verify the generated rows.'],['Assert that the response object has a callback property','The presence of a callback does not prove its output is correct.']],test:output('verified',assertions+String.raw`$base = response()->stream(function () {
    echo "id,name\n7,Ada\n";
}, 200, ['Content-Type' => 'text/csv']);
$r = Illuminate\Testing\TestResponse::fromBaseResponse($base);
$r->assertStreamedContent("id,name\n7,Ada\n");
echo 'verified';`)}),
q({n:483,type:'T',sub:'json-path-absent-not-null',needs:['JSON key absence','Sensitive field tests'],why:'Reject a sensitive field even if its current value is null.',docs:['http-tests#assert-json-missing-path'],ask:'A public response must not contain data.api_token at all. Which assertion rejects both a real token and an explicit null field at that path?',choices:[['assertJsonMissingPath("data.api_token")','The assertion tests absence of the path, so a present null field still violates the contract.'],['assertJsonPath("data.api_token", null)','This expects a null value and does not require the sensitive key to be absent.'],['Assert that json("data.api_token") !== "secret"','That permits other token strings and a present null field.'],['assertJsonStructure(["data"])','The presence of data says nothing about whether a nested secret field exists.']],test:output('present-null-rejected',assertions+String.raw`$r = Illuminate\Testing\TestResponse::fromBaseResponse(response()->json(['data' => ['api_token' => null]]));
try {
    $r->assertJsonMissingPath('data.api_token');
} catch (PHPUnit\Framework\ExpectationFailedException $e) {
    echo 'present-null-rejected';
}`)}),
q({n:484,type:'T',sub:'console-output-plus-exit-status',needs:['Artisan commands','Exit codes','Console tests'],why:'Verify operational success independently of a printed message.',docs:['console-tests#success-failure-expectations','console-tests#input-output-expectations'],ask:'A command prints "Imported" but returns exit code 1 after detecting an incomplete import. A regression test currently checks only that text. What should it also verify for a successful-import case?',choices:[['The command exits successfully, in addition to printing the expected output.','Printed text and process success are independent; checking both catches the stated contradiction.'],['The output contains "Imported" twice.','Repeating the text check still does not inspect the exit status.'],['The command class has a nonempty description.','Command metadata does not establish successful execution.'],['The console output is nonempty regardless of its content.','Even an error path can produce nonempty output and a failure exit code.']],test:output('printed:1',String.raw`Illuminate\Support\Facades\Artisan::command('probe:import', function () {
    $this->info('Imported');
    return 1;
});
$status = Illuminate\Support\Facades\Artisan::call('probe:import');
echo (str_contains(Illuminate\Support\Facades\Artisan::output(), 'Imported') ? 'printed' : 'missing').':'.$status;`)}),
q({n:485,type:'T',sub:'container-fake-versus-manual-dependency',needs:['Dependency injection','Test doubles','Manual construction'],why:'Choose a construction boundary through which a test replacement can actually flow.',docs:['mocking#mocking-objects'],ask:'A test binds a fake PaymentGateway in the container. The action still executes new Checkout(new RealGateway). Why does the fake not intercept that collaborator?',choices:[['Manual construction bypasses the container binding; resolve or inject the collaborator through that boundary.','A container replacement affects dependencies obtained from the container, not an explicitly constructed unrelated object.'],['Container bindings apply only to static methods on the gateway.','Bindings control resolution of objects, not a static-method-only interception mechanism.'],['The fake must have the same object ID as the manually constructed real gateway.','Object IDs are not a mechanism for replacing manually created dependencies.'],['The binding will replace the real gateway after its first method call.','The container does not retroactively swap arbitrary object references after a call.']],test:output('real:fake',String.raw`interface PaymentGateway
{
    public function charge(): string;
}
class RealGateway implements PaymentGateway
{
    public function charge(): string
    {
        return 'real';
    }
}
class Checkout
{
    public function __construct(public PaymentGateway $gateway)
    {
    }
}
app()->instance(PaymentGateway::class, new class implements PaymentGateway
{
    public function charge(): string
    {
        return 'fake';
    }
});
echo (new Checkout(new RealGateway))->gateway->charge().':';
echo app(Checkout::class)->gateway->charge();`)}),
q({n:486,type:'T',sub:'parallel-tests-nondatabase-resource-token',needs:['Parallel test processes','Shared filesystem resources','Process tokens'],why:'Extend test isolation to a resource not isolated by database naming.',docs:['testing#parallel-testing'],ask:'Parallel tests have separate test databases but all write exports/report.csv in the same filesystem. Intermittent overwrites occur. Which change addresses this non-database collision?',choices:[['Include the parallel process token in each process’s export directory and clean up that directory.','A process-specific namespace separates file artifacts; separate database names do not isolate arbitrary filesystem paths.'],['Keep the shared path because the database suffix also applies to every file operation.','Laravel’s parallel database naming does not automatically rewrite custom file paths.'],['Add a database transaction around the CSV write.','A database transaction does not make a shared file path process-specific.'],['Disable foreign-key checks in each test database.','Foreign-key enforcement is unrelated to two processes writing the same file.']],test:output('separate',String.raw`$parallel = new Illuminate\Testing\ParallelTesting(app());
$parallel->resolveTokenUsing(fn () => 1);
$a = 'exports/'.$parallel->token().'/report.csv';
$parallel->resolveTokenUsing(fn () => 2);
$b = 'exports/'.$parallel->token().'/report.csv';
echo $a !== $b ? 'separate' : 'collision';`)}),
q({n:487,type:'T',sub:'test-manager-aftercommit-outer-wrapper',needs:['DatabaseTransactions test manager','Nested application transactions','After-commit callbacks'],why:'Apply the test-specific transaction manager’s callback boundary rather than assuming the outer cleanup transaction suppresses all callbacks.',docs:['database-testing#resetting-the-database-after-each-test','queues#jobs-and-database-transactions'],assume:['Laravel 13.40’s DatabaseTransactions trait has installed its normal testing transaction manager. The application opens and commits one transaction inside the outer test transaction.'],ask:'An afterCommit callback is registered inside that application transaction. Must it wait until the outer test transaction commits, which normally never happens?',choices:[['No; the testing manager can run it when the application transaction returns to the outer test level.','The test manager treats the wrapping test transaction specially and executes callbacks at that boundary. This does not prove a real production commit occurred.'],['Yes; the test manager always behaves identically to the ordinary production transaction manager.','Laravel’s testing manager explicitly adjusts callback applicability for the outer test transaction.'],['No; afterCommit callbacks execute immediately even before the inner transaction commits.','The callback registered inside the application transaction waits for its relevant commit boundary.'],['Yes; the callback is permanently disabled whenever any PHPUnit assertion runs.','Assertions do not globally disable after-commit callbacks.']],test:output('0:1:1',String.raw`$t = new class
{
    use Illuminate\Foundation\Testing\DatabaseTransactions;
    public $app;
    public function beforeApplicationDestroyed($callback)
    {
    }
};
$t->app = app();
$t->beginDatabaseTransaction();
$ran = 0;
Illuminate\Support\Facades\DB::transaction(function () use (&$ran) {
    Illuminate\Support\Facades\DB::afterCommit(function () use (&$ran) {
        $ran++;
    });
    echo $ran.':';
});
echo $ran.':'.Illuminate\Support\Facades\DB::transactionLevel();`)}),
q({n:488,type:'T',sub:'sqlite-tests-not-postgres-lock-proof',needs:['Database engine differences','Pessimistic locks','Integration test scope'],why:'Identify an unsupported inference about concurrency from a different test database engine.',docs:['queries#pessimistic-locking','database-testing#introduction'],ask:'A locking test passes against SQLite in memory. Production uses PostgreSQL row locks through lockForUpdate. What additional evidence is needed before claiming the competing-worker behavior is verified?',choices:[['A PostgreSQL integration test with separate connections exercising the intended contention.','SQLite does not provide the same row-lock semantics; the production concurrency claim needs the relevant engine and concurrent connection boundary.'],['Only another SQLite run with a larger fixture table.','More rows do not make SQLite implement PostgreSQL row-lock behavior.'],['Only an assertion that the query builder method name appears in the source.','A method-name check does not establish how competing transactions behave.'],['Only a longer PHP execution timeout for the existing single-connection test.','Waiting longer does not introduce the missing database engine or competing connection.']],test:output('sqlite-no-for-update:postgres-for-update',String.raw`$sqlite = app('db')->connection();
$a = $sqlite->table('items')->lockForUpdate()->toSql();
$pg = new Illuminate\Database\PostgresConnection(new PDO('sqlite::memory:'));
$b = $pg->table('items')->lockForUpdate()->toSql();
echo (! str_contains($a, 'for update') ? 'sqlite-no-for-update' : 'unexpected').':';
echo str_contains($b, 'for update') ? 'postgres-for-update' : 'missing';`)}),
q({n:489,type:'T',sub:'factory-explicit-branch-state',needs:['Model factories','Deterministic branch coverage'],why:'Remove random selection from a test whose purpose is to exercise one business branch.',docs:['eloquent-factories#factory-states'],ask:'A test of suspended-account rejection relies on the factory randomly choosing status="suspended". It sometimes creates an active account and misses the branch. Which fixture design makes this test deterministic?',choices:[['Use an explicit suspended factory state or override status for this test.','The branch prerequisite becomes deliberate rather than dependent on random generated attributes.'],['Run the random factory once more whenever the assertion fails.','Retrying can hide a missing branch setup and still does not guarantee the intended state.'],['Seed the random generator but never assert or specify the generated status.','A seed may repeat a value, but it does not express or guarantee the required business state across factory changes.'],['Increase the number of unrelated generated users without selecting their status.','More random data does not make the subject of this assertion suspended.']],test:output('suspended',String.raw`class Account extends Illuminate\Database\Eloquent\Model
{
    protected $guarded = [];
}
class AccountFactory extends Illuminate\Database\Eloquent\Factories\Factory
{
    protected $model = Account::class;
    public function definition(): array
    {
        return ['status' => 'active'];
    }
    public function suspended(): static
    {
        return $this->state(['status' => 'suspended']);
    }
}
echo AccountFactory::new()->suspended()->make()->status;`)}),
q({n:490,type:'T',sub:'soft-delete-versus-physical-missing-assertions',needs:['Eloquent SoftDeletes','Database assertions'],why:'Verify logical deletion without incorrectly requiring the physical row to disappear.',docs:['database-testing#assert-soft-deleted','eloquent#soft-deleting'],ask:'The deletion endpoint uses SoftDeletes and should retain the row with deleted_at set. Which assertion targets that requirement?',choices:[['assertSoftDeleted("documents", ["id" => $id])','The soft-delete assertion verifies a matching row with a non-null deletion timestamp.'],['assertDatabaseMissing("documents", ["id" => $id])','That requires the matching physical row to be absent, contrary to soft deletion.'],['assertDatabaseHas("documents", ["id" => $id]) alone','The row’s existence does not establish that deleted_at was set.'],['Assert only that a normal model query cannot find the ID.','A normal scoped query can hide the row for other reasons and does not directly prove the required retained soft-delete state.']],test:output('soft-deleted:row-retained',feature+String.raw`Illuminate\Support\Facades\Schema::create('documents', function ($t) {
    $t->id();
    $t->softDeletes();
});
class Document extends Illuminate\Database\Eloquent\Model
{
    use Illuminate\Database\Eloquent\SoftDeletes;
    public $timestamps = false;
    protected $guarded = [];
}
$d = Document::create([]);
$d->delete();
(function () use ($d) {
    $this->assertSoftDeleted('documents', ['id' => $d->id]);
    $this->assertDatabaseHas('documents', ['id' => $d->id]);
})->call($test);
echo 'soft-deleted:row-retained';`)}),
];
