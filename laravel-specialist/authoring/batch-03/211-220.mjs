import {q,file,output} from '../record.mjs';
import {model,relations} from './fixture.mjs';
export default [
q({n:211,type:'E',sub:'raw-original-accessor-separation',needs:['Eloquent accessors','Original state'],why:'Read storage state separately from the accessor-facing value.',docs:['eloquent-mutators#defining-an-accessor'],ask:'What is printed after hydrating the model from the supplied raw row?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Label extends Model
{
    protected function name(): Attribute
    {
        return Attribute::make(get: fn ($value) => strtoupper($value));
    }
}

$label = (new Label())->newFromBuilder(['id' => 1, 'name' => 'draft']);

echo $label->name.':'.$label->getRawOriginal('name');`)],choices:[['DRAFT:draft','Property access runs the accessor; getRawOriginal retrieves the untransformed original attribute.'],['DRAFT:DRAFT','Accessing an accessor does not rewrite the original raw value to the displayed uppercase text.'],['draft:draft','The name accessor is invoked by ordinary attribute access.'],['draft:DRAFT','This reverses which access path transforms the stored value.']],test:output('DRAFT:draft')}),
q({n:212,type:'E',level:'F',sub:'fresh-separate-instance',needs:['Eloquent fresh','Object identity'],why:'Track an original instance and a newly fetched instance separately.',docs:['eloquent#refreshing-models'],ask:'Record 1 starts with name="old". No observers run. What is printed?',code:[file(String.raw`$record = Record::findOrFail(1);
Record::whereKey(1)->update(['name' => 'new']);

$fresh = $record->fresh();

echo $record->name.':'.$fresh->name;`)],choices:[['old:new','fresh returns a newly hydrated instance; it does not replace the original object attributes.'],['new:new','That would describe mutating the original via refresh, not fresh.'],['old:old','The fresh query reads the committed database change.'],['new:old','The original is not updated while the newly fetched model remains stale.']],test:output('old:new',model+String.raw`require getcwd().'/probe.php';`)}),
q({n:213,revision:2,type:'E',sub:'refresh-loaded-relations',needs:['Eloquent refresh','Loaded relationship cache'],why:'Follow both object identity and cached relationship reload during refresh.',docs:['eloquent#refreshing-models'],ask:'$writer has a loaded articles collection containing two rows. Another query inserts a third child. What is true after $result = $writer->refresh(), assuming the parent still exists?',choices:[['The same object, with three loaded articles.','refresh reloads attributes and already loaded ordinary relationships on the existing model.'],['$result is a new object, while $writer retains the two-row collection.','That describes a separate retrieval rather than the in-place refresh operation.'],['$result is the same object, but the loaded articles collection remains at two rows.','refresh also reloads the previously loaded relationship.'],['$result is a boolean indicating whether any database columns changed.','refresh returns the model, not a dirty-state success flag.']],test:output('same:3',relations+String.raw`$writer->load('articles');
Article::create(['writer_id' => $writer->id, 'title' => 'Third']);
$result = $writer->refresh();
echo ($result === $writer ? 'same' : 'new').':'.$writer->articles->count();`)}),
q({n:214,type:'R',sub:'replicate-business-unique-value',needs:['Eloquent replication','Unique constraints'],why:'Separate excluded primary keys from other copied attributes before persistence.',docs:['eloquent#replicating-models'],ask:'An invoice has an auto-increment id and a UNIQUE reference column. A developer calls $copy = $invoice->replicate(); $copy->save(); expecting a new reference automatically. There is no generating observer. What must the copy operation address?',choices:[['Assign a new reference before saving; replicate copies that business attribute.','replicate creates an unsaved copy without the normal key/timestamps, but does not invent a replacement for an arbitrary unique reference.'],['Remove the original invoice first because replicate always reuses its id.','The ordinary primary key is excluded; deleting the source is not necessary to obtain a new identity.'],['Set $copy->exists = true so save generates another unique reference.','Marking it as existing changes save semantics and does not generate a business value.'],['Call replicate twice so the second copy receives a fresh reference.','Repeating replication does not introduce a reference-generation rule.']],test:output('new:no-id:A',model+String.raw`$copy = $record->replicate();
echo ($copy->exists ? 'stored' : 'new').':'.($copy->id === null ? 'no-id' : 'id').':'.$copy->code;`)}),
q({n:215,type:'E',sub:'immutable-date-return-value',needs:['Eloquent date casts','Immutable objects'],why:'Distinguish a returned date value from mutation of the model attribute.',docs:['eloquent-mutators#date-casting'],ask:'What is printed?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;

class Deadline extends Model
{
    protected function casts(): array
    {
        return ['due_at' => 'immutable_datetime'];
    }
}

$deadline = new Deadline();
$deadline->due_at = '2026-01-10 12:00:00';
$later = $deadline->due_at->addDay();

echo $deadline->due_at->format('d').':'.$later->format('d');`)],choices:[['10:11','The immutable cast returns a date whose addDay creates a separate later value; no reassignment updates due_at.'],['11:11','The method does not mutate the immutable attribute object.'],['10:10','The returned value reflects the requested addition even though the original remains unchanged.'],['An exception because immutable dates prohibit arithmetic','Immutability permits operations that return a new instance.']],test:output('10:11')}),
q({n:216,type:'D',sub:'array-cast-offset-reassignment',needs:['Eloquent array casts','PHP overloaded properties'],why:'Write a changed array back through the model setter.',docs:['eloquent-mutators#array-and-json-casting'],ask:'settings uses the array cast. Directly assigning $model->settings["theme"] = "dark" reports an indirect-modification warning and does not persist the change. Which repair preserves the array cast?',choices:[['Read settings into a local array, change theme, then assign the array back to settings and save.','The reassignment calls the attribute setter with the complete modified array so it can be serialized and tracked.'],['Call save twice after modifying the overloaded offset directly.','Repeating save does not recover an array mutation that never reached the attribute setter.'],['Call syncOriginal before modifying the offset directly.','Original-state tracking does not turn an overloaded array read into a writable reference.'],['Change only $fillable to include settings.theme, then modify the offset directly.','Mass-assignment configuration does not change PHP overloaded property semantics.']],test:output('dark',model+String.raw`$record->mergeCasts(['data' => 'array']);
$record->data = ['theme' => 'light'];
$settings = $record->data;
$settings['theme'] = 'dark';
$record->data = $settings;
$record->save();
echo $record->fresh()->mergeCasts(['data' => 'array'])->data['theme'];`)}),
q({n:217,revision:2,type:'I',sub:'array-object-in-place-tracking',needs:['Eloquent custom casts','ArrayObject'],why:'Choose an object-backed representation for a required in-place update API.',docs:['eloquent-mutators#array-object-and-collection-casting'],ask:'A settings model must support $model->settings["theme"] = "dark"; $model->save(); without a local-array reassignment. The JSON column must remain structured data. Which cast is intended for this interface?',choices:[['AsArrayObject cast','AsArrayObject supplies a cached mutable object and integrates its state with persistence.'],["Primitive array cast",'The primitive array cast does not make overloaded offset modification work in place.'],["Decoded object cast",'A generic decoded object is not the ArrayObject offset interface requested here.'],["JSON Unicode array cast",'This controls array JSON serialization behavior, not mutable offset access through an object-backed cast.']],test:output('dark',model+String.raw`$record->mergeCasts(['data' => Illuminate\Database\Eloquent\Casts\AsArrayObject::class]);
$record->data = ['theme' => 'light'];
$record->data['theme'] = 'dark';
$record->save();
echo json_decode(DB::table('records')->value('data'), true)['theme'];`)}),
q({n:218,revision:2,type:'E',sub:'enum-invalid-stored-value',needs:['Eloquent enum casts','PHP backed enums'],why:'Locate the invalid-data failure at cast access rather than silently coercing a case.',docs:['eloquent-mutators#enum-casting'],ask:'The database row contains status="retired", which is not an enum case. What happens at the final line?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;

enum Status: string
{
    case Active = 'active';
    case Paused = 'paused';
}

class Service extends Model
{
    protected function casts(): array
    {
        return ['status' => Status::class];
    }
}

$service = (new Service())->newFromBuilder(['id' => 1, 'status' => 'retired']);

echo $service->status->value;`)],choices:[['A ValueError is thrown at enum conversion.','The backed-enum cast uses the declared cases; it cannot turn retired into a valid Status.'],['retired is printed as an automatically added enum case.','Backed enums have a closed set of cases; hydration does not add new cases.'],['active is printed because the first case is a default.','The cast has no first-case fallback for an unknown stored value.'],['An empty string is printed because invalid values always cast to null.','A non-null invalid enum value does not receive null fallback semantics.']],test:output('ValueError',String.raw`try {
    require getcwd().'/probe.php';
} catch (ValueError $e) {
    echo 'ValueError';
}`)}),
q({n:219,revision:2,type:'T',sub:'hashed-cast-existing-hash',needs:['Eloquent hashed cast','Password hash verification'],why:'Verify both plaintext hashing and preservation of an already compatible hash.',docs:['eloquent-mutators#attribute-casting','hashing'],ask:'A password attribute uses the hashed cast. The configured algorithm is bcrypt and $existing was created with that same current configuration. Which regression assertion fits assigning $model->password = $existing?',choices:[['It remains $existing and still verifies the plaintext.','The cast recognizes a compatible hash instead of blindly hashing it again.'],['The stored attribute differs, and only the old hash string verifies as the new password.','That describes unwanted double hashing, not the compatible-hash handling.'],['The cast always throws because assignments must be plaintext strings.','The cast accepts compatible already-hashed values.'],['The stored attribute becomes the original plaintext recovered from $existing.','Hashing is not reversible; the cast cannot recover plaintext from a hash.']],test:output('[true,true]',String.raw`config(['hashing.driver' => 'bcrypt', 'hashing.bcrypt.rounds' => 4]);
class Secret extends Illuminate\Database\Eloquent\Model
{
    protected function casts(): array
    {
        return ['password' => 'hashed'];
    }
}
$existing = Illuminate\Support\Facades\Hash::make('fixture-secret');
$model = new Secret();
$model->password = $existing;
echo json_encode([$model->password === $existing, Illuminate\Support\Facades\Hash::check('fixture-secret', $model->password)]);`)}),
q({n:220,revision:2,type:'A',sub:'encrypted-attribute-query-boundary',needs:['Eloquent encrypted casts','Randomized encryption','Search design'],why:'Separate model decryption from database equality semantics and account for a deliberate search design.',docs:['eloquent-mutators#encrypted-casting'],ask:'A support tool stores notes through an encrypted cast. It tries where("notes", $plaintext)->first() to locate an exact note, but stored ciphertext is randomized. Which design statement is accurate?',choices:[['Plaintext equality needs a separate search design.','Casting decrypts retrieved model attributes. It does not rewrite a plaintext WHERE value into a useful match for randomized ciphertext.'],['Eloquent decrypts every notes column inside SQL before applying the where clause.','The application-level cast does not install a database decryption expression.'],['Encrypt the input once and equality will always match independently encrypted identical notes.','Randomized encryption can produce different ciphertext for the same plaintext.'],['Add notes to $fillable so the query builder applies its encrypted cast to predicates.','Mass-assignment permission does not transform database comparison semantics.']],test:output('0:secret',model+String.raw`$record->mergeCasts(['data' => 'encrypted']);
$record->data = 'secret';
$record->save();
echo Record::where('data', 'secret')->count().':'.$record->fresh()->mergeCasts(['data' => 'encrypted'])->data;`)}),
];
