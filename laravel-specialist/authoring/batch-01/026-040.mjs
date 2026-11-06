import {q,file,output,contract,src} from '../record.mjs';
export default [
q({n:26,type:'D',sub:'deferred-provider-service-list',needs:['Deferred providers','Container abstracts'],why:'Trace the service manifest that triggers lazy provider loading.',docs:['providers#deferred-providers'],ask:'A deferred provider registers the binding "rates.client", but provides() returns only the provider class name. No other code loads the provider. Resolving "rates.client" fails. What should provides() identify?',choices:[['The service abstract "rates.client" that this provider registers.','Laravel maps each advertised service abstract to its deferred provider and loads that provider when the abstract is resolved.'],['Every controller that might use the rates client.','Consumers are not the abstract keys used to trigger deferred service loading.'],['The source filename containing the provider.','The manifest uses service identifiers, not source-file paths.'],['The configuration file used by the client.','Configuration dependencies do not identify the service being resolved from the container.']],test:contract('Illuminate/Foundation/ProviderRepository.php',['foreach ($instance->provides() as $service)',"$manifest['deferred'][$service] = $provider"],'The deferred manifest maps provided abstracts to provider classes.')}),
q({n:27,type:'E',sub:'middleware-onion-order',needs:['Middleware pipeline','Closures'],why:'Trace entry and response unwinding through two layers.',lessons:[8],docs:['middleware#middleware-and-responses'],ask:'The pipeline runs A, then B, then the destination. What sequence is printed?',code:[file(String.raw`use Illuminate\Pipeline\Pipeline;

$trace = [];
$a = function ($value, $next) use (&$trace) {
    $trace[] = 'A-in';
    $result = $next($value);
    $trace[] = 'A-out';

    return $result;
};
$b = function ($value, $next) use (&$trace) {
    $trace[] = 'B-in';
    $result = $next($value);
    $trace[] = 'B-out';

    return $result;
};

app(Pipeline::class)->send(null)->through([$a, $b])->then(function () use (&$trace) {
    $trace[] = 'action';
});
echo implode(',', $trace);`)],choices:[['A-in,B-in,action,B-out,A-out','Each layer waits for the downstream result; response handling unwinds in reverse order.'],['A-in,A-out,B-in,B-out,action','The code after next cannot run before the downstream call completes.'],['B-in,A-in,action,A-out,B-out','through([$a, $b]) enters A first, not B.'],['A-in,B-in,action,A-out,B-out','Outgoing work follows call-stack unwinding, so B-out precedes A-out.']],test:output('A-in,B-in,action,B-out,A-out')}),
q({n:28,type:'R',level:'F',sub:'middleware-short-circuit',needs:['HTTP middleware','Response return'],why:'Identify a missing continuation call from request control flow.',lessons:[8],docs:['middleware#defining-middleware'],ask:'A middleware returns response("maintenance", 503) when a feature is paused, before it calls $next($request). A later middleware normally records controller execution. For a paused request, which behavior follows?',choices:[['The controller and later middleware are skipped; earlier middleware may still process the response.','Returning early stops downstream execution but the response returns through the layers that already called next.'],['The controller runs, but Laravel replaces its response with the 503.','The middleware never invokes the downstream continuation on this branch.'],['The later middleware runs, but the controller is skipped automatically.','Both sit downstream of the omitted next call; Laravel does not selectively enter the next middleware.'],['All earlier middleware after-next code is skipped as well.','A normal early response unwinds through already-entered layers, so their after-next code can run.']],test:output('outer-in,paused,outer-out',String.raw`$trace = [];
$a = function ($r, $next) use (&$trace) {
    $trace[] = 'outer-in';
    $result = $next($r);
    $trace[] = 'outer-out';
    return $result;
};
$b = function ($r, $next) use (&$trace) {
    $trace[] = 'paused';
    return response('maintenance', 503);
};
$c = function ($r, $next) use (&$trace) {
    $trace[] = 'later';
    return $next($r);
};
app(Illuminate\Pipeline\Pipeline::class)->send(null)->through([$a, $b, $c])->then(function () use (&$trace) {
    $trace[] = 'controller';
});
echo implode(',', $trace);`)}),
q({n:29,type:'D',sub:'middleware-exception-finally',needs:['Middleware continuation','PHP exception unwinding'],why:'Guarantee local cleanup when a downstream call actually throws.',lessons:[8],docs:['middleware#middleware-and-responses','https://www.php.net/manual/en/language.exceptions.php'],ask:'A unit test calls handle() directly and supplies a $next closure that throws before returning. No exception is caught inside $next. The resource must close whether next returns or throws. Which change fixes this middleware fragment?',code:[file(`$resource = openResource();
$response = $next($request);
$resource->close();

return $response;`,'handle-fragment.php','fragment','Inside handle(); openResource() returns an object with close().')],choices:[['Put the call to next in try and close the resource in finally.','finally runs as the call stack unwinds whether next returns or throws, while the exception can keep propagating.'],['Move close immediately before the existing return statement.','That position still is not reached when the earlier next call throws.'],['Put close after return $next($request).','Code after return is unreachable on success and also not reached on an exception.'],['Move close into an if ($response->isSuccessful()) branch.','There is no response on the throwing path, and cleanup must also happen for unsuccessful responses.']],test:output('closed:propagated',String.raw`$closed = false;
$next = function () { throw new RuntimeException('failed'); };
try {
    try {
        $next();
    } finally {
        $closed = true;
    }
} catch (RuntimeException $e) {
    echo ($closed ? 'closed' : 'open').':propagated';
}`)}),
q({n:30,type:'D',sub:'terminable-middleware-instance',needs:['Terminable middleware','Container lifetime'],why:'Distinguish request execution state from a separately resolved termination object.',docs:['middleware#terminable-middleware'],ask:'A transient middleware stores $this->startedAt in handle(), then reads it in terminate(). Under the standard HTTP kernel, terminate() sometimes finds its default value. No singleton binding exists. What best explains this?',choices:[['The kernel resolves the middleware again for termination; transient instances do not share that property state.','The termination phase calls the container to make the middleware, so state from handle is not guaranteed on that new object.'],['Laravel serializes middleware properties between handle and terminate, excluding timestamps.','The standard kernel does not serialize these middleware objects for termination.'],['terminate always runs before handle, so the timestamp has not been written.','Termination is a later phase; the issue is object identity, not reversed lifecycle order.'],['Calling next automatically resets all middleware instance properties.','next has no generic property-reset mechanism; a different resolved instance explains the observation.']],test:contract(src.kernel,['protected function terminateMiddleware(', '$instance = $this->app->make($name)', '$instance->terminate($request, $response)'],'Terminate resolves a middleware instance separately; sharing handle state requires an appropriate lifetime or external request-local state.')}),
q({n:31,revision:2,type:'E',sub:'head-get-response-body',needs:['GET and HEAD','HTTP response preparation'],why:'Separate route execution from the body sent for HEAD.',lessons:[2,5],docs:['routing#available-router-methods','responses'],ask:'This is the only matching route. What status and body does a HEAD /ping request receive through the HTTP kernel?',code:[file(String.raw`use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response('pong', 200);
});`,'routes/fixture.php')],assume:['No middleware changes this response.'],choices:[['200 with an empty body','A GET route also accepts HEAD; response preparation removes the body for a HEAD request.'],['200 with body pong','The handler produces content, but the HEAD response is prepared without that body.'],['405 with an empty body','GET route registration includes HEAD, so this method is accepted.'],['404 with an empty body','The registered GET route also matches HEAD, so this is not a missing-route response.']],test:output('200:0',String.raw`$request = Illuminate\Http\Request::create('/ping', 'HEAD');
$response = app(Illuminate\Contracts\Http\Kernel::class)->handle($request);
echo $response->getStatusCode().':'.strlen($response->getContent());`)}),
q({n:32,type:'D',sub:'wildcard-route-order',needs:['Route matching','Wildcard constraints'],why:'Diagnose a route that matches earlier than the intended literal endpoint.',lessons:[2],docs:['routing#available-router-methods'],ask:'GET /status returns "fallback". Which change preserves the fallback while giving /status its intended handler?',code:[file(String.raw`use Illuminate\Support\Facades\Route;

Route::any('/{path}', function () {
    return 'fallback';
})->where('path', '.*');

Route::get('/status', function () {
    return 'healthy';
});`,'routes/fixture.php')],choices:[['Register the /status route before the wildcard route.','The wildcard already matches GET /status, so the literal route must be considered first.'],['Add ->name("status") to the second route.','A route name changes URL lookup, not matching priority for an incoming request.'],['Change the second route to POST /status.','That would remove its ability to handle the required GET request.'],['Add ->whereNumber("path") to the /status route.','The literal route has no path parameter, and constraining it does not restrict the earlier wildcard.']],test:output('fallback',String.raw`echo app('router')->dispatch(Illuminate\Http\Request::create('/status'))->getContent();`)}),
q({n:33,type:'T',level:'F',sub:'missing-url-versus-method',needs:['Route methods','HTTP status codes'],why:'Choose assertions that distinguish a wrong verb from a nonexistent resource path.',lessons:[2],docs:['routing#available-router-methods'],ask:'An application registers only GET /catalog, with no fallback route. Which status pair should a route regression test expect for POST /catalog and GET /unknown, respectively?',choices:[['405, 404','The catalog path has a route under another method; unknown has no matching route at all.'],['404, 404','A path recognized under another HTTP method produces method-not-allowed, not a missing-path result.'],['405, 405','The unknown path has no route whose supported methods could produce a 405.'],['200, 404','GET registration does not authorize POST on the same path.']],test:output('405,404',String.raw`app('router')->get('/catalog', fn () => 'ok');
$kernel = app(Illuminate\Contracts\Http\Kernel::class);
$a = $kernel->handle(Illuminate\Http\Request::create('/catalog', 'POST'));
$b = $kernel->handle(Illuminate\Http\Request::create('/unknown', 'GET'));
echo $a->getStatusCode().','.$b->getStatusCode();`)}),
q({n:34,type:'E',level:'F',sub:'route-constraint-status',needs:['Route parameter constraints','Validation boundary'],why:'Locate rejection at matching rather than inside the handler.',lessons:[2],docs:['routing#regular-expression-constraints'],ask:'What status does GET /reports/weekly receive with this sole route?',code:[file(String.raw`use Illuminate\Support\Facades\Route;

Route::get('/reports/{id}', function (string $id) {
    return 'report-'.$id;
})->whereNumber('id');`,'routes/fixture.php')],choices:[['404','weekly does not satisfy the route constraint, so this route does not match.'],['422','No request validator runs; route matching rejects the path before the handler.'],['200','The PHP string type does not override the numeric route constraint.'],['500','A failed route constraint is a normal non-match, not an uncaught type error.']],test:output('404',String.raw`$r = app(Illuminate\Contracts\Http\Kernel::class)->handle(Illuminate\Http\Request::create('/reports/weekly'));
echo $r->getStatusCode();`)}),
q({n:35,revision:2,type:'I',level:'F',sub:'optional-route-php-default',needs:['Optional route parameters','PHP parameter defaults'],why:'Satisfy an absent URI value at the PHP invocation boundary.',lessons:[2],docs:['routing#optional-parameters'],ask:'For Route::get("/greet/{name?}", ...), the handler should return "Hello guest" for /greet and "Hello Ada" for /greet/Ada. Which handler supports both without an argument error?',choices:[['function (string $name = "guest") {\n    return "Hello ".$name;\n}','The PHP default supplies the omitted optional route parameter while a present value replaces it.'],['function (string $name) {\n    return "Hello ".$name;\n}','The route placeholder is optional, but the PHP argument remains required.'],['function (?string $name) {\n    return "Hello ".($name ?? "guest");\n}','Nullable allows null when supplied; it does not make the PHP parameter optional without a default.'],['function (string $name = "") {\n    return "Hello ".$name;\n}','This avoids an argument error but returns Hello with an empty name instead of the required guest fallback.']],test:output('Hello guest|Hello Ada',String.raw`app('router')->get('/greet/{name?}', function (string $name = 'guest') { return 'Hello '.$name; });
foreach (['/greet', '/greet/Ada'] as $i => $path) {
    echo ($i ? '|' : '').app('router')->dispatch(Illuminate\Http\Request::create($path))->getContent();
}`)}),
q({n:36,type:'E',level:'F',sub:'named-route-surplus-query',needs:['Named routes','URL parameters'],why:'Separate substituted URI values from extra query parameters.',lessons:[2],docs:['routing#generating-urls-to-named-routes'],ask:'The named route reports.show has URI /reports/{report}. What relative URL does route("reports.show", ["report" => 7, "tab" => "notes"], false) generate?',choices:[['/reports/7?tab=notes','report fills the path placeholder; surplus tab becomes a query parameter.'],['/reports/7/notes','Surplus values are not appended as additional path segments.'],['/reports/{report}?report=7&tab=notes','The matching report key is substituted into the URI, not retained as an unresolved placeholder.'],['/reports/7','Unused named parameters are retained in the query rather than silently discarded.']],test:output('/reports/7?tab=notes',String.raw`app('router')->get('/reports/{report}', fn () => '')->name('reports.show');
app('router')->getRoutes()->refreshNameLookups();
echo route('reports.show', ['report' => 7, 'tab' => 'notes'], false);`)}),
q({n:37,type:'E',level:'F',sub:'route-name-group-composition',needs:['Route groups','Route names'],why:'Compose name and URI prefixes independently.',lessons:[2],docs:['routing#route-name-prefixes'],ask:'Which route name generates /staff/reports from this registration?',code:[file(String.raw`use Illuminate\Support\Facades\Route;

Route::prefix('staff')->name('admin.')->group(function () {
    Route::get('/reports', fn () => 'reports')->name('reports');
});`,'routes/fixture.php')],choices:[['admin.reports','The name prefix admin. is concatenated with reports; staff affects the URI only.'],['staff.reports','The URI prefix is not automatically a route-name prefix.'],['admin.staff.reports','The staff URI segment is not inserted into the registered name.'],['reports','The explicit name-group prefix is included, so the bare child name is incomplete.']],test:output('/staff/reports',String.raw`echo route('admin.reports', [], false);`)}),
q({n:38,type:'R',sub:'url-defaults-not-input',needs:['URL defaults','Incoming route parameters'],why:'Separate outgoing URL generation state from the request being processed.',lessons:[2,5],docs:['urls#default-values'],ask:'A middleware calls URL::defaults(["locale" => "fr"]) before generating a link for /{locale}/help. The current request contains route parameter locale=en. No parameter mutation occurs. Which statement is accurate?',choices:[['An omitted locale in a generated URL can use fr; the current route parameter remains en.','URL defaults supply missing generation values and do not rewrite parameters on the incoming route.'],['Both generated URLs and the current route parameter change to fr.','The URL generator defaults do not mutate the already matched incoming route.'],['The default can change the incoming route parameter but cannot generate a link.','This reverses the purpose of URL defaults, which are used for generation.'],['The incoming en always overrides the explicit URL default even when no generation parameter is supplied.','The URL generator does not automatically read that route parameter as an explicit argument to this call.']],test:output('/fr/help:en',String.raw`$route = app('router')->get('/{locale}/help', fn () => '')->name('help');
app('router')->getRoutes()->refreshNameLookups();
$request = Illuminate\Http\Request::create('/en/help');
$route->bind($request);
$request->setRouteResolver(fn () => $route);
app('url')->defaults(['locale' => 'fr']);
echo route('help', [], false).':'.$request->route('locale');`)}),
q({n:39,revision:2,type:'R',sub:'redirect-allowlisted-query',needs:['Redirect routes','Request query selection','Named URL generation'],why:'Preserve useful query state while excluding a credential from the redirect URL.',lessons:[2,5],docs:['routing#redirect-routes','responses#redirecting-to-named-routes'],ask:'GET /find?q=php&token=private follows this legacy redirect, but the search term is lost. The new URL must retain q and must omit token. Which replacement for the /find handler meets both requirements?',code:[file(String.raw`use Illuminate\Support\Facades\Route;

Route::redirect('/find', '/search');
Route::get('/search', fn () => 'search')->name('search');`,'routes/fixture.php')],choices:[['Generate a redirect to search with only q from $request->query("q").','A fixed redirect does not transfer the incoming query automatically; explicitly generating the URL with q preserves the allowed value without token.'],['Append the complete incoming query string to /search.','That preserves q but also carries the private token into the destination URL.'],['Keep Route::redirect and add ->where("q", ".*").','Route constraints govern URI placeholders, not forwarding of incoming query parameters.'],['Make the redirect permanent by changing its status to 301.','Changing the redirect status does not copy q or selectively remove token.']],test:output('/search|/search?q=php',String.raw`$r = Illuminate\Http\Request::create('/find?q=php&token=private');
$original = app(Illuminate\Contracts\Http\Kernel::class)->handle($r);
echo parse_url($original->getTargetUrl(), PHP_URL_PATH).'|';
$fixed = redirect()->route('search', ['q' => $r->query('q')]);
echo parse_url($fixed->getTargetUrl(), PHP_URL_PATH).'?'.parse_url($fixed->getTargetUrl(), PHP_URL_QUERY);`)}),
q({n:40,type:'E',sub:'domain-route-precedence-13-40',needs:['Host-aware routing','Version-specific routing behavior'],why:'Apply the pinned router\'s domain-first matching rather than assuming all registrations share one list.',lessons:[2],docs:['routing#subdomain-routing'],ask:'In the pinned Laravel 13.40.0 router, what does GET http://acme.example.test/dashboard return? No route cache is used.',code:[file(String.raw`use Illuminate\Support\Facades\Route;

Route::get('/dashboard', fn () => 'public');
Route::domain('{tenant}.example.test')->group(function () {
    Route::get('/dashboard', fn (string $tenant) => 'tenant '.$tenant);
});`,'routes/fixture.php')],choices:[['tenant acme','This router prioritizes matching domain routes over domainless routes; the tenant placeholder captures acme.'],['public','That assumes a single insertion-ordered list; this pinned router keeps domain routes ahead of domainless matches.'],['404','The host and path both satisfy the domain route pattern.'],['A missing tenant argument error','The domain placeholder is a route parameter supplied to the handler.']],test:output('tenant acme',String.raw`echo app('router')->dispatch(Illuminate\Http\Request::create('http://acme.example.test/dashboard'))->getContent();`)}),
];
