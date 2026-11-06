import assert from 'node:assert/strict';
import {file,output} from './record.mjs';
import {probes} from './focused-probes.mjs';

// Exactly seven independently requested corrections; untouched records pass through.
export const TARGET_IDS=[242,284,314,400,535,566,569].map(n=>'LAR-S26-'+String(n).padStart(4,'0'));
const changes={
242:{
 prerequisites:['Eloquent hasMany relationships','Constrained eager loading','SQL ordering and limits'],
 assume:[
  'Run in a bootstrapped Laravel 13.40.0 application using SQLite 3.25 or later with window-function support.',
  'writers contains only id=1 and id=2. articles contains only (id=1, writer_id=1), (id=2, writer_id=1), (id=3, writer_id=2). Both id columns are integer primary keys.',
  'The displayed models are complete for this query: no global scopes, soft deletion, accessors or other relationship constraints. Both tables use the same connection.'
 ],
 stem:'What exact JSON does query.php print?',
 files:[
 file(String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Writer extends Model
{
    protected $table = 'writers';

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'writer_id', 'id');
    }
}

class Article extends Model
{
    protected $table = 'articles';
}`,'models.php'),
 file(String.raw`require __DIR__.'/models.php';

$writers = Writer::with([
    'articles' => fn ($query) => $query->orderByDesc('id')->limit(1),
])->orderBy('id')->get();

echo json_encode(
    $writers->map(fn ($writer) => $writer->articles->count())->all(),
);`,'query.php')],
 options:{
  'choice-1':['A SQL error when eager loading combines with limit(1).','Laravel 13.40 implements the grouped relationship limit on this supported SQLite version. The explicit hasMany keys and fixture do not cause a SQL error.'],
  'choice-2':['[0,1]','That would be the result of one global child limit ordered by descending article ID: only article 3 would remain. Eager loading instead limits within each writer_id group.'],
  'choice-3':['[2,1]','That counts all matching articles and ignores limit(1). The relationship query selects only article 2 for writer 1 and article 3 for writer 2.'],
  'choice-4':['[1,1]','The hasMany relation matches articles.writer_id to writers.id. Laravel applies the eager-load limit within each parent group, selecting articles 2 and 3. Parent order is [1,2], and each loaded collection has one article.']
 },
 level:'Intermediate',difficulty:'Trace relationship keys, parent order and a grouped eager-loading limit against explicit rows.',
 validation:output('[1,1]',probes.eager)
},
284:{
 prerequisites:['Laravel database transactions','Closure capture','Payment API request identifiers'],
 assume:[
  'The existing orders row has checkout_id=7 and paid=false. $checkoutId is 7 and $payments is the adapter described below. The database and payment provider are separate systems.',
  'For this question, charge(checkoutId, key) uses an application adapter: repeated calls for the same checkout and key produce one charge; a different key creates a new charge. Payment arguments do not change between attempts.',
  'The first provider call succeeds, then a recognized database concurrency error aborts that transaction. Laravel retries the outer transaction callback and the next database attempt succeeds. The PHP process does not restart.'
 ],
 stem:'Which change prevents a second provider charge during this automatic retry while retaining the database retry?',
 files:[file(String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

DB::transaction(function () use ($payments, $checkoutId) {
    $key = (string) Str::uuid();
    $payments->charge($checkoutId, $key);

    DB::table('orders')
        ->where('checkout_id', $checkoutId)
        ->update(['paid' => true]);
}, attempts: 3);`,'checkout.php')],
 options:{
  'choice-1':['Generate the key before DB::transaction and capture that value in the callback.','Laravel invokes the entire callback again. Capturing one preallocated key reuses the provider operation identity across both attempts, so the stated provider contract creates only one charge. This addresses the stated in-process retry, not durable recovery after a process crash.'],
  'choice-2':['Generate and save the key on the order inside the transaction before charging.','The first transaction rolls back its newly saved key but cannot undo the external charge. A retry that generates and saves a fresh key therefore creates a second provider operation.'],
  'choice-3':['Capture a UUID factory before DB::transaction and call it at the start of each attempt.','Capturing the factory is not the same as capturing its result. Calling it again produces a different key, so both callback executions create charges.'],
  'choice-4':['Keep the key for an attempt, but replace it whenever Laravel rolls that attempt back.','A database rollback is not evidence that the payment failed. Replacing the key after the successful first charge gives the retry a new provider operation identity.']
 },
 level:'Intermediate',difficulty:'Trace repeated callback execution and distinguish an operation-scoped value from a value recreated on each attempt.',
 validation:output('original=2/2;captured=2/1;saved=2/2;factory=2/2;rotated=2/2',probes.payments)
},
314:{
 prerequisites:['Laravel queued jobs','Database transactions','Eloquent observers','Process failure and message delivery'],
 assume:[
  'Order writes use one transactional SQL connection. PublishOrder implements ShouldQueue and its handle method publishes OrderAccepted to a separate broker. The redis queue is external to that SQL connection.',
  'After a finite failure, workers and the broker eventually recover. Committed orders must eventually be announced; rolled-back orders must not be announced. The publication worker may also die after the broker accepts an event but before recording completion.'
 ],
 stem:'The request process dies after SQL commit but before the Redis job is stored. Which Laravel implementation change makes this publication work recoverable across that gap and a later worker restart?',
 files:[file(String.raw`DB::transaction(function () use ($payload) {
    $order = Order::create($payload);

    PublishOrder::dispatch($order->id)
        ->onConnection('redis')
        ->afterCommit();
});`,'order-action.php','fragment','Inside the application action; DB is Illuminate\\Support\\Facades\\DB, Order is the model and PublishOrder is the queued job described above.')],
 options:{
  'choice-1':['Set the Redis connection’s after_commit option; use a retrying job with a stable event ID.','The connection setting postpones enqueueing until commit just as the shown per-job flag does. Job retries and a stable ID cannot recover a job that was never durably stored.'],
  'choice-2':['Insert a pending event from an observer implementing ShouldHandleEventsAfterCommit; run a scheduled publisher.','The observer also runs after the SQL commit. A process failure before that observer inserts its row still leaves a committed order without durable publication work.'],
  'choice-3':['Insert a pending event inside the order transaction; let the publisher mark it complete before sending.','The SQL transaction records the intent safely, but marking completion before sending creates a new loss window. A crash in that interval makes recovery skip an event the broker never received.'],
  'choice-4':['Insert the event on the order’s connection inside the transaction; retry its ID until acknowledged and deduplicate it downstream.','The order and pending event commit together. A scheduled publisher can rediscover pending rows without the original Redis job, and marks completion only after acknowledgment. A crash after broker acceptance may cause redelivery, so the stable event ID must protect downstream effects; afterCommit alone provides ordering, not durable handoff.']
 },
 level:'Advanced',difficulty:'Distinguish Laravel after-commit ordering from durable intent, then analyze the independent publish/completion crash window.',
 validation:{
  kind:'documented-contract',sourceRoot:'reference',source:'focused-outbox.txt',
  contains:['afterCommit','ShouldHandleEventsAfterCommit','same connection','acknowledgment'],
  reason:'Pinned Laravel transaction/queue/observer source plus the documented relay failure model. A supplementary local Laravel fixture verifies commit callback timing and atomic pending-row persistence; no Redis/broker crash or exactly-once delivery is claimed.'
 },
 references:['https://laravel.com/docs/13.x/queues#jobs-and-database-transactions','https://laravel.com/docs/13.x/eloquent#observers-and-database-transactions','https://microservices.io/patterns/data/transactional-outbox.html']
},
400:{
 prerequisites:['Laravel scheduling locks','SQL uniqueness','Process failure and database commits'],
 assume:[
  'A run reads a fixed 10,000-item snapshot, with stable source IDs and a stable run ID. Its only effects are per-item rows in one database; there are no remote side effects.',
  'Without an added constraint, results use generated primary keys and permit duplicate (run_id, source_id) pairs. A failed run is explicitly retried against the same snapshot after the prior process exits.'
 ],
 stem:'A nightly import scheduled with onOneServer crashes after committing 4,000 results. Which recovery design can finish the remaining work without missing or duplicating results?',
 files:[],
 options:{
  'choice-1':['Add a unique (run_id, source_id) result key and replay the snapshot using conflict-safe writes.','The committed result keys are durable progress. Replaying the same snapshot skips completed pairs and writes missing ones. onOneServer coordinates scheduling; it does not replace this item-level recovery state.'],
  'choice-2':['Commit the last source ID before each result insert; resume after that checkpoint.','A crash after advancing the checkpoint but before inserting the result permanently skips that item on the next attempt.'],
  'choice-3':['Commit each result, then separately checkpoint its source ID; resume with ordinary inserts.','A crash after the result commit but before its checkpoint makes the retry insert that item again. Without uniqueness or conflict handling, separate checkpointing permits duplicates.'],
  'choice-4':['Add withoutOverlapping to onOneServer; replay all ordinary inserts when the lock permits a retry.','Preventing simultaneous runs does not remove results committed by an earlier failed run. Replaying ordinary inserts can duplicate those results even when attempts never overlap.']
 },
 level:'Intermediate',difficulty:'Analyze one per-item commit/checkpoint boundary and distinguish scheduler exclusion from durable recovery.',
 validation:output('safe=5/5;checkpoint-first=4;checkpoint-last=6',probes.recovery)
},
535:{
 prerequisites:['Laravel HTTP client options','URL authorities','DNS address resolution','HTTP redirects'],
 assume:[
  'An export fetcher accepts a user-selected URL. Only exports.partner.test and files.partner.test are approved destinations, over HTTPS port 443. Valid downloads may redirect between those two hosts.',
  'Both IPv4 and IPv6 are enabled. DNS answers can change between a preflight lookup and connection. The service must not connect to private, loopback, link-local or metadata-service addresses.',
  'TLS certificate verification remains enabled in every option. Connection-time destination enforcement is available through a controlled transport or egress gateway; no option is claimed to be implemented by the url validation rule alone.'
 ],
 stem:'The current endpoint validates the URL and calls Http::get. Which replacement policy covers both redirected requests and the address actually contacted?',
 files:[],
 options:{
  'choice-1':['Check the initial host and HTTPS/443; follow redirects with Guzzle’s protocols option restricted to https.','Restricting redirect schemes does not restrict redirect hostnames or addresses. A redirect can leave the approved host set or reach a forbidden network destination.'],
  'choice-2':['Check each hop’s host and all DNS addresses in preflight; let the HTTP client resolve the hostname again.','The checked DNS answer can differ from the answer used when connecting. A separate preflight lookup does not bind the connection to the validated addresses.'],
  'choice-3':['Check each hop’s host and HTTPS/443; enforce a forbidden-address denylist on IPv4 connections.','IPv6 remains a permitted connection path in this scenario. Filtering only IPv4 leaves private or link-local IPv6 destinations outside the enforcement boundary.'],
  'choice-4':['Check each hop’s exact host and HTTPS/443; enforce the address policy on the actual IPv4 or IPv6 connection.','Each redirect must remain within the approved URL policy, and the transport must enforce the destination-address policy when connecting. This avoids both redirect escape and the gap between a DNS check and a later independent resolution.']
 },
 level:'Advanced',difficulty:'Compare three partially effective designs across redirect handling, DNS timing and both address families.',
 validation:{
  kind:'documented-contract',sourceRoot:'reference',source:'focused-ssrf.txt',contains:['redirect','connection','IPv6'],
  reason:'OWASP SSRF guidance and Guzzle redirect-option contract. This is a design comparison; no DNS rebinding test, remote request, SSRF probe or production filter is executed.'
 },
 references:['https://laravel.com/docs/13.x/http-client#guzzle-options','https://docs.guzzlephp.org/en/stable/request-options.html#allow-redirects','https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html']
},
566:{
 prerequisites:['Nginx location selection','FastCGI dispatch','Laravel request lifecycle'],
 assume:[
  'Nginx serves /srv/app/public. An ordinary prefix location / uses try_files to fall back to /index.php. A regex location matching PHP paths forwards them to PHP-FPM with SCRIPT_FILENAME pointing at the requested existing file.',
  'public/diagnostic.php was accidentally included in a release. GET /diagnostic.php executes it, although Laravel has no such route and its fallback rejects unknown routes. index.php is the application’s only intended PHP entry point.'
 ],
 stem:'Which change fixes the deployment boundary while keeping ordinary Laravel routes such as /orders working?',
 files:[],
 options:{
  'choice-1':['Add try_files $uri =404 to the generic PHP location before its FastCGI forwarding.','diagnostic.php exists, so the existence check passes and PHP-FPM still executes it. Checking file existence does not select the application entry point.'],
  'choice-2':['Add global Laravel middleware rejecting diagnostic.php and rebuild the route cache.','The separate script is sent directly to PHP-FPM, so Laravel’s index.php, middleware and router do not run for it.'],
  'choice-3':['Forward only index.php to PHP-FPM; return 404 for other PHP paths and retain the / fallback.','The PHP handler is selected before Laravel runs. A narrow front-controller handler and rejection of other PHP paths prevent the accidental script from executing, while the existing fallback still sends /orders through index.php.'],
  'choice-4':['Move the existing location / block above the generic PHP regex block without changing either.','Ordinary prefix locations do not outrank a matching regex simply because they occur earlier in the configuration. Reordering these blocks does not route diagnostic.php through Laravel.']
 },
 level:'Intermediate',difficulty:'Trace web-server selection before Laravel boot and distinguish file-existence, routing and execution controls.',
 validation:{
  kind:'documented-contract',sourceRoot:'reference',source:'focused-nginx.txt',contains:['regex','prefix','FastCGI','index.php'],
  reason:'Nginx location selection and the official Laravel deployment configuration establish the boundary. No Nginx or PHP-FPM server is installed, reconfigured or executed for this question.'
 },
 references:['https://nginx.org/en/docs/http/ngx_http_core_module.html#location','https://laravel.com/docs/13.x/deployment#nginx']
},
569:{
 prerequisites:['Rolling Laravel releases','SQL update isolation','Nullable columns','Long-lived application workers'],
 assume:[
  'This is a semantic rename: full_name and display_name must represent the same current text. V1 reads and writes only full_name. The desired final release reads and writes only display_name.',
  'HTTP requests and queued writers continue during deployment. Old processes and in-flight transactions can be drained before a phase completes. A single SQL UPDATE is atomic and serializes with other writes to the same row.',
  'A nullable display_name initially means not yet copied. No trigger or background mechanism automatically synchronizes the columns. Retaining the previous release for rollback is required until the agreed rollback window ends.'
 ],
 stem:'Which rollout preserves current names while old and new writers overlap, including writes made during backfilling?',
 files:[],
 options:{
  'choice-1':['Add display_name. A bridge reads full_name and writes both atomically. Drain V1, reconcile from current full_name in SQL, switch readers, then drop full_name after old-code and rollback dependencies end.','While V1 exists, full_name remains authoritative, so V1 updates are visible even if an earlier copy is stale. After V1 and its transactions drain, bridge writers keep both values equal; a database-side reconciliation uses current row values. Readers can then switch, and the old column is removed only after every dependent process and rollback requirement is gone.'],
  'choice-2':['Add and backfill display_name. A bridge reads COALESCE(display_name, full_name) and writes both while V1 remains. Switch all writers, then drop full_name after the rollback window.','After a row is copied, V1 can change only full_name. Its nonnull display_name is then stale, so COALESCE returns an old name during the overlap even though the fallback handles uncopied rows.'],
  'choice-3':['Add display_name. A bridge reads full_name and writes both. Drain V1, copy values from a previously captured PHP snapshot, then switch readers and remove full_name after the rollback window.','A bridge writer can update both columns after the PHP snapshot was taken. Applying the stale snapshot to display_name overwrites the newer copied value, so the subsequent reader switch exposes stale data.'],
  'choice-4':['Add display_name. Let V1 use full_name and V2 use display_name independently. Fill only null display_name values, drain V1, then drop full_name after the rollback window.','The two writer populations have separate authoritative columns. Filling nulls does not reconcile later V1 edits to already populated display_name rows, and independent V2 writes can disagree with what V1 reads.']
 },
 level:'Advanced',difficulty:'Coordinate mixed readers and writers, stale backfill interleavings, process draining and a later reversible cutover.',
 validation:output('safe=Latest/Latest;coalesce=Old;snapshot=Old;split=V2/V1',probes.migration)
}
};
export default function focused(records){
 return records.map(original=>{
  const n=Number(original.id.slice(-4)),c=changes[n];
  if(!c)return original;
  const q=structuredClone(original);
  q.revision++;
  q.stem=c.stem;q.context={assumptions:c.assume,files:c.files};
  q.prerequisites=c.prerequisites;
  q.difficulty={level:c.level,audience:c.level==='Advanced'?'advanced':'intermediate',rationale:c.difficulty};
  for(const option of q.options){
   const values=c.options[option.id];assert(values,original.id+' '+option.id);
   option.text=values[0];option.rationale=values[1];option.misconception=option.id===q.correctOptionId?null:values[1];
  }
  q.explanation={summary:q.options.find(o=>o.id===q.correctOptionId).rationale,trace:q.options.map(o=>o.rationale)};
  q.validation={...c.validation,status:'unvalidated',independentEditorialReview:'pending'};
  if(c.references)q.references=c.references;
  assert.deepEqual(q.objective,original.objective);
  assert.equal(q.correctOptionId,original.correctOptionId);
  return q;
 });
}
