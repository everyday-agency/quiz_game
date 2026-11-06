import {q,file,output} from '../record.mjs';
export default [
q({n:551,revision:2,key:3,type:'E',sub:'data-get-wildcard-leaf-default',needs:['Nested data helpers','Wildcard traversal','Default values'],why:'Trace the scope of a default argument through wildcard recursion in the pinned helper.',docs:['helpers#method-data-get'],ask:'What array is returned?',code:[file(String.raw`$rows = [
    ['user' => ['name' => 'Ada']],
    ['user' => []],
];

echo json_encode(data_get($rows, '*.user.name', 'guest'));`)],choices:[['["Ada","guest"]','In the pinned helper, wildcard recursion does not forward the outer default to each child lookup, so the second missing leaf receives null.'],['"guest"','One missing leaf does not replace the entire wildcard result with the default.'],['["Ada"]','The missing leaf is represented by the supplied default rather than dropped.'],['["Ada",null]','The wildcard branch recursively looks up each child without forwarding the outer default, so the missing leaf uses null. To supply a per-row fallback, map each row through data_get with that fallback.']],test:output('["Ada",null]')}),
q({n:552,type:'E',sub:'data-fill-array-presence-not-truthiness',needs:['Nested array defaults','data_fill','Present null and false'],why:'Distinguish absence from a present falsey value when filling defaults.',docs:['helpers#method-data-fill'],ask:'What JSON results from these fills?',code:[file(String.raw`$settings = ['enabled' => false, 'label' => null];

data_fill($settings, 'enabled', true);
data_fill($settings, 'label', 'default');
data_fill($settings, 'limit', 10);

echo json_encode($settings);`)],choices:[['{"enabled":false,"label":null,"limit":10}','For this array, data_fill preserves existing keys including false and null and supplies only the absent limit.'],['{"enabled":true,"label":"default","limit":10}','This treats the operation as overwriting all falsey or existing values.'],['{"enabled":false,"label":"default","limit":10}','Array key existence preserves the present null as well as false.'],['{"enabled":false,"label":null}','The absent limit is filled; preserving existing values does not mean doing nothing.']],test:output('{"enabled":false,"label":null,"limit":10}')}),
q({n:553,type:'E',level:'F',sub:'fluent-string-returned-value',needs:['Stringable','Immutable transformations','Assignment'],why:'Use the returned fluent string without assuming it mutates the original object.',docs:['strings#fluent-strings'],ask:'What is printed?',code:[file(String.raw`$original = str('  laravel  ');
$clean = $original->trim()->upper();

echo '['.$original.']:['.$clean.']';`)],choices:[['[  laravel  ]:[LARAVEL]','The fluent transformations return new Stringable values; the original keeps its initial contents.'],['[LARAVEL]:[LARAVEL]','This assumes the transformation chain mutates the original object in place.'],['[laravel]:[LARAVEL]','trim does not mutate only the original while upper changes a separate value; both return transformed values.'],['[  laravel  ]:[  LARAVEL  ]','The returned chain does apply trim before upper.']],test:output('[  laravel  ]:[LARAVEL]')}),
q({n:554,type:'E',sub:'pipeline-finally-on-pipe-exception',needs:['Pipeline stages','Exception propagation','Cleanup callbacks'],why:'Trace cleanup independently from the destination when an earlier stage fails.',docs:['helpers#pipeline'],ask:'What is printed when the pipe throws before reaching the destination?',code:[file(String.raw`try {
    app(Illuminate\Pipeline\Pipeline::class)
        ->send('input')
        ->through([
            function ($value, $next) {
                throw new RuntimeException('pipe failed');
            },
        ])
        ->finally(function ($value) {
            echo 'cleanup:';
        })
        ->then(function ($value) {
            echo 'destination:';
        });
} catch (RuntimeException $e) {
    echo 'caught';
}`)],choices:[['cleanup:caught','The pipeline finally callback runs during exceptional unwinding; the destination was never reached and the original exception still propagates.'],['caught only','This overlooks the pipeline’s finally callback on an exceptional exit.'],['destination:cleanup:caught','A stage that throws before invoking next prevents the destination from running.'],['cleanup:destination:','Cleanup does not resume the failed pipeline or swallow the exception.']],test:output('cleanup:caught')}),
q({n:555,type:'E',sub:'pipeline-string-parameters-order',needs:['Pipeline pipe strings','Handle parameters','Transformation order'],why:'Apply pipe parameters in their declared positions before forwarding the result.',docs:['helpers#pipeline'],ask:'What does the pipeline return?',code:[file(String.raw`class Scale
{
    public function handle($value, Closure $next, $factor, $offset)
    {
        return $next($value * (int) $factor + (int) $offset);
    }
}

echo app(Illuminate\Pipeline\Pipeline::class)
    ->send(4)
    ->through([Scale::class.':3,2'])
    ->thenReturn();`)],choices:[['14','The pipe receives factor 3 and offset 2, computes 4 × 3 + 2 and forwards 14.'],['18','That applies the offset before multiplication rather than following the displayed expression.'],['11','That swaps the two pipe-string parameters.'],['4','The pipe forwards its transformed value, not the untouched original input.']],test:output('14')}),
q({n:556,type:'E',level:'F',sub:'translation-fallback-locale',needs:['Language files','Current and fallback locales'],why:'Resolve a missing locale entry through the configured fallback.',docs:['localization#configuring-the-locale','localization#retrieving-translation-strings'],assume:['The current locale is fr, fallback is en, and these are the only matching translations.'],ask:'What does __("messages.welcome") return?',code:[file("return ['welcome' => 'Welcome'];",'lang/en/messages.php'),file("return ['goodbye' => 'Au revoir'];",'lang/fr/messages.php')],choices:[['Welcome','The French file lacks welcome, so the configured English fallback supplies it.'],['messages.welcome','That would be the usual missing-key result if no configured locale supplied the translation.'],['Au revoir','The translator does not substitute an unrelated key from the requested locale.'],['An exception because every locale file must contain identical keys','Missing locale entries can use fallback behavior instead of making the file invalid.']],test:output('Welcome',String.raw`app()->setLocale('fr');
app('translator')->setFallback('en');
echo __('messages.welcome');`)}),
q({n:557,type:'E',sub:'translation-empty-php-value-versus-missing',needs:['PHP language files','Empty translations','Missing keys'],why:'Distinguish a deliberately empty PHP translation from an absent key.',docs:['localization#retrieving-translation-strings'],assume:['The current locale is en. There are no JSON translation overrides or custom missing-key callbacks.'],ask:'What is printed?',code:[file("return ['notice' => ''];",'lang/en/messages.php'),file(String.raw`echo '['.__('messages.notice').']:['.__('messages.absent').']';`)],choices:[['[]:[messages.absent]','The PHP translation file provides an empty string for notice; the absent key falls back to its key text.'],['[messages.notice]:[messages.absent]','This treats the existing PHP language-file entry as absent solely because it is empty.'],['[]:[]','An absent key is not automatically translated to an empty string.'],['[null]:[null]','The helper does not stringify these cases as the text null.']],test:output('[]:[messages.absent]')}),
q({n:558,type:'E',level:'F',sub:'translation-plural-range-selection',needs:['Plural translations','Count argument','Range selectors'],why:'Select the branch using the count and then substitute its placeholder.',docs:['localization#pluralization'],ask:'With this English translation, what does trans_choice("messages.files", 2) return?',code:[file("return ['files' => '{0} No files|{1} One file|[2,*] :count files'];",'lang/en/messages.php')],choices:[['2 files','Count two matches the [2,*] range, and the count placeholder is replaced with 2.'],['One file','The singular branch is selected for count one, not two.'],['No files','The zero branch does not match the supplied count.'],[':count files','The selected branch’s count placeholder is substituted by trans_choice.']],test:output('2 files',String.raw`echo trans_choice('messages.files', 2);`)}),
q({n:559,type:'E',level:'F',sub:'translation-placeholder-case',needs:['Translation placeholders','Replacement capitalization'],why:'Apply the translator’s case conventions to a supplied replacement.',docs:['localization#replacing-parameters-in-translation-strings'],ask:'What is returned for messages.greeting with name="ada"?',code:[file("return ['greeting' => ':name / :Name / :NAME'];",'lang/en/messages.php')],choices:[['ada / Ada / ADA','The placeholder spelling controls unchanged, initial-capital and uppercase forms of the supplied replacement.'],['ada / ada / ada','This ignores capitalization handling for the placeholder variants.'],[':name / :Name / :NAME','The named replacement is applied rather than leaving all placeholders literal.'],['ADA / Ada / ada','This reverses the lowercase and uppercase placeholder conventions.']],test:output('ada / Ada / ADA',String.raw`echo __('messages.greeting', ['name' => 'ada']);`)}),
q({n:560,type:'I',sub:'package-translation-selective-override',needs:['Namespaced package translations','Application overrides','Translation merging'],why:'Customize one package phrase without losing unchanged package defaults.',docs:['localization#overriding-package-language-files','packages#translations'],assume:['The ui namespace is registered to package/lang. The current locale is fr.'],ask:'The application wants to override only ui::messages.save. Which layout retains the package’s cancel translation?',code:[file("return ['save' => 'Sauver', 'cancel' => 'Annuler'];",'package/lang/fr/messages.php')],choices:[['Add lang/vendor/ui/fr/messages.php containing only the save override.','The application override file merges with the package namespace’s defaults, replacing the specified key while retaining others.'],['Edit lang/fr/messages.php and expect it to replace ui::messages.save automatically.','A regular application group does not target the ui package namespace.'],['Create lang/vendor/ui/fr/save.php containing the replacement text.','That names a different translation group rather than overriding messages.save.'],['Remove the package namespace registration and keep only the one overridden key.','Removing the namespace defaults loses the untouched package translations.']],test:output('Enregistrer:Annuler',String.raw`mkdir(lang_path('vendor/ui/fr'), 0700, true);
file_put_contents(lang_path('vendor/ui/fr/messages.php'), "<?php return ['save' => 'Enregistrer'];");
app('translator')->addNamespace('ui', base_path('package/lang'));
app()->setLocale('fr');
echo __('ui::messages.save').':'.__('ui::messages.cancel');`)}),
];
