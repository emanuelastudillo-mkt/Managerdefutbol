(function(root){
'use strict';
const difficulties=Object.freeze({
 easy:{name:'Fácil',cost:1,income:1,description:'Un comienzo accesible para conocer el equipo y disfrutar el camino.'},
 normal:{name:'Normal',cost:1.5,income:1.1,description:'Cada decisión cuenta. Un buen equilibrio entre progreso y desafío.'},
 hard:{name:'Difícil',cost:2,income:1.2,description:'Presupuesto ajustado y poco margen para improvisar. Prepará cada paso.'},
 superpro:{name:'SuperPro',cost:3,income:1.3,description:'La máxima exigencia: cuentas difíciles y rivales que defienden cada metro.'}
});
const options=Object.freeze({
 gender:[['male','Hombre'],['female','Mujer']],
 face:[['oval','Ovalada'],['square','Cuadrada'],['round','Redonda'],['angular','Angulosa'],['long','Alargada'],['heart','Corazón'],['highcheeks','Pómulos altos'],['broad','Mandíbula ancha'],['soft','Rasgos suaves'],['aquiline','Perfil marcado'],['freckled','Pecas'],['mature','Veterana']],
 hair:[['short','Corto'],['side','De costado'],['waves','Ondulado'],['curls','Rizado'],['long','Largo'],['ponytail','Coleta'],['shaved','Rapado'],['bob','Media melena'],['braids','Trenzas'],['undercut','Laterales cortos']],
 hairColor:[['black','Negro','#252932'],['brown','Castaño','#684533'],['chestnut','Cobrizo','#a35332'],['blond','Rubio','#d7ad65'],['silver','Canoso','#aeb8bf'],['red','Pelirrojo','#c66a3a']],
 eyes:[['brown','Marrones','#664731'],['hazel','Avellana','#9a8847'],['green','Verdes','#5d9773'],['blue','Azules','#608fad'],['gray','Grises','#939fa4']],
 skin:[['light','Claro','#e8b995'],['warm','Cálido','#ce926c'],['tan','Moreno','#a56e50'],['dark','Oscuro','#754c3e']]
});
const defaults=()=>({version:1,name:'Piloto',difficulty:'normal',appearance:{gender:'male',face:'oval',hair:'side',hairColor:'brown',eyes:'brown',skin:'warm'}});
const story=s=>!s.mode||s.mode==='story';
const count=text=>Array.from(text).length;
function normalize(input){
 if(!input||input.version!==1||typeof input.name!=='string'||!Object.hasOwn(difficulties,input.difficulty))throw Error('Personaje o dificultad inválidos.');
 if(/[\u0000-\u001f\u007f]/u.test(input.name))throw Error('Ingresá un nombre de 1 a 18 caracteres.');
 const name=input.name.trim().normalize('NFC');
 if(!name||count(name)>18||/[\u0000-\u001f\u007f<>\u202a-\u202e\u2066-\u2069]/u.test(name))throw Error('Ingresá un nombre de 1 a 18 caracteres.');
 const a=input.appearance;
 if(!a||typeof a!=='object'||Array.isArray(a)||Object.keys(a).length!==Object.keys(options).length||!Object.entries(options).every(([k,list])=>list.some(([id])=>id===a[k])))throw Error('Apariencia de personaje inválida.');
 return {version:1,name,difficulty:input.difficulty,appearance:Object.fromEntries(Object.keys(options).map(k=>[k,a[k]]))};
}
function get(s){if(story(s)&&s.storyProfile)return s.storyProfile;const p=defaults();p.name=s.staff?.find(p=>p.id==='owner')?.name||'Vos';p.difficulty='easy';return p;}
function level(s){return difficulties[story(s)?s.storyProfile?.difficulty||'easy':'easy'];}
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
function cost(s,n){return round(n*level(s).cost);}
function income(s,n){return round(n*level(s).income);}
function apply(s,input){if(!story(s))throw Error('La creación de personaje pertenece a Historia.');const p=normalize(input);s.storyProfile=p;const owner=s.staff.find(p=>p.id==='owner');owner.name=p.name;return p;}
function validate(s){if(s.race?.config?.storyDifficulty!==undefined&&(!story(s)||s.race.config.storyDifficulty!==(s.storyProfile?.difficulty||'easy')))throw Error('Dificultad de carrera inconsistente.');if(s.storyProfile===undefined)return;if(!story(s))throw Error('Perfil de historia en otro modo.');const p=normalize(s.storyProfile);if(Object.keys(s.storyProfile).length!==4||p.name!==s.storyProfile.name||s.staff.find(p=>p.id==='owner')?.name!==p.name)throw Error('Perfil de historia inconsistente.');if(s.race&&s.race.config?.storyDifficulty!==p.difficulty)throw Error('Dificultad de carrera inconsistente.');}
function adjustText(s,text,firstCash){let index=0;return String(text).replace(/\$[\d.]+(?:,\d+)?/g,(token,offset,full)=>{const raw=Number(token.slice(1).replaceAll('.','').replace(',','.'));const before=full.slice(Math.max(0,offset-16),offset).toLowerCase();if(index++===0&&firstCash)return '$'+(firstCash>0?income(s,firstCash):cost(s,-firstCash)).toLocaleString('es-AR',{maximumFractionDigits:2});const incoming=/\+\s*$|bono\s*$|apoyo\s*$|aporte\s*$/.test(before);return '$'+(incoming?income(s,raw):cost(s,raw)).toLocaleString('es-AR',{maximumFractionDigits:2});});}
const api={difficulties,options,defaults,story,count,normalize,get,level,cost,income,apply,validate,adjustText};root.GalponStoryProfile=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
