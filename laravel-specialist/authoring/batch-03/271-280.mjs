import {q,file,output,contract} from '../record.mjs';
import {model,relations} from './fixture.mjs';
const work=String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

Schema::create('tasks', function ($t) {
    $t->id();
    $t->boolean('done')->default(false);
});
DB::table('tasks')->insert([
    ['id' => 1], ['id' => 2], ['id' => 3], ['id' => 4],
]);
`;
export default [
q({n:271,type:'D',sub:'chunk-mutable-filter-skips',needs:['Query Builder chunking','Offset versus keyset pagination'],why:'Keep progress anchored to an unchanged key when processed rows leave the filtered set.',docs:['queries#chunking-results'],ask:'A worker selects done=false tasks in id order, uses chunk(2), and marks each returned row done=true. Some tasks are skipped as the remaining set shrinks. IDs never change and new rows are not inserted during this run. Which replacement avoids this offset-shift failure?',choices:[['Use chunkById(2) while retaining the done=false condition.','Key-based continuation uses the last processed id rather than an offset into a shrinking filtered result.'],['Increase chunk(2) to chunk(3) while keeping offset pagination.','A different finite offset chunk size does not remove the shifting-set problem in general.'],['Keep chunk(2) and order by done before id.','Processed rows still leave the filtered set, so later offsets can skip remaining rows.'],['Call get()->chunk(2) to keep database retrieval memory bounded.','Collection chunking begins after all matching rows have been materialized and does not satisfy bounded retrieval.']],test:output('2:0',work+String.raw`DB::table('tasks')->where('done', false)->orderBy('id')->chunk(2, function ($rows) {
    DB::table('tasks')->whereIn('id', $rows->pluck('id'))->update(['done' => true]);
});
echo DB::table('tasks')->where('done', false)->count().':';
DB::table('tasks')->update(['done' => false]);
DB::table('tasks')->where('done', false)->chunkById(2, function ($rows) {
    DB::table('tasks')->whereIn('id', $rows->pluck('id'))->update(['done' => true]);
});
echo DB::table('tasks')->where('done', false)->count();`)}),
q({n:272,type:'R',sub:'lazy-before-not-after-get',needs:['Query Builder lazy iteration','Materialization boundary'],why:'Ensure laziness starts at retrieval rather than after an expensive full fetch.',docs:['queries#streaming-results-lazily'],ask:'A read-only export processes one row at a time and retains none. Its current get()->lazy() still allocates the full result first. Which retrieval keeps application-side batches bounded at 200 rows?',choices:[['DB::table("records")->orderBy("id")->lazy(200)','Builder lazy fetches successive chunks while exposing row iteration; no initial get materializes the full result.'],['DB::table("records")->orderBy("id")->get()->lazy(200)','The initial get has already allocated all rows before the lazy wrapper exists.'],['collect(DB::table("records")->orderBy("id")->get())->chunk(200)','Collection chunking splits an already loaded result and does not bound retrieval memory.'],['DB::table("records")->orderBy("id")->lazy(200)->all()','all materializes the full lazy result, defeating the one-row-at-a-time consumption requirement.']],test:output('Illuminate\\Support\\LazyCollection:4',work+String.raw`$rows = DB::table('tasks')->orderBy('id')->lazy(2);
echo get_class($rows).':'.$rows->count();`)}),
q({n:273,type:'A',sub:'bounded-eager-loading-not-cursor',needs:['Eloquent cursor','Eager loading','Batch iteration'],why:'Satisfy bounded model batches and avoid per-row relationship queries together.',docs:['eloquent#cursors','eloquent#streaming-results-lazily'],ask:'An export must iterate every writer and their articles with bounded parent batches. The proposed Writer::with("articles")->cursor() is assumed to eager-load those children automatically. Which alternative fits both requirements when each writer’s child set is itself bounded?',choices:[['Writer::with("articles")->lazyById(200), consumed without collecting all results.','Chunked lazy retrieval hydrates parent batches and applies eager loading to each batch; cursor does not support that eager-loading behavior.'],['Keep with("articles")->cursor(); each cursor row already includes its child collection.','The Eloquent cursor path does not perform eager loading of the declared relation.'],['Writer::with("articles")->get()->lazy(), consumed one item at a time.','The initial get hydrates every writer and child collection before lazy iteration begins.'],['Writer::cursor(), then read articles on every writer without an explicit loading strategy.','This bounds parent hydration but introduces separate child queries as each unloaded relation is accessed.']],test:output('loaded,loaded',relations+String.raw`echo Writer::with('articles')->lazyById(1)->map(fn ($w) => $w->relationLoaded('articles') ? 'loaded' : 'missing')->implode(',');`)}),
q({n:274,type:'D',sub:'chunk-by-id-projection-alias',needs:['Query Builder chunkById','Selected aliases'],why:'Expose the continuation key under the result property name the chunker actually reads.',docs:['queries#chunking-results'],ask:'A query selects records.id AS cursor_id and name. chunkById uses records.id for SQL comparisons, but must read cursor_id from each returned row. Which call supplies both names?',choices:[['chunkById(100, $callback, "records.id", "cursor_id")','The column argument identifies the SQL key and the alias argument identifies the returned property containing the last key.'],['chunkById(100, $callback, "cursor_id", "records.id")','This reverses the SQL column and result property roles.'],['chunkById(100, $callback, "records.id")','Without the alias override, the continuation reader expects the column-derived name rather than cursor_id.'],['chunkById(100, $callback, "name", "cursor_id")','This uses name for comparisons but numeric ids for continuation values, breaking the key contract.']],test:output('1,2,3,4',work+String.raw`$seen = [];
DB::table('tasks')->select('tasks.id as cursor_id')->chunkById(2, function ($rows) use (&$seen) {
    foreach ($rows as $row) {
        $seen[] = $row->cursor_id;
    }
}, 'tasks.id', 'cursor_id');
echo implode(',', $seen);`)}),
q({n:275,type:'T',sub:'cursor-pagination-unique-tiebreaker',needs:['Cursor pagination','Stable composite ordering'],why:'Design a regression around tied business values and a unique continuation tuple.',docs:['pagination#cursor-pagination'],ask:'Several articles share the same non-null published_at value. For a static dataset, which cursor ordering avoids losing or repeating rows solely because these timestamps tie?',choices:[['orderBy("published_at")->orderBy("id"), with id unique.','The pair forms a unique ordered cursor position, so rows with equal publication time remain distinguishable.'],['orderBy("published_at") alone.','A nonunique cursor position cannot distinguish every row at the boundary.'],['orderByRaw("RANDOM()") on each request.','A changing order cannot provide a stable continuation from the previous page.'],['orderBy("published_at")->orderBy("published_at") with the same column twice.','Repeating the same nonunique value does not add a tiebreaker.']],test:output('1,2,3',String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('articles', function ($t) {
    $t->id();
    $t->dateTime('published_at');
});
DB::table('articles')->insert([
    ['id' => 1, 'published_at' => '2026-01-01'],
    ['id' => 2, 'published_at' => '2026-01-01'],
    ['id' => 3, 'published_at' => '2026-01-01'],
]);
$query = fn () => DB::table('articles')->orderBy('published_at')->orderBy('id');
$first = $query()->cursorPaginate(2);
$next = $query()->cursorPaginate(2, ['*'], 'cursor', $first->nextCursor());
echo collect($first->items())->merge($next->items())->pluck('id')->implode(',');`)}),
q({n:276,type:'I',level:'F',sub:'simple-pagination-without-count',needs:['Laravel pagination','Query cost'],why:'Avoid an unnecessary total count when the interface needs only adjacent-page navigation.',docs:['pagination#simple-pagination'],ask:'A large activity feed needs numbered offset pages with Next and Previous links but no total row count or last-page link. Which standard paginator avoids the total-count query?',choices:[['simplePaginate(25)','Simple pagination fetches enough rows to know whether another page exists without computing the total.'],['paginate(25)','The length-aware paginator obtains a total count to support its metadata.'],['get()->forPage($page, 25)','This loads the full query result before slicing it in memory.'],['limit(25)->get()','A limited collection alone does not provide the requested standard page navigation metadata.']],test:output('1:more',work+String.raw`DB::enableQueryLog();
$page = DB::table('tasks')->orderBy('id')->simplePaginate(2);
echo count(DB::getQueryLog()).':'.($page->hasMorePages() ? 'more' : 'end');`)}),
q({n:277,type:'D',sub:'upsert-conflict-unique-index',needs:['Query Builder upsert','Database unique indexes'],why:'Align the declared conflict key with an actual database-enforced uniqueness rule.',docs:['queries#upserts'],assume:['SQLite 3.24+; email is a normal non-null text column with no unique index yet.'],ask:'DB::table("contacts")->upsert($rows, ["email"], ["name"]) fails because the conflict target does not match a unique constraint. What schema change supports the intended one-row-per-email contract?',choices:[['Add a unique index on email after resolving existing duplicates.','SQLite requires the conflict target to identify a real unique or primary-key constraint; the application also needs that uniqueness rule.'],['Add a nonunique index on email.','A lookup index alone does not define which duplicate insertion is a conflict.'],['Add email to an Eloquent model’s $fillable array.','This Query Builder operation and its database conflict target do not use mass-assignment permissions.'],['Make email nullable but leave all indexes unchanged.','Nullability does not create a unique conflict target.']],test:output('New:1',String.raw`Illuminate\Support\Facades\Schema::create('contacts', function ($t) {
    $t->id();
    $t->string('email')->unique();
    $t->string('name');
});
$db = Illuminate\Support\Facades\DB::table('contacts');
$db->insert(['email' => 'a@example.test', 'name' => 'Old']);
$db->upsert([['email' => 'a@example.test', 'name' => 'New']], ['email'], ['name']);
echo $db->value('name').':'.$db->count();`)}),
q({n:278,revision:2,type:'E',sub:'insert-get-id-without-model-lifecycle',needs:['Query Builder insertGetId','Eloquent lifecycle boundary'],why:'Separate raw table insertion from model timestamp and observer behavior.',docs:['queries#auto-incrementing-ids','eloquent#events'],ask:'records has nullable timestamps. Record has a creating observer that increments a counter. The table starts empty. What follows DB::table("records")->insertGetId(["name" => "new"])?',choices:[['The id is returned; no observer runs or timestamps are filled.','Query Builder inserts directly and retrieves the key without constructing or saving an Eloquent model.'],['It returns a Record model and runs creating before the insert.','insertGetId returns the identifier, not an Eloquent model with lifecycle hooks.'],['It returns the id and runs the observer once because the table name matches Record.','Query Builder does not infer a model class from the table name.'],['It returns the id and automatically fills both timestamps using Record’s defaults.','Eloquent timestamp behavior does not apply to this direct table operation.']],test:output('1:0:null',model+String.raw`Record::query()->delete();
DB::statement("DELETE FROM sqlite_sequence WHERE name = 'records'");
$events = 0;
Record::creating(function () use (&$events) {
    $events++;
});
$id = DB::table('records')->insertGetId(['name' => 'new']);
echo $id.':'.$events.':'.(DB::table('records')->value('created_at') === null ? 'null' : 'date');`)}),
q({n:279,type:'R',sub:'atomic-counter-increment',needs:['Query Builder atomic updates','Lost updates'],why:'Make the database compute the new value from its current state in one write.',docs:['queries#increment-and-decrement'],ask:'Two workers read views=10, each computes 11, and both write 11. Each request should contribute one increment. With no extra per-update conditions, which operation avoids this lost increment?',choices:[['DB::table("pages")->where("id", $id)->increment("views")','The database performs views = views + 1 atomically for each update rather than writing a stale application-computed value.'],['Read views again immediately before update(["views" => $views + 1]).','A concurrent write can still occur between the separate read and update.'],['Wrap only the initial SELECT in a transaction, then update after it commits.','The write is outside the protected transaction and can still use stale data.'],['Use update(["views" => 11]) twice because both requests intend the same increment.','Writing the same absolute value twice still records only one increase from 10.']],test:output('12',String.raw`Illuminate\Support\Facades\Schema::create('pages', function ($t) {
    $t->id();
    $t->integer('views');
});
Illuminate\Support\Facades\DB::table('pages')->insert(['id' => 1, 'views' => 10]);
Illuminate\Support\Facades\DB::table('pages')->where('id', 1)->increment('views');
Illuminate\Support\Facades\DB::table('pages')->where('id', 1)->increment('views');
echo Illuminate\Support\Facades\DB::table('pages')->value('views');`)}),
q({n:280,revision:2,type:'A',sub:'row-lock-transaction-write-boundary',needs:['PostgreSQL row locks','Laravel transactions','Read-modify-write invariants'],why:'Keep the lock lifetime, validation read and corresponding write in one transaction.',docs:['queries#pessimistic-locking','database#database-transactions','https://www.postgresql.org/docs/18/explicit-locking.html'],assume:['PostgreSQL 18, READ COMMITTED, ordinary autocommit outside DB::transaction. Every competing stock writer follows the selected protocol.'],ask:'Stock must never become negative. A request reads stock, checks availability and decrements it. Which lock placement protects that read/check/write sequence against another buyer?',choices:[['Inside one transaction, select the stock row with lockForUpdate, check it, then update before committing.','The row lock remains held through the check and write, serializing competing participants in this protocol.'],['Select with lockForUpdate in autocommit, then start a transaction for the check and update.','The locking statement’s transaction has ended before the protected work begins, so the lock no longer spans the sequence.'],['Read and check normally, update, then select with lockForUpdate before returning.','A lock acquired after the decision and write cannot retroactively protect the earlier stale read.'],['Lock only a separate audit row while all buyers read the stock row without a common lock.','Different audit rows do not serialize access to the shared stock invariant.']],test:contract('Illuminate/Database/Query/Builder.php',['public function lockForUpdate()','return $this->lock(true);'],'Laravel requests a write row lock; PostgreSQL holds it until transaction end. Transaction placement and invariant reasoning are documented-contract validation, not a SQLite concurrency test.')}),
];
