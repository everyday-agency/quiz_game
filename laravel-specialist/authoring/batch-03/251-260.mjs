import {q,file,output} from '../record.mjs';
import {pivot,relations} from './fixture.mjs';
export default [
q({n:251,type:'I',sub:'update-existing-pivot-attribute',needs:['Eloquent pivot attributes','Related model versus association'],why:'Write metadata belonging to one association without changing the shared related row.',docs:['eloquent-relationships#updating-a-record-on-the-intermediate-table'],ask:'active belongs to person_role, not roles. Role 2 is already attached to this person. Which operation sets active=true for that association only?',choices:[['$person->roles()->updateExistingPivot(2, ["active" => true]);','The helper targets the intermediate row identified by the parent and related key.'],['Role::findOrFail(2)->update(["active" => true]);','This writes the roles model rather than the person_role association.'],['$person->roles()->attach(2, ["active" => true]);','Attaching again attempts another link instead of updating the existing unique pair.'],['$person->roles()->sync([2 => ["active" => true]]);','This can update the pivot but also detaches other roles, violating the association-only change.']],test:output('1:2',pivot+String.raw`$person->roles()->updateExistingPivot(2, ['active' => true]);
echo (int) DB::table('person_role')->where('role_id', 2)->value('active').':'.$person->roles()->count();`)}),
q({n:252,type:'D',level:'F',sub:'select-extra-pivot-columns',needs:['Eloquent pivot hydration'],why:'Expose relationship metadata using the pivot projection rather than model casts or visibility.',docs:['eloquent-relationships#retrieving-intermediate-table-columns'],ask:'person_role contains active=true, but $role->pivot->active is null when roles are loaded through the default belongsToMany relation. Which relationship change retrieves this extra pivot column?',choices:[['Add ->withPivot("active") to the belongsToMany definition.','The default pivot projection contains keys; withPivot includes the requested additional column.'],['Add active to Role::$fillable.','Mass-assignment permissions on the related model do not select pivot columns.'],['Add active to Role::$visible.','Serialization visibility cannot supply an attribute that was not retrieved from the pivot.'],['Add ->with("active") to the relationship query.','with expects another relationship to eager-load, not a pivot column.']],test:output('1',pivot+String.raw`$person->roles()->updateExistingPivot(2, ['active' => true]);
echo (int) $person->roles()->withPivot('active')->where('roles.id', 2)->first()->pivot->active;`)}),
q({n:253,type:'I',sub:'order-by-pivot-rank',needs:['Eloquent pivot queries','Qualified SQL columns'],why:'Sort by association-specific metadata instead of an attribute on the shared related model.',docs:['eloquent-relationships#ordering-queries-via-intermediate-table-columns'],ask:'Both roles.rank and person_role.rank exist, but the page must use this person’s association rank. Which relation query explicitly orders by the pivot rank ascending?',choices:[['$person->roles()->orderByPivot("rank")->get()','orderByPivot qualifies rank against the intermediate table.'],['$person->roles()->orderBy("roles.rank")->get()','This uses the global role rank rather than the person-specific rank.'],['$person->roles()->orderBy("rank")->get()','With both columns present, the unqualified name is ambiguous instead of explicitly selecting the pivot.'],['$person->roles()->withPivot("rank")->get()','Selecting rank makes it readable on pivot but does not add an ordering clause.']],test:output('[2,1]',pivot+String.raw`Schema::table('roles', function ($t) {
    $t->integer('rank')->default(0);
});
$person->roles()->updateExistingPivot(1, ['rank' => 9]);
$person->roles()->updateExistingPivot(2, ['rank' => 1]);
echo json_encode($person->roles()->orderByPivot('rank')->pluck('roles.id')->all());`)}),
q({n:254,revision:2,type:'R',sub:'pivot-filter-and-attach-default',needs:['Eloquent pivot constraints','Association creation defaults'],why:'Keep a relation’s read constraint consistent with new links created through it.',docs:['eloquent-relationships#filtering-queries-via-intermediate-table-columns'],ask:'activeRoles() filters person_role.active=true using wherePivot. A new attach through that relation leaves active at the database default false, so the link disappears from the next read. Which replacement applies the value to both reads and new links?',choices:[['Use withPivotValue("active", true).','withPivotValue adds the pivot constraint and supplies that value for new pivot records.'],['Replace wherePivot with withPivot("active").','withPivot selects the column but neither filters it nor establishes the attach default.'],['Keep wherePivot and add active to Role::$fillable.','The pivot attach values do not come from the related model’s mass-assignment allowlist.'],['Replace wherePivot with orderByPivot("active").','Ordering does not filter inactive links or set their stored value.']],test:output('1:1',pivot+String.raw`$relation = $person->roles()->withPivotValue('active', true);
$relation->attach(3);
echo (int) DB::table('person_role')->where('role_id', 3)->value('active').':'.$person->roles()->withPivotValue('active', true)->count();`)}),
q({n:255,type:'E',level:'F',sub:'detach-link-not-related-row',needs:['Eloquent detach','Association ownership'],why:'Identify which table is changed when a shared relation is removed.',docs:['eloquent-relationships#attaching-detaching'],ask:'A person has roles [1,2], and there are three Role rows in total. What is printed?',code:[file(String.raw`$person->roles()->detach(2);

echo $person->roles()->count().':'.Role::count();`)],choices:[['1:3','detach removes the person_role link but leaves the shared Role row intact.'],['1:2','This would delete the related role record as well, which detach does not do.'],['2:3','The specified association is removed, so the person no longer has two links.'],['0:1','detach(2) targets one related key, not all associations and unrelated role records.']],test:output('1:3',pivot+String.raw`require getcwd().'/probe.php';`)}),
q({n:256,type:'E',sub:'toggle-pivot-result',needs:['Eloquent toggle','Set membership'],why:'Trace removal of present links and addition of absent links in one operation.',docs:['eloquent-relationships#toggling-associations'],ask:'The person initially has roles [1,2]. What changes are reported?',code:[file(String.raw`$changes = $person->roles()->toggle([2, 3]);

echo json_encode($changes);`)],choices:[['{"attached":[3],"detached":[2]}','Role 2 was present and is removed; role 3 was absent and is attached.'],['{"attached":[2,3],"detached":[1]}','This describes replacement of the desired set, not toggling just the supplied IDs.'],['{"attached":[3],"detached":[]}','This is additive synchronization behavior, which would leave role 2 attached.'],['{"attached":[2],"detached":[3]}','This reverses present and absent membership before the operation.']],test:output('{"attached":[3],"detached":[2]}',pivot+String.raw`require getcwd().'/probe.php';`)}),
q({n:257,type:'D',sub:'pivot-timestamp-pair',needs:['Eloquent pivot timestamps','Migration alignment'],why:'Align the pivot schema with the timestamp columns Eloquent writes.',docs:['eloquent-relationships#retrieving-intermediate-table-columns'],ask:'A relation enables withTimestamps(). Its pivot table has created_at but no updated_at, and attach now fails on a missing column. Which schema repair supports ordinary automatic pivot timestamps?',choices:[['Provide both created_at and updated_at columns.','The normal timestamp behavior writes both columns for a new pivot row and updates the modification timestamp later.'],['Rename created_at to updated_at and keep only that column.','New timestamped pivot rows still require the creation timestamp as well.'],['Add timestamps only to the related roles table.','Those columns are on a different table from the pivot insert that fails.'],['Add updated_at to Role::$hidden without changing the pivot table.','Serialization visibility cannot satisfy a missing SQL column.']],test:output('both',pivot+String.raw`$person->roles()->withTimestamps()->attach(3);
$row = DB::table('person_role')->where('role_id', 3)->first();
echo $row->created_at !== null && $row->updated_at !== null ? 'both' : 'missing';`)}),
q({n:258,type:'E',sub:'associate-before-save',needs:['Eloquent belongsTo associate','Persistence boundary'],why:'Distinguish an in-memory relationship change from the later database write.',docs:['eloquent-relationships#updating-belongs-to-relationships'],ask:'Article 1 belongs to writer 1. Writer 2 exists. What is printed before the final save?',code:[file(String.raw`$article = Article::findOrFail(1);
$article->writer()->associate(Writer::findOrFail(2));

echo $article->writer_id.':'.Article::findOrFail(1)->writer_id;

$article->save();`)],choices:[['2:1','associate sets the foreign key and relation in memory; persistence occurs when the article is saved.'],['2:2','associate alone has not written the database row yet.'],['1:1','The in-memory foreign key is changed immediately by association.'],['1:2','This reverses the in-memory change and the persistence boundary.']],test:output('2:1',relations+String.raw`require getcwd().'/probe.php';`)}),
q({n:259,type:'I',sub:'has-many-through-key-path',needs:['Eloquent hasManyThrough','Foreign-key paths'],why:'Follow the intermediate and final foreign keys rather than inventing a direct relation.',docs:['eloquent-relationships#has-many-through'],ask:'countries.id → users.country_id → posts.user_id forms the ownership path. Country needs all posts through users. Using the conventional model names Country, User and Post, which relationship represents it?',choices:[['return $this->hasManyThrough(Post::class, User::class);','The first argument is the final model and the second the intermediate model; conventional keys follow the stated path.'],['return $this->hasManyThrough(User::class, Post::class);','This reverses the final and intermediate models and therefore the join path.'],['return $this->hasMany(Post::class, "country_id");','posts has user_id rather than the direct country_id this query expects.'],['return $this->belongsToMany(Post::class, "users");','users is an intermediate entity with its own key, not the country/post pivot pair this relation expects.']],test:output('One',String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
foreach (['countries', 'users', 'posts'] as $name) {
    Schema::create($name, function ($t) use ($name) {
        $t->id();
        if ($name === 'users') {
            $t->integer('country_id');
        }
        if ($name === 'posts') {
            $t->integer('user_id');
            $t->string('title');
        }
    });
}
class Country extends Model
{
    public function posts()
    {
        return $this->hasManyThrough(Post::class, User::class);
    }
}
class User extends Model
{
}
class Post extends Model
{
}
Illuminate\Support\Facades\DB::table('countries')->insert(['id' => 1]);
Illuminate\Support\Facades\DB::table('users')->insert(['id' => 2, 'country_id' => 1]);
Illuminate\Support\Facades\DB::table('posts')->insert(['id' => 3, 'user_id' => 2, 'title' => 'One']);
echo Country::find(1)->posts->first()->title;`)}),
q({n:260,type:'R',sub:'relationship-or-predicate-grouping',needs:['Eloquent relationship constraints','SQL boolean precedence'],why:'Keep both alternative conditions inside the parent ownership boundary.',docs:['eloquent-relationships#chaining-orwhere-clauses-after-relationships'],ask:'This query unexpectedly returns another writer’s published articles. Which repair expresses “this writer’s articles whose title is Draft or which are published”?',code:[file(String.raw`$articles = $writer->articles()
    ->where('title', 'Draft')
    ->orWhere('published', true)
    ->get();`)],choices:[['Wrap the title/published alternatives in one where callback on $writer->articles().','Grouping gives writer_id = current AND (title = Draft OR published = true), keeping both branches within ownership.'],['Move orWhere("published", true) before where("title", "Draft").','Changing call order does not establish the required grouped alternatives inside the relationship condition.'],['Add distinct() to the current query.','Deduplication does not exclude unauthorized rows admitted by the ungrouped OR branch.'],['Replace get() with first() while keeping the predicates.','Limiting results hides some symptoms but leaves the incorrect ownership logic.']],test:output('3:2',relations+String.raw`$bad = $writer->articles()->where('title', 'Draft')->orWhere('published', true)->count();
$good = $writer->articles()->where(function ($q) {
    $q->where('title', 'Draft')->orWhere('published', true);
})->count();
echo $bad.':'.$good;`)}),
];
