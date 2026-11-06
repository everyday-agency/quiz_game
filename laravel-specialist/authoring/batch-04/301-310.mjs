import {q,file,output} from '../record.mjs';
import {queue,marker} from './fixture.mjs';
import {model,relations} from '../batch-03/fixture.mjs';
export default [
q({n:301,type:'E',level:'F',sub:'async-dispatch-before-worker',needs:['Laravel jobs','Asynchronous queue connections'],why:'Separate enqueueing work from a worker actually running its handler.',docs:['queues#dispatching-jobs'],assume:['The default connection is the database queue. The jobs table starts empty. No worker runs during this code.'],ask:'MarkWork implements ShouldQueue; its handle method writes a marker to the cache. What follows Bus::dispatch(new MarkWork())?',choices:[['One job is queued; the handler’s marker is not written yet.','The asynchronous connection stores the payload for later processing rather than invoking handle in the dispatching request.'],['The marker is written immediately and no job is stored.','That would describe synchronous handling, not dispatch through this database queue.'],['The marker is written immediately and the same job is also stored for a second execution.','Normal asynchronous dispatch does not first run the handler and then queue it again.'],['Dispatch blocks until a worker reports the handler’s result.','Queue dispatch does not synchronously wait for a separate worker’s completion.']],test:output('1:waiting',queue+marker+String.raw`Illuminate\Support\Facades\Bus::dispatch(new MarkWork());
echo Illuminate\Support\Facades\DB::table('jobs')->count().':'.(app('cache')->get('handled') ? 'handled' : 'waiting');`)}),
q({n:302,revision:2,type:'R',sub:'after-response-current-process-lifetime',needs:['dispatchAfterResponse','HTTP response flushing','Durable queues'],why:'Separate client response timing from process lifetime and durable background delivery.',docs:['queues#dispatching-after-the-response-is-sent-to-browser'],assume:['A FastCGI-capable HTTP server flushes the response before application termination callbacks; no custom dispatch hooks.'],ask:'A report takes several minutes and must survive the web process dying. A developer chooses dispatchAfterResponse and claims this gives the same durability as a broker-backed queue worker. Which review finding is correct?',choices:[['After-response work still uses the web process; durable long-running work needs a real queue.','The method defers handling until the response stage but does not hand the job to a durable background worker. Process death can still lose unfinished work.'],['After-response dispatch automatically stores every job on the default broker before returning the response.','The standard path schedules synchronous handling at application termination rather than durably publishing to the default asynchronous connection.'],['After-response work runs in a newly spawned supervised worker even when no worker service exists.','The method does not create and supervise a separate background service.'],['After-response dispatch guarantees retries because the browser keeps its connection open until completion.','The response can already be flushed, and browser connection lifetime is not a durable job acknowledgment or retry mechanism.']],test:output('waiting:handled:0',queue+marker+String.raw`MarkWork::dispatchAfterResponse();
echo (app('cache')->get('handled') ? 'handled' : 'waiting').':';
app()->terminate();
echo (app('cache')->get('handled') ? 'handled' : 'waiting').':'.Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:303,revision:3,type:'D',level:'F',sub:'queue-name-versus-connection',needs:['Queue connections','Named queues'],why:'Configure transport and logical queue independently.',docs:['queues#customizing-the-queue-and-connection'],ask:'The default connection is sync. A separate connection is named database; workers consume its imports queue. A job currently calls onConnection("imports") and fails because no such connection exists. Which routing pair matches the configuration?',choices:[['onConnection("database")->onQueue("imports")','The connection selects the configured driver, while onQueue selects the logical queue within it.'],['onConnection("imports")->onQueue("database")','This reverses the configured connection and queue names.'],['onConnection("database.imports")','A dotted string is not automatically split into a connection and queue.'],['onQueue("database")->onQueue("imports")','Repeated queue selection does not explicitly select the intended connection.']],test:output('imports',queue+marker+String.raw`config(['queue.default' => 'sync']);
Illuminate\Support\Facades\Bus::dispatch((new MarkWork())->onConnection('database')->onQueue('imports'));
echo Illuminate\Support\Facades\DB::table('jobs')->value('queue');`)}),
q({n:304,type:'R',sub:'job-handle-service-injection',needs:['Job serialization','Container method injection','Service lifecycle'],why:'Keep durable job inputs in the payload while resolving process-local services at handling time.',docs:['queues#handle-method-dependency-injection'],ask:'An export job needs an order ID and a ReportRenderer service. ReportRenderer owns a nonserializable resource. Which job boundary is appropriate for asynchronous processing?',choices:[['Store the order ID in the constructor; type-hint ReportRenderer in handle.','The job serializes durable input and the worker’s container resolves the service when handle executes.'],['Store both the order ID and the live ReportRenderer instance in public constructor properties.','The queue payload would attempt to serialize the process-local resource-owning service.'],['Construct ReportRenderer in the request and store only its object id in the job.','A PHP object id does not identify an instance in a different worker process.'],['Place ReportRenderer in a static property and assume the worker inherits that instance.','Separate and long-lived worker processes do not inherit request-local PHP object state.']],test:output('worker:7',queue+String.raw`class ReportRenderer
{
    public function render(int $id): void
    {
        echo 'worker:'.$id;
    }
}
class ExportOrder implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function __construct(public int $orderId)
    {
    }

    public function handle(ReportRenderer $renderer): void
    {
        $renderer->render($this->orderId);
    }
}
Illuminate\Support\Facades\Bus::dispatch(new ExportOrder(7));
app('queue')->connection()->pop()->fire();`)}),
q({n:305,type:'E',sub:'serialized-model-current-state',needs:['Queued model serialization','Eloquent restoration'],why:'Distinguish identifier-based restoration from a snapshot of every model attribute.',docs:['queues#eloquent-models-in-queued-jobs'],ask:'Record 1 has name="old" when this job is serialized. The database name then becomes "new" before the worker restores the payload. What does handle print?',code:[file(String.raw`use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class PrintRecord implements ShouldQueue
{
    use Queueable;

    public function __construct(public Record $record)
    {
    }

    public function handle(): void
    {
        echo $this->record->name;
    }
}`)],assume:['The row still exists; no transaction or replica lag obscures the update.'],choices:[['new','SerializesModels records model identity and restores the model from the database when the job is deserialized.'],['old','The model property is not a full immutable snapshot of its original attributes under this serialization trait.'],['The primary key 1','Restoration yields the model instance; the handler then reads its name.'],['A serialization error because all Eloquent models are forbidden in jobs','Laravel explicitly supports model identifier serialization through the trait.']],test:output('new',queue+model+String.raw`require getcwd().'/probe.php';
Illuminate\Support\Facades\Bus::dispatch(new PrintRecord($record));
Record::whereKey(1)->update(['name' => 'new']);
app('queue')->connection()->pop()->fire();`)}),
q({n:306,type:'I',sub:'without-relations-job-payload',needs:['Eloquent relation state','Queued model serialization'],why:'Avoid restoring a loaded relation that the job does not need.',docs:['queues#queued-relationships'],ask:'A writer model has its large articles relationship loaded, but the queued job only needs the writer’s own attributes. Which constructor input removes loaded relations for serialization while retaining the model’s identity?',choices:[['$writer->withoutRelations()','The returned model has no loaded relations to record for later restoration, while its own identity remains intact.'],['$writer->makeHidden("articles")','Serialization visibility for arrays/JSON does not clear the Eloquent relation state used by queued-model serialization.'],['$writer->setVisible(["id", "name"])','Visibility filters do not remove loaded relationship names from the queue model identifier.'],['$writer->replicate()','A replicated model is unsaved and normally lacks the original primary key needed for restoration.']],test:output('1:unloaded',relations+String.raw`class WriterPayload
{
    use Illuminate\Queue\SerializesModels;

    public function __construct(public Writer $writer)
    {
    }
}
$writer->load('articles');
$restored = unserialize(serialize(new WriterPayload($writer->withoutRelations())));
echo $restored->writer->id.':'.($restored->writer->relationLoaded('articles') ? 'loaded' : 'unloaded');`)}),
q({n:307,type:'E',sub:'queued-relation-constraint-loss',needs:['Queued model restoration','Constrained eager loading'],why:'Recognize which relationship metadata survives serialization and which query constraints must be reapplied.',docs:['queues#queued-relationships'],ask:'Writer 1 has one published article and one draft. Before dispatch, articles is loaded with a published=true constraint. The job stores that writer using SerializesModels. No data changes. How many articles does the normally restored relationship contain?',choices:[['2; restoration reloads the relationship without the earlier ad hoc constraint.','The serialized relation name does not preserve that temporary query callback, so the default relationship retrieves both children.'],['1; the loaded collection and its exact query constraint are serialized intact.','The model identifier records the relationship name rather than preserving the constrained collection query.'],['0; every queued model automatically loses all loaded relationships.','Loaded relation names are normally restored unless explicitly excluded.'],['The worker cannot deserialize any model with a constrained relation.','Restoration is supported; the issue is the lost constraint, not a deserialization prohibition.']],test:output('1:2',relations+String.raw`class WriterPayload
{
    use Illuminate\Queue\SerializesModels;

    public function __construct(public Writer $writer)
    {
    }
}
$writer->load(['articles' => fn ($q) => $q->where('published', true)]);
echo $writer->articles->count().':';
$restored = unserialize(serialize(new WriterPayload($writer)));
echo $restored->writer->articles->count();`)}),
q({n:308,revision:2,type:'D',sub:'delete-job-missing-model-policy',needs:['Queued Eloquent models','Missing model handling'],why:'Express an intentional no-longer-relevant job policy at restoration time.',docs:['queues#ignoring-missing-models'],ask:'A thumbnail job uses SerializesModels for its Photo. A try/catch inside handle cannot catch a missing Photo deleted before execution. Obsolete jobs should be discarded without failure. Which explanation and remedy fit?',choices:[['Restoration fails before handle; set deleteWhenMissingModels=true on the job.','The queued handler deletes the job when model restoration fails under this explicit policy.'],['The handler catches the wrong type; catch QueryException instead and keep the same structure.','Model restoration fails before the handler runs; changing its internal catch type cannot intercept that phase.'],['The exception arrives after timeout; disable the timeout to let the catch execute.','This failure comes from model restoration, not a timeout that prevents entry into the handler.'],['The model is stale only before commit; afterCommit makes the photo exist for every later attempt.','After-commit dispatch does not prevent a model from being permanently deleted during a later queue delay.']],test:output('deleted:0',queue+model+String.raw`class PrintMissing implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public $deleteWhenMissingModels = true;

    public function __construct(public Record $record)
    {
    }

    public function handle(): void
    {
        echo 'unexpected';
    }
}
Illuminate\Support\Facades\Bus::dispatch(new PrintMissing($record));
$record->delete();
$job = app('queue')->connection()->pop();
$job->fire();
echo ($job->isDeleted() ? 'deleted' : 'retained').':'.Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:309,type:'E',sub:'after-commit-job-enqueue',needs:['Queue afterCommit','Transaction commit and rollback'],why:'Locate enqueueing relative to commit and distinguish discarded rolled-back dispatches.',docs:['queues#jobs-and-database-transactions'],assume:['Database queue, empty jobs table, no running worker, and the normal Laravel transaction manager.'],ask:'What is printed? MarkWork is a normal queueable job.',code:[file(String.raw`use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    Bus::dispatch((new MarkWork())->afterCommit());

    echo DB::table('jobs')->count().':';
});

echo DB::table('jobs')->count().':';

try {
    DB::transaction(function () {
        Bus::dispatch((new MarkWork())->afterCommit());

        throw new RuntimeException('cancel');
    });
} catch (RuntimeException $e) {
    echo DB::table('jobs')->count();
}`)],choices:[['0:1:1','The first payload is queued after commit. The second after-commit callback is discarded by rollback.'],['1:1:2','This assumes both jobs are enqueued immediately and ignores rollback of the deferred callback.'],['0:0:0','The first successful commit does trigger the deferred enqueue.'],['0:1:2','The rolled-back transaction does not dispatch its after-commit job.']],test:output('0:1:1',queue+marker+String.raw`require getcwd().'/probe.php';`)}),
q({n:310,type:'I',sub:'before-commit-explicit-override',needs:['Queue connection after_commit','Per-job dispatch policy'],why:'Override a connection default deliberately for work independent of transaction-local data.',docs:['queues#specifying-commit-dispatch-behavior-inline'],ask:'The queue connection has after_commit=true. This particular cache-warming job intentionally needs immediate enqueueing and uses no uncommitted rows. Which per-job setting overrides that default inside a transaction?',choices:[['(new WarmCache())->beforeCommit()','beforeCommit explicitly sets this job’s dispatch-after-commit flag to false.'],['(new WarmCache())->delay(0)','A zero delay changes availability after dispatch, not the transaction dispatch policy.'],['(new WarmCache())->onQueue("immediate")','A queue label does not override after_commit behavior.'],['(new WarmCache())->afterCommit()','This keeps the deferred behavior rather than overriding it.']],test:output('1',queue+marker+String.raw`config(['queue.connections.database.after_commit' => true]);
Illuminate\Support\Facades\DB::transaction(function () {
    Illuminate\Support\Facades\Bus::dispatch((new MarkWork())->beforeCommit());
    echo Illuminate\Support\Facades\DB::table('jobs')->count();
});`)}),
];
