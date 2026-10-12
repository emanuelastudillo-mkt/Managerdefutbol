(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null),original=C.rivals.slice(0,9);
const origins=['Cóndor','Pampa','Astillero','Sierra','Nogal','Herrerías','Fortaleza','Patagonia','Horizonte','Algarrobo','Centenario','Trébol','Cauce','Cumbre','Andén','Vértice','Quimera','Ruta Sur','Puerto'];
const suffixes=['Motorsport','Competición','Racing','Sport','Motor Club','Escudería','Performance','Endurance','Garage','Team'];
function hex(h){const s=.55,l=.46,c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs(h/60%2-1)),m=l-c/2,a=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return '#'+a.map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('');}
const first=['Martín','Lucía','Tomás','Sofía','Nicolás','Camila','Julián','Valentina','Mateo','Emilia','Bruno','Clara','Diego','Paula','Santiago','Abril','Leandro','Marina','Ramiro','Elena'];
const last=['Ferreyra','Acosta','Medina','Suárez','Benítez','Vega','Ríos','Molina','Cabrera','Sosa'];
const names=[...original,...origins.flatMap(a=>suffixes.map(b=>a+' '+b))];
const teams=Object.freeze(names.map((name,i)=>Object.freeze({id:'team-'+String(i+1).padStart(3,'0'),name,color:i<9?C.rivalColors[i]:hex(i*137.508%360),number:i<9?11+i*7:91+i,pilot:first[i%20]+' '+last[Math.floor(i/20)%10]})));
const byId=new Map(teams.map(t=>[t.id,t]));C.teams=teams;C.rivals.splice(0,C.rivals.length,...names);
function roster(seed){let n=seed>>>0;const pool=teams.map(t=>t.id);for(let i=pool.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}return Array.from({length:5},(_,tier)=>pool.slice(tier*9,tier*9+9));}
function assign(s,seed=s.seed){s.rivalSeed=seed>>>0;s.rivalRoster=roster(s.rivalSeed);return s;}
function randomize(s){const a=new Uint32Array(1);if(root.crypto?.getRandomValues)root.crypto.getRandomValues(a);else a[0]=(Date.now()^Math.floor(Math.random()*4294967296))>>>0;return assign(s,a[0]);}
function forTier(s,tier){return s.rivalRoster?s.rivalRoster[tier].map(id=>byId.get(id)):teams.slice(0,9);}
function validate(s){if(s.rivalRoster===undefined&&s.rivalSeed===undefined)return;if(!Number.isInteger(s.rivalSeed)||s.rivalSeed<0||s.rivalSeed>4294967295||!Array.isArray(s.rivalRoster)||s.rivalRoster.length!==5||s.rivalRoster.some(row=>!Array.isArray(row)||row.length!==9||row.some(id=>!byId.has(id)))||new Set(s.rivalRoster.flat()).size!==45)throw Error('Equipos rivales guardados inválidos.');}
const api={teams,roster,assign,randomize,forTier,validate};root.GalponRivalTeams=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
