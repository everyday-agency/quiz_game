import { roadmapBank } from './roadmap-question-helpers.mjs';

const s = (topic, concepts, lessons) => ({ topic, concepts, lessons });
const l = (title, snippet, behavior, pitfall) => ({ title, snippet, behavior, pitfall });

const specs = [
  s('Request lifecycle & middleware', ['what Laravel is', 'project structure', 'request-response flow', 'service providers', 'global middleware', 'route middleware'], [
    l('Provider registration before boot-time consumption', String.raw`final class BillingProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(Gateway::class, StripeGateway::class);
    }

    public function boot(Gateway $gateway): void {}
}`, 'the container binding exists before Laravel invokes provider boot methods and can be injected into boot', 'putting the binding only in boot makes it reliably available to every other provider while they boot'),
    l('Middleware unwinding around the downstream response', String.raw`public function handle(Request $request, Closure $next): Response
{
    $started = hrtime(true);
    try {
        return $next($request);
    } finally {
        Log::info('request.finished', ['ns' => hrtime(true) - $started]);
    }
}`, 'the finally block records timing whether downstream code returns normally or throws, while the exception still propagates', 'finally swallows the downstream exception or runs only for successful controller responses'),
  ]),
  s('Routing & model binding', ['basic routes', 'view routes', 'redirect routes', 'parameters', 'named routes', 'groups', 'route model binding', 'rate limiting', 'CORS', 'route caching'], [
    l('Scoped route binding through a parent relationship', String.raw`Route::scopeBindings()->group(function () {
    Route::get('/teams/{team}/projects/{project}',
        fn (Team $team, Project $project) => $project
    )->name('teams.projects.show');
});`, 'Laravel resolves the project through the bound team relationship and rejects a project owned by another team', 'a matching project primary key is accepted even when it does not belong to the bound team'),
    l('Named route generation inside a prefixed group', String.raw`Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/reports', ReportController::class)
        ->middleware('throttle:reports')
        ->name('reports');
});

$url = route('admin.reports');`, 'the generated URL is /admin/reports and the route also carries the reports rate limiter', 'the name prefix changes the URL path twice or the middleware runs while generating the URL'),
  ]),
  s('Container & service design', ['dependency injection', 'service container', 'contracts', 'facades', 'contextual binding'], [
    l('Contextual container binding for one consumer', String.raw`$this->app->when(ArchiveReport::class)
    ->needs(Filesystem::class)
    ->give(fn () => Storage::disk('archive'));

$this->app->bind(Filesystem::class,
    fn () => Storage::disk('local'));
`, 'ArchiveReport receives the archive disk while ordinary Filesystem consumers continue to receive the local disk', 'the contextual binding globally replaces Filesystem for every class in the application'),
    l('Request-scoped state in a long-lived worker', String.raw`$this->app->scoped(CurrentTenant::class, function () {
    return new CurrentTenant(request()->user()->tenant_id);
});

final class InvoiceController {
    public function __construct(private CurrentTenant $tenant) {}
}`, 'one CurrentTenant instance is shared within a request and flushed before the next Octane request or queue job lifecycle', 'scoped behaves like a process-wide singleton and intentionally carries the previous tenant forever'),
  ]),
  s('Validation & input', ['forms', 'manual validation', 'Form Requests', 'error messages', 'input normalization', 'validated data'], [
    l('Form Request authorization before controller work', String.raw`final class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('invoice'));
    }

    public function rules(): array
    {
        return ['amount' => ['required', 'numeric', 'min:0']];
    }
}`, 'Laravel can reject an unauthorized actor before the controller uses otherwise valid invoice input', 'validation rules prove ownership and therefore make the authorize method redundant'),
    l('Normalizing input before validation and using its safe shape', String.raw`protected function prepareForValidation(): void
{
    $this->merge(['email' => strtolower(trim((string) $this->email))]);
}

public function store(StoreUserRequest $request): Response
{
    $user = User::create($request->validated());
    return response($user, 201);
}`, 'the normalized email is validated and only fields admitted by the rules reach mass assignment', 'validated returns the complete request including any attacker-supplied administrative field'),
  ]),
  s('Authentication & authorization', ['starter-kit authentication', 'manual authentication', 'Sanctum', 'Passport', 'gates', 'policies', 'authorization'], [
    l('Policy authorization against the concrete model', String.raw`public function update(Request $request, Invoice $invoice): RedirectResponse
{
    Gate::authorize('update', $invoice);

    $invoice->update($request->validate([
        'memo' => ['required', 'string', 'max:500'],
    ]));

    return back();
}`, 'the policy decides whether the authenticated actor may update this invoice before the validated write occurs', 'successful validation automatically authorizes access to whichever invoice was bound'),
    l('Sanctum token abilities plus resource ownership', String.raw`Route::get('/servers/{server}', function (Request $request, Server $server) {
    abort_unless($request->user()->tokenCan('servers:read'), 403);
    Gate::authorize('view', $server);

    return new ServerResource($server);
})->middleware('auth:sanctum');`, 'the token ability limits the client capability while the policy independently enforces access to the specific server', 'tokenCan by itself proves that the token owner may read every server record'),
  ]),
  s('Migrations & schema design', ['database configuration', 'migrations', 'foreign keys', 'indexes', 'seeders'], [
    l('Foreign-key and uniqueness invariants in a migration', String.raw`Schema::create('memberships', function (Blueprint $table) {
    $table->id();
    $table->foreignId('team_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('role');
    $table->unique(['team_id', 'user_id']);
});`, 'the database prevents duplicate team-user memberships and removes child memberships when a referenced parent is deleted', 'Eloquent alone enforces the composite uniqueness even if the database migration omits it'),
    l('Reversible schema evolution with an explicit down path', String.raw`return new class extends Migration {
    public function up(): void {
        Schema::table('orders', fn (Blueprint $table) =>
            $table->timestamp('paid_at')->nullable()->index());
    }

    public function down(): void {
        Schema::table('orders', fn (Blueprint $table) =>
            $table->dropColumn('paid_at'));
    }
};`, 'up adds a nullable indexed timestamp and down removes that schema change during rollback', 'rollback guesses how to reverse every migration even when down contains no inverse operation'),
  ]),
  s('Eloquent state & assignment', ['CRUD', 'mass assignment', 'casts', 'accessors', 'mutators', 'dirty state'], [
    l('Mass assignment through a deliberately fillable model', String.raw`final class Profile extends Model
{
    protected $fillable = ['display_name', 'timezone'];

    protected function casts(): array
    {
        return ['settings' => 'array'];
    }
}

$profile->update($request->validated());`, 'only fillable attributes from the validated payload are mass assigned and settings values are exposed as arrays', 'fillable validates types and authorizes the current user to update the profile'),
    l('Dirty-state inspection before and after persistence', String.raw`$user->name = 'Grace';

$before = $user->isDirty('name');
$user->save();
$after = $user->wasChanged('name');
$stillDirty = $user->isDirty('name');
`, 'isDirty is true before save, wasChanged records the persisted change after save, and the saved attribute is no longer dirty', 'wasChanged predicts unsaved changes before persistence and remains identical to isDirty at every point'),
  ]),
  s('Relationships & pivots', ['one-to-one', 'one-to-many', 'many-to-many', 'pivot data', 'eager loading', 'relationship constraints'], [
    l('Updating a many-to-many pivot without detaching peers', String.raw`$project->members()->syncWithoutDetaching([
    $user->id => ['role' => 'reviewer'],
]);

$role = $project->members()
    ->whereKey($user->id)
    ->firstOrFail()
    ->pivot->role;`, 'the membership is inserted or updated while other existing project members remain attached', 'syncWithoutDetaching removes every member not included in the supplied array'),
    l('Selecting one related row with an aggregate relationship', String.raw`public function latestInvoice(): HasOne
{
    return $this->hasOne(Invoice::class)->ofMany([
        'issued_at' => 'max',
        'id' => 'max',
    ]);
}

$customers = Customer::with('latestInvoice')->get();`, 'ofMany selects the latest issued invoice per customer with id as a deterministic tie-breaker and eager loads it', 'hasOne automatically means the database contains only one invoice for each customer'),
  ]),
  s('Queries & performance', ['query builder', 'Eloquent queries', 'query scopes', 'pagination', 'eager loading'], [
    l('Filtering and counting the same constrained relationship', String.raw`$projects = Project::query()
    ->whereHas('tasks', fn ($q) => $q->where('status', 'open'))
    ->withCount(['tasks as open_tasks_count' =>
        fn ($q) => $q->where('status', 'open')])
    ->orderByDesc('open_tasks_count')
    ->paginate(20);`, 'only projects with open tasks are returned and each row includes the count used for ordering without loading all task models', 'withCount hydrates every related task object and whereHas counts tasks in PHP memory'),
    l('Chunking mutable rows by a stable primary key', String.raw`Order::query()
    ->whereNull('archived_at')
    ->lazyById(500)
    ->each(function (Order $order) {
        $order->update(['archived_at' => now()]);
    });`, 'lazyById advances by the primary key so updating the filtered column does not cause offset-based skips', 'ordinary offset pagination is guaranteed to visit every row while the same query changes its result set'),
  ]),
  s('Transactions & concurrency', ['database transactions', 'pessimistic locking', 'deadlocks', 'after commit'], [
    l('Serializing a read-check-write reservation', String.raw`DB::transaction(function () use ($seatId) {
    $seat = Seat::query()->lockForUpdate()->findOrFail($seatId);
    throw_if($seat->reserved, SeatTaken::class);

    $seat->update(['reserved' => true]);
}, attempts: 3);`, 'the row lock serializes competing reservations on the same seat and Laravel may retry the whole transaction after a deadlock', 'a transaction without a locking or atomic write automatically prevents two sessions from observing the same available seat'),
    l('Dispatching external work only after commit', String.raw`DB::transaction(function () use ($order) {
    $order->update(['status' => 'paid']);
    SendReceipt::dispatch($order->id)->afterCommit();
});

final class SendReceipt implements ShouldQueue
{
    use Queueable;
}`, 'the queued receipt becomes eligible only after the surrounding database transaction commits successfully', 'afterCommit makes the email and database commit one atomic operation that can be rolled back together'),
  ]),
  s('Events & observers', ['events', 'listeners', 'observers', 'queued listeners', 'event discovery'], [
    l('Observer execution after a successful database commit', String.raw`final class InvoiceObserver implements ShouldHandleEventsAfterCommit
{
    public function created(Invoice $invoice): void
    {
        InvoiceIndexed::dispatch($invoice->id);
    }
}

#[ObservedBy([InvoiceObserver::class])]
final class Invoice extends Model {}`, 'the observer handles the created event after the transaction commits instead of reacting to a row that may still roll back', 'model observers always run after commit even without the after-commit contract'),
    l('Stopping propagation in an event listener chain', String.raw`Event::listen(OrderPlaced::class, function (OrderPlaced $event) {
    if ($event->order->fraudulent) {
        return false;
    }
});

Event::listen(OrderPlaced::class, SendWarehouseRequest::class);`, 'returning false from the first listener stops later listeners for that event from being invoked', 'returning false rolls back every database change made before the event was dispatched'),
  ]),
  s('Queues & background work', ['queues', 'jobs', 'retry policy', 'unique jobs', 'job middleware', 'Horizon'], [
    l('Retry policy with backoff and an absolute deadline', String.raw`final class SyncCustomer implements ShouldQueue
{
    public int $tries = 5;
    public function backoff(): array { return [10, 60, 300]; }
    public function retryUntil(): DateTime { return now()->addHour(); }

    public function handle(CrmClient $crm): void {
        $crm->sync($this->customerId);
    }
}`, 'failed attempts use increasing delays but retries stop when the attempt limit or absolute retry deadline is reached', 'backoff makes the external CRM operation idempotent and guarantees it cannot run twice'),
    l('Preventing overlapping jobs for one resource', String.raw`public function middleware(): array
{
    return [
        (new WithoutOverlapping('invoice:' . $this->invoiceId))
            ->releaseAfter(30)
            ->expireAfter(180),
    ];
}`, 'jobs sharing the invoice lock key do not execute concurrently and a contending job is released for a later attempt', 'WithoutOverlapping permanently deduplicates every future job with the same invoice id'),
  ]),
  s('Cache & rate limiting', ['cache', 'atomic locks', 'stale-while-revalidate', 'rate limiting'], [
    l('Coordinating an expensive cache refresh with a lock', String.raw`$key = 'tenant:' . $tenantId . ':dashboard';

return Cache::lock('refresh:' . $key, 10)->block(3, function () use ($key) {
    return Cache::remember($key, 300, fn () => buildDashboard());
});`, 'the tenant participates in cache identity and one lock holder refreshes the expensive value at a time', 'the cache key can omit tenant identity because the lock prevents cross-tenant data reuse'),
    l('Serving stale data during background revalidation', String.raw`$users = Cache::flexible('users:active', [30, 120], function () {
    return User::query()->where('active', true)->get();
});

RateLimiter::for('imports', fn (Request $request) =>
    Limit::perMinute(10)->by($request->user()->id));`, 'flexible may serve a stale cached value during its stale window while scheduling refresh, and the limiter keys import attempts per user', 'the stale window means values never expire and the limiter shares one counter across every user'),
  ]),
  s('APIs, resources & Inertia', ['API resources', 'JSON', 'pagination', 'Inertia', 'Livewire', 'starter kits'], [
    l('Conditional relationship serialization in an API resource', String.raw`public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'members' => MemberResource::collection(
            $this->whenLoaded('members')
        ),
    ];
}`, 'members are serialized only when the controller deliberately loaded the relationship, avoiding a resource-triggered lazy query', 'whenLoaded automatically queries the relationship whenever the JSON client includes a members field'),
    l('Preserving paginator metadata in a resource collection', String.raw`public function index(): AnonymousResourceCollection
{
    $projects = Project::query()
        ->withCount('tasks')
        ->cursorPaginate(25);

    return ProjectResource::collection($projects);
}`, 'the resource collection transforms rows while Laravel keeps cursor pagination links and metadata in the response', 'wrapping a paginator in a resource collection converts it into an unpaginated in-memory array'),
  ]),
  s('Sessions, cookies & CSRF', ['sessions', 'cookies', 'CSRF', 'authentication session regeneration'], [
    l('Regenerating the session after manual authentication', String.raw`if (Auth::attempt($credentials, $request->boolean('remember'))) {
    $request->session()->regenerate();

    return redirect()->intended('/dashboard');
}

throw ValidationException::withMessages([
    'email' => 'Credentials do not match.',
]);`, 'a successful login rotates the session identifier before redirecting, reducing session-fixation risk', 'remember authentication rotates the session id automatically so explicit regeneration weakens security'),
    l('Sending a state-changing request with CSRF protection', String.raw`<form method="POST" action="/profile">
    @csrf
    @method('PUT')
    <input name="display_name" value="{{ old('display_name') }}">
    <button>Save</button>
</form>`, 'Blade emits a CSRF token field and method spoofing lets the POST request be routed as a PUT update', '@method changes the browser network request into a native HTTP PUT and therefore removes the need for a CSRF token'),
  ]),
  s('Files, mail & notifications', ['file storage', 'uploads', 'mail', 'notifications', 'temporary URLs'], [
    l('Storing an upload through an explicit filesystem disk', String.raw`$path = $request->file('avatar')->storePublicly(
    'avatars/' . $request->user()->id,
    's3',
);

$url = Storage::disk('s3')->temporaryUrl(
    $path,
    now()->addMinutes(10),
);`, 'the upload is stored on the s3 disk and the generated URL grants time-limited access to that object path', 'temporaryUrl moves the object into local public storage and makes it permanently public'),
    l('Queueing a notification after the model commit', String.raw`final class PaymentReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $paymentId)
    {
        $this->afterCommit();
    }
}`, 'the queued notification is dispatched after the database transaction commits, so workers do not observe an uncommitted payment', 'ShouldQueue alone makes notification delivery exactly once and automatically waits for every transaction'),
  ]),
  s('Testing & factories', ['Pest', 'PHPUnit', 'unit tests', 'feature tests', 'factories', 'fakes'], [
    l('Testing one queued side effect without running it', String.raw`Queue::fake();

$response = $this->postJson('/api/imports', [
    'file' => UploadedFile::fake()->create('users.csv', 20),
]);

$response->assertAccepted();
Queue::assertPushed(ProcessImport::class,
    fn ($job) => $job->userId === $this->user->id);`, 'the feature test exercises the HTTP boundary and asserts the job contract without executing background work', 'Queue::fake proves that the real worker, database connection, and external API all succeed in production'),
    l('Factory states and database assertions in Pest', String.raw`it('archives suspended accounts', function () {
    $account = Account::factory()->suspended()->create();

    artisan('accounts:archive')->assertSuccessful();

    expect($account->refresh()->archived_at)->not->toBeNull();
    $this->assertDatabaseHas('accounts', ['id' => $account->id]);
});`, 'the factory state creates the relevant precondition and the test reloads persisted state before asserting the command result', 'the in-memory model automatically reflects database updates made by a separate command without refresh'),
  ]),
  s('Configuration & deployment', ['configuration', 'environment variables', 'config cache', 'deployment', 'health route', 'Laravel Cloud', 'Forge'], [
    l('Reading environment values only while building configuration', String.raw`// config/services.php
return [
    'billing' => [
        'key' => env('BILLING_KEY'),
        'timeout' => 5,
    ],
];

// Application code
$key = config('services.billing.key');`, 'application code reads the cached configuration value instead of calling env after configuration has been cached', 'env remains a reliable runtime configuration API everywhere after config:cache'),
    l('Atomic deployment steps around cached framework state', String.raw`php artisan down --retry=60
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan event:cache
php artisan queue:restart
php artisan up`, 'the release rebuilds cached configuration, routes, and events and asks long-lived queue workers to restart gracefully', 'queue workers reload changed application code immediately without a restart signal because each job reboots PHP'),
  ]),
  s('Errors, logging & observability', ['error handling', 'exceptions', 'message customization', 'HTTP exceptions', 'logging', 'log stacks', 'Telescope', 'Debugbar'], [
    l('Attaching context while preserving normal exception reporting', String.raw`$exceptions->report(function (PaymentFailed $exception) {
    Log::withContext([
        'payment_id' => $exception->paymentId,
        'request_id' => request()->header('X-Request-ID'),
    ]);

    return false;
});`, 'returning false allows Laravel default reporting to continue while the added context enriches the log record', 'returning false marks the exception as handled and guarantees it will never reach configured log channels'),
    l('Routing an operational message through a log stack', String.raw`// config/logging.php
'payments' => [
    'driver' => 'stack',
    'channels' => ['daily', 'slack'],
    'ignore_exceptions' => false,
],

Log::channel('payments')->critical('Settlement failed', $context);`, 'one critical record is sent through both daily and Slack channels and channel failures are not intentionally ignored', 'a stack chooses only the first channel and prevents the remaining channels from receiving the record'),
  ]),
  s('Security & trust boundaries', ['encryption', 'hashing', 'Blade escaping', 'signed URLs', 'mass assignment', 'trust boundaries'], [
    l('Escaped Blade output beside deliberately trusted HTML', String.raw`<p>{{ $comment->body }}</p>

@if ($article->body_is_trusted)
    <section>{!! $article->sanitized_html !!}</section>
@endif

<a href="{{ URL::signedRoute('unsubscribe', ['user' => $user->id]) }}">
    Unsubscribe
</a>`, 'ordinary comment text is HTML escaped, while raw HTML is restricted to a value already sanitized under an explicit trust decision', 'Blade raw braces sanitize arbitrary user HTML automatically before inserting it into the page'),
    l('Hash verification without decrypting stored passwords', String.raw`if (! Hash::check($request->password, $user->password)) {
    throw ValidationException::withMessages([
        'password' => 'Current password is incorrect.',
    ]);
}

$user->password = Hash::make($request->new_password);
$user->save();`, 'Hash::check verifies the candidate against a one-way password hash and Hash::make stores a new one-way hash', 'Hash::check decrypts the stored password so the plaintext can be compared directly'),
  ]),
  s('Artisan & scheduling', ['Artisan', 'Sail', 'commands', 'task scheduling', 'Pint'], [
    l('Typed command input and meaningful exit status', String.raw`protected $signature = 'invoice:send {invoice} {--force}';

public function handle(): int
{
    $invoice = Invoice::findOrFail($this->argument('invoice'));
    $this->service->send($invoice, $this->option('force'));
    $this->components->info('Invoice sent');

    return self::SUCCESS;
}`, 'the command reads its declared argument and option, delegates work, and returns a successful process exit code', 'printing an info message determines the shell exit status even if handle returns failure'),
    l('Coordinating a scheduled task across servers', String.raw`Schedule::command('reports:daily')
    ->dailyAt('02:00')
    ->onOneServer()
    ->withoutOverlapping(30)
    ->runInBackground();`, 'one server acquires the scheduler lock and an overlap lock prevents another run from starting within the configured lock window', 'runInBackground removes the need for a shared cache driver and makes distributed locks process-local'),
  ]),
  s('Collections & data flow', ['collections', 'lazy collections', 'map', 'filter', 'reduce', 'higher-order operations'], [
    l('Pure mapping versus in-place collection transformation', String.raw`$source = collect([1, 2, 3]);

$mapped = $source->map(fn (int $value) => $value * 10);
$same = $source->transform(fn (int $value) => $value + 1);

dump($source->all(), $mapped->all(), $same === $source);`, 'map returns a new collection while transform mutates and returns the original collection instance', 'map and transform are aliases that always mutate the same underlying collection'),
    l('Streaming a large source with a lazy collection', String.raw`$lines = LazyCollection::make(function () use ($handle) {
    while (($line = fgets($handle)) !== false) {
        yield trim($line);
    }
});

$emails = $lines->filter()->map('strtolower')->take(1000)->all();`, 'the generator feeds values through the pipeline on demand and stops reading after enough matching results are taken', 'calling LazyCollection::make immediately reads the entire file into memory before filter runs'),
  ]),
  s('Seeders & data lifecycle', ['seeders', 'factories', 'factory states', 'upsert', 'idempotent data loading'], [
    l('Composing factory states with related models', String.raw`User::factory()
    ->count(10)
    ->has(Post::factory()->count(3)->published())
    ->create();

Admin::factory()->for(User::factory())->create();`, 'factories create ten users with three published posts each and a separate admin related to its generated user', 'has changes only an in-memory relationship and never inserts related database rows'),
    l('Idempotent reference-data seeding with upsert', String.raw`Country::upsert([
    ['code' => 'CH', 'name' => 'Switzerland'],
    ['code' => 'DE', 'name' => 'Germany'],
], uniqueBy: ['code'], update: ['name']);

$this->call([RoleSeeder::class, PermissionSeeder::class]);`, 're-running the seed updates country names by stable code instead of inserting duplicate reference rows', 'upsert always deletes every existing row not present in the supplied batch'),
  ]),
  s('Application architecture', ['controllers', 'resource controllers', 'single-action controllers', 'dependency injection', 'services', 'contracts', 'facades'], [
    l('Thin controller delegating a use case to an injected action', String.raw`final class PublishProjectController
{
    public function __invoke(Project $project, PublishProject $publish): RedirectResponse
    {
        Gate::authorize('publish', $project);
        $publish($project);

        return to_route('projects.show', $project);
    }
}`, 'the single-action controller owns HTTP authorization and redirection while the injected action owns reusable publishing behavior', 'placing the operation in an action means commands and jobs automatically receive the controller authorization check'),
    l('Binding a domain contract to infrastructure', String.raw`interface PaymentGateway
{
    public function charge(Money $amount, string $token): Receipt;
}

$this->app->bind(PaymentGateway::class, StripeGateway::class);

final class Checkout
{
    public function __construct(private PaymentGateway $gateway) {}
}`, 'Checkout depends on a stable contract and the container chooses the concrete infrastructure implementation', 'the interface creates a Stripe client at runtime even without a container binding or concrete implementation'),
  ]),
  s('Production performance & operations', ['Octane', 'Pulse', 'health route', 'optimization', 'deployment monitoring', 'package management'], [
    l('Avoiding request data in an Octane singleton', String.raw`$this->app->singleton(RequestAudit::class, function () {
    return new RequestAudit();
});

final class RequestAudit
{
    public function record(Request $request): void
    {
        Log::info('request', ['user_id' => $request->user()?->id]);
    }
}`, 'the long-lived singleton stores no request-specific value and receives the current request only for the duration of record', 'capturing request or user in a singleton constructor is safe because Octane rebuilds every singleton for every request'),
    l('Production health and performance instrumentation', String.raw`Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )->create();

Pulse::handleExceptionsUsing(fn ($e) => report($e));`, 'the application exposes the configured health endpoint and forwards Pulse ingestion failures through normal exception reporting', 'a successful health endpoint proves every database, queue, cache, and third-party dependency is fully operational'),
  ]),
];

export const laravelRoadmapQuestions = roadmapBank('Laravel', 'php', specs);

