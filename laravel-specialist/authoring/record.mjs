import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const file=(source,path='probe.php',kind='complete-file',scope='')=>({path,kind,source:kind==='complete-file'?'<?php\n\n'+source.trim()+'\n':source,...(scope?{scope}:{})});
export const formats={E:'execution',D:'debugging',R:'code-review',I:'implementation',T:'testing',A:'architecture'};
const levels={F:'Foundation',M:'Intermediate',A:'Advanced'};
export const src={config:'Illuminate/Config/Repository.php',env:'Illuminate/Support/Env.php',container:'Illuminate/Container/Container.php',providers:'Illuminate/Foundation/Bootstrap/RegisterProviders.php',application:'Illuminate/Foundation/Application.php',routes:'Illuminate/Routing/Router.php',route:'Illuminate/Routing/Route.php',url:'Illuminate/Routing/UrlGenerator.php',request:'Illuminate/Http/Request.php',input:'Illuminate/Http/Concerns/InteractsWithInput.php',data:'Illuminate/Support/Traits/InteractsWithData.php',content:'Illuminate/Http/Concerns/InteractsWithContentTypes.php',middleware:'Illuminate/Foundation/Configuration/Middleware.php',kernel:'Illuminate/Foundation/Http/Kernel.php',response:'Illuminate/Routing/ResponseFactory.php',exceptions:'Illuminate/Foundation/Exceptions/Handler.php'};
// Every call is one separately authored assessment. This supplies metadata only.
export function q({n,type,level='M',sub,needs,ask,choices,key=0,code=[],assume=[],test,docs,lessons=null,why,revision=1}){
 const batch=Math.ceil(n/100),id=`LAR-S26-${String(n).padStart(4,'0')}`;
 const plan=JSON.parse(readFileSync(new URL(`batch-${String(batch).padStart(2,'0')}-plan.json`,import.meta.url))).find(p=>p.id===id);
 if(!plan)throw Error(`Plan objective missing: ${id}`);
 const ordered=choices.map(([text,rationale],i)=>({text,rationale,original:i,sort:createHash('sha256').update(id+':'+i).digest('hex')})).sort((a,b)=>a.sort.localeCompare(b.sort));
 const options=ordered.map((o,i)=>({id:`choice-${i+1}`,text:o.text,rationale:o.rationale,misconception:o.original===key?null:o.rationale}));
 const correctOptionId=options[ordered.findIndex(o=>o.original===key)].id;
 return {schemaVersion:1,technology:'laravel',collectionId:'laravel-specialist-review-v1',id,revision,status:'draft',responseType:'single-choice',format:formats[type],topic:plan.topic,subtopic:sub,objective:{id:`laravel.${sub}`,text:plan.objective},difficulty:{level:levels[level],audience:level==='F'?'junior':level==='A'?'advanced':'intermediate',rationale:why},prerequisites:needs,runtime:{php:['8.4','8.5'],laravel:'13.x',validatedLaravel:'13.40.0',sapi:'Isolated CLI Laravel harness unless another context is explicitly stated',errorPolicy:'E_ALL; UTC; no external services or application data'},context:{assumptions:assume,files:code},stem:ask,options,correctOptionId,explanation:{summary:choices[key][1],trace:options.map(o=>o.rationale)},validation:{...test,status:'unvalidated',independentEditorialReview:'pending'},curriculum:{lessonIds:lessons,lessonMappingStatus:lessons?'working-completed-outline':'unmapped',coverageComplete:!!lessons},references:docs.map(d=>d.startsWith('https:')?d:`https://laravel.com/docs/13.x/${d}`)};
}
export const contract=(source,contains,reason)=>({kind:'documented-contract',source,contains,reason});
export const output=(stdout,probe=null)=>({kind:'runtime',stdout,...(probe?{probe}:{})});

// Anonymous component discovery expects the normal application's PSR-4 root.
// The fixture writes this metadata only inside its fresh temporary app directory.
export const bladeOutput=(stdout,probe)=>output(stdout,String.raw`if (! is_dir(resource_path('views/components'))) {
    mkdir(resource_path('views/components'), 0700, true);
}
file_put_contents(base_path('composer.json'), json_encode([
    'autoload' => ['psr-4' => ['App\\' => 'app/']],
]));
`+probe);
