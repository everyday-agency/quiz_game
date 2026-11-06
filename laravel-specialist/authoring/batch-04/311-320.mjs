import {q,file,output,contract} from '../record.mjs';
import {queue,marker} from './fixture.mjs';
export default [
q({n:311,type:'A',sub:'durable-upload-reference-for-job',needs:['UploadedFile lifetime','Job serialization','Storage disks'],why:'Cross the request-to-worker boundary with a durable resource reference.',docs:['queues#creating-jobs','filesystem#file-uploads'],ask:'A controller queues a large import using the current UploadedFile object. The worker may run hours later in another process. Which payload design supports that lifetime?',choices:[['Store the upload on a worker-accessible disk and queue its disk name and path.','The worker can open durable bytes by reference; a request-lifetime uploaded-file object and temporary path are not a durable queue payload.'],['Queue the UploadedFile object directly so its temporary resource stays open until execution.','Serialization does not extend the request upload lifetime or transfer an open file handle into another process.'],['Queue only the original client filename and reconstruct the temporary directory on the worker.','A client filename is neither a trusted storage path nor evidence that the temporary file still exists.'],['Queue the temporary file’s inode number instead of the path.','An inode number is not a portable durable storage reference across processes and hosts.']],test:output('object-rejected:durable',String.raw`$temporary = getcwd().'/request-upload.csv';
file_put_contents($temporary, "id\n7\n");
$upload = new Illuminate\Http\UploadedFile($temporary, 'import.csv', 'text/csv', null, true);
try {
    serialize($upload);
} catch (Exception $e) {
    echo 'object-rejected:';
}
Illuminate\Support\Facades\Storage::disk('local')->put('imports/run.csv', file_get_contents($temporary));
$payload = unserialize(serialize(['disk' => 'local', 'path' => 'imports/run.csv']));
unlink($temporary);
echo Illuminate\Support\Facades\Storage::disk($payload['disk'])->exists($payload['path']) ? 'durable' : 'missing';`)}),
q({n:312,revision:2,type:'A',sub:'queued-operation-current-authorization',needs:['Queued work','Laravel Gate','Revocable permissions'],why:'Enforce the stated execution-time permission contract rather than trusting an earlier decision indefinitely.',docs:['queues#handle-method-dependency-injection','authorization#authorizing-actions'],ask:'An export can expose private records. Policy requires the requester to still be authorized when it executes, and access may be revoked after dispatch. Which design enforces that policy?',choices:[['Reload the requester and resource, then authorize before export.','A queued approval is not current permission; the handler must evaluate the live policy under the stated requirement.'],['Serialize the controller’s earlier true authorization result and rely on it in handle.','That freezes an obsolete decision and ignores revocation before execution.'],['Use a signed queue name so the worker treats every submitted export as permanently authorized.','Transport routing or integrity does not replace the application’s execution-time access policy.'],['Check only that the resource still exists before exporting it.','Existence does not establish the requester’s current permission to read it.']],test:output('revoked',queue+String.raw`class ProtectedExport implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function __construct(public int $requesterId)
    {
    }

    public function handle(): void
    {
        $user = new Illuminate\Auth\GenericUser(['id' => $this->requesterId]);
        Illuminate\Support\Facades\Gate::forUser($user)->authorize('export');
        echo 'leaked';
    }
}
$permitted = true;
Illuminate\Support\Facades\Gate::define('export', function ($user) use (&$permitted) {
    return $permitted;
});
Illuminate\Support\Facades\Bus::dispatch(new ProtectedExport(7));
$permitted = false;
try {
    app('queue')->connection()->pop()->fire();
} catch (Illuminate\Auth\Access\AuthorizationException $e) {
    echo 'revoked';
}`)}),
q({n:313,revision:2,type:'A',sub:'duplicate-delivery-unique-result-key',needs:['At-least-once job delivery','Database uniqueness','Idempotent results'],why:'Make the durable result identify the logical operation across repeated job attempts.',docs:['queues#unique-jobs','migrations#indexes'],ask:'A job may be delivered twice after a worker loses its acknowledgment. Its sole side effect is inserting an export-request row. The same logical request must create at most one such row. Which boundary enforces this even after a previous job has completed?',choices:[['Enforce a unique request key and reuse its existing result.','Durable uniqueness on the operation identity prevents repeated deliveries from inserting another result row.'],['Use ShouldBeUnique alone and remove all database uniqueness.','A dispatch uniqueness lock is released during the job lifecycle and is not a permanent record of completed business operations.'],['Set tries=1 and assume acknowledgment loss cannot cause another delivery.','An attempt limit does not turn the queue transport into exactly-once delivery.'],['Check whether the row exists and then insert without any constraint.','Concurrent deliveries can both pass the separate check before either insert becomes visible.']],test:output('1:same',String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('exports', function ($t) {
    $t->id();
    $t->string('request_key')->unique();
});
$perform = function () {
    try {
        return DB::table('exports')->insertGetId(['request_key' => 'request-7']);
    } catch (Illuminate\Database\UniqueConstraintViolationException $e) {
        return DB::table('exports')->where('request_key', 'request-7')->value('id');
    }
};
$a = $perform();
$b = $perform();
echo DB::table('exports')->count().':'.($a === $b ? 'same' : 'different');`)}),
q({n:314,type:'A',level:'A',sub:'transactional-outbox-publish-window',needs:['Database transactions','Broker publication','Outbox relay','Idempotent consumers'],why:'Resolve the atomicity gap between local commit and remote publication while accounting for relay retries.',docs:['database#database-transactions','https://microservices.io/patterns/data/transactional-outbox.html'],ask:'An order commits, then the process crashes before publishing OrderAccepted to a broker. The event must remain recoverable without a distributed transaction. Which design also accounts for a relay crash after publishing?',choices:[['Commit the order and an outbox row together; retry relay delivery using a stable event ID and idempotent consumers.','The durable outbox survives a post-commit process crash. A relay may publish twice after an ambiguous acknowledgment, so consumers must tolerate duplicates.'],['Publish before the database commit and assume a later rollback retracts the broker message.','A local rollback cannot retract an already published remote message.'],['Use only an in-memory afterCommit callback and consider publication guaranteed once commit succeeds.','A process can die after commit but before the callback publishes, leaving no durable publication work item.'],['Commit an outbox row and mark it sent before publishing, so consumers never receive duplicates.','A crash after marking sent but before publishing loses the event; avoiding duplicates this way sacrifices recoverability.']],test:contract('Illuminate/Database/Concerns/ManagesTransactions.php',['public function transaction(', '$this->getPdo()->commit();'],'A local transaction can commit the domain row and outbox row atomically. Relay failure-window and consumer-idempotency claims use the cited original outbox pattern; no broker execution or exactly-once guarantee is claimed.')}),
q({n:315,revision:2,type:'E',level:'F',sub:'release-does-not-return',needs:['Job release','PHP control flow'],why:'Distinguish queue state mutation from returning out of the current handler.',docs:['queues#manually-releasing-a-job'],ask:'The worker runs this handler once. What is printed during that invocation?',code:[file(String.raw`use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RetryLater implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $this->release(30);

        echo 'continued';
    }
}`)],choices:[['continued; release changes queue state but does not exit the method.','The following statement still runs unless the handler returns or otherwise stops control flow.'],['Nothing; release automatically returns from handle.','release does not perform a PHP return on behalf of its caller.'],['continued twice immediately because release invokes handle again recursively.','Release schedules later availability rather than recursively re-entering handle.'],['A fatal error because released jobs cannot execute any following PHP statement.','Queue state does not prohibit ordinary statements from running after release.']],test:output('continued',queue+String.raw`require getcwd().'/probe.php';
Illuminate\Support\Facades\Bus::dispatch(new RetryLater());
app('queue')->connection()->pop()->fire();`)}),
q({n:316,type:'E',sub:'release-reservation-attempt-count',needs:['Queue reservations','Job attempts','Release semantics'],why:'Count worker reservations even when the previous handler deliberately released the job.',docs:['queues#specifying-max-job-attempts-timeout-values'],ask:'A database job is reserved for the first time, reports attempts()=1, and is released with zero delay. When it is reserved again, before any exception occurs, what does attempts() report?',choices:[['2','The database queue increments the reservation attempt counter; release does not erase prior attempts.'],['1','A deliberate release still leads to a new counted reservation.'],['0','Release does not reset the persisted attempt history.'],['It is undefined until the handler throws an exception','Attempts count reservations rather than only failed exception paths.']],test:output('1:2',queue+marker+String.raw`Illuminate\Support\Facades\Bus::dispatch(new MarkWork());
$first = app('queue')->connection()->pop();
echo $first->attempts().':';
$first->release(0);
$second = app('queue')->connection()->pop();
echo $second->attempts();`)}),
q({n:317,revision:2,type:'E',level:'F',sub:'backoff-array-last-value-fallback',needs:['Queue retry backoff','Attempt numbering'],why:'Map consecutive failed attempts to the configured retry delay sequence.',docs:['queues#dealing-with-failed-jobs'],ask:'A job’s backoff() returns [10,30,120]. It remains eligible for retries. Which delays does the worker select after failed attempts 1, 2, 3 and 4?',choices:[['10,30,120,120','The attempt selects the corresponding delay, and attempts beyond the array use its final value.'],['10,30,120,10','The backoff sequence does not cycle back to its start.'],['0,10,30,120','The first failed attempt uses the first configured entry rather than an implicit zero delay.'],['10,30,120,0','Exhausting the explicit entries does not reset the delay to zero.']],test:output('10,30,120,120',String.raw`$job = new class
{
    public int $attempt = 1;

    public function attempts(): int
    {
        return $this->attempt;
    }

    public function backoff(): string
    {
        return '10,30,120';
    }
};
$method = new ReflectionMethod(Illuminate\Queue\Worker::class, 'calculateBackoff');
$worker = app('queue.worker');
$options = new Illuminate\Queue\WorkerOptions();
$values = [];
for ($job->attempt = 1; $job->attempt <= 4; $job->attempt++) {
    $values[] = $method->invoke($worker, $job, $options);
}
echo implode(',', $values);`)}),
q({n:318,type:'E',sub:'retry-until-deadline-expired',needs:['Queue retryUntil','Worker retry eligibility','Frozen-time tests'],why:'Apply an absolute retry deadline even when the numerical attempt budget would still allow work.',docs:['queues#time-based-attempts'],ask:'A job payload has retryUntil=12:05 UTC. A worker reserves it at 12:06 UTC for its second attempt; maxTries is 50. Under the normal retry-deadline rules, what happens before handle?',choices:[['The job is failed because its stored retry deadline has expired.','The elapsed absolute deadline prevents another handler execution even though the numerical budget has remaining attempts.'],['The handler runs because 2 is less than 50.','That ignores the retryUntil eligibility condition present in the payload.'],['The deadline moves forward automatically because the job was reserved again.','The payload’s expiration does not renew on every reservation.'],['The worker waits until the next day’s 12:05 to execute it.','retryUntil is an expiration boundary, not a daily schedule.']],test:output('failed:not-handled',queue+String.raw`Illuminate\Support\Carbon::setTestNow('2026-01-01 12:00:00');
class DeadlineJob implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function retryUntil(): DateTimeInterface
    {
        return now()->addMinutes(5);
    }

    public function handle(): void
    {
        app('cache')->put('ran', true);
    }
}
Illuminate\Support\Facades\Bus::dispatch(new DeadlineJob());
$first = app('queue')->connection()->pop();
$first->release(0);
Illuminate\Support\Carbon::setTestNow('2026-01-01 12:06:00');
$job = app('queue')->connection()->pop();
try {
    app('queue.worker')->process('database', $job, new Illuminate\Queue\WorkerOptions(maxTries: 50));
} catch (Illuminate\Queue\MaxAttemptsExceededException $e) {
    // Observe the worker's terminal state after its normal exception path.
}
echo ($job->hasFailed() ? 'failed' : 'eligible').':'.(app('cache')->get('ran') ? 'handled' : 'not-handled');`)}),
q({n:319,type:'R',sub:'timeout-shorter-than-retry-after',needs:['Queue reservation expiry','Worker timeout','Concurrent duplicate execution'],why:'Allow a timed-out worker to stop before the transport makes its reservation available again.',docs:['queues#job-expirations-and-timeouts'],assume:['A database or Redis queue using retry_after, supervised workers with working timeout enforcement, and jobs that may hang.'],ask:'retry_after is 90 seconds, but the worker timeout is 120 seconds. Another worker may receive the same job while the first is still running. Which configuration direction addresses this overlap?',choices:[['Set the worker timeout below retry_after, leaving a margin for termination.','The worker should stop processing before the reservation becomes available for another worker.'],['Increase the worker timeout further while leaving retry_after at 90.','This extends the period during which the first worker can still run after the job is available again.'],['Lower retry_after below the existing timeout to make retries more responsive.','Earlier reservation expiry increases the overlap risk.'],['Set backoff to 120 and leave both timeout values unchanged.','Exception retry delay does not repair reservation expiry while a hung worker is still running.']],test:contract('Illuminate/Queue/Worker.php',['protected function timeoutForJob','return $job && ! is_null($job->timeout()) ? $job->timeout() : $options->timeout;'],'Worker timeout and reservation expiry are distinct operational clocks. The cited Laravel contract requires timeout to be shorter; no actual process kill or live Redis timing is performed.')}),
q({n:320,revision:3,type:'E',level:'F',sub:'manual-fail-terminal-job-state',needs:['InteractsWithQueue fail','Failed callbacks','Retry lifecycle'],why:'Distinguish an explicit terminal failure from releasing a retryable exception.',docs:['queues#manually-failing-a-job'],ask:'A job is allowed five attempts but its first handler calls $this->fail(new RuntimeException("invalid input")); return;. What does explicit fail request?',choices:[['Explicitly fail and remove the job; remaining attempts are not used.','Manual failure is an explicit terminal decision that invokes failure handling; the numerical retry allowance does not override it.'],['Release the job immediately and consume only one of the five permitted attempts.','That describes release or a retryable worker exception path, not explicit fail.'],['Ignore the failure until the fifth attempt because maxTries has priority.','A job can fail itself before exhausting the retry count.'],['Treat the job as successful because the handler then returns normally.','The explicit failed state is not undone by returning from handle.']],test:output('failed:0',queue+String.raw`class RejectWork implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public $tries = 5;

    public function handle(): void
    {
        $this->fail(new RuntimeException('invalid input'));

        return;
    }
}
Illuminate\Support\Facades\Bus::dispatch(new RejectWork());
$job = app('queue')->connection()->pop();
$job->fire();
echo ($job->hasFailed() ? 'failed' : 'success').':'.Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
];
