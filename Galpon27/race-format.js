(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null);
// Fixed sporting distance per circuit/category. Minutes are a planning reference,
// never a deadline. The table is calibrated with complete race simulations.
const distances={dust:[35,42,54,65,69],pampa:[22,27,34,40,42],mesa:[16,19,24,28,29],nogal:[2,2,2,3,3]};
for(const t of C.tracks.filter(t=>t.outline))distances[t.id]=t.raceLaps||(t.raceLaps=[0,1,2,3,4].map(tier=>Math.max(1,Math.round(([43,62,79,93,99][tier]/t.km)*C.raceMinutes[t.id]/12))));
const speedDistances=root.GalponSpeedDistances||(typeof require==='function'?require('./race-distances'):null);
for(const [id,values] of Object.entries(speedDistances))distances[id]=values;
const legacy=root.GalponLegacyDistances||(typeof require==='function'?require('./race-distances-legacy'):null);
function legacyLaps(track,tier){return legacy[track][tier];}
function laps(track,tier){if(!distances[track]||!Number.isInteger(tier)||tier<0||tier>4)throw Error('Distancia de carrera inválida.');return distances[track][tier];}
function remainingLaps(r,e){return Math.max(0,r.targetLaps-e.distance/C.track(r.track).km);}
function progress(r){if(r.targetLaps===undefined)return Math.min(1,r.time/r.duration);return Math.min(1,Math.max(0,...r.entries.filter(e=>e.status!=='dnf').map(e=>e.distance))/(C.track(r.track).km*r.targetLaps));}
function remainingSeconds(r,e,lap){return r.phase==='finished'?0:r.targetLaps===undefined?Math.max(0,r.duration-r.time):remainingLaps(r,e)*lap/(r.arcade?.motion||1);}
function wear(r,slot){return slot==='tyres'?(r.config.raceWear?.tyres??1):(r.config.raceWear?.mechanical??1);}
const api={laps,legacyLaps,remainingLaps,progress,remainingSeconds,wear};root.GalponRaceFormat=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
