(function(root){
'use strict';
const sum=e=>e.pitTasks.reduce((n,t)=>n+t.seconds,0),elapsed=e=>Math.max(0,e.pitTotal-e.pitRemaining);
function initialize(e){e.pitService=e.pitVisit&&e.pitTasks.length?{version:1,applied:0}:null;}
function advance(e,apply){if(!e.pitService||e.pitVisit?.phase!=='service')return;let end=e.pitTotal-sum(e);for(let i=0;i<e.pitTasks.length;i++){const task=e.pitTasks[i];end+=task.seconds;if(i>=e.pitService.applied&&elapsed(e)>=end){apply(task);e.pitService.applied=i+1;}}}
function plan(e){if(!e.pitVisit||!e.pitService)return[];const spent=elapsed(e),servicing=e.pitVisit.phase==='service',delay=e.pitDelay?.seconds||0,overhead=e.pitTotal-sum(e)-delay,rows=[];let start=0;
 const row=(name,seconds,done,kind)=>{const active=servicing&&!done&&spent>=start,progress=done?seconds:active?Math.min(seconds,Math.max(0,spent-start)):0;rows.push({name,kind,seconds,remaining:Math.max(0,seconds-progress),wait:Math.max(0,start-spent),status:done?'completed':active?'active':'pending',progress:seconds?progress/seconds:done?1:0});start+=seconds;};
 if(overhead>0)row(e.pitVisit.emergency?'Asistencia de emergencia':'Preparación de boxes',overhead,spent>=overhead,'assistance');
 if(delay)row(e.pitDelay.reason+' · demora extra',delay,spent>=overhead+delay,'delay');
 e.pitTasks.forEach((t,i)=>row(t.name,t.seconds,i<e.pitService.applied,t.kind));return rows;
}
function validate(e){const fail=()=>{throw Error('Progreso de trabajos de boxes inválido.');},int=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;if(!int(e.pitRemaining,0,e.pitTotal)||!int(e.pitTotal,0,1e6))fail();const v=e.pitService;if(v===null){if(e.pitTasks.length||e.pitRemaining)fail();return;}if(!v||v.version!==1||!int(v.applied,0,e.pitTasks.length)||!e.pitVisit||!e.pitTasks.length||e.pitTasks.length>4||new Set(e.pitTasks.map(t=>t.kind)).size!==e.pitTasks.length||e.pitTasks.some(t=>!int(t.seconds,0,1e6))||sum(e)>e.pitTotal)fail();const phase=e.pitVisit.phase;if(['queued','entry'].includes(phase)&&(v.applied!==0||e.pitRemaining!==e.pitTotal))fail();if(['exit','merge'].includes(phase)&&(v.applied!==e.pitTasks.length||e.pitRemaining!==0))fail();if(phase==='service'){let end=e.pitTotal-sum(e),due=0;for(const t of e.pitTasks){end+=t.seconds;if(elapsed(e)>=end)due++;}if(v.applied!==due)fail();}}
const api={initialize,advance,plan,validate};root.OvalPitService=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
