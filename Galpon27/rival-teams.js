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
const fieldSizes=[24,22,20,18,16],size=(tier,version=2)=>version===2?fieldSizes[tier]:10;
function roster(seed,expanded=true){let n=seed>>>0;const pool=teams.map(t=>t.id);for(let i=pool.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}let offset=0;return Array.from({length:5},(_,tier)=>{const count=expanded?fieldSizes[tier]-1:9,row=pool.slice(offset,offset+count);offset+=count;return row;});}
function assign(s,seed=s.seed){s.rivalSeed=seed>>>0;s.rivalRoster=roster(s.rivalSeed,s.fieldVersion===2);return s;}
function randomize(s){const a=new Uint32Array(1);if(root.crypto?.getRandomValues)root.crypto.getRandomValues(a);else a[0]=(Date.now()^Math.floor(Math.random()*4294967296))>>>0;return assign(s,a[0]);}
function forTier(s,tier){return s.rivalRoster?s.rivalRoster[tier].map(id=>byId.get(id)):teams.slice(0,size(tier,s.fieldVersion??1)-1);}
function validate(s){if(s.rivalRoster===undefined&&s.rivalSeed===undefined)return;if(!Number.isInteger(s.rivalSeed)||s.rivalSeed<0||s.rivalSeed>4294967295||!Array.isArray(s.rivalRoster)||s.rivalRoster.length!==5||s.rivalRoster.some((row,tier)=>!Array.isArray(row)||row.length!==size(tier,s.fieldVersion??1)-1||row.some(id=>!byId.has(id)))||new Set(s.rivalRoster.flat()).size!==(s.fieldVersion===2?95:45))throw Error('Equipos rivales guardados inválidos.');}
function expand(s){if(s.fieldVersion===2)return;const old=s.rivalRoster||roster(s.rivalSeed??s.seed,false),used=new Set(old.flat()),pool=roster(s.rivalSeed??s.seed,true).flat().concat(teams.map(t=>t.id)).filter((id,i,a)=>!used.has(id)&&a.indexOf(id)===i);let offset=0;s.rivalRoster=old.map((row,tier)=>{const count=fieldSizes[tier]-1-row.length,next=row.concat(pool.slice(offset,offset+count));offset+=count;return next;});s.rivalSeed=(s.rivalSeed??s.seed)>>>0;s.leagues.forEach((l,tier)=>{while(l.points.length<fieldSizes[tier])l.points.push(0);});s.fieldVersion=2;}
const api={fieldSizes,size,expand,teams,roster,assign,randomize,forTier,validate};root.GalponRivalTeams=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
