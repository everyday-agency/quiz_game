import {q,file,output} from '../record.mjs';
import {queue,mail,notifications,broadcast} from './fixture.mjs';
export default [
q({n:381,revision:2,type:'E',level:'F',sub:'queued-notification-recipient-channel-jobs',needs:['Queued notifications','Recipients and channels'],why:'Count delivery work units rather than treating the whole recipient collection as one job.',docs:['notifications#queueing-notifications'],ask:'A ShouldQueue notification is sent to three recipients. via() returns ["mail","database"] for each. No channels are suppressed. How many queued notification delivery jobs are created?',choices:[['6','Queueing creates work for each recipient/channel pair: three recipients times two channels.'],['1','The complete recipient/channel matrix is not one ordinary queued notification job.'],['2','Counting only channels ignores separate jobs for the three recipients.'],['3','Counting only recipients ignores their two selected delivery channels.']],test:output('6',queue+notifications+String.raw`class MultiNotice extends DatabaseNotice implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Bus\Queueable;

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }
}
$second = Member::create(['name' => 'Lin', 'email' => 'lin@example.test']);
$third = Member::create(['name' => 'Sam', 'email' => 'sam@example.test']);
Illuminate\Support\Facades\Notification::send([$member, $second, $third], new MultiNotice());
echo Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:382,type:'I',sub:'notification-per-channel-connections',needs:['Queued notification routing','viaConnections','Queue connection names'],why:'Choose transports per channel without confusing them with logical queue names.',docs:['notifications#customizing-the-notification-queue-connection'],ask:'A queued notification uses mail and database channels. Mail should use the configured slow connection, while database notifications use fast. Which method supplies this channel-to-connection map?',choices:[['viaConnections(), returning ["mail" => "slow", "database" => "fast"].','The notification sender reads this map when choosing the connection for each channel job.'],['viaQueues(), returning ["mail" => "slow", "database" => "fast"].','viaQueues selects logical queue names rather than the configured connection names.'],['via(), returning ["slow", "fast"].','via selects delivery channels, so these would be treated as channel names rather than queue connections.'],['toDatabase(), returning ["mail" => "slow", "database" => "fast"].','The database representation does not control the transport routing of channel jobs.']],test:output('fast,slow',queue+notifications+String.raw`config([
    'queue.connections.slow' => [...config('queue.connections.database'), 'queue' => 'slow'],
    'queue.connections.fast' => [...config('queue.connections.database'), 'queue' => 'fast'],
]);
class RoutedNotice extends DatabaseNotice implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Bus\Queueable;

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function viaConnections(): array
    {
        return ['mail' => 'slow', 'database' => 'fast'];
    }
}
$member->notify(new RoutedNotice());
echo Illuminate\Support\Facades\DB::table('jobs')->orderBy('queue')->pluck('queue')->implode(',');`)}),
q({n:383,type:'R',sub:'notification-should-send-at-delivery',needs:['Queued notifications','Changing delivery preferences','shouldSend'],why:'Re-evaluate the stated delivery policy after queue delay instead of relying only on initial channel selection.',docs:['notifications#determining-if-a-queued-notification-should-be-sent'],ask:'A user may opt out after a mail notification is queued. Product policy requires respecting the current opt-out when the worker delivers it. Which notification hook can veto that delivery after the notifiable is restored?',choices:[['shouldSend($notifiable, $channel), returning false for the current opt-out.','This delivery-time decision can suppress a queued channel even after the original via selection.'],['via($notifiable) alone, relying exclusively on the value at initial queueing.','Initial channel selection does not by itself re-evaluate a preference changed during queue delay.'],['viaQueue($notifiable), returning false when the user opts out.','Queue routing is not the notification’s delivery-veto contract.'],['toDatabase($notifiable), returning null to cancel an unrelated mail channel.','A database representation does not veto a queued mail delivery.']],test:output('0',queue+mail+notifications+String.raw`$member->update(['email_notifications' => true]);
class OptOutNotice extends Illuminate\Notifications\Notification implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Bus\Queueable;

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function shouldSend($notifiable, string $channel): bool
    {
        return (bool) $notifiable->email_notifications;
    }

    public function toMail($notifiable)
    {
        return (new Illuminate\Notifications\Messages\MailMessage())->view('mail.simple');
    }
}
$member->notify(new OptOutNotice());
$member->update(['email_notifications' => false]);
app('queue')->connection()->pop()->fire();
echo app('mailer')->getSymfonyTransport()->messages()->count();`)}),
q({n:384,revision:2,type:'E',sub:'notification-id-recipient-correlation',needs:['Queued notification IDs','Recipient/channel work units'],why:'Correlate the channel jobs of one recipient without merging separate recipients into one notification identity.',docs:['notifications#queueing-notifications'],assume:['Laravel 13.40; the notification has no explicitly assigned id. Two recipients each use mail and database.'],ask:'Four queued channel jobs are created. How are their notification IDs assigned by the normal sender?',choices:[['One shared ID per recipient, across that recipient’s channels.','The sender creates an ID per recipient and carries it into the cloned notification for each of that recipient’s channels.'],['All four jobs share one ID because the same notification instance was passed to send.','Without an explicit id, the sender creates the identifier inside the recipient loop.'],['Every channel job has a different ID, including channels for the same recipient.','The default ID is shared across a recipient’s channel clones.'],['Only the database channel has an ID; mail jobs have none.','The queued notification object receives the recipient ID before individual channel jobs are dispatched.']],test:output('2:shared-within-recipient',queue+notifications+String.raw`class CorrelatedNotice extends DatabaseNotice implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Bus\Queueable;

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }
}
$other = Member::create(['name' => 'Lin', 'email' => 'lin@example.test']);
Illuminate\Support\Facades\Notification::send([$member, $other], new CorrelatedNotice());
$ids = [];
foreach (Illuminate\Support\Facades\DB::table('jobs')->orderBy('id')->get() as $row) {
    $payload = json_decode($row->payload, true);
    $command = unserialize($payload['data']['command']);
    $ids[$command->notifiables->first()->id][] = $command->notification->id;
}
$all = array_merge(...array_values($ids));
echo count(array_unique($all)).':'.(count(array_unique($ids[1])) === 1 && count(array_unique($ids[2])) === 1 ? 'shared-within-recipient' : 'different');`)}),
q({n:385,revision:2,type:'T',level:'F',sub:'notification-recipient-channel-assertion',needs:['Notification fake','Channel assertions','Recipient identity'],why:'Catch a regression in the selected delivery channel for a particular recipient.',docs:['notifications#testing'],ask:'The test must prove that Member 7 receives ReadyNotice through database only. Notification::fake() is active. Which assertion includes both recipient identity and the selected channel list?',choices:[['Notification::assertSentTo($member7, ReadyNotice::class, fn ($notice, $channels) => $channels === ["database"]);','The recipient argument scopes the record, and the callback verifies its exact channel list.'],['Notification::assertSentTimes(ReadyNotice::class, 1);','A total count does not establish the intended recipient or channels.'],['Notification::assertSentTo($member7, ReadyNotice::class);','This checks recipient and type but permits an unintended mail channel as well.'],['Notification::assertSentTo($member8, ReadyNotice::class, fn ($notice, $channels) => $channels === ["database"]);','The channel predicate is right but the recipient is not the required member.']],test:output('matched',notifications+String.raw`Illuminate\Support\Facades\Notification::fake();
$member->notify(new DatabaseNotice());
Illuminate\Support\Facades\Notification::assertSentTo($member, DatabaseNotice::class, fn ($n, $channels) => $channels === ['database']);
echo 'matched';`)}),
q({n:386,type:'R',sub:'notification-channel-specific-data',needs:['Database notification data','Broadcast notification data','Consumer boundaries'],why:'Separate persisted internal data from the narrower client-visible broadcast representation.',docs:['notifications#formatting-database-notifications','notifications#formatting-broadcast-notifications'],ask:'A notification’s internal auditReason belongs in database storage but must not reach browser subscribers. Both database and broadcast channels are selected. Which representation design expresses the two data contracts explicitly?',choices:[['Return internal fields from toDatabase and a limited BroadcastMessage from toBroadcast.','Each channel receives its dedicated representation instead of sharing a broad fallback payload.'],['Put auditReason in toArray and rely on both channels using it safely by default.','The shared fallback can expose the same internal fields through the broadcast channel.'],['Return the internal data only from via.','via chooses channel names and is not a data-redaction map.'],['Keep one broad payload and rename the broadcast channel to private.','Channel authorization limits recipients but does not remove a field that those authorized browser clients must not receive.']],test:output('stored:hidden',notifications+broadcast+String.raw`class PrivateNotice extends DatabaseNotice
{
    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable): array
    {
        return ['title' => 'Ready', 'auditReason' => 'internal'];
    }

    public function toBroadcast($notifiable)
    {
        return new Illuminate\Notifications\Messages\BroadcastMessage(['title' => 'Ready']);
    }
}
$member->notify(new PrivateNotice());
$data = json_decode(Illuminate\Support\Facades\DB::table('notifications')->value('data'), true);
echo (isset($data['auditReason']) ? 'stored' : 'missing').':'.(array_key_exists('auditReason', app('cache')->get('broadcast-payload')) ? 'exposed' : 'hidden');`)}),
q({n:387,revision:2,type:'E',level:'F',sub:'schedule-explicit-timezone',needs:['Laravel scheduler','Named timezones','UTC conversion'],why:'Apply the event’s timezone to its local wall-clock schedule.',docs:['scheduling#timezones'],assume:['The server clock uses UTC. On 15 January 2026, Europe/Zurich is UTC+1.'],ask:'At which UTC time is this daily event due on that date?',code:[file(String.raw`$schedule->call(fn () => null)
    ->dailyAt('09:00')
    ->timezone('Europe/Zurich');`,'routes/console-fragment.php','fragment','Inside schedule registration; $schedule is an Illuminate\\Console\\Scheduling\\Schedule instance.')],choices:[['08:00 UTC','The event’s 09:00 local time is one hour ahead of UTC on the specified date.'],['09:00 UTC','The event explicitly overrides the server’s UTC timezone for its schedule.'],['10:00 UTC','This applies the offset in the wrong direction.'],['Every hour at minute 09','dailyAt defines one local time of day, not an hourly minute field.']],test:output('due:not-due',String.raw`$schedule = new Illuminate\Console\Scheduling\Schedule('UTC');
$fragment = getcwd().'/routes/console-fragment.php';
file_put_contents($fragment, "<?php\n".file_get_contents($fragment));
require $fragment;
$event = $schedule->events()[0];
Illuminate\Support\Carbon::setTestNow('2026-01-15 08:00:00');
echo ($event->isDue(app()) ? 'due' : 'not-due').':';
Illuminate\Support\Carbon::setTestNow('2026-01-15 09:00:00');
echo $event->isDue(app()) ? 'due' : 'not-due';`)}),
q({n:388,type:'A',sub:'schedule-dst-wall-clock-risk',needs:['Scheduler timezones','Daylight-saving transitions','Business occurrence semantics'],why:'Separate local wall-clock scheduling from an exactly-once business occurrence guarantee.',docs:['scheduling#timezones'],ask:'A settlement is scheduled daily at 02:30 Europe/Zurich. The business needs one durable settlement per business date, including clock-change days. What must the design account for?',choices:[['Local 02:30 can be skipped or repeated; use an explicit occurrence key and a recoverable scheduling policy.','Daylight-saving transitions can remove or repeat local wall times. A durable date-level operation identity and recovery rule are needed beyond the cron expression.'],['The scheduler guarantees one invocation per local date even when 02:30 does not exist.','A local cron expression does not automatically compensate for a skipped wall-clock time.'],['Using onOneServer alone guarantees the missing spring invocation will be replayed.','Cross-server election does not create an invocation for a time that never becomes due.'],['Adding a five-minute overlap lock guarantees the repeated autumn time can never run again.','The repeated local time can occur an hour later, after that lock expires; the lock is not a business-date ledger.']],test:output('spring-missing:autumn-twice',String.raw`$schedule = new Illuminate\Console\Scheduling\Schedule('UTC');
$event = $schedule->call(fn () => null)->dailyAt('02:30')->timezone('Europe/Zurich');
$autumn = [];
foreach (['2026-10-25 00:30:00', '2026-10-25 01:30:00'] as $time) {
    Illuminate\Support\Carbon::setTestNow($time);
    $autumn[] = $event->isDue(app());
}
$spring = 0;
for ($minute = 0; $minute < 180; $minute++) {
    Illuminate\Support\Carbon::setTestNow(Illuminate\Support\Carbon::parse('2026-03-29 00:00:00', 'UTC')->addMinutes($minute));
    $spring += (int) $event->isDue(app());
}
echo ($spring === 0 ? 'spring-missing' : 'spring-due').':'.($autumn === [true, true] ? 'autumn-twice' : 'autumn-other');`)}),
q({n:389,type:'T',sub:'scheduled-task-overlap-mutex',needs:['Scheduled task mutex','Long-running jobs','Shared cache'],why:'Verify that an already-held task lock prevents another overlapping invocation.',docs:['scheduling#preventing-task-overlaps'],ask:'A scheduled callback can take longer than its one-minute frequency. Its cache driver supports shared atomic locks. Which event option prevents a later scheduler invocation from starting that same task while the previous run still holds its lock?',choices:[['withoutOverlapping()','The event acquires an execution mutex and skips an invocation when the lock is already held.'],['everyMinute()','Frequency selects due times; it does not itself prevent concurrent runs.'],['runInBackground()','Background execution changes waiting behavior and is not a mutual-exclusion rule.'],['when(fn () => true)','An unconditional predicate permits every eligible invocation and provides no lock.']],test:output('0:1',String.raw`$schedule = new Illuminate\Console\Scheduling\Schedule('UTC');
$count = 0;
$event = $schedule->call(function () use (&$count) {
    $count++;
})->name('minute-report')->everyMinute()->withoutOverlapping();
$mutex = $event->mutex;
$mutex->create($event);
$event->run(app());
echo $count.':';
$mutex->forget($event);
$event->run(app());
echo $count;`)}),
q({n:390,type:'A',sub:'single-server-schedule-election',needs:['Multi-server scheduler','Shared cache','Task election versus overlap'],why:'Choose one server for the same due occurrence rather than only preventing simultaneous execution.',docs:['scheduling#running-tasks-on-one-server'],ask:'Two application hosts run the scheduler. A fast daily task must run on only one host for that due occurrence. Both share the supported cache store. Which option supplies the scheduler’s single-server election?',choices:[['onOneServer()','The scheduling mutex chooses one server for the due event occurrence across hosts sharing the lock store.'],['withoutOverlapping() alone','A fast run can release its execution lock before the second host checks, allowing sequential duplicate runs in the same occurrence.'],['runInBackground() on both hosts','Background execution does not elect a single host.'],['Use the same cron expression on both hosts without a mutex','Identical due times cause both schedulers to consider the task eligible.']],test:output('yes:no',String.raw`$a = new Illuminate\Console\Scheduling\Schedule('UTC');
$b = new Illuminate\Console\Scheduling\Schedule('UTC');
$first = $a->call(fn () => null)->name('daily-report')->daily()->onOneServer();
$second = $b->call(fn () => null)->name('daily-report')->daily()->onOneServer();
$time = Illuminate\Support\Carbon::parse('2026-01-01 00:00:00', 'UTC');
echo ($a->serverShouldRun($first, $time) ? 'yes' : 'no').':'.($b->serverShouldRun($second, $time) ? 'yes' : 'no');`)}),
];
