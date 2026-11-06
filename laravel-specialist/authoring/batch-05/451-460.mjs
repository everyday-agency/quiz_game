import {q,file,output} from '../record.mjs';
import {http} from './fixture.mjs';
export default [
q({n:451,type:'E',level:'F',sub:'http-json-dot-path-default',needs:['JSON response decoding','Dot notation','Missing-key default'],why:'Read the requested nested field while applying a default only to an absent path.',docs:['http-client#making-requests'],ask:'The response body is {"data":{"name":"Ada"}}. What does $response->json("data.role", "guest") return?',choices:[['The string guest.','The nested role path is absent, so the supplied default is returned.'],['The complete data object containing name.','A requested dot path does not fall back to returning its parent object.'],['The string Ada.','The method reads role, not the sibling name key.'],['A JSON decoding exception because role is absent.','A missing path in otherwise valid JSON uses the default rather than making the JSON invalid.']],test:output('guest',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['*' => Http::response(['data' => ['name' => 'Ada']])]);
echo Http::get('https://api.example.test/user')->json('data.role', 'guest');`)}),
q({n:452,type:'I',sub:'http-multipart-file-part',needs:['Multipart requests','File uploads','HTTP client attach'],why:'Send a genuine file part rather than encoding bytes as an ordinary JSON field.',docs:['http-client#multi-part-requests'],ask:'An API expects a multipart file field named document with filename report.txt. $bytes contains its contents. Which request matches?',choices:[['Http::attach("document", $bytes, "report.txt")->post($url)','attach creates a multipart part with the field name, content and filename.'],['Http::post($url, ["document" => $bytes])','This sends a JSON field by default, without multipart file metadata.'],['Http::asForm()->post($url, ["document" => $bytes])','URL-encoded form data is not a multipart file part with a filename.'],['Http::withBody($bytes, "text/plain")->post($url)','A raw body lacks the named multipart file field required by the endpoint.']],test:output('multipart:file',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(function ($request) {
    echo ($request->isMultipart() ? 'multipart' : 'other').':';
    echo $request->hasFile('document', 'hello', 'report.txt') ? 'file' : 'missing';
    return Http::response('', 200);
});
Http::attach('document', 'hello', 'report.txt')->post('https://api.example.test/upload');`)}),
q({n:453,type:'R',sub:'http-success-not-payload-schema',needs:['External API contracts','HTTP success','Payload validation'],why:'Separate transport success from a usable application-level payload.',docs:['http-client#error-handling','validation#manually-creating-validators'],ask:'An upstream returns HTTP 200 with {"message":"maintenance"}. The application needs data.id as an integer. It currently calls throw() and immediately uses json("data.id"). Which safeguard is missing?',choices:[['Validate the decoded payload’s required shape and types before using data.id.','throw checks HTTP error status, not whether a successful response satisfies the expected business schema.'],['Replace throw() with successful() and keep the same unchecked JSON access.','Both are status-oriented checks and do not establish the required field or type.'],['Increase the HTTP timeout until data.id appears.','Waiting longer does not validate the body already returned successfully.'],['Cast the missing data.id to an integer and use zero as an ordinary identifier.','That hides a broken contract by inventing a potentially misleading value.']],test:output('200:invalid',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['*' => Http::response(['message' => 'maintenance'], 200)]);
$r = Http::get('https://api.example.test/item')->throw();
$v = validator($r->json(), ['data.id' => ['required', 'integer']]);
echo $r->status().':'.($v->fails() ? 'invalid' : 'valid');`)}),
q({n:454,type:'T',sub:'http-assert-destination-method-payload',needs:['HTTP request fakes','Outgoing request assertions'],why:'Detect a request sent to the wrong operation despite a successful stubbed response.',docs:['http-client#inspecting-requests'],ask:'A billing test uses Http::fake and always gets 200. It must catch a regression from POST /charges with amount=500 to GET /charges or a different amount. Which assertion covers that contract?',choices:[['Http::assertSent with a predicate checking method, URL and amount.','Inspecting all three request properties detects the stated destination, method and payload regressions.'],['Http::assertSentCount(1) alone.','One request can still have the wrong method, destination or body.'],['Assert only that the application returns HTTP 200.','A permissive fake can return success even for the wrong outgoing request.'],['Assert that the fake response contains a transaction ID.','The stubbed response does not prove what request the application sent.']],test:output('verified',http+String.raw`use Illuminate\Support\Facades\Http;
Http::fake(['*' => Http::response(['id' => 1])]);
Http::post('https://billing.example.test/charges', ['amount' => 500]);
Http::assertSent(fn ($r) => $r->method() === 'POST'
    && $r->url() === 'https://billing.example.test/charges'
    && $r['amount'] === 500);
echo 'verified';`)}),
q({n:455,type:'E',sub:'http-accept-versus-body-content-type',needs:['Accept header','Content-Type header','Form encoding'],why:'Keep desired response format independent of submitted body format.',docs:['http-client#headers','http-client#sending-form-url-encoded-requests'],ask:'What formats does this request ask for and send?',code:[file(String.raw`Illuminate\Support\Facades\Http::acceptJson()
    ->asForm()
    ->post('https://api.example.test/search', ['query' => 'books']);`)],choices:[['It asks for a JSON response and sends a form-encoded body.','Accept and request Content-Type serve different directions; these calls configure each independently.'],['It asks for a form response and sends a JSON body.','This reverses the roles of acceptJson and asForm.'],['It sends JSON because acceptJson overrides asForm.','A response preference does not replace the form body format.'],['It sends multipart data because all non-JSON POST bodies use multipart.','URL-encoded form bodies are distinct from multipart uploads.']],test:output('application/json:application/x-www-form-urlencoded',http+String.raw`Illuminate\Support\Facades\Http::fake(function ($r) {
    echo $r->header('Accept')[0].':'.$r->header('Content-Type')[0];
    return Illuminate\Support\Facades\Http::response('', 200);
});
require getcwd().'/probe.php';`)}),
q({n:456,type:'I',sub:'resource-top-level-additional-meta',needs:['JsonResource responses','Response metadata'],why:'Place metadata at the response level rather than duplicating it in each entity.',docs:['eloquent-resources#adding-meta-data'],ask:'A resource response needs a top-level meta.request_id beside data. Which expression adds it without making request_id an attribute on every item?',choices:[['$resource->additional(["meta" => ["request_id" => $id]])','additional merges response-level data into the resource response.'],['Add request_id to every item’s toArray result.','That places the value in each item rather than as top-level response metadata.'],['Set $resource->resource->request_id = $id on every model.','Mutating model attributes does not specify the required outer response shape.'],['Return only ["meta" => ["request_id" => $id]] from the item resource.','That replaces the entity representation rather than adding metadata beside it.']],test:output('{"data":{"id":7},"meta":{"request_id":"r1"}}',String.raw`$resource = new Illuminate\Http\Resources\Json\JsonResource(['id' => 7]);
echo $resource->additional(['meta' => ['request_id' => 'r1']])->response()->getContent();`)}),
q({n:457,type:'R',sub:'resource-whenloaded-query-boundary',needs:['Eloquent relation loading','JsonResource conditional relationships','N+1 queries'],why:'Keep serialization from deciding to query unloaded relationships.',docs:['eloquent-resources#conditional-relationships'],ask:'A resource should include comments only when the controller already loaded them. It must not trigger a query during serialization. Which expression provides that conditional relation value?',choices:[['$this->whenLoaded("comments")','whenLoaded checks relation state and produces an omitted value when the relationship was not loaded.'],['$this->comments','Direct dynamic relationship access can lazy-load an unloaded relation.'],['$this->comments()->get()','This explicitly executes a relationship query during serialization.'],['$this->loadMissing("comments")->comments','loadMissing fills an unloaded relationship by querying, contrary to the requirement.']],test:output('{"id":7}',String.raw`$model = new class extends Illuminate\Database\Eloquent\Model
{
    protected $guarded = [];
    public function comments()
    {
        throw new LogicException('Unexpected relation query');
    }
};
$model->id = 7;
$resource = new class($model) extends Illuminate\Http\Resources\Json\JsonResource
{
    public function toArray($request): array
    {
        return ['id' => $this->id, 'comments' => $this->whenLoaded('comments')];
    }
};
echo json_encode($resource->resolve());`)}),
q({n:458,type:'E',sub:'resource-whencounted-conditional-count',needs:['Eloquent withCount','Conditional resource attributes'],why:'Include a preloaded aggregate without querying for it during serialization.',docs:['eloquent-resources#conditional-relationship-counts'],ask:'A resource maps comments_count to $this->whenCounted("comments"). One model has comments_count=3; another has no comments_count attribute. What is emitted?',choices:[['The first includes 3; the second omits comments_count.','whenCounted checks whether the count attribute was retrieved; it does not run the count query itself.'],['Both include comments_count, with the second set to zero.','An absent count is not automatically evidence that the relationship is empty.'],['The second performs a COUNT query to obtain the missing value.','Conditional serialization avoids fetching the missing aggregate itself.'],['Both omit the field unless the full comments collection is also loaded.','A preloaded count does not require loading the complete relationship collection.']],test:output('{"comments_count":3}:[]',String.raw`class CountView extends Illuminate\Http\Resources\Json\JsonResource
{
    public function toArray($request): array
    {
        return ['comments_count' => $this->whenCounted('comments')];
    }
}
$a = new class extends Illuminate\Database\Eloquent\Model
{
};
$a->setRawAttributes(['comments_count' => 3]);
$b = new class extends Illuminate\Database\Eloquent\Model
{
};
echo json_encode((new CountView($a))->resolve()).':'.json_encode((new CountView($b))->resolve());`)}),
q({n:459,type:'D',sub:'resource-preserve-collection-keys',needs:['Resource collections','Associative collection keys'],why:'Preserve intentional identifiers in an API object instead of silently reindexing them.',docs:['eloquent-resources#preserving-collection-keys'],ask:'An item resource collection is keyed by stable external codes, and clients require those keys. Default serialization reindexes the collection. Which item-resource setting preserves them?',choices:[['Declare public $preserveKeys = true.','The resource collection uses this opt-in to retain the original collection keys.'],['Declare public static $wrap = "codes".','Changing the outer wrapper name does not preserve inner collection keys.'],['Add each code to the model’s $hidden list.','Hiding model attributes does not configure collection-key preservation.'],['Call values() on the collection before creating resources.','values explicitly discards existing keys and assigns sequential ones.']],test:output('{"sku-A":{"name":"A"},"sku-B":{"name":"B"}}',String.raw`class KeyedItemView extends Illuminate\Http\Resources\Json\JsonResource
{
    public $preserveKeys = true;
}
$items = collect(['sku-A' => ['name' => 'A'], 'sku-B' => ['name' => 'B']]);
echo json_encode(KeyedItemView::collection($items)->resolve());`)}),
q({n:460,type:'E',sub:'paginated-resource-always-data-envelope',needs:['Resource wrapping','Paginator metadata'],why:'Recognize the pagination envelope exception to ordinary unwrapped resources.',docs:['eloquent-resources#data-wrapping-and-pagination'],ask:'JsonResource::withoutWrapping() is enabled. A resource collection wraps a LengthAwarePaginator. What shape should a client still expect?',choices:[['A data envelope with pagination links and meta.','Paginated resource responses retain data wrapping to accompany the pagination information.'],['Only the bare item array with no links or meta.','Disabling ordinary wrapping does not remove the pagination response structure.'],['Only pagination links, because items require wrapping to serialize.','The items still serialize inside the paginated response.'],['An exception because pagination requires the global wrap setting to remain enabled.','The resource machinery handles pagination wrapping even when ordinary wrapping is disabled.']],test:output('data,links,meta',String.raw`Illuminate\Http\Resources\Json\JsonResource::withoutWrapping();
$p = new Illuminate\Pagination\LengthAwarePaginator([['id' => 7]], 3, 1, 1);
$r = Illuminate\Http\Resources\Json\JsonResource::collection($p)->response()->getData(true);
echo implode(',', array_keys($r));`)}),
];
