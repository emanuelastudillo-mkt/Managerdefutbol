(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog.js'):null);
const clone=x=>JSON.parse(JSON.stringify(x));
const validTime=n=>typeof n==='number'&&Number.isFinite(n)&&n>=.1&&n<=43200;
function best(a,b){return b&&validTime(b.seconds)&&(!a||b.seconds<a.seconds)?clone(b):a;}
function bucket(s,track,tier){if(!s.circuitRecords)s.circuitRecords=[];let item=s.circuitRecords.find(x=>x.track===track&&x.tier===tier);if(!item){item={track,tier,race:null,team:null,test:null};s.circuitRecords.push(item);}return item;}
function mark(s,entry,tier){const result={seconds:entry.bestLap,team:entry.name,car:entry.car.id,number:entry.number,week:s.week,...(entry.statistics?.fastestLap?.value===entry.bestLap&&entry.statistics.fastestLap.driver!==null?{driver:entry.statistics.fastestLap.driver}:{})};if(tier!==undefined&&C.car(entry.car.id).tier!==tier)result.competitionTier=tier;return result;}
function recordRace(s,r){const candidates=r.entries.filter(e=>validTime(e.bestLap));if(!candidates.length)return;const item=bucket(s,r.track,r.tier);for(const e of candidates)item.race=best(item.race,mark(s,e,r.tier));const p=r.entries[0];if(validTime(p.bestLap))item.team=best(item.team,mark(s,p,r.tier));}
function recordTest(s,result){
 // Recover retained tests before the rolling history can discard them. Old saves
 // did not record the week or car number: preserve that absence explicitly.
 for(const old of s.testHistory||[]){const item=bucket(s,old.track,C.car(old.car).tier);item.test=best(item.test,{seconds:old.best,team:s.name,car:old.car,number:null,week:null,legacy:true});}
 const car=s.cars.find(c=>c.uid===s.activeCar),item=bucket(s,result.track,C.car(result.car).tier);item.test=best(item.test,{seconds:result.best,team:s.name,car:result.car,number:car.number,week:s.week});
}
function validate(records){if(records===undefined)return;const fail=()=>{throw Error('Récords de circuito inválidos.');};if(!Array.isArray(records)||records.length>C.tracks.length*C.categories.length)fail();const seen=new Set();for(const item of records){if(!item||!C.track(item.track)||!Number.isInteger(item.tier)||item.tier<0||item.tier>=C.categories.length)fail();const key=item.track+'/'+item.tier;if(seen.has(key))fail();seen.add(key);for(const kind of ['race','team','test']){const m=item[kind];if(m===null)continue;if(!m||!validTime(m.seconds)||typeof m.team!=='string'||m.team.length>60||(!C.car(m.car)||(m.competitionTier===undefined?C.car(m.car).tier!==item.tier:kind==='test'||m.competitionTier!==item.tier)))fail();if(m.driver!==undefined&&(typeof m.driver!=='string'||m.driver.length>60))fail();if(m.legacy===true){if(kind!=='test'||m.number!==null||m.week!==null)fail();}else if(m.legacy!==undefined||!Number.isInteger(m.number)||m.number<0||m.number>99||!Number.isInteger(m.week)||m.week<1||m.week>1e7)fail();}if(item.team&&(!item.race||item.team.seconds<item.race.seconds))fail();}}
function profile(s,track,tier){const saved=s.circuitRecords?.find(x=>x.track===track&&x.tier===tier),result={track,tier,race:saved?.race?clone(saved.race):null,team:saved?.team?clone(saved.team):null,test:saved?.test?clone(saved.test):null};
 // Older saves retained tests but discarded race lap times. Recover only evidence that exists.
 for(const t of s.testHistory||[])if(t.track===track&&C.car(t.car)?.tier===tier)result.test=best(result.test,{seconds:t.best,team:s.name,car:t.car,number:null,week:null,legacy:true});
 const r=s.race;if(r?.track===track&&r.tier===tier){for(const e of r.entries)if(validTime(e.bestLap))result.race=best(result.race,{...mark(s,e,r.tier),provisional:true});const p=r.entries[0];if(validTime(p.bestLap))result.team=best(result.team,{...mark(s,p,r.tier),provisional:true});}
 return result;
}
function format(seconds){if(!validTime(seconds))return '—';const ms=Math.round(seconds*1000),minutes=Math.floor(ms/60000),rest=(ms%60000/1000).toFixed(3);return minutes?minutes+':'+rest.padStart(6,'0'):rest+' s';}
const api={recordRace,recordTest,validate,profile,format};root.OvalCircuitRecords=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
