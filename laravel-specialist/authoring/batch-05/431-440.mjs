import {q,file,output} from '../record.mjs';
import {http} from './fixture.mjs';
export default [
q({n:431,type:'E',sub:'cache-tag-order-namespace',needs:['Tagged cache namespaces','Ordered tag lists'],why:'Trace a tagged lookup using a different ordered namespace.',docs:['cache#storing-tagged-cache-items'],assume:['The cache store supports tags and starts empty.'],ask:'What is returned by the second statement?',code:[file(String.raw`use Illuminate\Support\Facades\Cache;

Cache::tags(['tenant:7', 'reports'])->put('summary', 'ready', 60);

echo Cache::tags(['reports', 'tenant:7'])->get('summary', 'missing');`)],choices:[['missing','The ordered tag list contributes to the namespace; reversing it does not retrieve this stored key.'],['ready','This assumes tags are treated as an unordered set for retrieval, which is not this contract.'],['tenant:7','Tags partition the key namespace rather than becoming the stored value.'],['An exception because a tag may appear in only one list.','Tags can be reused; the issue here is lookup namespace ordering.']],test:output('missing')}),
q({n:432,type:'E',sub:'flexible-stale-deferred-refresh',needs:['Stale-while-revalidate','Deferred callbacks','Cache age'],why:'Distinguish the response-visible stale value from the value generated after the response.',docs:['cache#stale-while-revalidate'],assume:['A flexible entry was computed at t=0 with TTL [5, 10]. No other caller refreshes it. At t=6 the request succeeds and the registered deferred callback runs after its response.'],ask:'What does flexible return to the t=6 caller, and when does its recomputation happen?',choices:[['It returns the stored value and schedules recomputation after the response.','Age six is past the fresh window but inside the stale window, so the request can use stale data while refresh is deferred.'],['It blocks the response until recomputation finishes and returns the new value.','That is the behavior for a missing or fully expired entry, not the stated stale window.'],['It returns null because the five-second fresh window has ended.','Ending freshness does not immediately remove the usable stale entry.'],['It returns the stored value and never schedules a refresh before t=10.','A stale-window read schedules refresh rather than waiting for complete expiration.']],test:output('1:1:2',String.raw`use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
Carbon::setTestNow('2026-01-01 00:00:00');
$calls = 0;
$compute = function () use (&$calls) {
    return ++$calls;
};
Cache::flexible('report', [5, 10], $compute);
Carbon::setTestNow('2026-01-01 00:00:06');
echo Cache::flexible('report', [5, 10], $compute).':'.$calls.':';
app(Illuminate\Support\Defer\DeferredCallbackCollection::class)->invoke();
echo Cache::get('report');`)}),
q({n:433,type:'E',sub:'memo-cache-underlying-write-staleness',needs:['Request-local memoization','Underlying cache mutations'],why:'Trace a memoized read after bypassing the memoizing repository for a write.',docs:['cache#cache-memoization'],ask:'In one request, what is printed?',code:[file(String.raw`use Illuminate\Support\Facades\Cache;

Cache::put('price', 10, 60);
$memo = Cache::memo();
$first = $memo->get('price');

Cache::put('price', 20, 60);

echo $first.':'.$memo->get('price').':'.Cache::get('price');`)],choices:[['10:10:20','The memo repository retains its first read; a direct write through the underlying repository does not invalidate that local memo entry.'],['10:20:20','That assumes a direct underlying write automatically clears another repository’s memoized read.'],['20:20:20','The first scalar variable was already assigned before the later write.'],['10:10:10','The underlying cache write succeeds even though the memo repository still has an older value.']],test:output('10:10:20')}),
q({n:434,type:'D',sub:'rate-attempt-false-result-ambiguity',needs:['RateLimiter attempt','Callback return values','Attempt counters'],why:'Avoid treating a business-level false result as proof that rate limiting prevented execution.',docs:['rate-limiting#basic-usage'],ask:'A RateLimiter::attempt callback returns false after performing its operation. The caller also receives false. Does that alone prove the callback was blocked by the limiter?',choices:[['No; false can also be the return value of an executed callback.','attempt propagates non-null callback results, so false is not uniquely evidence of rate-limit rejection.'],['Yes; attempt always converts an executed callback’s return value to true.','Only a null callback result is replaced with true; false is preserved.'],['Yes; a callback returning false is rolled back and its attempt is not counted.','The limiter does not roll back the callback’s effects, and the completed attempt is counted.'],['No; false always means the cache store is unavailable.','The value can arise from ordinary callback logic without a cache outage.']],test:output('false:1:1',String.raw`$ran = 0;
$result = Illuminate\Support\Facades\RateLimiter::attempt('send', 2, function () use (&$ran) {
    $ran++;
    return false;
});
echo json_encode($result).':'.$ran.':'.Illuminate\Support\Facades\RateLimiter::attempts('send');`)}),
q({n:435,type:'T',sub:'array-cache-object-reference-sharing',needs:['PHP object identity','Array cache serialization','Test fidelity'],why:'Explain a test-only mutation that may not model serialized production cache storage.',docs:['cache#configuration'],assume:['The array cache store uses serialize=false.'],ask:'Why can this test read 2 without a second cache write?',code:[file(String.raw`use Illuminate\Support\Facades\Cache;

$item = (object) ['count' => 1];
Cache::put('item', $item, 60);

$item->count = 2;

echo Cache::get('item')->count;`)],choices:[['The unserialized array store retains the same object reference.','Mutating that object changes the in-process value held by this store; a serialized external store need not behave the same way.'],['Cache::put installs an Eloquent observer on every object.','This plain object has no Eloquent persistence observer, and the cache does not install one.'],['Every cache driver rereads the original PHP variable on each get.','External stores cannot hold a live reference to an arbitrary variable in this PHP process.'],['The numeric field expires sooner than the object and is recomputed.','TTL applies to the entry; there is no per-property recomputation in this code.']],test:output('2')}),
q({n:436,type:'E',level:'F',sub:'http-error-response-no-default-throw',needs:['Laravel HTTP client','HTTP status codes'],why:'Distinguish an HTTP response with an error status from an exception policy.',docs:['http-client#error-handling'],assume:['The server returns HTTP 500. No retry or throw behavior has been configured.'],ask:'What happens at this call?',code:[file(String.raw`$response = Illuminate\Support\Facades\Http::get('https://api.example.test/report');
$status = $response->status();`)],choices:[['A response is returned and $status is 500.','The client does not throw for HTTP 4xx/5xx statuses by default; callers can inspect or explicitly throw.'],['A RequestException is always thrown before $status can be assigned.','That requires an explicit throwing policy or applicable retry behavior, absent here.'],['The client retries indefinitely until a 2xx response arrives.','There is no implicit unlimited retry loop for an ordinary get.'],['The client returns null because a 500 response has no usable response object.','Error responses still have a status, headers and potentially a body.']],test:output('500',http+String.raw`Illuminate\Support\Facades\Http::fake(['*' => Illuminate\Support\Facades\Http::response('error', 500)]);
require getcwd().'/probe.php';
echo $status;`)}),
q({n:437,type:'D',sub:'http-connection-failure-no-response',needs:['ConnectionException','HTTP status versus transport failure'],why:'Handle a transport failure that has no HTTP status to inspect.',docs:['http-client#timeout'],ask:'The remote host cannot be reached and no HTTP response is received. With an ordinary Http::get call, which handling strategy covers that failure?',choices:[['Catch ConnectionException separately from checking HTTP response statuses.','A connection failure is represented by an exception because no response status exists to inspect.'],['Check $response->status() === 500 after every connection failure.','A connection failure does not create a server-generated HTTP 500 response object.'],['Use only $response->failed() without catching transport exceptions.','The failed method requires a response and cannot handle a call that throws before returning one.'],['Treat the call as a successful empty response when no throw() was configured.','Default non-throwing HTTP-status behavior does not suppress transport exceptions.']],test:output('connection',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['*' => Http::failedConnection('fixture connection failure')]);
try {
    Http::get('https://api.example.test/report');
} catch (Illuminate\Http\Client\ConnectionException $e) {
    echo 'connection';
}`)}),
q({n:438,type:'E',level:'F',sub:'http-retry-total-attempt-count',needs:['HTTP retry limits','Initial versus repeated attempts'],why:'Count the initial attempt within the retry helper’s maximum.',docs:['http-client#retries'],assume:['Every attempt receives HTTP 503. The caller catches the final RequestException.'],ask:'How many outbound attempts does Http::retry(3, 0)->get($url) make?',choices:[['Three attempts in total.','The first retry argument is the maximum total number of attempts, including the initial one.'],['Four attempts: one initial attempt and three additional retries.','This treats the argument as retries after the initial request rather than the total attempt limit.'],['One attempt because no separate throw() call was added.','retry handles unsuccessful responses without requiring a separate explicit throw call.'],['Three retries after each 503 with no overall limit.','The helper’s configured attempt count is an overall bound, not an endlessly resetting counter.']],test:output('3',http+String.raw`use Illuminate\Support\Facades\Http;
$calls = 0;
Http::fake(function () use (&$calls) {
    $calls++;
    return Http::response('busy', 503);
});
try {
    Http::retry(3, 0)->get('https://api.example.test/report');
} catch (Illuminate\Http\Client\RequestException $e) {
}
echo $calls;`)}),
q({n:439,type:'E',sub:'http-retry-final-status-exception',needs:['HTTP retry defaults','RequestException'],why:'Distinguish retry’s exhausted-response policy from an ordinary unconfigured request.',docs:['http-client#retries'],assume:['Both attempts receive HTTP 503; no custom retry callback is supplied.'],ask:'What is the final outcome of Http::retry(2, 0)->get($url) when throw is left at its default?',choices:[['It throws RequestException after the failed attempts are exhausted.','The retry helper’s default final-failure policy throws even without a separate chained throw method.'],['It returns the last 503 response because ordinary get never throws on statuses.','Adding retry changes the applicable final-failure policy.'],['It returns the first 503 response and never makes the second attempt.','A retryable unsuccessful response leads to another attempt within the configured limit.'],['It throws ConnectionException because every 5xx response is a connection failure.','An HTTP response was received; a status failure is not a missing connection.']],test:output('request:503',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['*' => Http::response('busy', 503)]);
try {
    Http::retry(2, 0)->get('https://api.example.test/report');
} catch (Illuminate\Http\Client\RequestException $e) {
    echo 'request:'.$e->response->status();
}`)}),
q({n:440,type:'D',sub:'http-retry-false-still-connection-exception',needs:['Retry throw option','Transport failures'],why:'Limit the meaning of throw=false to response failures rather than all possible exceptions.',docs:['http-client#retries'],ask:'All attempts fail to connect. Does Http::retry(2, 0, throw: false)->get($url) guarantee a returned response?',choices:[['No; it still throws ConnectionException when no response can be obtained.','Disabling the final HTTP-error exception cannot manufacture a response after transport failures.'],['Yes; it returns a response with status 0 after the last attempt.','Laravel does not turn exhausted connection failures into that synthetic response.'],['Yes; it returns null for the caller to distinguish from a response.','The documented connection-failure path throws rather than returning null.'],['No; throw=false disables retries and exposes only the first connection failure.','The option does not remove the configured attempt loop.']],test:output('connection:2',http+String.raw`use Illuminate\Support\Facades\Http;
$calls = 0;
$failure = Http::failedConnection('isolated failure');
Http::fake(function ($request) use (&$calls, $failure) {
    $calls++;
    return $failure($request);
});
try {
    Http::retry(2, 0, throw: false)->get('https://api.example.test/report');
} catch (Illuminate\Http\Client\ConnectionException $e) {
    echo 'connection:'.$calls;
}`)}),
];
