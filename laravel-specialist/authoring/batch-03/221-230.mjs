import {q,file,output} from '../record.mjs';
import {model,relations} from './fixture.mjs';
export default [
q({n:221,type:'E',level:'F',sub:'null-cast-preservation',needs:['Eloquent primitive casts','Nullable columns'],why:'Keep absent values distinct from numeric zero and false.',docs:['eloquent-mutators#attribute-casting'],ask:'What is printed for this hydrated nullable data?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;

class Reading extends Model
{
    protected function casts(): array
    {
        return ['count' => 'integer', 'enabled' => 'boolean'];
    }
}

$reading = (new Reading())->newFromBuilder([
    'id' => 1,
    'count' => null,
    'enabled' => null,
]);

echo json_encode([$reading->count, $reading->enabled]);`)],choices:[['[null,null]','Ordinary null attributes remain null instead of being cast into their non-null primitive defaults.'],['[0,false]','This assumes casts coerce null as a direct PHP integer or boolean conversion would.'],['[0,null]','The integer cast also preserves the null attribute.'],['An exception because nullable attributes cannot declare casts','Casts can coexist with nullable stored values.']],test:output('[null,null]')}),
q({n:222,type:'E',sub:'cached-value-object-setter-mapping',needs:['Eloquent Attribute objects','Value-object caching','Attribute setter mapping'],why:'Trace how a cached mutable object is translated back into persisted scalar attributes.',docs:['eloquent-mutators#accessor-caching','eloquent-mutators#mutating-multiple-attributes'],ask:'Before save, the raw row contains first_name="Ada" and last_name="Lovelace". With this accessor, which raw first_name is persisted after the shown mutation?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class FullName
{
    public function __construct(public string $first, public string $last)
    {
    }
}

class Contact extends Model
{
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn ($value, array $attributes) => new FullName(
                $attributes['first_name'],
                $attributes['last_name'],
            ),
            set: fn (FullName $value) => [
                'first_name' => $value->first,
                'last_name' => $value->last,
            ],
        );
    }
}

$contact = Contact::findOrFail(1);
$contact->full_name->first = 'Grace';
$contact->save();`)],choices:[['Grace','The accessor caches its object by default, and the setter maps the mutated object back to first_name when attributes are merged for saving.'],['Ada','The accessor object is retained; the mapped mutation is not discarded just because full_name was not reassigned.'],['A serialized FullName object','The setter explicitly produces scalar first_name and last_name attributes.'],['No value because full_name must be a physical column','The accessor can coordinate several physical columns without a full_name column.']],test:output('Grace',String.raw`Illuminate\Support\Facades\Schema::create('contacts', function ($t) {
    $t->id();
    $t->string('first_name');
    $t->string('last_name');
    $t->timestamps();
});
Illuminate\Support\Facades\DB::table('contacts')->insert(['id' => 1, 'first_name' => 'Ada', 'last_name' => 'Lovelace']);
require getcwd().'/probe.php';
echo Illuminate\Support\Facades\DB::table('contacts')->value('first_name');`)}),
q({n:223,type:'E',level:'F',sub:'set-mutator-normalized-storage',needs:['Eloquent set mutators'],why:'Apply normalization at assignment rather than just display time.',docs:['eloquent-mutators#defining-a-mutator'],ask:'What does the final line print?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Subscriber extends Model
{
    protected function email(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => strtolower(trim($value)),
        );
    }
}

$subscriber = new Subscriber();
$subscriber->email = ' ADA@EXAMPLE.TEST ';

echo $subscriber->getAttributes()['email'];`)],choices:[['ada@example.test','The set mutator normalizes the value before placing it in the raw attribute array.'],[' ADA@EXAMPLE.TEST ','The set transformation is already applied before save.'],['ADA@EXAMPLE.TEST','Both trimming and lowercasing are present in the mutator.'],['An undefined email attribute','The setter stores the returned scalar under the email attribute.']],test:output('ada@example.test')}),
q({n:224,revision:2,type:'D',sub:'appended-accessor-not-sql-column',needs:['Eloquent appends','SQL projection','Computed attributes'],why:'Separate serialization-time computation from the table schema.',docs:['eloquent-serialization#appending-values-to-json'],ask:'Customer appends full_name through an accessor that joins first_name and last_name. The table has those two columns but no full_name column. Why does Customer::select("full_name")->get() fail even though full_name appears in toArray()?',choices:[['appends does not create a database column to select.','An accessor is computed in PHP and appends does not add a SQL column to the database table.'],['Appending requires full_name to be placed in $fillable before selecting it.','Fillable controls mass assignment, not SQL schema or projection.'],['select disables every accessor permanently on the model class.','Selecting columns does not remove accessor methods; the invalid database column is the immediate problem.'],['The accessor must be renamed to getFullNameAttribute to become a SQL column.','Neither accessor naming convention creates a physical or generated SQL column.']],test:output('Ada Lovelace',String.raw`class Customer extends Illuminate\Database\Eloquent\Model
{
    protected $appends = ['full_name'];

    protected function fullName(): Illuminate\Database\Eloquent\Casts\Attribute
    {
        return Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn ($v, $a) => $a['first_name'].' '.$a['last_name'],
        );
    }
}
$c = (new Customer())->newFromBuilder(['first_name' => 'Ada', 'last_name' => 'Lovelace']);
echo $c->toArray()['full_name'];`)}),
q({n:225,type:'E',sub:'visible-hidden-intersection',needs:['Eloquent serialization visibility'],why:'Apply both visibility filters when an attribute appears in each.',docs:['eloquent-serialization#hiding-attributes-from-json'],ask:'What does toArray contain?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;

class ExportUser extends Model
{
    protected $visible = ['id', 'email'];
    protected $hidden = ['email'];
}

$user = (new ExportUser())->newFromBuilder([
    'id' => 7,
    'email' => 'ada@example.test',
    'password' => 'hash',
]);

echo json_encode($user->toArray());`)],choices:[['{"id":7}','visible selects the candidate attributes, and hidden still excludes email from that set.'],['{"id":7,"email":"ada@example.test"}','The visible list does not override the hidden exclusion.'],['{"id":7,"password":"hash"}','password is outside the visible list and cannot be added by hiding email.'],['{}','id is visible and not hidden, so it remains in the serialized output.']],test:output('{"id":7}')}),
q({n:226,type:'T',sub:'serialization-loaded-relations-only',needs:['Eloquent toArray','Relationship loading'],why:'Assert query-free serialization without treating every relationship method as loaded data.',docs:['eloquent-serialization#serializing-models-and-collections'],ask:'Writer defines articles() but has no automatic $with or appended accessors. A test loads Writer::first() without articles and immediately calls toArray(). Which expectation matches ordinary Eloquent serialization?',choices:[['articles is absent, and serialization alone does not run an articles query.','toArray includes the relationships already loaded into the model, not every relationship method declared on its class.'],['articles is present as an empty array, regardless of stored children.','An unloaded relation is omitted rather than automatically represented as an empty loaded collection.'],['articles is fetched and included because a relationship method exists.','Declaring the relationship does not make ordinary serialization eager-load it.'],['Serialization throws until every relationship has been explicitly loaded.','Partial model serialization is supported; unloaded relationships need not be present.']],test:output('[false,0]',relations+String.raw`$item = Writer::first();
DB::enableQueryLog();
$data = $item->toArray();
echo json_encode([array_key_exists('articles', $data), count(DB::getQueryLog())]);`)}),
q({n:227,type:'E',level:'F',sub:'decimal-cast-string-scale',needs:['Eloquent decimal casts','PHP JSON types'],why:'Recognize the scale-preserving string returned by a decimal cast.',docs:['eloquent-mutators#attribute-casting'],ask:'The raw amount is "12.3". What is printed?',code:[file(String.raw`use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected function casts(): array
    {
        return ['amount' => 'decimal:2'];
    }
}

$price = (new Price())->newFromBuilder(['amount' => '12.3']);

echo json_encode([$price->amount, gettype($price->amount)]);`)],choices:[['["12.30","string"]','The decimal cast formats the specified scale and returns a string representation.'],['[12.3,"double"]','This describes a floating-point cast, not decimal:2 output.'],['["12.3","string"]','The decimal scale adds the required second fractional digit.'],['[12,"integer"]','The decimal cast does not truncate the value into an integer.']],test:output('["12.30","string"]')}),
q({n:228,type:'I',sub:'child-save-parent-touch',needs:['Eloquent touches','Relationship timestamps'],why:'Connect child lifecycle writes to the intended parent freshness signal.',docs:['eloquent-relationships#touching-parent-timestamps'],ask:'An Article belongsTo Writer through writer(). Writer has updated_at. Every ordinary successful article instance save should also mark that writer updated. Which Article declaration requests that behavior?',choices:[["protected $touches = ['writer'];",'touches names relationships whose related timestamps Eloquent should update during the child lifecycle.'],["protected $with = ['writer'];",'with controls eager loading and does not request timestamp propagation.'],["protected $appends = ['writer'];",'appends controls accessor serialization, not related writes.'],["protected $fillable = ['writer.updated_at'];",'Mass-assignment permission does not attach a parent touch to each save.']],test:output('changed',relations+String.raw`class TouchingArticle extends Article
{
    protected $touches = ['writer'];
}
DB::table('writers')->where('id', 1)->update(['updated_at' => '2000-01-01 00:00:00']);
$a = TouchingArticle::find(1);
$a->title = 'Revised';
$a->save();
echo DB::table('writers')->where('id', 1)->value('updated_at') === '2000-01-01 00:00:00' ? 'unchanged' : 'changed';`)}),
q({n:229,revision:2,type:'A',sub:'optimistic-version-affected-rows',needs:['Eloquent update counts','Concurrent stale reads','Optimistic locking'],why:'Combine an atomic predicate, version advancement and a failure branch to reject a stale writer.',docs:['queries#update-statements'],ask:'Two editors read document 7 at version 4. The first saves version 5. The second must detect the conflict rather than overwrite it; no long-lived lock is held across editing. Which write protocol meets that requirement?',choices:[['UPDATE where id=7 and version=4, set content and version=5; treat zero affected rows as a conflict.','The version predicate and update execute atomically, so the stale editor cannot match a row already advanced to version 5.'],['Read the current version, then update by id alone if the read returned 4.','Another writer can commit between the separate read and the unconstrained update.'],['Update by id alone, then compare the new content to the submitted content.','Matching your own overwritten content does not detect the lost earlier update.'],['Reload version 5 and submit the stale content using version 5 without notifying the editor.','This deliberately discards the conflict information and overwrites changes the stale editor has not incorporated.']],test:output('1:0:first',model+String.raw`DB::table('records')->where('id', 1)->update(['version' => 4]);
$first = Record::whereKey(1)->where('version', 4)->update(['name' => 'first', 'version' => 5]);
$second = Record::whereKey(1)->where('version', 4)->update(['name' => 'second', 'version' => 5]);
echo $first.':'.$second.':'.Record::find(1)->name;`)}),
q({n:230,type:'R',sub:'selective-global-scope-removal',needs:['Eloquent global scopes','Tenant isolation'],why:'Remove the requested business filter while retaining an independent isolation constraint.',docs:['eloquent#removing-global-scopes'],ask:'A model has two named global scopes: tenant and published. An authenticated tenant administrator needs drafts from their own tenant. Which query starts with the required scope change?',choices:[['Article::withoutGlobalScope("published")','Removing only published preserves the independently registered tenant constraint.'],['Article::withoutGlobalScopes()','This removes tenant isolation as well as the publication filter.'],['Article::withoutGlobalScope("tenant")','This removes the constraint that must remain and leaves the publication filter in place.'],['Article::query()->where("published", false)','The existing published=true scope still applies, yielding conflicting predicates instead of removing it.']],test:output('[1,2]',relations+String.raw`Article::addGlobalScope('tenant', fn ($q) => $q->where('writer_id', 1));
Article::addGlobalScope('published', fn ($q) => $q->where('published', true));
echo json_encode(Article::withoutGlobalScope('published')->orderBy('id')->pluck('id')->all());`)}),
];
