(function(root){
'use strict';
const F=root.GalponRaceFormat||(typeof require==='function'?require('./race-format'):null);
const profiles=[
 {id:'ahorro',name:'Ahorro · una parada',stops:1,pace:-10,fuelAt:10,tyresAt:12,swapAt:85},
 {id:'equilibrada',name:'Equilibrada · dos paradas',stops:2,pace:0,fuelAt:20,tyresAt:28,swapAt:78},
 {id:'ataque',name:'Ataque · tres paradas',stops:3,pace:8,fuelAt:30,tyresAt:40,swapAt:70},
 {id:'adaptativa',name:'Adaptativa',stops:2,pace:-4,fuelAt:25,tyresAt:32,swapAt:75}
];
const profile=id=>profiles.find(p=>p.id===id);
function initialize(r,t){if(r.fieldVersion!==2)return;r.strategyModel=1;for(const [i,e]of r.entries.slice(1).entries()){const p=profiles[(i+r.tier)%profiles.length];e.rivalStrategy={id:p.id,targetStops:p.id==='adaptativa'&&t.km>10?1:p.stops};}}
function settings(e){return e.rivalStrategy?{...profile(e.rivalStrategy.id),repair:true}:{fuelAt:20,tyresAt:24,swapAt:80,repair:true};}
function pace(e){if(!e.rivalStrategy)return e.fuel<8?-10:0;const p=e.rivalStrategy?profile(e.rivalStrategy.id).pace:0;return e.tyres<10?Math.min(p,-18):e.fuel<8?Math.min(p,-10):p;}
function due(r,e){const p=e.rivalStrategy;if(!p||e.stops>=p.targetStops||e.pitVisit||e.status!=='running')return false;const progress=r.targetLaps===undefined?r.time/r.duration:e.distance/(r.targetLaps*requireTrackKm(r));return progress>=(e.stops+1)/(p.targetStops+1)&&F.remainingLaps(r,e)>0;}
function requireTrackKm(r){const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null);return C.track(r.track).km;}
function label(e){return e.rivalStrategy?profile(e.rivalStrategy.id).name+' · '+e.stops+'/'+e.rivalStrategy.targetStops+' paradas': 'Plan anterior';}
function validate(r){if(r.strategyModel===undefined){if(r.fieldVersion===2)throw Error('Estrategias rivales ausentes.');return;}if(r.strategyModel!==1||r.fieldVersion!==2)throw Error('Estrategias rivales inválidas.');for(const e of r.entries){const p=e.rivalStrategy;if(e.id==='player'){if(p!==undefined)throw Error('Estrategia del jugador inválida.');continue;}if(!p||!profile(p.id)||!Number.isInteger(p.targetStops)||p.targetStops<1||p.targetStops>3||Object.keys(p).length!==2)throw Error('Estrategia rival inválida.');}}
const api={profiles,profile,initialize,settings,pace,due,label,validate};root.GalponRaceStrategies=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
