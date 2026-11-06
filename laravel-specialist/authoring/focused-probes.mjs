import {queue} from './batch-04/fixture.mjs';
export const probes={
eager:String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('writers', function ($t) {
    $t->integer('id')->primary();
});
Schema::create('articles', function ($t) {
    $t->integer('id')->primary();
    $t->integer('writer_id');
});
DB::table('writers')->insert([['id' => 1], ['id' => 2]]);
DB::table('articles')->insert([
    ['id' => 1, 'writer_id' => 1],
    ['id' => 2, 'writer_id' => 1],
    ['id' => 3, 'writer_id' => 2],
]);
if (version_compare(DB::selectOne('select sqlite_version() as v')->v, '3.25.0', '<')) {
    throw new LogicException('SQLite window support required');
}
DB::enableQueryLog();
require getcwd().'/query.php';
$ids = $writers->map(fn ($writer) => $writer->articles->pluck('id')->all())->all();
if ($ids !== [[2], [3]]) {
    throw new LogicException('Incorrect per-parent article identities');
}
$sql = implode("\n", array_column(DB::getQueryLog(), 'query'));
if (! str_contains(strtolower($sql), 'row_number() over (partition by')) {
    throw new LogicException('Grouped window query not observed');
}`,
payments:String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

Schema::create('orders', function ($t) {
    $t->integer('checkout_id')->primary();
    $t->boolean('paid');
    $t->string('payment_key')->nullable();
});
$running = false;
$writes = 0;
$mode = '';
$currentKey = '';
DB::listen(function ($event) use (&$running, &$writes) {
    if ($running && str_starts_with($event->sql, 'update "orders" set "paid"')) {
        $writes++;
        if ($writes === 1) {
            throw new PDOException('serialization failure', 40001);
        }
    }
});
app('events')->listen(Illuminate\Database\Events\TransactionRolledBack::class, function () use (&$mode, &$currentKey) {
    if ($mode === 'rotated') {
        $currentKey = (string) Str::uuid();
    }
});
$original = file_get_contents(getcwd().'/checkout.php');
$line = '$key = (string) Str::uuid();';
$variants = [
    'original' => $original,
    'captured' => str_replace(
        ['DB::transaction(', 'use ($payments, $checkoutId)', '    '.$line."\n"],
        ['$key = (string) Str::uuid();'."\n\n".'DB::transaction(', 'use ($payments, $checkoutId, $key)', ''],
        $original,
    ),
    'saved' => str_replace($line, $line."\n".'    DB::table("orders")->where("checkout_id", $checkoutId)->update(["payment_key" => $key]);', $original),
    'factory' => str_replace(
        ['DB::transaction(', 'use ($payments, $checkoutId)', $line],
        ['$newKey = fn () => (string) Str::uuid();'."\n\n".'DB::transaction(', 'use ($payments, $checkoutId, $newKey)', '$key = $newKey();'],
        $original,
    ),
    'rotated' => str_replace(
        ['use ($payments, $checkoutId)', $line],
        ['use ($payments, $checkoutId, &$currentKey)', '$key = $currentKey;'],
        $original,
    ),
];
$out = [];
foreach ($variants as $mode => $source) {
    DB::table('orders')->delete();
    DB::table('orders')->insert(['checkout_id' => 7, 'paid' => false]);
    $checkoutId = 7;
    $currentKey = (string) Str::uuid();
    $payments = new class {
        public int $calls = 0;
        public array $charges = [];

        public function charge(int $checkoutId, string $key): void
        {
            $this->calls++;
            $this->charges[$checkoutId.':'.$key] = true;
        }
    };
    $writes = 0;
    $running = true;
    file_put_contents(getcwd().'/candidate.php', $source);
    require getcwd().'/candidate.php';
    $running = false;
    if (! DB::table('orders')->value('paid') || $writes !== 2) {
        throw new LogicException('Expected retried transaction to commit');
    }
    $out[] = $mode.'='.$payments->calls.'/'.count($payments->charges);
}
echo implode(';', $out);`,
recovery:String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
Schema::create('results', function ($t) {
    $t->id();
    $t->integer('source_id');
});
Schema::create('safe_results', function ($t) {
    $t->integer('run_id');
    $t->integer('source_id');
    $t->unique(['run_id', 'source_id']);
});
$run = function (int $from, int $to, bool $safe) {
    foreach (range($from, $to) as $id) {
        if ($safe) {
            DB::table('safe_results')->insertOrIgnore(['run_id' => 9, 'source_id' => $id]);
        } else {
            DB::table('results')->insert(['source_id' => $id]);
        }
    }
};
$run(1, 3, true);
$run(1, 5, true);
echo 'safe='.DB::table('safe_results')->count().'/'.DB::table('safe_results')->distinct()->count('source_id');
$run(1, 2, false);
$checkpoint = 3;
// Simulated exit after checkpoint 3 commits, before result 3 is inserted.
$run($checkpoint + 1, 5, false);
echo ';checkpoint-first='.DB::table('results')->count();
DB::table('results')->delete();
$run(1, 3, false);
$checkpoint = 2;
// Simulated exit after result 3 commits, before its checkpoint advances.
$run($checkpoint + 1, 5, false);
echo ';checkpoint-last='.DB::table('results')->count();`,
migration:String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
Schema::create('profiles', function ($t) {
    $t->id();
    $t->string('full_name');
});
DB::table('profiles')->insert(['id' => 1, 'full_name' => 'Old']);
Schema::table('profiles', function ($t) {
    $t->string('display_name')->nullable();
});
$reset = function () {
    DB::table('profiles')->where('id', 1)->update(['full_name' => 'Old', 'display_name' => null]);
};
$copyCurrent = fn () => DB::table('profiles')->update(['display_name' => DB::raw('full_name')]);
$legacyWrite = fn ($name) => DB::table('profiles')->where('id', 1)->update(['full_name' => $name]);
$bridgeWrite = fn ($name) => DB::table('profiles')->where('id', 1)->update(['full_name' => $name, 'display_name' => $name]);
$copyCurrent();
$legacyWrite('V1-latest');
// Until V1 drains, the bridge reader still sees full_name = V1-latest.
if (DB::table('profiles')->value('full_name') !== 'V1-latest') {
    throw new LogicException('Wrong authoritative read');
}
// V1 and its transactions have now drained.
$bridgeWrite('Bridge');
$copyCurrent();
$bridgeWrite('Latest');
$row = DB::table('profiles')->first();
echo 'safe='.$row->full_name.'/'.$row->display_name;
$reset();
$copyCurrent();
$legacyWrite('New');
echo ';coalesce='.DB::table('profiles')->selectRaw('COALESCE(display_name, full_name) AS name')->first()->name;
$reset();
$snapshot = DB::table('profiles')->value('full_name');
$bridgeWrite('New');
DB::table('profiles')->update(['display_name' => $snapshot]);
echo ';snapshot='.DB::table('profiles')->value('display_name');
$reset();
DB::table('profiles')->update(['display_name' => 'V2']);
$legacyWrite('V1');
DB::table('profiles')->whereNull('display_name')->update(['display_name' => DB::raw('full_name')]);
$row = DB::table('profiles')->first();
echo ';split='.$row->display_name.'/'.$row->full_name;`,
outboxSupplement:queue+String.raw`use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
Schema::create('orders', function ($t) {
    $t->id();
    $t->string('name');
});
Schema::create('pending_events', function ($t) {
    $t->string('id')->primary();
    $t->integer('order_id');
});
class Order extends Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;
    protected $guarded = [];
}
class PublishOrder implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;
    public function __construct(public int $orderId)
    {
    }
    public function handle(): void
    {
    }
}
$failBeforeEnqueue = true;
app('events')->listen(Illuminate\Queue\Events\JobQueueing::class, function () use (&$failBeforeEnqueue) {
    if ($failBeforeEnqueue) {
        throw new RuntimeException('simulated process loss before durable queue insert');
    }
});
$payload = ['name' => 'committed'];
// Use a local queue as an enqueue witness; no Redis connection is attempted.
$source = str_replace("->onConnection('redis')", "->onConnection('database')", file_get_contents(getcwd().'/order-action.php'));
file_put_contents(getcwd().'/action.php', "<?php\n".$source);
try {
    require getcwd().'/action.php';
} catch (RuntimeException $e) {
    if ($e->getMessage() !== 'simulated process loss before durable queue insert') {
        throw $e;
    }
}
echo 'afterCommit='.DB::table('orders')->count().'/'.DB::table('jobs')->count();
$failBeforeEnqueue = false;
DB::table('orders')->delete();
DB::transaction(function () {
    $order = Order::create(['name' => 'recoverable']);
    DB::table('pending_events')->insert(['id' => 'event-1', 'order_id' => $order->id]);
});
echo ';atomic='.DB::table('orders')->count().'/'.DB::table('pending_events')->count();
DB::table('orders')->delete();
DB::table('pending_events')->delete();
try {
    DB::transaction(function () {
        $order = Order::create(['name' => 'rolled back']);
        DB::table('pending_events')->insert(['id' => 'event-2', 'order_id' => $order->id]);
        throw new RuntimeException('rollback');
    });
} catch (RuntimeException) {
}
echo ';rollback='.DB::table('orders')->count().'/'.DB::table('pending_events')->count();
$deliveries = ['event-1', 'event-1'];
$effects = [];
foreach ($deliveries as $id) {
    $effects[$id] = true;
}
echo ';redelivery='.count($deliveries).'/'.count($effects);`
};
