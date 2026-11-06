import {q,file,output,contract} from '../record.mjs';
import {model} from './fixture.mjs';
export default [
q({n:281,type:'E',sub:'transaction-false-return-commits',needs:['Laravel transaction closure','Exceptions versus return values'],why:'Follow the success path when a callback returns false without throwing.',docs:['database#database-transactions'],ask:'The transaction starts normally and no exception occurs. What is printed?',code:[file(String.raw`use Illuminate\Support\Facades\DB;

$result = DB::transaction(function () {
    DB::table('records')->where('id', 1)->update(['name' => 'new']);

    return false;
});

echo json_encode($result).':'.DB::table('records')->where('id', 1)->value('name');`)],choices:[['false:new','The callback completed normally, so Laravel commits and returns the callback’s false value.'],['false:old','False is not an automatic rollback signal for DB::transaction.'],['true:new','Laravel preserves the callback’s return value instead of replacing it with a commit-success boolean.'],['A rollback exception','No exception is generated merely because the callback returned false.']],test:output('false:new',model+String.raw`require getcwd().'/probe.php';`)}),
q({n:282,type:'E',sub:'nested-savepoint-outer-continues',needs:['Laravel nested transactions','Savepoints','Exception scope'],why:'Identify which writes survive when an inner rollback is caught inside the outer closure.',docs:['database#database-transactions'],ask:'Which names remain after this code commits?',code:[file(String.raw`use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    DB::table('records')->insert(['name' => 'outer']);

    try {
        DB::transaction(function () {
            DB::table('records')->insert(['name' => 'inner']);

            throw new RuntimeException('cancel inner');
        });
    } catch (RuntimeException $e) {
        DB::table('records')->insert(['name' => 'recovered']);
    }
});

echo DB::table('records')->orderBy('id')->pluck('name')->implode(',');`)],assume:['The records table starts empty and supports name inserts; SQLite supports savepoints. No DDL or implicit commits occur inside these transactions.'],choices:[['outer,recovered','The inner transaction rolls back to its savepoint. The exception is caught inside the outer closure, which commits its surviving work.'],['outer,inner,recovered','The inner insertion is undone by its rollback before recovery continues.'],['recovered','The inner rollback does not erase work done before its savepoint.'],['No rows','The caught inner failure does not automatically force the outer transaction to roll back.']],test:output('outer,recovered',model+String.raw`DB::table('records')->delete();
require getcwd().'/probe.php';`)}),
q({n:283,type:'E',sub:'rolled-back-nested-after-commit',needs:['Laravel afterCommit callbacks','Nested transactions','Rollback scope'],why:'Track callbacks against the transaction level that registered them.',docs:['database#database-transactions','queues#jobs-and-database-transactions'],ask:'The connection has Laravel’s transaction manager. What is printed when the outer transaction commits?',code:[file(String.raw`use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    DB::afterCommit(fn () => print('outer'));

    try {
        DB::transaction(function () {
            DB::afterCommit(fn () => print('inner'));

            throw new RuntimeException('cancel inner');
        });
    } catch (RuntimeException $e) {
        // The outer transaction may continue.
    }
});`)],choices:[['outer','The callback registered in the rolled-back nested transaction is discarded; the outer callback runs after the root commit.'],['outerinner','The nested callback does not survive its transaction’s rollback.'],['innerouter','The nested transaction never commits successfully and its callback is not executed first.'],['Nothing','The surviving outer callback still executes after the successful outer commit.']],test:output('outer')}),
q({n:284,revision:2,type:'A',level:'A',sub:'transaction-retry-external-side-effect',needs:['Laravel transaction retries','Concurrency errors','External idempotency'],why:'Separate retried database work from a nontransactional side effect and account for retry duplication.',docs:['database#handling-deadlocks'],ask:'A transaction closure charges a payment provider, then writes an order. A recognized concurrency error causes Laravel to retry the closure. The provider call is not part of the database transaction. What must the design address?',choices:[['Use a stable payment idempotency key and a durable reconciliation workflow.','Database rollback cannot undo the external charge, and retry can invoke the closure again. A stable external operation identity and recovery protocol are needed.'],['The provider charge is rolled back automatically with the order insert.','The provider is outside this database transaction and does not participate in its rollback.'],['Laravel resumes the closure at the failed SQL statement, so the earlier charge runs only once.','A retry invokes the callback again rather than resuming a PHP instruction within it.'],['Setting attempts=1 makes the charge and order atomic across both systems.','Disabling retry avoids automatic repetition but still leaves a failure window after the provider succeeds and before the order commits.']],test:output('2:1',model+String.raw`$charges = 0;
DB::transaction(function () use (&$charges) {
    $charges++;
    DB::table('records')->where('id', 1)->increment('version');
    if ($charges === 1) {
        throw new PDOException('serialization failure', 40001);
    }
}, attempts: 2);
echo $charges.':'.(DB::table('records')->value('version') - 1);`)}),
q({n:285,revision:2,type:'E',sub:'sticky-read-write-routing',needs:['Laravel read/write connections','Sticky reads','Replica lag'],why:'Understand connection routing without assuming replication has caught up.',docs:['database#the-sticky-option'],ask:'A request uses a configured read/write connection with sticky=true. After a successful write on that connection, where do subsequent ordinary reads go during that request?',choices:[['To the writer; replication remains asynchronous.','The modified-record flag and sticky option route reads to the writer for the current connection lifecycle.'],['To the replica after Laravel waits for a matching replication position.','The sticky option does not implement a replica catch-up wait protocol.'],['To the replica as usual because stickiness affects writes only.','The purpose of sticky routing is to redirect later reads after a write.'],['To whichever connection returned the first read result, even after the write.','The post-write modification state changes routing; it is not fixed by the first read.']],test:output('reader:writer',String.raw`$write = new PDO('sqlite::memory:');
$read = new PDO('sqlite::memory:');
foreach ([[$write, 'writer'], [$read, 'reader']] as [$pdo, $label]) {
    $pdo->exec('CREATE TABLE samples (name TEXT)');
    $pdo->exec("INSERT INTO samples (name) VALUES ('$label')");
}
$c = new Illuminate\Database\SQLiteConnection($write, ':memory:', '', ['sticky' => true]);
$c->setReadPdo($read);
echo $c->table('samples')->value('name').':';
$c->table('samples')->where('name', 'writer')->update(['name' => 'writer']);
echo $c->table('samples')->value('name');`)}),
q({n:286,type:'R',sub:'query-listener-sensitive-bindings',needs:['Laravel query events','Logging data boundaries'],why:'Keep diagnostic timing while avoiding routine disclosure of confidential bound values.',docs:['database#listening-for-query-events','logging'],ask:'A DB::listen callback sends $event->toRawSql() to a general operational log. Some queries bind password-reset tokens and private message text. Which revision keeps basic query diagnostics while reducing this disclosure?',choices:[['Log placeholder SQL, elapsed time and connection name; redact or omit sensitive bindings.','The SQL shape and timing can identify slow query patterns without routinely expanding secrets into the log.'],['Log $event->bindings separately because prepared parameters are automatically anonymized.','Bindings contain actual values; parameterization protects SQL structure, not log confidentiality.'],['Log toRawSql only for successful queries because failed queries are the sensitive ones.','Successful queries can contain the same confidential values.'],['Base64-encode toRawSql before writing it to the same general log.','Reversible encoding does not remove the sensitive content from the log.']],test:output('placeholder:secret-bound',model+String.raw`$observed = null;
DB::listen(function ($event) use (&$observed) {
    $observed = $event;
});
DB::table('records')->where('code', 'private-token')->get();
echo (str_contains($observed->sql, '?') ? 'placeholder' : 'expanded').':'.(in_array('private-token', $observed->bindings, true) ? 'secret-bound' : 'missing');`)}),
q({n:287,type:'D',sub:'nullable-before-constrained',needs:['Laravel migrations','Column versus foreign-key definitions'],why:'Apply nullability to the column object before switching to the foreign-key definition.',docs:['migrations#foreign-key-constraints'],ask:'An optional owner_id foreign key should allow SQL NULL. Which migration chain applies nullable to the column before constrained returns a foreign-key definition?',choices:[['$table->foreignId("owner_id")->nullable()->constrained("owners");','The column receives nullable before the chain creates and configures the foreign-key constraint.'],['$table->foreignId("owner_id")->constrained("owners")->nullable();','The trailing nullable targets the foreign-key definition rather than setting the underlying column’s nullability.'],['$table->foreignId("owner_id")->constrained("owners")->nullOnDelete();','A deletion action does not by itself make the column nullable.'],['$table->foreignId("owner_id")->default(null)->constrained("owners");','A default value is not a replacement for allowing null values in the column definition.']],test:output('nullable:required',String.raw`app('db')->connection()->getSchemaBuilder();
$a = new Illuminate\Database\Schema\Blueprint(app('db')->connection(), 'entries');
$a->foreignId('owner_id')->nullable()->constrained('owners');
$b = new Illuminate\Database\Schema\Blueprint(app('db')->connection(), 'entries');
$b->foreignId('owner_id')->constrained('owners')->nullable();
echo ($a->getColumns()[0]->nullable ? 'nullable' : 'required').':'.($b->getColumns()[0]->nullable ? 'nullable' : 'required');`)}),
q({n:288,type:'A',sub:'nullable-foreign-key-preserve-history',needs:['Foreign-key deletion policies','Historical records','Nullable references'],why:'Preserve dependent history while permitting removal of the referenced optional owner.',docs:['migrations#foreign-key-constraints'],ask:'Audit entries must remain after an optional reviewer account is deleted. reviewer_id should become NULL, and the database must enforce this behavior for every deletion path. Which foreign-key design fits?',choices:[['A nullable reviewer_id with ON DELETE SET NULL.','The database preserves each audit entry while clearing its reference to the deleted reviewer.'],['A non-null reviewer_id with ON DELETE CASCADE.','Cascade deletes the audit entries instead of preserving them.'],['A nullable reviewer_id with ON DELETE RESTRICT.','Restrict prevents the account deletion while dependent references exist rather than clearing them.'],['A non-null reviewer_id with ON DELETE SET NULL.','The deletion action conflicts with the column’s prohibition on null values.']],test:output('1:null',String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('reviewers', function ($t) {
    $t->id();
});
Schema::create('audit_entries', function ($t) {
    $t->id();
    $t->foreignId('reviewer_id')->nullable()->constrained('reviewers')->nullOnDelete();
});
DB::table('reviewers')->insert(['id' => 1]);
DB::table('audit_entries')->insert(['reviewer_id' => 1]);
DB::table('reviewers')->where('id', 1)->delete();
echo DB::table('audit_entries')->count().':'.(DB::table('audit_entries')->value('reviewer_id') === null ? 'null' : 'linked');`)}),
q({n:289,revision:2,type:'A',sub:'compound-index-filter-order-prefix',needs:['PostgreSQL B-tree indexes','Equality predicates','Ordered scans'],why:'Align the leading key with tenant equality and the remaining keys with a deterministic ordered scan.',docs:['migrations#indexes','https://www.postgresql.org/docs/18/indexes-multicolumn.html'],assume:['PostgreSQL 18, B-tree index, query WHERE tenant_id = ? ORDER BY created_at ASC, id ASC LIMIT 50. No other predicates.'],ask:'Which proposed index order directly supports narrowing to one tenant and scanning that tenant in the requested order, without assuming the planner must choose it?',choices:[['(tenant_id, created_at, id)','Equality on the leading tenant key leaves rows ordered by created_at and id within that tenant’s index range.'],['(created_at, tenant_id, id)','This leads with time across all tenants, so it does not provide the same contiguous tenant-first range.'],['(tenant_id, id, created_at)','Within the tenant, this orders primarily by id rather than created_at.'],['Separate indexes on tenant_id and created_at','Independent indexes do not themselves provide the specified composite ordered path including the id tiebreaker.']],test:contract('Illuminate/Database/Schema/Blueprint.php',['public function index($columns','return $this->indexCommand'],'Laravel preserves the declared composite-index columns. PostgreSQL B-tree leading equality and ordering behavior is documented, not benchmarked in SQLite; planner selection depends on statistics.')}),
q({n:290,type:'E',sub:'sqlite-unique-null-distinct',needs:['Unique indexes','Database-specific NULL semantics'],why:'Interpret nullable uniqueness on the explicitly stated database rather than generalizing across engines.',docs:['migrations#creating-indexes','https://www.sqlite.org/lang_createindex.html'],assume:['SQLite, a single-column ordinary UNIQUE index on nullable external_ref.'],ask:'The table starts empty. Two rows insert external_ref=NULL, followed by two rows with external_ref="A". Which insert first violates uniqueness?',choices:[['The second "A" insert.','SQLite treats nulls as distinct for this unique index, but the repeated non-null value conflicts.'],['The second NULL insert.','That assumes nulls compare as duplicates under this SQLite unique-index rule.'],['The first "A" insert because NULL already occupies the index.','A non-null value does not collide with the existing null entries.'],['None; a nullable unique index allows repeated non-null values too.','Nullability does not disable uniqueness for ordinary repeated text values.']],test:output('3:duplicate-A',String.raw`use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
Schema::create('imports', function ($t) {
    $t->id();
    $t->string('external_ref')->nullable()->unique();
});
DB::table('imports')->insert(['external_ref' => null]);
DB::table('imports')->insert(['external_ref' => null]);
DB::table('imports')->insert(['external_ref' => 'A']);
try {
    DB::table('imports')->insert(['external_ref' => 'A']);
} catch (Illuminate\Database\UniqueConstraintViolationException $e) {
    echo DB::table('imports')->count().':duplicate-A';
}`)}),
];
