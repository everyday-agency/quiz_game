import {q,file,output,contract} from '../record.mjs';
export default [
q({n:591,type:'R',sub:'retry-overall-deadline-budget',needs:['HTTP timeouts','Backoff','End-to-end deadlines'],why:'Account for all attempts and waits inside one caller budget rather than resetting the budget on every attempt.',docs:['http-client#timeout','http-client#retries'],assume:['A controller has 2 seconds left before its response deadline. The integration proposes three attempts, each with a 2-second timeout, and two 250-ms waits.'],ask:'Which change makes the retry policy respect the caller’s remaining budget?',choices:[['Track one monotonic deadline and cap each attempt and wait by the time remaining.','One shared budget includes attempts and backoff; separate full-length timeouts can exceed the caller’s deadline.'],['Use the 2-second timeout independently for each of the three attempts.','The worst-case total can exceed two seconds even before adding waits.'],['Keep all three 2-second attempts but remove the two waits.','Removing backoff still allows up to six seconds of attempt time.'],['Set only connectTimeout to 2 seconds and leave response time unrestricted.','A connection timeout does not bound the entire operation and its retries.']],test:output('1000,750:2000',String.raw`$deadlineMs = 2000;
$nowMs = 0;
$budgets = [];
for ($attempt = 0; $attempt < 3 && $nowMs < $deadlineMs; $attempt++) {
    $budget = min(1000, $deadlineMs - $nowMs);
    $budgets[] = $budget;
    $nowMs += $budget;
    $nowMs += min(250, max(0, $deadlineMs - $nowMs));
}
echo implode(',', $budgets).':'.$nowMs;`)}),
q({n:592,type:'E',sub:'circuit-open-state-no-downstream-attempt',needs:['Circuit breakers','Retry policies','Monotonic time'],why:'Distinguish rejecting a call during an open interval from retrying that call downstream.',docs:['http-client#retries','https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker'],assume:['This is application policy code, not a built-in Laravel circuit-breaker API. The shared breaker is open until monotonic time 5000 ms. A request arrives at 4200 ms.'],ask:'With the shown policy, how many downstream attempts does that request make?',code:[file(String.raw`function mayCall(int $nowMs, int $openUntilMs): bool
{
    return $nowMs >= $openUntilMs;
}

$attempts = 0;
if (mayCall(4200, 5000)) {
    $attempts++;
}
echo $attempts;`)],choices:[['Zero.','The open interval has not expired, so this policy rejects the downstream call before any per-request retry loop could run.'],['One, because every request must test whether the service has recovered.','This policy does not admit a probe before openUntil; recovery probing belongs to a later state or explicit policy.'],['Three, because an open circuit increases the retry count.','The shown open-state gate prevents calls; it does not define or increase a retry count.'],['A random count determined by Laravel’s queue attempts setting.','This synchronous application gate does not consult queue attempt settings.']],test:output('0')}),
q({n:593,type:'A',level:'A',sub:'uncertain-external-result-reconciliation',needs:['Network failure ambiguity','Idempotency contracts','Distributed consistency'],why:'Handle an unknown remote outcome without creating a second business operation.',docs:['http-client#timeout','https://stripe.com/blog/idempotency'],assume:['A payment provider may commit a charge before the connection times out. It supports durable operation lookup and retries with the original idempotency key. The local record is still pending.'],ask:'Which recovery policy avoids treating the timeout as proof that no charge occurred?',choices:[['Reconcile the original operation, using its identity and the provider’s same-key retry contract.','The outcome is unknown; retaining the operation identity lets recovery discover or replay the original result without intentionally creating a new charge.'],['Mark the local operation failed and immediately retry with a new idempotency key.','A new key can create a second charge when the first already succeeded.'],['Mark the local operation successful whenever the client times out.','The provider might not have committed it; a timeout also does not prove success.'],['Roll back the local transaction and assume that cancels the remote charge.','A local database rollback cannot undo an independently committed provider operation.']],test:{kind:'documented-contract',sourceRoot:'reference',source:'external-recovery.txt',contains:['unknown','same identity'],reason:'Documented idempotency/failure ambiguity plus the explicit provider contract. No real payment, network request or production recovery is executed.'}}),
q({n:594,type:'R',sub:'provider-boot-avoids-network-prerequisite',needs:['Service providers','Application boot','External dependencies'],why:'Keep registration available when an optional integration is unavailable.',docs:['providers#the-boot-method','container#binding-basics'],assume:['A provider’s boot method calls an optional vendor API to discover settings. When the vendor is down, unrelated Artisan commands fail during application boot.'],ask:'Which refactor removes that unwanted boot-time dependency?',choices:[['Register the client during bootstrapping; fetch and cache remote settings only in operations that need them.','Registration can remain local while dependent operations own remote failure and freshness handling.'],['Move the same blocking API call from boot into register.','Both methods participate in application bootstrapping, so unrelated commands still depend on the vendor.'],['Increase the vendor timeout inside boot to cover longer outages.','That can prolong failures and does not remove the dependency from unrelated commands.'],['Catch the boot exception and silently persist an empty settings set as authoritative.','That can turn an outage into durable incorrect configuration rather than handling unavailable optional data at the operation boundary.']],test:output('0:1',String.raw`$calls = 0;
app()->bind('optional-settings', function () use (&$calls) {
    $calls++;
    return ['region' => 'eu'];
});
echo $calls.':';
app('optional-settings');
echo $calls;`)}),
q({n:595,type:'E',sub:'package-view-namespace-override-precedence',needs:['Package view namespaces','Application overrides','Blade rendering'],why:'Resolve an application override without losing package defaults for other views.',docs:['packages#views'],assume:['The provider calls loadViewsFrom(package_path, \"billing\"). Package views include receipt and footer. The application overrides only resources/views/vendor/billing/receipt.blade.php.'],ask:'Which templates render for view(\"billing::receipt\") and view(\"billing::footer\")?',choices:[['The application receipt and the package footer.','The application namespace override is checked first, while missing overrides fall back to package views.'],['Both package templates, because a namespace bypasses application overrides.','loadViewsFrom registers the conventional application override path before the package path.'],['The application receipt and a missing-view error for footer.','Overriding one view does not remove the package fallback for other views.'],['Both application templates, with the receipt automatically reused for footer.','Each named view is resolved separately; one override is not reused for every name.']],test:output('app-receipt:package-footer',String.raw`mkdir(base_path('package-views'), 0700, true);
mkdir(resource_path('views/vendor/billing'), 0700, true);
file_put_contents(base_path('package-views/receipt.blade.php'), 'package-receipt');
file_put_contents(base_path('package-views/footer.blade.php'), 'package-footer');
file_put_contents(resource_path('views/vendor/billing/receipt.blade.php'), 'app-receipt');
$provider = new class(app()) extends Illuminate\Support\ServiceProvider {
    public function boot(): void
    {
        $this->loadViewsFrom(base_path('package-views'), 'billing');
    }
};
$provider->boot();
echo view('billing::receipt')->render().':'.view('billing::footer')->render();`)}),
q({n:596,type:'E',sub:'package-config-merge-top-level-only',needs:['Package configuration','PHP array merging','Nested defaults'],why:'Predict a nested configuration result under the actual shallow merge operation.',docs:['packages#default-package-configuration'],assume:['Configuration is not cached. The provider calls mergeConfigFrom for the shown package defaults under the key delivery. Existing application config delivery is [\"retry\" => [\"attempts\" => 5]].'],ask:'What is config(\"delivery.retry.delay\", \"missing\") after registration?',code:[file(String.raw`return [
    'retry' => [
        'attempts' => 3,
        'delay' => 100,
    ],
    'region' => 'eu',
];`,'package-config.php')],choices:[['missing','The application retry array replaces the package retry array at the top level; mergeConfigFrom does not recursively preserve delay.'],['100','That would require recursively merging the nested retry arrays, which this helper does not do.'],['5','The attempts value does not become the value of the separate delay key.'],['0','A missing nested key uses the supplied default, not an implicit numeric zero.']],test:output('missing:eu',String.raw`config(['delivery' => ['retry' => ['attempts' => 5]]]);
$provider = new class(app()) extends Illuminate\Support\ServiceProvider {
    public function register(): void
    {
        $this->mergeConfigFrom(base_path('package-config.php'), 'delivery');
    }
};
$provider->register();
echo config('delivery.retry.delay', 'missing').':'.config('delivery.region');`)}),
q({n:597,type:'D',level:'F',sub:'package-publish-registration-not-copy',needs:['Service providers','Publish tags','Package assets'],why:'Separate registering publishable paths from actually copying them into the application.',docs:['packages#public-assets'],ask:'A package provider registers an asset mapping with publishes(..., \"calendar-assets\"). After provider registration, public/vendor/calendar is absent. What step normally performs that copy?',choices:[['Run php artisan vendor:publish --tag=calendar-assets.','publishes registers the mapping; vendor:publish performs the selected copy operation.'],['Resolve the provider from the container a second time.','Resolving the provider does not turn mapping registration into asset copying.'],['Run php artisan view:cache.','Compiling Blade views does not copy tagged package asset paths.'],['Add the tag name to the route middleware group.','Publish tags select filesystem mappings; they are not middleware aliases.']],test:output('registered:not-copied',String.raw`$provider = new class(app()) extends Illuminate\Support\ServiceProvider {
    public function boot(): void
    {
        $this->publishes([base_path('package-assets') => public_path('vendor/calendar')], 'calendar-assets');
    }
};
$provider->boot();
$paths = Illuminate\Support\ServiceProvider::pathsToPublish(null, 'calendar-assets');
echo isset($paths[base_path('package-assets')]) ? 'registered:' : 'missing:';
echo is_dir(public_path('vendor/calendar')) ? 'copied' : 'not-copied';`)}),
q({n:598,type:'I',sub:'package-migration-path-registration',needs:['Package service providers','Migration discovery','Database connections'],why:'Register package migration discovery independently of database connection configuration.',docs:['packages','https://api.laravel.com/docs/13.x/Illuminate/Support/ServiceProvider.html'],assume:['A private package intentionally runs migrations directly from its installed directory. Its tables use the application’s normal configured connection.'],ask:'What does loadMigrationsFrom($path) supply for that design?',choices:[['An additional path searched by the migrator; connection selection remains a separate concern.','The helper registers migration paths with the migrator, not a new database connection.'],['A separate connection automatically named after the package directory.','A migration search path does not configure or isolate a database connection.'],['An immediate execution of all pending migrations during provider boot.','Registering discovery paths does not itself run the migration command.'],['A copy of each migration into database/migrations on every boot.','Path registration uses the package location; publishing is a different operation.']],test:output('registered:sqlite',String.raw`$provider = new class(app()) extends Illuminate\Support\ServiceProvider {
    public function boot(): void
    {
        $this->loadMigrationsFrom(base_path('package-migrations'));
    }
};
$provider->boot();
echo in_array(base_path('package-migrations'), app('migrator')->paths(), true) ? 'registered:' : 'missing:';
echo config('database.default');`)}),
q({n:599,type:'T',sub:'architecture-boundary-dependency-check',needs:['Architecture tests','Namespace dependencies','Transport independence'],why:'Test a dependency rule directly rather than infer architecture from successful behavior.',docs:['testing','https://pestphp.com/docs/arch-testing'],assume:['The agreed rule forbids App\\Domain from depending on Illuminate\\Http. A new domain service adds a constructor parameter typed Illuminate\\Http\\Request.'],ask:'Which regression check targets the violated rule?',choices:[['A dependency-boundary test that rejects Illuminate\\Http references from App\\Domain.','The rule concerns dependency direction; a targeted architecture check detects the forbidden reference even when behavior still passes.'],['A feature test asserting that the service’s HTTP endpoint returns 200.','A successful endpoint does not prove that domain code is independent of HTTP types.'],['A test asserting that every domain class has the suffix Service.','Naming conventions do not detect forbidden type dependencies.'],['A test counting how many routes call the service.','Call-site counts do not establish the namespace dependency rule.']],test:output('violation',String.raw`eval('namespace App\Domain; final class Quote { public function __construct(\Illuminate\Http\Request $request) {} }');
$parameter = (new ReflectionMethod(App\Domain\Quote::class, '__construct'))->getParameters()[0];
echo str_starts_with($parameter->getType()->getName(), 'Illuminate\\Http\\') ? 'violation' : 'allowed';`)}),
q({n:600,type:'T',sub:'framework-upgrade-behavior-regression-evidence',needs:['Composer lock','Framework upgrade guides','Behavior regression tests'],why:'Distinguish dependency compatibility constraints from the application behavior they cannot prove.',docs:['upgrade','testing','https://getcomposer.org/doc/01-basic-usage.md#composer-lock-the-lock-file'],ask:'Composer resolves and installs a new Laravel version successfully. Which evidence is still needed before concluding the application is compatible?',choices:[['Relevant upgrade-guide review plus behavior regressions on the locked version and supported runtimes.','Dependency resolution establishes installable constraints; it does not prove application behavior across changed framework contracts.'],['A second successful composer install with the same lock file, with no application tests.','Reproducing dependency installation is useful but still does not exercise application behavior.'],['A successful PHP syntax check of vendor files alone.','Syntax validity cannot detect behavioral changes in routing, validation or persistence.'],['The absence of changes in application source during the dependency update.','Unchanged caller code may still observe changed dependency behavior.']],test:{kind:'documented-contract',sourceRoot:'reference',source:'upgrade-validation.txt',contains:['dependency resolution','behavior regressions'],reason:'Composer lock/install contract and the Laravel upgrade guide. This is a validation-planning question, not a claim to have upgraded an unrelated production application.'}}),
];
