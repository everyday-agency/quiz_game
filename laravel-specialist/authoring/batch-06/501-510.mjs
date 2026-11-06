import {q,file,output} from '../record.mjs';
import {logging,exceptions} from './fixture.mjs';
export default [
q({n:501,type:'I',sub:'report-callback-stop-default-logging',needs:['Exception reporting callbacks','Default logging propagation'],why:'Control duplicate reporting without confusing reporting with HTTP rendering.',docs:['errors#reporting-exceptions'],ask:'A custom exception report callback sends a failure to an internal collector. For that exception, the normal Laravel log entry must not also be written. What should the callback return to stop that default reporting path?',choices:[['false','Returning false from the report callback stops propagation to the default logger after the callback’s own action.'],['null','A normal null return allows the default reporting path to continue.'],['true','A true return is not the callback’s stop-propagation sentinel.'],['A JSON response with status 500','Reporting callbacks do not choose the client response; returning a response object is not the false sentinel.']],test:output('1:0',exceptions+String.raw`$sent = 0;
$exceptions->report(function (DomainException $e) use (&$sent) {
    $sent++;
    return false;
});
$handler->report(new DomainException('fixture'));
echo $sent.':'.count($capture->getRecords());`)}),
q({n:502,type:'E',sub:'render-callback-null-fallback',needs:['Exception rendering callbacks','Fallback responses'],why:'Follow rendering when a custom callback elects not to provide a response.',docs:['errors#rendering-exceptions'],ask:'The render callback below does not handle this request path. What happens when a DomainException reaches the handler for /other?',code:[file(String.raw`$exceptions->render(function (DomainException $e, Illuminate\Http\Request $request) {
    if ($request->is('api/special')) {
        return response()->json(['error' => 'special'], 409);
    }

    return null;
});`,'exceptions.php','fragment','Inside withExceptions configuration; $exceptions is the Laravel Exceptions configuration object.')],choices:[['Laravel continues its normal exception rendering.','A null result means this callback did not produce a response, allowing the handler’s fallback path.'],['The handler sends an empty successful HTTP 200 response.','A null callback result is not itself an empty success response.'],['The handler returns the previous request’s cached error response.','Rendering callbacks do not reuse another request’s response as this fallback.'],['The exception is considered handled and the failed controller resumes.','Rendering a failure does not resume execution at the point where the exception escaped.']],test:output('500',exceptions+String.raw`$fragment = getcwd().'/exceptions.php';
file_put_contents($fragment, "<?php\n".file_get_contents($fragment));
require $fragment;
$request = Illuminate\Http\Request::create('/other', server: ['HTTP_ACCEPT' => 'application/json']);
echo $handler->render($request, new DomainException('fixture'))->getStatusCode();`)}),
q({n:503,type:'E',sub:'dontreport-not-http-success',needs:['Exception reporting','HTTP exception rendering'],why:'Separate observability policy from the failure response contract.',docs:['errors#ignoring-exceptions-by-type'],assume:['The exception is a plain RuntimeException, debug is disabled, and no custom renderer is registered.'],ask:'RuntimeException is added to dontReport. If one escapes a controller, does this make the request successful?',choices:[['No; reporting is skipped, but the normal failure response is still rendered.','dontReport controls reporting, not whether a failed controller invocation becomes a success.'],['Yes; suppressing its report converts the request to HTTP 200.','A reporting exclusion does not set a successful response status.'],['Yes; Laravel resumes the controller immediately after the throw.','The controller’s exception unwind is not reversed by an observability setting.'],['No; dontReport changes the response to HTTP 404 for every exception type.','The method does not impose a not-found rendering policy either.']],test:output('0:500',exceptions+String.raw`$exceptions->dontReport([RuntimeException::class]);
$e = new RuntimeException('fixture');
$handler->report($e);
$request = Illuminate\Http\Request::create('/broken', server: ['HTTP_ACCEPT' => 'application/json']);
echo count($capture->getRecords()).':'.$handler->render($request, $e)->getStatusCode();`)}),
q({n:504,type:'I',level:'F',sub:'exception-structured-domain-context',needs:['Custom exceptions','Structured log context'],why:'Supply searchable domain metadata without hiding it in prose or exposing unrelated secrets.',docs:['errors#exception-log-context'],ask:'A custom import exception should add import_id=42 to its reported log context. Which class method is intended to supply that structured data?',choices:[['context(): array returning ["import_id" => 42]','Laravel merges an exception’s context array into the reporting context.'],['render() returning ["import_id" => 42]','render controls an HTTP representation rather than supplying report metadata.'],['getCode() returning the complete associative array','Exception codes are not arbitrary context arrays and have a different API contract.'],['__toString() appending a JSON object to the exception text','Text formatting is not the dedicated structured context method and makes the metadata harder to handle consistently.']],test:output('42',exceptions+String.raw`class ImportFailure extends RuntimeException
{
    public function context(): array
    {
        return ['import_id' => 42];
    }
}
$handler->report(new ImportFailure('import failed'));
echo $capture->getRecords()[0]->context['import_id'];`)}),
q({n:505,type:'E',sub:'duplicate-report-instance-identity',needs:['Exception object identity','Duplicate report suppression'],why:'Distinguish re-reporting one object from separately created failures with identical messages.',docs:['errors#deduplicating-reported-exceptions'],ask:'With dontReportDuplicates enabled and no other suppression, how many normal report entries do these calls produce?',code:[file(String.raw`$first = new RuntimeException('same message');

report($first);
report($first);
report(new RuntimeException('same message'));`)],choices:[['Two.','The repeated instance is suppressed, while a new exception object is a separate report even with identical text.'],['One.','This would require deduplication by message text rather than by exception instance.'],['Three.','That ignores the enabled suppression of re-reporting the same object.'],['Zero.','Duplicate suppression does not suppress every first report of a failure.']],test:output('2',exceptions+String.raw`$exceptions->dontReportDuplicates();
require getcwd().'/probe.php';
echo count($capture->getRecords());`)}),
q({n:506,type:'E',level:'F',sub:'log-level-minimum-threshold',needs:['PSR log severity','Channel thresholds'],why:'Interpret a minimum log level as a severity range rather than an exact match.',docs:['logging#log-levels'],ask:'A channel’s minimum level is warning. Which of debug, info, warning and error messages pass that threshold?',choices:[['warning and error','The minimum admits that severity and more severe entries, while excluding lower levels.'],['warning only','A minimum threshold is not an exact-level equality filter.'],['debug and info','Those are less severe than warning and are excluded.'],['All four because level is only a label on the output','The channel level affects which records its handler accepts.']],test:output('warning,error',String.raw`$capture = new Monolog\Handler\TestHandler(Monolog\Level::Warning);
$logger = new Illuminate\Log\Logger(new Monolog\Logger('fixture', [$capture]));
foreach (['debug', 'info', 'warning', 'error'] as $level) {
    $logger->log($level, $level);
}
echo implode(',', array_map(fn ($r) => $r->message, $capture->getRecords()));`)}),
q({n:507,type:'E',sub:'log-entry-context-overrides-channel-key',needs:['Channel context','Per-entry context','Duplicate keys'],why:'Resolve context precedence for one entry without mutating the channel’s stored value.',docs:['logging#contextual-information'],ask:'What tenant values appear in these two records?',code:[file(String.raw`$logger->withContext(['tenant' => 'A']);
$logger->info('first', ['tenant' => 'B']);
$logger->info('second');`,'logging.php','fragment','The logger is a fresh Illuminate Log Logger with a recording handler.')],choices:[['B, then A.','Entry context overrides a duplicate key for that record; it does not replace the channel context used by the next record.'],['A, then A.','This gives the channel context precedence over an explicitly supplied per-entry value.'],['B, then B.','This incorrectly treats the entry-specific override as a permanent channel-context mutation.'],['Both records contain an array [A, B] under tenant.','The context merge replaces a duplicate string key rather than collecting all its values.']],test:output('B:A',logging+String.raw`$path = getcwd().'/logging.php';
file_put_contents($path, "<?php\n".file_get_contents($path));
require $path;
echo $capture->getRecords()[0]->context['tenant'].':'.$capture->getRecords()[1]->context['tenant'];`)}),
q({n:508,type:'I',sub:'logger-clear-unrelated-work-context',needs:['Logger context lifetime','Long-lived application work'],why:'Prevent one unit of work’s metadata from contaminating later entries on the same logger.',docs:['logging#contextual-information'],assume:['This is one Illuminate Log Logger instance. It has channel context from withContext, not global Context-facade data.'],ask:'After finishing tenant-specific work, the same logger will serve unrelated work. Which operation removes the channel context before those later entries?',choices:[['$logger->withoutContext()','The method clears that logger’s stored channel context.'],['$logger->info("next", [])','An empty entry context does not erase the logger’s stored context.'],['$logger->withContext([])','Merging an empty context leaves existing keys unchanged.'],['$logger->info("next", ["tenant" => null])','This overrides tenant only on that entry and does not clear other stored keys or future entries.']],test:output('0',logging+String.raw`$logger->withContext(['tenant' => 'A']);
$logger->withoutContext();
$logger->info('next');
echo count($capture->getRecords()[0]->context);`)}),
q({n:509,type:'I',sub:'shared-log-context-future-channels',needs:['LogManager channels','Shared context'],why:'Propagate one correlation field beyond the currently selected channel.',docs:['logging#contextual-information'],ask:'A correlation ID should be available on all logging channels, including channels first resolved later in this request. Which Log facade operation is designed for that scope?',choices:[['Log::shareContext(["request_id" => $id])','The manager stores shared context and applies it to existing and subsequently resolved channels.'],['Log::channel("single")->withContext(["request_id" => $id])','That targets one logger rather than all future channels.'],['Log::info("start", ["request_id" => $id])','Per-entry context is attached only to that record.'],['Log::channel("single")->info("start", ["request_id" => $id])','Selecting a channel and adding entry context does not establish shared context for others.']],test:output('r1',String.raw`config(['logging.channels.later' => [
    'driver' => 'single',
    'path' => storage_path('logs/later.log'),
]]);
Illuminate\Support\Facades\Log::shareContext(['request_id' => 'r1']);
$channel = Illuminate\Support\Facades\Log::channel('later');
$channel->info('event');
echo str_contains(file_get_contents(storage_path('logs/later.log')), '"request_id":"r1"') ? 'r1' : 'missing';`)}),
q({n:510,type:'R',sub:'log-stack-ignore-channel-exceptions',needs:['Log stacks','Handler failures','Observability failure policy'],why:'Choose an explicit exception policy for logging without assuming every stack automatically isolates handler failures.',docs:['logging#building-log-stacks'],ask:'An optional remote logging handler may throw. The team wants the stack to attempt its other handlers and not fail the application call because that optional handler failed. Which stack setting expresses this policy?',choices:[['Set ignore_exceptions to true for that stack.','The stack wraps handlers in a group that suppresses handler failures and continues handling. This policy also means those failures need separate operational monitoring.'],['Set every channel’s level to debug.','Severity thresholds do not control exception propagation from a handler.'],['Leave ignore_exceptions false and assume a stack always suppresses handler errors.','The explicit setting changes whether handler exceptions are swallowed.'],['Set bubble=false on the failing handler and expect exceptions to become successful writes.','Bubbling governs record propagation; it does not by itself convert a thrown handler failure into success.']],test:output('propagated:continued',String.raw`$bad = new class extends Monolog\Handler\AbstractProcessingHandler
{
    protected function write(Monolog\LogRecord $record): void
    {
        throw new RuntimeException('optional sink unavailable');
    }
};
$good = new Monolog\Handler\TestHandler;
app('log')->extend('broken-probe', fn () => new Monolog\Logger('bad', [$bad]));
app('log')->extend('good-probe', fn () => new Monolog\Logger('good', [$good]));
config([
    'logging.channels.bad' => ['driver' => 'broken-probe'],
    'logging.channels.good' => ['driver' => 'good-probe'],
    'logging.channels.strict' => ['driver' => 'stack', 'channels' => ['bad', 'good'], 'ignore_exceptions' => false],
    'logging.channels.tolerant' => ['driver' => 'stack', 'channels' => ['bad', 'good'], 'ignore_exceptions' => true],
]);
try {
    app('log')->channel('strict')->error('first');
} catch (RuntimeException $e) {
    echo 'propagated:';
}
app('log')->channel('tolerant')->error('second');
echo count($good->getRecords()) === 1 ? 'continued' : 'unexpected';`)}),
];
