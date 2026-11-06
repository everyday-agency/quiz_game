import {q,file,output} from '../record.mjs';
export default [
q({n:461,type:'R',sub:'resource-mergewhen-associative-shape',needs:['Conditional resource attributes','Associative versus numeric arrays'],why:'Add a group of fields without making the response array’s key structure ambiguous.',docs:['eloquent-resources#merging-conditional-attributes'],ask:'An object resource conditionally includes internal_note and cost beside id. Which use of mergeWhen follows its intended array-shape contract?',choices:[['Merge an associative field array into an associative resource result.','mergeWhen supports conditional field groups; keeping the field structure associative avoids the documented mixed-key hazards.'],['Mix arbitrary numeric and string keys in the same merge result.','The helper is not intended for arrays mixing numeric and string keys.'],['Use sparse numeric keys as stable business identifiers inside mergeWhen.','Non-sequential numeric keys are outside the documented safe mergeWhen use.'],['Wrap the fields in a JSON string before passing them to mergeWhen.','A JSON string is not the associative field array the resource should merge.']],test:output('{"id":7,"internal_note":"review","cost":20}',String.raw`$r = new class(['id' => 7]) extends Illuminate\Http\Resources\Json\JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource['id'],
            $this->mergeWhen(true, [
                'internal_note' => 'review',
                'cost' => 20,
            ]),
        ];
    }
};
echo json_encode($r->resolve());`)}),
q({n:462,type:'I',sub:'resource-withresponse-header-hook',needs:['JsonResource response customization','HTTP headers'],why:'Attach a header to the produced HTTP response rather than to the JSON entity.',docs:['eloquent-resources#resource-responses'],ask:'A resource must add X-Export-Version: 2 to its final HTTP response. Which hook is intended for this customization?',choices:[['withResponse($request, $response), setting the response header there.','The hook receives the final JSON response, so it can customize headers without altering resource fields.'],['toArray(), returning an X-Export-Version field.','That creates JSON data, not the required HTTP header.'],['with(), returning an X-Export-Version metadata key.','with adds top-level response data rather than HTTP headers.'],['A model accessor named getXExportVersionAttribute.','An accessor changes model data access, not the outgoing response headers.']],test:output('2',String.raw`$r = new class(['id' => 7]) extends Illuminate\Http\Resources\Json\JsonResource
{
    public function withResponse($request, $response)
    {
        $response->headers->set('X-Export-Version', '2');
    }
};
echo $r->response()->headers->get('X-Export-Version');`)}),
q({n:463,type:'R',sub:'resource-explicit-hidden-secret-leak',needs:['Eloquent hidden attributes','Custom API resources','Secret exposure'],why:'Recognize that an explicit resource field can bypass model serialization hiding.',docs:['eloquent-resources#writing-resources','eloquent-serialization#hiding-attributes-from-json'],ask:'The model hides api_token. Does that protect this resource response from exposing it?',code:[file(String.raw`class AccountView extends Illuminate\Http\Resources\Json\JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'token' => $this->api_token,
        ];
    }
}`)],choices:[['No; the resource explicitly reads and returns the attribute, so the field must be removed or separately authorized.','Model hidden settings affect model array serialization; they do not prevent an explicit attribute read in a custom resource.'],['Yes; hidden makes the attribute unreadable through all PHP property access.','The attribute still exists and can be accessed by application code.'],['Yes; renaming api_token to token automatically preserves its hidden status.','The custom output key does not inherit a model hidden-list rule for another name.'],['No; hidden only works when the token is also listed in fillable.','Mass-assignment settings and serialization hiding are separate, and fillable does not solve this explicit exposure.']],test:output('{"id":7,"token":"secret"}',String.raw`require getcwd().'/probe.php';
$m = new class extends Illuminate\Database\Eloquent\Model
{
    protected $hidden = ['api_token'];
};
$m->setRawAttributes(['id' => 7, 'api_token' => 'secret']);
echo json_encode((new AccountView($m))->resolve());`)}),
q({n:464,type:'D',sub:'resource-collection-retain-paginator',needs:['Paginator objects','API resource collections'],why:'Keep pagination context available while transforming the current page’s items.',docs:['eloquent-resources#pagination'],ask:'A controller calls Model::paginate(20), then passes only $page->items() to ItemResource::collection. Pagination links disappear. Which change preserves them?',choices:[['Pass the paginator itself to ItemResource::collection($page).','The resource collection recognizes a paginator and can produce its links and metadata alongside transformed items.'],['Pass count($page->items()) as the second argument to collection.','An item count does not reconstruct the paginator’s URL and page metadata.'],['Call values() on collect($page->items()) before wrapping it.','Reindexing plain items still discards the paginator context.'],['Add a public links property to every item model.','Per-model properties do not restore the response’s paginator integration.']],test:output('links:no-links',String.raw`$p = new Illuminate\Pagination\LengthAwarePaginator([['id' => 1]], 40, 20, 1);
$a = Illuminate\Http\Resources\Json\JsonResource::collection($p)->response()->getData(true);
$b = Illuminate\Http\Resources\Json\JsonResource::collection($p->items())->response()->getData(true);
echo (isset($a['links']) ? 'links' : 'no-links').':'.(isset($b['links']) ? 'links' : 'no-links');`)}),
q({n:465,type:'E',level:'F',sub:'resource-missingvalue-versus-null',needs:['Conditional attributes','MissingValue filtering'],why:'Distinguish omission from an explicitly emitted null value.',docs:['eloquent-resources#conditional-attributes'],ask:'With $allowed=false, what does this resource emit for secret?',code:[file(String.raw`class PublicView extends Illuminate\Http\Resources\Json\JsonResource
{
    public function toArray($request): array
    {
        $allowed = false;

        return [
            'id' => 7,
            'secret' => $this->when($allowed, 'value'),
        ];
    }
}`)],choices:[['The secret key is omitted.','Without an explicit default, a false condition produces a MissingValue that the resource filters out.'],['The secret key is present with null.','An omitted conditional value is distinct from explicitly returning null.'],['The secret key is present with false.','The condition controls inclusion; it is not itself the serialized value.'],['The secret key is present with an empty string.','The resource does not replace the missing conditional value with a blank string.']],test:output('{"id":7}',String.raw`require getcwd().'/probe.php';
echo json_encode((new PublicView([]))->resolve());`)}),
q({n:466,type:'D',sub:'resource-when-lazy-value-closure',needs:['PHP argument evaluation','Resource conditional values','Expensive operations'],why:'Avoid executing work before the condition helper can decide whether it is needed.',docs:['eloquent-resources#conditional-attributes'],ask:'$this->when(false, $service->calculate()) still calls calculate. Which replacement defers that work so it does not run when the condition is false?',choices:[['$this->when(false, fn () => $service->calculate())','A closure defers evaluation until the helper selects that value; a normal method argument is evaluated before the call.'],['$this->when(false, [$service->calculate()])','Building the array still evaluates calculate before calling when.'],['$this->when(false, (string) $service->calculate())','Casting occurs after the method has already executed.'],['$this->when(false, optional($service)->calculate())','optional guards a null receiver; it does not defer this call when the service exists.']],test:output('1:0',String.raw`$service = new class
{
    public int $calls = 0;
    public function calculate(): int
    {
        return ++$this->calls;
    }
};
$r = new class($service) extends Illuminate\Http\Resources\Json\JsonResource
{
    public function eager()
    {
        return $this->when(false, $this->resource->calculate());
    }
    public function lazy()
    {
        return $this->when(false, fn () => $this->resource->calculate());
    }
};
$r->eager();
echo $service->calls.':';
$service->calls = 0;
$r->lazy();
echo $service->calls;`)}),
q({n:467,type:'I',level:'F',sub:'resource-custom-wrap-name',needs:['Resource envelope configuration','Entity attributes'],why:'Rename the outer representation without changing persisted data.',docs:['eloquent-resources#data-wrapping'],ask:'An unpaginated API resource should use item instead of data as its outer wrapper. Its underlying model must stay unchanged. Which configuration targets that wrapper?',choices:[['Set public static $wrap = "item" on the resource class.','The resource wrapper property controls the outer envelope and does not rename model attributes.'],['Rename the model’s primary key column to item.','A database identifier name does not configure the resource envelope.'],['Return ["item" => $this->id] as the entire toArray result.','That changes entity fields and still sits inside the normal outer wrapper.'],['Add item to the model’s $appends list.','Appended attributes belong to model data, not the outer resource envelope.']],test:output('{"item":{"id":7}}',String.raw`$r = new class(['id' => 7]) extends Illuminate\Http\Resources\Json\JsonResource
{
    public static $wrap = 'item';
};
echo $r->response()->getContent();`)}),
q({n:468,type:'R',sub:'resource-conditional-pivot-metadata',needs:['Eloquent pivot models','Conditional resource fields'],why:'Access intermediate-table metadata only in the relationship context that supplies it.',docs:['eloquent-resources#conditional-pivot-information'],ask:'A Role resource sometimes comes from user->roles with the role_user pivot, and sometimes directly from Role::find. expires_at belongs to that pivot. Which expression safely includes it only for the expected loaded pivot?',choices:[['$this->whenPivotLoaded("role_user", fn () => $this->pivot->expires_at)','The pivot check guards the deferred access and verifies the expected intermediate table context.'],['$this->pivot->expires_at','An unconditional pivot access is unsafe when the resource was loaded directly without that relationship.'],['$this->whenLoaded("role_user", fn () => $this->expires_at)','The pivot table name is not a normal loaded relationship name, and expires_at is on the pivot.'],['$this->when(true, $this->pivot->expires_at)','A true condition does not guard missing pivot data, and the argument is evaluated eagerly.']],test:output('{"expires_at":"2027-01-01"}:[]',String.raw`class RoleView extends Illuminate\Http\Resources\Json\JsonResource
{
    public function toArray($request): array
    {
        return ['expires_at' => $this->whenPivotLoaded('role_user', fn () => $this->pivot->expires_at)];
    }
}
$m = new class extends Illuminate\Database\Eloquent\Model
{
};
$pivot = new Illuminate\Database\Eloquent\Relations\Pivot;
$pivot->setTable('role_user');
$pivot->setRawAttributes(['expires_at' => '2027-01-01']);
$m->setRelation('pivot', $pivot);
echo json_encode((new RoleView($m))->resolve()).':';
$m->unsetRelation('pivot');
echo json_encode((new RoleView($m))->resolve());`)}),
q({n:469,type:'I',sub:'resource-pagination-information-customization',needs:['ResourceCollection','Pagination metadata hooks'],why:'Extend generated pagination metadata while preserving the framework’s defaults.',docs:['eloquent-resources#customizing-the-pagination-information'],ask:'A collection must add meta.source="warehouse" while retaining generated page totals and links. Which paginationInformation implementation fits?',choices:[['Add source under $default["meta"], then return $default.','The hook receives the generated structure, allowing a targeted addition without discarding links or existing metadata.'],['Return only ["source" => "warehouse"].','That replaces the hook’s output and loses the default pagination structure.'],['Return the paginator’s current items as the hook result.','Items are not the pagination-information structure expected from this hook.'],['Add source to the first model and return an empty array.','A model field does not preserve or customize the collection’s pagination metadata.']],test:output('warehouse:3:links',String.raw`$p = new Illuminate\Pagination\LengthAwarePaginator([['id' => 1]], 3, 1, 1);
$r = new class($p) extends Illuminate\Http\Resources\Json\ResourceCollection
{
    public $collects = Illuminate\Http\Resources\Json\JsonResource::class;
    public function paginationInformation($request, $paginated, $default)
    {
        $default['meta']['source'] = 'warehouse';
        return $default;
    }
};
$data = $r->response()->getData(true);
echo $data['meta']['source'].':'.$data['meta']['total'].':'.(isset($data['links']) ? 'links' : 'missing');`)}),
q({n:470,type:'E',sub:'resource-recently-created-status',needs:['Eloquent model state','Default resource response status'],why:'Trace the resource response status from model creation state rather than the route’s name.',docs:['eloquent-resources#resource-responses'],assume:['No custom response status or withResponse override is applied.'],ask:'A JsonResource wraps an Eloquent model whose wasRecentlyCreated is true. Another wraps a normally retrieved model with that flag false. What default HTTP statuses do their responses use?',choices:[['201 for the newly created model; 200 for the retrieved model.','ResourceResponse checks Eloquent’s wasRecentlyCreated flag when choosing the default status.'],['200 for both, because resources never infer a creation status.','The default resource response does recognize the recently-created model state.'],['201 for both, because constructing any resource creates a new response object.','Creating a resource wrapper is not the same as recently creating its underlying model.'],['204 for the created model; 304 for the retrieved model.','Those statuses do not follow from the described model state and are not these defaults.']],test:output('201:200',String.raw`$a = new class extends Illuminate\Database\Eloquent\Model
{
};
$a->setRawAttributes(['id' => 1]);
$a->wasRecentlyCreated = true;
$b = clone $a;
$b->wasRecentlyCreated = false;
echo (new Illuminate\Http\Resources\Json\JsonResource($a))->response()->getStatusCode().':';
echo (new Illuminate\Http\Resources\Json\JsonResource($b))->response()->getStatusCode();`)}),
];
