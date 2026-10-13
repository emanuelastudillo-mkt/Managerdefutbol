(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null),SP=root.GalponStoryProfile||(typeof require==='function'?require('./story-profile'):null),V=root.GalponVehicleMetrics||(typeof require==='function'?require('./vehicle-metrics'):null);
const clone=o=>JSON.parse(JSON.stringify(o)),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),round=n=>Math.round(n*100)/100;
const names=['Lucía Vidal','Tomás Ferreyra','Marina Costa','Bruno Salas','Valentina Ríos','Diego Arce','Camila Ferrero','Nicolás Sosa','Sofía Leiva','Iván Molina','Julia Pereyra','Mateo Luna','Abril Cabrera','Santiago Acosta','Elena Paz','Ramiro Duarte','Paula Montes','Joaquín Vera','Clara Benítez','Martín Funes','Renata Suárez','Leandro Gil','Carolina Ponce','Andrés Silva'];
const clients=names.map((name,i)=>({id:'workshop-client-'+i,name,portrait:i%6,style:['Quiero un auto equilibrado.','Necesito confianza al frenar.','Me preocupa la temperatura.','Busco respuesta al acelerar.','Quiero hacer más kilómetros.','Necesito más agarre.'][i%6],priority:['handling','braking','cooling','acceleration','range','grip'][i%6]}));
const is=s=>SP.story(s)&&!!s.journey,day=s=>Math.max(s.workshopJobs?.completed||0,s.week-1),level=s=>Math.min(20,1+Math.floor(Math.sqrt((s.workshopJobs?.experience||0)/30))),crewLevel=s=>Math.min(20,Math.floor(Math.sqrt((s.workshopJobs?.crewExperience||0)/12))),mechanicSkill=s=>Math.min(95,43+Math.sqrt(s.workshopJobs?.experience||0)*2.1);
function fresh(){return {version:1,experience:0,crewExperience:0,reputation:0,completed:0,nextOrder:1,pitRole:false,clients:clients.map(c=>({id:c.id,trust:0,visits:0,nextVisit:0})),offers:[],active:null,history:[]};}
function ensure(s){if(!s.workshopJobs)s.workshopJobs=fresh();return s.workshopJobs;}
function guard(s,E){if(!is(s)||s.journey.location!=='base')throw Error('Los trabajos de clientes se hacen en tu taller de Galpón 27.');E.assertCareerIdle(s);}
function replenish(s,E){const w=ensure(s),now=day(s),count=Math.min(5,2+Math.floor(w.reputation/25));
 w.offers=w.offers.filter(o=>o.expires>=now&&w.active?.clientId!==o.clientId);
 const tier=s.campaign?.tier||0,available=w.clients.filter(c=>c.nextVisit<=now&&!w.offers.some(o=>o.clientId===c.id)&&w.active?.clientId!==c.id).sort((a,b)=>(b.trust-a.trust)||(a.visits-b.visits)||clients.findIndex(c=>c.id===a.id)-clients.findIndex(c=>c.id===b.id));
 while(w.offers.length<count&&available.length){const c=available.shift(),i=clients.findIndex(x=>x.id===c.id),carTier=tier,cars=C.cars.filter(x=>x.tier===carTier),spec=cars[(i+c.visits)%cars.length],id=w.nextOrder++,scale=1+(level(s)-1)*.22+carTier*.6;
  w.offers.push({id,clientId:c.id,carId:spec.id,budget:E.cost(s,Math.round((1800+(i%4)*350)*scale/50)*50),fee:E.income(s,Math.round((180+(i%3)*35)*scale*(1+Math.max(0,c.trust)*.015))),expires:now+5,seed:i+c.visits*7});
 }
}
function open(s,E){guard(s,E);replenish(s,E);return s.workshopJobs;}
function accept(s,id,E){guard(s,E);const w=ensure(s);if(w.active)throw Error('Entregá el auto actual antes de aceptar otro.');const o=w.offers.find(o=>o.id===id);if(!o||o.expires<day(s))throw Error('Este trabajo ya no está disponible.');
 const car=E.makeCareerCar(o.carId,s.nextUid++),tier=C.car(car.id).tier;car.number=11+o.seed%80;car.color=['#c95543','#e0ba55','#72a69d','#567db5','#d9d3bd','#a16e98'][o.seed%6];car.chassis=90;
 for(const [i,slot]of C.slots.entries()){car.parts[slot.id]={id:slot.id+'-'+Math.max(0,Math.min(4,tier+(i+o.seed)%2)),condition:76+(i*7+o.seed*3)%19};}
 w.active={id:o.id,clientId:o.clientId,car,before:clone(car),budget:o.budget,remaining:o.budget,fee:o.fee,stock:[],purchases:[],installs:0,work:null};w.offers=w.offers.filter(x=>x.id!==id);return w.active;
}
function job(s){const j=s.workshopJobs?.active;if(!j)throw Error('No hay un vehículo de cliente en el taller.');return j;}
function catalog(s,E){const j=s.workshopJobs?.active;if(!j)return[];return C.parts.filter(p=>!p.location&&!p.unlockChallenge&&E.compatible(j.car,p)&&E.unlocked(s,p.tier));}
function buy(s,id,E){guard(s,E);const j=job(s),p=catalog(s,E).find(p=>p.id===id);if(!p)throw Error('Repuesto no disponible para este cliente.');const price=E.cost(s,p.price);if(price>j.remaining)throw Error('El presupuesto del cliente no alcanza.');if(j.purchases.length>=1000)throw Error('Entregá el trabajo antes de seguir comprando.');if(j.stock.length>=100)throw Error('Hay demasiados repuestos reservados.');const piece={uid:s.nextUid++,id,condition:p.initialCondition};j.stock.push(piece);j.purchases.push({uid:piece.uid,id,price});j.remaining=round(j.remaining-price);return piece;}
function refund(s,uid,E){guard(s,E);const j=job(s),purchase=j.purchases.find(p=>p.uid===uid),i=j.stock.findIndex(p=>p.uid===uid);if(!purchase||i<0||j.stock[i].id!==purchase.id||j.stock[i].condition!==C.part(purchase.id).initialCondition)throw Error('Solo se puede devolver una compra sin instalar.');j.stock.splice(i,1);j.purchases=j.purchases.filter(p=>p.uid!==uid);j.remaining=round(j.remaining+purchase.price);}
function candidate(s,source,uid,slot,E){const j=job(s);if(!C.slots.some(x=>x.id===slot))throw Error('Componente desconocido.');let piece;
 if(source==='customer')piece=j.stock.find(p=>p.uid===uid);else if(source==='inventory')piece=s.inventory.find(p=>p.uid===uid);else if(source==='own')piece=E.active(s).parts[slot];else throw Error('Origen de pieza inválido.');
 const p=piece&&C.part(piece.id);if(!p||p.slot!==slot||!E.compatible(j.car,p))throw Error('La pieza no es compatible con este vehículo.');
 if(source==='own'&&!E.compatible(E.active(s),C.part(j.car.parts[slot].id)))throw Error('El repuesto del cliente no es compatible con tu auto.');if(source==='inventory'&&s.inventory.length>3000)throw Error('Depósito lleno.');return piece;
}
function preview(s,source,uid,slot,E){const car=clone(job(s).car),piece=candidate(s,source,uid,slot,E);car.parts[slot]={id:piece.id,condition:piece.condition};return V.measure(car,E);}
function begin(s,source,uid,slot,E){guard(s,E);const j=job(s),piece=candidate(s,source,uid,slot,E),old=j.car.parts[slot];if(piece.id===old.id&&piece.condition===old.condition)throw Error('Esa pieza es igual a la instalada.');j.work={source,uid,slot,id:piece.id,condition:piece.condition,ownUid:source==='own'?E.active(s).uid:null,elapsed:0,duration:3};return j.work;}
function advance(s,dt,E){const j=s.workshopJobs?.active,w=j?.work;if(!w)return false;if(!Number.isFinite(dt)||dt<0)throw Error('Tiempo de instalación inválido.');w.elapsed=Math.min(w.duration,w.elapsed+dt);if(w.elapsed<w.duration)return false;
 const p=candidate(s,w.source,w.uid,w.slot,E);if(p.id!==w.id||p.condition!==w.condition||w.source==='own'&&E.active(s).uid!==w.ownUid)throw Error('El repuesto reservado cambió.');const old=j.car.parts[w.slot];
 if(w.source==='own')E.active(s).parts[w.slot]=clone(old);else{const list=w.source==='customer'?j.stock:s.inventory,i=list.findIndex(p=>p.uid===w.uid);list.splice(i,1);list.push({uid:s.nextUid++,id:old.id,condition:old.condition});}
 j.car.parts[w.slot]={id:p.id,condition:p.condition};j.installs++;j.work=null;return true;
}
function appraisal(s,E){const j=job(s),before=V.measure(j.before,E),after=V.measure(j.car,E),diff=V.changes(before,after),client=clients.find(c=>c.id===j.clientId);
 const changed=C.slots.some(slot=>j.before.parts[slot.id].id!==j.car.parts[slot.id].id||j.before.parts[slot.id].condition!==j.car.parts[slot.id].condition);
 const gain=diff.reduce((n,d)=>n+d.gain*(d.id===client.priority?2:1),0)/9,downgraded=C.slots.some(slot=>C.part(j.car.parts[slot.id].id).grade<C.part(j.before.parts[slot.id].id).grade||j.car.parts[slot.id].condition<j.before.parts[slot.id].condition-10),bad=downgraded||gain<-.01||diff.find(d=>d.id===client.priority).gain<-.1,good=changed&&!bad&&gain>.005;
 // No reward for moving the same parts back and forth or delivering unchanged.
 const fee=changed?(bad?round(j.fee*.25):j.fee):0,bonus=good?round(j.fee*Math.min(3,Math.max(0,gain)*8)):0;
 return{before,after,diff,changed,bad,gain,good,fee,bonus,total:round(fee+bonus),verdict:!changed?'Sin mejoras':bad?'Cliente disconforme':good?'Cliente satisfecho':'Trabajo aceptado'};
}
function deliver(s,E,cancel=false){guard(s,E);const w=ensure(s),j=job(s),a=appraisal(s,E);if(!a.changed&&!cancel)throw Error('Instalá una mejora real o devolvé el trabajo sin cobrar.');const c=w.clients.find(c=>c.id===j.clientId),now=day(s);
 const good=!cancel&&a.good,bad=cancel||a.bad,total=cancel?0:a.total,xp=cancel?0:bad?3:Math.max(8,Math.min(30,8+Math.round(Math.max(0,a.gain)*80)));
 c.visits++;c.trust=clamp(c.trust+(good?3:bad?-6:1),-30,40);c.nextVisit=now+(good?2:bad?12:5);w.experience+=xp;w.reputation=clamp(w.reputation+(good?8:bad?-12:2),0,100);w.completed++;
 const record={id:j.id,clientId:j.clientId,carId:j.car.id,day:now,total,bonus:cancel?0:a.bonus,gain:a.gain,good,bad,xp,returnedBudget:j.remaining,verdict:cancel?'Trabajo devuelto':a.verdict};
 w.history.unshift(record);w.history=w.history.slice(0,30);w.active=null;if(total)E.careerMoney(s,total,'Taller · '+clients.find(c=>c.id===j.clientId).name,true);replenish(s,E);return record;
}
function eligible(s){return is(s)&&!!s.workshopJobs?.pitRole&&!s.drivers.includes('owner')&&s.drivers.some(id=>s.staff.some(p=>p.id===id&&p.role==='driver'));}
function role(s,E){guard(s,E);const w=ensure(s);if(w.pitRole){if(!s.drivers.includes('owner')){if(s.drivers.length>=3)throw Error('Liberá un lugar en la lista de pilotos para volver al volante.');s.drivers.push('owner');}w.pitRole=false;}else{const other=s.staff.find(p=>p.role==='driver');if(!other)throw Error('Contratá otro piloto para que puedas trabajar en boxes.');s.drivers=s.drivers.filter(id=>id!=='owner');if(!s.drivers.length)s.drivers=[other.id];w.pitRole=true;}return w.pitRole;}
function syncRole(s){if(s.workshopJobs?.pitRole&&(!s.staff.some(p=>p.role==='driver')||s.drivers.includes('owner')))s.workshopJobs.pitRole=false;}
function pitCompleted(s,e){if(e.id!=='player'||!s.race?.config.workshopSupport||!eligible(s)||(s.race.workshopCreditedStops||0)>=e.stops||!e.pitTasks.some(t=>t.seconds>0))return false;const w=ensure(s);w.experience+=2;w.crewExperience+=3;s.race.workshopCreditedStops=e.stops;return true;}
function validate(s,validateCar){const w=s.workshopJobs;if(w===undefined)return;if(!is(s)||!w||w.version!==1)throw Error('Taller de clientes inválido.');
 const num=(n,min,max,int=false)=>{if(!Number.isFinite(n)||n<min||n>max||int&&!Number.isInteger(n))throw Error('Dato de taller inválido.');};
 for(const k of ['experience','crewExperience','completed'])num(w[k],0,1e7,true);num(w.reputation,0,100);num(w.nextOrder,1,1e9,true);if(typeof w.pitRole!=='boolean')throw Error('Rol de taller inválido.');
 if(!Array.isArray(w.clients)||w.clients.length!==clients.length||new Set(w.clients.map(c=>c.id)).size!==clients.length)throw Error('Clientes inválidos.');for(const c of w.clients){if(!clients.some(x=>x.id===c.id))throw Error('Cliente desconocido.');num(c.trust,-30,40);num(c.visits,0,1e7,true);num(c.nextVisit,0,1e7,true);}
 if(!Array.isArray(w.offers)||w.offers.length>5||!Array.isArray(w.history)||w.history.length>30)throw Error('Agenda de taller inválida.');
 const checkClient=id=>{if(!clients.some(c=>c.id===id))throw Error('Cliente desconocido.');};
 for(const o of w.offers){checkClient(o.clientId);num(o.id,1,w.nextOrder-1,true);if(!C.car(o.carId))throw Error('Vehículo de cliente inválido.');num(o.budget,0,1e8);num(o.fee,0,1e8);num(o.expires,0,1e7,true);num(o.seed,0,1e8,true);}
 if(new Set(w.offers.map(o=>o.id)).size!==w.offers.length||new Set(w.offers.map(o=>o.clientId)).size!==w.offers.length)throw Error('Ofertas duplicadas.');
 const uids=new Set([...s.cars.map(c=>c.uid),...s.inventory.map(p=>p.uid)]),uid=id=>{num(id,1,s.nextUid-1,true);if(uids.has(id))throw Error('Identificador de repuesto duplicado.');uids.add(id);};
 if(w.active){const j=w.active;checkClient(j.clientId);num(j.id,1,w.nextOrder-1,true);if(w.offers.some(o=>o.id===j.id||o.clientId===j.clientId))throw Error('Cliente activo duplicado.');validateCar(j.car);validateCar(j.before);uid(j.car.uid);if(j.car.uid!==j.before.uid||j.car.id!==j.before.id)throw Error('Vehículo de cliente alterado.');num(j.budget,0,1e8);num(j.remaining,0,j.budget);num(j.fee,0,1e8);num(j.installs,0,1e7,true);
  if(!Array.isArray(j.stock)||j.stock.length>100||!Array.isArray(j.purchases)||j.purchases.length>1000)throw Error('Depósito de cliente inválido.');for(const p of j.stock){if(!C.part(p.id))throw Error('Repuesto desconocido.');num(p.condition,0,100);uid(p.uid);}let spent=0;const purchases=new Set();for(const p of j.purchases){if(!C.part(p.id)||purchases.has(p.uid))throw Error('Compra inválida.');num(p.uid,1,s.nextUid-1,true);purchases.add(p.uid);num(p.price,0,1e8);spent+=p.price;}if(Math.abs(j.budget-spent-j.remaining)>.02)throw Error('Presupuesto de cliente inconsistente.');
  if(j.work){if(s.race||s.setupJob||s.journey.trip||s.journey.location!=='base')throw Error('Instalación fuera del taller.');const x=j.work;if(x.source==='own'&&x.ownUid!==s.activeCar)throw Error('Auto reservado inválido.');if(!['customer','inventory','own'].includes(x.source)||!C.slots.some(slot=>slot.id===x.slot)||!C.part(x.id)||C.part(x.id).slot!==x.slot||x.duration!==3)throw Error('Instalación inválida.');num(x.elapsed,0,3);num(x.condition,0,100);const piece=x.source==='own'?s.cars.find(c=>c.uid===x.ownUid)?.parts[x.slot]:(x.source==='customer'?j.stock:s.inventory).find(p=>p.uid===x.uid);if(!piece||piece.id!==x.id||piece.condition!==x.condition)throw Error('Reserva de repuesto inválida.');}
 }
 for(const h of w.history){checkClient(h.clientId);if(!C.car(h.carId)||typeof h.good!=='boolean'||typeof h.bad!=='boolean'||typeof h.verdict!=='string'||h.verdict.length>80)throw Error('Historial de taller inválido.');for(const k of ['id','day','total','bonus','xp','returnedBudget'])num(h[k],0,1e9);num(h.gain,-1,100);}
 if(w.pitRole&&!eligible(s))throw Error('Se necesita otro piloto para trabajar en boxes.');
 if(s.race?.config.workshopSupport){const c=s.race.config.workshopSupport;if(c.version!==1||!eligible(s))throw Error('Apoyo de boxes inválido.');num(c.skill,43,95);num(c.level,0,20,true);if(s.race.workshopCreditedStops!==undefined)num(s.race.workshopCreditedStops,0,s.race.entries[0].stops,true);}
}
const api={clients,is,ensure,level,crewLevel,mechanicSkill,open,accept,catalog,buy,refund,preview,begin,advance,appraisal,deliver,eligible,role,syncRole,pitCompleted,validate};root.GalponWorkshopJobs=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
