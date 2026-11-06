import {q,file,output} from '../record.mjs';
import {queue} from './fixture.mjs';
export default [
q({n:341,type:'E',level:'F',sub:'event-dispatch-response-array',needs:['Laravel event dispatch','Listener responses'],why:'Read the dispatcher result rather than assuming an event method returns its event object.',docs:['events#dispatching-events'],ask:'Only the shown listener is registered. What is printed?',code:[file(String.raw`use Illuminate\Support\Facades\Event;

class ReportRequested
{
}

Event::listen(ReportRequested::class, fn (ReportRequested $event) => 'queued');

$result = Event::dispatch(new ReportRequested());

echo json_encode($result);`)],choices:[['["queued"]','Ordinary dispatch collects listener return values into an array.'],['"queued"','A single listener does not make ordinary dispatch unwrap its response array.'],['{}','The result is not the original empty event object.'],['null','The registered listener response is collected by ordinary dispatch.']],test:output('["queued"]')}),
q({n:342,revision:2,type:'E',level:'F',sub:'event-false-stops-propagation',needs:['Event listeners','Propagation control'],why:'Track a false return separately from an exception or an ordinary null return.',docs:['events#stopping-the-propagation-of-an-event'],ask:'Listeners are registered only in this order. What is printed?',code:[file(String.raw`use Illuminate\Support\Facades\Event;

Event::listen('report.ready', function () {
    echo 'A';

    return false;
});

Event::listen('report.ready', function () {
    echo 'B';
});

Event::dispatch('report.ready');`)],choices:[['A','A false listener response stops propagation before the second listener is called.'],['AB','Ordinary propagation does not continue past this false response.'],['B','The first listener runs before its return value can affect propagation.'],['An exception before either letter','Returning false is supported propagation control, not itself an exception.']],test:output('A')}),
q({n:343,type:'E',sub:'event-until-first-non-null',needs:['Event until','Null versus falsy responses'],why:'Recognize zero as a response that halts the until path.',docs:['events#dispatching-events'],ask:'What is printed? No additional listeners are registered.',code:[file(String.raw`use Illuminate\Support\Facades\Event;

Event::listen('lookup', fn () => null);
Event::listen('lookup', fn () => 0);
Event::listen('lookup', fn () => 99);

echo json_encode(Event::until('lookup'));`)],choices:[['0','until returns the first non-null response; integer zero qualifies despite being falsy.'],['99','The dispatcher does not require a truthy response for this halting rule.'],['[null,0,99]','until does not collect all listener responses like ordinary non-halting dispatch.'],['null','The initial null response allows later listeners to be evaluated.']],test:output('0')}),
q({n:344,type:'E',sub:'event-after-commit-all-listeners',needs:['ShouldDispatchAfterCommit','Synchronous event listeners','Transactions'],why:'Defer the event itself, including synchronous listeners, until a successful outer commit.',docs:['events#dispatching-events-after-database-transactions'],ask:'OrderPlaced implements ShouldDispatchAfterCommit. It has one ordinary synchronous listener. An event is dispatched inside a transaction that subsequently rolls back. What happens to that listener?',choices:[['It is not invoked for the rolled-back transaction.','The event dispatch is deferred and its transaction callback is discarded when the transaction rolls back.'],['It runs immediately because only queued listeners can be deferred.','The interface delays dispatch of the event itself, including ordinary synchronous listeners.'],['It runs after rollback with a flag instructing it to undo its effects.','No compensating listener call is automatically generated for the discarded event.'],['It is converted into a queued listener and retried after the rollback.','The event’s commit policy does not change the listener into a background job.']],test:output('0:1',String.raw`class OrderPlaced implements Illuminate\Contracts\Events\ShouldDispatchAfterCommit
{
}
$count = 0;
Illuminate\Support\Facades\Event::listen(OrderPlaced::class, function () use (&$count) {
    $count++;
});
try {
    Illuminate\Support\Facades\DB::transaction(function () {
        event(new OrderPlaced());
        throw new RuntimeException('rollback');
    });
} catch (RuntimeException $e) {
}
echo $count.':';
Illuminate\Support\Facades\DB::transaction(fn () => event(new OrderPlaced()));
echo $count;`)}),
q({n:345,type:'E',sub:'queue-individual-listener',needs:['Events','ShouldQueue listeners','Synchronous versus queued execution'],why:'Assign execution mode to each listener rather than treating all listeners of an event alike.',docs:['events#queued-event-listeners'],ask:'InvoiceReady has two listeners. UpdateView is ordinary synchronous code; SendReceipt implements ShouldQueue. With an asynchronous database queue and no worker running, what follows dispatching the event once?',choices:[['UpdateView runs now; SendReceipt is represented by a queued listener job.','Listener queueability is evaluated individually, so one event can mix synchronous and queued listeners.'],['Both listeners are queued because one implements ShouldQueue.','One listener’s interface does not change the other listener’s execution mode.'],['Both listeners run immediately because the event class is not a queued job.','The dispatcher separately recognizes queueable listeners.'],['Only SendReceipt runs now, while UpdateView waits for its result.','This reverses the declared execution modes and invents a dependency between the listeners.']],test:output('view:1',queue+String.raw`class InvoiceReady
{
}
class UpdateView
{
    public function handle(InvoiceReady $event): void
    {
        app('cache')->put('trace', 'view');
    }
}
class SendReceipt implements Illuminate\Contracts\Queue\ShouldQueue
{
    public function handle(InvoiceReady $event): void
    {
        app('cache')->put('trace', 'receipt');
    }
}
Illuminate\Support\Facades\Event::listen(InvoiceReady::class, UpdateView::class);
Illuminate\Support\Facades\Event::listen(InvoiceReady::class, SendReceipt::class);
event(new InvoiceReady());
echo app('cache')->get('trace').':'.Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:346,revision:2,type:'I',level:'F',sub:'listener-should-queue-condition',needs:['Queued event listeners','Conditional queueing'],why:'Suppress unnecessary payloads at the listener queueing decision rather than inside every worker invocation.',docs:['events#conditionally-queueing-listeners'],ask:'A queued StockAlert listener is needed only when an event’s remaining quantity is below five. Which listener method can return a boolean to decide whether this particular event should be queued at all?',choices:[['shouldQueue($event)','The dispatcher consults this method before enqueueing the listener for the event.'],['handle($event)','A guard inside handle can skip work, but the queued payload has already been created and delivered by then.'],['failed($event)','Failure callbacks run on a failure path, not as the normal pre-enqueue condition.'],['viaQueue($event)','viaQueue chooses a queue name rather than returning the eligibility decision.']],test:output('1',queue+String.raw`class StockChanged
{
    public function __construct(public int $remaining)
    {
    }
}
class StockAlert implements Illuminate\Contracts\Queue\ShouldQueue
{
    public function shouldQueue(StockChanged $event): bool
    {
        return $event->remaining < 5;
    }

    public function handle(StockChanged $event): void
    {
    }
}
Illuminate\Support\Facades\Event::listen(StockChanged::class, StockAlert::class);
event(new StockChanged(20));
event(new StockChanged(2));
echo Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:347,revision:2,type:'I',level:'F',sub:'queued-listener-queue-routing',needs:['Queued event listeners','viaQueue','Event data'],why:'Route one listener’s work using its event payload without moving every listener to a shared queue.',docs:['events#customizing-the-queue-connection-name-delay'],ask:'A queued RenderPreview listener should use urgent for priority events and previews otherwise. The event has a boolean urgent property. Which listener method selects the queue name from that event?',choices:[['viaQueue($event), returning "urgent" or "previews".','The queued-listener dispatcher resolves the queue using this event-aware routing method.'],['shouldQueue($event), returning the queue name as a truthy string.','shouldQueue decides eligibility, not the destination queue.'],['handle($event), returning the desired queue name before rendering.','The listener has already been routed and executed when handle returns.'],['failed($event), returning the queue name when no exception exists.','Failure handling does not select the destination for a normal dispatch.']],test:output('urgent',queue+String.raw`class PreviewRequested
{
    public function __construct(public bool $urgent)
    {
    }
}
class RenderPreview implements Illuminate\Contracts\Queue\ShouldQueue
{
    public function viaQueue(PreviewRequested $event): string
    {
        return $event->urgent ? 'urgent' : 'previews';
    }

    public function handle(PreviewRequested $event): void
    {
    }
}
Illuminate\Support\Facades\Event::listen(PreviewRequested::class, RenderPreview::class);
event(new PreviewRequested(true));
echo Illuminate\Support\Facades\DB::table('jobs')->value('queue');`)}),
q({n:348,type:'T',sub:'event-fake-after-observer-dependent-setup',needs:['Event fake','Eloquent observers','Factory setup'],why:'Keep required setup lifecycle behavior outside a scope that intentionally intercepts events.',docs:['mocking#event-fake'],ask:'A model’s creating observer supplies a required business identifier. Calling Event::fake() before its factory causes setup to miss that observer. The test only needs to fake the later application action. Which ordering preserves the real setup behavior?',choices:[['Create the setup model first, then call Event::fake() before the action under test.','The observer runs during real setup; the subsequent action’s events are then intercepted for assertions.'],['Call Event::fake(), register the observer again, then create the model.','The fake still intercepts the model event rather than invoking the registered observer normally.'],['Use createQuietly after Event::fake() so the identifier observer runs without noise.','Quiet creation suppresses events instead of restoring the needed observer.'],['Assert that creating was dispatched before reading the identifier from the fake.','An assertion that the event was recorded does not execute the observer’s identifier-generation logic.']],test:output('generated',String.raw`Illuminate\Support\Facades\Schema::create('setup_models', function ($t) {
    $t->id();
    $t->string('business_id');
});
class SetupModel extends Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;
    protected $guarded = [];
}
SetupModel::creating(function ($model) {
    $model->business_id = 'generated';
});
$model = SetupModel::create([]);
Illuminate\Support\Facades\Event::fake();
echo $model->business_id;`)}),
q({n:349,revision:2,type:'E',level:'F',sub:'selective-event-fake',needs:['Event fake selection','Unrelated listeners'],why:'Predict which listeners remain active under a targeted fake.',docs:['mocking#faking-a-subset-of-events'],ask:'Event::fake([OrderPlaced::class]) is active. Both OrderPlaced and AuditRequested have ordinary listeners. What happens when each event is dispatched once?',choices:[['OrderPlaced is faked; AuditRequested’s listeners run.','A selective fake intercepts matching event types and delegates the others to the original dispatcher.'],['Both events are recorded and neither set of listeners runs.','That describes faking every event rather than the supplied subset.'],['Both sets of listeners run, but OrderPlaced is additionally recorded.','For the faked type, recording replaces normal listener execution.'],['OrderPlaced runs normally while AuditRequested is blocked.','This reverses the selected fake list’s meaning.']],test:output('audit:recorded',String.raw`class OrderPlaced
{
}
class AuditRequested
{
}
Illuminate\Support\Facades\Event::listen(OrderPlaced::class, fn () => print('order'));
Illuminate\Support\Facades\Event::listen(AuditRequested::class, fn () => print('audit:'));
Illuminate\Support\Facades\Event::fake([OrderPlaced::class]);
event(new OrderPlaced());
event(new AuditRequested());
Illuminate\Support\Facades\Event::assertDispatched(OrderPlaced::class);
echo 'recorded';`)}),
q({n:350,revision:2,type:'E',level:'F',sub:'scoped-event-fake-restoration',needs:['Event fakeFor','Dispatcher lifetime'],why:'Track restoration after a scoped fake rather than assuming it lasts for the whole test.',docs:['mocking#scoped-event-fakes'],ask:'One listener increments $count. What is printed?',code:[file(String.raw`use Illuminate\Support\Facades\Event;

$count = 0;
Event::listen('recount', function () use (&$count) {
    $count++;
});

Event::fakeFor(function () {
    Event::dispatch('recount');
});

Event::dispatch('recount');

echo $count;`)],choices:[['1','The event inside fakeFor is intercepted; after the scope, the original dispatcher is restored and the listener runs.'],['0','The scoped fake does not remain active after the callback finishes.'],['2','The faked event does not invoke the real listener inside the scope.'],['An exception on the second dispatch','Restoring the original dispatcher is normal supported behavior.']],test:output('1')}),
];
