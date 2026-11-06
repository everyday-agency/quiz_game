import {q,file,output} from '../record.mjs';
import {model} from './fixture.mjs';
export default [
q({n:201,type:'D',level:'F',sub:'explicit-legacy-table',needs:['Eloquent table conventions'],why:'Apply the table override rather than changing connection or key settings.',docs:['eloquent#table-names'],ask:'The AuditEntry model must read the existing audit_log table, but its first query targets audit_entries. The connection and primary key are already correct. Which model property fixes the table selection?',choices:[["protected $table = 'audit_log';",'The table property overrides the plural snake-case name inferred from the model class.'],["protected $connection = 'audit_log';",'This selects a connection configuration, not a table inside the existing connection.'],["protected $primaryKey = 'audit_log';",'This changes the key column used for identity, not the table queried.'],["protected $keyType = 'audit_log';",'The key type controls key casting; it is not a table mapping.']],test:output('audit_log',String.raw`class AuditEntry extends Illuminate\Database\Eloquent\Model
{
    protected $table = 'audit_log';
}
echo (new AuditEntry())->getTable();`)}),
q({n:202,type:'I',level:'F',sub:'legacy-no-timestamps',needs:['Eloquent timestamps','Legacy schemas'],why:'Match automatic model writes to a schema that deliberately has no timestamps.',docs:['eloquent#timestamps'],ask:'A read/write legacy table has id and title but neither created_at nor updated_at. Its schema must remain unchanged. Which model configuration prevents Eloquent from adding timestamp columns to inserts and updates?',choices:[['public $timestamps = false;','Disabling timestamps removes the automatic created_at and updated_at writes for this model.'],["protected $hidden = ['created_at', 'updated_at'];",'Hidden attributes affect serialization, not SQL writes.'],["protected $guarded = ['created_at', 'updated_at'];",'Mass-assignment restrictions do not disable internally generated timestamp attributes.'],["protected $casts = ['created_at' => 'datetime'];",'A datetime cast changes attribute representation; it does not stop timestamp creation.']],test:output('saved',String.raw`Illuminate\Support\Facades\Schema::create('legacy_items', function ($t) {
    $t->id();
    $t->string('title');
});
class LegacyItem extends Illuminate\Database\Eloquent\Model
{
    public $timestamps = false;
    protected $guarded = [];
}
LegacyItem::create(['title' => 'one']);
echo LegacyItem::count() === 1 ? 'saved' : 'failed';`)}),
q({n:203,type:'R',sub:'string-nonincrementing-key',needs:['Eloquent primary keys','Attribute casting'],why:'Combine key generation and key representation settings for externally assigned identifiers.',docs:['eloquent#primary-keys'],ask:'Device uses id values such as "sensor-017", assigned before insertion. The table has a string primary key and no auto-increment sequence. Which pair correctly describes this model?',choices:[["public $incrementing = false; protected $keyType = 'string';",'The model must neither expect an auto-generated integer nor cast the externally assigned key to int.'],["public $incrementing = true; protected $keyType = 'string';",'A string cast alone does not remove the assumption that insertion obtains a generated incrementing key.'],["public $incrementing = false; protected $keyType = 'int';",'The supplied text key can be coerced when accessed, losing the identity the application needs.'],["public $timestamps = false; protected $keyType = 'string';",'Disabling timestamps says nothing about whether the primary key is incrementing.']],test:output('sensor-017:manual',String.raw`class Device extends Illuminate\Database\Eloquent\Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];
}
$d = new Device(['id' => 'sensor-017']);
echo $d->getKey().':'.($d->getIncrementing() ? 'generated' : 'manual');`)}),
q({n:204,type:'T',sub:'mass-assignment-discard-detection',needs:['Eloquent fillable','Development safeguards'],why:'Expose a typo at the assignment boundary without broadening writable fields.',docs:['eloquent#mass-assignment-exceptions'],ask:'A test passes display_name to fill(), but the model permits only name. By default the field is silently discarded. Which development safeguard makes this mismatch fail visibly while keeping the allowlist?',choices:[['Model::preventSilentlyDiscardingAttributes();','The safeguard turns discarded mass-assignment attributes into exceptions, revealing the mismatched field.'],['Model::preventLazyLoading();','This detects relationship queries triggered by property access, not discarded assignment data.'],['Model::unguard();','This permits the field rather than detecting that it violates the intended allowlist.'],['Model::preventAccessingMissingAttributes();','This guards reads of missing hydrated attributes, not rejected input during fill.']],test:output('detected',String.raw`class Person extends Illuminate\Database\Eloquent\Model
{
    protected $fillable = ['name'];
}
Illuminate\Database\Eloquent\Model::preventSilentlyDiscardingAttributes();
try {
    (new Person())->fill(['display_name' => 'Ada']);
} catch (Illuminate\Database\Eloquent\MassAssignmentException $e) {
    echo 'detected';
}`)}),
q({n:205,type:'E',level:'F',sub:'explicit-assignment-guard-boundary',needs:['Eloquent guarded attributes','Direct property writes'],why:'Distinguish bulk input protection from trusted explicit assignment.',docs:['eloquent#mass-assignment'],ask:'What is printed? No save or observer runs.',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = ['name'];
}

$member = new Member(['name' => 'Ada', 'role' => 'admin']);
$member->role = 'editor';

echo $member->role;`)],choices:[['editor','The constructor discards role under the allowlist, but the subsequent explicit property assignment is not mass assignment.'],['admin','The constructor cannot retain the disallowed role, and a later assignment would replace it anyway.'],['An empty string','Guarding does not reject the direct role assignment.'],['A MassAssignmentException on the direct assignment','The direct attribute setter does not enforce the fillable mass-assignment list.']],test:output('editor')}),
q({n:206,type:'E',sub:'scoped-unguarded-restoration',needs:['Eloquent mass assignment','Callback scope'],why:'Track the temporary global guard state across the scoped callback.',docs:['eloquent#allowing-mass-assignment'],ask:'Global unguarding is initially off. What is printed?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = ['name'];
}

$first = Model::unguarded(fn () => new Account(['role' => 'admin']));
$second = new Account(['name' => 'Ada', 'role' => 'editor']);

echo $first->role.':'.($second->role ?? 'none');`)],choices:[['admin:none','The callback allows role assignment temporarily, then restores the prior guarded state before the second construction.'],['admin:editor','Scoped unguarded does not leave global protection disabled after the callback returns.'],['none:none','The scoped callback does permit otherwise guarded attributes.'],['An exception when the callback returns','Restoring the guard state does not invalidate attributes already assigned to the first model.']],test:output('admin:none')}),
q({n:207,type:'D',sub:'partial-selection-update-identity',needs:['Eloquent hydration','Primary-key update predicates'],why:'Retain identity when a lightweight projection must later be saved.',docs:['eloquent#retrieving-models','eloquent#updates'],ask:'A worker loads Record::select("name")->first(), changes name and calls save(). The row has an id primary key, with no custom key logic. The intended row is unchanged. Which minimal query repair preserves the small projection and makes the update target identifiable?',choices:[['Select both id and name.','Eloquent needs the hydrated primary key to build the update predicate for that row.'],['Select name and call syncOriginal() before save().','Synchronizing original values cannot reconstruct an omitted database identifier.'],['Select name and set $timestamps = false.','Removing timestamp writes does not supply the missing key for the WHERE clause.'],['Select name and add name to $fillable.','The change uses direct assignment; mass-assignment permission does not repair the missing identity.']],test:output('old:new',model+String.raw`$partial = Record::select('name')->first();
$partial->name = 'lost';
$partial->save();
echo Record::find(1)->name.':';
$identified = Record::select('id', 'name')->first();
$identified->name = 'new';
$identified->save();
echo Record::find(1)->name;`)}),
q({n:208,revision:2,type:'D',level:'F',sub:'fill-model-update-boolean',needs:['Eloquent fill and update','Return values'],why:'Keep a model reference while applying and persisting changes.',docs:['eloquent#updates','eloquent#mass-assignment'],ask:'A service assigns $record = $record->update(["name" => "new"]) and later calls $record->getKey(). Why does the latter call fail after a successful update?',choices:[['update returns a boolean, which overwrites the model variable.','A successful instance update returns true, so assigning that result overwrites the model variable.'],['update returns the new primary-key integer rather than the model.','The instance update result reports success; it does not return the key.'],['update turns the model into an Eloquent collection containing the updated row.','No collection is produced by this instance mutation.'],['The model loses its primary key whenever a fillable attribute changes.','Changing name does not remove id; the failure is the overwritten variable type.']],test:output('model:boolean',model+String.raw`echo ($record->fill(['name' => 'new']) === $record ? 'model' : 'other').':'.gettype($record->update(['name' => 'next']));`)}),
q({n:209,revision:2,type:'R',sub:'mass-update-skips-model-events',needs:['Eloquent events','Set-based SQL'],why:'Recognize the lifecycle difference when replacing individual saves with one query.',docs:['eloquent#mass-updates'],ask:'An updated observer writes a per-record audit entry. A refactor replaces a loop of model saves with Record::where("name", "old")->update(["name" => "new"]). The database changes, but audit entries disappear. What explains the regression?',choices:[['A mass update skips each model’s updated event.','The query writes rows directly; an observer requiring each model lifecycle is not invoked for each matched row.'],['The observer runs once but receives a collection rather than a model.','Eloquent does not substitute a collection event for each updated model in this operation.'],['Observers run only when an update also changes the primary key.','Ordinary instance updates dispatch events without changing their primary key.'],['The update is deferred until the matched models are read again.','The SQL update executes immediately; lazy hydration is not delaying the write.']],test:output('0:1',model+String.raw`$events = 0;
Record::updated(function () use (&$events) {
    $events++;
});
Record::where('name', 'old')->update(['name' => 'new']);
echo $events.':';
$record->refresh()->update(['name' => 'next']);
echo $events;`)}),
q({n:210,type:'E',sub:'dirty-versus-last-save-changes',needs:['Eloquent change tracking'],why:'Separate pending differences from attributes changed by the last save.',docs:['eloquent#examining-attribute-changes'],ask:'Record 1 initially has name="old". What does this print after the successful save?',code:[file(String.raw`$record = Record::findOrFail(1);
$record->name = 'new';
$before = $record->isDirty('name');
$record->save();

echo json_encode([
    $before,
    $record->isDirty('name'),
    $record->wasChanged('name'),
]);`)],assume:['Record is a normal Eloquent model with writable name and no observers changing attributes.'],choices:[['[true,false,true]','name is dirty before saving; save synchronizes the original state while recording name among the last changes.'],['[true,true,true]','A successful save clears the pending dirty difference against the synchronized original.'],['[false,false,true]','Direct assignment still participates in dirty tracking before persistence.'],['[true,false,false]','wasChanged reports the last save, not just the currently pending differences.']],test:output('[true,false,true]',model+String.raw`require getcwd().'/probe.php';`)}),
];
