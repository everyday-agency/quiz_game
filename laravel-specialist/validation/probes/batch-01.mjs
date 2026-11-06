import {output} from '../../authoring/record.mjs';
// Supplemental isolated witnesses for scenarios whose student-facing text does
// not include a complete runnable application. The assumptions remain visible.
export default {
10:output('CsvExporter:JsonExporter',String.raw`interface Exporter {}
class CsvExporter implements Exporter {}
class JsonExporter implements Exporter {}
class BillingReport
{
    public function __construct(public Exporter $exporter) {}
}
class AuditReport
{
    public function __construct(public Exporter $exporter) {}
}
app()->bind(Exporter::class, CsvExporter::class);
app()->when(AuditReport::class)->needs(Exporter::class)->give(JsonExporter::class);
echo get_class(app(BillingReport::class)->exporter).':'.get_class(app(AuditReport::class)->exporter);`),
11:output('unbound:EmailReceiptSender',String.raw`interface ReceiptSender {}
class EmailReceiptSender implements ReceiptSender {}
class InvoiceController
{
    public function __construct(public ReceiptSender $sender) {}
}
try {
    app(InvoiceController::class);
} catch (Illuminate\Contracts\Container\BindingResolutionException $e) {
    echo 'unbound:';
}
app()->bind(ReceiptSender::class, EmailReceiptSender::class);
echo get_class(app(InvoiceController::class)->sender);`),
16:output('archives',String.raw`class ArchiveWriter
{
    public function __construct(public string $directory) {}
}
app()->when(ArchiveWriter::class)->needs('$directory')->give(fn () => storage_path('archives'));
echo basename(app(ArchiveWriter::class)->directory);`),
18:output('disk,database',String.raw`app()->bind('check.disk', fn () => (object) ['name' => 'disk']);
app()->bind('check.database', fn () => (object) ['name' => 'database']);
app()->tag(['check.disk', 'check.database'], 'health.checks');
$names = [];
foreach (app()->tagged('health.checks') as $check) {
    $names[] = $check->name;
}
echo implode(',', $names);`),
19:output('MetricsSearch:package-selected',String.raw`interface Search
{
    public function name(): string;
}
class PackageSearch implements Search
{
    public function name(): string
    {
        return 'package-selected';
    }
}
class MetricsSearch implements Search
{
    public function __construct(public Search $inner) {}
    public function name(): string
    {
        return $this->inner->name();
    }
}
app()->bind(Search::class, PackageSearch::class);
app()->extend(Search::class, fn (Search $inner) => new MetricsSearch($inner));
$search = app(Search::class);
echo get_class($search).':'.$search->name();`),
25:output('old:old:new',String.raw`class CurrencyService
{
    public function __construct(public string $label) {}
    public function name(): string
    {
        return $this->label;
    }
}
class CurrencyFacade extends Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'currency';
    }
}
app()->instance('currency', new CurrencyService('old'));
echo CurrencyFacade::name().':';
app()->instance('currency', new CurrencyService('new'));
echo CurrencyFacade::name().':';
Illuminate\Support\Facades\Facade::clearResolvedInstance('currency');
echo CurrencyFacade::name();`),
41:output('string:Order',String.raw`class Order extends Illuminate\Database\Eloquent\Model
{
    public function resolveRouteBinding($value, $field = null)
    {
        return $this->forceFill(['id' => $value]);
    }
}
$a = app('router')->get('/bad/{order}', function (Order $purchase) {});
$b = app('router')->get('/good/{order}', function (Order $order) {});
$a->bind(Illuminate\Http\Request::create('/bad/7'));
$b->bind(Illuminate\Http\Request::create('/good/7'));
Illuminate\Routing\ImplicitRouteBinding::resolveForRoute(app(), $a);
Illuminate\Routing\ImplicitRouteBinding::resolveForRoute(app(), $b);
echo get_debug_type($a->parameter('order')).':'.get_debug_type($b->parameter('order'));`),
44:output('404:200',String.raw`Illuminate\Support\Facades\Schema::create('teams', function ($table) {
    $table->id();
});
Illuminate\Support\Facades\Schema::create('projects', function ($table) {
    $table->id();
    $table->unsignedBigInteger('team_id');
});
class Team extends Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
class Project extends Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;
}
Illuminate\Support\Facades\DB::table('teams')->insert([['id' => 3], ['id' => 9]]);
Illuminate\Support\Facades\DB::table('projects')->insert(['id' => 41, 'team_id' => 9]);
app('router')->get('/teams/{team}/projects/{project}', function (Team $team, Project $project) {
    return (string) $project->id;
})->scopeBindings()->middleware(Illuminate\Routing\Middleware\SubstituteBindings::class);
$response = app(Illuminate\Contracts\Http\Kernel::class)->handle(
    Illuminate\Http\Request::create('/teams/3/projects/41'),
);
echo $response->getStatusCode().':';
echo app(Illuminate\Contracts\Http\Kernel::class)->handle(
    Illuminate\Http\Request::create('/teams/9/projects/41'),
)->getStatusCode();`),
45:output('404:200',String.raw`Illuminate\Support\Facades\Schema::create('documents', function ($table) {
    $table->id();
    $table->softDeletes();
});
class Document extends Illuminate\Database\Eloquent\Model
{
    use Illuminate\Database\Eloquent\SoftDeletes;
    public $timestamps = false;
}
Illuminate\Support\Facades\DB::table('documents')->insert(['id' => 4, 'deleted_at' => '2025-01-01 00:00:00']);
app('router')->get('/normal/{document}', function (Document $document) {
    return 'found';
})->middleware(Illuminate\Routing\Middleware\SubstituteBindings::class);
app('router')->get('/restore/{document}', function (Document $document) {
    return 'found';
})->withTrashed()->middleware(Illuminate\Routing\Middleware\SubstituteBindings::class);
$kernel = app(Illuminate\Contracts\Http\Kernel::class);
echo $kernel->handle(Illuminate\Http\Request::create('/normal/4'))->getStatusCode().':';
echo $kernel->handle(Illuminate\Http\Request::create('/restore/4'))->getStatusCode();`),
46:output('302:/catalog',String.raw`class Product extends Illuminate\Database\Eloquent\Model
{
    public function resolveRouteBinding($value, $field = null)
    {
        return null;
    }
}
app('router')->get('/products/{product}', function (Product $product) {
    return 'found';
})->middleware(Illuminate\Routing\Middleware\SubstituteBindings::class)
    ->missing(fn () => redirect('/catalog'));
$r = app(Illuminate\Contracts\Http\Kernel::class)->handle(Illuminate\Http\Request::create('/products/404'));
echo $r->getStatusCode().':'.parse_url($r->getTargetUrl(), PHP_URL_PATH);`),
};
