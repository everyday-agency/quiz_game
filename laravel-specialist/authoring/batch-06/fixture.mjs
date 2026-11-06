export const logging = String.raw`$capture = new Monolog\Handler\TestHandler;
$monolog = new Monolog\Logger('fixture', [$capture]);
$logger = new Illuminate\Log\Logger($monolog, app('events'));
`;
export const exceptions = logging+String.raw`app()->instance(Psr\Log\LoggerInterface::class, $logger);
$handler = app(Illuminate\Contracts\Debug\ExceptionHandler::class);
$exceptions = new Illuminate\Foundation\Configuration\Exceptions($handler);
`;
export const passwords = String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('users', function ($t) {
    $t->id();
    $t->string('email')->unique();
    $t->string('password');
    $t->string('remember_token')->nullable();
    $t->timestamp('email_verified_at')->nullable();
});
Schema::create('password_reset_tokens', function ($t) {
    $t->string('email')->primary();
    $t->string('token');
    $t->timestamp('created_at')->nullable();
});
class Member extends Illuminate\Foundation\Auth\User implements Illuminate\Contracts\Auth\MustVerifyEmail
{
    protected $table = 'users';
    protected $guarded = [];
    public $timestamps = false;
}
$hasher = new Illuminate\Hashing\BcryptHasher(['rounds' => 4]);
$user = Member::create(['email' => 'ada@example.test', 'password' => $hasher->make('old-password')]);
$tokens = new Illuminate\Auth\Passwords\DatabaseTokenRepository(
    DB::connection(), $hasher, 'password_reset_tokens', 'fixture-hash-key', 3600, 60,
);
$provider = new Illuminate\Auth\EloquentUserProvider($hasher, Member::class);
$broker = new Illuminate\Auth\Passwords\PasswordBroker($tokens, $provider, timeboxDuration: 0);
`;
export const guard = String.raw`config([
    'auth.defaults.guard' => 'web',
    'auth.guards.web' => ['driver' => 'session', 'provider' => 'members'],
    'auth.providers.members' => ['driver' => 'eloquent', 'model' => Member::class],
]);
$guard = app('auth')->guard('web');
`;
