<?php
// Isolated upstream-method probes. No Laravel app, package install, database,
// queue, cache server or external service is started. Collaborators below are
// deliberately small doubles for the assumptions stated in the questions.
namespace QuizAudit;
use Throwable;
use Exception;
use DateTime;
use DateTimeInterface;
use stdClass;

$methods = json_decode(file_get_contents(__DIR__.'/fixtures/laravel-13.0.0/methods.json'), true, flags: JSON_THROW_ON_ERROR);
$snippets = json_decode(stream_get_contents(STDIN), true, flags: JSON_THROW_ON_ERROR);
$checks = [];
function check(bool $condition, string $label): void {
    global $checks;
    if (!$condition) throw new \RuntimeException($label);
    $checks[] = $label;
}
function declareProbe(string $name, string $fixture, string $support, array $names): void {
    global $methods;
    $body = implode("\n", array_map(fn($method) => $methods[$fixture][$method], $names));
    eval('namespace QuizAudit; use Throwable; use Exception; use DateTime; use DateTimeInterface; use stdClass; use BackedEnum; use InvalidArgumentException; class '.$name.' {'.$support."\n".$body.'}');
}
function candidate(string $id, array $replacements = []): void {
    global $snippets;
    $code = strtr($snippets[$id], $replacements);
    eval('namespace QuizAudit; use Throwable; use DateTime; '.$code);
}
function data_get($value, $key, $default = null) { return $key === null ? $value : ($value[$key] ?? $default); }
function throw_if($condition, $exception, ...$arguments) { if ($condition) throw new \RuntimeException('Unexpected validation failure'); }
function last($array) { return end($array); }
class Arr {
    public static function set(&$array, $key, $value) { $array[$key] = $value; }
    public static function get($array, $key) { return $array[$key] ?? null; }
    public static function wrap($value) { return is_array($value) ? $value : [$value]; }
}

// Registered callback versus exception-object report(): use the actual handler
// branch, with a logger that records in memory rather than writing a log file.
class Reflector { public static function isCallable($value) { return is_callable($value); } }
class Log { public static array $context = []; public static function withContext($context) { self::$context += $context; } }
class PaymentFailed extends \Exception { public int $paymentId = 42; }
class DelegatingFailure extends \Exception { public function report() { return false; } }
class MemoryLogger {
    public array $records = [];
    public function error($message, $context) { $this->records[] = compact('message','context'); }
}
declareProbe('ReportableHandler', 'ReportableHandler.php', 'public $callback; public $shouldStop = false; public function handles($e) { return true; }', ['__construct','__invoke']);
declareProbe('Handler', 'Handler.php', '
    public $reportedExceptionMap; public $container; public $reportCallbacks = []; public $logger;
    public function __construct() {
        $this->reportedExceptionMap = new \WeakMap;
        $this->container = new class { public function call($callable) { return $callable(); } };
        $this->logger = new MemoryLogger;
    }
    public function newLogger() { return $this->logger; }
    public function mapLogLevel($e) { return "error"; }
    public function buildExceptionContext($e) { return Log::$context; }
', ['reportThrowable']);
class ReportingConfiguration {
    public function __construct(public Handler $handler) {}
    public function report($callback) { $this->handler->reportCallbacks[] = new ReportableHandler($callback); }
}
foreach ([false, true] as $fix) {
    $handler = new Handler;
    $exceptions = new ReportingConfiguration($handler);
    Log::$context = [];
    // Evaluate the actual question fragment in this local scope.
    $code = $snippets['LQ-545'];
    if ($fix) $code = str_replace('return false;', '', $code);
    eval('namespace QuizAudit; '.$code);
    $handler->reportThrowable(new PaymentFailed('payment failed'));
    check(count($handler->logger->records) === ($fix ? 1 : 0), $fix ? 'reportCallbackNull' : 'reportCallbackFalse');
    check(Log::$context['payment_id'] === 42, 'context attached even when no record emitted: '.(int)$fix);
    if ($fix) check($handler->logger->records[0]['context']['payment_id'] === 42, 'handler-level record contains payment_id');
}
$handler = new Handler;
$handler->reportThrowable(new DelegatingFailure('delegate'));
check(count($handler->logger->records) === 1, 'exception report method false delegates to default logging');

// Worker retry decisions and serialized deadline, without a queue connection.
class Carbon extends \DateTime {
    public static int $clock = 1000;
    public static function now() { return new self('@'.self::$clock); }
    public function addHour() { return $this->modify('+1 hour'); }
}
function now() { return Carbon::now(); }
interface ShouldQueue {}
class CrmClient {}
class WorkerOptions { public $backoff = 0; }
candidate('LQ-489');
declareProbe('QueuePayload', 'Queue.php', '', ['getJobExpiration']);
declareProbe('Worker', 'Worker.php', 'public function maxAttemptsExceededException($job) { return new \RuntimeException("attempts"); }', ['markJobAsFailedIfAlreadyExceedsMaxAttempts','markJobAsFailedIfWillExceedMaxAttempts','calculateBackoff','failJob']);
class QueuedJob {
    public bool $failed = false;
    public function __construct(public ?int $deadline, public int $attempt = 6) {}
    public function retryUntil() { return $this->deadline; }
    public function maxTries() { return 5; }
    public function attempts() { return $this->attempt; }
    public function fail($e) { $this->failed = true; }
    public function backoff() { return '10,60,300'; }
}
$deadline = (new QueuePayload)->getJobExpiration(new SyncCustomer(42));
check($deadline === 4600, 'retryUntil serialized as an absolute timestamp');
Carbon::$clock = 4000;
$job = new QueuedJob($deadline);
$worker = new Worker;
$worker->markJobAsFailedIfAlreadyExceedsMaxAttempts('test', $job, 5);
$worker->markJobAsFailedIfWillExceedMaxAttempts('test', $job, 5, new \RuntimeException('retry'));
check(!$job->failed && $job->deadline === 4600, 'retryUntilPrecedence');
$countLimited = new QueuedJob(null, 5);
$worker->markJobAsFailedIfWillExceedMaxAttempts('test', $countLimited, 5, new \RuntimeException('retry'));
check($countLimited->failed, 'tries applies when retryUntil is absent');
Carbon::$clock = 4601;
$worker->markJobAsFailedIfWillExceedMaxAttempts('test', $job, 5, new \RuntimeException('retry'));
check($job->failed, 'expired deadline fails without sliding on retry');
$backoffs = [];
foreach ([1,2,3,4,5] as $attempt) $backoffs[] = $worker->calculateBackoff(new QueuedJob(9999, $attempt), new WorkerOptions);
check($backoffs === [10,60,300,300,300], 'backoff uses the last entry for later attempts');

// Validation lifecycle and validator data retrieval are upstream methods.
// Rule execution is a successful-validation double for the stipulated inputs.
class Messages { public function isNotEmpty() { return false; } }
declareProbe('Validator', 'Validator.php', '
    public $messages; public $exception = "unused"; public $excludeUnvalidatedArrayKeys = false;
    public function __construct(public array $data, public array $rules) { $this->messages = new Messages; }
    public function stopOnFirstFailure($value) { return $this; }
    public function fails() { return false; }
    public function getData() { return $this->data; }
    public function getRules() { return $this->rules; }
    public function replacePlaceholders($value) { return $value; }
', ['validated']);
class ValidationFactory { public function make($data, $rules, $messages, $attributes) { return new Validator($data, $rules); } }
$requestSupport = '
    public $validator; public $stopOnFirstFailure = false;
    public function __construct(public array $data) {}
    public function all() { return $this->data; }
    public function input($key) { return $this->data[$key]; }
    public function merge($data) { $this->data = array_replace($this->data, $data); }
    public function getValidatorInstance() { return $this->validator ??= $this->createDefaultValidator(new ValidationFactory); }
    public function validationRules() { return $this->rules(); }
    public function messages() { return []; }
    public function attributes() { return []; }
    public function isPrecognitive() { return false; }
    public function passesAuthorization() { return true; }
    protected function prepareForValidation(): void {}
    protected function passedValidation(): void {}
' . $methods['ValidatesWhenResolvedTrait.php']['validateResolved'];
declareProbe('FormRequest', 'FormRequest.php', $requestSupport, ['createDefaultValidator','validationData','validated']);
candidate('LQ-046', ['NORMALIZE_HERE' => 'prepareForValidation']);
candidate('LQ-314');
$prepared = new StoreUserRequest(['email' => ' ADA@example.test ']);
$prepared->validateResolved();
check($prepared->input('email') === 'ada@example.test' && $prepared->validated('email') === 'ada@example.test', 'prepareForValidation');
$passed = new StoreProjectRequest(['name' => '  Ada  ']);
$passed->validateResolved();
check($passed->input('name') === 'Ada' && $passed->validated('name') === '  Ada  ', 'passedValidation');

// Attribute comparisons use actual HasAttributes methods. save() below models
// a successful persistence acknowledgement only; it never issues SQL.
declareProbe('AttributeModel', 'HasAttributes.php', '
    public $attributes = ["name" => "Grace"]; public $original = ["name" => "Grace"]; public $changes = [];
    protected static $primitiveCastTypes = [];
    public function __set($key, $value) { $this->attributes[$key] = $value; }
    public function getAttributes() { return $this->attributes; }
    public function getChanges() { return $this->changes; }
    public function save() { if ($this->isDirty()) $this->changes = $this->getDirty(); $this->syncOriginal(); }
    public function __call($name, $arguments) { return false; }
', ['isDirty','wasChanged','hasChanges','getDirty','originalIsEquivalent','syncOriginal']);
$user = new AttributeModel;
$user->attributes['updated_at'] = 'new timestamp';
eval('namespace QuizAudit; '.$snippets['LQ-453']);
check([$before,$after,$stillDirty] === [false,false,false], 'unchangedAttribute');
$changed = new AttributeModel;
$changed->name = 'Ada';
check($changed->isDirty('name'), 'different attribute value is dirty');
$changed->save();
check($changed->wasChanged('name') && !$changed->isDirty('name'), 'changed attribute is recorded and then clean');

// Use actual named-route absolute default and URI finalization. Routing and
// request collaborators provide the declared origin and registered URI.
declareProbe('RouteUri', 'RouteUrlGenerator.php', '
    public $dontEncode = ["%3A" => ":", "%2F" => "/"];
    public $url; public $request;
    public function __construct() {
        $this->url = new class { public function format($root,$path,$route) { return $root."/".$path; } };
        $this->request = new class { public function getBaseUrl() { return ""; } };
    }
    public function formatParameters($route,$parameters) { return $parameters; }
    public function getRouteDomain($route,$parameters) { return null; }
    public function replaceRootParameters($route,$domain,$parameters) { return "https://quiz.example.test"; }
    public function replaceRouteParameters($uri,$parameters) { return $uri; }
    public function addQueryString($uri,$parameters) { return $uri; }
', ['to']);
declareProbe('NamedUrls', 'UrlGenerator.php', '
    public $routes;
    public function __construct() { $this->routes = new class {
        public function getByName($name) { return $name === "admin.reports" ? new class { public function uri() { return "admin/reports"; } } : null; }
    }; }
    public function toRoute($route,$parameters,$absolute) { return (new RouteUri)->to($route,$parameters,$absolute); }
', ['route']);
$urls = new NamedUrls;
check($urls->route('admin.reports') === 'https://quiz.example.test/admin/reports', 'routeAbsolute');
check($urls->route('admin.reports', [], false) === '/admin/reports', 'explicit relative route generation');

// Simulated lock store and clock; real middleware identity/lease wiring.
class Cache {}
class Container {
    public static $cache;
    public static function getInstance() { return new self; }
    public function make($name) { return self::$cache; }
}
class MemoryCache {
    public array $locks = []; public int $clock = 0; public int $serial = 0;
    public function lock($key, $seconds) { return new MemoryLock($this,$key,$seconds,++$this->serial); }
}
class MemoryLock {
    public function __construct(public MemoryCache $store, public string $key, public int $ttl, public int $owner) {}
    public function get() {
        if (($this->store->locks[$this->key]['expiry'] ?? 0) > $this->store->clock) return false;
        $this->store->locks[$this->key] = ['expiry'=>$this->store->clock+$this->ttl,'owner'=>$this->owner];
        return true;
    }
    public function release() { if (($this->store->locks[$this->key]['owner'] ?? null) === $this->owner) unset($this->store->locks[$this->key]); }
}
class JobA { public $released = null; public function release($delay) { $this->released = $delay; } }
class JobB extends JobA {}
declareProbe('WithoutOverlapping', 'WithoutOverlapping.php', '
    public $key; public $releaseAfter; public $expiresAfter; public $prefix="laravel-queue-overlap:"; public $shareKey=false;
    public function secondsUntil($delay) { return $delay; }
', ['__construct','releaseAfter','expireAfter','shared','getLockKey','handle']);
foreach ([[false,120,true],[true,30,true],[true,120,false]] as [$shared,$ttl,$expectOverlap]) {
    Container::$cache = new MemoryCache;
    $middleware = (new WithoutOverlapping('project:7'))->releaseAfter(5)->expireAfter($ttl);
    if ($shared) $middleware->shared();
    $entered = false;
    $second = new JobB;
    $middleware->handle(new JobA, function () use ($middleware,$second,&$entered) {
        Container::$cache->clock = 31;
        $middleware->handle($second, function () use (&$entered) { $entered = true; });
    });
    check($entered === $expectOverlap, 'sharedOverlapLock: shared='.(int)$shared.', ttl='.$ttl);
    if (!$expectOverlap) check($second->released === 5, 'releaseAfter is contention delay');
}
echo json_encode(['php'=>PHP_VERSION,'frameworkReference'=>'v13.0.0','checks'=>$checks], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
