import {q,file,output} from '../record.mjs';
import {feature,inertia} from './fixture.mjs';
const adapterDocs=['https://github.com/inertiajs/inertia-laravel/blob/v3.7.0/src/Middleware.php','https://github.com/inertiajs/inertia-laravel/blob/v3.7.0/src/Response.php'];
const adapterAssume=['The application uses inertiajs/inertia-laravel 3.7.0 with its standard middleware; server-side rendering is disabled.'];
export default [
q({n:491,type:'D',sub:'vite-production-manifest-required',needs:['Vite production builds','Blade asset integration','Deployment artifacts'],why:'Identify a missing build artifact instead of routing browsers to uncompiled source entries.',docs:['vite#running-vite','vite#loading-your-scripts-and-styles'],assume:['No development hot file exists. The application uses the default build directory and @vite("resources/js/app.js").'],ask:'Production throws ViteManifestNotFoundException. Which deployment correction addresses the normal production asset path?',choices:[['Build and deploy the generated public/build assets and their manifest.','The Laravel Vite integration resolves production entry points through the build manifest and generated files.'],['Copy resources/js/app.js into a PHP controller and return its source.','That bypasses the bundler and does not provide the manifest expected by @vite.'],['Set APP_DEBUG=true so @vite compiles the JavaScript on each request.','Debug mode does not turn the PHP integration into a production JavaScript compiler.'],['Run only route:cache because the Vite manifest is a route lookup table.','The asset manifest is a separate build artifact, not Laravel’s route cache.']],test:output('missing:built',String.raw`$vite = new Illuminate\Foundation\Vite;
try {
    $vite('resources/js/app.js');
} catch (Illuminate\Foundation\ViteManifestNotFoundException $e) {
    echo 'missing:';
}
mkdir(public_path('build/assets'), 0700, true);
file_put_contents(public_path('build/assets/app-a.js'), 'export {};');
file_put_contents(public_path('build/manifest.json'), json_encode([
    'resources/js/app.js' => ['file' => 'assets/app-a.js', 'src' => 'resources/js/app.js', 'isEntry' => true],
]));
$html = $vite('resources/js/app.js')->toHtml();
echo str_contains($html, '/build/assets/app-a.js') ? 'built' : 'missing';`)}),
q({n:492,type:'D',sub:'vite-stale-hot-file-production',needs:['Vite hot-file detection','Production asset URLs'],why:'Explain development-server URLs despite a valid production manifest.',docs:['vite#running-vite','vite#advanced-customization'],assume:['A valid production manifest is deployed, but public/hot still contains http://localhost:5173. No development server should be used in production.'],ask:'Why does @vite generate development-server asset URLs, and what deployment cleanup addresses it?',choices:[['The hot file selects development mode; remove that stale artifact from the production release.','The integration checks for the hot file before using the production manifest.'],['The browser chose localhost because the JavaScript entry has a relative import.','The server-generated asset URL already reflects the hot-file configuration before browser import resolution.'],['The production manifest always redirects through localhost before serving hashed assets.','That is not the normal production manifest behavior.'],['APP_NAME must match the manifest filename to disable the development URL.','Application naming does not control the hot-file detection path.']],test:output('hot:build',String.raw`mkdir(public_path('build'), 0700, true);
file_put_contents(public_path('hot'), 'http://localhost:5173');
file_put_contents(public_path('build/manifest.json'), json_encode([
    'resources/js/app.js' => ['file' => 'assets/app-a.js', 'src' => 'resources/js/app.js', 'isEntry' => true],
]));
$v = new Illuminate\Foundation\Vite;
echo str_contains($v('resources/js/app.js')->toHtml(), 'localhost:5173') ? 'hot:' : 'other:';
unlink(public_path('hot'));
echo str_contains($v('resources/js/app.js')->toHtml(), '/build/assets/app-a.js') ? 'build' : 'other';`)}),
q({n:493,type:'R',sub:'vite-prefixed-env-client-visible',needs:['Client bundles','Vite environment exposure','Server credentials'],why:'Keep a server credential out of data deliberately bundled into browser code.',docs:['vite#environment-variables','https://vite.dev/guide/env-and-mode'],assume:['Vite uses its default environment prefix. Client code references import.meta.env.VITE_PAYMENT_SECRET.'],ask:'A developer places a server payment credential in VITE_PAYMENT_SECRET, expecting .env to stay private. What is the correct review finding?',choices:[['The referenced value can be bundled into client code; keep this credential server-side.','The VITE_ prefix opts a value into client exposure. A private source .env file does not make the resulting browser bundle secret.'],['The value remains private because .env itself is not served by Laravel.','Build-time substitution can expose the value without serving the original file.'],['Production minification encrypts the value against browser users.','Minification is not confidentiality protection for data delivered to the client.'],['Calling config:cache removes the value from an already generated JavaScript bundle.','Laravel’s configuration cache does not rewrite a built client artifact.']],test:{kind:'documented-contract',sourceRoot:'reference',source:'vite-env.txt',contains:['Variables prefixed with VITE_ will be exposed in client-side source code after Vite bundling.'],reason:'Official Vite environment contract, default prefix and a referenced value. No Vite bundler execution is claimed.'}}),
q({n:494,type:'I',sub:'vite-resource-asset-manifest-resolution',needs:['Bundled resource assets','Vite manifest','Public asset helper'],why:'Resolve a hashed build output rather than inventing a web path for a source resource.',docs:['vite#processing-static-assets-with-vite'],assume:['resources/images/logo.png is included in the Vite build and has a manifest entry. No development hot file exists.'],ask:'Which Blade-side helper obtains that asset’s generated build URL?',choices:[['Vite::asset("resources/images/logo.png")','The Vite helper resolves the resource entry through its manifest to the generated asset path.'],['asset("resources/images/logo.png")','asset prefixes a public URL; it does not look up this resource’s hashed Vite output.'],['resource_path("images/logo.png")','That returns a server filesystem path rather than a browser asset URL.'],['public_path("resources/images/logo.png")','That also returns a filesystem path and does not consult the Vite manifest.']],test:output('http://localhost/build/assets/logo-a.png',String.raw`mkdir(public_path('build'), 0700, true);
file_put_contents(public_path('build/manifest.json'), json_encode([
    'resources/images/logo.png' => ['file' => 'assets/logo-a.png'],
]));
echo (new Illuminate\Foundation\Vite)->asset('resources/images/logo.png');`)}),
q({n:495,type:'R',sub:'credentialed-cors-explicit-origin',needs:['Browser CORS','Credentials','Origin allowlists'],why:'Return a credential-compatible origin policy without granting arbitrary origins access.',docs:['routing#cross-origin-resource-sharing-cors','https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSNotSupportingCredentials'],assume:['The allowed frontend is https://app.example.test. Its browser request includes eligible cookies, and the endpoint is meant to allow this origin.'],ask:'The response has Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials: true, and the browser refuses access. Which response policy fixes this mismatch?',choices:[['Return the allowed frontend origin explicitly and allow credentials.','Credentialed CORS cannot use a wildcard Allow-Origin response; the server should select an origin from its allowlist.'],['Keep the wildcard and repeat Access-Control-Allow-Credentials twice.','Repeating the credential header does not make the wildcard compatible.'],['Keep the wildcard and add Access-Control-Allow-Headers: Cookie.','Allowing a request-header name does not change the credentialed origin rule.'],['Echo any Origin value without validating it against an allowlist.','That removes the intended origin restriction and can expose credentialed responses to untrusted origins.']],test:output('https://app.example.test:true',String.raw`$cors = new Fruitcake\Cors\CorsService([
    'allowedOrigins' => ['https://app.example.test'],
    'allowedMethods' => ['GET'],
    'allowedHeaders' => ['*'],
    'supportsCredentials' => true,
]);
$request = Illuminate\Http\Request::create('/api/me', 'GET', server: ['HTTP_ORIGIN' => 'https://app.example.test']);
$response = $cors->addActualRequestHeaders(response('ok'), $request);
echo $response->headers->get('Access-Control-Allow-Origin').':'.$response->headers->get('Access-Control-Allow-Credentials');`)}),
q({n:496,type:'D',sub:'cross-origin-fetch-cookie-opt-in',needs:['Browser Fetch','Session cookies','Cross-origin credentials'],why:'Supply the browser credential option separately from server CORS configuration.',docs:['routing#cross-origin-resource-sharing-cors','https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch'],assume:['Frontend and API have different origins. The server allows that frontend with credentials. Cookie domain, SameSite, Secure and browser policy permit the session cookie.'],ask:'A browser fetch still omits the session cookie with its default options. Which client option is needed for this cross-origin session request?',choices:[['credentials: "include"','Fetch defaults to same-origin credentials; include opts into eligible credentials for a different origin.'],['credentials: "same-origin"','That is the default restriction and still excludes this different-origin request.'],['mode: "no-cors"','This does not grant credentialed readable access and produces an opaque response for this use.'],['headers: { "Access-Control-Allow-Credentials": "true" }','That is a server response policy header, not the client credential-mode option.']],test:{kind:'documented-contract',sourceRoot:'reference',source:'fetch-credentials.txt',contains:['Fetch defaults credentials to same-origin.','credentials: "include"'],reason:'Browser Fetch documentation contract with cookie and server-policy assumptions stated. PHP cannot execute a browser credential policy; no browser network exchange is claimed.'}}),
q({n:497,type:'E',sub:'inertia-initial-html-navigation-json',needs:['Inertia page protocol','Initial document requests','XHR page visits'],why:'Distinguish server responses at initial page load and subsequent Inertia navigation.',docs:adapterDocs,assume:adapterAssume,ask:'The same route returns Inertia::render("Users/Index", ["users" => []]). How do an ordinary initial request and a navigation with X-Inertia: true differ?',choices:[['The initial request gets an HTML document; the Inertia navigation gets a JSON page object.','The adapter selects the root HTML view for a normal request and a page-protocol JSON response for an Inertia request.'],['Both receive only the rendered component’s HTML fragment.','The Laravel adapter does not normally render frontend component fragments for each navigation.'],['Both receive an ordinary REST array with no component identifier.','An Inertia page response includes component and protocol metadata, not merely arbitrary REST data.'],['The initial request gets JSON, while later navigation requires a full HTML document.','This reverses the normal initial-load and Inertia-navigation response paths.']],test:output('html:json:Users/Index',inertia+String.raw`$normal = Illuminate\Http\Request::create('/users');
app()->instance('request', $normal);
$html = Inertia\Inertia::render('Users/Index', ['users' => []])->toResponse($normal);
$xhr = Illuminate\Http\Request::create('/users', server: ['HTTP_X_INERTIA' => 'true']);
app()->instance('request', $xhr);
$json = Inertia\Inertia::render('Users/Index', ['users' => []])->toResponse($xhr);
echo (str_contains($html->getContent(), '<!doctype html>') ? 'html' : 'other').':';
echo (str_contains($json->headers->get('Content-Type'), 'application/json') ? 'json' : 'other').':'.$json->getData(true)['component'];`)}),
q({n:498,type:'R',sub:'inertia-partial-reload-lazy-props',needs:['Inertia partial reloads','Page component identity','Lazy prop closures'],why:'Avoid computing unrequested props while respecting the same-component boundary.',docs:adapterDocs,assume:adapterAssume,ask:'A Users/Index page has users and an expensive totals prop. A same-component partial reload asks only for users. Which server prop design avoids computing totals on that request?',choices:[['Provide totals as a closure and retain the matching Users/Index partial-component header.','The adapter filters unrequested props for a matching component before resolving lazy prop values.'],['Call the totals query immediately while building the props array.','That work occurs before the adapter can omit the unrequested prop.'],['Send a partial-component header for Dashboard instead of Users/Index.','A mismatched component is not treated as the intended partial reload.'],['Wrap totals in Inertia::always and expect the only list to omit it.','An always prop is specifically included even when a partial request does not list it.']],test:output('0:users|1:users,totals',inertia+String.raw`foreach (['Users/Index', 'Dashboard'] as $component) {
    $calls = 0;
    $request = Illuminate\Http\Request::create('/users', server: [
        'HTTP_X_INERTIA' => 'true',
        'HTTP_X_INERTIA_PARTIAL_COMPONENT' => $component,
        'HTTP_X_INERTIA_PARTIAL_DATA' => 'users',
    ]);
    app()->instance('request', $request);
    $response = Inertia\Inertia::render('Users/Index', [
        'users' => fn () => [],
        'totals' => function () use (&$calls) {
            $calls++;
            return 42;
        },
    ])->toResponse($request);
    echo $calls.':'.implode(',', array_keys($response->getData(true)['props']));
    if ($component === 'Users/Index') {
        echo '|';
    }
}`)}),
q({n:499,type:'E',sub:'inertia-asset-version-location-response',needs:['Inertia asset versioning','Protocol response headers'],why:'Interpret a protocol conflict as a reload instruction instead of an application data conflict.',docs:adapterDocs,assume:[...adapterAssume,'An Inertia GET carries asset version old; the middleware reports current version new.'],ask:'What response does the version-mismatch path use to instruct the client to perform a full visit?',choices:[['HTTP 409 with X-Inertia-Location naming the destination.','The Inertia protocol uses this special response to request a full-location visit when the asset version changes.'],['HTTP 200 with the stale page object and no location instruction.','That would not trigger the protocol’s version-mismatch reload behavior.'],['HTTP 304 with an empty body because the client’s assets match.','The versions differ, so a not-modified interpretation is incorrect.'],['HTTP 422 with field validation errors for the version header.','This is protocol asset synchronization, not a form-field validation failure.']],test:output('409:http://localhost/users',inertia+String.raw`$request = Illuminate\Http\Request::create('http://localhost/users', server: [
    'HTTP_X_INERTIA' => 'true',
    'HTTP_X_INERTIA_VERSION' => 'old',
]);
app()->instance('request', $request);
$middleware = new class extends Inertia\Middleware
{
    public function version(Illuminate\Http\Request $request)
    {
        return 'new';
    }
};
$response = $middleware->handle($request, fn ($r) => Inertia\Inertia::render('Users/Index', [])->toResponse($r));
echo $response->getStatusCode().':'.$response->headers->get('X-Inertia-Location');`)}),
q({n:500,type:'D',sub:'inertia-validation-redirect-shared-errors',needs:['Laravel validation redirects','Session error bags','Inertia shared props'],why:'Use the form-navigation error flow rather than expecting a conventional JSON API validation response.',docs:adapterDocs,assume:[...adapterAssume,'The standard web session and validation flow is enabled. The Inertia form request accepts HTML, not application/json.'],ask:'A failed Inertia form submission redirects back. How does the next page visit normally expose validation errors to the frontend?',choices:[['Flashed session errors are shared in the page props for the redirected visit.','The standard adapter shares the session error bag; this navigation flow does not rely on the client receiving a conventional 422 JSON API body.'],['The frontend must parse a 422 JSON body from the redirect response itself.','The stated response is a redirect, and the usual Inertia validation flow obtains errors from shared props on the next visit.'],['Laravel puts all validation errors into the redirect URL’s query string.','The normal validation redirect uses the session error bag, not mandatory query-string serialization.'],['The adapter converts every failed field into an HTTP 500 response.','Validation failures are expected form feedback rather than server crashes.']],test:output('302:required',feature+inertia+String.raw`app('router')->get('/form', fn () => Inertia\Inertia::render('Form', []))
    ->middleware(['web', Inertia\Middleware::class]);
app('router')->post('/form', function (Illuminate\Http\Request $request) {
    $request->validate(['name' => 'required'], ['name.required' => 'required']);
    return redirect('/form');
})->middleware(['web', Inertia\Middleware::class]);
$failed = $test->withHeaders(['X-Inertia' => 'true', 'Accept' => 'text/html'])
    ->from('/form')->post('/form', []);
echo $failed->status().':';
$next = $test->get('/form');
echo $next->json('props.errors.name');`)}),
];
