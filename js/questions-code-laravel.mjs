import { codeLab, codeQuestion as c } from './code-question-helpers.mjs';

const request = 'Request lifecycle & middleware';
const routing = 'Routing & model binding';
const container = 'Container & service design';
const validation = 'Validation & input';
const auth = 'Authentication & authorization';
const migrations = 'Migrations & schema design';
const eloquent = 'Eloquent state & assignment';
const relationships = 'Relationships & pivots';
const queries = 'Queries & performance';
const transactions = 'Transactions & concurrency';
const events = 'Events & observers';
const queues = 'Queues & background work';
const cache = 'Cache & rate limiting';
const api = 'APIs, resources & Inertia';
const sessions = 'Sessions, cookies & CSRF';
const files = 'Files, mail & notifications';
const testing = 'Testing & factories';
const config = 'Configuration & deployment';
const errors = 'Errors, logging & observability';
const security = 'Security & trust boundaries';
const artisan = 'Artisan & scheduling';
const collections = 'Collections & data flow';
const seeders = 'Seeders & data lifecycle';
const architecture = 'Application architecture';
const production = 'Production performance & operations';

export const laravelCodeQuestions = [
  ...codeLab(request, 'php', 'Middleware around the downstream request pipeline', String.raw`final class MeasureRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $started = hrtime(true);

        try {
            return $next($request);
        } finally {
            Log::info('request.finished', [
                'elapsed_ns' => hrtime(true) - $started,
            ]);
        }
    }
}`, [
    c('Foundation', 'If a controller throws an exception, what happens to the logging call in this middleware?',
      ['The finally block still runs while the exception continues outward', 'The finally block is skipped because return was already evaluated', 'Laravel converts the exception to null before finally', 'The controller is automatically retried inside the middleware'],
      'PHP executes finally whether the try block returns or throws. The log runs, but the middleware does not swallow the exception because it has no catch block.'),
    c('Applied', 'Which work is included in the elapsed time measured by this middleware implementation?',
      ['Everything executed inside the downstream $next call until it returns or throws', 'Only routing work completed before this middleware starts', 'Only SQL queries issued by the controller', 'Only work performed after the response reaches the browser'],
      'The timer surrounds the call to the next layer, so it measures deeper middleware, controller execution, and response construction enclosed by that call.'),
    c('Applied', 'How would a terminable middleware differ from the finally block shown in this code?',
      ['Its terminate method runs after the response has been sent to the client', 'It runs before route matching and can never access a response', 'It automatically executes inside the database transaction', 'It replaces the handle method and skips the request pipeline'],
      'Terminable middleware is designed for post-response work. A finally block runs as the normal pipeline unwinds, before Laravel finishes sending the response.'),
    c('Advanced', 'The team must add a header to the actual response. What change is strongest?',
      ['Store $next($request) in a response variable, modify its headers, then return it', 'Add the header only inside the finally block without retaining the response', 'Move the header into terminate because terminate changes sent bytes', 'Write the header into the latest migration'],
      'Response mutation requires a reference to the response while it is still traveling outward. Post-response termination is too late to change what the client receives.'),
  ]),

  ...codeLab(routing, 'php', 'Scoped route model binding for nested resources', String.raw`Route::scopeBindings()->group(function () {
    Route::get('/accounts/{account}/projects/{project}',
        [ProjectController::class, 'show']);
});

final class ProjectController
{
    public function show(Account $account, Project $project): View
    {
        return view('projects.show', compact('account', 'project'));
    }
}`, [
    c('Foundation', 'How is the project parameter resolved when scoped bindings are active for this nested route?',
      ['Through the projects relationship of the already bound account', 'By searching every project and checking the account in Blade', 'From the session rather than the route value', 'By using the controller class name as the foreign key'],
      'Scoped binding constrains child resolution through the parent relationship, so an unrelated project ID is not freely resolved under another account.'),
    c('Applied', 'What security responsibility is not completely replaced by scopeBindings in this controller?',
      ['Authorization of the current user to view the resolved project', 'Parsing the project route parameter', 'Returning a 404 for a missing child', 'Selecting the account relationship used for binding'],
      'Scoped binding controls record resolution. A policy or gate must still decide whether the authenticated actor may perform the requested action.'),
    c('Applied', 'What happens before show runs if the project does not belong to the bound account?',
      ['Child binding fails and Laravel returns a missing-resource response', 'Laravel injects a Project instance with null attributes', 'The controller receives the project from another account', 'The account binding is silently removed'],
      'The child cannot be resolved through the parent relationship, so model binding fails before the controller method executes.'),
    c('Advanced', 'If projects use a slug instead of the primary key, which model API defines the default binding column?',
      ['getRouteKeyName', 'getFillable', 'getConnectionName', 'getMorphClass'],
      'getRouteKeyName controls the model attribute used for route model binding. Fillable, connection, and morph APIs serve unrelated concerns.'),
  ]),

  ...codeLab(container, 'php', 'Request-scoped state in a long-lived Laravel process', String.raw`final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(TenantContext::class, function (Application $app) {
            return new TenantContext($app['request']->user()?->tenant_id);
        });
    }
}`, [
    c('Foundation', 'Why is scoped preferable to singleton for this TenantContext under a long-lived worker?',
      ['A new instance is created for each request or job lifecycle', 'A scoped binding is serialized into every database row', 'Singletons cannot receive constructor arguments', 'Scoped services bypass the service container'],
      'A singleton can retain the first request tenant for later requests in the same worker. Scoped lifetime resets the instance at the lifecycle boundary.'),
    c('Applied', 'How does bind differ from scoped for repeated resolutions during one request?',
      ['bind may create a new instance on each resolution, while scoped reuses one within the request', 'bind persists forever while scoped never creates an object', 'bind is only for interfaces and scoped only for models', 'There is no lifetime difference between the two APIs'],
      'Transient bindings are resolved anew, whereas scoped bindings share one instance inside the current lifecycle and flush it before the next lifecycle.'),
    c('Applied', 'What hidden dependency does the closure in this binding reveal?',
      ['TenantContext creation depends on the current request and authenticated user', 'TenantContext is independent from all entry points', 'The database schema automatically supplies tenant_id', 'The service can be safely resolved before a request exists in every context'],
      'The factory reads the request and user, so resolving it in a console or early boot context needs deliberate handling of the absent request identity.'),
    c('Advanced', 'A command needs an explicit tenant that is unrelated to an HTTP request. What design is clearest?',
      ['Pass the tenant identity explicitly to the command or domain operation', 'Fabricate a global Request object for the command', 'Convert TenantContext back to an application singleton', 'Read the last tenant from a static property'],
      'Explicit input makes the non-HTTP ownership boundary visible and avoids coupling domain behavior to whichever request happens to exist.'),
  ]),

  ...codeLab(validation, 'php', 'Validated input and normalization in a Form Request', String.raw`final class StoreProjectRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'budget' => ['required', 'decimal:0,2', 'min:0'],
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge(['name' => $this->string('name')->trim()->toString()]);
    }
}`, [
    c('Foundation', 'Which payload should the controller pass to Project::create after this request succeeds?',
      ['$request->validated() or $request->safe()->all()', '$request->all() including every client field', '$_POST without Laravel validation', '$request->headers->all()'],
      'validated and safe expose the accepted input shape. all can include unvalidated administrative fields and broadens the mass-assignment boundary.'),
    c('Applied', 'When does passedValidation execute in relation to the rules method?',
      ['After validation succeeds, allowing normalization before controller use', 'Before rules are evaluated, so it decides whether rules exist', 'Only after the model has been saved', 'Only when validation fails'],
      'passedValidation is a post-validation hook. It is suitable for normalizing already accepted values before the request reaches the controller.'),
    c('Applied', 'What concern belongs in the authorize method rather than in these rules?',
      ['Whether the signed-in user may create a project for the selected account', 'Whether budget has at most two decimal places', 'Whether name is shorter than 120 characters', 'Whether required fields are present'],
      'Rules validate data shape. authorize handles the actor-and-resource permission decision and can reject a perfectly shaped but unauthorized request.'),
    c('Advanced', 'Why is the database still responsible for a unique project-name constraint?',
      ['Two concurrent requests can both pass an application uniqueness check', 'Form Requests never execute SQL queries', 'Database constraints only improve error messages', 'The max rule automatically creates a unique index'],
      'Request validation improves feedback but cannot serialize concurrent writes. A database constraint is the final authority for persistent uniqueness.'),
  ]),

  ...codeLab(auth, 'php', 'Gate interception and authorization results', String.raw`Gate::before(function (User $user, string $ability) {
    return $user->isAdministrator() ? true : null;
});

Gate::define('publish', function (User $user, Project $project) {
    return $user->id === $project->owner_id
        && $project->status === 'draft';
});`, [
    c('Foundation', 'What does returning null from the Gate::before callback mean for a non-administrator?',
      ['Continue to the normal gate or policy check', 'Allow the ability automatically', 'Deny every ability automatically', 'Log the user out before checking'],
      'A before callback returns a decisive boolean only when it wants to override. Null delegates the decision to the defined ability or policy.'),
    c('Applied', 'What would change if the non-administrator branch returned false instead of null?',
      ['Every intercepted ability would be denied before its normal rule runs', 'Only publish would be denied after its rule runs', 'The before callback would be ignored', 'Laravel would convert false to null'],
      'False is a final denial in the interception hook. Returning it broadly would prevent all later gate and policy checks for that user.'),
    c('Applied', 'How does Gate::authorize differ from Gate::allows when the publish decision is false?',
      ['authorize throws an authorization exception; allows returns a boolean', 'allows throws while authorize returns null', 'authorize updates the project status', 'They both always return the User model'],
      'Gate::allows is useful for branching, while Gate::authorize enforces the boundary by throwing an exception that Laravel normally renders as 403.'),
    c('Advanced', 'Why must the project status condition remain server-side even if the Publish button is hidden in Blade?',
      ['A client can call the route directly without using the rendered button', 'Blade visibility creates a database lock', 'Hidden buttons disable route model binding', 'Gate checks run only in JavaScript'],
      'UI visibility improves experience but is not enforcement. The request boundary must repeat the authorization decision for every direct call.'),
  ]),

  ...codeLab(migrations, 'php', 'Foreign keys and composite indexes in a migration', String.raw`Schema::table('orders', function (Blueprint $table) {
    $table->foreignId('account_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->index(['account_id', 'created_at'], 'orders_account_created');
});`, [
    c('Foundation', 'What persistent rule is created by constrained on account_id?',
      ['Each non-null account_id must reference an existing account row', 'Every account may have only one order', 'Orders are automatically authorized for the current user', 'The account is copied into the orders table'],
      'The foreign key enforces referential existence. It does not enforce authorization or uniqueness of the child relationship.'),
    c('Applied', 'What does cascadeOnDelete do when an account row is deleted?',
      ['The database deletes referencing order rows as part of the referential action', 'Laravel soft-deletes the account instead', 'Only the composite index is removed', 'The delete is rejected in every case'],
      'The foreign-key action propagates the parent delete to children. This is a data-lifecycle decision and should be chosen deliberately.'),
    c('Applied', 'Which query best matches the leftmost order of the composite index?',
      ['Filter account_id and order by created_at', 'Filter only created_at with no account condition', 'Filter only total_amount', 'Order by status and customer_name'],
      'A B-tree composite index is naturally organized first by account_id and then by created_at within each account value.'),
    c('Advanced', 'What should the down migration do to reverse this change safely?',
      ['Drop the foreign key and named index before dropping account_id', 'Delete all accounts and keep the column', 'Call cascadeOnDelete a second time', 'Clear the application cache only'],
      'Rollback should reverse schema dependencies in a valid order. Constraints and indexes referencing a column must be removed before the column.'),
  ]),

  ...codeLab(eloquent, 'php', 'Dirty state, saved changes, and model refresh', String.raw`$user = User::findOrFail($id);
$user->fill(['name' => 'Ada', 'role' => 'admin']);

$dirtyBeforeSave = $user->isDirty('name');
$user->save();
$changedAfterSave = $user->wasChanged('name');
$user->refresh();`, [
    c('Foundation', 'Assuming name was different before fill, what is dirtyBeforeSave?',
      ['true, because the in-memory name differs from the original value', 'false, because dirty state exists only after save', 'null, because fill clears original values', 'A database query builder instance'],
      'isDirty compares current in-memory attributes with the model original snapshot before persistence.'),
    c('Applied', 'What does wasChanged check after save completes?',
      ['Whether the named attribute changed during the most recent save', 'Whether the attribute is currently fillable', 'Whether any database row has ever changed', 'Whether refresh will throw an exception'],
      'wasChanged refers to changes persisted by the last save operation, unlike isDirty which describes unsaved current differences.'),
    c('Applied', 'How does refresh differ from fresh in Eloquent?',
      ['refresh reloads the same instance; fresh returns a new model instance', 'fresh mutates the current instance; refresh returns a query builder', 'refresh only reloads relationships and never attributes', 'There is no behavioral difference'],
      'refresh updates the existing object from the database, while fresh performs a new query and returns another model object.'),
    c('Advanced', 'What security condition determines whether role is assigned by fill?',
      ['The model mass-assignment configuration must allow the role attribute', 'The role column must be alphabetically first', 'isDirty automatically authorizes role changes', 'refresh adds every guarded attribute'],
      'fill respects fillable or guarded configuration, but authorization must still decide whether this actor is allowed to assign a privileged role.'),
  ]),

  ...codeLab(relationships, 'php', 'Synchronizing a many-to-many pivot with attributes', String.raw`$project->users()->sync([
    $ownerId => ['role' => 'owner'],
    $editorId => ['role' => 'editor'],
], detaching: false);

$project->load('users');
$role = $project->users->firstWhere('id', $editorId)?->pivot->role;`, [
    c('Foundation', 'What does detaching: false change in this sync call?',
      ['Existing pivot rows omitted from the input are kept', 'Every existing user is detached first', 'Pivot attributes are ignored', 'The relationship becomes one-to-one'],
      'syncWithoutDetaching behavior adds or updates the supplied memberships without deleting other existing memberships.'),
    c('Applied', 'Which relationship configuration is needed to expose role reliably on the pivot model?',
      ['Include role with withPivot on the belongsToMany relationship', 'Add role to the Project fillable array only', 'Call withoutGlobalScopes on User', 'Rename the pivot table to roles'],
      'withPivot selects additional pivot columns when hydrating related models. Fillable on the parent model does not control pivot selection.'),
    c('Applied', 'Which API updates only the editor membership role without synchronizing the whole set?',
      ['updateExistingPivot($editorId, [role data])', 'associate($editorId)', 'touchOwners($editorId)', 'saveQuietly($editorId)'],
      'updateExistingPivot targets attributes on one existing many-to-many row without treating the input as the complete membership set.'),
    c('Advanced', 'What database rule prevents two identical project-user pivot rows under concurrent requests?',
      ['A unique constraint on the project_id and user_id pair', 'Calling load after every sync', 'Ordering users by role', 'Hiding the pivot property in JSON'],
      'Application relationship APIs can race. A composite unique constraint is the authoritative guarantee that one membership pair appears once.'),
  ]),

  ...codeLab(queries, 'php', 'Relationship existence, counts, and cursor pagination', String.raw`$projects = Project::query()
    ->whereHas('tasks', fn ($q) => $q->where('status', 'open'))
    ->withCount(['tasks as open_tasks_count' =>
        fn ($q) => $q->where('status', 'open')])
    ->orderBy('id')
    ->cursorPaginate(50);`, [
    c('Foundation', 'When this project query executes, what does whereHas contribute to its result?',
      ['It filters projects to those having at least one matching open task', 'It loads every task model into PHP memory', 'It creates an open_tasks_count column in the schema', 'It disables the relationship definition'],
      'whereHas adds a relationship-existence condition to the parent query. It filters parents without hydrating the related collection.'),
    c('Applied', 'What does withCount add to each returned project?',
      ['A computed open_tasks_count attribute produced by the query', 'A loaded collection named open_tasks_count', 'A permanent database column', 'A cache entry shared by all projects'],
      'withCount uses a related aggregate subquery and exposes the result as an attribute without loading all matching Task objects.'),
    c('Applied', 'Why is orderBy(id) important for cursor pagination?',
      ['The cursor needs a deterministic ordered value to continue from', 'It causes MySQL to skip all indexes', 'It makes every page use OFFSET internally', 'It authorizes access to later pages'],
      'Cursor pagination encodes ordered column values and continues after them, so the order must be deterministic and suitable for comparison.'),
    c('Advanced', 'Compared with offset pagination on a changing table, what benefit does cursorPaginate provide?',
      ['It avoids scanning and skipping an ever-growing offset and reduces row shifting between pages', 'It returns every row in one response', 'It guarantees a transaction across the user session', 'It removes the need for any index'],
      'Cursor pagination seeks from the last ordered value. A matching index is still important, and changing rows can still require product-level decisions.'),
  ]),

  ...codeLab(transactions, 'php', 'Pessimistic locking with post-commit work', String.raw`DB::transaction(function () use ($account, $amount) {
    $locked = Account::query()
        ->whereKey($account->id)
        ->lockForUpdate()
        ->firstOrFail();

    $locked->decrement('balance', $amount);

    DB::afterCommit(fn () => ReceiptJob::dispatch($locked->id));
});`, [
    c('Foundation', 'How long is the row lock acquired by lockForUpdate normally held?',
      ['Until the surrounding transaction commits or rolls back', 'Only until firstOrFail returns', 'Until the PHP worker restarts', 'Permanently after decrement'],
      'A pessimistic row lock belongs to the database transaction and is released when that transaction ends.'),
    c('Applied', 'Why is lockForUpdate meaningful only inside a transaction for this decision?',
      ['The read and subsequent balance update must share one protected transaction boundary', 'It automatically starts a queue worker outside transactions', 'It changes the Account primary key', 'It validates the amount input'],
      'Without a surrounding transaction, the lock can be released before the dependent write, leaving the check-update sequence exposed to races.'),
    c('Applied', 'What guarantee does DB::afterCommit provide for dispatching ReceiptJob?',
      ['The callback runs only after a successful outer transaction commit', 'The job runs synchronously before decrement', 'The queue and database commit atomically on one server', 'The callback also runs after rollback'],
      'afterCommit prevents work from being dispatched for a transaction that later rolls back. It does not make the queue transport part of the database commit.'),
    c('Advanced', 'What additional rule is required before decrement to prevent a negative balance?',
      ['Check the locked balance or use an atomic conditional update before writing', 'Move the receipt job before the lock', 'Replace the transaction with Cache::remember', 'Call refresh after the response'],
      'Locking serializes competitors, but business correctness still needs an explicit condition that rejects amounts exceeding the available balance.'),
  ]),

  ...codeLab(events, 'php', 'Observers that wait for committed database state', String.raw`final class OrderObserver implements ShouldHandleEventsAfterCommit
{
    public function created(Order $order): void
    {
        AuditOrder::dispatch($order->id);
    }
}

$order->updateQuietly(['last_viewed_at' => now()]);`, [
    c('Foundation', 'Why implement ShouldHandleEventsAfterCommit on this observer?',
      ['Its handlers wait until the surrounding database transaction commits', 'It makes every event synchronous', 'It disables all model events globally', 'It turns the observer into middleware'],
      'After-commit handling avoids dispatching work for model state that may still roll back in the current transaction.'),
    c('Applied', 'What is the effect of updateQuietly in the final line?',
      ['The model is updated without dispatching its normal model events', 'The SQL update is skipped completely', 'The update is always rolled back', 'Only the created event is dispatched'],
      'Quiet persistence performs the write while suppressing model event dispatch, which can prevent recursive observer behavior for bookkeeping changes.'),
    c('Applied', 'What risk remains if AuditOrder is retried after partially completing an external side effect?',
      ['The job needs idempotency because retries can repeat ordinary handler code', 'Observers guarantee exactly-once delivery', 'The database automatically rolls back the external service', 'ShouldHandleEventsAfterCommit disables retries'],
      'Committing before dispatch solves visibility of database state, not exactly-once execution. Retry-safe external work needs an idempotency design.'),
    c('Advanced', 'When is a domain event preferable to hiding all behavior in an Eloquent observer?',
      ['When the business transition should be explicit and testable at the use-case boundary', 'Whenever the application has no models', 'Only when route caching is disabled', 'When every save should trigger the same invisible side effect'],
      'Explicit domain events make intentional business transitions visible, while observers are often better for narrowly model-oriented cross-cutting behavior.'),
  ]),

  ...codeLab(queues, 'php', 'Unique queued work, retry delays, and expiry', String.raw`final class ImportFeed implements ShouldQueue, ShouldBeUnique
{
    public int $uniqueFor = 900;

    public function uniqueId(): string { return (string) $this->feedId; }
    public function backoff(): array { return [10, 60, 300]; }
    public function retryUntil(): DateTime { return now()->addMinutes(20); }

    public function handle(FeedImporter $importer): void
    {
        $importer->run($this->feedId);
    }
}`, [
    c('Foundation', 'What does ShouldBeUnique use uniqueId for in this job?',
      ['Preventing another queued instance with the same feed identity while the unique lock exists', 'Choosing the queue connection password', 'Making every import globally unique forever', 'Replacing database uniqueness constraints'],
      'The unique job contract uses a cache lock keyed by the job identity. Its guarantee is bounded by lock storage and expiry.'),
    c('Applied', 'How is the backoff array interpreted across repeated exceptions?',
      ['It supplies progressively longer delays before later retry attempts', 'It limits the job to exactly three lines of output', 'It runs three workers at the same time', 'It defines transaction savepoints'],
      'Backoff controls retry timing. The array lets early retries happen sooner while later failures wait longer.'),
    c('Applied', 'What does retryUntil add beyond a numeric tries property?',
      ['A time horizon after which the job should no longer be attempted', 'A guarantee that the external feed is available', 'An automatic rollback of remote API calls', 'A unique database index'],
      'retryUntil expresses an expiry time for attempts. It does not make a failed operation safe or available.'),
    c('Advanced', 'Why must FeedImporter::run still be idempotent despite ShouldBeUnique?',
      ['A running job can fail after a side effect and then be retried', 'Unique jobs execute exactly once by protocol', 'backoff removes every duplicate external request', 'uniqueFor opens a database transaction'],
      'Queue delivery remains at least once in failure scenarios. Uniqueness reduces simultaneous duplicates but does not undo a partial attempt.'),
  ]),

  ...codeLab(cache, 'php', 'Distributed locks and stale-while-revalidate caching', String.raw`$result = Cache::lock("invoice:{$invoiceId}", 10)
    ->block(3, fn () => generateInvoice($invoiceId));

$rates = Cache::flexible('exchange-rates', [5, 30], function () {
    return $this->ratesApi->latest();
});`, [
    c('Foundation', 'What do the 10 and 3 represent in the Cache::lock expression?',
      ['A ten-second lock lease and up to three seconds waiting to acquire it', 'Three retries each lasting ten minutes', 'A cache value lifetime and database timeout', 'The invoice ID and queue priority'],
      'The lock lease bounds ownership if a process disappears, while block controls how long this caller waits for acquisition.'),
    c('Applied', 'What failure can occur if generateInvoice runs longer than the ten-second lease?',
      ['Another process may acquire the expired lock while the first process still works', 'The callback is guaranteed to finish at exactly ten seconds', 'Laravel extends every lease automatically forever', 'The invoice row is deleted'],
      'A lease is not proof that work finished. Long operations need an appropriate lease, restoration strategy, or independently idempotent behavior.'),
    c('Applied', 'How does Cache::flexible behave during the stale interval after five seconds but before thirty?',
      ['It may serve the stale value and defer recomputation', 'It always blocks every request on the rates API', 'It deletes the cache and returns null', 'It creates a database transaction'],
      'Flexible caching implements stale-while-revalidate behavior: callers can receive recent stale data while refresh work is deferred.'),
    c('Advanced', 'Why is Cache::remember alone not a complete stampede-prevention mechanism?',
      ['Several misses can compute the same expensive value concurrently without a lock', 'remember never stores values', 'remember only accepts integers', 'remember automatically serializes all application traffic'],
      'Remember combines lookup and storage but does not necessarily provide mutual exclusion around the cache-miss computation.'),
  ]),

  ...codeLab(api, 'php', 'Conditional fields in an API resource', String.raw`final class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'tasks_count' => $this->whenCounted('tasks'),
            'secret' => $this->when($request->user()->is_admin, $this->secret),
        ];
    }
}`, [
    c('Foundation', 'Does whenLoaded owner load the relationship by itself?',
      ['No; it includes owner only when the controller or query already loaded it', 'Yes; it always executes a new query inside the resource', 'Yes; it converts owner into a database column', 'No; it always removes owner even when loaded'],
      'whenLoaded is a conditional serialization guard. Eager loading remains the responsibility of the query or controller.'),
    c('Applied', 'What preparation makes tasks_count appear without loading every Task model?',
      ['Use withCount or loadCount for the tasks relationship', 'Call tasks->all inside the resource', 'Add tasks_count to fillable only', 'Store the count in the session'],
      'whenCounted detects a relationship count loaded by aggregate APIs, allowing the resource to expose the number without hydrating the full collection.'),
    c('Applied', 'What must remain true even though secret is wrapped in a conditional field?',
      ['The server must authorize the request; hiding a field is not resource authorization', 'The frontend decides whether is_admin is true', 'Resource conditions encrypt the value automatically', 'The secret may be loaded from any tenant'],
      'Conditional output prevents accidental exposure in this representation, but the endpoint still needs an explicit access decision and scoped data query.'),
    c('Advanced', 'Why can directly reading $this->owner in every resource row create an N+1 problem?',
      ['Lazy loading can issue one owner query per serialized project', 'JsonResource serializes only one project', 'Relationships are always joined automatically', 'Resource classes disable database access'],
      'Accessing an unloaded relationship may trigger a query for each model. Explicit eager loading makes query cost visible and bounded.'),
  ]),

  ...codeLab(sessions, 'php', 'Session ID rotation and one-time values', String.raw`public function login(LoginRequest $request): RedirectResponse
{
    Auth::attempt($request->validated());
    $request->session()->regenerate();

    $notice = $request->session()->pull('login_notice', 'Welcome');

    return redirect()->intended('/dashboard')->with('notice', $notice);
}`, [
    c('Foundation', 'Why regenerate the session after successful authentication?',
      ['To rotate the session identifier and reduce session-fixation risk', 'To delete the authenticated user record', 'To disable CSRF protection', 'To make the session permanent'],
      'Authentication changes the trust level of the session. Rotating its identifier prevents continued use of an identifier chosen before login.'),
    c('Applied', 'How does pull differ from get for login_notice?',
      ['pull returns the value and removes it from the session', 'pull encrypts the value but keeps it forever', 'get removes every session key', 'There is no difference'],
      'pull is useful for one-time consumption because it combines reading and forgetting the selected key.'),
    c('Applied', 'What does the second argument to pull provide here?',
      ['A default value when login_notice is missing', 'The session encryption key', 'The number of database retries', 'A CSRF token name'],
      'The default is returned when the requested session key does not exist, so the redirect still receives a useful notice.'),
    c('Advanced', 'Which API is stronger when logging a user out and removing all old session data?',
      ['Invalidate the session and regenerate the CSRF token', 'Call get on every known key', 'Keep the same session ID and only redirect', 'Store the user ID in a cookie manually'],
      'Logout should clear session data, rotate the identifier, and rotate the CSRF token so the previous authenticated context cannot continue.'),
  ]),

  ...codeLab(files, 'php', 'Private object storage and temporary download URLs', String.raw`$path = $request->file('avatar')->store('avatars', 's3');

$url = Storage::disk('s3')->temporaryUrl(
    $path,
    now()->addMinutes(10),
    ['ResponseContentDisposition' => 'attachment']
);`, [
    c('Foundation', 'What value does store normally return in this example?',
      ['The stored path relative to the selected disk', 'The complete file bytes', 'A permanent public URL', 'The original temporary upload object'],
      'store writes the uploaded file using the disk and returns the generated path that the application can persist.'),
    c('Applied', 'What property does temporaryUrl add to a private object?',
      ['Time-limited signed access without making the object permanently public', 'Permanent anonymous read permission', 'Virus scanning of the object contents', 'A database foreign key'],
      'A temporary URL delegates access for a bounded time. It does not change the object to public visibility or validate its content.'),
    c('Applied', 'Why should the application avoid trusting getClientOriginalName as the storage path?',
      ['The client controls that name and it can collide or contain unsafe presentation data', 'Laravel cannot read original names', 'S3 requires every file to be named avatar', 'Original names are always encrypted'],
      'Client filenames are untrusted metadata. Generated storage identities prevent collisions and path assumptions; a sanitized display name can be stored separately.'),
    c('Advanced', 'What must an authorization check establish before returning this temporary URL?',
      ['The current actor may access the specific file represented by path', 'The URL has at least ten characters', 'The file uses the s3 disk name', 'The request contains any authenticated cookie'],
      'Signing proves URL integrity and expiry, not ownership. The application must authorize access before minting the delegated link.'),
  ]),

  ...codeLab(testing, 'php', 'Faking queue and notification boundaries in a feature test', String.raw`use RefreshDatabase;

Queue::fake();
Notification::fake();

$response = $this->post('/orders', Order::factory()->make()->toArray());

$response->assertRedirect();
Queue::assertPushed(CapturePayment::class);
Notification::assertNothingSent();`, [
    c('Foundation', 'What does Queue::fake change during this test?',
      ['Queued jobs are recorded for assertions instead of being sent to the real queue', 'Every job runs twice synchronously', 'The queue database table is migrated', 'All HTTP requests are disabled'],
      'The fake replaces the queue boundary so the test can inspect dispatch decisions without executing worker side effects.'),
    c('Applied', 'What behavior is Notification::assertNothingSent verifying?',
      ['The request did not send any notification through the faked channel', 'The notification table contains zero rows forever', 'The queue had no jobs of any kind', 'Email DNS is configured correctly'],
      'The assertion checks interactions captured by the notification fake during this test, not external infrastructure or all historical notifications.'),
    c('Applied', 'What does RefreshDatabase primarily protect between tests?',
      ['Database state isolation using migrations and transactions as appropriate', 'Remote payment APIs from receiving requests', 'Static properties in every PHP process', 'Browser localStorage'],
      'RefreshDatabase gives each test a predictable database state. Other boundaries such as queues and remote services still need their own fakes.'),
    c('Advanced', 'Why should the test separately cover CapturePayment behavior?',
      ['This feature test proves dispatch, not the internal correctness of the job handler', 'Queue::fake fully executes and verifies the handler', 'Jobs cannot be unit tested', 'assertPushed validates every remote API response'],
      'A boundary test checks that the application enqueues the right message. A focused job test should verify retries, idempotency, and gateway interaction.'),
  ]),

  ...codeLab(config, 'php', 'Reading environment values through cached configuration', String.raw`// config/services.php
'billing' => [
    'url' => env('BILLING_URL'),
    'timeout' => (int) env('BILLING_TIMEOUT', 5),
],

// Application code
$url = config('services.billing.url');
$timeout = config('services.billing.timeout');`, [
    c('Foundation', 'Why should application code call config instead of env directly?',
      ['Configuration caching compiles config values and env outside config may become unavailable', 'config always makes a remote HTTP request', 'env automatically validates authorization', 'config writes the value into every model'],
      'Laravel expects environment reads in configuration files. Application code then uses the stable configuration repository, including when config is cached.'),
    c('Applied', 'What happens after BILLING_URL changes on a server that still has old cached configuration?',
      ['The application keeps the cached value until configuration is rebuilt or cleared', 'Every request reads the new environment value directly', 'Laravel changes the value in source control', 'The service container deletes itself'],
      'A cached configuration artifact is intentionally stable. Deployment must rebuild it when environment-backed configuration changes.'),
    c('Applied', 'Why cast BILLING_TIMEOUT to int in the configuration file?',
      ['Environment values are strings and the application contract expects a number', 'PHP cannot store string configuration', 'The cast creates a database index', 'The timeout becomes encrypted'],
      'Environment input is textual. Normalizing once at the configuration boundary gives consumers the expected runtime type.'),
    c('Advanced', 'Which deployment order avoids serving code with incompatible stale configuration?',
      ['Install the release, build its configuration cache with the target environment, then activate it', 'Activate code first and edit config files during requests', 'Call env from every controller to bypass deployment', 'Commit production secrets into the repository'],
      'Building an immutable release artifact before activation keeps code and configuration compatible and avoids per-request mutation.'),
  ]),

  ...codeLab(errors, 'php', 'Reporting an exception while returning a domain response', String.raw`try {
    $gateway->charge($order);
} catch (GatewayTimeout $exception) {
    report($exception);

    return back()->withErrors([
        'payment' => 'The provider timed out. Please try again.',
    ]);
}`, [
    c('Foundation', 'What does report($exception) do in this catch block?',
      ['Send the exception through Laravel reporting without rethrowing it', 'Convert the timeout into a successful charge', 'Roll back every external side effect', 'Display the raw stack trace to the user'],
      'report forwards the exception to configured logging and reporting channels while the catch block still chooses the user-facing response.'),
    c('Applied', 'Why is the user-facing message different from the exception details?',
      ['It preserves a useful contract without exposing sensitive internals', 'Laravel cannot store exception messages', 'withErrors disables logging', 'Gateway timeouts never contain diagnostic data'],
      'Operational details belong in protected telemetry. Users need a safe, actionable message that does not leak credentials, endpoints, or stack traces.'),
    c('Applied', 'What transaction limitation remains if the gateway charged successfully before timing out locally?',
      ['A database rollback cannot automatically undo the remote charge', 'report automatically refunds every charge', 'withErrors commits the charge twice', 'Catching the exception creates a distributed transaction'],
      'The remote side effect has its own state. Reconciliation and idempotency are required when the local outcome is uncertain.'),
    c('Advanced', 'When should this exception be rethrown instead of converted to a validation-style response?',
      ['When the current boundary cannot recover or define a truthful application response', 'Whenever any logger is configured', 'Only when the user is an administrator', 'When the request contains no form fields'],
      'Catch an exception where the code can add context, compensate, or translate it into a valid contract. Otherwise let the central handler own it.'),
  ]),

  ...codeLab(security, 'php', 'Escaping output and binding SQL values', String.raw`<p>{{ $comment->body }}</p>
<div>{!! $trustedHtml !!}</div>

<?php
$orders = DB::select(
    'select * from orders where account_id = ? and status = ?',
    [$accountId, $status]
);`, [
    c('Foundation', 'When this template renders the comment and HTML, how do the two Blade output forms differ?',
      ['Double braces escape HTML; the {!! !!} form renders raw HTML', 'Both forms always render raw HTML', 'Raw output automatically sanitizes scripts', 'Double braces encrypt data in the database'],
      'Escaped output treats user text as text. Raw output is appropriate only for content already trusted or sanitized by a deliberate HTML policy.'),
    c('Applied', 'What do the question-mark placeholders protect in the SQL statement?',
      ['They bind data values separately from SQL syntax', 'They authorize the account automatically', 'They create an index for each value', 'They allow binding table names safely'],
      'Parameter binding prevents values from being parsed as SQL syntax. Authorization and tenant scoping remain separate responsibilities.'),
    c('Applied', 'Why can a placeholder not normally replace a dynamic column name?',
      ['Identifiers are SQL syntax, while placeholders represent data values', 'Column names are always integers', 'Prepared statements disable ORDER BY', 'Laravel automatically quotes every identifier from input'],
      'Dynamic identifiers require an allowlist and explicit mapping. Passing an identifier as a value does not turn it into SQL structure.'),
    c('Advanced', 'What condition must be true before rendering trustedHtml with raw Blade syntax?',
      ['It was produced or sanitized under an explicit allowed-HTML policy', 'The user entered fewer than 255 characters', 'The database query used placeholders', 'The HTML is stored in a hidden model attribute'],
      'Raw rendering crosses an output trust boundary. Length, storage, and SQL safety do not remove scripts or dangerous markup.'),
  ]),

  ...codeLab(artisan, 'php', 'Preventing duplicate scheduled work across servers', String.raw`Schedule::command('reports:daily')
    ->dailyAt('02:00')
    ->onOneServer()
    ->withoutOverlapping(30)
    ->runInBackground();`, [
    c('Foundation', 'What does withoutOverlapping(30) use to prevent a second active run?',
      ['A cache lock with an expiration measured in minutes', 'A database migration lock held forever', 'The command process ID stored in source control', 'A browser cookie'],
      'Scheduled overlap prevention uses a lock. The expiry limits stale ownership if a process disappears without releasing it.'),
    c('Applied', 'What additional problem does onOneServer address in a multi-server deployment?',
      ['Only one scheduler node should claim this occurrence of the task', 'The command may never use the database', 'The task must run on the web server', 'The report becomes synchronous'],
      'onOneServer coordinates the same scheduled event across nodes, assuming they share a supported central cache store.'),
    c('Applied', 'What infrastructure condition is required for these distributed protections to coordinate correctly?',
      ['Scheduler nodes must share the same central lock-capable cache', 'Each node must use an isolated array cache', 'The command must write no output', 'All nodes must have different time zones'],
      'Independent local caches cannot see one another’s locks. Distributed coordination requires shared lock state.'),
    c('Advanced', 'What risk does runInBackground introduce for operational visibility?',
      ['The scheduler can continue while the child process fails separately, so logs and exit monitoring matter', 'It guarantees the command can never fail', 'It disables the overlap lock immediately', 'It executes the command inside the browser'],
      'Background execution improves scheduler throughput but separates child lifecycle and failure reporting from the initiating scheduler process.'),
  ]),

  ...codeLab(collections, 'php', 'Mapping, filtering, and reindexing a collection', String.raw`$result = collect([
    ['id' => 10, 'active' => true],
    ['id' => 11, 'active' => false],
    ['id' => 12, 'active' => true],
])->filter(fn ($row) => $row['active'])
  ->map(fn ($row) => $row['id'])
  ->values();`, [
    c('Foundation', 'What value does result contain after this pipeline?',
      ['A collection containing 10 and 12 with sequential keys', 'A collection containing only 11', 'The original array mutated to remove active rows', 'A boolean indicating whether any row is active'],
      'filter keeps the active rows, map projects their IDs, and values resets the remaining keys to a zero-based sequence.'),
    c('Applied', 'Why is values needed after filter if the result will be encoded as a JSON array?',
      ['filter preserves original keys, which could otherwise encode as a JSON object', 'values performs the active check', 'values loads rows from the database', 'values converts every ID to a string'],
      'Non-sequential numeric keys are represented as object properties in JSON. Reindexing preserves the intended array shape.'),
    c('Applied', 'How does map differ from transform on a Collection?',
      ['map returns a new collection; transform mutates the existing collection', 'transform filters values while map sorts them', 'map always changes database rows', 'They both return only booleans'],
      'map supports a new data-flow value, while transform changes the collection instance on which it is called.'),
    c('Advanced', 'When would a LazyCollection be preferable for a similar pipeline?',
      ['When processing a very large stream without retaining every item in memory', 'When all items must be eagerly sorted before reading', 'When the code needs browser localStorage', 'When no iterator is available'],
      'Lazy collections evaluate items as they flow through the pipeline, which can bound memory for files, cursors, and generated sequences.'),
  ]),

  ...codeLab(seeders, 'php', 'Idempotent synchronization of reference data', String.raw`Plan::updateOrCreate(
    ['external_id' => 'starter'],
    ['name' => 'Starter', 'monthly_price' => 990]
);

Plan::factory()->count(3)->sequence(
    ['name' => 'Bronze'],
    ['name' => 'Silver'],
    ['name' => 'Gold'],
)->create();`, [
    c('Foundation', 'Which attributes are used to find the existing plan in updateOrCreate?',
      ['The first array containing external_id', 'The second array containing name and price only', 'Every fillable model attribute', 'The factory sequence names'],
      'updateOrCreate separates lookup identity from values to update or insert, making the synchronization intent explicit.'),
    c('Applied', 'What happens on a later run when starter already exists but monthly_price changed?',
      ['The existing row is updated with the second array', 'A duplicate row is always inserted', 'The existing row is deleted', 'The seeder stops before executing SQL'],
      'The API finds by external_id and applies the new update values, which makes repeated reference-data synchronization practical.'),
    c('Applied', 'What does sequence contribute to the three factory creations?',
      ['It cycles the supplied attribute sets across generated models', 'It creates one model with three names', 'It forces all models to share a primary key', 'It disables factory states'],
      'A factory sequence supplies ordered per-instance attributes, producing Bronze, Silver, and Gold for the three models.'),
    c('Advanced', 'What database rule makes updateOrCreate safe against concurrent duplicate external IDs?',
      ['A unique constraint on external_id', 'Alphabetical seeder execution', 'Calling count before updateOrCreate', 'Hiding external_id from JSON'],
      'Two processes can race between lookup and insert. The schema must enforce the identity that the synchronization code assumes.'),
  ]),

  ...codeLab(architecture, 'php', 'Injecting a port instead of a concrete payment provider', String.raw`interface PaymentGateway
{
    public function charge(Money $amount, PaymentToken $token): ChargeResult;
}

final class CheckoutService
{
    public function __construct(private PaymentGateway $gateway) {}

    public function checkout(Order $order, PaymentToken $token): ChargeResult
    {
        return $this->gateway->charge($order->total(), $token);
    }
}`, [
    c('Foundation', 'What architectural role does PaymentGateway play in this design?',
      ['A port that expresses what checkout needs from a payment provider', 'An Eloquent model for the payments table', 'HTTP middleware that authenticates every request', 'A migration that creates provider columns'],
      'The interface belongs to the application boundary and describes the required capability without coupling checkout to a provider SDK.'),
    c('Applied', 'What container configuration is needed when CheckoutService is resolved?',
      ['Bind PaymentGateway to a concrete adapter such as StripePaymentGateway', 'Register CheckoutService as route middleware only', 'Add PaymentGateway to model fillable', 'Create a database view named PaymentGateway'],
      'The service container must know which adapter satisfies the interface in the current environment.'),
    c('Applied', 'How does this design improve a focused CheckoutService test?',
      ['The test can inject a fake gateway with controlled results', 'The test must call the real payment provider', 'Interfaces automatically create database fixtures', 'The service no longer needs assertions'],
      'A fake adapter makes success, decline, and timeout behavior deterministic without transmitting real payment requests.'),
    c('Advanced', 'Where should provider-specific webhook signature verification live?',
      ['In the provider adapter or dedicated inbound integration boundary', 'Inside the Money value object', 'In every Eloquent model observer', 'In the orders migration down method'],
      'Provider protocol details belong at the integration edge, while the application service should work with verified domain-level events and results.'),
  ]),

  ...codeLab(production, 'php', 'Memory-bounded batch processing with chunkById', String.raw`User::query()
    ->whereNull('normalized_at')
    ->orderBy('id')
    ->chunkById(500, function (Collection $users) {
        foreach ($users as $user) {
            $user->update(['normalized_at' => now()]);
        }
    });`, [
    c('Foundation', 'Why does chunkById bound memory better than calling get on the entire query?',
      ['Only one batch of models is retained at a time', 'It stores every user in the application cache', 'It runs without issuing SQL', 'It converts models into database views'],
      'Each chunk is loaded, processed, and released before the next batch, preventing the full result set from occupying PHP memory.'),
    c('Applied', 'Why is ID-based continuation safer than offset pagination while rows are updated?',
      ['It continues after the last seen ID instead of relying on shifting row positions', 'It prevents every possible concurrent update', 'It removes the primary key from SQL', 'It executes all updates in one browser request'],
      'Offset positions can change as rows stop matching the filter. A monotonic key gives the batch process a stable continuation boundary.'),
    c('Applied', 'What production concern remains with one update query per user inside the loop?',
      ['The process may still issue many writes and should be sized or bulked for capacity', 'chunkById automatically combines all updates into one statement', 'The callback never talks to the database', 'Updating normalized_at disables indexes'],
      'Memory is bounded, but query volume and lock duration still matter. A bulk update may be preferable when per-model behavior is unnecessary.'),
    c('Advanced', 'What bug appears if the code changes the same ID column used for chunk continuation?',
      ['Rows can be skipped or revisited because the continuation key is no longer stable', 'Laravel automatically renumbers every remaining chunk', 'The callback becomes a queue job', 'The query stops using whereNull'],
      'Chunk-by-ID assumes the ordering key remains stable during traversal. Mutating that key invalidates the cursor-like continuation rule.'),
  ]),
];
