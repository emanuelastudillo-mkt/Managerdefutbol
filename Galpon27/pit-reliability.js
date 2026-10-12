(function(root){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),cruise=Object.freeze([60,90,120,130,150]);
function chance({skill=40,pitLevel=1,tools=0}={}){return clamp(.30-clamp(skill,0,100)*.0018-(clamp(pitLevel,1,100)-1)*.008-clamp(tools,0,10)*.012,.025,.35);}
function roll(seed,entry,stop,settings,tasks){let n=seed>>>0;for(const c of entry)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;n=(Math.imul(n^stop,1664525)+1013904223)>>>0;const probability=chance(settings),failed=n/4294967296<probability;n=(Math.imul(n,1664525)+1013904223)>>>0;const seconds=failed?3+n%3:0,kinds=tasks.map(t=>t.kind),reason=!failed?'':kinds.includes('tyres')?'Tuerca trabada':kinds.includes('repair')?'Herramienta desajustada':kinds.includes('fuel')?'Acople de combustible trabado':'Ajuste del cinturón';return {version:1,seconds,reason,chance:probability};}
function validate(e){const d=e.pitDelay;if(d===undefined||d===null)return;if(d.version!==1||![0,3,4,5].includes(d.seconds)||typeof d.reason!=='string'||d.reason.length>80||!Number.isFinite(d.chance)||d.chance<.025||d.chance>.35||d.seconds>e.pitTotal-e.pitTasks.reduce((n,t)=>n+t.seconds,0)||d.seconds>0&&!d.reason)throw Error('Demora de boxes inválida.');}
const api={chance,roll,validate,cruise};root.GalponPitReliability=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
