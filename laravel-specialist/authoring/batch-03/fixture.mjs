export const model=String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

Schema::create('records', function ($table) {
    $table->id();
    $table->string('name')->default('old');
    $table->string('code')->nullable();
    $table->integer('version')->default(1);
    $table->text('data')->nullable();
    $table->timestamps();
});

class Record extends Model
{
    protected $table = 'records';
    protected $guarded = [];
}

$record = Record::create(['name' => 'old', 'code' => 'A']);
`;
export const relations=String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

Schema::create('writers', function ($t) {
    $t->id();
    $t->string('name');
    $t->string('code')->nullable();
    $t->timestamps();
});
Schema::create('articles', function ($t) {
    $t->id();
    $t->unsignedBigInteger('writer_id')->nullable();
    $t->string('writer_code')->nullable();
    $t->string('title');
    $t->boolean('published')->default(false);
    $t->integer('amount')->default(0);
    $t->timestamps();
});
class Writer extends Model
{
    protected $table = 'writers';
    protected $guarded = [];

    public function articles()
    {
        return $this->hasMany(Article::class, 'writer_id');
    }
}
class Article extends Model
{
    protected $table = 'articles';
    protected $guarded = [];

    public function writer()
    {
        return $this->belongsTo(Writer::class, 'writer_id');
    }
}
$writer = Writer::create(['name' => 'Ada', 'code' => 'W-A']);
$other = Writer::create(['name' => 'Lin', 'code' => 'W-B']);
$writer->articles()->createMany([
    ['title' => 'Draft', 'published' => false, 'amount' => 4],
    ['title' => 'Public', 'published' => true, 'amount' => 6],
]);
$other->articles()->create(['title' => 'Other', 'published' => true, 'amount' => 9]);
`;
export const morph=String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

foreach (['posts', 'videos'] as $name) {
    Schema::create($name, function ($t) {
        $t->id();
        $t->string('title');
    });
}
Schema::create('comments', function ($t) {
    $t->id();
    $t->string('commentable_type');
    $t->unsignedBigInteger('commentable_id');
    $t->string('body');
});
class Post extends Model
{
    public $timestamps = false;
    protected $guarded = [];
}
class Video extends Model
{
    public $timestamps = false;
    protected $guarded = [];
}
class Comment extends Model
{
    public $timestamps = false;
    protected $guarded = [];

    public function commentable()
    {
        return $this->morphTo();
    }
}
Relation::enforceMorphMap(['post' => Post::class, 'video' => Video::class]);
Post::create(['id' => 1, 'title' => 'Text']);
Video::create(['id' => 1, 'title' => 'Film']);
Comment::insert([
    ['id' => 1, 'commentable_type' => 'post', 'commentable_id' => 1, 'body' => 'P'],
    ['id' => 2, 'commentable_type' => 'video', 'commentable_id' => 1, 'body' => 'V'],
]);
`;
export const pivot=String.raw`use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

Schema::create('people', function ($t) {
    $t->id();
    $t->string('name');
});
Schema::create('roles', function ($t) {
    $t->id();
    $t->string('name');
});
Schema::create('person_role', function ($t) {
    $t->unsignedBigInteger('person_id');
    $t->unsignedBigInteger('role_id');
    $t->boolean('active')->default(false);
    $t->integer('rank')->default(0);
    $t->timestamps();
    $t->unique(['person_id', 'role_id']);
});
class Person extends Model
{
    public $timestamps = false;
    protected $guarded = [];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'person_role', 'person_id', 'role_id');
    }
}
class Role extends Model
{
    public $timestamps = false;
    protected $guarded = [];
}
$person = Person::create(['name' => 'Ada']);
foreach (['Reader', 'Writer', 'Admin'] as $name) {
    Role::create(['name' => $name]);
}
$person->roles()->attach([1, 2]);
`;
