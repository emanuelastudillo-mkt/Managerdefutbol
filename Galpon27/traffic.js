(function(root){
'use strict';
const Corner=root.GalponCornering||(typeof require==='function'?require('./cornering'):null);
const Speed=root.GalponVehicleSpeed||(typeof require==='function'?require('./vehicle-speed'):null);
const G=root.OvalRaceGeometry||(typeof require==='function'?require('./race-geometry'):null);
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog.js'):null);
const M=root.OvalTelemetry||(typeof require==='function'?require('./telemetry.js'):null);
const P=root.OvalPitLane||(typeof require==='function'?require('./pit-lane.js'):null);
const D=root.OvalDynamics||(typeof require==='function'?require('./race-dynamics.js'):null);
const B=root.GalponVehicleBody||(typeof require==='function'?require('./vehicle-body'):null);
const LANES=[-16,0,16],LENGTH=26,WIDTH=11,DT=.2,RECOVERY_SECONDS=12;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const course=t=>G.course(t);
const signed=(d,L)=>((d+L/2)%L+L)%L-L/2;
function initialLane(i){return LANES[[1,0,2][i%3]];}
function initialize(r,grid=false){const t=G.raceTrack(r,C.track(r.track)),K=course(t)/t.km;r.traffic={version:1,contacts:0,passes:0,avoids:0};r.entries.forEach((e,i)=>{const slot=r.grid?r.grid.findIndex(row=>row.id===e.id):i,lane=r.grid?0:initialLane(i);if(grid)e.distance=slot===0?0:-(r.grid?slot:Math.floor(slot/3))*34/K;e.traffic={lane,targetLane:lane,speed:0,lateralSpeed:0,mode:'clear',braking:false,blockedBy:null,gap:null,cooldown:0,contactCooldown:0,contacts:0,passes:0,avoids:0,brakeTime:0,rejoining:false};});D.attach(r);}
function capabilities(e,pace='balanced',gripScale=1){
 const driver=e.drivers[e.driverIndex],car=e.car,part=slot=>{const p=car.parts[slot],s=C.part(p.id);return s.factor*(.45+.55*p.condition/100);};
 const tyre=C.part(car.parts.tyres.id),grip=clamp(tyre.grip*(.55+.45*M.tyreHealth(e)/100)*M.thermalGrip(e)*gripScale*(.86+.14*part('suspension')),.25,1.8),focus=clamp((driver.skill*.65+driver.care*.35-e.fatigue*.28)/100,.1,1),bias=Math.abs(car.setup.bias-57)/100;
 const intent=D.pace(pace).value/30;return{reaction:clamp(.85-focus*.55+e.fatigue*.002+intent*.16,.20,1.2),brake:clamp((12+part('brakes')*18)*grip*(1-bias*.4),7,70),accel:clamp(9+part('engine')*4+part('gearbox')*2,8,24),laneRate:clamp((2+focus*3)*grip*(.88+.12*part('suspension'))*(.95+.05*part('aero')),1,8),margin:6-intent*3.5,focus,grip};
}
function gap(a,b,K,L){return signed((b.distance-a.distance)*K,L);}
function isCleared(e){return e.status==='dnf'&&(e.traffic?.retiredFor||0)>=RECOVERY_SECONDS;}
function onTrack(e){return e.status==='running'||rollingMerge(e)||e.status==='dnf'&&!isCleared(e)&&(!e.pitVisit||e.pitVisit.phase==='queued');}
function rollingMerge(e){return e.status==='pit'&&e.pitVisit?.version>=2&&e.pitVisit.phase==='merge';}
function corridor(e){const target=e.status==='dnf'?e.traffic.lane:e.traffic.targetLane;return[Math.min(e.traffic.lane,target)-WIDTH/2,Math.max(e.traffic.lane,target)+WIDTH/2];}
function blocksLane(other,lane){const c=corridor(other);return lane+WIDTH/2>c[0]&&lane-WIDTH/2<c[1];}
function nearest(e,entries,K,L,t=null){let lead=null,best=Infinity;const c=corridor(e);for(const other of entries){if(other===e||!onTrack(other))continue;const oc=corridor(other);if(c[1]<=oc[0]||c[0]>=oc[1])continue;const d=gap(e,other,K,L);if(d>0&&d<best){best=d;lead=other;}}return{lead,distance:best};}
function laneFree(e,target,entries,K,L,t=null){const lo=Math.min(e.traffic.lane,target)-WIDTH/2,hi=Math.max(e.traffic.lane,target)+WIDTH/2;for(const other of entries){if(other===e||!onTrack(other))continue;const oc=corridor(other);if(hi<=oc[0]||lo>=oc[1])continue;const destination=blocksLane(other,target),d=gap(e,other,K,L),pitApproach=t?.outline&&t.km<=1&&e.pitVisit?.phase==='queued'&&e.pitVisit.version>=2,cap=pitApproach?capabilities(e):null,horizon=pitApproach?Math.max(.9,Math.abs(target-e.traffic.lane)/cap.laneRate):.9,frontSpeed=pitApproach?Math.max(0,e.traffic.speed-other.traffic.speed):e.traffic.speed,rearSpeed=pitApproach?Math.max(0,other.traffic.speed-e.traffic.speed):other.traffic.speed,forward=destination?LENGTH+Math.max(10,frontSpeed/3600*K*horizon):LENGTH+2,rear=destination?LENGTH+Math.max(12,rearSpeed/3600*K*(pitApproach?horizon:.8)):LENGTH+2;if(d>=0&&d<forward||d<0&&-d<rear)return false;}return true;}
// A moving car joins with a gap based on closing speed. Saved stops from
// earlier versions retain the braking distance to a stationary car.
function mergeFree(e,entries,K,L,goals=new Map()){
 const rolling=e.pitVisit?.version>=2;if(!rolling&&!laneFree(e,-16,entries,K,L))return false;
 const speed=e.traffic.speed;
 for(const other of entries){if(other===e||!onTrack(other)||!blocksLane(other,-16))continue;
  const d=gap(e,other,K,L),follower=d<0?other:e,cap=capabilities(follower,goals.get(follower.id)?.pace,goals.get(follower.id)?.gripScale||1);
  const closing=(d<0?Math.max(0,other.traffic.speed-speed):Math.max(0,speed-other.traffic.speed))/3600*K,brake=cap.brake/3600*K;
  const margin=Math.min(cap.margin,Math.max(1,Math.min(speed,other.traffic.speed)*.02));
  const safe=rolling?LENGTH+margin+closing*(cap.reaction+DT)+closing*closing/(2*brake):LENGTH+cap.margin+other.traffic.speed/3600*K*(cap.reaction+DT)+(other.traffic.speed/3600*K)**2/(2*brake);
  if((rolling||d<0)&&Math.abs(d)<safe)return false;
 }
 return true;
}
function contact(r,a,b,closing,penetration,events){const severity=1;if(a.traffic.contactCooldown<=0&&b.traffic.contactCooldown<=0){r.traffic.contacts++;a.traffic.contacts++;b.traffic.contacts++;for(const [e,factor] of [[a,1],[b,1]]){const panel=Math.abs(a.traffic.lane-b.traffic.lane)>4?(e.traffic.lane< (e===a?b:a).traffic.lane?'left':'right'):(e===a?'front':'rear');M.hit(e,severity*factor,panel);M.contactTyres(e,severity*.26*factor,panel);e.car.parts.aero.condition=Math.max(0,e.car.parts.aero.condition-severity*.30*factor);e.car.parts.suspension.condition=Math.max(0,e.car.parts.suspension.condition-severity*.12*factor);e.traffic.speed*=1-clamp(severity*.006,.02,.18);}events.push({type:'contact',a:a.id,b:b.id,severity});}
 a.traffic.contactCooldown=Math.max(a.traffic.contactCooldown,.9);b.traffic.contactCooldown=Math.max(b.traffic.contactCooldown,.9);a.traffic.mode=b.traffic.mode='contact';
}
function defend(r,list,K,L,events){if(r.config?.storyDifficulty!=='superpro')return;for(const e of list){const tr=e.traffic;if(e.id==='player'||e.status!=='running'||e.pitVisit||e.parade||tr.speed<55||tr.battleId!==null||tr.cooldown>0||Math.abs(tr.lane-tr.targetLane)>.2)continue;const rear=list.filter(o=>o!==e&&o.status==='running'&&!o.pitVisit&&!o.parade&&o.traffic.speed>=tr.speed-8).map(o=>({e:o,d:gap(o,e,K,L)})).filter(o=>o.d>32&&o.d<110).sort((a,b)=>a.d-b.d)[0];if(!rear)continue;const target=LANES.find(lane=>Math.abs(lane-rear.e.traffic.targetLane)<.1);if(target===undefined||target===tr.targetLane||Math.abs(target-tr.lane)>16.1)continue;const lo=Math.min(tr.lane,target)-WIDTH/2,hi=Math.max(tr.lane,target)+WIDTH/2;if(list.some(o=>o!==e&&onTrack(o)&&Math.abs(gap(e,o,K,L))<LENGTH+6&&corridor(o)[1]>lo&&corridor(o)[0]<hi))continue;tr.targetLane=target;tr.cooldown=4;events.push({type:'block',a:e.id,b:rear.e.id});}}
function step(r,goals,seconds=1){const t=G.raceTrack(r,C.track(r.track)),L=course(t),K=L/t.km,events=[],start=new Map(r.entries.map(e=>[e.id,e.distance]));if(!r.traffic)initialize(r,false);
 const list=r.entries,profiles=new Map(list.filter(e=>e.status==='running'||rollingMerge(e)).map(e=>[e.id,capabilities(e,goals.get(e.id)?.pace,goals.get(e.id)?.gripScale||1)]));
 const corners=r.circuitModel===2?new Map(list.filter(e=>profiles.has(e.id)).map(e=>[e.id,Corner.limits(e,t,profiles.get(e.id))])):null;
 for(let tick=0;tick<Math.round(seconds/DT);tick++){
  // Pit exit is an actual merge: wait off the racing surface until a gap exists.
  for(const e of list){const tr=e.traffic,v=e.pitVisit;if(e.telemetry?.impacts){for(const [panel,hit]of Object.entries(e.telemetry.impacts)){hit.remaining=Math.max(0,hit.remaining-DT);if(hit.remaining===0)delete e.telemetry.impacts[panel];}if(!Object.keys(e.telemetry.impacts).length)delete e.telemetry.impacts;}if(e.telemetry)e.telemetry.rubCooldown=Math.max(0,e.telemetry.rubCooldown-DT);tr.cooldown=Math.max(0,tr.cooldown-DT);tr.contactCooldown=Math.max(0,tr.contactCooldown-DT);if(tr.rejoining){tr.mode='rejoin';if(rollingMerge(e)){if(tr.targetLane===-44&&mergeFree(e,list,K,L,goals))tr.targetLane=-16;if(Math.abs(tr.lane+16)<.2){tr.lane=tr.targetLane=-16;tr.rejoining=false;e.status='running';e.pitVisit=null;profiles.set(e.id,capabilities(e,goals.get(e.id)?.pace,goals.get(e.id)?.gripScale||1));}}else{tr.lane=tr.targetLane=-16;tr.speed=0;if(mergeFree(e,list,K,L,goals)){tr.rejoining=false;e.status='running';tr.mode='clear';e.pitVisit=null;profiles.set(e.id,capabilities(e,goals.get(e.id)?.pace,goals.get(e.id)?.gripScale||1));}}}if(e.status==='pit'){if(v)P.step(e,t,DT,capabilities(e),list,goals.get(e.id)?.speed||P.LIMIT);else tr.speed=0;if(!v||v.phase==='service'||v.phase==='merge')tr.braking=false;}if(e.status==='dnf'){tr.speed=0;tr.lateralSpeed=0;tr.braking=false;tr.mode='retired';const wasCleared=isCleared(e);const elapsed=(tr.retiredFor||0)+DT;tr.retiredFor=elapsed>=RECOVERY_SECONDS-1e-8?RECOVERY_SECONDS:elapsed;if(!wasCleared&&isCleared(e))events.push({type:'retired-clear',a:e.id});}}
  defend(r,list,K,L,events);
  const dynamics={K,L,gap,events,capabilities,contact};D.prepare(r,goals,DT,dynamics);
  const before=new Map(list.map(e=>[e.id,{distance:e.distance,lane:e.traffic.lane}]));
  // Front-to-back decisions reserve the entire lane-change corridor, preventing swaps.
  const ordered=list.filter(e=>e.status==='running'||rollingMerge(e)).sort((a,b)=>b.distance-a.distance||a.id.localeCompare(b.id));
  for(const e of ordered){const tr=e.traffic,p=profiles.get(e.id)||capabilities(e),visit=e.pitVisit,battle=D.control(e,r,goals,dynamics);let goal=clamp(battle?.speed??(goals.get(e.id)?.speed||0)*(1+tr.draftBonus),0,Speed.ceiling(e));if(visit?.phase==='queued'){const left=(visit.entryDistance-e.distance)*K;if(laneFree(e,-16,list,K,L,t))tr.targetLane=-16;if(visit.version<2||visit.version===undefined){const allowed=Math.sqrt(P.LIMIT*P.LIMIT+2*p.brake*Math.max(0,left-tr.speed/3600*K)/K*3600);goal=Math.min(goal||P.LIMIT,allowed);if(visit.emergency)goal=Math.min(goal,30);}}
   goal=Math.min(goal,goals.get(e.id)?.fuelCruise??Infinity);
   const leadInfo=nearest(e,list,K,L,t);let {lead,distance}=leadInfo;
   if(!visit&&!battle&&lead&&distance<LENGTH+Math.max(55,tr.speed/3600*K*2)&&goal>lead.traffic.speed+2&&tr.cooldown<=0&&Math.abs(tr.lane-tr.targetLane)<.2){const options=LANES.filter(lane=>Math.abs(lane-tr.targetLane)<=16.1&&lane!==tr.targetLane).sort((a,b)=>Math.abs(a)-Math.abs(b)||a-b);for(const lane of options){const noGain=list.some(other=>other!==e&&onTrack(other)&&blocksLane(other,lane)&&gap(e,other,K,L)>0&&gap(e,other,K,L)<distance+LENGTH&&other.traffic.speed<=lead.traffic.speed+2);if(!noGain&&laneFree(e,lane,list,K,L,t)){tr.targetLane=lane;tr.cooldown=2.5+p.reaction;tr.avoids++;r.traffic.avoids++;events.push({type:'avoid',a:e.id,b:lead.id});break;}}}
   let desired=corners?Corner.target(e,t,p,goal,DT,corners.get(e.id)).speed:goal;tr.braking=corners?desired<tr.speed-.25:false;tr.blockedBy=null;tr.gap=null;
   if(lead){const v=tr.speed/3600*K,lv=lead.traffic.speed/3600*K,decel=p.brake/3600*K,safe=LENGTH+p.margin+v*p.reaction+Math.max(0,(v*v-lv*lv)/(2*decel));tr.gap=Math.max(0,(distance-LENGTH)/K*1000);
    if(distance<safe){const available=Math.max(0,distance-LENGTH-p.margin),reaction=decel*(p.reaction+DT),allowed=Math.max(0,Math.sqrt(reaction*reaction+lv*lv+2*decel*available)-reaction);desired=Math.min(desired,allowed*3600/K);tr.blockedBy=lead.id;tr.braking=desired<tr.speed-.25;}
   }
   const change=clamp(desired-tr.speed,-p.brake*DT,p.accel*DT);tr.speed=clamp(tr.speed+change,0,Speed.ceiling(e));const oldLane=tr.lane,shift=Math.min(p.laneRate,tr.speed/3600*K*.16)*DT;if(rollingMerge(e)&&visit.version>=3){const dx=tr.targetLane-tr.lane,limit=shift/DT,want=Math.sign(dx)*Math.min(limit,Math.sqrt(4*Math.abs(dx))),lateral=tr.lateralSpeed+clamp(want-tr.lateralSpeed,-2*DT,2*DT);tr.lane+=Math.sign(dx)*Math.min(Math.abs(dx),Math.max(0,Math.sign(dx)*lateral*DT));}else tr.lane+=clamp((battle?.lane??tr.targetLane)-tr.lane,-shift,shift);tr.lateralSpeed=(tr.lane-oldLane)/DT;
   if(tr.contactCooldown<=0)tr.mode=tr.braking?'braking':battle?'battle':Math.abs(tr.lane-tr.targetLane)>.1?'overtake':tr.blockedBy?'follow':tr.draftBonus>.002?'draft':'clear';if(tr.braking)tr.brakeTime+=DT;
  }
  for(const e of ordered){const v=e.pitVisit,travel=e.traffic.speed/3600*DT;e.distance+=travel;if(rollingMerge(e))v.mergeTravel+=travel;if(v?.phase==='queued'&&e.distance>=v.entryDistance){if(Math.abs(e.traffic.lane+16)<.25&&(v.version>=2||e.traffic.speed<=P.LIMIT+1)&&P.entryFree(e,t,list)){e.distance=v.entryDistance;e.traffic.lane=e.traffic.targetLane=-16;e.status='pit';v.phase='entry';e.traffic.mode='pit-entry';events.push({type:'pit-entry',a:e.id});}else v.entryDistance+=t.km;}}
  // A boosted car can traverse an entire body within a legacy 0.2 s step.
  // Preserve the order at the instant of contact instead of treating that
  // crossing as an overtake. Cars on separate bridge decks remain independent.
  if(r.speedModel===2&&list.some(e=>e.traffic.speed>360))for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
   let a=list[i],b=list[j];if(!onTrack(a)||!onTrack(b)||(t.overpass&&G.deck(a.distance/t.km,t)*G.deck(b.distance/t.km,t)===-1))continue;
   let old=signed((before.get(b.id).distance-before.get(a.id).distance)*K,L),now=gap(a,b,K,L);
   if(Math.abs(old)>L/4||Math.abs(now)>L/4||old===0||old*now>0)continue;
   const fraction=Math.abs(old)/(Math.abs(old)+Math.abs(now)||1),aa=before.get(a.id).lane+(a.traffic.lane-before.get(a.id).lane)*fraction,bb=before.get(b.id).lane+(b.traffic.lane-before.get(b.id).lane)*fraction;
   if(Math.abs(aa-bb)>=WIDTH)continue;if(old<0){[a,b]=[b,a];now=-now;}
   const correction=LENGTH-now;contact(r,a,b,Math.max(0,a.traffic.speed-b.traffic.speed),correction,events);a.distance-=correction/K;
   if(rollingMerge(a))a.pitVisit.mergeTravel=Math.max(0,a.pitVisit.mergeTravel-correction/K);
   a.traffic.speed=Math.min(a.traffic.speed,b.traffic.speed);a.traffic.braking=true;a.traffic.blockedBy=b.id;
  }
  // Bodies occupy the same space used by the renderer. Separation prevents tunnelling
  // and repairs any overlap carried in from an older save without allowing ghost passes.
  for(let pass=0;pass<list.length;pass++){let adjusted=false;for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){let a=list[i],b=list[j];if(!onTrack(a)||!onTrack(b)||Math.abs(a.traffic.lane-b.traffic.lane)>=WIDTH)continue;let d=gap(a,b,K,L);if(Math.abs(d)>=LENGTH-1e-7)continue;if(d<0||d===0&&a.id.localeCompare(b.id)<0){[a,b]=[b,a];d=-d;}const penetration=LENGTH-Math.abs(d),closing=Math.max(0,a.traffic.speed-b.traffic.speed);contact(r,a,b,closing,penetration,events);a.distance-=penetration/K;if(rollingMerge(a))a.pitVisit.mergeTravel=Math.max(0,a.pitVisit.mergeTravel-penetration/K);a.traffic.speed=Math.min(a.traffic.speed,b.traffic.speed);a.traffic.braking=true;a.traffic.blockedBy=b.id;adjusted=true;}if(!adjusted)break;}
  B.resolve(list,t,(a,b,depth)=>contact(r,a,b,Math.abs(a.traffic.speed-b.traffic.speed),depth,events));
  D.nearContacts(r,goals,DT,dynamics);
  // A narrow body-envelope graze requires a moving close pass, not mere proximity.
  for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){const a=list[i],b=list[j],lat=Math.abs(a.traffic.lane-b.traffic.lane),relative=Math.abs(a.traffic.speed-b.traffic.speed),lateral=Math.abs(a.traffic.lateralSpeed-b.traffic.lateralSpeed);if(!onTrack(a)||!onTrack(b)||!a.telemetry||!b.telemetry||lat<WIDTH||lat>WIDTH+2.6||Math.abs(gap(a,b,K,L))>LENGTH*.85||Math.max(a.traffic.speed,b.traffic.speed)<20||relative<5&&lateral<.5||a.telemetry.rubCooldown>0||b.telemetry.rubCooldown>0||a.traffic.contactCooldown>0||b.traffic.contactCooldown>0)continue;
   const severity=.25;for(const e of [a,b]){const driver=e.drivers[e.driverIndex],factor=.4+(100-driver.care)*.008+e.fatigue*.003;M.hit(e,severity,e.traffic.lane<(e===a?b:a).traffic.lane?'left':'right');e.car.parts.aero.condition=clamp(e.car.parts.aero.condition-severity*factor*.08,0,100);e.telemetry.rubs++;e.telemetry.rubCooldown=2.2;}events.push({type:'rub',a:a.id,b:b.id,severity});
  }
  for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){const a=list[i],b=list[j];if(!onTrack(a)||!onTrack(b))continue;const old= signed((before.get(b.id).distance-before.get(a.id).distance)*K,L),now=gap(a,b,K,L);if(Math.abs(old)>L/4||Math.abs(now)>L/4)continue;let winner,loser;if(old>0&&now<=0){winner=a;loser=b;}else if(old<0&&now>=0){winner=b;loser=a;}if(winner&&a.traffic.battleId===null&&b.traffic.battleId===null&&Math.abs(a.traffic.lane-b.traffic.lane)>=WIDTH){winner.traffic.passes++;r.traffic.passes++;events.push({type:'pass',a:winner.id,b:loser.id});}}
 }
 return{events,movement:new Map(list.map(e=>[e.id,Math.max(0,e.distance-start.get(e.id))]))};
}
const api={LANES,LENGTH,WIDTH,DT,RECOVERY_SECONDS,isCleared,course,signed,initialLane,initialize,capabilities,defend,gap,laneFree,mergeFree,step};root.OvalTraffic=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
