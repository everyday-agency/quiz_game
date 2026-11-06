import {q,file,output} from '../record.mjs';
import {http} from '../batch-05/fixture.mjs';
export default [
q({n:581,type:'R',sub:'domain-calculation-transport-independent',needs:['Controller boundaries','Value arguments','Jobs and commands'],why:'Separate transport parsing from a calculation that must run through several entry points.',docs:['controllers#dependency-injection-and-controllers','container#automatic-injection'],ask:'A shipping-price calculation will be used by an HTTP controller and an Artisan import. It currently reads Request and returns JsonResponse. Which service signature gives both entry points the same calculation without fabricating an HTTP request?',choices:[['quote(int $grams, string $zone): Money; each entry point adapts its own input and output.','Domain values express the calculation’s requirements while HTTP and CLI adapters handle their respective transports.'],['quote(Request $request): JsonResponse; the command constructs a synthetic Request.','This preserves the HTTP coupling that the stated reuse requirement aims to remove.'],['quote(array $server, array $post): JsonResponse; the controller passes superglobals.','Arrays named after HTTP transport data and an HTTP response still tie the service to that transport.'],['quote(): JsonResponse; the service reads request() internally.','Removing the parameter hides rather than removes the dependency on an ambient HTTP request.']],test:output('1200:1200',String.raw`final readonly class Money
{
    public function __construct(public int $cents) {}
}
final class ShippingQuote
{
    public function quote(int $grams, string $zone): Money
    {
        return new Money($zone === 'local' ? 500 + $grams : 900 + $grams);
    }
}
$service = app(ShippingQuote::class);
$httpInput = Illuminate\Http\Request::create('/', 'POST', ['grams' => 700, 'zone' => 'local']);
$a = $service->quote((int) $httpInput->input('grams'), $httpInput->input('zone'));
$b = $service->quote(700, 'local');
echo $a->cents.':'.$b->cents;`)}),
q({n:582,type:'A',sub:'business-operation-transaction-boundary',needs:['Database transactions','Repository boundaries','Atomic local writes'],why:'Place atomicity around the business unit of work rather than around each isolated persistence call.',docs:['database#database-transactions'],assume:['Both repositories use the same database connection. debit() and credit() each open and commit their own transaction. No outer transaction exists. credit() can throw.'],ask:'A transfer service calls debit(), then credit(). Which refactor ensures a failed credit also rolls back the debit?',choices:[['Wrap both calls in one outer transaction on that connection and let the failure escape it.','The business operation becomes the transaction boundary, so a propagated failure rolls back all its local writes.'],['Increase the retry count on credit() while leaving debit() independently committed.','Retries may still be exhausted and cannot roll back a debit that has already committed independently.'],['Catch the credit exception and return a failure result without changing the boundary.','Reporting failure does not undo the earlier committed write.'],['Move debit() into a model observer while retaining the separate commits.','Changing the call location does not establish a transaction covering both writes.']],test:output('100:0',String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
Schema::create('balances', function ($t) {
    $t->id();
    $t->integer('amount');
});
DB::table('balances')->insert([['id' => 1, 'amount' => 100], ['id' => 2, 'amount' => 0]]);
try {
    DB::transaction(function () {
        DB::transaction(fn () => DB::table('balances')->where('id', 1)->decrement('amount', 20));
        DB::transaction(function () {
            throw new RuntimeException('credit failed');
        });
    });
} catch (RuntimeException) {
}
echo DB::table('balances')->where('id', 1)->value('amount').':'.DB::table('balances')->where('id', 2)->value('amount');`)}),
q({n:583,type:'A',sub:'domain-outcomes-transport-mapping',needs:['Service result contracts','HTTP adapters','CLI adapters'],why:'Keep business outcomes stable while allowing each transport to choose its own response representation.',docs:['responses','artisan#commands'],ask:'A reservation service returns 409 for unavailable stock. A console importer interprets that integer as a process exit code. Which result contract makes the business outcome explicit for both callers?',choices:[['Return a Reserved or Unavailable outcome; map it to HTTP status or CLI behavior at each boundary.','A domain outcome conveys what happened without making HTTP status codes the shared business vocabulary.'],['Return JsonResponse directly and have the importer extract its status code.','The command still depends on an HTTP response contract for a non-HTTP operation.'],['Return true for reserved and false for every failure, including database outages.','That collapses a normal business rejection and an infrastructure failure into one indistinguishable result.'],['Throw HttpException for unavailable stock in every entry point.','A transport-specific exception still makes the domain service depend on HTTP semantics.']],test:output('409:unavailable',String.raw`enum ReservationOutcome
{
    case Reserved;
    case Unavailable;
}
$outcome = ReservationOutcome::Unavailable;
$http = response()->json(['state' => 'unavailable'], match ($outcome) {
    ReservationOutcome::Reserved => 201,
    ReservationOutcome::Unavailable => 409,
});
$cli = match ($outcome) {
    ReservationOutcome::Reserved => 'reserved',
    ReservationOutcome::Unavailable => 'unavailable',
};
echo $http->getStatusCode().':'.$cli;`)}),
q({n:584,type:'R',sub:'service-extraction-preserves-invariant',needs:['Form validation','Domain invariants','Multiple entry points'],why:'Preserve an invariant at a boundary that all callers share instead of relying on one controller’s validation.',docs:['validation','controllers'],assume:['An account’s credit limit must be nonnegative for every caller. The controller validates min:0, but a new import command will call the extracted service directly.'],ask:'Which extraction preserves the invariant for both entry points?',choices:[['Enforce the nonnegative limit in the shared domain operation or value object, with HTTP validation retained for feedback.','All callers cross the shared invariant boundary; controller validation can still provide useful transport-level errors.'],['Move the existing assignment into a service and rely on the controller’s rule.','The import does not pass through that controller, so the invariant is no longer protected for every caller.'],['Have the import call the controller action directly to reuse its request validation.','That couples the CLI flow to the HTTP adapter rather than establishing the shared domain boundary.'],['Accept negative values in the service and clamp them only when displaying the balance.','Display formatting does not prevent invalid state from being stored or used by other operations.']],test:output('rejected:0',String.raw`final readonly class CreditLimit
{
    public function __construct(public int $cents)
    {
        if ($cents < 0) {
            throw new InvalidArgumentException('negative limit');
        }
    }
}
try {
    new CreditLimit(-1);
} catch (InvalidArgumentException) {
    echo 'rejected:';
}
echo (new CreditLimit(0))->cents;`)}),
q({n:585,type:'A',sub:'business-port-infrastructure-adapter',needs:['Interfaces','Dependency direction','External integration boundaries'],why:'Define the operation the business needs without exposing an infrastructure client as the business contract.',docs:['container#binding-interfaces-to-implementations','testing#mocking'],assume:['Checkout needs a shipping quote and must be testable without the carrier’s SDK. The carrier may later be replaced.'],ask:'Which dependency belongs in the checkout service?',choices:[['A ShippingRates interface that returns an application quote value; a carrier adapter implements it.','The business owns the needed operation and result while an adapter translates the provider-specific API.'],['The carrier SDK response class so checkout can inspect provider-specific fields itself.','That embeds the carrier’s representation in the business flow and replacement tests.'],['A generic container passed to checkout so it resolves the carrier class by string.','A service locator hides the concrete dependency but does not define a stable business contract.'],['A static carrier facade whose real implementation is called inside each unit test.','That still requires the live integration for the isolated business tests described.']],test:output('750',String.raw`interface ShippingRates
{
    public function centsFor(string $zone): int;
}
final class Checkout
{
    public function __construct(private ShippingRates $rates) {}
    public function shipping(string $zone): int
    {
        return $this->rates->centsFor($zone);
    }
}
app()->instance(ShippingRates::class, new class implements ShippingRates {
    public function centsFor(string $zone): int
    {
        return 750;
    }
});
echo app(Checkout::class)->shipping('local');`)}),
q({n:586,type:'D',sub:'observer-cycle-explicit-orchestration',needs:['Model observers','Recursive side effects','Application services'],why:'Make a bidirectional update workflow explicit rather than breaking its recursion by suppressing required behavior.',docs:['eloquent#observers','eloquent#muting-events'],assume:['An Order observer updates Invoice. An Invoice observer updates Order. Each save changes a field and retriggers the other observer. Both updates are required for this operation.'],ask:'Which redesign addresses the cycle while retaining both required updates?',choices:[['Put the operation’s ordered updates in one application service and remove the reciprocal observer triggers.','An explicit owner can perform both updates once, making ordering and failure behavior visible without recursive triggers.'],['Add saveQuietly to every model save in the application.','Global event suppression can discard other required behavior and leaves the operation’s ownership unclear.'],['Queue both observer updates while retaining their reciprocal triggers.','Asynchrony changes timing but still permits an unbounded feedback loop.'],['Catch the recursion failure and return success from the controller.','That leaves required work incomplete and misreports the outcome.']],test:output('ready:issued',String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
Schema::create('orders', function ($t) {
    $t->id();
    $t->string('status');
});
Schema::create('invoices', function ($t) {
    $t->id();
    $t->string('status');
});
DB::table('orders')->insert(['id' => 1, 'status' => 'draft']);
DB::table('invoices')->insert(['id' => 1, 'status' => 'draft']);
DB::transaction(function () {
    DB::table('orders')->where('id', 1)->update(['status' => 'ready']);
    DB::table('invoices')->where('id', 1)->update(['status' => 'issued']);
});
echo DB::table('orders')->value('status').':'.DB::table('invoices')->value('status');`)}),
q({n:587,type:'A',sub:'report-read-projection-separate-write-model',needs:['Aggregations','Read models','Eloquent write semantics'],why:'Choose a representation for a report without weakening transactional model semantics.',docs:['queries#aggregates','queries#grouping'],assume:['A report needs monthly totals per currency, not editable order rows. Existing Order models implement write invariants and are used elsewhere.'],ask:'Which design supplies that report without changing what an Order instance represents?',choices:[['Use a dedicated aggregate query and report result DTO, leaving Order writes on their existing path.','The report’s grouped rows have a different shape and purpose; a separate read representation avoids pretending they are editable orders.'],['Hydrate monthly totals as Order objects and reuse their save method for report rows.','Grouped totals do not represent individual persisted orders and cannot safely use those write semantics.'],['Remove Order’s invariants so both aggregate and ordinary rows can share it.','That weakens unrelated write behavior merely to accommodate a read representation.'],['Add a physical order row for every monthly total and include it in ordinary order queries.','Mixing summary rows with transactional orders changes their meaning and risks counting summaries as source data.']],test:output('[{"currency":"EUR","total":30},{"currency":"USD","total":7}]',String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
Schema::create('sales', function ($t) {
    $t->id();
    $t->string('currency');
    $t->integer('cents');
});
DB::table('sales')->insert([
    ['currency' => 'EUR', 'cents' => 10],
    ['currency' => 'EUR', 'cents' => 20],
    ['currency' => 'USD', 'cents' => 7],
]);
echo DB::table('sales')->select('currency')->selectRaw('SUM(cents) AS total')
    ->groupBy('currency')->orderBy('currency')->get()->toJson();`)}),
q({n:588,type:'A',sub:'delayed-operation-current-authorization',needs:['Policies','Delayed jobs','Revocable permissions'],why:'Choose the authorization time that matches an explicit revocation requirement.',docs:['authorization#authorizing-actions-using-policies','queues#class-structure'],assume:['A user requests an export, then loses access before the job runs. Product policy requires revoked access to prevent any later export. Jobs store the actor and resource IDs.'],ask:'Which job design enforces that policy?',choices:[['Reload the actor and resource, then authorize the operation against their current state before exporting.','The stated revocation rule requires a decision at execution time; a decision made when queued is stale after access changes.'],['Serialize the original successful authorization boolean and trust it when the job runs.','That preserves the old decision even after the permission has been revoked.'],['Authorize only that the queue worker’s service account can read the resource.','The worker’s technical access is not the requesting actor’s product permission.'],['Perform the export first and check the actor’s permission before sending its notification.','The policy forbids the later export itself, so checking after creation is too late.']],test:output('allowed:denied',String.raw`$actor = (object) ['id' => 7];
$resource = (object) ['owner_id' => 7, 'exportable' => true];
Illuminate\Support\Facades\Gate::define('export-current', fn ($user, $item) => $item->owner_id === $user->id && $item->exportable);
echo Illuminate\Support\Facades\Gate::forUser($actor)->allows('export-current', $resource) ? 'allowed:' : 'denied:';
$resource->exportable = false;
echo Illuminate\Support\Facades\Gate::forUser($actor)->allows('export-current', $resource) ? 'allowed' : 'denied';`)}),
q({n:589,type:'D',sub:'conditional-http-304-reuse-representation',needs:['Conditional HTTP requests','ETag','Cached representations'],why:'Interpret a not-modified response in the context of the representation used for validation.',docs:['http-client#response-body','https://www.rfc-editor.org/rfc/rfc9110.html#name-304-not-modified'],assume:['The client has a stored successful JSON representation and its ETag. It sends If-None-Match with that ETag and receives 304 with no body.'],ask:'What should the integration use as the representation for this successful revalidation?',choices:[['The stored representation associated with that validator.','A 304 tells the client its conditional request can reuse the existing representation rather than supplying a new body.'],['The result of decoding the empty 304 body as fresh JSON.','There is no new JSON representation in that response body.'],['An empty object written over the cached representation.','That discards the validated representation even though the server indicated it remains usable.'],['A new fabricated default representation because all non-200 statuses invalidate the cache.','304 has specific conditional-cache semantics; treating it as a generic failure loses the valid cached value.']],test:output('Ada:304:empty',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['catalog.test/*' => Http::response('', 304, ['ETag' => '"v1"'])]);
$cached = ['name' => 'Ada'];
$response = Http::withHeaders(['If-None-Match' => '"v1"'])->get('https://catalog.test/person');
$value = $response->status() === 304 ? $cached : $response->json();
echo $value['name'].':'.$response->status().':'.($response->body() === '' ? 'empty' : 'body');`)}),
q({n:590,type:'R',sub:'retry-classifier-transient-safe-failure',needs:['HTTP retries','Domain rejection','Idempotent operations'],why:'Keep bounded retries for failures that another attempt can plausibly resolve.',docs:['http-client#retries'],assume:['A read-only remote eligibility check returns 503 for a temporary outage and 422 for a stable business rejection. No client input changes between attempts.'],ask:'Which retry classifier fits these contracts?',choices:[['Retry the temporary 503 within a small budget; return the 422 rejection without repeating identical input.','The read is safe to repeat and the transient outage may recover, while unchanged input will not resolve the specified stable rejection.'],['Retry every non-2xx response with the same budget.','That spends attempts on a domain rejection the contract says will not change for this input.'],['Retry 422 but stop immediately on 503.','That reverses the stated distinction between stable rejection and transient outage.'],['Retry only when the JSON body is empty, regardless of status.','Body emptiness does not encode this service’s transient-versus-domain failure contract.']],test:output('503=2;422=1',http+String.raw`use Illuminate\Support\Facades\Http;
$attempts = 0;
$status = 503;
Http::fake(function () use (&$attempts, &$status) {
    $attempts++;
    return Http::response([], $status);
});
foreach ([503, 422] as $status) {
    $attempts = 0;
    Http::retry(2, 0, fn ($e) => $e instanceof Illuminate\Http\Client\RequestException && $e->response->status() === 503, throw: false)
        ->get('https://eligibility.test/check');
    echo $status.'='.$attempts.($status === 503 ? ';' : '');
}`)}),
];
