import {q,file,output} from '../record.mjs';
import {queue,broadcast} from './fixture.mjs';
export default [
q({n:351,revision:2,type:'D',sub:'duplicate-listener-registration',needs:['Event discovery','Explicit listener registration','Listener diagnostics'],why:'Distinguish duplicate registration from duplicate event dispatch.',docs:['events#event-discovery','events#manually-registering-events'],ask:'Diagnostics show one OrderPlaced dispatch but two calls to the same SendReceipt listener. That listener is discovered automatically and also registered explicitly. What should be corrected first?',choices:[['Keep one registration path for that listener/event pair.','Registering the same handler through both paths can invoke it twice for one event.'],['Dispatch OrderPlaced only after a delay while retaining both registrations.','Timing does not remove duplicate listeners for a single event.'],['Make the listener synchronous while retaining both registrations.','Execution mode does not deduplicate the two registrations.'],['Bind the listener as a singleton while keeping both registration paths.','A shared listener instance can still be called twice; singleton lifetime does not deduplicate registrations.']],test:output('2',String.raw`class OrderPlaced
{
}
class ReceiptListener
{
    public function handle(OrderPlaced $event): void
    {
        app('cache')->increment('receipts');
    }
}
Illuminate\Support\Facades\Event::listen(OrderPlaced::class, ReceiptListener::class);
Illuminate\Support\Facades\Event::listen(OrderPlaced::class, ReceiptListener::class);
event(new OrderPlaced());
echo app('cache')->get('receipts');`)}),
q({n:352,revision:2,type:'E',level:'F',sub:'event-subscriber-method-mapping',needs:['Event subscribers','Event-to-method mapping'],why:'Follow subscriber mappings without assuming every event invokes every subscriber method.',docs:['events#event-subscribers'],ask:'The subscriber is registered once. What is printed?',code:[file(String.raw`use Illuminate\Support\Facades\Event;

class Opened
{
}

class Closed
{
}

class SessionSubscriber
{
    public function opened(Opened $event): void
    {
        echo 'O';
    }

    public function closed(Closed $event): void
    {
        echo 'C';
    }

    public function subscribe($events): array
    {
        return [
            Opened::class => 'opened',
            Closed::class => 'closed',
        ];
    }
}

Event::subscribe(SessionSubscriber::class);
Event::dispatch(new Closed());`)],choices:[['C','The Closed event maps to closed; the other mapped method is not invoked for this event.'],['OC','Registering a subscriber does not make every method run for every subscribed event.'],['O','The dispatcher uses the event key, not the first entry in the mapping.'],['Nothing because subscribe must manually call every handler','Returning the supported event-to-method mapping registers these handlers.']],test:output('C')}),
q({n:353,revision:2,type:'A',sub:'immutable-domain-event-facts',needs:['Domain events','Queued consumption','Historical facts versus current models'],why:'Preserve the event-time value required by a downstream historical consumer.',docs:['events#defining-events','queues#eloquent-models-in-queued-jobs'],ask:'A queued audit listener must record the amount accepted when an order was placed. The order’s amount may later change before the listener runs. Which event payload preserves the required fact?',choices:[['Carry the order ID and the accepted amount as explicit immutable event data.','The event records the historical value rather than asking a later model restoration to reconstruct it.'],['Carry only an Eloquent order model using SerializesModels and read its amount later.','The restored model can contain the newer amount, losing the event-time fact.'],['Carry only the order ID and always select the current amount in the listener.','A current-state lookup cannot recover the earlier value without a separate historical source.'],['Clone the order model but continue serializing it with SerializesModels.','A cloned Eloquent model still follows identifier-based restoration under the trait, so cloning alone does not preserve its old amount.']],test:output('100:150',String.raw`class OrderFact
{
    use Illuminate\Queue\SerializesModels;

    public function __construct(public readonly int $orderId, public readonly int $acceptedAmount)
    {
    }
}
$currentAmount = 100;
$serialized = serialize(new OrderFact(7, $currentAmount));
$currentAmount = 150;
$restored = unserialize($serialized);
echo $restored->acceptedAmount.':'.$currentAmount;`)}),
q({n:354,revision:2,type:'A',sub:'private-channel-membership-authorization',needs:['Private broadcast channels','Authenticated users','Resource authorization'],why:'Enforce subscription permission rather than relying on hard-to-guess channel identifiers.',docs:['broadcasting#authorizing-channels'],ask:'Order updates contain private customer data. Channel names use long random order tokens, but any logged-in user who learns a token must still be denied unless they own that order. What enforces this requirement?',choices:[['Authorize order ownership on a private channel.','The private-channel authorization endpoint must decide resource membership before approving the subscription.'],['Use a public channel with a longer random token and no ownership callback.','Secrecy of the channel identifier is not the required access-control decision once the token is known.'],['Approve every authenticated subscriber because login alone identifies an owner.','Authentication establishes identity but not ownership of this specific order.'],['Hide the subscribe button for nonowners while keeping the channel authorization callback unconditional.','A direct subscription request can bypass presentation controls.']],test:output('allowed:denied',broadcast+String.raw`$broadcaster = app(Illuminate\Broadcasting\BroadcastManager::class)->connection();
$broadcaster->channel('orders.{orderId}', fn ($user, $orderId) => (int) $user->order_id === (int) $orderId);
$request = Illuminate\Http\Request::create('/', 'POST', ['channel_name' => 'orders.7']);
$request->setUserResolver(fn () => new Illuminate\Auth\GenericUser(['id' => 1, 'order_id' => 7]));
echo ($broadcaster->auth($request) ? 'allowed' : 'denied').':';
$request->setUserResolver(fn () => new Illuminate\Auth\GenericUser(['id' => 2, 'order_id' => 8]));
try {
    $broadcaster->auth($request);
} catch (Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e) {
    echo 'denied';
}`)}),
q({n:355,type:'R',sub:'broadcast-explicit-public-payload',needs:['Broadcast event payloads','Public properties','Data minimization'],why:'Control fields exposed to subscribers independently of server-side event data.',docs:['broadcasting#broadcast-data'],ask:'A broadcast event has public orderId and internalToken properties. Subscribers need only orderId. Which event method explicitly defines the broadcast payload without exposing internalToken?',choices:[['broadcastWith(), returning ["orderId" => $this->orderId].','An explicit broadcast payload replaces the default public-property extraction with the selected fields.'],['broadcastOn(), returning ["orderId" => $this->orderId].','broadcastOn selects channels, not the data fields in the transmitted payload.'],['broadcastAs(), returning "orderId".','Renaming the event does not remove sensitive public properties from its payload.'],['viaQueue(), returning "private".','A queue name does not redact fields delivered to subscribers.']],test:output('7:hidden',broadcast+String.raw`class OrderUpdate implements Illuminate\Contracts\Broadcasting\ShouldBroadcast
{
    public int $orderId = 7;
    public string $internalToken = 'private-token';

    public function broadcastOn(): array
    {
        return [new Illuminate\Broadcasting\PrivateChannel('orders.7')];
    }

    public function broadcastWith(): array
    {
        return ['orderId' => $this->orderId];
    }
}
$job = new Illuminate\Broadcasting\BroadcastEvent(new OrderUpdate());
$job->handle(app(Illuminate\Contracts\Broadcasting\Factory::class));
$payload = app('cache')->get('broadcast-payload');
echo $payload['orderId'].':'.(array_key_exists('internalToken', $payload) ? 'exposed' : 'hidden');`)}),
q({n:356,revision:2,type:'E',level:'F',sub:'broadcast-now-versus-queued',needs:['ShouldBroadcast','ShouldBroadcastNow','Queue execution'],why:'Predict the broadcast execution boundary under the two interfaces.',docs:['broadcasting#broadcast-queue'],assume:['The normal queue is asynchronous; the broadcaster is configured and succeeds. No worker runs during the two dispatch calls.'],ask:'One event implements ShouldBroadcast and another implements ShouldBroadcastNow. What distinguishes their broadcast work when dispatched?',choices:[['The first queues broadcast work; the second broadcasts synchronously.','ShouldBroadcastNow selects the immediate broadcast dispatch path instead of the normal queue.'],['Both broadcast synchronously because events are never queued.','The normal ShouldBroadcast path uses a queued broadcast job.'],['Both wait for a worker; Now only assigns higher queue priority.','Now changes the dispatch mode, not merely priority within an asynchronous queue.'],['The first broadcasts synchronously and the second waits for the next scheduler tick.','This reverses the first behavior and invents a scheduling requirement for the second.']],test:output('1:1:2',queue+broadcast+String.raw`class QueuedUpdate implements Illuminate\Contracts\Broadcasting\ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [new Illuminate\Broadcasting\Channel('updates')];
    }
}
class ImmediateUpdate implements Illuminate\Contracts\Broadcasting\ShouldBroadcastNow
{
    public function broadcastOn(): array
    {
        return [new Illuminate\Broadcasting\Channel('updates')];
    }
}
event(new QueuedUpdate());
event(new ImmediateUpdate());
echo Illuminate\Support\Facades\DB::table('jobs')->count().':'.app('cache')->get('broadcast-count').':';
app('queue')->connection()->pop()->fire();
echo app('cache')->get('broadcast-count');`)}),
q({n:357,revision:2,type:'D',sub:'to-others-originating-socket',needs:['Broadcast toOthers','InteractsWithSockets','Client socket headers'],why:'Exclude the initiating connection without confusing connection identity with user or session identity.',docs:['broadcasting#only-to-others'],ask:'A client applies its successful HTTP response locally and then receives a duplicate broadcast update. The event uses InteractsWithSockets and dispatch calls toOthers(). Which request metadata identifies the originating connection to exclude?',choices:[['X-Socket-ID, containing the originating connection’s ID.','toOthers records the originating socket identifier for the broadcaster to exclude that connection.'],['The authenticated user ID copied into the event’s orderId property.','A domain identifier is not the socket identity used for this exclusion.'],['The session cookie name used by the web middleware.','Session naming does not tell the broadcaster which live socket originated the request.'],['The CSRF token assigned to the form submission.','A request-forgery token is not a broadcasting connection identifier.']],test:output('123.456',String.raw`class SocketEvent
{
    use Illuminate\Broadcasting\InteractsWithSockets;
}
app('request')->headers->set('X-Socket-ID', '123.456');
$event = new SocketEvent();
$event->dontBroadcastToCurrentUser();
echo $event->socket;`)}),
q({n:358,type:'A',sub:'transactional-invariant-before-async-listener',needs:['Database transactions','Queued listeners','Atomic local invariants'],why:'Keep an essential same-database state change inside the operation that must succeed or fail with it.',docs:['database#database-transactions','events#queued-event-listeners'],ask:'An order and its stock reservation live in one database and must either both be committed or neither. A design commits the order and relies on a queued listener to reserve stock later. Which boundary satisfies the required atomicity?',choices:[['Write the order and reservation in one transaction; use later events for effects outside that invariant.','A local transaction can make these two database writes succeed or roll back together; eventual listener execution cannot supply that atomic commit boundary.'],['Keep the reservation queued and increase its retries until the two writes become atomic.','More retries improve recovery attempts but do not eliminate the period with only the order committed.'],['Commit the order, then place only the reservation listener in a separate transaction.','Two independent transactions still permit the order to survive a reservation failure.'],['Dispatch the listener before committing and assume its worker shares the request’s transaction.','A separate worker does not inherit the request connection’s transaction.']],test:output('0:0',String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
foreach (['orders', 'reservations'] as $table) {
    Schema::create($table, function ($t) {
        $t->id();
        $t->integer('order_id')->nullable();
    });
}
try {
    DB::transaction(function () {
        $id = DB::table('orders')->insertGetId([]);
        DB::table('reservations')->insert(['order_id' => $id]);
        throw new RuntimeException('reject operation');
    });
} catch (RuntimeException $e) {
}
echo DB::table('orders')->count().':'.DB::table('reservations')->count();`)}),
q({n:359,type:'D',sub:'single-domain-event-emission-owner',needs:['Eloquent observers','Application services','Domain event ownership'],why:'Find duplicate emission when listener registration is already known to be singular.',docs:['eloquent#observers','events#dispatching-events'],ask:'Diagnostics show two OrderPlaced dispatches and exactly one listener registration. Both the model’s created observer and the checkout service emit OrderPlaced for the same creation. Which correction addresses this duplicate at its source?',choices:[['Choose one owner for emitting OrderPlaced for that creation path.','Both emission sites currently describe the same domain occurrence; removing the redundant emission prevents two deliveries from the application itself.'],['Register the listener again so each event has its own handler instance.','Additional registration increases handling rather than removing duplicate emission.'],['Change the listener queue name while retaining both emission sites.','Routing does not change the number of events dispatched.'],['Assume ShouldQueue deduplicates events with equal public properties.','Queueing a listener does not automatically deduplicate separate domain event dispatches.']],test:output('2',String.raw`Illuminate\Support\Facades\Schema::create('orders', function ($t) {
    $t->id();
});
class Order extends Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;
}
class OrderPlaced
{
}
$count = 0;
Illuminate\Support\Facades\Event::listen(OrderPlaced::class, function () use (&$count) {
    $count++;
});
Order::created(fn () => event(new OrderPlaced()));
Order::create();
event(new OrderPlaced());
echo $count;`)}),
q({n:360,revision:2,type:'T',level:'F',sub:'event-payload-regression-assertion',needs:['Event fake assertions','Payload content'],why:'Catch an incorrect event field even when the expected event class is dispatched.',docs:['mocking#event-fake'],ask:'A regression dispatches OrderPlaced for order 8 when the action created order 7. Event::assertDispatched(OrderPlaced::class) still passes. Which assertion targets the missing requirement?',choices:[['Event::assertDispatched(OrderPlaced::class, fn ($event) => $event->orderId === 7);','The callback checks the domain payload of a recorded event, not only its class.'],['Event::assertDispatchedTimes(OrderPlaced::class, 1);','One event can still contain the wrong order ID.'],['Event::assertNothingDispatched();','The action is supposed to dispatch an event; absence is not the required correction.'],['Event::assertListening(OrderPlaced::class, SendReceipt::class);','Listener registration does not verify the payload emitted by the action.']],test:output('payload-checked',String.raw`class OrderPlaced
{
    public function __construct(public int $orderId)
    {
    }
}
Illuminate\Support\Facades\Event::fake();
event(new OrderPlaced(7));
Illuminate\Support\Facades\Event::assertDispatched(OrderPlaced::class, fn ($event) => $event->orderId === 7);
echo 'payload-checked';`)}),
];
