(function(root){
'use strict';
const Speed=root.GalponVehicleSpeed||(typeof require==='function'?require('./vehicle-speed'):null);
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog.js'):null);
const D=root.OvalDynamics||(typeof require==='function'?require('./race-dynamics.js'):null);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const WHEELS=[['fl','Delantera izquierda'],['fr','Delantera derecha'],['rl','Trasera izquierda'],['rr','Trasera derecha']];
const PANELS=[['front','Frente'],['rear','Cola'],['left','Lateral izquierdo'],['right','Lateral derecho']];
const mean=values=>values.reduce((a,b)=>a+b,0)/values.length;
const gearCount=e=>[4,4,5,6,6][C.part(e.car.parts.gearbox.id).grade];
function initialize(e,t){e.telemetry={version:1,wheels:Object.fromEntries(WHEELS.map(([id])=>[id,{condition:e.tyres,temp:t.temp}])),body:Object.fromEntries(PANELS.map(([id])=>[id,clamp(e.car.chassis-e.damage*.3,0,100)])),coolant:t.temp,oil:t.temp,brakes:t.temp,rpm:0,gear:0,throttle:0,brake:0,speedPrev:e.traffic?.speed||0,burnRate:0,rubs:0,rubCooldown:0};}
function sync(e){e.tyres=mean(WHEELS.map(([id])=>e.telemetry.wheels[id].condition));}
function tyreHealth(e){if(!e.telemetry)return e.tyres;return .65*e.tyres+.35*Math.min(...WHEELS.map(([id])=>e.telemetry.wheels[id].condition));}
function thermalGrip(e){if(!e.telemetry)return 1;const temp=mean(WHEELS.map(([id])=>e.telemetry.wheels[id].temp));return clamp(1-Math.max(0,45-temp)*.0015-Math.max(0,temp-110)*.004,.72,1);}
function bodyHealth(e){return mean(Object.values(e.telemetry.body));}
function hit(e,severity,panel='front'){e.damage+=severity;if(!e.telemetry)return;e.telemetry.body[panel]=clamp(e.telemetry.body[panel]-severity*4,0,100);if(!e.telemetry.impacts)e.telemetry.impacts={};e.telemetry.impacts[panel]={remaining:.65,severity};}
function contactTyres(e,loss,panel){if(!e.telemetry){e.tyres=Math.max(0,e.tyres-loss);return;}const ids=panel==='left'?['fl','rl']:panel==='right'?['fr','rr']:panel==='rear'?['rl','rr']:['fl','fr'];for(const id of ids)e.telemetry.wheels[id].condition=clamp(e.telemetry.wheels[id].condition-loss*2,0,100);sync(e);}
function replaceTyres(e,t){for(const wheel of Object.values(e.telemetry.wheels)){wheel.condition=100;wheel.temp=t.temp;}sync(e);}
function repairBody(e,limit=Infinity){const before=e.damage,amount=Math.min(before,Math.max(0,limit)),fraction=before>0?amount/before:1;e.damage=Math.max(0,before-amount);for(const [id] of PANELS)e.telemetry.body[id]+=(e.car.chassis-e.telemetry.body[id])*fraction;return amount;}
function coolingRate(car,moving){const p=car.parts.cooling,f=C.part(p.id).factor*(.5+.5*p.condition/100),setup=.75+car.setup.cooling/120;return (moving?.018:.008)*clamp(f*setup,.35,2.5);}
function update(e,t,plan,travel=0){const m=e.telemetry;const tr=e.traffic,v=tr.speed,alive=e.status!=='dnf',moving=e.status==='running'||e.status==='pit'&&v>0,p=plan?.p,pace=plan?.pace??0,acc=v-m.speedPrev;
 const brake=moving&&tr.braking?clamp(-acc/30+.15,.15,1):0;
 const throttle=!alive?0:!moving?.06:brake?0:clamp(.48+acc/18+D.pace(pace).value*.005,.12,1);
 m.throttle=throttle;m.brake=brake;m.speedPrev=v;
 const ratioScale=(1+(50-e.car.setup.gearing)*.004)*(e.speedModel===2?200/C.car(e.car.id).baseSpeed:1),maxGear=gearCount(e),ratios=({4:[0,150,95,66,38],5:[0,150,95,66,49,33],6:[0,150,95,66,49,38,30]})[maxGear].map(x=>x*ratioScale);
 if(!alive){m.rpm=0;m.gear=0;}else if(!moving||v<2){m.rpm=900;m.gear=0;}else{let gear=clamp(m.gear,1,maxGear);while(gear<maxGear&&v*ratios[gear]>7400)gear++;while(gear>1&&v*ratios[gear]<3100)gear--;m.gear=gear;m.rpm=clamp(v*ratios[gear],900,9000);}
 const cooling=C.part(e.car.parts.cooling.id).factor*(.5+.5*e.car.parts.cooling.condition/100),target=!alive?t.temp:!moving?t.temp+42:clamp((p?.temp||t.temp+58)+(throttle-.55)*13+(1-cooling)*6, t.temp,155);
 m.coolant+=(target-m.coolant)*coolingRate(e.car,moving);m.oil+=((alive?m.coolant+10+throttle*7:t.temp)-m.oil)*.012;
 m.brakes+=((t.temp+v*.16+brake*260)-m.brakes)*.085;
 m.burnRate=p&&moving?p.burn/p.lap*(.2+.8*travel)*(1-(tr.draftBonus||0)*.65):0;
 if(moving&&p){const L=2*t.straight+2*Math.PI*t.radius,d=((e.distance/t.km%1+1)%1)*L,curve=d>=t.straight&&d<t.straight+Math.PI*t.radius||d>=2*t.straight+Math.PI*t.radius;
  const bias=(e.car.setup.bias-50)/100,base=p.wear/p.lap*travel,slip=1+Math.max(0,mean(Object.values(m.wheels).map(w=>w.temp))-110)*.006;
  for(const [id] of WHEELS){const front=id[0]==='f',outside=id[1]==='l',load=(curve?(outside?1.28:.72):1)*(front?1.06+bias*.4:.94-bias*.4),w=m.wheels[id];
   w.condition=clamp(w.condition-base*load*slip-brake*(front?.004:.002),0,100);
   const heat=t.temp+v*(e.speedModel===2?200/C.car(e.car.id).baseSpeed:1)*.30+(curve?(outside?12:3):0)+throttle*5+brake*(front?24:12)+Math.abs(e.car.setup.pressure-t.pressure)*.08;
   w.temp+=(heat-w.temp)*.04;
  }sync(e);
 }else for(const w of Object.values(m.wheels))w.temp+=(t.temp-w.temp)*.025;
}
function validate(e){const m=e.telemetry,number=(v,a,b)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
 if(!m||m.version!==1||!m.wheels||!m.body||!WHEELS.every(([id])=>m.wheels[id]&&number(m.wheels[id].condition,0,100)&&number(m.wheels[id].temp,-50,300))||!PANELS.every(([id])=>number(m.body[id],0,100))||!['coolant','oil','brakes'].every(id=>number(m[id],-50,500))||!number(m.rpm,0,9000)||!Number.isInteger(m.gear)||!number(m.gear,0,gearCount(e))||!number(m.throttle,0,1)||!number(m.brake,0,1)||!number(m.speedPrev,0,Speed.ceiling(e))||!number(m.burnRate,0,10)||!Number.isInteger(m.rubs)||!number(m.rubs,0,1e9)||!number(m.rubCooldown,0,10)||Math.abs(e.tyres-mean(WHEELS.map(([id])=>m.wheels[id].condition)))>1e-7)throw Error('Telemetría detallada inválida.');
}
const api={coolingRate,WHEELS,PANELS,initialize,sync,gearCount,tyreHealth,thermalGrip,bodyHealth,hit,contactTyres,replaceTyres,repairBody,update,validate};root.OvalTelemetry=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
