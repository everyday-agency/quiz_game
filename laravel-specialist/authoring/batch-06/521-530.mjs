import {q,file,output} from '../record.mjs';
import {passwords} from './fixture.mjs';
export default [
q({n:521,type:'E',level:'F',sub:'encryption-randomized-ciphertexts',needs:['Authenticated encryption','Initialization vectors'],why:'Avoid treating ciphertext equality as a plaintext equality check.',docs:['encryption#using-the-encrypter'],ask:'With the same valid application key, two encryptString("same") calls normally produce different ciphertexts. What does that imply?',choices:[['This is expected randomized encryption; both can decrypt to the same plaintext.','A fresh initialization vector makes repeated encryptions differ without changing the recovered value.'],['The application key must have changed between the calls.','Different ciphertexts do not require different keys when encryption uses a random IV.'],['One ciphertext is necessarily corrupted because the inputs were equal.','Ciphertext difference alone is not evidence of corruption.'],['decryptString can recover only the most recently encrypted copy.','Decryption does not depend on being the latest encryption operation under that key.']],test:output('different:same:same',String.raw`use Illuminate\Support\Facades\Crypt;
$a = Crypt::encryptString('same');
$b = Crypt::encryptString('same');
echo ($a !== $b ? 'different' : 'same').':'.Crypt::decryptString($a).':'.Crypt::decryptString($b);`)}),
q({n:522,type:'T',sub:'encrypted-payload-tamper-detection',needs:['Encrypted payload integrity','MAC verification','Decryption exceptions'],why:'Verify rejection of a modified protected value rather than only successful round trips.',docs:['encryption#decrypting-a-value'],assume:['The application uses Laravel’s AES-256-CBC encrypter. A test modifies the ciphertext value inside the payload but leaves its original MAC.'],ask:'Which result should the tampering regression test require?',choices:[['decryptString throws DecryptException instead of returning trusted plaintext.','The MAC authenticates the protected payload, so changing ciphertext without a valid corresponding MAC must be rejected.'],['decryptString returns the changed bytes as a successful plaintext value.','That would ignore the integrity guarantee the test is meant to protect.'],['decryptString silently repairs the payload using the application key.','The encrypter does not infer and repair the intended original ciphertext.'],['The modified outer value is accepted whenever it remains valid base64.','Base64 validity is only an encoding property, not authenticity.']],test:output('rejected',String.raw`$encrypted = Illuminate\Support\Facades\Crypt::encryptString('protected');
$p = json_decode(base64_decode($encrypted), true);
$p['value'][0] = $p['value'][0] === 'A' ? 'B' : 'A';
$tampered = base64_encode(json_encode($p));
try {
    Illuminate\Support\Facades\Crypt::decryptString($tampered);
} catch (Illuminate\Contracts\Encryption\DecryptException $e) {
    echo 'rejected';
}`)}),
q({n:523,type:'I',sub:'encryption-previous-key-decrypt-only',needs:['Encryption key rotation','Previous keys','Ciphertext migration'],why:'Keep old protected values readable while moving new encryption to the new key.',docs:['encryption#gracefully-rotating-encryption-keys'],ask:'During a controlled key rotation, existing values use the old key and new writes must use the new key. Which configuration supports that transition?',choices:[['Use the new key as current and retain the old key among previous decryption keys.','The current key encrypts new values; previous keys are tried when decrypting older protected values.'],['Use the old key as current and put the new key only among previous keys.','That keeps encrypting new values with the old key, contrary to the transition requirement.'],['Remove the old key immediately and expect the new key to decrypt all old values.','Ciphertexts protected by the old key do not become decryptable by an unrelated new key.'],['Alternate current keys on each request and keep no previous-key list.','That gives inconsistent read compatibility and no controlled transition boundary.']],test:output('old:new:old-key-rejected-new',String.raw`$oldKey = str_repeat('a', 32);
$newKey = str_repeat('b', 32);
$old = new Illuminate\Encryption\Encrypter($oldKey, 'AES-256-CBC');
$current = new Illuminate\Encryption\Encrypter($newKey, 'AES-256-CBC');
$current->previousKeys([$oldKey]);
echo $current->decryptString($old->encryptString('old')).':';
$newValue = $current->encryptString('new');
echo $current->decryptString($newValue).':';
try {
    $old->decryptString($newValue);
} catch (Illuminate\Contracts\Encryption\DecryptException $e) {
    echo 'old-key-rejected-new';
}`)}),
q({n:524,type:'R',sub:'decryption-failure-not-plaintext-fallback',needs:['Protected data trust boundary','DecryptException','Failure handling'],why:'Prevent a compatibility fallback from accepting data whose protection could not be verified.',docs:['encryption#decrypting-a-value'],ask:'A protected preference cookie fails decryptString. A proposed catch returns the original cookie value as if it were trusted plaintext. The application supports only encrypted cookies. What should the review require?',choices:[['Reject or discard the invalid protected value and apply an explicit safe default.','A decryption failure means the value was not successfully authenticated/decrypted; treating the supplied bytes as trusted plaintext bypasses the protection.'],['Keep the fallback whenever the original bytes form valid JSON.','JSON syntax does not establish authenticity under the required encrypted-cookie contract.'],['Base64-decode the original value and trust any printable output.','Encoding and printability do not verify the protected value.'],['Catch only a generic Exception and continue with the original value.','Changing the catch type does not repair the unsafe acceptance policy.']],test:output('default',String.raw`$cookie = 'not-an-authenticated-payload';
try {
    $preference = Illuminate\Support\Facades\Crypt::decryptString($cookie);
} catch (Illuminate\Contracts\Encryption\DecryptException $e) {
    $preference = 'default';
}
echo $preference;`)}),
q({n:525,type:'E',sub:'reset-token-hashed-storage',needs:['Password reset tokens','Token repository','Password hashing'],why:'Distinguish the link token from its stored verification representation.',docs:['passwords#requesting-the-password-reset-link'],ask:'A DatabaseTokenRepository creates a reset token and returns it for the link. Is the token column expected to equal that returned string?',choices:[['No; the stored token is hashed, and the repository checks the presented token against that hash.','The database stores a verification hash while the link carries the generated token.'],['Yes; the repository compares link tokens with plaintext SQL equality.','The repository verifies with the configured hasher instead of storing the returned token unchanged.'],['No; the token column contains an encrypted email address instead.','The email identifies the record separately; the token column stores the token hash.'],['Yes; hashing applies only after the first successful reset.','The hash is written when the token record is created.']],test:output('different:valid',passwords+String.raw`$plain = $tokens->create($user);
$stored = DB::table('password_reset_tokens')->value('token');
echo ($plain !== $stored ? 'different' : 'same').':'.($tokens->exists($user, $plain) ? 'valid' : 'invalid');`)}),
q({n:526,type:'E',sub:'reset-token-expire-versus-throttle-units',needs:['Password broker configuration','Token lifetime','Issuance throttle'],why:'Keep token validity and new-link rate limiting separate, including their configuration units.',docs:['passwords#configuration'],ask:'A standard password broker has expire=60 and throttle=60. Which interpretation is correct for Laravel’s broker configuration?',choices:[['A token can remain valid for 60 minutes; new token issuance is throttled for 60 seconds.','The broker manager converts expire from minutes to repository seconds, while throttle is already a seconds interval.'],['Both values are seconds, so every token expires after one minute.','This overlooks the broker manager’s conversion of the expire setting.'],['Both values are minutes, so a new link cannot be issued for an hour.','The throttle setting is a seconds interval.'],['expire limits failed password attempts; throttle controls how many times a link can be opened.','These settings concern token age and issuance timing, not those counters.']],test:output('valid:not-throttled:expired',passwords+String.raw`config([
    'auth.providers.members' => ['driver' => 'eloquent', 'model' => Member::class],
    'auth.passwords.fixture' => [
        'provider' => 'members',
        'table' => 'password_reset_tokens',
        'expire' => 60,
        'throttle' => 60,
    ],
]);
$tokens = app('auth.password')->broker('fixture')->getRepository();
Illuminate\Support\Carbon::setTestNow('2026-01-01 00:00:00');
$plain = $tokens->create($user);
Illuminate\Support\Carbon::setTestNow('2026-01-01 00:02:00');
echo ($tokens->exists($user, $plain) ? 'valid' : 'expired').':';
echo ($tokens->recentlyCreatedToken($user) ? 'throttled' : 'not-throttled').':';
Illuminate\Support\Carbon::setTestNow('2026-01-01 01:00:01');
echo $tokens->exists($user, $plain) ? 'valid' : 'expired';`)}),
q({n:527,type:'E',sub:'successful-reset-invalidates-token',needs:['Password broker reset','Single-use reset tokens'],why:'Trace token lifecycle after the reset callback completes successfully.',docs:['passwords#handling-the-form-submission'],ask:'A valid broker reset invokes its callback, the callback stores the new password and returns normally. What happens to that token’s repository record?',choices:[['It is deleted, so a later reset cannot reuse the same token.','The broker deletes the user’s token record after successful callback completion.'],['It remains usable until its original expiry regardless of the successful reset.','That ignores the broker’s post-reset token deletion.'],['Its lifetime is extended so the user can repeat the same reset if needed.','A successful reset does not renew the token for reuse.'],['Its plaintext value is copied into the user’s remember_token field automatically.','Reset-token cleanup and remember-token handling are different concerns; this is not the broker’s automatic action.']],test:output('passwords.reset:invalid:new',passwords+String.raw`$plain = $tokens->create($user);
$status = $broker->reset([
    'email' => $user->email,
    'token' => $plain,
    'password' => 'new-password',
], function ($member, $password) use ($hasher) {
    $member->password = $hasher->make($password);
    $member->save();
});
echo $status.':'.($tokens->exists($user, $plain) ? 'valid' : 'invalid').':';
echo $hasher->check('new-password', $user->fresh()->password) ? 'new' : 'old';`)}),
q({n:528,type:'E',sub:'reset-link-issuance-throttle',needs:['Password broker sendResetLink','Issuance throttle','Token replacement'],why:'Distinguish refusing a new issuance from invalidating the existing token.',docs:['passwords#requesting-the-password-reset-link'],assume:['The repository throttle is 60 seconds. A matching user exists. Two sendResetLink calls occur within that window; the delivery callback has no side effects outside the test.'],ask:'What does the second call do?',choices:[['It returns the throttled status without creating or delivering a replacement token.','The broker checks recentlyCreatedToken before creating a new token or invoking the delivery callback.'],['It creates a replacement token but delays only the notification callback.','The throttle check occurs before token creation, not just before notification.'],['It invalidates the current token and returns an invalid-user status.','Throttling neither means the user is absent nor requires deleting the existing token.'],['It reuses the same plaintext token by reading it back from the token column.','The column contains a hash, and the throttled path does not reconstruct or resend plaintext from it.']],test:output('passwords.sent:passwords.throttled:1',passwords+String.raw`$sent = 0;
$deliver = function ($member, $token) use (&$sent) {
    $sent++;
};
$a = $broker->sendResetLink(['email' => $user->email], $deliver);
$b = $broker->sendResetLink(['email' => $user->email], $deliver);
echo $a.':'.$b.':'.$sent;`)}),
q({n:529,type:'R',sub:'verification-user-and-email-binding',needs:['EmailVerificationRequest','Signed routes','Current authenticated user'],why:'Bind a valid verification link to the current account and current email rather than trusting its signature alone.',docs:['verification#the-email-verification-handler'],assume:['The route uses auth and signed middleware. The URL signature is valid. The handler receives the standard EmailVerificationRequest.'],ask:'The route id belongs to a different account, or its hash was generated for an email the current user no longer has. What additional authorization does EmailVerificationRequest apply?',choices:[['It compares the route ID with the current user and the hash with that user’s current verification email.','The form request checks both bindings before fulfillment; a valid URL signature alone is not enough to satisfy them.'],['It authorizes any authenticated user because signed middleware already verified the URL.','The standard request still verifies account identity and the email hash.'],['It selects the account solely from the route ID and logs that account in.','The request authorizes against the current user; it does not switch authentication to the route target.'],['It checks only that hash has forty characters, regardless of its value.','The request compares the hash with the expected digest, not merely its format.']],test:output('1:0:0',passwords+String.raw`$check = function ($id, $hash) use ($user) {
    $request = Illuminate\Foundation\Auth\EmailVerificationRequest::create("/verify/$id/$hash");
    $route = new Illuminate\Routing\Route('GET', 'verify/{id}/{hash}', fn () => null);
    $route->bind($request);
    $request->setRouteResolver(fn () => $route);
    $request->setUserResolver(fn () => $user);
    return (int) $request->authorize();
};
$hash = sha1($user->email);
echo $check($user->id, $hash).':'.$check($user->id + 1, $hash).':'.$check($user->id, sha1('old@example.test'));`)}),
q({n:530,type:'I',level:'F',sub:'verified-email-separate-from-auth',needs:['MustVerifyEmail contract','Authentication middleware','Verified middleware'],why:'Require a verified address without confusing a logged-in identity with ownership verification.',docs:['verification#protecting-routes'],assume:['The user model implements MustVerifyEmail, and the normal verification notice route exists.'],ask:'A route is protected by auth but must also reject authenticated users whose email is unverified. Which route middleware combination enforces that additional requirement?',choices:[['auth and verified','Authentication supplies the user identity; verified applies the email-verification requirement for a model implementing the contract.'],['auth only, because successful login necessarily verifies email ownership','A user can be authenticated without having completed email verification.'],['guest and verified','guest excludes authenticated users rather than protecting this authenticated feature.'],['signed only, because every authenticated request has an email-verification signature','A signed URL requirement is not a general verified-email policy for this route.']],test:output('403:allowed',passwords+String.raw`$request = Illuminate\Http\Request::create('/reports', server: ['HTTP_ACCEPT' => 'application/json']);
$request->setUserResolver(fn () => $user);
$middleware = new Illuminate\Auth\Middleware\EnsureEmailIsVerified;
try {
    $middleware->handle($request, fn () => response('allowed'));
} catch (Symfony\Component\HttpKernel\Exception\HttpException $e) {
    echo $e->getStatusCode().':';
}
$user->email_verified_at = now();
echo $middleware->handle($request, fn () => response('allowed'))->getContent();`)}),
];
