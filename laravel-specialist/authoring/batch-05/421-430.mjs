import {versionedCache} from './retargeted.mjs';
import {q,file,output,contract} from '../record.mjs';
export default [
q({n:421,type:'E',level:'F',sub:'cache-integer-ttl-seconds',needs:['Cache TTL','Framework version assumptions'],why:'Apply the supported version’s TTL unit rather than an older framework convention.',docs:['cache#storing-items-in-the-cache'],ask:'In Laravel 13, Cache::put("report", $value, 90) succeeds. With no eviction or explicit removal, what expiration does the integer specify?',choices:[['90 seconds after insertion.','Integer cache TTLs in this framework version are measured in seconds.'],['90 minutes after insertion.','This applies an obsolete unit assumption rather than the supported version’s seconds contract.'],['The Unix timestamp 90.','A plain integer is a relative number of seconds, not an absolute timestamp here.'],['90 successful reads of the cached value.','Expiration is time-based, not a read-count limit.']],test:output('present:missing',String.raw`use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
Carbon::setTestNow('2026-01-01 00:00:00');
Cache::put('report', 'present', 90);
Carbon::setTestNow('2026-01-01 00:01:29');
echo Cache::get('report', 'missing').':';
Carbon::setTestNow('2026-01-01 00:01:31');
echo Cache::get('report', 'missing');`)}),
q({n:422,type:'I',level:'F',sub:'cache-absolute-expiration-object',needs:['DateTime expiration','Relative TTL'],why:'Represent a known deadline without misinterpreting its numeric timestamp as a duration.',docs:['cache#storing-items-in-the-cache'],ask:'$deadline is a Carbon instance ten minutes in the future. The entry should expire at that instant. Which call expresses this directly?',choices:[['Cache::put($key, $value, $deadline)','The DateTimeInterface argument is converted into time remaining until that absolute deadline.'],['Cache::put($key, $value, $deadline->timestamp)','Passing the timestamp as an integer interprets it as a number of seconds from now.'],['Cache::put($key, $value, $deadline->minute)','The minute-of-hour field is not the time remaining until the deadline.'],['Cache::forever($key, [$value, $deadline])','Storing a deadline as part of the value does not configure automatic expiration.']],test:output('expired',String.raw`use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
Carbon::setTestNow('2026-01-01 10:00:00');
Cache::put('deadline', 'value', now()->addMinutes(10));
Carbon::setTestNow('2026-01-01 10:10:01');
echo Cache::get('deadline', 'expired');`)}),
q({n:423,type:'A',sub:'cache-forever-not-durable-record',needs:['Cache eviction','Durable business records'],why:'Separate an absence of TTL from a guarantee that business data survives cache loss.',docs:['cache#storing-items-forever'],ask:'A team proposes storing the only copy of issued invoice numbers with Cache::forever. Losing those records is unacceptable. What is the relevant limitation?',choices:[['No TTL does not guarantee retention; keep authoritative records in durable storage.','forever omits timed expiration, but cache eviction, flushes and store loss can still remove entries.'],['forever guarantees persistence across all cache flushes and driver replacement.','A cache method cannot guarantee survival of explicit clearing or loss of its backing store.'],['Reading a forever entry automatically renews it in the relational database.','The cache does not create an authoritative database record on read.'],['The problem disappears if each value includes its original creation timestamp.','Metadata inside a value cannot preserve that value when the cache loses it.']],test:output('missing',String.raw`use Illuminate\Support\Facades\Cache;
Cache::forever('invoice-number', 42);
Cache::flush();
echo Cache::get('invoice-number', 'missing');`)}),
q({n:424,type:'D',sub:'cache-block-lock-timeout',needs:['Atomic locks','Lock timeout exceptions'],why:'Handle inability to acquire the lock before assuming the protected callback ran.',docs:['cache#managing-locks'],ask:'Another owner keeps a cache lock beyond a contender’s block timeout. Which outcome should code around block($seconds, $callback) handle?',choices:[['A LockTimeoutException; the protected callback has not run.','When acquisition cannot complete before the blocking deadline, the helper throws instead of executing unlocked work.'],['A null result after executing the callback without the lock.','Timeout does not authorize an unlocked fallback execution of the supplied callback.'],['The old owner’s lock is forcibly released and the callback always runs.','Waiting to acquire a lock does not forcibly take ownership from a valid holder.'],['The callback runs in a queue worker once the timeout expires.','The cache lock API does not implicitly dispatch timed-out work to a queue.']],test:output('timeout:0',String.raw`use Illuminate\Support\Facades\Cache;
$holder = Cache::lock('report', 60);
$holder->get();
$ran = 0;
try {
    Cache::lock('report', 60)->block(0, function () use (&$ran) {
        $ran++;
    });
} catch (Illuminate\Contracts\Cache\LockTimeoutException $e) {
    echo 'timeout:'.$ran;
}`)}),
q({n:425,type:'I',sub:'cache-lock-owner-transfer',needs:['Lock ownership','Cross-process handoff'],why:'Transfer the capability to release a lock without acquiring an unrelated owner identity.',docs:['cache#managing-locks-across-processes'],assume:['The receiving worker uses the same shared lock store; the acquired lock has not expired.'],ask:'A web request acquires a lock and delegates completion to a job. Which value and operation let that job release this particular lock with ownership checking?',choices:[['Pass owner() and call restoreLock($name, $owner)->release().','The owner token restores the identity associated with the acquired lock, allowing an ownership-checked release.'],['Pass the lock name and call lock($name)->release() with a new token.','A newly constructed lock has a different owner and cannot normally release the existing owner’s lock.'],['Pass the cache prefix and call Cache::forget($name).','A generic value deletion does not express the lock provider’s ownership-checked release contract.'],['Pass the request URL and call forceRelease on any matching name.','forceRelease bypasses ownership, and a request URL is not the lock owner token.']],test:output('1:1',String.raw`use Illuminate\Support\Facades\Cache;
$lock = Cache::lock('handoff', 60);
$lock->get();
echo (int) Cache::restoreLock('handoff', $lock->owner())->release().':';
echo (int) Cache::lock('handoff', 60)->get();`)}),
q({n:426,type:'R',sub:'lock-force-release-other-owner',needs:['Lock ownership','Recovery operations'],why:'Identify the safety difference between normal release and an administrative force release.',docs:['cache#managing-locks-across-processes'],ask:'Process A holds an unexpired lock. Process B creates a lock object with the same name but a different owner token. How do B’s release() and forceRelease() differ?',choices:[['release respects A’s ownership; forceRelease can remove A’s lock.','The ordinary operation checks the owner, while forceRelease intentionally bypasses that check.'],['Both operations fail unless B supplies A’s owner token.','That describes ordinary release, but not the force-release escape hatch.'],['Both operations automatically transfer A’s ownership to B.','Neither release operation is a lock-ownership transfer API.'],['release removes A’s lock, while forceRelease only extends its expiration.','This reverses ownership protection and misstates forceRelease as a renewal operation.']],test:output('0:0:1',String.raw`use Illuminate\Support\Facades\Cache;
$a = Cache::lock('shared', 60);
$a->get();
$b = Cache::lock('shared', 60);
echo (int) $b->release().':';
echo (int) Cache::lock('shared', 60)->get().':';
$b->forceRelease();
echo (int) Cache::lock('shared', 60)->get();`)}),
q({n:427,type:'A',level:'A',sub:'cache-stampede-inner-recheck',needs:['Cache stampede','Shared locks','Double-checked retrieval'],why:'Reason about a waiter whose original miss becomes stale while another worker fills the cache.',docs:['cache#atomic-locks','cache#retrieve-and-store'],assume:['Workers share the cache and lock store. The lock lifetime safely covers one computation. Lock-acquisition timeout is handled separately.'],ask:'Many workers miss the same expensive result, then wait for one shared lock. What must each worker do after acquiring it to avoid recomputing a result an earlier holder already produced?',choices:[['Read the cache again inside the lock before computing and storing a missing result.','The first miss may precede another worker’s successful computation; an inner check lets later holders reuse that result.'],['Compute immediately inside the lock because the earlier miss remains authoritative.','The lock serializes work but does not make a previously observed miss remain true.'],['Delete the cache entry immediately after acquiring the lock.','Deleting a newly filled entry defeats reuse and forces sequential recomputation.'],['Use a unique lock name per worker so all misses finish sooner.','Different locks do not coordinate the workers contending for this same expensive result.']],test:output('cached:0',String.raw`use Illuminate\Support\Facades\Cache;
$firstRead = Cache::get('result');
Cache::put('result', 'cached', 60);
$computations = 0;
$value = Cache::lock('compute:result', 30)->get(function () use (&$computations) {
    return Cache::remember('result', 60, function () use (&$computations) {
        $computations++;
        return 'computed';
    });
});
echo $value.':'.$computations;`)}),
q({n:428,type:'R',sub:'cache-key-tenant-filter-dimensions',needs:['Tenant isolation','Cache key design','Filtered query results'],why:'Include every result-changing dimension in the cache identity.',docs:['cache#retrieve-and-store'],ask:'An invoice list is already correctly filtered by tenant and status in SQL. Its cache key is invoices:list. Requests from different tenants and statuses share the same cache. Which key design prevents those result collisions?',choices:[['Include both tenant identity and normalized status in the key.','Both dimensions change the result; using them in the cache identity separates the otherwise correct queries.'],['Include status only because SQL already applies the tenant filter.','A cache hit bypasses the SQL query, so tenant filtering there cannot repair a cross-tenant cached result.'],['Include tenant only because status affects the display rather than the query.','The stated SQL result is status-filtered, so statuses need distinct cached results too.'],['Keep the key and shorten the TTL to one second.','A shorter collision window is still a collision and can return another tenant’s data.']],test:output('A-open:B-open:A-paid',String.raw`use Illuminate\Support\Facades\Cache;
foreach ([['A', 'open'], ['B', 'open'], ['A', 'paid']] as [$tenant, $status]) {
    Cache::put("invoices:$tenant:$status", "$tenant-$status", 60);
}
echo Cache::get('invoices:A:open').':'.Cache::get('invoices:B:open').':'.Cache::get('invoices:A:paid');`)}),
versionedCache,
q({n:430,type:'D',sub:'cache-tags-driver-capability',needs:['Cache stores','Tag support'],why:'Identify a store capability mismatch rather than changing unrelated cache keys.',docs:['cache#cache-tags'],ask:'Code using Cache::tags works with a tag-capable store but fails after the application switches to the file cache driver. What should the design account for?',choices:[['Tags require a supporting store; choose one or implement a different invalidation strategy.','The repository checks the store’s tag capability, and the file store does not supply it.'],['Every store supports tags if the tag names contain only letters.','Naming conventions cannot add a missing driver capability.'],['Setting a longer TTL automatically enables file-store tags.','Expiration duration and tag support are independent features.'],['Calling Cache::remember first creates the missing tag index for the file driver.','remember stores values but does not install tag support in the underlying store.']],test:output('unsupported',String.raw`$store = new Illuminate\Cache\FileStore(app('files'), storage_path('file-cache'));
$repository = new Illuminate\Cache\Repository($store);
try {
    $repository->tags(['catalog']);
} catch (BadMethodCallException $e) {
    echo 'unsupported';
}`)}),
];
