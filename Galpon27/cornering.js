(function(root){
'use strict';
const G=root.OvalRaceGeometry||(typeof require==='function'?require('./race-geometry'):null),C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null);
const N=2048,geometry=new Map(),envelopes=new Map(),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function profile(t){const key=G.key(t);if(geometry.has(key))return geometry.get(key);const ds=t.km*1000/N,window=Math.max(2,Math.ceil(4/ds)),delta=window/N,curvature=new Float64Array(N);for(let i=0;i<N;i++){const a=G.ovalPoint(i/N-delta,t),b=G.ovalPoint(i/N,t),c=G.ovalPoint(i/N+delta,t),angle=Math.abs(Math.atan2(Math.sin(Math.atan2(c.y-b.y,c.x-b.x)-Math.atan2(b.y-a.y,b.x-a.x)),Math.cos(Math.atan2(c.y-b.y,c.x-b.x)-Math.atan2(b.y-a.y,b.x-a.x))));curvature[i]=angle/(window*ds);}const result={ds,curvature};geometry.set(key,result);return result;}
function limits(e,t,cap){const p=profile(t),a=e.car.parts.aero,part=C.part(a.id),aero=part.factor*(.8+.2*a.condition/100),downforce=e.car.setup.downforce/100;
 const grip=Math.round(cap.grip*25)/25,focus=Math.round(cap.focus*20)/20,brake=Math.max(5,Math.floor(cap.brake)),reaction=Math.round(cap.reaction*10)/10,load=Math.round(aero*downforce*20)/20,key=[G.key(t),grip,focus,brake,load,reaction].join('|');if(envelopes.has(key))return envelopes.get(key);
 const lateral=9.81*(.85+grip*.60+load*.80)*(.78+.22*focus)*(1+Math.max(0,t.bank)*.025),apex=new Float64Array(N),safe=new Float64Array(N);for(let i=0;i<N;i++)safe[i]=apex[i]=clamp(Math.sqrt(lateral/Math.max(.000001,p.curvature[i]))*3.6,28,1400);
 // Backwards braking envelope includes the next lap's first turn.
 const anticipation=Math.max(.55,1-reaction*.18);for(let k=2*N-1;k>=0;k--){const i=k%N;safe[i]=Math.min(safe[i],Math.sqrt(safe[(i+1)%N]**2+2*brake*p.ds*3.6*anticipation));}
 const result={safe,apex,curvature:p.curvature};envelopes.set(key,result);if(envelopes.size>192)envelopes.delete(envelopes.keys().next().value);return result;}
function target(e,t,cap,goal,dt,prepared=null,extraGrip=false){const p=prepared||limits(e,t,cap),f=((e.distance/t.km)%1+1)%1,i=Math.floor(f*N)%N;let speed=extraGrip?goal:Math.min(goal,p.safe[i]);const turning=p.curvature[i]>1/500;
 // Recovery from a queue remains possible. At racing speed the driver holds
 // a neutral throttle through the bend and accelerates after unwinding it.
 // Extra grip suspends curve braking only; traffic and pit limits are applied by the caller.
 if(!extraGrip&&turning&&e.traffic.speed>p.apex[i]*.80)speed=Math.min(speed,e.traffic.speed*(1-.0007*dt));return{speed,turning,apex:p.apex[i],radius:1/Math.max(1e-8,p.curvature[i])};}
const api={profile,limits,target,diagnostics:()=>({geometry:geometry.size,envelopes:envelopes.size,samples:N})};root.GalponCornering=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
