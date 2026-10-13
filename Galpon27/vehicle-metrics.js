(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null),T=root.OvalTraffic||(typeof require==='function'?require('./traffic'):null),M=root.OvalTelemetry||(typeof require==='function'?require('./telemetry'):null);
const fields=[
 {id:'speed',name:'Velocidad máxima',unit:'km/h',digits:1},
 {id:'acceleration',name:'Aceleración 0–100',unit:'s',digits:2,lower:true},
 {id:'braking',name:'Frenado 100–0',unit:'m',digits:1,lower:true},
 {id:'grip',name:'Agarre',unit:'índice',digits:1},
 {id:'cooling',name:'Refrigeración',unit:'% / min',digits:1},
 {id:'range',name:'Autonomía',unit:'km',digits:1},
 {id:'handling',name:'Manejo',unit:'índice',digits:1},
 {id:'reliability',name:'Fiabilidad',unit:'índice',digits:1}
];
// All cars use the same driver, fuel load and reference circuit on the bench.
// Acceleration/braking derive from the very same limits used by race traffic.
function measure(car,E){
 const track=C.tracks[0],entry={car,drivers:[{skill:75,care:75,stamina:100}],driverIndex:0,fatigue:0,tyres:car.parts.tyres.condition,damage:0};
 const cap=T.capabilities(entry,0),st=E.stats(car),p=E.performance(car,track,entry.drivers[0],0,20,0,entry.tyres,0,2);
 const durability=C.slots.reduce((n,slot)=>{const part=car.parts[slot.id],spec=C.part(part.id);return n+spec.durability*(.45+.55*part.condition/100);},0)/C.slots.length;
 return {speed:st.topSpeed,acceleration:100/cap.accel,braking:(100/3.6)**2/(2*cap.brake/3.6),grip:cap.grip*100,
  cooling:(1-(1-M.coolingRate(car,true))**60)*100,range:st.tank/Math.max(.001,p.burn/track.km),
  handling:cap.laneRate*20*Math.max(.5,p.grip/st.grip),reliability:durability*100*(.65+.35*car.chassis/100)};
}
function changes(before,after){return fields.map(f=>({...f,before:before[f.id],after:after[f.id],gain:(f.lower?before[f.id]/after[f.id]:after[f.id]/before[f.id])-1}));}
const api={fields,measure,changes};root.GalponVehicleMetrics=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
