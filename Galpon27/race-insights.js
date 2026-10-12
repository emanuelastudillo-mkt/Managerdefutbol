(function(root){
'use strict';
const E=root.OvalEngine||(typeof require==='function'?require('./engine'):null),C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null),Q=root.GalponCareer||(typeof require==='function'?require('./career'):null);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Project steady running at the selected pace. A pit stop or a braking sample must
// never turn a zero instantaneous burn rate into a promise of unlimited range.
function fuelForecast(r){
 const e=r.entries.find(e=>e.id==='player'),p=E.performance(e.car,Q.raceTrack(r),e.drivers[e.driverIndex],r.pace,e.fuel,e.fatigue,e.tyres,0,r.speedModel??1),remaining=E.raceRemaining(r,e,p.lap),inactive=e.status==='dnf'||r.phase==='finished';
 if(!remaining||inactive)return {remaining,need:0,reserve:0,target:0,margin:e.fuel,shortfall:0,status:e.status==='dnf'?'retired':'finished',pendingFuel:false};
 const rate=p.burn/p.lap*(r.arcade?.motion||1)*(r.arcade?.rates[e.id]?.fuel||1);
 const powers=r.arcade?.powers,boostSeconds=id=>Math.min(remaining,Math.max(0,(powers?.[id]?.until||0)-r.time));
 const turbo=boostSeconds('turbo'),grip=boostSeconds('grip'),both=Math.min(turbo,grip);
 // Boosts already paid their initial fuel cost. Only their remaining extra burn
 // is included; future activations and subsequent pace changes need a new estimate.
 const need=rate*(remaining+turbo*(1.35*1.4-1)+grip*.12+both*(1.35*1.4-1)*.12),reserve=need*.10+rate*Math.min(15,remaining),target=need+reserve,margin=e.fuel-target;
 return {remaining,rate,need,reserve,target,margin,shortfall:Math.max(0,-margin),status:e.fuel<need?'pit':margin<0?'tight':'safe',pendingFuel:!!e.pitService&&e.pitTasks.some((t,i)=>t.kind==='fuel'&&i>=e.pitService.applied)};
}
function comparison(s,part,condition=100){
 const car=E.active(s),installed=car.parts[part.slot],old=C.part(installed.id),candidate=E.clone(car);candidate.parts[part.slot]={...installed,id:part.id,condition};
 const before=E.stats(car),after=E.stats(candidate),rows=[{label:'Estado',before:installed.condition,after:condition,unit:'%',digits:0},{label:'Factor de pieza',before:old.factor,after:part.factor,unit:'×',digits:2},{label:'Durabilidad',before:old.durability,after:part.durability,unit:'×',digits:2}];
 if(part.slot==='tyres')rows.push({label:'Agarre de cubierta',before:old.grip,after:part.grip,unit:'×',digits:2});
 if(part.slot==='tank')rows.push({label:'Capacidad',before:old.capacity,after:part.capacity,unit:' L',digits:0});
 for(const [key,label,unit,digits,lower] of [['topSpeed','Potencial en recta',' km/h',1],['power','Potencia del auto',' CV',0],['mass','Peso del auto',' kg',0,true],['grip','Agarre del auto','×',3],['cooling','Refrigeración','×',3],['efficiency','Transmisión','×',3]])if(Math.abs(after[key]-before[key])>1e-7)rows.push({label,before:before[key],after:after[key],unit,digits,lower});
 return {installed:old.name,candidate:part.name,compatible:E.compatible(car,part),same:old.id===part.id,rows:rows.map(row=>({...row,delta:row.after-row.before}))};
}
function partComparison(s,part,condition=100){const c=comparison(s,part,condition),fmt=(v,row)=>row.unit==='×'?'×'+v.toFixed(row.digits):v.toFixed(row.digits)+row.unit;return `<section class="part-comparison" aria-label="Comparación con el repuesto instalado"><b>Comparar con tu auto</b><p>Instalado: <strong>${esc(c.installed)}</strong></p>${!c.compatible?'<p class="warn">Requiere un chasis compatible para montarlo.</p>':''}<table><thead><tr><th scope="col">Dato</th><th scope="col">Actual</th><th scope="col">Esta pieza</th></tr></thead><tbody>${c.rows.map(row=>{const different=Math.abs(row.delta)>.5*10**-row.digits,good=row.lower?row.delta<0:row.delta>0;return `<tr><th scope="row">${row.label}</th><td>${fmt(row.before,row)}</td><td class="${different?(good?'better':'worse'):''}" title="${different?'Cambio: '+(row.delta>0?'+':'')+row.delta.toFixed(row.digits)+row.unit:'Sin cambio'}">${fmt(row.after,row)}${different?` <span>${row.delta>0?'↑':'↓'}</span>`:' ='}</td></tr>`;}).join('')}</tbody></table><small>Con tu reglaje y el estado de cada pieza. El factor compara especificaciones; la potencia y el agarre reflejan el desgaste.</small></section>`;}
const api={fuelForecast,comparison,partComparison};root.GalponRaceInsights=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
