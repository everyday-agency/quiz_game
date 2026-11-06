import {q,file,output} from '../record.mjs';
import {logging,exceptions} from './fixture.mjs';
import {queue} from '../batch-04/fixture.mjs';
export default [
q({n:511,type:'R',sub:'structured-log-redaction-before-write',needs:['Structured logs','Monolog processors','Secret redaction'],why:'Apply a privacy transformation before records leave the process.',docs:['logging#monolog-channel-customization'],assume:['The sensitive token is present only under the structured context key token, not embedded in the message or exception trace.'],ask:'A channel must retain event names and request IDs but never write token values. Which placement can enforce that policy before formatting and storage?',choices:[['A channel processor that replaces the token context value before handlers format and write it.','A processor can transform the structured record before it is formatted or emitted; the stated field boundary makes targeted redaction sufficient here.'],['Call withoutContext only after the log method returns.','The record has already been sent to its handlers before that later cleanup.'],['Redact token fields only when displaying the log dashboard.','The original storage and transport would still contain the secret.'],['Set the channel level to error and keep the original context unchanged.','Severity filtering does not redact a token on records that pass the filter.']],test:output('[redacted]:r1',logging+String.raw`$monolog->pushProcessor(function (Monolog\LogRecord $record) {
    $context = $record->context;
    if (array_key_exists('token', $context)) {
        $context['token'] = '[redacted]';
    }
    return $record->with(context: $context);
});
$logger->info('request', ['token' => 'fixture-secret', 'request_id' => 'r1']);
$r = $capture->getRecords()[0];
echo $r->context['token'].':'.$r->context['request_id'];`)}),
q({n:512,type:'R',sub:'exception-respond-preserve-protocol-fields',needs:['Rendered exception responses','Response customization','HTTP authentication headers'],why:'Add diagnostic metadata without discarding the response’s existing protocol contract.',docs:['errors#customizing-the-exception-response'],ask:'An exception response is already HTTP 401 with WWW-Authenticate: Bearer. A respond callback only needs to add X-Request-ID. Which implementation preserves the existing authentication contract?',choices:[['Set X-Request-ID on the supplied response and return that response.','Mutating the supplied header bag keeps its status, body and existing challenge header intact.'],['Return response()->json(["request_id" => $id]) with no status or headers copied.','That defaults to a new successful response and discards the authentication challenge.'],['Return response($response->getContent(), 401) and add only X-Request-ID.','Although it retains status and content, it drops the original WWW-Authenticate header.'],['Return redirect("/login")->with("request_id", $id) for every exception.','That replaces the stated HTTP authentication response with a different redirect/session contract.']],test:output('401:Bearer:r1',exceptions+String.raw`$exceptions->respond(function ($response) {
    $response->headers->set('X-Request-ID', 'r1');
    return $response;
});
$request = Illuminate\Http\Request::create('/api', server: ['HTTP_ACCEPT' => 'application/json']);
$e = new Symfony\Component\HttpKernel\Exception\HttpException(401, 'unauthorized', null, ['WWW-Authenticate' => 'Bearer']);
$r = $handler->render($request, $e);
echo $r->getStatusCode().':'.$r->headers->get('WWW-Authenticate').':'.$r->headers->get('X-Request-ID');`)}),
q({n:513,type:'E',sub:'hidden-context-not-log-extra',needs:['Context facade','Hidden diagnostic context','Log processors'],why:'Distinguish context available to application code from context automatically added to logs.',docs:['context#hidden-context'],ask:'Context contains public request_id and hidden internal_flag. With Laravel’s standard context log processor, what is automatically attached to a log record?',choices:[['request_id is included; internal_flag is omitted but remains accessible through hidden-context access.','Hidden context is retained by the repository without being included in the processor’s ordinary log extra data.'],['Both values are logged because hidden applies only to Eloquent serialization.','Context has its own hidden-data facility independent of Eloquent model serialization.'],['Neither value is logged unless each is repeated in the log call.','The standard context processor adds public context automatically.'],['internal_flag is logged as an encrypted string by default.','Hidden context is omitted from ordinary log extras, not automatically encrypted into them.']],test:output('r1:omitted:yes',logging+String.raw`use Illuminate\Support\Facades\Context;
Context::add('request_id', 'r1');
Context::addHidden('internal_flag', 'yes');
$monolog->pushProcessor(new Illuminate\Log\Context\ContextLogProcessor);
$logger->info('event');
$r = $capture->getRecords()[0];
echo $r->extra['request_id'].':'.($r->extra['internal_flag'] ?? 'omitted').':'.Context::getHidden('internal_flag');`)}),
q({n:514,type:'E',sub:'context-scope-restores-prior-state',needs:['Context scopes','Exception cleanup'],why:'Trace temporary metadata across an exceptional exit from a scope.',docs:['context#scoped-context'],ask:'What is printed after the scoped callback throws?',code:[file(String.raw`use Illuminate\Support\Facades\Context;

Context::add('tenant', 'outer');

try {
    Context::scope(function () {
        echo Context::get('tenant').':';
        Context::add('extra', 'temporary');
        throw new RuntimeException('stop');
    }, ['tenant' => 'inner']);
} catch (RuntimeException $e) {
}

echo Context::get('tenant').':'.Context::get('extra', 'missing');`)],choices:[['inner:outer:missing','The scope applies temporary data and restores the previous context in finally, including removal of new scoped keys.'],['inner:inner:temporary','That would leak the callback’s context mutations beyond the scope.'],['outer:outer:missing','The temporary scope data is visible while the callback runs.'],['inner:outer:temporary','Restoration covers the prior data set, not only keys explicitly passed into scope.']],test:output('inner:outer:missing')}),
q({n:515,type:'E',sub:'queued-context-dispatch-snapshot',needs:['Context capture','Queue payloads','Worker lifecycle'],why:'Read the context captured with queued work rather than unrelated context present when a worker starts.',docs:['context#how-it-works'],assume:['The standard ContextServiceProvider is enabled. The job executes through Laravel’s normal worker processing events. No custom dehydration or hydration callbacks modify the data.'],ask:'A job is queued while Context request_id is A. Before that job is processed, the worker’s current context contains B. What request_id does the job receive through normal context hydration?',choices:[['A, the value captured with its queue payload.','The queue payload carries dehydrated dispatch context; JobProcessing hydrates that captured context for execution. It is diagnostic context, not authentication proof.'],['B, because a worker always ignores context stored in queue payloads.','The standard provider explicitly restores captured payload context on JobProcessing.'],['Both A and B concatenated into one string.','Context hydration does not concatenate conflicting scalar values from unrelated work.'],['No request_id, because context cannot cross a queue boundary.','The context subsystem supports capture and restoration across that boundary.']],test:output('A',queue+String.raw`class ContextWork implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;
    public function handle(): void
    {
        app('cache')->put('job-context', Illuminate\Support\Facades\Context::get('request_id'));
    }
}
Illuminate\Support\Facades\Context::add('request_id', 'A');
Illuminate\Support\Facades\Bus::dispatch(new ContextWork);
Illuminate\Support\Facades\Context::flush();
Illuminate\Support\Facades\Context::add('request_id', 'B');
$job = app('queue')->connection('database')->pop();
app('queue.worker')->process('database', $job, new Illuminate\Queue\WorkerOptions);
echo app('cache')->get('job-context');`)}),
q({n:516,type:'I',sub:'exception-level-not-response-status',needs:['Exception log levels','HTTP status independence'],why:'Set operational severity without altering the client’s failure semantics.',docs:['errors#exception-log-levels'],ask:'A plain RuntimeException must remain a normal server-error response but be logged at critical severity. Which exception configuration targets that requirement?',choices:[['$exceptions->level(RuntimeException::class, "critical")','The level mapping controls reporting severity; it does not rewrite the exception’s HTTP status.'],['Return response("critical", 200) from its render callback.','That changes the client response to success rather than setting log severity.'],['Add RuntimeException to dontReport and rely on its 500 status to produce a critical log.','Reporting suppression prevents the ordinary log entry instead of changing its level.'],['Set the channel’s minimum level to critical and leave the exception’s level unchanged.','A threshold can filter out an error-level record; it does not promote that record to critical.']],test:output('Critical:500',exceptions+String.raw`$exceptions->level(RuntimeException::class, 'critical');
$e = new RuntimeException('fixture');
$handler->report($e);
$r = $handler->render(Illuminate\Http\Request::create('/api', server: ['HTTP_ACCEPT' => 'application/json']), $e);
echo $capture->getRecords()[0]->level->name.':'.$r->getStatusCode();`)}),
q({n:517,type:'E',level:'F',sub:'report-helper-does-not-rethrow',needs:['Caught exceptions','report helper','Control flow'],why:'Follow execution after an exception is reported inside its catch block.',docs:['errors#the-report-helper'],assume:['The reporting handler itself succeeds and does not throw.'],ask:'What does this code print?',code:[file(String.raw`try {
    throw new RuntimeException('failed import');
} catch (RuntimeException $e) {
    report($e);
    echo 'handled';
}

echo ':continued';`)],choices:[['handled:continued','The report helper reports the caught exception; it does not rethrow it, so both echo statements run.'],['Nothing, because report always rethrows its argument.','Reporting and rethrowing are separate actions under the stated successful-handler assumption.'],['handled only','No exception is rethrown to prevent the statement after the catch from running.'],['continued without handled','The report call does not skip the rest of the catch block.']],test:output('handled:continued',exceptions+String.raw`require getcwd().'/probe.php';`)}),
q({n:518,type:'E',sub:'rescue-fallback-report-policy',needs:['rescue helper','Exception fallback','Reporting option'],why:'Trace the fallback and reporting policy for the callback’s failure.',docs:['helpers#method-rescue'],ask:'What is the value of $result, and is this caught failure reported by rescue?',code:[file(String.raw`$result = rescue(
    function () {
        throw new RuntimeException('optional lookup failed');
    },
    fn (Throwable $e) => 'unavailable',
    report: false,
);`)],choices:[['unavailable, with no rescue-triggered report.','rescue catches the callback’s Throwable, skips reporting under the explicit flag, and evaluates the fallback with that exception.'],['null, because fallback closures are never called after a failure.','The fallback closure is evaluated on this exception path.'],['unavailable, and the failure is still always reported.','The explicit report=false option disables the helper’s reporting action.'],['The exception escapes because report=false disables catching.','The flag controls reporting, not whether rescue catches callback failures.']],test:output('unavailable:0',exceptions+String.raw`require getcwd().'/probe.php';
echo $result.':'.count($capture->getRecords());`)}),
q({n:519,type:'E',level:'F',sub:'retry-helper-false-is-return-value',needs:['retry helper','Exceptions versus false returns'],why:'Avoid assuming a false business result is an exception-triggered retry.',docs:['helpers#method-retry'],ask:'How many times is the callback invoked, and what does retry return?',code:[file(String.raw`$calls = 0;

$result = retry(3, function () use (&$calls) {
    $calls++;
    return false;
}, 0);

echo $calls.':'.json_encode($result);`)],choices:[['1:false','The retry helper retries thrown failures; an ordinary false return completes the first attempt.'],['3:false','That treats a false return as an exception even though the callback did not throw.'],['1:true','The helper returns the callback’s result rather than coercing successful execution to true.'],['3:true','Neither the extra attempts nor the conversion to true follows from this code.']],test:output('1:false')}),
q({n:520,type:'T',sub:'correlation-id-one-middleware-value',needs:['Middleware','Structured logging','Response diagnostics'],why:'Verify that an identifier given to a client can locate the matching server record.',docs:['logging#contextual-information','middleware#after-middleware'],ask:'A request-diagnostics middleware should put one generated correlation ID in both the log context and the X-Request-ID response header. Which regression check best verifies that link?',choices:[['Capture a request’s log record and response, then assert their identifiers are equal and nonempty.','The diagnostic contract is the identity match across both surfaces, not merely the presence of some value on each.'],['Assert only that the response header is a valid UUID.','A well-formed header can still differ from the identifier written to the log.'],['Assert only that the log message contains the word request.','That does not establish the correlation field or its relationship to the response.'],['Generate two independent UUIDs and assert that both have the expected length.','Two valid but different identifiers break the client-to-log lookup contract.']],test:output('matched',logging+String.raw`$request = Illuminate\Http\Request::create('/report');
$middleware = function ($request, $next) use ($logger) {
    $id = (string) Illuminate\Support\Str::uuid();
    $logger->withContext(['request_id' => $id]);
    $logger->info('request');
    return $next($request)->header('X-Request-ID', $id);
};
$response = $middleware($request, fn ($r) => response('ok'));
$logged = $capture->getRecords()[0]->context['request_id'];
echo $logged !== '' && $logged === $response->headers->get('X-Request-ID') ? 'matched' : 'mismatch';`)}),
];
