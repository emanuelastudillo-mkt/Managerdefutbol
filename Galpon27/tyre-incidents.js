(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null),G=root.OvalRaceGeometry||(typeof require==='function'?require('./race-geometry'):null),M=root.OvalTelemetry||(typeof require==='function'?require('./telemetry'):null),A=root.OvalArcade||(typeof require==='function'?require('./arcade'):null);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),random=r=>{r.seed=(Math.imul(1664525,r.seed)+1013904223)>>>0;return r.seed/4294967296;};
function initialize(r){if(r.fieldVersion!==2)return;r.incidentModel=1;for(const e of r.entries)e.tyreSafety={count:0,cooldown:0,active:null};}
function offTrack(e){return !!e.tyreSafety?.active&&e.tyreSafety.active.kind!=='slide'&&!e.tyreSafety.active.returning;}
function risk(r,e,t){if(e.status!=='running'||e.pitVisit||e.parade||e.traffic.speed<45||e.tyres>=35)return 0;const driver=e.drivers[e.driverIndex],worn=clamp((35-e.tyres)/35,0,1),critical=e.tyres<10?.008+(10-e.tyres)*.0035:0,fx=A.effects(r,e,Math.max(0,r.time-1)),corner=G.isStraight(e.distance/t.km,t)?1:1.6;return clamp((.0007+worn*.0015+critical)*(1.4-driver.care*.008)*(1.3-driver.skill*.005)*corner*(fx.extraGrip?.3:1)*(fx.turbo?1.3:1),0,.15);}
function start(r,e,kind,side=1){const duration=kind==='slide'?3:kind==='runoff'?6:9;e.tyreSafety.count++;e.traffic.speed*=kind==='slide'?.85:kind==='runoff'?.4:.15;e.tyreSafety.active={kind,duration,remaining:duration,side,returning:false};if(kind==='impact'){M.hit(e,3,side<0?'left':'right');M.contactTyres(e,1.2,side<0?'left':'right');e.car.parts.aero.condition=Math.max(0,e.car.parts.aero.condition-1.4);e.car.parts.suspension.condition=Math.max(0,e.car.parts.suspension.condition-.8);}return {entry:e.id,kind,duration};}
function step(r,t,T){const events=[];if(r.incidentModel!==1)return events;const L=G.course(t),K=L/t.km;
 for(const e of r.entries){const s=e.tyreSafety;s.cooldown=Math.max(0,s.cooldown-1);if(e.status!=='running'||e.pitVisit||e.parade){s.active=null;continue;}
  if(s.active){const a=s.active;if(a.kind!=='slide'&&!a.returning&&a.remaining<=2){if(!T.laneFree(e,e.traffic.lane,r.entries,K,L,t))continue;a.returning=true;}
   a.remaining--;if(a.remaining<=0){s.active=null;s.cooldown=20;}continue;}
  if(s.cooldown)continue;const chance=risk(r,e,t);if(!chance||random(r)>=chance)continue;const roll=random(r),kind=roll<(e.tyres<3?.40:.55)?'slide':roll<(e.tyres<3?.75:.86)?'runoff':'impact';events.push(start(r,e,kind,random(r)<.5?-1:1));
 }return events;
}
function cap(e){const a=e.tyreSafety?.active;return !a?Infinity:a.returning?55:a.kind==='slide'?Math.max(25,e.traffic.speed*.6):a.kind==='runoff'?30:12;}
function offset(e){const a=e.tyreSafety?.active;if(!a)return 0;const elapsed=a.duration-a.remaining,fade=a.returning?a.remaining/2:Math.min(1,elapsed+1);return a.side*(a.kind==='slide'?9:52)*fade;}
function yaw(e){const a=e.tyreSafety?.active;return a?a.side*(a.kind==='slide'?.18:.35)*Math.sin((a.duration-a.remaining+1)*1.7):0;}
function label(e){return e.tyreSafety?.active?({slide:'Derrape',runoff:'Salida de pista',impact:'Impacto por pérdida de agarre'})[e.tyreSafety.active.kind]:'';}
function validate(r){if(r.incidentModel===undefined){if(r.fieldVersion===2)throw Error('Riesgo de neumáticos ausente.');return;}if(r.incidentModel!==1||r.fieldVersion!==2)throw Error('Riesgo de neumáticos inválido.');for(const e of r.entries){const s=e.tyreSafety,a=s?.active;if(!s||Object.keys(s).length!==3||!Number.isInteger(s.count)||s.count<0||s.count>1e7||!Number.isInteger(s.cooldown)||s.cooldown<0||s.cooldown>20||!(a===null||a&&['slide','runoff','impact'].includes(a.kind)&&a.duration===({slide:3,runoff:6,impact:9})[a.kind]&&Number.isInteger(a.remaining)&&a.remaining>=1&&a.remaining<=a.duration&&[-1,1].includes(a.side)&&typeof a.returning==='boolean'&&(!a.returning||a.kind!=='slide'&&a.remaining<=2)))throw Error('Despiste guardado inválido.');}}
const api={initialize,risk,start,step,offTrack,cap,offset,yaw,label,validate};root.GalponTyreIncidents=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
