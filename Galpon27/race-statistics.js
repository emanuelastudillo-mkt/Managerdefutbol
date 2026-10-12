(function(root){
'use strict';
const Speed=root.GalponVehicleSpeed||(typeof require==='function'?require('./vehicle-speed'):null);
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog.js'):null);
const copy=x=>x===null?null:JSON.parse(JSON.stringify(x));
const positive=x=>typeof x==='number'&&Number.isFinite(x)&&x>0;
const recordKeys=['fastestLap','topSpeed','playerFastestLap','playerTopSpeed'];
function emptyRecords(){return {version:1,fastestLap:null,topSpeed:null,playerFastestLap:null,playerTopSpeed:null};}
function mark(e,value,driver=null,lap){return {value,driver,entryId:e.id,team:e.name,number:e.number,...(lap===undefined?{}:{lap})};}
function initialize(e){e.statistics={version:1,lastLap:e.lastLap>0?mark(e,e.lastLap,null,e.laps):null,fastestLap:e.bestLap>0?mark(e,e.bestLap,null,null):null,topSpeed:null};}
function observe(r,e,beforeDistance){
 if(e.status==='finished')return;if(!e.statistics)initialize(e);
 const s=e.statistics,speed=e.traffic?.speed||0,driver=e.drivers[e.driverIndex].name;
 if(speed>0&&(!s.topSpeed||speed>s.topSpeed.value))s.topSpeed=mark(e,speed,driver);
 const km=C.track(r.track).km,laps=Math.floor(Math.max(0,e.distance)/km);
 if(laps<=e.laps)return;
 // Interpolate the crossing within the simulation's one-second step. The
 // remaining fraction belongs to the following lap, including time in boxes.
 const fraction=Math.max(0,Math.min(1,(laps*km-beforeDistance)/Math.max(1e-12,e.distance-beforeDistance)));
 const seconds=Math.max(.001,e.lapClock-(1-fraction));
 e.lastLap=seconds;e.bestLap=e.bestLap>0?Math.min(e.bestLap,seconds):seconds;e.lapClock=1-fraction;e.laps=laps;
 s.lastLap=mark(e,seconds,driver,laps);
 if(!s.fastestLap||seconds<s.fastestLap.value)s.fastestLap=copy(s.lastLap);
}
function entry(e){const s=e.statistics;return {lastLap:e.lastLap>0?copy(s?.lastLap?.value===e.lastLap?s.lastLap:mark(e,e.lastLap,null,e.laps)):null,fastestLap:e.bestLap>0?copy(s?.fastestLap?.value===e.bestLap?s.fastestLap:mark(e,e.bestLap,null,null)):null,topSpeed:copy(s?.topSpeed||null)};}
function choose(a,b,kind){return b&&(!a||(kind==='topSpeed'?b.value>a.value:b.value<a.value))?copy(b):a;}
function summary(r){let fastestLap=null,topSpeed=null;for(const e of r.entries){const s=entry(e);fastestLap=choose(fastestLap,s.fastestLap,'fastestLap');topSpeed=choose(topSpeed,s.topSpeed,'topSpeed');}return {version:1,fastestLap,topSpeed,player:entry(r.entries[0])};}
function save(s,r,stats){const records=s.raceStatistics||(s.raceStatistics=emptyRecords()),enrich=m=>m?{...copy(m),track:r.track,tier:r.tier,week:s.week}:null;for(const [key,m] of [['fastestLap',stats.fastestLap],['topSpeed',stats.topSpeed],['playerFastestLap',stats.player.fastestLap],['playerTopSpeed',stats.player.topSpeed]])records[key]=choose(records[key],enrich(m),key.includes('Speed')?'topSpeed':'fastestLap');}
function validMark(m,kind,stored=false){
 if(m===null)return true;if(!m||Array.isArray(m)||!positive(m.value)||m.value>(kind==='topSpeed'?Speed.MAX_SPEED:1e6)||!(m.driver===null||typeof m.driver==='string'&&m.driver.length<=60)||!['player','r0','r1','r2','r3','r4','r5','r6','r7','r8'].includes(m.entryId)||typeof m.team!=='string'||m.team.length>60||!Number.isInteger(m.number)||m.number<0||m.number>99)return false;
 if(kind!=='topSpeed'&&m.lap!==null&&(!Number.isInteger(m.lap)||m.lap<0||m.lap>1e7))return false;
 if(stored&&(!C.track(m.track)||!Number.isInteger(m.tier)||m.tier<0||m.tier>=C.categories.length||!Number.isInteger(m.week)||m.week<1||m.week>1e7))return false;
 return true;
}
function validateEntry(e){const s=e.statistics;if(s===undefined)return;const fail=()=>{throw Error('Estadísticas de participante inválidas.');};if(!s||s.version!==1)fail();for(const key of ['lastLap','fastestLap','topSpeed']){const m=s[key];if(!validMark(m,key==='topSpeed'?key:'lap'))fail();if(m&&(m.entryId!==e.id||m.team!==e.name||m.number!==e.number||m.driver!==null&&!e.drivers.some(d=>d.name===m.driver)||key!=='topSpeed'&&m.lap>e.laps))fail();}if(s.lastLap&&s.lastLap.value!==e.lastLap||s.fastestLap&&s.fastestLap.value!==e.bestLap)fail();}
function validateSummary(s){if(s===undefined)return;const fail=()=>{throw Error('Estadísticas de carrera inválidas.');};if(!s||s.version!==1||!s.player)fail();for(const key of ['fastestLap','topSpeed'])if(!validMark(s[key],key))fail();for(const key of ['lastLap','fastestLap','topSpeed'])if(!validMark(s.player[key],key==='topSpeed'?key:'lap')||s.player[key]&&s.player[key].entryId!=='player')fail();if(s.player.fastestLap&&(!s.fastestLap||s.fastestLap.value>s.player.fastestLap.value)||s.player.topSpeed&&(!s.topSpeed||s.topSpeed.value<s.player.topSpeed.value))fail();}
function validateRecords(s){if(s===undefined)return;if(!s||s.version!==1||recordKeys.some(k=>!validMark(s[k],k.includes('Speed')?'topSpeed':'lap',true)||k.startsWith('player')&&s[k]&&s[k].entryId!=='player'))throw Error('Récords de carrera inválidos.');}
const api={emptyRecords,initialize,observe,entry,summary,save,validateEntry,validateSummary,validateRecords};root.GalponRaceStatistics=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
