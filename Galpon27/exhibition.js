(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null),F=root.GalponRaceFormat||(typeof require==='function'?require('./race-format'):null);
const Teams=root.GalponRivalTeams||(typeof require==='function'?require('./rival-teams'):null);
const is=s=>s?.mode==='exhibition',copy=x=>JSON.parse(JSON.stringify(x));
const pilots=[{id:'owner',name:'Vos',role:'owner',skill:43,care:66,stamina:65},...C.people.filter(p=>p.role==='driver'),
 {id:'franco',name:'Franco Pinto',skill:57,care:70,stamina:73},
 {id:'carlos',name:'Carlos Sainero',skill:70,care:84,stamina:82},
 {id:'fernando',name:'Fernando Alonsa',skill:82,care:91,stamina:89},
 {id:'lewis',name:'Lewis Hamel',skill:92,care:90,stamina:93},
 {id:'michael',name:'Michael Schuemberg',skill:98,care:97,stamina:96},...Teams.teams.slice(0,24).map((t,i)=>({id:'guest-'+t.id,name:t.pilot,skill:45+i%15*3,care:62+i%11*3,stamina:68+i%8*3}))
].map(p=>({...p,role:p.id==='owner'?'owner':'driver',wage:0,xp:0}));
const pilot=id=>pilots.find(p=>p.id===id);
function defaults(){return {fieldVersion:2,track:'dust',tier:0,car:'cedar',laps:F.laps('dust',0),driver:'owner',relief:'ines',rivals:pilots.filter(p=>!['owner','ines'].includes(p.id)).slice(0,Teams.size(0)-1).map(p=>p.id)};}
function check(c){
 if(!c||c.fieldVersion!==undefined&&![1,2].includes(c.fieldVersion)||!C.track(c.track)||!Number.isInteger(c.tier)||c.tier<0||c.tier>4||C.car(c.car)?.tier!==c.tier||!Number.isInteger(c.laps)||c.laps<1||c.laps>200||!pilot(c.driver)||c.relief!==null&&!pilot(c.relief)||c.driver===c.relief||!Array.isArray(c.rivals)||c.rivals.length!==(c.fieldVersion===2?Teams.size(c.tier)-1:9)||c.rivals.some(id=>!pilot(id)))throw Error('Configuración de exhibición inválida. Elegí pista, auto, 1–200 vueltas y pilotos.');
 const ids=[c.driver,...(c.relief?[c.relief]:[]),...c.rivals];if(new Set(ids).size!==ids.length)throw Error('Cada piloto debe ocupar un solo auto o relevo.');return c;
}
function edit(input,key,value){const c=copy(input),old=copy(c);
 if(key==='tier'){c.tier=Number(value);c.car=C.cars.find(x=>x.tier===c.tier)?.id;}
 else if(key==='laps')c.laps=Number(value);
 else if(key==='relief')c.relief=value||null;
 else if(key.startsWith('rival-')){const i=Number(key.slice(6)),other=c.rivals.indexOf(value);if(other>=0)c.rivals[other]=c.rivals[i];c.rivals[i]=value;}
 else if(['track','car','driver'].includes(key))c[key]=value;
 else throw Error('Opción de exhibición desconocida.');
 if(['tier','track'].includes(key)&&old.laps===F.laps(old.track,old.tier))c.laps=F.laps(c.track,c.tier);
 if(c.driver===c.relief)c.relief=null;
 const count=c.fieldVersion===2?Teams.size(c.tier)-1:9;c.rivals=c.rivals.slice(0,count);const used=new Set([c.driver,c.relief].filter(Boolean));c.rivals=c.rivals.map(id=>{const next=!used.has(id)?id:pilots.find(p=>!used.has(p.id)).id;used.add(next);return next;});
 while(c.rivals.length<count){const id=pilots.find(p=>!used.has(p.id)).id;c.rivals.push(id);used.add(id);}
 return check(c);
}
function create(E,config=defaults()){
 check(config);const s=E.createState();s.mode='exhibition';s.fieldVersion=config.fieldVersion===2?2:1;if(s.fieldVersion===1){s.leagues.forEach(l=>l.points=Array(10).fill(0));Teams.assign(s,s.seed);}delete s.baseStory;delete s.campaign;delete s.championshipMode;
 s.exhibition={version:1,config:copy(config),lastResult:null};s.name='Galpón 27';s.cash=0;s.trackId=config.track;s.practiceTrack=config.track;s.tools=2;s.pitLevel=10;s.consumables.tyres=999;
 const car=E.makeCareerCar(config.car,1),t=C.track(config.track);for(const p of Object.values(car.parts))p.condition=100;car.setup={gearing:t.gearing,spring:t.spring,pressure:t.pressure,downforce:t.downforce,cooling:70,bias:57};s.cars=[car];s.activeCar=1;
 s.drivers=[config.driver,...(config.relief?[config.relief]:[])];s.staff=[...new Set(['owner',...s.drivers])].map(id=>copy(pilot(id)));s.staff.push({...copy(C.people.find(p=>p.id==='elias')),xp:0,wage:0});
 s.career.messages=[];s.career.preparations={};s.career.sponsor=null;return s;
}
function event(s){const c=check(s.exhibition.config),seconds=Math.max(1,Math.round(C.raceMinutes[c.track]*60*c.laps/(s.race&&!s.race.circuitModel?F.legacyLaps(c.track,c.tier):F.laps(c.track,c.tier))));return {category:C.categories[c.tier],track:C.track(c.track),minutes:seconds/60,laps:c.laps,round:1,season:1,entry:0};}
function prepare(s,r,E){const c=s.exhibition.config,t=C.track(r.track);r.exhibition=true;r.duration=Math.round(r.duration);
 for(const [i,e] of r.entries.slice(1).entries()){e.drivers=[copy(pilot(c.rivals[i]))];e.name=e.drivers[0].name;for(const slot of C.slots)e.car.parts[slot.id]={id:slot.id+'-'+c.tier,condition:100};e.car.setup=copy(r.config.car.setup);e.adaptiveFactor=1;e.referenceLap=E.performance(e.car,t,e.drivers[0],0,E.stats(e.car).tank,0,100,0,r.speedModel).lap;}
}
function start(s,E){if(!is(s)||s.race)throw Error('Cerrá la carrera actual antes de preparar otra exhibición.');const cfg=copy(s.exhibition.config);if(cfg.fieldVersion!==2){cfg.fieldVersion=2;const used=new Set([cfg.driver,cfg.relief,...cfg.rivals]);while(cfg.rivals.length<Teams.size(cfg.tier)-1){const id=pilots.find(p=>!used.has(p.id)).id;cfg.rivals.push(id);used.add(id);}}const next=create(E,cfg);next.exhibition.lastResult=copy(s.exhibition.lastResult);if(s.rivalRoster){next.rivalRoster=copy(s.rivalRoster);next.rivalSeed=s.rivalSeed;if(s.fieldVersion!==2){next.fieldVersion=1;Teams.expand(next);}}else{delete next.rivalRoster;delete next.rivalSeed;}E.startRace(next);return next;}
function collect(s,statistics,order){const r=s.race;s.exhibition.lastResult={track:r.track,tier:r.tier,laps:r.targetLaps,position:r.finish.position,dnf:r.finish.dnf,time:r.time,statistics:copy(statistics),grid:order.map(e=>({name:e.name,number:e.number,color:e.color,laps:e.laps,status:e.status}))};s.race=null;return {...r.finish,net:0,exhibition:true};}
function validate(s){if(!is(s)){if(s.exhibition!==undefined||s.race?.exhibition!==undefined)throw Error('Este guardado no corresponde a Exhibición.');return;}
 const x=s.exhibition;if(!x||x.version!==1||s.campaign!==undefined||s.championshipMode!==undefined)throw Error('Guardado de exhibición inválido.');check(x.config);
 if(s.trackId!==x.config.track||s.cars.length!==1||s.cars[0].id!==x.config.car||s.drivers.join('|')!==[x.config.driver,...(x.config.relief?[x.config.relief]:[])].join('|')||s.completed!==0||s.wins!==0||s.championship!==0||s.history.length||s.stories.length||s.career.messages.length||s.journey.trip||s.leagues.some(l=>l.round||l.season!==1||l.points.some(Boolean)))throw Error('La exhibición no admite progreso de campaña.');
 if(s.race){const r=s.race;if(r.exhibition!==true||r.duration!==Math.round(event(s).minutes*60)||r.track!==x.config.track||r.tier!==x.config.tier||r.targetLaps!==x.config.laps||r.challenge||r.localEvent||r.venue||r.careerVersion||r.entries.slice(1).some((e,i)=>e.drivers[0].id!==x.config.rivals[i]))throw Error('La carrera no coincide con la exhibición configurada.');}
 const f=x.lastResult;if(f!==null&&(!f||!C.track(f.track)||!Number.isInteger(f.tier)||f.tier<0||f.tier>4||!Number.isInteger(f.position)||f.position<1||f.position>24||!Number.isInteger(f.laps)||f.laps<1||f.laps>200||typeof f.dnf!=='boolean'||!Number.isInteger(f.time)||f.time<0||f.time>1e7||!Array.isArray(f.grid)||![10,Teams.size(f.tier)].includes(f.grid.length)||f.grid.some(e=>!e||typeof e.name!=='string'||e.name.length>60||!Number.isInteger(e.number)||e.number<0||e.number>99||!/^#[0-9a-f]{6}$/i.test(e.color)||!Number.isInteger(e.laps)||e.laps<0||e.laps>200||!['finished','dnf'].includes(e.status))))throw Error('Resultado de exhibición inválido.');
 if(f) (root.GalponRaceStatistics||(typeof require==='function'?require('./race-statistics'):null)).validateSummary(f.statistics);
}
const api={is,pilots,pilot,defaults,check,edit,create,event,prepare,start,collect,validate};root.GalponExhibition=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
