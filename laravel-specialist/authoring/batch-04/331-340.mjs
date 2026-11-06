import {q,file,output,contract} from '../record.mjs';
import {queue,marker,batches} from './fixture.mjs';
export default [
q({n:331,revision:2,type:'E',level:'F',sub:'chain-failure-stops-successors',needs:['Job chains','Unhandled failures'],why:'Trace sequential dependencies rather than treating a chain as independent batch work.',docs:['queues#job-chaining'],ask:'A chain contains Prepare, Render and Publish. Prepare succeeds. Render throws and is ultimately marked failed without a recovery dispatch. Which normal chain behavior follows?',choices:[['Publish is not dispatched by the chain.','The queued handler dispatches the next chained job only after successful processing of the current one.'],['Publish runs immediately because the chain was fully enqueued at the start.','The normal chain advances one successful step at a time rather than queueing every successor independently.'],['Prepare is automatically rolled back even though it already completed.','A chain is not a distributed transaction that undoes earlier job side effects.'],['Publish runs before Render is retried so the chain can finish sooner.','A successor does not bypass the failure of its prerequisite.']],test:output('prepare,render:0',queue+String.raw`class ChainStep implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function __construct(public string $name)
    {
    }

    public function handle(): void
    {
        app('cache')->put('trace', [...app('cache')->get('trace', []), $this->name]);
        if ($this->name === 'render') {
            throw new RuntimeException('render failed');
        }
    }
}
Illuminate\Support\Facades\Bus::chain([new ChainStep('prepare'), new ChainStep('render'), new ChainStep('publish')])->dispatch();
app('queue')->connection()->pop()->fire();
$job = app('queue')->connection()->pop();
try {
    $job->fire();
} catch (RuntimeException $e) {
    $job->fail($e);
}
echo implode(',', app('cache')->get('trace')).':'.Illuminate\Support\Facades\DB::table('jobs')->count();`)}),
q({n:332,revision:2,type:'D',sub:'chain-no-automatic-return-passing',needs:['Job chains','Serialized constructor inputs','Handler return values'],why:'Define durable data transfer explicitly between independently serialized jobs.',docs:['queues#job-chaining'],ask:'The first chained job returns a generated report ID from handle(). The second job expects that return value to appear automatically in its constructor input. Why is that design incomplete?',choices:[['Chains order jobs but do not pass handle return values.','Successors are serialized jobs with their own inputs. Persist shared state or explicitly construct subsequent work with the needed identifier.'],['The report ID is automatically passed, but only if it is a string.','There is no built-in return-value pipeline restricted to string results.'],['The report ID is passed only when both jobs use the same queue name.','Queue routing does not turn a handler return into another job’s constructor argument.'],['The constructor runs again with the previous result only after a failed attempt.','Retry does not establish this automatic data-transfer contract either.']],test:output('unset',queue+String.raw`class BuildReport implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function handle(): int
    {
        return 71;
    }
}
class DeliverReport implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function __construct(public ?int $reportId = null)
    {
    }

    public function handle(): void
    {
        echo $this->reportId ?? 'unset';
    }
}
Illuminate\Support\Facades\Bus::chain([new BuildReport(), new DeliverReport()])->dispatch();
app('queue')->connection()->pop()->fire();
app('queue')->connection()->pop()->fire();`)}),
q({n:333,revision:2,type:'I',level:'F',sub:'append-current-job-chain',needs:['Queueable chain operations','Dynamic follow-up work'],why:'Preserve the current chain’s ordering while adding work discovered during its handler.',docs:['queues#adding-jobs-to-the-chain'],ask:'While running the first job in a chain, the handler discovers a final cleanup job that must run after the already chained steps. Which operation adds it to that same chain?',choices:[['$this->appendToChain(new Cleanup());','appendToChain places the serialized job after the remaining chained work.'],['Cleanup::dispatch();','An independent dispatch is not ordered after the remaining chain steps.'],['$this->prependToChain(new Cleanup());','Prepending schedules cleanup before the remaining chain, contrary to the requirement.'],['$this->chain([new Cleanup()]);','Replacing the chain with a new list can discard the previously chained steps rather than appending.']],test:output('first,middle,cleanup',queue+String.raw`class Step implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function __construct(public string $name)
    {
    }

    public function handle(): void
    {
        app('cache')->put('trace', [...app('cache')->get('trace', []), $this->name]);
        if ($this->name === 'first') {
            $this->appendToChain(new Step('cleanup'));
        }
    }
}
Illuminate\Support\Facades\Bus::chain([new Step('first'), new Step('middle')])->dispatch();
while ($job = app('queue')->connection()->pop()) {
    $job->fire();
}
echo implode(',', app('cache')->get('trace'));`)}),
q({n:334,type:'E',sub:'batch-finally-versus-then',needs:['Job batch callbacks','Allowed failures','Completion state'],why:'Separate all-success continuation from notification that all jobs have been accounted for.',docs:['queues#dispatching-batches','queues#batch-failures'],ask:'A two-job batch uses allowFailures(). One job fails permanently and the other succeeds. It has then and finally callbacks. Which callback outcome is expected when both jobs have been accounted for?',choices:[['finally runs; then does not.','finally handles completion even with an allowed failure, while then requires the all-success condition.'],['then and finally both run because allowFailures makes failures count as successes.','Allowing failures prevents automatic cancellation; it does not convert a failed job into success for then.'],['Neither callback runs because any failed job disables all callbacks.','Completion/finalization still occurs for an allowed-failure batch.'],['then runs; finally is reserved for cancelled batches.','finally is not limited to cancellation, and then is not the failure-completion callback.']],test:output('finally',queue+batches+String.raw`$batch = Illuminate\Support\Facades\Bus::batch([new BatchWork(true), new BatchWork()])
    ->allowFailures()
    ->then(function ($batch) {
        app('cache')->put('then-ran', true);
    })
    ->finally(function ($batch) {
        app('cache')->put('finally-ran', true);
    })
    ->dispatch();
$failed = app('queue')->connection()->pop();
try {
    $failed->fire();
} catch (RuntimeException $e) {
    $failed->fail($e);
}
app('queue')->connection()->pop()->fire();
echo (app('cache')->get('then-ran') ? 'then,' : '').(app('cache')->get('finally-ran') ? 'finally' : 'none');`)}),
q({n:335,revision:3,type:'I',level:'F',sub:'batch-allow-failures-no-auto-cancel',needs:['Batch failure policy','Independent work items'],why:'Allow unrelated work to continue while retaining accurate failure records.',docs:['queues#allowing-failures'],ask:'A batch imports independent tenant files. One bad file should be recorded as failed without automatically cancelling the remaining imports. Which batch option expresses that policy?',choices:[['allowFailures()','This prevents automatic batch cancellation on a job failure while preserving the failure count.'],['catch($callback) without allowFailures()','A failure callback can observe the failure but does not itself disable the default cancellation policy.'],['onQueue("independent")','A queue name does not alter how the batch reacts to a failed job.'],['Increase every job’s tries while retaining the default batch failure policy.','A permanently invalid file can still exhaust its attempts and trigger default batch cancellation.']],test:output('active:1',queue+batches+String.raw`$batch = Illuminate\Support\Facades\Bus::batch([new BatchWork(true), new BatchWork()])->allowFailures()->dispatch();
$job = app('queue')->connection()->pop();
try {
    $job->fire();
} catch (RuntimeException $e) {
    $job->fail($e);
}
$state = $batch->fresh();
echo ($state->cancelled() ? 'cancelled' : 'active').':'.$state->failedJobs;`)}),
q({n:336,revision:2,type:'R',sub:'batch-cancellation-cooperative-check',needs:['Batch cancellation','Queued jobs','Cooperative stopping'],why:'Make cancellation affect actual job behavior instead of treating a metadata flag as a process kill.',docs:['queues#cancelling-batches'],ask:'A user cancels a batch while some jobs are waiting and another is doing a long loop. Which implementation makes the cancellation meaningful for the work itself?',choices:[['Check cancellation before work and at safe loop checkpoints.','Cancellation records state; handlers need cooperative checks to avoid or stop work at safe boundaries.'],['Rely on cancel() to terminate every active PHP worker immediately.','Batch cancellation is not an operating-system process-kill mechanism.'],['Assume cancel() deletes every queued payload from every supported backend.','The metadata operation does not guarantee physical removal of all already queued jobs.'],['Set tries=1 and assume cancellation is then checked automatically.','An attempt budget does not perform the missing cancellation checks inside a running or waiting job.']],test:output('skipped',queue+batches+String.raw`class CooperativeWork extends BatchWork
{
    public function handle(): void
    {
        if ($this->batch()?->cancelled()) {
            echo 'skipped';

            return;
        }
        echo 'worked';
    }
}
$batch = Illuminate\Support\Facades\Bus::batch([new CooperativeWork()])->dispatch();
$batch->cancel();
app('queue')->connection()->pop()->fire();`)}),
q({n:337,revision:2,type:'T',level:'F',sub:'bus-fake-not-handler-execution',needs:['Laravel Bus fake','Unit versus dispatch tests'],why:'Use separate evidence for enqueue intent and actual business side effects.',docs:['mocking#bus-fake','queues#testing'],ask:'A test calls Bus::fake(), triggers a controller and successfully asserts that BuildExport was dispatched. It then claims the export file was generated correctly. What evidence is still missing?',choices:[['A handler test that runs the job and checks its generated output.','The fake records dispatch intent and normally prevents actual handler execution, so it cannot establish file-generation behavior.'],['Another assertion that BuildExport was dispatched once using the same fake.','A more specific dispatch count still does not execute or inspect the handler’s output.'],['An assertion that the fake has no pending queue rows in the database.','The absence of real queue rows under a fake does not prove the export logic worked.'],['A longer timeout for the fake to finish the handler asynchronously.','The fake is not a background worker that eventually runs the intercepted job.']],test:output('recorded:not-handled',marker+String.raw`Illuminate\Support\Facades\Bus::fake();
Illuminate\Support\Facades\Bus::dispatch(new MarkWork());
Illuminate\Support\Facades\Bus::assertDispatched(MarkWork::class);
echo 'recorded:'.(app('cache')->get('handled') ? 'handled' : 'not-handled');`)}),
q({n:338,revision:2,type:'T',level:'F',sub:'assert-pushed-on-intended-queue',needs:['Queue fake','Queue-specific assertions'],why:'Catch a routing regression that a job-type-only assertion misses.',docs:['queues#testing'],ask:'A dispatch regression sends ImportRows to default instead of imports. The test already uses Queue::fake(). Which assertion directly detects this routing error?',choices:[['Queue::assertPushedOn("imports", ImportRows::class);','This checks the recorded queue name together with the expected job class.'],['Queue::assertPushed(ImportRows::class);','A type-only assertion passes even if the job went to the wrong queue.'],['Queue::assertCount(1);','A total count does not identify the queue used by that job.'],['Bus::assertDispatchedSync(ImportRows::class);','This tests synchronous bus dispatch, a different behavior from the asynchronous queue routing requirement.']],test:output('imports',marker+String.raw`Illuminate\Support\Facades\Queue::fake();
Illuminate\Support\Facades\Bus::dispatch((new MarkWork())->onQueue('imports'));
Illuminate\Support\Facades\Queue::assertPushedOn('imports', MarkWork::class);
echo 'imports';`)}),
q({n:339,revision:3,type:'D',sub:'long-lived-worker-code-restart',needs:['Queue worker lifecycle','Deployment','Process supervision'],why:'Reload application code by replacing long-lived workers after a release.',docs:['queues#queue-workers-and-deployment'],ask:'Web requests use the new release, but existing queue:work processes still execute old handler code. Which deployment step refreshes those workers while allowing current jobs to finish normally?',choices:[['Use queue:restart with supervised worker replacement.','Workers retain their booted application; the restart signal is observed between jobs and fresh processes load the new code.'],['Restart PHP-FPM for web traffic but leave the queue worker processes running.','Replacing web-serving PHP processes does not reload the separate queue workers.'],['Rebuild the route cache while retaining every existing queue worker process.','A route-cache file change does not recreate the worker’s already loaded handler code.'],['Run config:cache and assume existing workers re-bootstrap before every job.','Long-lived workers do not rebuild the application for each job merely because a cache file changed.']],test:contract('Illuminate/Queue/Worker.php',['protected function queueShouldRestart','getTimestampOfLastQueueRestart'],'The worker compares a cache restart timestamp between jobs. Graceful exit and supervisor replacement are operational deployment behavior, not a spawned-daemon test.')}),
q({n:340,type:'A',sub:'worker-lifetime-bounds-and-supervision',needs:['Long-lived workers','Memory growth','Process supervision'],why:'Bound accumulated process state while maintaining service through replacement workers.',docs:['queues#processing-a-specified-number-of-jobs','queues#processing-jobs-for-a-given-number-of-seconds'],ask:'A third-party parser leaves process-local memory behind after each job. The leak is being repaired, but workers need a temporary bounded lifetime without abandoning successfully completed work. Which operational arrangement fits?',choices:[['Use --max-jobs or --max-time with supervision that replaces exited workers.','These limits let workers exit between jobs, bounding accumulated state while a supervisor restores capacity.'],['Use --tries as a limit on the total number of different jobs a worker processes.','tries is a per-job attempt policy, not a lifetime job-count bound for the worker process.'],['Use --sleep to release all parser memory between jobs.','Sleeping does not recreate the PHP process or reliably free retained application state.'],['Start queue:work once with a lifetime limit and no restart mechanism for a permanent queue service.','The worker will eventually exit and leave the service without processing capacity.']],test:contract('Illuminate/Queue/Worker.php',['$options->maxJobs && $this->jobsProcessed >= $options->maxJobs','$options->maxTime && $this->currentTime() - $startTime >= $options->maxTime'],'Worker lifetime limits are evaluated in the stop conditions. This source contract does not claim a live supervisor or measure parser memory.')}),
];
