import { roadmapBank } from './roadmap-question-helpers.mjs';

const lesson = (title, lines, behavior, pitfall) => ({
  title,
  snippet: lines.join('\n'),
  behavior,
  pitfall,
});

const spec = (topic, concepts, behavior, pitfall, examples) => ({
  topic,
  concepts,
  lessons: examples.map(([title, lines]) => lesson(title, lines, behavior, pitfall)),
});

const specs = [
  spec('Syntax & execution model', ['PHP tags', 'statements', 'expressions', 'strict types', 'CLI execution'],
    'PHP evaluates expressions before passing their results to functions and strict_types affects scalar calls made from the declaring file',
    'strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file', [
      ['Expression evaluation with strict scalar calls', ['<?php', 'declare(strict_types=1);', '', 'function twice(int $value): int {', '    return $value * 2;', '}', '', '$subtotal = 10 + 5;', 'echo twice($subtotal);']],
      ['Included files keep their own call-site rules', ['<?php', 'declare(strict_types=1);', '', "require __DIR__ . '/legacy.php';", '', "echo formatTotal('12');", '// The coercion decision belongs to the file that calls formatTotal().']],
    ]),
  spec('Variables, scope & constants', ['variables', 'constants', 'local scope', 'global scope', 'static variables'],
    'closures capture variables explicitly and a static local retains its value between calls in the same request',
    'ordinary local variables are shared globally and closures automatically see every outer variable by reference', [
      ['Capturing by value versus by reference', ['<?php', '$rate = 2;', '$byValue = fn (int $n) => $n * $rate;', '$byReference = function (int $n) use (&$rate): int {', '    return $n * $rate;', '};', '', '$rate = 3;', 'echo $byValue(4), " ", $byReference(4);']],
      ['Static locals preserve request-local state', ['<?php', 'function nextSequence(): int {', '    static $value = 0;', '    return ++$value;', '}', '', 'echo nextSequence();', 'echo nextSequence();', 'echo nextSequence();']],
    ]),
  spec('Types, casting & comparisons', ['scalar types', 'type juggling', 'casting', 'strict comparison', 'null coalescing'],
    'strict comparison checks both type and value while explicit casts and null coalescing make conversion decisions visible',
    'loose and strict comparison are interchangeable and the null-coalescing operator treats every falsy value as missing', [
      ['Strict comparison avoids numeric-string surprises', ['<?php', '$input = "0";', '$count = 0;', '', 'var_dump($input == $count);', 'var_dump($input === $count);', '', '$normalized = (int) $input;', 'var_dump($normalized === $count);']],
      ['Null coalescing preserves present falsy values', ['<?php', '$payload = ["enabled" => false, "limit" => 0];', '', '$enabled = $payload["enabled"] ?? true;', '$limit = $payload["limit"] ?? 25;', '$label = $payload["label"] ?? "untitled";', '', 'var_dump($enabled, $limit, $label);']],
    ]),
  spec('Arrays & destructuring', ['indexed arrays', 'associative arrays', 'spread', 'destructuring', 'array functions'],
    'array_map transforms values, array_filter preserves original keys, and array_values can intentionally reindex the result',
    'all PHP array functions preserve identical keys and the spread operator always behaves like array_merge for every key type', [
      ['Filtering then reindexing a list', ['<?php', '$prices = [10, 0, 25, 5];', '', '$positive = array_filter($prices, fn (int $price) => $price > 0);', '$taxed = array_map(fn (int $price) => $price * 1.1, $positive);', '$list = array_values($taxed);', '', 'print_r($list);']],
      ['Associative destructuring with defaults', ['<?php', '$row = ["id" => 7, "name" => "Ada"];', '', '["id" => $id, "name" => $name] = $row;', '$role = $row["role"] ?? "viewer";', '', '$result = compact("id", "name", "role");', 'print_r($result);']],
    ]),
  spec('Operators & expressions', ['arithmetic operators', 'assignment operators', 'increment', 'precedence', 'short circuiting'],
    'pre-increment changes the value before returning it, post-increment returns the old value, and short-circuit operators may skip the right side',
    'prefix and postfix increment always return the same value and both sides of boolean expressions are always evaluated', [
      ['Prefix and postfix increment produce different expressions', ['<?php', '$counter = 5;', '$before = $counter++;', '$after = ++$counter;', '', 'echo "before=$before\n";', 'echo "after=$after\n";', 'echo "counter=$counter\n";']],
      ['Short circuiting controls side effects', ['<?php', '$calls = 0;', '$check = function () use (&$calls): bool {', '    $calls++;', '    return true;', '};', '', '$first = false && $check();', '$second = true || $check();', 'echo $calls;']],
    ]),
  spec('Control flow & pattern matching', ['if and else', 'loops', 'switch', 'match', 'break and continue'],
    'match uses strict comparison and returns a value, while loop control levels decide which enclosing structure is affected',
    'match falls through like switch and break without a level always exits every enclosing loop', [
      ['Match expressions are strict and non-fallthrough', ['<?php', '$status = "1";', '', '$label = match ($status) {', '    1 => "integer one",', '    "1" => "string one",', '    default => "other",', '};', '', 'echo $label;']],
      ['Continue targets the requested loop level', ['<?php', 'foreach ([1, 2] as $row) {', '    foreach ([1, 2, 3] as $column) {', '        if ($column === 2) continue 2;', '        echo "$row:$column\n";', '    }', '}', '// continue 2 resumes the outer foreach.']],
    ]),
  spec('Functions & arguments', ['parameter types', 'return types', 'named arguments', 'variadics', 'references'],
    'named arguments bind by parameter name and variadics collect remaining positional values into an array',
    'named arguments are reordered alphabetically and variadic parameters disable validation of the collected values', [
      ['Named arguments document an otherwise ambiguous call', ['<?php', 'function page(int $size = 20, int $number = 1): array {', '    return compact("size", "number");', '}', '', '$result = page(number: 3, size: 50);', 'print_r($result);']],
      ['Typed variadics validate every collected argument', ['<?php', 'function total(float ...$amounts): float {', '    return array_sum($amounts);', '}', '', '$invoice = total(10.50, 2, 7.25);', 'echo number_format($invoice, 2);']],
    ]),
  spec('Closures, callbacks & callables', ['anonymous functions', 'arrow functions', 'callables', 'first-class callables', 'callback APIs'],
    'arrow functions capture outer values by value and first-class callable syntax creates a callable without invoking the function',
    'creating a first-class callable immediately runs the target and arrow functions capture outer variables by reference', [
      ['Arrow function capture and callback transformation', ['<?php', '$tax = 0.10;', '$addTax = fn (float $price): float => $price * (1 + $tax);', '', '$tax = 0.20;', '$prices = array_map($addTax, [10, 20]);', '', 'print_r($prices);']],
      ['First-class callable defers invocation', ['<?php', 'final class Slugger {', '    public static function make(string $value): string {', '        return strtolower(str_replace(" ", "-", $value));', '    }', '}', '', '$slug = Slugger::make(...);', 'echo $slug("Hello PHP");']],
    ]),
  spec('Includes, autoloading & paths', ['include', 'require', 'include_once', 'require_once', 'autoloading'],
    'require stops execution when a required file is missing and Composer autoloading resolves configured class namespaces without manual includes',
    'include and require have identical failure behavior and Composer discovers arbitrary classes without namespace-to-directory configuration', [
      ['Reliable paths use the current file directory', ['<?php', 'declare(strict_types=1);', '', "require_once __DIR__ . '/vendor/autoload.php';", "require __DIR__ . '/config/app.php';", '', '$service = new App\\Billing\\InvoiceService();', '$service->run();']],
      ['Optional extension loading can be handled explicitly', ['<?php', "$loaded = include __DIR__ . '/optional-hooks.php';", '', 'if ($loaded === false) {', '    error_log("Optional hooks were not loaded");', '}', '', 'echo "Application continues";']],
    ]),
  spec('Files & structured data', ['file operations', 'streams', 'JSON', 'CSV', 'XML'],
    'JSON_THROW_ON_ERROR turns invalid JSON into an exception and stream handles should be closed even when parsing fails',
    'json_decode always throws automatically and file_get_contents guarantees valid UTF-8 JSON', [
      ['Decoding JSON with explicit failure handling', ['<?php', 'try {', "    $json = file_get_contents(__DIR__ . '/payload.json');", '    $data = json_decode($json, true, flags: JSON_THROW_ON_ERROR);', '    echo $data["user"]["name"];', '} catch (JsonException $error) {', '    error_log($error->getMessage());', '}']],
      ['Reading CSV through a stream handle', ['<?php', "$handle = fopen(__DIR__ . '/users.csv', 'rb');", '', 'try {', '    while (($row = fgetcsv($handle)) !== false) {', '        [$id, $email] = $row;', '        echo "$id:$email\n";', '    }', '} finally { fclose($handle); }']],
    ]),
  spec('HTTP & superglobals', ['HTTP requests', 'GET and POST', 'superglobals', 'headers', 'response status'],
    'superglobal input is untrusted text and response headers must be sent before body output',
    'values in POST and GET are already validated application types and headers can be changed safely after any output', [
      ['Reading and validating query input', ['<?php', '$page = filter_input(INPUT_GET, "page", FILTER_VALIDATE_INT, [', '    "options" => ["min_range" => 1],', ']);', '', 'if ($page === false || $page === null) {', '    http_response_code(400);', '    echo json_encode(["error" => "Invalid page"]);', '    exit;', '}']],
      ['Returning a JSON response before output starts', ['<?php', 'declare(strict_types=1);', '', 'header("Content-Type: application/json; charset=utf-8");', 'http_response_code(201);', '', 'echo json_encode([', '    "id" => 42,', '    "created" => true,', '], JSON_THROW_ON_ERROR);']],
    ]),
  spec('Forms & file uploads', ['form handling', 'multipart forms', 'file uploads', 'upload errors', 'safe filenames'],
    'uploaded files require error, size, MIME, and destination checks before move_uploaded_file stores them',
    'the browser-provided filename and MIME type are trustworthy enough to use directly as a server path', [
      ['Validating an uploaded image before storage', ['<?php', '$file = $_FILES["avatar"] ?? null;', 'if (!$file || $file["error"] !== UPLOAD_ERR_OK) {', '    throw new RuntimeException("Upload failed");', '}', '', '$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file["tmp_name"]);', 'if (!in_array($mime, ["image/png", "image/jpeg"], true)) {', '    throw new RuntimeException("Unsupported image");', '}']],
      ['Generating a server-controlled destination name', ['<?php', '$extension = match ($mime) {', '    "image/png" => "png",', '    "image/jpeg" => "jpg",', '};', '', '$target = __DIR__ . "/uploads/" . bin2hex(random_bytes(16)) . ".$extension";', 'if (!move_uploaded_file($file["tmp_name"], $target)) {', '    throw new RuntimeException("Move failed");', '}']],
    ]),
  spec('Cookies & sessions', ['cookies', 'sessions', 'cookie flags', 'session fixation', 'session storage'],
    'secure cookie flags limit exposure and regenerating the session identifier after authentication reduces fixation risk',
    'session_start authenticates a visitor by itself and session identifiers should remain unchanged after login', [
      ['Issuing a hardened preference cookie', ['<?php', 'setcookie("theme", "dark", [', '    "expires" => time() + 86400,', '    "path" => "/",', '    "secure" => true,', '    "httponly" => true,', '    "samesite" => "Lax",', ']);']],
      ['Rotating a session after successful login', ['<?php', 'session_start();', '', 'if (password_verify($_POST["password"], $user["password_hash"])) {', '    session_regenerate_id(true);', '    $_SESSION["user_id"] = $user["id"];', '    $_SESSION["authenticated_at"] = time();', '}']],
    ]),
  spec('Validation & web security', ['input validation', 'output escaping', 'CSRF', 'XSS', 'password hashing'],
    'validation checks allowed input while context-appropriate escaping and CSRF token verification address separate output and request-forgery risks',
    'one generic sanitize call replaces validation, output escaping, authorization, and CSRF protection', [
      ['Escaping HTML at the output boundary', ['<?php', '$displayName = $_POST["display_name"] ?? "";', 'if (mb_strlen($displayName) > 80) {', '    throw new InvalidArgumentException("Name too long");', '}', '', 'echo "<h1>";', 'echo htmlspecialchars($displayName, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");', 'echo "</h1>";']],
      ['Verifying a session-backed CSRF token', ['<?php', 'session_start();', '$submitted = $_POST["csrf_token"] ?? "";', '$expected = $_SESSION["csrf_token"] ?? "";', '', 'if ($expected === "" || !hash_equals($expected, $submitted)) {', '    http_response_code(403);', '    exit("Invalid CSRF token");', '}']],
    ]),
  spec('PDO & database access', ['PDO', 'MySQLi', 'prepared statements', 'fetch modes', 'SQL injection prevention'],
    'prepared statements keep untrusted values separate from SQL structure and fetch modes control the returned representation',
    'quoting an entire SQL string is equivalent to parameter binding and placeholders can safely replace table or column identifiers', [
      ['Binding values in a PDO query', ['<?php', '$pdo = new PDO($dsn, $user, $password, [', '    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,', ']);', '', '$statement = $pdo->prepare(', '    "SELECT id, email FROM users WHERE status = :status LIMIT 50"', ');', '$statement->execute(["status" => $requestedStatus]);', '$users = $statement->fetchAll(PDO::FETCH_ASSOC);']],
      ['Whitelisting SQL identifiers separately', ['<?php', '$allowed = ["created_at", "email", "name"];', '$sort = $_GET["sort"] ?? "created_at";', 'if (!in_array($sort, $allowed, true)) {', '    $sort = "created_at";', '}', '', '$sql = "SELECT id, email FROM users ORDER BY $sort DESC";', '$rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);']],
    ]),
  spec('Transactions, migrations & ORM', ['transactions', 'ACID', 'migrations', 'ORM', 'schema evolution'],
    'a transaction commits both related writes or rolls them both back and a migration should describe a reversible schema change',
    'an ORM automatically makes every multi-step write atomic and a migration down method is optional even when rollback is required', [
      ['Rolling back a two-step transfer on failure', ['<?php', '$pdo->beginTransaction();', 'try {', '    debit($pdo, accountId: 10, cents: 5000);', '    credit($pdo, accountId: 20, cents: 5000);', '    $pdo->commit();', '} catch (Throwable $error) {', '    $pdo->rollBack();', '    throw $error;', '}']],
      ['Expressing a reversible migration', ['<?php', 'final class AddStatusToOrders {', '    public function up(PDO $db): void {', '        $db->exec("ALTER TABLE orders ADD status VARCHAR(20) NOT NULL DEFAULT \'pending\'");', '    }', '    public function down(PDO $db): void {', '        $db->exec("ALTER TABLE orders DROP COLUMN status");', '    }', '}']],
    ]),
  spec('Classes & object lifecycle', ['classes', 'constructors', 'properties', 'readonly', 'object identity'],
    'constructor promotion initializes typed properties and readonly prevents reassignment after initialization without making referenced objects deeply immutable',
    'readonly recursively freezes every object and array reachable from the property and cloning preserves object identity', [
      ['Constructor promotion creates validated state', ['<?php', 'final class Money {', '    public function __construct(', '        public readonly int $cents,', '        public readonly string $currency,', '    ) {', '        if ($cents < 0) throw new InvalidArgumentException("Negative money");', '    }', '}', '', '$price = new Money(1299, "CHF");']],
      ['Clone creates a distinct object identity', ['<?php', 'final class Counter {', '    public function __construct(public int $value) {}', '}', '', '$first = new Counter(1);', '$second = clone $first;', '$second->value++;', '', 'var_dump($first === $second, $first->value, $second->value);']],
    ]),
  spec('Inheritance, interfaces & traits', ['inheritance', 'interfaces', 'traits', 'polymorphism', 'method visibility'],
    'interfaces define substitutable contracts while traits reuse implementation and conflicts require an explicit resolution',
    'traits create a runtime parent-child relationship and an interface supplies working method bodies automatically', [
      ['Programming against an interface contract', ['<?php', 'interface Clock { public function now(): DateTimeImmutable; }', '', 'final class TokenIssuer {', '    public function __construct(private Clock $clock) {}', '    public function issue(): string {', '        return $this->clock->now()->format(DateTimeInterface::ATOM);', '    }', '}']],
      ['Resolving conflicting trait methods explicitly', ['<?php', 'trait JsonLogger { public function log(string $m): void { echo json_encode(["m" => $m]); } }', 'trait TextLogger { public function log(string $m): void { echo $m; } }', '', 'final class Logger {', '    use JsonLogger, TextLogger {', '        JsonLogger::log insteadof TextLogger;', '        TextLogger::log as logText;', '    }', '}']],
    ]),
  spec('Namespaces, Composer & packages', ['namespaces', 'use imports', 'Composer', 'PSR-4', 'semantic versions'],
    'namespaces avoid symbol collisions and PSR-4 maps namespace prefixes to directories through Composer autoload configuration',
    'a use statement installs a package at runtime and PSR-4 permits unrelated filenames for namespaced classes', [
      ['Importing two namespaced classes with aliases', ['<?php', 'namespace App\\Checkout;', '', 'use Domain\\Billing\\Invoice as BillingInvoice;', 'use Vendor\\Pdf\\Invoice as PdfInvoice;', '', '$invoice = new BillingInvoice();', '$document = new PdfInvoice($invoice);']],
      ['Composer autoloading replaces manual class includes', ['<?php', "require __DIR__ . '/vendor/autoload.php';", '', '$container = new App\\Container();', '$handler = $container->get(App\\Http\\RequestHandler::class);', '$response = $handler->handle(App\\Http\\Request::fromGlobals());', '$response->send();']],
    ]),
  spec('Errors & exceptions', ['error levels', 'exceptions', 'Throwable', 'custom exceptions', 'finally'],
    'exceptions propagate until caught and finally runs for cleanup whether the operation succeeds or fails',
    'catching Exception handles every Throwable including engine Error values and finally runs only after successful work', [
      ['Catching domain failures without hiding programmer errors', ['<?php', 'try {', '    $order = $service->place($command);', '} catch (OutOfStock $error) {', '    http_response_code(409);', '    echo json_encode(["error" => $error->getMessage()]);', '} catch (Throwable $error) {', '    $logger->critical("Checkout crashed", ["exception" => $error]);', '    throw $error;', '}']],
      ['Finally releases a lock after either outcome', ['<?php', '$lock = fopen(__DIR__ . "/job.lock", "c+");', 'if (!flock($lock, LOCK_EX)) throw new RuntimeException("No lock");', '', 'try {', '    runImport();', '} finally {', '    flock($lock, LOCK_UN);', '    fclose($lock);', '}']],
    ]),
  spec('Enums, attributes & reflection', ['enums', 'backed enums', 'attributes', 'reflection', 'metadata'],
    'backed enums validate a closed set of scalar values and attributes store structured metadata that reflection can inspect',
    'enum cases are interchangeable with arbitrary strings and attributes execute their target method when declared', [
      ['Converting external data into a backed enum safely', ['<?php', 'enum OrderStatus: string {', '    case Pending = "pending";', '    case Paid = "paid";', '    case Cancelled = "cancelled";', '}', '', '$status = OrderStatus::tryFrom($_POST["status"] ?? "");', 'if ($status === null) throw new InvalidArgumentException("Unknown status");']],
      ['Reading an attribute without running the method', ['<?php', '#[Attribute(Attribute::TARGET_METHOD)]', 'final class Route { public function __construct(public string $path) {} }', '', 'final class Controller { #[Route("/health")] public function health(): array { return ["ok" => true]; } }', '', '$method = new ReflectionMethod(Controller::class, "health");', '$route = $method->getAttributes(Route::class)[0]->newInstance();', 'echo $route->path;']],
    ]),
  spec('Iterators, generators & fibers', ['iterators', 'generators', 'yield', 'lazy processing', 'fibers'],
    'generators produce values lazily and finally blocks still provide cleanup when iteration completes or is closed',
    'yield builds the complete result array before returning and fibers automatically make blocking I/O asynchronous', [
      ['Streaming a large file with a generator', ['<?php', 'function lines(string $path): Generator {', '    $handle = fopen($path, "rb");', '    try {', '        while (($line = fgets($handle)) !== false) {', '            yield rtrim($line);', '        }', '    } finally { fclose($handle); }', '}', '', 'foreach (lines("huge.log") as $line) process($line);']],
      ['Fiber suspension requires an external resume', ['<?php', '$fiber = new Fiber(function (): string {', '    $value = Fiber::suspend("waiting");', '    return "resumed with $value";', '});', '', '$signal = $fiber->start();', 'echo $signal;', '$fiber->resume("data");', 'echo $fiber->getReturn();']],
    ]),
  spec('Testing, style & static analysis', ['PHPUnit', 'test doubles', 'PSR-12', 'PHPStan', 'Psalm'],
    'a focused test asserts observable behavior while static analysis finds type-contract problems without executing the application',
    'code-formatting tools prove runtime correctness and a passing unit test guarantees every integration behaves correctly', [
      ['Testing a collaborator through its public contract', ['<?php', 'final class PriceCalculatorTest extends PHPUnit\\Framework\\TestCase {', '    public function test_applies_percentage_discount(): void {', '        $discounts = $this->createStub(Discounts::class);', '        $discounts->method("forCustomer")->willReturn(0.10);', '', '        $calculator = new PriceCalculator($discounts);', '        self::assertSame(900, $calculator->total(1000, customerId: 7));', '    }', '}']],
      ['A generic docblock exposes a type mismatch to analysis', ['<?php', '/** @template T @param list<T> $items @return T */', 'function first(array $items) {', '    if ($items === []) throw new InvalidArgumentException("Empty list");', '    return $items[0];', '}', '', '/** @var int $id */', '$id = first(["not", "numbers"]);', '// PHPStan or Psalm reports the incompatible assignment.']],
    ]),
  spec('APIs, integrations & PSRs', ['REST APIs', 'cURL', 'Guzzle', 'PSR-7', 'PSR-15'],
    'HTTP clients must check transport and protocol failures and PSR interfaces let middleware and messages cooperate through stable contracts',
    'a successful network connection guarantees a successful HTTP response and PSR-7 response objects are mutated in place', [
      ['Checking both cURL transport and HTTP status', ['<?php', '$handle = curl_init("https://api.example.test/orders/42");', 'curl_setopt_array($handle, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 5]);', '$body = curl_exec($handle);', 'if ($body === false) throw new RuntimeException(curl_error($handle));', '', '$status = curl_getinfo($handle, CURLINFO_RESPONSE_CODE);', 'if ($status >= 400) throw new RuntimeException("HTTP $status");', '$data = json_decode($body, true, flags: JSON_THROW_ON_ERROR);']],
      ['PSR-7 methods return a changed copy', ['<?php', 'use Psr\\Http\\Message\\ResponseInterface;', '', 'function asJson(ResponseInterface $response, array $data): ResponseInterface {', '    $response->getBody()->write(json_encode($data, JSON_THROW_ON_ERROR));', '    return $response', '        ->withHeader("Content-Type", "application/json")', '        ->withStatus(200);', '}']],
    ]),
  spec('Performance, processes & servers', ['OPcache', 'profiling', 'processes', 'environment variables', 'PHP-FPM', 'Apache and Nginx'],
    'long-running workers must release resources and reset request-specific state while PHP-FPM, the web server, and OPcache solve different deployment concerns',
    'OPcache caches database results and a long-running worker receives a completely fresh process for every job automatically', [
      ['Resetting per-job state in a long-running worker', ['<?php', 'while ($job = $queue->reserve()) {', '    try {', '        $container->get(JobHandler::class)->handle($job);', '        $queue->ack($job);', '    } catch (Throwable $error) {', '        $queue->release($job);', '    } finally {', '        $entityManager->clear();', '        gc_collect_cycles();', '    }', '}']],
      ['Separating environment configuration from code', ['<?php', '$dsn = getenv("DATABASE_DSN");', 'if ($dsn === false || $dsn === "") {', '    throw new RuntimeException("DATABASE_DSN is required");', '}', '', '$pdo = new PDO($dsn, options: [', '    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,', '    PDO::ATTR_PERSISTENT => false,', ']);']],
    ]),
];

export const phpQuestions = roadmapBank('PHP', 'php', specs, { extended: true });
