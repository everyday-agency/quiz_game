import {q,file,output,contract} from '../record.mjs';
import {http} from './fixture.mjs';
export default [
q({n:441,type:'T',sub:'http-prevent-stray-requests',needs:['HTTP fakes','Unexpected outbound requests'],why:'Make missing stubs fail locally instead of escaping to a real integration.',docs:['http-client#preventing-stray-requests'],ask:'A test fakes api.example.test/orders, but a regression sends to a different URL. Which setup makes any unmatched request fail instead of using a real transport?',choices:[['Call Http::preventStrayRequests() alongside the specific fake.','The client rejects requests not covered by a fake when stray requests are prevented.'],['Add a catch-all fake returning HTTP 200.','That blocks network traffic but lets an incorrect destination appear successful instead of failing.'],['Set timeout(1) and leave unmatched URLs unfaked.','A short timeout still permits a real outbound attempt.'],['Assert only that the application’s response status is 200.','An application-level status does not prevent an unexpected outbound request.']],test:output('blocked',http+String.raw`use Illuminate\Support\Facades\Http;
Http::preventStrayRequests();
Http::fake(['https://api.example.test/orders' => Http::response([], 200)]);
try {
    Http::get('https://other.example.test/orders');
} catch (Illuminate\Http\Client\StrayRequestException $e) {
    echo 'blocked';
}`)}),
q({n:442,type:'E',level:'F',sub:'http-sequence-exhaustion',needs:['HTTP fake sequences','Repeated calls'],why:'Account for exhaustion rather than assuming the last stub repeats indefinitely.',docs:['http-client#faking-response-sequences'],ask:'A fake sequence has one response and no whenEmpty fallback. What happens on the second matching request?',choices:[['The exhausted sequence throws an exception.','A sequence fails when consumed unless an explicit empty-sequence behavior is configured.'],['It repeats the last response indefinitely.','Repeating a fallback requires explicit configuration; it is not the default exhaustion behavior.'],['It starts again at the first response automatically.','The response queue is consumed rather than cycled.'],['It returns a fresh real response from the remote host.','Sequence exhaustion is an error, not a deliberate fallback to the network.']],test:output('exhausted',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['*' => Http::sequence()->push('one', 200)]);
Http::get('https://api.example.test/report');
try {
    Http::get('https://api.example.test/report');
} catch (OutOfBoundsException $e) {
    echo 'exhausted';
}`)}),
q({n:443,type:'I',level:'F',sub:'http-form-request-encoding',needs:['JSON versus form encoding','HTTP client POST'],why:'Match a legacy endpoint’s body format rather than changing only response preferences.',docs:['http-client#sending-form-url-encoded-requests'],ask:'A legacy endpoint accepts application/x-www-form-urlencoded fields, not JSON. Which request sends the array in the required format?',choices:[['Http::asForm()->post($url, ["name" => "Ada"])','asForm selects form-encoded request data.'],['Http::acceptJson()->post($url, ["name" => "Ada"])','acceptJson requests a JSON response; it does not switch the request body to form encoding.'],['Http::post($url, ["name" => "Ada"])','An ordinary array POST uses JSON encoding by default.'],['Http::asJson()->post($url, ["name" => "Ada"])','asJson explicitly chooses the format the endpoint rejects.']],test:output('application/x-www-form-urlencoded:name=Ada',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(function ($request) {
    echo $request->header('Content-Type')[0].':'.$request->body();
    return Http::response('', 200);
});
Http::asForm()->post('https://api.example.test/form', ['name' => 'Ada']);`)}),
q({n:444,type:'D',sub:'http-header-merge-versus-replace',needs:['HTTP header values','PendingRequest mutation'],why:'Replace one conflicting header value while retaining unrelated headers.',docs:['http-client#headers'],ask:'A pending request already has X-Mode: old and X-Trace: abc. It must send only new as X-Mode while retaining X-Trace. Which update fits Laravel 13.40’s header behavior?',choices:[['$request->replaceHeaders(["X-Mode" => "new"])','replaceHeaders replaces the supplied header’s value while retaining other header keys.'],['$request->withHeaders(["X-Mode" => "new"])','withHeaders recursively merges values and can preserve old alongside new for the same key.'],['$request->withHeaders(["X-Mode" => ["old", "new"]])','This explicitly retains both values rather than sending only new.'],['$request->withHeaders(["X-Trace" => "new"])','This changes the unrelated tracing header and leaves X-Mode unchanged.']],test:output('old,new:abc|new:abc',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(function ($request) {
    echo implode(',', $request->header('X-Mode')).':'.$request->header('X-Trace')[0];
    return Http::response('', 200);
});
Http::withHeaders(['X-Mode' => 'old', 'X-Trace' => 'abc'])
    ->withHeaders(['X-Mode' => 'new'])->get('https://api.example.test/a');
echo '|';
Http::withHeaders(['X-Mode' => 'old', 'X-Trace' => 'abc'])
    ->replaceHeaders(['X-Mode' => 'new'])->get('https://api.example.test/b');`)}),
q({n:445,type:'I',sub:'http-connect-versus-total-timeout',needs:['Connection establishment','HTTP total timeout','Transport support'],why:'Configure distinct budgets for connecting and waiting for the complete response.',docs:['http-client#timeout'],assume:['The production transport supports the configured connect-timeout option.'],ask:'The integration allows at most two seconds to establish a connection and ten seconds for the request overall. Which configuration expresses those separate limits?',choices:[['Http::connectTimeout(2)->timeout(10)','connectTimeout sets the connection-establishment budget; timeout bounds the overall request duration.'],['Http::timeout(2)->connectTimeout(10)','This reverses the requested budgets.'],['Http::timeout(10)->timeout(2)','The second call replaces the overall timeout rather than configuring a distinct connection timeout.'],['Http::connectTimeout(2)->retry(10, 0)','A retry count is not a ten-second total request timeout.']],test:output('2:10',http+String.raw`$options = Illuminate\Support\Facades\Http::connectTimeout(2)->timeout(10)->getOptions();
echo $options['connect_timeout'].':'.$options['timeout'];`)}),
q({n:446,type:'I',level:'F',sub:'http-bearer-token-header',needs:['Bearer authentication','Authorization header'],why:'Send a credential in the header expected by the remote API.',docs:['http-client#bearer-tokens'],ask:'The remote API expects Authorization: Bearer <token>. Which request matches that contract?',choices:[['Http::withToken($token)->get($url)','withToken places the credential in the Authorization header with the default Bearer scheme.'],['Http::get($url, ["token" => $token])','That sends a query parameter, which is not the stated Authorization header contract.'],['Http::withBasicAuth($token, "")->get($url)','Basic authentication uses a different scheme and encoded username/password representation.'],['Http::withHeaders(["Bearer" => $token])->get($url)','Bearer is the authorization scheme, not the required header name.']],test:output('Bearer secret',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(function ($request) {
    echo $request->header('Authorization')[0];
    return Http::response('', 200);
});
Http::withToken('secret')->get('https://api.example.test/report');`)}),
q({n:447,type:'I',level:'F',sub:'http-basic-auth-credential-encoding',needs:['HTTP Basic authentication','Credential encoding','HTTPS'],why:'Produce the correct authentication scheme rather than a plaintext or bearer substitute.',docs:['http-client#authentication'],assume:['The endpoint uses HTTPS and explicitly requires HTTP Basic authentication.'],ask:'Which setup sends username alice and password secret using that scheme?',choices:[['Http::withBasicAuth("alice", "secret")','The client constructs the Basic credential representation from the supplied username and password. HTTPS is still required for confidentiality.'],['Http::withToken("alice:secret")','That selects Bearer authentication instead of Basic.'],['Http::withHeaders(["Authorization" => "Basic alice:secret"])','Basic credentials use an encoded username:password value, not this plaintext header form.'],['Http::withHeaders(["username" => "alice", "password" => "secret"])','Those arbitrary headers do not satisfy the standard Authorization scheme.']],test:output('Basic YWxpY2U6c2VjcmV0',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(function ($request) {
    echo $request->header('Authorization')[0];
    return Http::response('', 200);
});
Http::withBasicAuth('alice', 'secret')->get('https://api.example.test/report');`)}),
q({n:448,type:'R',sub:'http-retry-refresh-rejected-token',needs:['Status-specific retry callbacks','PendingRequest authentication','Token refresh'],why:'Change the next attempt’s credential only for the failure that warrants refresh.',docs:['http-client#retries'],assume:['A trusted local refresh function can provide a new token. Retry budget permits one further attempt.'],ask:'An authenticated request receives 401 because its token expired. Which retry callback policy changes the next request appropriately without treating every failure as an expired token?',choices:[['Check for RequestException with status 401, refresh the pending request’s token, then allow retry.','The callback receives the pending request and can update its credential for the next attempt while filtering by the relevant failure.'],['Return true for every exception but leave the pending request’s token unchanged.','That retries the same rejected credential and does not perform the required refresh.'],['Refresh a separate newly created request object but retry the original unchanged request.','Changing an unrelated request does not update the request being retried.'],['Treat every 5xx response as proof that the user’s access token expired.','Server errors do not uniquely indicate a rejected credential.']],test:output('Bearer old:Bearer new:200',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(function ($request) {
    $token = $request->header('Authorization')[0];
    echo $token.':';
    return Http::response('', $token === 'Bearer old' ? 401 : 200);
});
$response = Http::withToken('old')->retry(2, 0, function ($e, $request) {
    if (! $e instanceof Illuminate\Http\Client\RequestException || $e->response->status() !== 401) {
        return false;
    }
    $request->withToken('new');
    return true;
})->get('https://api.example.test/report');
echo $response->status();`)}),
q({n:449,type:'E',level:'F',sub:'http-pool-named-response-keys',needs:['HTTP request pools','Named results'],why:'Select a pooled response by its stable alias instead of completion order.',docs:['http-client#concurrent-requests'],ask:'A pool registers requests with $pool->as("inventory") and $pool->as("prices"). After the pool completes, how should the inventory response be selected?',choices:[['$responses["inventory"]','A named pool keeps the alias as the corresponding result key.'],['$responses[0], because inventory must finish first.','Network completion order is not guaranteed, and an aliased result is addressed by its named key.'],['$responses["prices"], because keys identify the next request in the pool.','The alias identifies its own request, not another request’s successor.'],['$responses->inventory(), because pool returns a response service object.','The result is a keyed response array, not a generated method-based service.']],test:contract('Illuminate/Http/Client/PendingRequest.php',['$results[$key] = $result;'],'The pool result loop preserves request keys. Network concurrency is not benchmarked; the pinned Pool::as source also stores requests under the supplied alias.')}),
q({n:450,type:'E',level:'F',sub:'http-successful-versus-ok',needs:['HTTP 2xx statuses','Response helper predicates'],why:'Distinguish a success family check from one exact status.',docs:['http-client#making-requests'],ask:'For an HTTP 201 response, what are successful() and ok()?',choices:[['successful() is true; ok() is false.','201 belongs to the successful 2xx range, while ok checks specifically for 200.'],['Both are true because all 2xx statuses mean OK.','The helper named ok is narrower than the general success family.'],['Both are false because only HTTP 200 is successful.','Created is also a successful 2xx response.'],['successful() is false; ok() is true.','This reverses the helpers’ scope.']],test:output('1:0',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['*' => Http::response(['id' => 7], 201)]);
$r = Http::post('https://api.example.test/items', []);
echo (int) $r->successful().':'.(int) $r->ok();`)}),
];
