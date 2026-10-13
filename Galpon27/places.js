(function(root){
'use strict';
const SP=root.GalponStoryProfile||(typeof require==='function'?require('./story-profile'):null);
const J=root.GalponJourney||(typeof require==='function'?require('./journey'):null),Q=root.GalponCareer||(typeof require==='function'?require('./career'):null);
const B=root.GalponBaseStory||(typeof require==='function'?require('./base-story'):null);
const family=['Romero','Acosta','Benítez','Molina','Duarte','Pereyra','Rojas','Aguirre','Ledesma','Castro','Medina','Sosa','Farias','Herrera','Vega','Cabrera','Luna','Navarro','Suárez'];
const labels={west:'Parcela oeste · futura telemetría',east:'Parcela este · estacionamiento',shop:'Repuestos',fuel:'Gasolinera',workshop:'Taller',house:'Casa del pueblo',house2:'Casa de la esquina',gate:'Entrada al circuito',office:'Dirección',team:'Sala del equipo',testing:'Banco de reglajes',control:'Control de carrera',market:'Repuestos y autos',paddock:'Paddock'};
const viewKeys={taller:'workshop',reglajes:'testing',direccion:'office',equipo:'team',mercado:'shop',estetica:'workshop',calendario:'gate',retos:'journal',mensajes:'messages'};
function buildings(s){const n=J.node(s.journey.location);if(n.id==='base')return ['workshop','office','team','testing','control','paddock','market','fuel','west','east'];const i=J.nodes.indexOf(n),shift=(i%3-1)*22;
 return [
 {id:'shop',x:75+shift,y:73,w:300,h:229},
 {id:'workshop',x:640-shift,y:65,w:320,h:213},
 {id:'fuel',x:100+shift,y:373,w:190,h:170},
 {id:'house',x:623-shift,y:388,w:170,h:138},
 ...(i%2?[{id:'house2',x:352+shift,y:407,w:135,h:110}]:[]),
 ...(n.challenge||n.circuit?[{id:'gate',x:865,y:247,w:175,h:115}]:[])
 ];
}
function allowed(s,key){if(key==='messages')return true;if(s.journey.trip)return false;if(key==='journal')return true;return buildings(s).some(b=>(typeof b==='string'?b:b.id)===key);}
function localPerson(s,key){const index=J.nodes.findIndex(n=>n.id===s.journey.location),i=index%3;
 const type=key==='fuel'?1:key==='shop'||key==='market'?0:2;
 const first=[['Celia','Osvaldo','Julieta'],['Mateo','Nora','Héctor'],['Elena','Ramiro','Lucía']][type][i];
 return {id:'local-'+s.journey.location+'-'+key,name:first+' '+family[(index+(key==='house2'?5:0))%family.length],role:labels[key]+' · '+J.node(s.journey.location).name,localPhoto:type*3+i};
}
function person(s,key){const challenge=Q.challenge(J.node(s.journey.location)?.challenge);if(key==='gate'&&challenge&&s.campaign?.tier===challenge.tier)return Q.person(challenge.rival);if(s.journey.location==='base'){const known={workshop:'alma',testing:'alma',office:'raul',team:s.career.contacts.includes('ines')?'ines':'alma',paddock:'raul',control:'raul',west:'alma',east:'alma'}[key];if(known)return Q.person(known);}if(key==='journal')return Q.person('raul');if(key==='messages')return Q.person('vera');return localPerson(s,key);}
function choices(s,key){const base=s.journey.location==='base';if(base&&!B.isOpen(s,key))return [{id:'renovate',text:'Remodelar '+B.names[key]+' · $'+SP.cost(s,B.costs[key]).toLocaleString('es-AR')}];switch(key){
case 'shop':case 'market':return base?[{id:'catalog',text:'Sí, quiero ver los repuestos.',view:'mercado'},{id:'cars',text:'Busco un auto.',view:'mercado'},{id:'inventory',text:'Quiero revisar mi depósito.',view:'mercado'},{id:'paint',text:'Quiero personalizar el auto.',view:'estetica'}]:[{id:'local-part',text:'Sí, ¿qué repuesto exclusivo tenés?'},{id:'inventory',text:'Quiero revisar los repuestos que traje.',view:'mercado'}];
case 'fuel':return [{id:'fuel',text:'Quiero cargar combustible.'},{id:'truck-repair',text:'¿Podés revisar la camioneta?'},...(J.assistanceAvailable(s)?[{id:'assistance',text:'No puedo seguir. Necesito asistencia.'}]:[])];
case 'workshop':return [...(base?[{id:'customer-jobs',text:'Quiero trabajar en los autos de clientes.',view:'taller'}]:[]),{id:'workshop',text:'Revisemos el auto y sus componentes.',view:'taller'},{id:'setup',text:'Quiero ajustar el reglaje.',view:'reglajes'},{id:'inventory',text:'Veamos los repuestos que llevo.',view:'mercado'}];
case 'west':return [{id:'setup',text:'Volver a los reglajes y pruebas actuales del taller.',view:'reglajes'}];
case 'east':return [{id:'fuel',text:'Revisemos combustible y estado de la camioneta.'},{id:'travel',text:'Salir al mapa de rutas.',view:'sede'}];
case 'testing':return [{id:'setup',text:'Quiero preparar y probar un reglaje.',view:'reglajes'}];
case 'office':return [{id:'office',text:'Revisemos las cuentas y las decisiones.',view:'direccion'}];
case 'team':return [{id:'team',text:'Hablemos de pilotos y mecánicos.',view:'equipo'}];
case 'control':case 'paddock':case 'gate':return [...(s.race?[{id:'race',text:'Quiero volver a mi carrera.',view:'carrera'}]:[]),{id:'official',text:'Quiero correr la fecha del campeonato.',view:'calendario'},...(J.node(s.journey.location).circuit?[{id:'local-race',text:'Quiero correr en este circuito.'}]:[]),...(J.node(s.journey.location).challenge?[{id:'challenge',text:'Vengo a desafiar al piloto local.'}]:[])];
case 'house':case 'house2':return [{id:'directions',text:'¿Qué hay por estos caminos?'},{id:'advice',text:'¿Algún consejo antes de seguir?'}];
default:return [];
}}
function greeting(s,key){const n=J.node(s.journey.location),c=Q.challenge(n.challenge);if(c&&s.career.completed.includes(c.id)&&key==='gate')return 'Te vi ganar el reto de '+n.name+'. El resultado ya está reconocido. Podemos revisar la fecha de campeonato o correr una carrera local; la recompensa del reto se entrega una sola vez.';switch(key){
case 'shop':case 'market':return '¡Hola! Bienvenido'+(n.id==='base'?' al mostrador de Galpón 27':' a Repuestos '+n.name)+'. ¿Deseás comprar algo o revisar lo que llevás?';
case 'fuel':return '¡Buenas! Acercá la camioneta al surtidor. ¿Querés cargar combustible o necesitás que la revisemos?';
case 'workshop':return n.id==='base'?'Soy Alma, tu amiga y mecánica. Voy a darte una mano en este taller: revisamos el auto, cambiamos piezas y preparamos los reglajes antes de salir. ¿Por dónde empezamos?':'Hola, ¿cómo llegó el auto? Podemos revisar sus componentes, montar repuestos o preparar un reglaje.';
case 'gate':case 'paddock':case 'control':return 'Bienvenido al paddock. Podemos inscribirte en la carrera local, revisar el campeonato'+(n.challenge?' o aceptar el reto del piloto local':'')+'. ¿Qué querés correr?';
case 'house':case 'house2':return '¡Hola! Vi tu camioneta y el auto de carreras. Bienvenido a '+n.name+'. ¿En qué puedo ayudarte?';
case 'west':return 'Esta parcela queda reservada para un futuro banco de telemetría: subiremos el auto a un aparato computarizado para medir velocidad máxima y temperaturas máximas y óptimas. Todavía no está construido. Por ahora hacemos los reglajes y las pruebas disponibles en el taller.';
case 'east':return 'Acá estacionamos la camioneta con el auto enganchado. Es la misma que usás para recorrer el mapa: cada viaje consume combustible y la desgasta. Antes de salir podemos pasar por el surtidor.';
case 'office':if(B.isOpen(s,'office'))return 'Bienvenido a Dirección. La casa ya está remodelada. Acá revisamos las cuentas, los acuerdos y las decisiones del equipo.';return 'Esta casita va a ser Dirección. Está abandonada y tiene las ventanas tapiadas; remodelarla cuesta $'+SP.cost(s,1200).toLocaleString('es-AR')+' y habilita las funciones de Dirección. Te presto todo el lugar para que hagas tu camino en el automovilismo. Primero revisemos las cuentas y cuánto podemos invertir.';
case 'team':if(B.isOpen(s,'team'))return 'La sala del equipo ya está lista. Podemos revisar contratos y asignaciones de pilotos y mecánicos.';return s.career.contacts.includes('ines')?'Soy Inés. Acá reunimos a los pilotos y mecánicos del equipo. Remodelarla cuesta $'+SP.cost(s,1800).toLocaleString('es-AR')+' y habilita las funciones del Equipo; revisemos el presupuesto y los contratos antes de decidir.':'Esta casita será la sala del equipo. Hoy está tapiada: remodelarla cuesta $'+SP.cost(s,1800).toLocaleString('es-AR')+' y habilita las funciones del Equipo. Yo te ayudo en el taller; para las carreras podemos revisar qué pilotos y mecánicos contratar con el presupuesto disponible.';
default:return 'Hola. Traé tus anotaciones y veamos cómo preparar la próxima etapa.';
}}
const api={labels,viewKeys,buildings,allowed,person,choices,greeting};root.GalponPlaces=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
