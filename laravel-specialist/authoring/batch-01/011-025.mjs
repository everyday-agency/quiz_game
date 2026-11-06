import {q,file,output,contract,src} from '../record.mjs';
export default [
q({n:11,type:'D',level:'F',sub:'interface-autowiring-boundary',needs:['Constructor injection','Interfaces'],why:'Identify why a concrete dependency is required at an interface boundary.',lessons:[1],docs:['container#binding-interfaces-to-implementations'],ask:'InvoiceController constructor-injects ReceiptSender, an interface with no binding or container attribute. EmailReceiptSender implements it and is autoloadable. Resolution fails with "Target [ReceiptSender] is not instantiable". Which fix addresses the cause?',choices:[['Bind ReceiptSender::class to EmailReceiptSender::class.','The container needs an implementation choice; autoloading an implementation does not select it for an interface.'],['Register a singleton for InvoiceController without changing ReceiptSender.','Building the singleton still requires resolving its unbound interface dependency.'],['Change the constructor dependency from public to private.','Property visibility does not select an interface implementation.'],['Add a return type to EmailReceiptSender::send().','A method return type cannot tell the container which class should satisfy the constructor interface.']],test:contract(src.container,['notInstantiable','isInstantiable()'],'Reflection can construct concrete classes but cannot instantiate an unbound interface.')}),
q({n:12,type:'E',sub:'package-bind-if-default',needs:['Container registration','Package defaults'],why:'Determine which registration wins when a package respects an existing binding.',lessons:[1],docs:['container#binding-basics'],ask:'A host application registers its renderer before a package supplies its default. What is printed?',code:[file(`app()->bind('renderer', fn () => 'host');
app()->bindIf('renderer', fn () => 'package');

echo app('renderer');`)],choices:[['host','bindIf leaves an existing binding intact, preserving the application override.'],['package','Unlike bind, bindIf does not unconditionally replace the prior binding.'],['hostpackage','Container registrations do not compose factory return values.'],['A duplicate-binding exception','Registering with bindIf is an intentional fallback operation, not an error on an existing binding.']],test:output('host')}),
q({n:13,type:'E',level:'F',sub:'container-instance-mutation',needs:['Object identity','Explicit instances'],why:'Track the identity of an object placed in the container.',lessons:[1],docs:['container#binding-instances'],ask:'What is printed after this preconfigured object is registered?',code:[file(`$settings = (object) ['region' => 'eu'];
app()->instance('settings', $settings);
$settings->region = 'ca';

echo app('settings')->region;`)],choices:[['ca','instance stores the same object, so the later property mutation is visible through resolution.'],['eu','The container does not clone the object or freeze its registration-time properties.'],['An undefined-property warning','The registered object has a region property throughout the example.'],['A binding-resolution exception','An explicit object instance is a valid container registration.']],test:output('ca')}),
q({n:14,type:'E',sub:'container-alias-shared-root',needs:['Aliases','Singleton identity'],why:'Follow two names to one cached abstract.',lessons:[1],docs:['container#binding-a-singleton'],ask:'What does the strict identity comparison print?',code:[file(`app()->singleton('primary.clock', fn () => new stdClass());
app()->alias('primary.clock', 'clock');

echo app('clock') === app('primary.clock') ? 'same' : 'different';`)],choices:[['same','The alias resolves to primary.clock, whose singleton instance is reused.'],['different','An alias does not create a second singleton cache for the alias name.'],['A circular-alias exception','The alias points one way to a distinct existing abstract; it does not create a cycle.'],['A class-not-found exception for clock','The container resolves the alias before attempting to build a class.']],test:output('same')}),
q({n:15,type:'E',sub:'container-call-named-parameters',needs:['Method invocation','Parameter names','Dependency injection'],why:'Combine explicit named scalar parameters with an injected object.',lessons:[1],docs:['container#method-invocation-and-injection'],ask:'What is printed by this container-managed invocation?',code:[file(`class Prefix
{
    public function value(): string
    {
        return 'INV';
    }
}

$format = function (Prefix $prefix, int $number): string {
    return $prefix->value().'-'.$number;
};

echo app()->call($format, ['number' => 27]);`)],choices:[['INV-27','call resolves Prefix and supplies number from the named parameter array.'],['A missing Prefix argument error','The container can construct Prefix because it has no unresolved dependencies.'],['A missing number argument error','The explicit number entry satisfies that scalar parameter.'],['27-INV','Arguments are matched to the declared parameters; the array does not reverse the function body.']],test:output('INV-27')}),
q({n:16,type:'I',sub:'contextual-primitive-config',needs:['Scalar constructor parameters','Contextual binding'],why:'Supply a primitive without globally binding a misleading class name.',lessons:[1],docs:['container#binding-primitives'],ask:'A plain ArchiveWriter has constructor parameter string $directory, with no default. The container builds it, and the configured path is storage_path("archives"). Which registration supplies this primitive only to ArchiveWriter?',choices:[['when(ArchiveWriter::class)->needs(\'$directory\')->give(fn () => storage_path("archives"))','Primitive contextual needs uses the parameter name prefixed with $, under the consuming class.'],['when(ArchiveWriter::class)->needs(string::class)->give(storage_path("archives"))','A primitive parameter is resolved by its parameter name, not a class binding for string.'],['bind(ArchiveWriter::class, storage_path("archives"))','The directory string is not an ArchiveWriter implementation or factory.'],['instance(\'$directory\', storage_path("archives"))','A global instance under this name is not the contextual primitive lookup performed for the constructor.']],test:contract(src.container,['resolvePrimitive','\'$\'.$parameter->getName()'],'Primitive contextual resolution uses the dollar-prefixed parameter name for the current consumer.')}),
q({n:17,type:'E',sub:'config-parameter-attribute',needs:['PHP attributes','Contextual Config injection'],why:'Distinguish attribute-based configuration from the parameter default.',lessons:[1],docs:['container#contextual-attributes'],ask:'What is printed when the container constructs this service?',code:[file(String.raw`use Illuminate\Container\Attributes\Config;

class ExportSettings
{
    public function __construct(
        #[Config('exports.format')] public string $format = 'txt',
    ) {
    }
}

config(['exports.format' => 'csv']);
echo app(ExportSettings::class)->format;`)],choices:[['csv','The Config attribute resolves exports.format from the configuration repository for the parameter.'],['txt','The parameter default does not override a value supplied by the contextual attribute.'],['exports.format','The attribute argument is a configuration key, not the injected literal string.'],['A missing scalar binding exception','The contextual attribute supplies the otherwise primitive constructor dependency.']],test:output('csv')}),
q({n:18,revision:2,type:'I',sub:'tagged-service-pipeline',needs:['Container tags','Iterable injection'],why:'Select an extensible group without changing a global interface binding.',lessons:[1],docs:['container#tagging'],ask:'Several packages contribute independent Check implementations. A coordinator must run all registered checks, and adding a package should not require editing its constructor. Which container arrangement directly supports this?',choices:[['Tag contributions as health.checks; inject tagged("health.checks").','Tags group separate registrations so the coordinator can consume all tagged services.'],['Bind Check repeatedly, once for each contributed implementation.','Repeated bindings for one abstract replace the selected implementation rather than accumulating a group.'],['Alias every contribution to the same health.checks abstract.','An alias identifies another abstract; it is not a collection of implementations.'],['Use bindIf(Check::class, ...) for every contribution.','Only the first eligible binding survives, so the coordinator does not receive all checks.']],test:contract(src.container,['public function tag(','public function tagged(','RewindableGenerator'],'Tag membership provides a lazy iterable of the separately registered services.')}),
q({n:19,type:'R',sub:'container-extension-decoration',needs:['Decorators','Container extension'],why:'Preserve a resolved dependency while adding behavior behind the same interface.',lessons:[1],docs:['container#extending-bindings'],ask:'A package owns the Search binding. The application wants a MetricsSearch decorator around the service the package actually resolves, including its private configuration. MetricsSearch implements Search and accepts a Search. Which approach preserves the package construction logic?',choices:[['extend(Search::class, fn (Search $inner) => new MetricsSearch($inner))','extend receives the resolved service and can replace it with a decorator that delegates to it.'],['bind(Search::class, MetricsSearch::class) with an unqualified Search constructor argument','Resolving Search inside its replacement can recurse instead of retrieving the original package service.'],['alias(Search::class, MetricsSearch::class)','An alias gives another name to the same service; it does not wrap calls with metrics behavior.'],['instance(Search::class, new MetricsSearch(new DefaultSearch()))','Constructing a new default bypasses the package-selected service and its private configuration.']],test:contract(src.container,['public function extend(','$closure($this->instances[$abstract], $this)'],'Extension wraps resolved services and is also retained for later resolutions.')}),
q({n:20,type:'E',sub:'resolving-callback-singleton-hit',needs:['Resolution callbacks','Singleton caching'],why:'Distinguish creating a service from retrieving a cached instance.',lessons:[1],docs:['container#container-events'],ask:'What count is printed? No service was resolved before this code.',code:[file(`app()->singleton('counter.service', fn () => new stdClass());
$count = 0;
app()->resolving('counter.service', function ($service) use (&$count): void {
    $count++;
});

app('counter.service');
app('counter.service');
echo $count;`)],choices:[['1','The first resolution builds the singleton and fires the callback; the cache hit returns before firing it again.'],['2','A cached singleton retrieval is not a fresh construction with another resolving callback.'],['0','The callback is registered before the first resolution, so it is invoked when the service is built.'],['A callback-arity error','The callback may accept the first supplied argument; the optional extra container argument need not be declared.']],test:output('1')}),
q({n:21,type:'E',sub:'make-with-parameter-cache-bypass',needs:['Singletons','Explicit parameter overrides'],why:'Trace parameterized resolution separately from a cached ordinary resolution.',lessons:[1],docs:['container#the-make-method'],ask:'What is printed? The binding uses the constructor default unless an explicit parameter is supplied.',code:[file(`class Label
{
    public function __construct(public string $text = 'base')
    {
    }
}

app()->singleton(Label::class);
$first = app(Label::class);
$custom = app()->makeWith(Label::class, ['text' => 'custom']);

echo $custom->text.':'.app(Label::class)->text;`)],choices:[['custom:base','Explicit parameters trigger a separate contextual build; that object does not replace the ordinary cached singleton.'],['base:base','makeWith parameters bypass the ordinary shared-instance return path for this resolution.'],['custom:custom','The parameterized build is not stored as the ordinary singleton in this case.'],['base:custom','This swaps the actual behavior of the parameterized resolution and subsequent ordinary resolution.']],test:output('custom:base')}),
q({n:22,type:'T',sub:'bound-versus-resolved-state',needs:['Container diagnostics','Lazy resolution'],why:'Choose a diagnostic that detects construction rather than registration.',lessons:[1],docs:['container#binding-basics'],ask:'A regression test must prove that a service is registered but has not yet been resolved. A fresh container has just executed singleton("report", $factory), with no aliases or instances. Which assertion pair tests that condition?',choices:[['bound("report") is true; resolved("report") is false.','Registration makes the abstract bound; lazy singleton registration alone does not resolve it.'],['bound("report") is false; resolved("report") is false.','The factory registration already makes bound true even before construction.'],['bound("report") is true; resolved("report") is true.','This would allow the eager resolution that the test is intended to catch.'],['isShared("report") is true; resolved("report") is true.','Shared lifetime says nothing about laziness, and expecting resolved true contradicts the requirement.']],test:output('[true,false]',String.raw`$c = new Illuminate\Container\Container();
$c->singleton('report', fn () => new stdClass());
echo json_encode([$c->bound('report'), $c->resolved('report')]);`)}),
q({n:23,type:'E',sub:'forget-instance-keeps-factory',needs:['Container instance reset','Singleton registration'],why:'Separate removal of one cached instance from removal of its binding.',lessons:[1],docs:['container#binding-a-singleton'],ask:'What is printed after the cached instance is forgotten?',code:[file(`$builds = 0;
app()->singleton('report', function () use (&$builds): object {
    $builds++;

    return new stdClass();
});

$old = app('report');
app()->forgetInstance('report');
$new = app('report');
echo $builds.':'.($old === $new ? 'same' : 'different');`)],choices:[['2:different','The factory remains registered, so a second object is built after the cached instance is removed.'],['1:same','forgetInstance removes the cached object from subsequent container resolution.'],['1:different','Obtaining a different object here requires invoking the retained factory again.'],['A binding-resolution exception','forgetInstance does not remove the factory binding.']],test:output('2:different')}),
q({n:24,type:'T',sub:'scope-reset-regression',needs:['Scoped services','Singleton identity tests'],why:'Test both reset scope and preservation of ordinary shared state.',docs:['container#binding-scoped-singletons'],ask:'A worker-lifecycle test registers scoped("job", $factory) and singleton("catalog", $factory). It resolves both, calls forgetScopedInstances(), then resolves both again. Which identity assertions verify the intended reset boundary?',choices:[['The job object changes; the catalog object remains identical.','Only abstracts registered as scoped have their cached instances removed by this reset.'],['Both objects change.','Ordinary singleton instances are not members of the scoped reset list.'],['Neither object changes.','The scoped job instance must be discarded at the lifecycle boundary.'],['The job object stays identical; the catalog object changes.','This reverses the intended lifetime distinction.']],test:output('[false,true]',String.raw`$c = new Illuminate\Container\Container();
$c->scoped('job', fn () => new stdClass());
$c->singleton('catalog', fn () => new stdClass());
$a = $c->make('job');
$b = $c->make('catalog');
$c->forgetScopedInstances();
echo json_encode([$a === $c->make('job'), $b === $c->make('catalog')]);`)}),
q({n:25,revision:2,type:'D',level:'M',sub:'facade-resolved-root-cache',needs:['Facades','Container instance replacement','Testing isolation'],why:'Trace two caches and repair only the stale facade root.',docs:['facades'],ask:'A test resolves a custom cached facade whose accessor is "currency". It later replaces the container instance under "currency", but the facade still calls the old object. No facade swap or rebinding hook is installed. Which next step makes the facade resolve the replacement?',choices:[['Call Facade::clearResolvedInstance("currency") before using the facade again.','Clearing the facade root cache causes the next facade call to resolve the new container instance.'],['Call app()->forgetInstance("currency") after registering the replacement.','This removes the desired replacement from the container while leaving the facade cache untouched.'],['Register an alias from "currency" to the facade class.','An alias does not invalidate the already cached facade root.'],['Clear the application cache store with Cache::flush().','Facade resolution state is a static in-process cache, not the configured application cache store.']],test:contract('Illuminate/Support/Facades/Facade.php',['static::$resolvedInstance[$name]','public static function clearResolvedInstance($name = null)'],'A cached facade can retain a root independently of the container instance cache.')}),
];
