<?php

// Trusted test scaffolding. The caller supplies a new temporary directory for
// each observation; nothing here connects to an application or external service.
require __DIR__.'/harness/vendor/autoload.php';

$base = getcwd();
foreach (['bootstrap/cache', 'config', 'routes', 'app', 'storage/framework/views', 'storage/framework/cache', 'storage/framework/sessions', 'storage/logs', 'resources/views', 'lang'] as $directory) {
    if (! is_dir($base.'/'.$directory)) {
        mkdir($base.'/'.$directory, 0700, true);
    }
}

file_put_contents($base.'/bootstrap/providers.php', '<?php return [];');
$configs = [
    'app' => ['name' => 'Isolated fixture', 'env' => 'testing', 'debug' => false, 'url' => 'http://localhost', 'timezone' => 'UTC', 'locale' => 'en', 'fallback_locale' => 'en', 'key' => 'base64:'.base64_encode(str_repeat('x', 32)), 'cipher' => 'AES-256-CBC'],
    'database' => ['default' => 'sqlite', 'connections' => ['sqlite' => ['driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => true]]],
    'cache' => ['default' => 'array', 'stores' => ['array' => ['driver' => 'array', 'serialize' => false]]],
    'session' => ['driver' => 'array', 'lifetime' => 120, 'encrypt' => false, 'cookie' => 'fixture_session', 'path' => '/', 'domain' => null, 'secure' => false, 'http_only' => true, 'same_site' => 'lax', 'lottery' => [0, 100]],
    'queue' => ['default' => 'sync', 'connections' => ['sync' => ['driver' => 'sync', 'after_commit' => false]]],
    'mail' => ['default' => 'array', 'mailers' => ['array' => ['transport' => 'array']], 'from' => ['address' => 'fixture@example.test', 'name' => 'Fixture']],
    'logging' => ['default' => 'single', 'channels' => ['single' => ['driver' => 'single', 'path' => $base.'/storage/logs/test.log']]],
    'filesystems' => ['default' => 'local', 'disks' => ['local' => ['driver' => 'local', 'root' => $base.'/storage/app', 'throw' => true]]],
    'view' => ['paths' => [$base.'/resources/views'], 'compiled' => $base.'/storage/framework/views'],
];
foreach ($configs as $name => $values) {
    file_put_contents($base.'/config/'.$name.'.php', '<?php return '.var_export($values, true).';');
}

$app = Illuminate\Foundation\Application::configure(basePath: $base)
    ->withRouting(using: function () use ($base): void {
        if (is_file($base.'/routes/fixture.php')) {
            require $base.'/routes/fixture.php';
        }
    })
    ->withMiddleware()
    ->withExceptions()
    ->create();
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

