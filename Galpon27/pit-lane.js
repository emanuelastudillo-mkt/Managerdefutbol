(function(root){
'use strict';
const Speed=root.GalponVehicleSpeed||(typeof require==='function'?require('./vehicle-speed'):null);
const G=root.OvalRaceGeometry||(typeof require==='function'?require('./race-geometry.js'):null),cache=new Map(),LIMIT=120,VERSION=4;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),course=t=>G.course(t);
function legacyLayout(t){const L=course(t),entry=(t.straight+1.95*t.radius)/L,exit=(2*t.straight+Math.PI*t.radius+1.19*t.radius)/L,extent=t.straight/2+t.radius*.40,y=t.radius-52;return{entry,exit,extent,y,bayY:y-30,entryPoint:G.lanePoint(entry,t,-16),exitPoint:G.lanePoint(exit,t,-16)};}
function legacyRoute(t,index=0){const key='1|'+t.id+'|'+index;if(cache.has(key))return cache.get(key);const l=legacyLayout(t),x=l.extent*.80-index*l.extent*1.60/9,points=[];let length=0;
 const add=p=>{const prev=points.at(-1);if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,s:length});};
 const curve=(a,b,c,d)=>{if(!points.length)add(a);for(let i=1;i<=48;i++){const u=i/48,v=1-u;add({x:v*v*v*a.x+3*v*v*u*b.x+3*v*u*u*c.x+u*u*u*d.x,y:v*v*v*a.y+3*v*v*u*b.y+3*v*u*u*c.y+u*u*u*d.y});}};
 const line=p=>add(p),a=l.entryPoint,z=l.exitPoint;
 curve(a,{x:a.x+Math.cos(a.a)*26,y:a.y+Math.sin(a.a)*26},{x:l.extent+23,y:l.y},{x:l.extent+5,y:l.y});
 line({x:x+28,y:l.y});curve(points.at(-1),{x:x+15,y:l.y},{x:x+14,y:l.bayY},{x,y:l.bayY});const stop=length;
 curve(points.at(-1),{x:x-14,y:l.bayY},{x:x-15,y:l.y},{x:x-28,y:l.y});line({x:-l.extent-5,y:l.y});
 curve(points.at(-1),{x:-l.extent-23,y:l.y},{x:z.x-Math.cos(z.a)*26,y:z.y-Math.sin(z.a)*26},z);
 const result={points,length,stop,index,version:1,...l};cache.set(key,result);return result;}

function layout(t,version=t.legacyGeometry!==false?3:VERSION){if(version===4)return sharedLayout(t);const L=course(t);if(t.outline){const g=G.shape(t),entry=g.pitEntry,exit=g.pitExit,p=G.lanePoint((entry+exit)/2,t,-100);return{centerX:p.x,entry,exit,extent:(exit-entry)*L*.31,y:p.y,bayY:p.y+30,entryPoint:G.lanePoint(entry,t,-16),exitPoint:G.lanePoint(exit,t,-16)};}if(t.pitCompact&&version===3){const centerX=-t.straight/2+L*.08,entry=(t.straight/2+centerX-650)/L,exit=(t.straight/2+centerX+650)/L,y=-t.radius+100;return{centerX,entry,exit,extent:220,y,bayY:y+30,entryPoint:G.lanePoint(entry,t,-16),exitPoint:G.lanePoint(exit,t,-16)};}const entry=(2*t.straight+Math.PI*t.radius+(version===2?1.5:1)*t.radius)/L,exit=(2*L+t.straight*.38)/L,extent=t.straight/2+t.radius*.40,y=t.radius-52;return{entry,exit,extent,y,bayY:y-30,entryPoint:G.lanePoint(entry,t,-16),exitPoint:G.lanePoint(exit,t,-16)};}
// A compact service road on the long north straight. Sporting distance follows
// its longitudinal position: entering a bay cannot grant a fictitious lap.
function compactRoute(t,index){const key='3|'+t.id+'|'+index;if(cache.has(key))return cache.get(key);const l=layout(t,3),c=l.centerX,x=c-l.extent*.8+index*l.extent*1.6/9,points=[];let length=0;
 const add=p=>{const prev=points.at(-1);if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,s:length,track:p.x+t.straight/2});};
 const curve=(a,b,cc,d)=>{if(!points.length)add(a);for(let i=1;i<=128;i++){const u=i/128,v=1-u;add({x:v*v*v*a.x+3*v*v*u*b.x+3*v*u*u*cc.x+u*u*u*d.x,y:v*v*v*a.y+3*v*v*u*b.y+3*v*u*u*cc.y+u*u*u*d.y});}};
 curve(l.entryPoint,{x:c-520,y:l.entryPoint.y},{x:c-430,y:l.y},{x:c-300,y:l.y});const detach=points.find(p=>p.y>=-t.radius+31).s,limitStart=length;
 add({x:x-28,y:l.y});curve(points.at(-1),{x:x-15,y:l.y},{x:x-14,y:l.bayY},{x,y:l.bayY});const stop=length;
 curve(points.at(-1),{x:x+14,y:l.bayY},{x:x+15,y:l.y},{x:x+28,y:l.y});add({x:c+300,y:l.y});const limitEnd=length;
 curve(points.at(-1),{x:c+380,y:l.y},{x:c+420,y:-t.radius+44},{x:c+500,y:-t.radius+44});const mergeStart=length;
 curve(points.at(-1),{x:c+550,y:-t.radius+44},{x:c+600,y:l.exitPoint.y},l.exitPoint);
 const result={points,length,stop,index,version:3,detach,limitStart,limitEnd,mergeStart,...l};cache.set(key,result);return result;
}
function previousRoute(t,index=0,version=2){
 if(version===1)return legacyRoute(t,index);
 const key='2|'+t.id+'|'+index;if(cache.has(key))return cache.get(key);
 const l=layout(t,2),S=t.straight,R=t.radius,L=course(t),inner=R-44,x=l.extent*.80-index*l.extent*1.60/9,points=[];let length=0;
 const add=(p,track)=>{const prev=points.at(-1);if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,s:length,track});};
 const curve=(a,b,c,d,start,end)=>{if(!points.length)add(a,start);for(let i=1;i<=48;i++){const u=i/48,v=1-u;add({x:v*v*v*a.x+3*v*v*u*b.x+3*v*u*u*c.x+u*u*u*d.x,y:v*v*v*a.y+3*v*v*u*b.y+3*v*u*u*c.y+u*u*u*d.y},start+(end-start)*u);}};
 const line=(p,track)=>add(p,track),right=a=>({x:S/2+Math.sin(a)*inner,y:-Math.cos(a)*inner}),left=a=>({x:-S/2-Math.sin(a)*inner,y:Math.cos(a)*inner});
 // The access branches off on the left curve, then follows the entire top
 // straight and the right curve before the service road. Even fast cars can
 // brake fully after leaving the racing surface.
 add(l.entryPoint,l.entry*L);for(let i=1;i<=64;i++){const u=i/64,q=Math.min(1,u/.6),depth=16+28*q*q*(3-2*q),a=1.5+(Math.PI-1.5)*u;add({x:-S/2-Math.sin(a)*(R-depth),y:Math.cos(a)*(R-depth),depth},2*S+Math.PI*R+a*R);}
 const detach=points.find(p=>p.depth>=31).s;
 line({x:S/2,y:-inner},L+S);
 for(let i=1;i<=64;i++){const a=2.12*i/64;add(right(a),L+S+a*R);}
 const a=right(2.12),roadStart={x:l.extent+5,y:l.y};curve(a,{x:a.x+Math.cos(2.12)*22,y:a.y+Math.sin(2.12)*22},{x:roadStart.x+18,y:roadStart.y},roadStart,L+S+2.12*R,L+S+Math.PI*R);const limitStart=length;
 // Every team keeps its own service bay and rejoins the shared road.
 const firstTrack=points.at(-1).track,lastTrack=L+2*S+Math.PI*R+.70*R,roadSpan=2*(l.extent+5),trackAt=px=>firstTrack+(lastTrack-firstTrack)*(l.extent+5-px)/roadSpan;
 line({x:x+28,y:l.y},trackAt(x+28));const startTrack=points.at(-1).track;
 curve(points.at(-1),{x:x+15,y:l.y},{x:x+14,y:l.bayY},{x,y:l.bayY},startTrack,trackAt(x));const stop=length;
 curve(points.at(-1),{x:x-14,y:l.bayY},{x:x-15,y:l.y},{x:x-28,y:l.y},trackAt(x),trackAt(x-28));line({x:-l.extent-5,y:l.y},lastTrack);const limitEnd=length;
 const z=left(1);curve(points.at(-1),{x:-l.extent-23,y:l.y},{x:z.x-Math.cos(Math.PI+1)*20,y:z.y-Math.sin(Math.PI+1)*20},z,lastTrack,L+2*S+Math.PI*R+R);
 for(let i=1;i<=64;i++){const a=1+(Math.PI-1)*i/64;add(left(a),L+2*S+Math.PI*R+a*R);}
 line({x:-S/2+S*.02,y:-inner},2*L+S*.02);const mergeStart=length;
 curve(points.at(-1),{x:-S/2+S*.14,y:-inner},{x:l.exitPoint.x-S*.12,y:l.exitPoint.y},l.exitPoint,2*L+S*.02,l.exit*L);
 const result={points,length,stop,index,version:2,detach,limitStart,limitEnd,mergeStart,...l};cache.set(key,result);return result;
}
function tracedRoute(t,index){const key='3|'+t.id+'|'+index;if(cache.has(key))return cache.get(key);const l=layout(t,3),L=course(t),span=(l.exit-l.entry)*L,center=.36+index*.28/9,half=Math.min(.025,28/span),points=[];let length=0,stop=0,detach=0,limitStart=0,limitEnd=0,mergeStart=0;
 const ease=u=>u*u*(3-2*u),depth=u=>u<.3?16+84*ease(u/.3):u<.7?100:u<.9?100-56*ease((u-.7)/.2):44-28*ease((u-.9)/.1);
 const samples=new Set(Array.from({length:513},(_,k)=>k/512));for(const u of [center,.3,.7,.9])samples.add(u);
 for(const u of [...samples].sort((a,b)=>a-b)){const bulge=Math.abs(u-center)<half?(30+index%2*20)*(1+Math.cos((u-center)/half*Math.PI))/2:0,p=G.lanePoint(l.entry+(l.exit-l.entry)*u,t,-depth(u)-bulge),prev=points.at(-1);if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,s:length,track:(l.entry+(l.exit-l.entry)*u)*L});if(!detach&&depth(u)>=31)detach=length;if(u===center)stop=length;if(u===.3)limitStart=length;if(u===.7)limitEnd=length;if(u===.9)mergeStart=length;}
 const result={...l,points,length,stop,detach,limitStart,limitEnd,mergeStart,index,version:3};cache.set(key,result);return result;
}
function route(t,index=0,version=t.legacyGeometry!==false?3:VERSION){
 if(version===4)return sharedRoute(t,index);
 t={...t,legacyGeometry:true};
 if(t.outline)return tracedRoute(t,index);
 if(version===1)return legacyRoute(t,index);if(version===2)return previousRoute(t,index,2);
 if(t.pitCompact)return compactRoute(t,index);
 const key='3|'+t.id+'|'+index;if(cache.has(key))return cache.get(key);
 const l=layout(t,3),S=t.straight,R=t.radius,L=course(t),inner=R-44,x=l.extent*.80-index*l.extent*1.60/9,points=[];let length=0;
 const add=(p,track)=>{const prev=points.at(-1);if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,s:length,track});};
 const curve=(a,b,c,d,start,end)=>{if(!points.length)add(a,start);for(let i=1;i<=128;i++){const u=i/128,v=1-u;add({x:v*v*v*a.x+3*v*v*u*b.x+3*v*u*u*c.x+u*u*u*d.x,y:v*v*v*a.y+3*v*v*u*b.y+3*v*u*u*c.y+u*u*u*d.y},start+(end-start)*u);}};
 const line=(p,track)=>add(p,track),right=a=>({x:S/2+Math.sin(a)*inner,y:-Math.cos(a)*inner}),left=a=>({x:-S/2-Math.sin(a)*inner,y:Math.cos(a)*inner});
 // The access branches off on the left curve, then follows the entire top
 // straight and the right curve before the service road. Even fast cars can
 // brake fully after leaving the racing surface.
 add(l.entryPoint,l.entry*L);for(let i=1;i<=64;i++){const u=i/64,q=Math.min(1,u/.6),depth=16+28*q*q*(3-2*q),a=1+(Math.PI-1)*u;add({x:-S/2-Math.sin(a)*(R-depth),y:Math.cos(a)*(R-depth),depth},2*S+Math.PI*R+a*R);}
 const detach=points.find(p=>p.depth>=31).s;
 line({x:S/2,y:-inner},L+S);
 for(let i=1;i<=64;i++){const a=1.4*i/64;add(right(a),L+S+a*R);}
 const a=right(1.4),roadStart={x:l.extent+5,y:l.y},bend=Math.max(28,(l.y-a.y)*.5);curve(a,{x:a.x+Math.cos(1.4)*bend,y:a.y+Math.sin(1.4)*bend},{x:roadStart.x+bend*.7,y:roadStart.y},roadStart,L+S+1.4*R,L+S+Math.PI*R);const limitStart=length;
 // Every team keeps its own service bay and rejoins the shared road.
 const firstTrack=points.at(-1).track,lastTrack=L+2*S+Math.PI*R+.70*R,roadSpan=2*(l.extent+5),trackAt=px=>firstTrack+(lastTrack-firstTrack)*(l.extent+5-px)/roadSpan;
 line({x:x+28,y:l.y},trackAt(x+28));const startTrack=points.at(-1).track;
 curve(points.at(-1),{x:x+15,y:l.y},{x:x+14,y:l.bayY},{x,y:l.bayY},startTrack,trackAt(x));const stop=length;
 curve(points.at(-1),{x:x-14,y:l.bayY},{x:x-15,y:l.y},{x:x-28,y:l.y},trackAt(x),trackAt(x-28));line({x:-l.extent-5,y:l.y},lastTrack);const limitEnd=length;
 const z=left(1.7),exitBend=Math.max(28,(l.y-z.y)*.5);curve(points.at(-1),{x:-l.extent-5-exitBend*.7,y:l.y},{x:z.x-Math.cos(Math.PI+1.7)*exitBend,y:z.y-Math.sin(Math.PI+1.7)*exitBend},z,lastTrack,L+2*S+Math.PI*R+1.7*R);
 for(let i=1;i<=64;i++){const a=1.7+(Math.PI-1.7)*i/64;add(left(a),L+2*S+Math.PI*R+a*R);}
 line({x:-S/2+S*.02,y:-inner},2*L+S*.02);const mergeStart=length;
 curve(points.at(-1),{x:-S/2+S*.14,y:-inner},{x:l.exitPoint.x-S*.12,y:l.exitPoint.y},l.exitPoint,2*L+S*.02,l.exit*L);
 const result={points,length,stop,index,version:3,detach,limitStart,limitEnd,mergeStart,...l};cache.set(key,result);return result;
}

// One shared road, with the free-flow lane on the left and service on its right.
// Only the short lateral manoeuvre at an assigned bay differs between entries.
function sharedLayout(t){const L=course(t),d=G.dimensions(t),entry=t.outline?G.shape(t).pitEntry:t.pitCompact?.08-1000/L:d.straight*.04/L,exit=t.outline?G.shape(t).pitExit:t.pitCompact?.08+1000/L:d.straight*.96/L,span=(exit-entry)*L,p=G.lanePoint((entry+exit)/2,t,-92);return{entry,exit,span,centerX:p.x,y:p.y,bayY:p.y,extent:span*.16,entryPoint:G.lanePoint(entry,t,-16),exitPoint:G.lanePoint(exit,t,-16),version:4};}
function sharedRoute(t,index=0){const k='4|'+G.key(t)+'|'+index;if(cache.has(k))return cache.get(k);const l=sharedLayout(t),L=course(t),center=.38+index*.24/9,half=.022,points=[],road=[];let length=0,stop=0,detach=0,limitStart=0,limitEnd=0,mergeStart=0;
 const ease=u=>{u=clamp(u,0,1);return u*u*u*(10+u*(-15+6*u));},depth=u=>u<.30?16+64*ease(u/.30):u<.72?80:u<.92?80-36*ease((u-.72)/.20):44-28*ease((u-.92)/.08);
 const fractions=new Set(Array.from({length:601},(_,i)=>i/600));for(const u of [center,center-half,center+half,.30,.72,.92])fractions.add(u);
 for(const u of [...fractions].sort((a,b)=>a-b)){const f=l.entry+(l.exit-l.entry)*u,shift=Math.abs(u-center)<half?24*ease(1-Math.abs(u-center)/half):0,p=G.lanePoint(f,t,-depth(u)-shift),prev=points.at(-1);if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,s:length,track:f*L,u});road.push({...G.lanePoint(f,t,-depth(u)-12),u});if(!detach&&depth(u)>=36)detach=length;if(u===center)stop=length;if(u===.30)limitStart=length;if(u===.72)limitEnd=length;if(u===.92)mergeStart=length;}
 const result={...l,points,road,length,stop,detach,limitStart,limitEnd,mergeStart,index,version:4};cache.set(k,result);return result;
}

function sample(r,s){s=clamp(s,0,r.length);let lo=1,hi=r.points.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(r.points[mid].s<s)lo=mid+1;else hi=mid;}const a=r.points[lo-1],b=r.points[lo],u=(s-a.s)/Math.max(1e-8,b.s-a.s);return{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,a:Math.atan2(b.y-a.y,b.x-a.x),track:r.version>=2?a.track+(b.track-a.track)*u:undefined};}
function visitRoute(e,t,index=e.pitVisit.index){return route(t,index,e.pitVisit.version||1);}
function point(e,t,index){const v=e.pitVisit;if(v?.version>=2&&v.phase==='merge'){const p=G.lanePoint(e.distance/t.km,t,e.traffic.lane);if(v.version>=3)p.a+=clamp(Math.atan2(-e.traffic.lateralSpeed,Math.max(1,e.traffic.speed/3600*course(t)/t.km)),-.24,.24);return p;}return v&&v.phase!=='queued'?sample(visitRoute(e,t,index),v.progress):G.lanePoint(e.distance/t.km,t,e.traffic?.lane||0);}
function request(e,t,index,emergency=false){const r=route(t,index),lap=Math.floor(e.distance/t.km),gate=(lap+r.entry)*t.km;return{phase:'queued',progress:0,entryDistance:gate>e.distance+1e-8?gate:gate+t.km,index,emergency,version:r.version};}
function distance(e,t){const v=e.pitVisit,r=visitRoute(e,t);if(v.version>=2&&v.phase==='merge')return v.entryDistance+(sample(r,r.mergeStart).track/course(t)-r.entry)*t.km+v.mergeTravel;return v.entryDistance+(r.version>=2?(sample(r,v.progress).track/course(t)-r.entry):(r.exit-r.entry)*v.progress/r.length)*t.km;}
function entryFree(e,t,entries){const p=visitRoute(e,t).entryPoint;for(const other of entries){if(other===e||other.status!=='pit'||!other.pitVisit||other.pitVisit.phase==='queued')continue;const q=point(other,t,other.pitVisit.index),dx=q.x-p.x,dy=q.y-p.y;if(Math.abs(dx*Math.cos(p.a)+dy*Math.sin(p.a))<27&&Math.abs(-dx*Math.sin(p.a)+dy*Math.cos(p.a))<11)return false;}return true;}
function speedLimit(e,t){const r=visitRoute(e,t),v=e.pitVisit;return r.version===1||v.phase==='service'||v.progress>=r.limitStart&&v.progress<=r.limitEnd?LIMIT:Speed.ceiling(e);}
// After the acceleration road, continue along a separate inner lane until
// the moving car can join. There is no fixed end at which it must stop.
function beginMerge(e,t){const v=e.pitVisit,r=visitRoute(e,t);v.progress=r.mergeStart;v.phase='merge';v.mergeTravel=0;e.distance=distance(e,t);e.traffic.lane=e.traffic.targetLane=-44;e.traffic.rejoining=true;e.traffic.mode='rejoin';}
function step(e,t,dt,cap,entries,goal=LIMIT){
 const v=e.pitVisit,r=visitRoute(e,t),tr=e.traffic;if(v.phase==='queued'||v.phase==='service'||v.phase==='merge')return;
 // New high-speed cars need a longer sporting distance in the access road.
 // Freeze its conversion at detachment, so braking remains continuous and saved
 // progress resumes on the same road. No slowdown occupies a racing lane.
 const baseK=r.version===4?Math.min(course(t)/t.km,r.length/.65):t.outline?(r.exit-r.entry)*course(t)*.35:course(t)/t.km;
 if(e.speedModel===2&&v.speedScale===undefined){const room=Math.max(1,r.limitStart-r.detach)*.65;v.speedScale=Math.min(1,room*2*cap.brake*3600/(baseK*Math.max(1,tr.speed**2-LIMIT**2)));}
 const K=baseK*(v.phase==='entry'||r.version===4?(v.speedScale??1):1);
 const stop=v.phase==='entry'?r.stop:r.version>=2?r.mergeStart:r.length,left=stop-v.progress,brake=cap.brake/3600*K;let target;
 if(r.version===1)target=Math.min(LIMIT,Math.sqrt(Math.max(0,2*brake*left))*3600/K);
 else if(v.phase==='entry'){
  const untilLimit=Math.max(0,r.limitStart-v.progress-tr.speed/3600*K*dt),limit=Math.sqrt((LIMIT/3600*K)**2+2*brake*untilLimit)*3600/K;
  target=v.progress<r.detach?Math.max(LIMIT,tr.speed):Math.min(limit,Math.sqrt(Math.max(0,2*brake*left))*3600/K);
 }else target=v.progress<r.limitEnd?LIMIT:Math.max(LIMIT,goal);
 const p=sample(r,v.progress);let room=Infinity;for(const other of entries){if(other===e||other.status!=='pit'||!other.pitVisit||(other.pitVisit.phase==='queued'||r.version<4&&other.pitVisit.phase==='service'))continue;const ahead=((other.distance-e.distance+t.km/2)%t.km+t.km)%t.km-t.km/2;if(ahead<-1e-8||Math.abs(ahead)<=1e-8&&other.id.localeCompare(e.id)>0)continue;const q=point(other,t,other.pitVisit.index),dx=p.x-q.x,dy=p.y-q.y,along=dx*Math.cos(p.a)+dy*Math.sin(p.a),lateral=-dx*Math.sin(p.a)+dy*Math.cos(p.a);if(along<=0&&along>-(r.version===4?Math.max(70,tr.speed/3600*K*(tr.speed/cap.brake+1)):40)&&Math.abs(lateral)<(r.version===4?14:11)){target=Math.min(target,r.version===4?Math.sqrt((other.traffic.speed/3600*K)**2+2*brake*Math.max(0,-along-29))*3600/K:Math.max(0,(-along-27))*3);room=Math.min(room,Math.max(0,-along-27));}}
 const old=tr.speed,ceiling=r.version===1?LIMIT:Speed.ceiling(e);tr.speed=clamp(old+clamp(target-old,-cap.brake*dt,cap.accel*dt),0,ceiling);const planned=(old+tr.speed)*.5/3600*K*dt,travel=Math.min(left,planned,room);if(travel+1e-8<Math.min(left,planned))tr.speed=0;v.progress+=travel;e.distance=distance(e,t);tr.braking=tr.speed<old-.05;tr.lateralSpeed=0;tr.mode=v.phase==='entry'?'pit-entry':'pit-exit';
 if(left-travel<.08){v.progress=stop;e.distance=distance(e,t);tr.braking=false;if(v.phase==='entry'){tr.speed=0;v.phase='service';tr.mode='pit-service';}else if(r.version>=2)beginMerge(e,t);else{tr.speed=0;v.phase='merge';tr.mode='rejoin';tr.rejoining=true;}}
}
function migrate(r,t){r.entries.forEach((e,i)=>{if(e.pitVisit!==undefined)return;e.pitVisit=null;if(e.status!=='pit')return;const path=route(t,i,1),merge=e.traffic.rejoining,progress=merge?path.length:path.stop;e.pitVisit={phase:merge?'merge':'service',progress,entryDistance:e.distance-(path.exit-path.entry)*t.km*progress/path.length,index:i,emergency:false};e.traffic.speed=0;});}
function validate(e,t,index){const v=e.pitVisit;if(v==null){if(e.status==='pit')throw Error('Recorrido de boxes ausente.');return;}if(t.outline&&![3,4].includes(v.version))throw Error('Versión de boxes inválida para este circuito.');const r=visitRoute(e,t,index),num=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b;if(v.speedScale!==undefined&&(e.speedModel!==2||!num(v.speedScale,1e-8,1)))throw Error('Escala de acceso a boxes inválida.');if(!(v.version===undefined||v.version===2||v.version===3||v.version===4)||!['queued','entry','service','exit','merge'].includes(v.phase)||v.index!==index||!num(v.progress,0,r.length+.000001)||!num(v.entryDistance,-t.km,1e8)||typeof v.emergency!=='boolean'||v.phase==='queued'&&e.status!=='running'&&e.status!=='finished'&&e.status!=='dnf'||v.phase!=='queued'&&e.status==='running'||v.phase==='service'&&Math.abs(v.progress-r.stop)>.00001||v.phase==='merge'&&Math.abs(v.progress-(r.version>=2?r.mergeStart:r.length))>.00001||v.phase==='merge'&&r.version>=2&&(!num(v.mergeTravel,0,1e8)||!num(e.traffic.lane,-44,-16)||![-44,-16].includes(e.traffic.targetLane))||v.phase==='entry'&&v.progress>r.stop+.00001||v.phase==='exit'&&v.progress<r.stop-.00001||v.phase==='queued'&&v.progress!==0||v.phase!=='queued'&&Math.abs(distance(e,t)-e.distance)>.000001||v.phase==='service'&&(e.traffic.speed!==0||e.pitRemaining<=0)||v.phase==='merge'&&(!e.traffic.rejoining&&e.status!=='dnf'||r.version===1&&e.traffic.speed!==0))throw Error('Recorrido de boxes inválido.');}
const api={LIMIT,VERSION,layout,route,visitRoute,sample,point,request,distance,entryFree,speedLimit,beginMerge,step,migrate,validate};root.OvalPitLane=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
