import {q,file,output,contract} from '../record.mjs';
import {queue,marker} from './fixture.mjs';
export default [
q({n:321,type:'E',sub:'failed-callback-restored-job-state',needs:['Queue failure callbacks','Serialized job state'],why:'Distinguish state persisted in the payload from transient mutations during a failed handler.',docs:['queues#cleaning-up-after-failed-jobs'],ask:'The job was queued with phase="queued". Its handler changes that property and throws. Once normal failure handling calls failed(), which phase is printed?',code:[file(String.raw`use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ImportWork implements ShouldQueue
{
    use Queueable;

    public string $phase = 'queued';

    public function handle(): void
    {
        $this->phase = 'processing';

        throw new RuntimeException('failed import');
    }

    public function failed(?Throwable $error): void
    {
        echo $this->phase;
    }
}`)],choices:[['queued','Failure handling restores the job from its payload, so an unsaved mutation made during handle is not retained.'],['processing','This assumes the failed callback receives the same mutated command instance rather than a restored job.'],['An empty string','The serialized default property value remains available when the job is restored.'],['The exception message failed import','The callback explicitly prints phase, not the supplied exception message.']],test:output('queued',queue+String.raw`require getcwd().'/probe.php';
Illuminate\Support\Facades\Bus::dispatch(new ImportWork());
$job = app('queue')->connection()->pop();
try {
    $job->fire();
} catch (RuntimeException $e) {
    $job->fail($e);
}`)}),
q({n:322,type:'I',level:'F',sub:'retry-versus-forget-failed-job',needs:['Failed-job storage','Queue operations'],why:'Select recovery rather than removal of the stored failure record.',docs:['queues#retrying-failed-jobs'],ask:'An operator has repaired the cause of failed job UUID abc. The stored payload should be placed back on its recorded queue. Which command requests that recovery?',choices:[['php artisan queue:retry abc','retry retrieves the failed payload and pushes it back for processing.'],['php artisan queue:forget abc','forget removes the stored failed-job record; it does not requeue the work.'],['php artisan queue:flush','flush deletes failed-job records in bulk rather than retrying this job.'],['php artisan queue:restart','restart signals long-lived workers to exit gracefully; it does not requeue a particular failed payload.']],test:output('1:0',queue+marker+String.raw`Illuminate\Support\Facades\Schema::create('failed_jobs', function ($t) {
    $t->id();
    $t->string('uuid')->unique();
    $t->text('connection');
    $t->text('queue');
    $t->longText('payload');
    $t->longText('exception');
    $t->timestamp('failed_at')->useCurrent();
});
config(['queue.failed' => ['driver' => 'database-uuids', 'database' => 'sqlite', 'table' => 'failed_jobs']]);
Illuminate\Support\Facades\Bus::dispatch(new MarkWork());
$payload = Illuminate\Support\Facades\DB::table('jobs')->value('payload');
Illuminate\Support\Facades\DB::table('jobs')->delete();
$id = app('queue.failer')->log('database', 'default', $payload, new RuntimeException('fixture'));
Illuminate\Support\Facades\Artisan::call('queue:retry', ['id' => [$id]]);
echo Illuminate\Support\Facades\DB::table('jobs')->count().':'.Illuminate\Support\Facades\DB::table('failed_jobs')->count();`)}),
q({n:323,revision:2,type:'E',level:'F',sub:'unique-dispatch-lock-lifecycle',needs:['ShouldBeUnique','Dispatchable','Cache locks'],why:'Follow duplicate dispatch rejection while a key is locked and renewed eligibility after completion.',docs:['queues#unique-jobs'],ask:'RebuildIndex implements ShouldQueue and ShouldBeUnique with uniqueId()="catalog". Both dispatches use RebuildIndex::dispatch(), the same cache store and no lock expiry. No worker runs between them. How many payloads are enqueued?',choices:[['1','The first pending dispatch acquires the unique lock; the second cannot acquire the same lock and is not enqueued.'],['2, but the second is automatically deleted only after a worker starts it.','ShouldBeUnique checks the dispatch boundary rather than merely filtering execution after both payloads are queued.'],['0 until the first unique lock is explicitly released by application code.','The first dispatch acquires the available lock and queues normally.'],['2 because uniqueness applies only to different job classes','The class and unique ID identify the lock; these matching jobs conflict.']],test:output('1:1',queue+String.raw`class RebuildIndex implements Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Contracts\Queue\ShouldBeUnique
{
    use Illuminate\Foundation\Queue\Queueable;

    public function uniqueId(): string
    {
        return 'catalog';
    }

    public function handle(): void
    {
    }
}
RebuildIndex::dispatch();
RebuildIndex::dispatch();
echo Illuminate\Support\Facades\DB::table('jobs')->count().':';
app('queue')->connection()->pop()->fire();
RebuildIndex::dispatch();
echo Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:324,revision:2,type:'E',sub:'unique-until-processing-release-point',needs:['ShouldBeUniqueUntilProcessing','Job execution lifecycle'],why:'Locate lock release before the handler rather than assuming all uniqueness lasts until completion.',docs:['queues#keeping-jobs-unique-until-processing-begins'],ask:'A job uses ShouldBeUniqueUntilProcessing. Its unique cache lock has not expired. Once its worker enters handle(), another matching dispatch arrives. What does this interface permit?',choices:[['It can enqueue; that lock is released before handle.','This interface limits duplicate waiting jobs but releases its dispatch lock before the current handler runs.'],['The new dispatch is rejected until the current handler returns successfully.','That describes the longer ordinary ShouldBeUnique lifecycle, not this interface.'],['The new dispatch cancels the currently running handler.','Releasing the uniqueness lock does not cancel or replace executing PHP work.'],['The new dispatch waits synchronously for the first handler to finish.','The uniqueness mechanism does not make dispatch a blocking join on the current handler.']],test:output('1',queue+String.raw`class RefreshCatalog implements Illuminate\Contracts\Queue\ShouldQueue, Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing
{
    use Illuminate\Foundation\Queue\Queueable;

    public function uniqueId(): string
    {
        return 'catalog';
    }

    public function handle(): void
    {
        self::dispatch();
    }
}
RefreshCatalog::dispatch();
app('queue')->connection()->pop()->fire();
echo Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:325,type:'A',sub:'distributed-unique-lock-store',needs:['Unique jobs','Multi-node deployments','Shared atomic cache locks'],why:'Give independent dispatchers a common lock namespace and atomic store.',docs:['queues#unique-jobs'],ask:'Two web nodes dispatch the same ShouldBeUnique job. Each uses its own local array cache, so both payloads are accepted. Which infrastructure change allows the uniqueness check to coordinate those nodes?',choices:[['Use the same supported shared cache-lock store and key namespace on both nodes.','Separate process-local locks cannot coordinate; the contenders must acquire the same distributed atomic lock.'],['Increase uniqueFor while keeping the two independent array stores.','Longer lifetimes do not make one node aware of the other node’s lock.'],['Put both jobs on the same named queue but retain separate uniqueness stores.','Queue routing alone does not merge the cache locks checked during dispatch.'],['Use different uniqueId values for each web node.','Different keys deliberately prevent the two dispatches from competing for the same lock.']],test:output('both:one',String.raw`class SharedWork
{
    public function uniqueId(): string
    {
        return 'catalog';
    }
}
$a = new Illuminate\Cache\Repository(new Illuminate\Cache\ArrayStore());
$b = new Illuminate\Cache\Repository(new Illuminate\Cache\ArrayStore());
$first = (new Illuminate\Bus\UniqueLock($a))->acquire(new SharedWork());
$second = (new Illuminate\Bus\UniqueLock($b))->acquire(new SharedWork());
echo ($first && $second ? 'both' : 'one').':';
$shared = new Illuminate\Cache\Repository(new Illuminate\Cache\ArrayStore());
$x = (new Illuminate\Bus\UniqueLock($shared))->acquire(new SharedWork());
$y = (new Illuminate\Bus\UniqueLock($shared))->acquire(new SharedWork());
echo $x && ! $y ? 'one' : 'both';`)}),
q({n:326,revision:2,type:'R',sub:'processing-overlap-versus-dispatch-uniqueness',needs:['Job middleware','WithoutOverlapping','Queue dispatch'],why:'Keep payload admission distinct from mutual exclusion while processing.',docs:['queues#preventing-job-overlaps'],ask:'A job uses WithoutOverlapping middleware but does not implement ShouldBeUnique. A developer expects two matching dispatches to create only one queue payload. What is the correction?',choices:[['Both enqueue; the processing middleware checks the lock.','WithoutOverlapping controls concurrent processing, while ShouldBeUnique applies a distinct dispatch-time lock policy.'],['Only one can enqueue because all queue middleware runs before serialization.','Processing middleware is not the general dispatch admission mechanism.'],['Both enqueue and always execute together because middleware cannot use cache locks.','The middleware can prevent overlap through its processing lock.'],['The second dispatch overwrites the first payload in the queue backend.','The middleware does not implement payload replacement in the queue store.']],test:output('2:released:not-handled',queue+String.raw`class LockedWork implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function middleware(): array
    {
        return [(new Illuminate\Queue\Middleware\WithoutOverlapping('catalog'))->releaseAfter(5)];
    }

    public function handle(): void
    {
        app('cache')->put('ran', true);
    }
}
LockedWork::dispatch();
LockedWork::dispatch();
echo Illuminate\Support\Facades\DB::table('jobs')->count().':';
$middleware = new Illuminate\Queue\Middleware\WithoutOverlapping('catalog');
$lock = app('cache')->lock($middleware->getLockKey(new LockedWork()), 60);
$lock->get();
$job = app('queue')->connection()->pop();
$job->fire();
echo ($job->isReleased() ? 'released' : 'not-released').':'.(app('cache')->get('ran') ? 'handled' : 'not-handled');`)}),
q({n:327,type:'D',sub:'shared-overlap-key-across-classes',needs:['WithoutOverlapping keys','Cross-job resource locking'],why:'Remove the class-specific key partition when two job types protect one resource.',docs:['queues#sharing-lock-keys-across-job-classes'],ask:'RebuildReport and DeleteReport each use WithoutOverlapping("report:7"), but they still overlap because their default lock keys include their classes. Which middleware setting makes this resource key common across both classes?',choices:[['->shared()','shared removes the per-class partition so the same resource key identifies the same overlap lock.'],['->releaseAfter(7)','The retry delay does not change which lock key is acquired.'],['->expireAfter(7)','Lock expiration changes lifetime, not cross-class key identity.'],['->dontRelease()','This changes what happens when acquisition fails, not whether both classes contend for one lock.']],test:output('different:same',String.raw`class RebuildReport
{
}
class DeleteReport
{
}
$m = new Illuminate\Queue\Middleware\WithoutOverlapping('report:7');
echo ($m->getLockKey(new RebuildReport()) === $m->getLockKey(new DeleteReport()) ? 'same' : 'different').':';
$m->shared();
echo $m->getLockKey(new RebuildReport()) === $m->getLockKey(new DeleteReport()) ? 'same' : 'different';`)}),
q({n:328,revision:2,type:'A',sub:'overlap-lock-crash-expiration',needs:['Job overlap locks','Worker crash recovery','TTL sizing'],why:'Recover a lock left by an ungraceful process death without expiring it during valid processing.',docs:['queues#preventing-job-overlaps'],ask:'A worker can be killed before its overlap middleware’s finally block releases a lock. Legitimate processing has a measured upper bound. Which setting limits the orphan lock lifetime, with a duration chosen beyond valid processing time?',choices:[['expireAfter on the overlap middleware.','This supplies a lock TTL so an abandoned lock can eventually be acquired again; sizing must avoid expiry during legitimate work.'],['releaseAfter on the overlap middleware.','This delays a job that failed to acquire the lock; it does not expire the lock held by the dead worker.'],['uniqueFor on a ShouldBeUnique job.','uniqueFor controls a dispatch uniqueness lock, not the separate WithoutOverlapping processing lock.'],['dontRelease on the overlap middleware.','This discards a contending job rather than repairing the orphaned lock’s lifetime.']],test:output('180',String.raw`$middleware = (new Illuminate\Queue\Middleware\WithoutOverlapping('report:7'))->expireAfter(180);
echo $middleware->expiresAfter;`)}),
q({n:329,revision:2,type:'E',level:'F',sub:'skip-obsolete-work-success-path',needs:['Queue Skip middleware','Obsolete jobs','Failure classification'],why:'Treat an intentionally unnecessary operation as skipped work rather than a failed attempt.',docs:['queues#skipping-jobs'],ask:'A queued job returns [Skip::when(true)] from middleware(). What happens to its normal handle call and failure state when processed?',choices:[['handle is skipped, and the job is deleted without being marked failed.','Skip short-circuits the processing pipeline; the queued handler then completes normal cleanup rather than invoking failure handling.'],['handle runs once and the result is discarded.','The middleware prevents the downstream handler from being invoked.'],['The job is released repeatedly until the condition becomes false.','Skip does not use release as a waiting mechanism for this condition.'],['The job is marked failed with a maximum-attempts exception.','Intentional skipping does not itself constitute an exhausted-attempt failure.']],test:output('deleted:success:not-handled',queue+String.raw`class ObsoleteWork implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function middleware(): array
    {
        return [Illuminate\Queue\Middleware\Skip::when(true)];
    }

    public function handle(): void
    {
        app('cache')->put('ran', true);
    }
}
ObsoleteWork::dispatch();
$job = app('queue')->connection()->pop();
$job->fire();
echo ($job->isDeleted() ? 'deleted' : 'retained').':'.($job->hasFailed() ? 'failed' : 'success').':'.(app('cache')->get('ran') ? 'handled' : 'not-handled');`)}),
q({n:330,type:'R',sub:'rate-limit-releases-attempt-budget',needs:['Queue rate-limit middleware','Attempt limits','Retry deadlines'],why:'Allow expected quota contention without misclassifying every released reservation as free.',docs:['queues#rate-limiting'],ask:'Many jobs share a one-per-minute limiter. Released jobs consume reservations before their handlers can run, and a low tries limit causes premature failures. Which policy accounts for normal quota contention?',choices:[['Choose sufficient attempts or a retryUntil window that includes expected limiter waits.','Rate-limited releases still count toward attempts; the retry policy must accommodate expected waiting.'],['Keep tries=1 because attempts increase only after handle throws.','Reservations rejected by middleware still contribute to the attempt count.'],['Set the worker sleep value to zero so released jobs no longer count.','Polling frequency does not change the queue’s attempt accounting.'],['Increase job timeout while leaving the retry budget unchanged.','Execution timeout does not enlarge the permitted number or time window of reservations.']],test:output('2:not-handled',queue+String.raw`Illuminate\Support\Facades\RateLimiter::for('exports', fn ($job) => Illuminate\Cache\RateLimiting\Limit::perMinute(1)->by('tenant-7'));
class LimitedWork implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function middleware(): array
    {
        return [new Illuminate\Queue\Middleware\RateLimited('exports')];
    }

    public function handle(): void
    {
        app('cache')->increment('runs');
    }
}
LimitedWork::dispatch();
app('queue')->connection()->pop()->fire();
LimitedWork::dispatch();
$waiting = app('queue')->connection()->pop();
$waiting->fire();
Illuminate\Support\Facades\DB::table('jobs')->update(['available_at' => 0]);
$again = app('queue')->connection()->pop();
$again->fire();
echo $again->attempts().':'.(app('cache')->get('runs') === 1 ? 'not-handled' : 'handled');`)}),
];
