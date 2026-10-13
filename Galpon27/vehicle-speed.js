(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null);
// These reference parts are the healthy factory equipment fitted by makeCar.
// The reference never follows upgrades or damage on the player's actual car.
const referenceCache=new Map(),dialCache=new Map(),MAX_SPEED=1400,parts=new Map(C.parts.map(p=>[p.id,p]));
// Town shops extend the catalog after this module loads in the browser.
// Resolve newly registered IDs lazily, then retain the same fast cached lookup.
function part(id){let value=parts.get(id);if(!value){value=C.part(id);if(!value)throw Error('Repuesto desconocido: '+id);parts.set(id,value);}return value;}
const factor=(car,slot)=>{const p=car.parts[slot];return part(p.id).factor*(.72+.28*p.condition/100);};
function measures(car){const spec=C.car(car.id),f=slot=>factor(car,slot);return{
 power:Math.round(spec.power*f('engine')*(.91+.09*f('intake'))*(.95+.05*f('exhaust'))),
 mass:Math.round(spec.mass*(.95+.05*part(car.parts.exhaust.id).weight)),
 grip:part(car.parts.tyres.id).grip*(.91+.09*f('suspension'))*(.94+.06*f('differential')),
 efficiency:.96+.04*f('gearbox'),aero:part(car.parts.aero.id).factor*(.8+.2*car.parts.aero.condition/100)
};}
function factory(id){const spec=C.car(id);return{id,setup:{downforce:40,cooling:60},parts:Object.fromEntries(C.slots.map(s=>[s.id,{id:s.id+'-'+Math.min(4,spec.tier),condition:100}]))};}
function reference(id){if(!referenceCache.has(id))referenceCache.set(id,measures(factory(id)));return referenceCache.get(id);}
function drag(aero,setup){return 1+(setup.downforce/100)*.095/aero+(setup.cooling/100)*.03;}
function potential(car,stats=null){const spec=C.car(car.id),m=stats||measures(car),ref=reference(car.id),aero=m.aero??part(car.parts.aero.id).factor*(.8+.2*car.parts.aero.condition/100);
 return spec.baseSpeed*(75+Math.sqrt(m.power)*5.15)/(75+Math.sqrt(ref.power)*5.15)*m.efficiency/ref.efficiency*Math.pow(ref.mass/m.mass,.12)*drag(ref.aero,{downforce:40,cooling:60})/drag(aero,car.setup);
}
function legacyReference(id){const spec=C.car(id),v=reference(id);return(75+Math.sqrt(v.power)*5.15)*v.efficiency*(.82+.18*v.grip)*(1+(v.aero-1)*.045)/(spec.drag*drag(v.aero,{downforce:40,cooling:60}));}
function normalize(car){return C.car(car.id).baseSpeed/legacyReference(car.id);}
function ceiling(e){return e.speedModel===2?MAX_SPEED:360;}
function speedometer(tier,car=null){
 if(!dialCache.has(tier)){
  const fastest=Math.max(...C.cars.filter(c=>c.tier===tier).map(c=>c.baseSpeed));
  dialCache.set(tier,Math.ceil(fastest*1.51*1.20*1.065/60)*60);
 }
 // Freeze the scale from the starting configuration; wear never moves the ticks.
 const healthy=car?{...car,parts:Object.fromEntries(Object.entries(car.parts).map(([slot,p])=>[slot,{id:p.id,condition:100}]))}:null;
 return Math.max(dialCache.get(tier),healthy?Math.ceil(potential(healthy)*1.51*1.20*1.065/60)*60:0);
}
const api={MAX_SPEED,measures,reference,potential,normalize,ceiling,speedometer,factory};root.GalponVehicleSpeed=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
