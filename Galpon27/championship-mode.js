(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog.js'):null);
const is=s=>s.mode==='championship';
const slots=['engine','tyres','brakes','suspension','cooling',...C.slots.map(p=>p.id).filter(id=>!['engine','tyres','brakes','suspension','cooling'].includes(id))];
const developments=[1,2,3,4].flatMap(grade=>slots.map(slot=>C.part(slot+'-'+grade)).filter(Boolean));
function available(s,p){if(!is(s))return true;return !p.location&&!p.unlockChallenge&&(p.grade<=s.championshipMode.tier||developments.indexOf(p)>=0&&developments.indexOf(p)<s.wins*2);}
function notify(s,text){s.championshipMode.news.unshift({week:s.week,text});s.championshipMode.news=s.championshipMode.news.slice(0,40);}
function create(E){const s=E.createState();s.mode='championship';delete s.campaign;delete s.baseStory;s.championshipMode={version:1,tier:0,pending:null,news:[]};s.career.messages=[];s.career.preparations={};s.career.sponsor=null;notify(s,'Alma · Ingeniería: empezamos en Circuitos amateur. Cada victoria habilita dos desarrollos de piezas, hasta completar el catálogo técnico. Los compramos con el presupuesto del equipo y los montamos en el taller.');return s;}
function nextCar(s){return C.cars.filter(c=>c.tier===s.championshipMode.tier+1).sort((a,b)=>a.price-b.price)[0]||null;}
function assertRace(s){if(!is(s))return;if(s.championshipMode.pending)throw Error('Elegí cómo continuar la próxima temporada antes de inscribirte.');if(C.car(s.cars.find(c=>c.uid===s.activeCar).id).tier!==s.championshipMode.tier||s.trackId!==C.scheduleFor(s,s.championshipMode.tier)[s.leagues[s.championshipMode.tier].round])throw Error('El auto o circuito no corresponde a la próxima fecha.');}
function afterCollect(s,r){if(!is(s))return;const f=r.finish,m=s.championshipMode;
 if(f.position===1&&!f.dnf&&f.reason!=='all-retired'){const parts=developments.slice((s.wins-1)*2,s.wins*2);notify(s,parts.length?'Alma · Ingeniería: ¡victoria! Habilitamos '+parts.map(p=>p.name).join(' y ')+'. Compará cada desarrollo con tu pieza instalada; la compra y el montaje se hacen desde Repuestos.':'Alma · Ingeniería: ¡victoria! Ya está habilitado todo el catálogo técnico. Seguimos trabajando en mantenimiento, reglajes y equipo.');}
 if(f.championship?.position===1&&s.championship===1)notify(s,'Alma · Ingeniería: desbloqueamos Defensa y Lucha. Mejorá usos y duración en el taller; disponibles desde la próxima carrera.');
 if(f.championship){m.pending={tier:r.tier,season:f.championship.season,champion:f.championship.position===1};notify(s,f.championship.position===1?'Dirección: ganamos el campeonato. Podemos continuar otro año o comprar el auto de la siguiente liga si alcanza el efectivo.':'Dirección: terminamos P'+f.championship.position+'. Continuemos otro año en esta liga para disputar el título.');}
}
function decide(s,choice,E){E.assertCareerIdle(s);const m=s.championshipMode;if(!is(s)||!m?.pending)throw Error('No hay una temporada pendiente de resolver.');if(!['repeat','promote'].includes(choice))throw Error('Opción de temporada inválida.');
 if(choice==='promote'){const car=nextCar(s);if(!m.pending.champion||!car)throw Error('Necesitás ganar el campeonato para avanzar a la próxima liga.');if(s.cash<car.price)throw Error('No alcanza el efectivo para comprar el próximo vehículo. Podés repetir otro año.');if(s.cars.length>=100)throw Error('El garaje está lleno.');E.careerMoney(s,-car.price,'Ascenso · compra de '+car.name);const owned=E.makeCareerCar(car.id,s.nextUid++);s.cars.push(owned);s.activeCar=owned.uid;m.tier=car.tier;s.rep=Math.max(s.rep,C.categories[car.tier].rep);s.trackId=C.scheduleFor(s,car.tier)[s.leagues[car.tier].round];notify(s,'Dirección: compramos '+car.name+' y avanzamos a '+C.categories[car.tier].name+'. Revisá los reglajes y el equipo antes de largar.');}
 else notify(s,'Dirección: seguimos otro año en '+C.categories[m.tier].name+'. Conservamos presupuesto, desarrollos, auto y equipo.');
 m.pending=null;
}
function validate(s){if(s.mode==='exhibition')return;if(s.mode===undefined||s.mode==='story'){if(s.championshipMode!==undefined)throw Error('La historia no admite progreso de Solo campeonatos.');return;}const m=s.championshipMode,int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b,fail=()=>{throw Error('Progreso de Solo campeonatos inválido.');};
 if(!is(s)||!m||m.version!==1||!int(m.tier,0,4)||C.car(s.cars.find(c=>c.uid===s.activeCar).id).tier!==m.tier||s.trackId!==C.scheduleFor(s,m.tier)[s.leagues[m.tier].round]||!Array.isArray(m.news)||m.news.length>40||m.news.some(n=>!n||!int(n.week,1,s.week)||typeof n.text!=='string'||n.text.length>1600))fail();
 if(m.pending!==null){const p=m.pending,a=s.leagues[m.tier].archive[0];if(!p||p.tier!==m.tier||!int(p.season,1,1e7)||typeof p.champion!=='boolean'||!a||a.season!==p.season||p.champion!==(a.position===1)||s.leagues[m.tier].round!==0||s.race)fail();}
 if(s.career.messages.length||s.career.sponsor||Object.keys(s.career.preparations).length||s.stories.length||s.journey.trip||s.race&&(s.race.challenge||s.race.localEvent||s.race.tier!==m.tier||s.race.track!==s.trackId))fail();
}
root.GalponChampionship={is,create,available,developments,nextCar,assertRace,afterCollect,decide,validate};if(typeof module!=='undefined')module.exports=root.GalponChampionship;
})(globalThis);
