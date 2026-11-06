// Real Laravel client middleware/fakes; the terminal transport always rejects.
// This avoids Guzzle choosing a network handler even while every request is faked.
export const http = String.raw`$factory = new class extends Illuminate\Http\Client\Factory
{
    protected function newPendingRequest()
    {
        return parent::newPendingRequest()->setHandler(function () {
            throw new LogicException('No transport permitted in this fixture');
        });
    }
};
Illuminate\Support\Facades\Http::swap($factory);
`;
export const assertions = String.raw`PHPUnit\TextUI\Configuration\Registry::init(
    (new PHPUnit\TextUI\CliArguments\Builder)->fromParameters(['phpunit', '--no-configuration']),
    PHPUnit\TextUI\XmlConfiguration\DefaultConfiguration::create(),
);
`;
export const feature = assertions+String.raw`$test = new class('localFixture') extends Illuminate\Foundation\Testing\TestCase
{
    public function attach($application): void
    {
        $this->app = $application;
    }
    public function exposeExceptions(): void
    {
        $this->withoutExceptionHandling();
    }
};
$test->attach(app());
`;
export const inertia = String.raw`app()->register(Inertia\ServiceProvider::class);
config(['inertia.ssr.enabled' => false, 'inertia.dev_tools.enabled' => false]);
file_put_contents(resource_path('views/app.blade.php'), '<!doctype html><html><body>@inertia</body></html>');
`;
