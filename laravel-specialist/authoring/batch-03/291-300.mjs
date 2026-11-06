import {q,file,output,contract} from '../record.mjs';
import {model,relations} from './fixture.mjs';
const factory=String.raw`class RecordFactory extends Illuminate\Database\Eloquent\Factories\Factory
{
    protected $model = Record::class;

    public function definition(): array
    {
        return ['name' => 'factory'];
    }
}
`;
export default [
q({n:291,type:'R',sub:'change-restate-column-modifiers',needs:['Laravel schema change','Column modifiers'],why:'Preserve the intended full column definition while changing one aspect of it.',docs:['migrations#modifying-columns'],ask:'A nullable string label has default "pending". A migration changes its maximum length. Under Laravel 13’s change() contract, which declaration explicitly retains both existing modifiers?',choices:[['$table->string("label", 120)->nullable()->default("pending")->change();','Column changes should restate the modifiers that must remain; this keeps nullability and the default while setting the new length.'],['$table->string("label", 120)->change();','Omitted modifiers are not an instruction to preserve them automatically.'],['$table->string("label", 120)->nullable()->change();','This retains nullability but omits the required default.'],['$table->string("label", 120)->default("pending")->change();','This retains the default but omits the required nullable modifier.']],test:output('nullable:pending',String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('labels', function ($t) {
    $t->id();
    $t->string('label', 40)->nullable()->default('pending');
});
Schema::table('labels', function ($t) {
    $t->string('label', 120)->nullable()->default('pending')->change();
});
DB::table('labels')->insert(['label' => null]);
DB::table('labels')->insert(['id' => 2]);
echo (DB::table('labels')->where('id', 1)->value('label') === null ? 'nullable' : 'required').':'.DB::table('labels')->where('id', 2)->value('label');`)}),
q({n:292,type:'I',level:'F',sub:'rollback-unique-index-only',needs:['Laravel migration rollback','Index names'],why:'Reverse the constraint added by a migration while preserving existing column data.',docs:['migrations#dropping-indexes'],ask:'up() adds only a unique index named records_code_unique to an existing code column. down() must undo that change without deleting the code data. Which operation belongs in Schema::table("records", ...)?',choices:[['$table->dropUnique("records_code_unique");','Dropping the named unique index reverses the added constraint while leaving the column and its values.'],['$table->dropColumn("code");','This removes the column and its data, which the rollback must preserve.'],['$table->dropForeign("records_code_unique");','The named object is a unique index rather than a foreign-key constraint.'],['$table->unique("code", "records_code_unique");','This adds or attempts to recreate the constraint instead of removing it.']],test:output('A,A',model+String.raw`Schema::table('records', function ($t) {
    $t->unique('code');
});
Schema::table('records', function ($t) {
    $t->dropUnique('records_code_unique');
});
Record::create(['name' => 'second', 'code' => 'A']);
echo DB::table('records')->orderBy('id')->pluck('code')->implode(',');`)}),
q({n:293,type:'E',sub:'model-explicit-connection-default',needs:['Eloquent connection selection','Database manager defaults'],why:'Track an explicitly named model connection independently of the application default.',docs:['eloquent#database-connections'],ask:'Report has protected $connection = "analytics". A service changes the default connection to "primary". With no overrides on this model instance, where does Report::query() run?',choices:[['analytics','The model’s explicit connection name takes precedence over the manager’s default fallback.'],['primary','Changing the default does not erase an explicit model connection.'],['Both, merging the returned rows','Eloquent does not automatically fan one model query out across connections.'],['Whichever connection was opened most recently','Connection selection follows the model’s name, not connection-opening order.']],test:output('analytics:primary',String.raw`class Report extends Illuminate\Database\Eloquent\Model
{
    protected $connection = 'analytics';
}
config(['database.connections.analytics' => ['driver' => 'sqlite', 'database' => ':memory:'], 'database.connections.primary' => ['driver' => 'sqlite', 'database' => ':memory:']]);
app('db')->setDefaultConnection('primary');
echo Report::query()->getQuery()->getConnection()->getName().':'.app('db')->getDefaultConnection();`)}),
q({n:294,type:'T',level:'F',sub:'factory-make-versus-create',needs:['Eloquent factories','Persistence state'],why:'Choose a fixture constructor that matches whether the test needs a stored row.',docs:['eloquent-factories#instantiating-models','eloquent-factories#persisting-models'],ask:'A unit test needs a model’s generated attributes but no database insertion. With no callbacks or relationships that persist data, which factory call meets this requirement?',choices:[['RecordFactory::new()->make()','make constructs an unsaved model with factory attributes; exists remains false.'],['RecordFactory::new()->create()','create persists the generated model to the database.'],['RecordFactory::new()->createQuietly()','Quiet creation suppresses events but still writes the model.'],['RecordFactory::new()->count(1)->create()','Returning a collection does not remove the persistence performed by create.']],test:output('new:stored:1',model+factory+String.raw`Record::query()->delete();
$a = RecordFactory::new()->make();
$b = RecordFactory::new()->create();
echo ($a->exists ? 'stored' : 'new').':'.($b->exists ? 'stored' : 'new').':'.Record::count();`)}),
q({n:295,type:'I',sub:'factory-parent-for-child-has',needs:['Eloquent factory relationships','BelongsTo direction'],why:'Attach an existing parent through the child’s belongsTo relationship rather than creating children on it.',docs:['eloquent-factories#belongs-to-relationships'],ask:'Article belongsTo Writer through writer(). $writer already exists. An article factory must create three articles linked to that exact writer, without creating additional writers. Which call expresses this?',choices:[['ArticleFactory::new()->count(3)->for($writer, "writer")->create()','for assigns the belongsTo parent to each generated article using the existing model.'],['ArticleFactory::new()->count(3)->has($writer, "writer")->create()','has configures child factories rather than accepting this existing belongsTo parent model.'],['WriterFactory::new()->count(3)->has(ArticleFactory::new())->create()','This creates three additional writers instead of linking articles to the specified one.'],['ArticleFactory::new()->count(3)->create(["id" => $writer->id])','Copying the parent id into article primary keys does not set writer_id and can create key collisions.']],test:output('3:2',relations+String.raw`class ArticleFactory extends Illuminate\Database\Eloquent\Factories\Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        return ['title' => 'Generated'];
    }
}
Article::query()->delete();
ArticleFactory::new()->count(3)->for($writer, 'writer')->create();
echo $writer->articles()->count().':'.Writer::count();`)}),
q({n:296,type:'E',sub:'factory-sequence-cycles',needs:['Eloquent factory sequences'],why:'Follow repeating state selection across a count larger than the sequence.',docs:['eloquent-factories#sequences'],ask:'The factory’s normal definition is overridden by the shown sequence. What names are generated?',code:[file(String.raw`$records = RecordFactory::new()
    ->count(5)
    ->sequence(
        ['name' => 'draft'],
        ['name' => 'ready'],
    )
    ->make();

echo $records->pluck('name')->implode(',');`)],choices:[['draft,ready,draft,ready,draft','Sequence states repeat cyclically when more models are requested than there are states.'],['draft,ready,ready,ready,ready','The last sequence state is not permanently reused after the first cycle.'],['draft,draft,draft,draft,draft','The sequence advances for each generated model.'],['Only draft,ready; count is capped by the sequence length','The requested count remains five; the sequence does not truncate it.']],test:output('draft,ready,draft,ready,draft',model+factory+String.raw`require getcwd().'/probe.php';`)}),
q({n:297,type:'T',sub:'factory-callback-persisted-identity',needs:['Factory callbacks','Persistence lifecycle'],why:'Run a fixture setup that needs a generated primary key only after insertion.',docs:['eloquent-factories#factory-callbacks'],ask:'A factory callback must insert a dependent fixture using the newly generated model id. The id is assigned by the database. Which callback phase is appropriate when callers use create()?',choices:[['afterCreating, because the model has been persisted and its generated key is available.','afterCreating runs after insertion, so dependent fixture creation can use the stored parent identity.'],['afterMaking, because database-generated keys are assigned before an unsaved model is constructed.','afterMaking runs before persistence and does not guarantee a generated id.'],['definition, because it receives the final persisted model as its first argument.','The definition supplies attributes before model persistence; it does not receive the inserted model.'],['A state callback, because state transformations run after insertion.','State callbacks transform generated attributes before insertion rather than observing the saved model.']],test:output('making:new,creating:stored',model+factory+String.raw`$seen = [];
RecordFactory::new()
    ->afterMaking(function ($r) use (&$seen) {
        $seen[] = 'making:'.($r->id === null ? 'new' : 'stored');
    })
    ->afterCreating(function ($r) use (&$seen) {
        $seen[] = 'creating:'.($r->exists && $r->id !== null ? 'stored' : 'new');
    })
    ->create();
echo implode(',', $seen);`)}),
q({n:298,type:'E',sub:'seeder-scoped-model-event-suppression',needs:['Laravel seeders','WithoutModelEvents','Event dispatcher restoration'],why:'Track event suppression through the normal seeder invocation and its restoration afterwards.',docs:['seeding#muting-model-events'],ask:'Record has a created observer that increments a counter. The counter starts at zero. A seeder using WithoutModelEvents is invoked normally and creates two records. After it returns, ordinary application code creates one more. What is the counter?',choices:[['1','Events are muted inside the seeder invocation and the prior dispatcher is restored afterwards.'],['0','The trait does not permanently disable later model events outside the invocation.'],['2','The two seeded models are the suppressed operations, not the only observed ones.'],['3','Normal invocation recognizes the trait and wraps the run method with scoped event suppression.']],test:output('1',model+String.raw`$events = 0;
Record::created(function () use (&$events) {
    $events++;
});
class ImportSeeder extends Illuminate\Database\Seeder
{
    use Illuminate\Database\Console\Seeds\WithoutModelEvents;

    public function run(): void
    {
        Record::create(['name' => 'seed-one']);
        Record::create(['name' => 'seed-two']);
    }
}
(new ImportSeeder())();
Record::create(['name' => 'ordinary']);
echo $events;`)}),
q({n:299,type:'A',level:'A',sub:'active-only-unique-soft-delete',needs:['Soft deletes','Partial unique indexes','Database-enforced invariants'],why:'Enforce uniqueness for active records while permitting historical duplicates without relying on a nullable composite key.',docs:['eloquent#soft-deleting','migrations#indexes','https://www.sqlite.org/partialindex.html'],assume:['SQLite with partial-index support. Active rows have deleted_at=NULL; historical rows have a non-null deletion timestamp.'],ask:'An email may be reused after soft deletion, but at most one active row may have that email, including under concurrent insertions. Which database constraint matches this rule?',choices:[['A unique index on email with WHERE deleted_at IS NULL.','The partial index includes active rows only and enforces email uniqueness within that subset.'],['An ordinary unique index on (email, deleted_at).','SQLite permits multiple nulls under uniqueness, so multiple active rows can share the same email with deleted_at=NULL.'],['An ordinary unique index on email across every row.','This also blocks reuse when the only existing row is soft-deleted.'],['A nonunique email index plus an application pre-insert exists check.','The check is not an atomic uniqueness guarantee against concurrent insertions.']],test:output('2:active-conflict',String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('members', function ($t) {
    $t->id();
    $t->string('email');
    $t->softDeletes();
});
DB::statement('CREATE UNIQUE INDEX members_active_email ON members(email) WHERE deleted_at IS NULL');
DB::table('members')->insert(['email' => 'a@example.test', 'deleted_at' => '2026-01-01']);
DB::table('members')->insert(['email' => 'a@example.test', 'deleted_at' => null]);
try {
    DB::table('members')->insert(['email' => 'a@example.test', 'deleted_at' => null]);
} catch (Illuminate\Database\UniqueConstraintViolationException $e) {
    echo DB::table('members')->count().':active-conflict';
}`)}),
q({n:300,revision:2,type:'A',sub:'consistent-row-lock-acquisition-order',needs:['PostgreSQL row locks','Deadlock cycles','Transaction retry boundaries'],why:'Break the stated wait cycle by making all participants acquire the shared resources in the same order.',docs:['queries#pessimistic-locking','database#handling-deadlocks','https://www.postgresql.org/docs/18/explicit-locking.html'],assume:['PostgreSQL 18. Transfers lock two existing account rows one at a time with lockForUpdate inside a transaction. All transfer paths can follow the chosen rule.'],ask:'Transfer A locks account 4 then waits for 9. Transfer B locks 9 then waits for 4. Which change prevents this particular opposite-order cycle while retaining exclusive protection of both balances?',choices:[['Sort the two account IDs and acquire both row locks in ascending order in every transfer path.','A common resource order prevents one transfer holding 9 while waiting for 4 as another holds 4 and waits for 9. Other causes still warrant bounded retries.'],['Use the sender account first in every transfer, regardless of numeric order.','Opposite-direction transfers still start with different rows and recreate the described cycle.'],['Increase the deadlock retry count but keep both acquisition orders unchanged.','Retries can recover failed attempts but do not prevent this ordering cycle from recurring.'],['Acquire the second lock after committing the first balance update.','This splits the protected transfer and sacrifices atomic protection of the two balances.']],test:contract('Illuminate/Database/Query/Builder.php',['public function lockForUpdate()','return $this->lock(true);'],'PostgreSQL documents consistent lock acquisition order as the principal defense against this wait cycle. Laravel supplies the locking query; no multi-connection PostgreSQL execution is claimed.')}),
];
