(function(root){
'use strict';
const slots=[
 {id:'engine',name:'Motor',short:'MOTOR',icon:'◈',desc:'Potencia, consumo y resistencia mecánica.'},
 {id:'intake',name:'Admisión',short:'ADMISIÓN',icon:'≋',desc:'Respiración del motor y respuesta al acelerador.'},
 {id:'gearbox',name:'Caja de cambios',short:'CAJA',icon:'⚙',desc:'Eficiencia de transmisión y velocidad de los cambios.'},
 {id:'differential',name:'Diferencial',short:'DIFERENCIAL',icon:'⊙',desc:'Tracción al salir de las curvas del óvalo.'},
 {id:'suspension',name:'Suspensión',short:'SUSPENSIÓN',icon:'⌁',desc:'Apoyo, estabilidad y conservación de neumáticos.'},
 {id:'brakes',name:'Frenos',short:'FRENOS',icon:'◎',desc:'Control en curvas y resistencia de los discos.'},
 {id:'tyres',name:'Neumáticos',short:'NEUMÁTICOS',icon:'◉',desc:'Compuesto, agarre y duración de cada juego.'},
 {id:'cooling',name:'Refrigeración',short:'RADIADOR',icon:'▦',desc:'Control térmico en tandas largas.'},
 {id:'aero',name:'Aerodinámica',short:'AERO',icon:'⌒',desc:'Carga en curva a cambio de resistencia al avance.'},
 {id:'exhaust',name:'Escape',short:'ESCAPE',icon:'≡',desc:'Entrega de potencia y reducción de peso.'},
 {id:'tank',name:'Depósito',short:'DEPÓSITO',icon:'▣',desc:'Autonomía, peso y tiempo entre paradas.'}
];
const grades=[
 {name:'Desguace',brand:'RECUPERADO',color:'#8b9693',factor:.78,price:.46,tier:0,condition:72},
 {name:'Club',brand:'RUTA',color:'#e8a555',factor:1,price:1,tier:0,condition:100},
 {name:'Sport',brand:'FORJA',color:'#dd6244',factor:1.16,price:2.2,tier:1,condition:100},
 {name:'Endurance',brand:'VECTOR',color:'#51a39a',factor:1.3,price:4.9,tier:2,condition:100},
 {name:'Pro',brand:'APEX WORKS',color:'#aaa0cf',factor:1.46,price:9.8,tier:3,condition:100}
];
const basePrices={engine:1100,intake:260,gearbox:650,differential:430,suspension:520,brakes:360,tyres:300,cooling:390,aero:310,exhaust:280,tank:440};
const partNames={engine:['2.0 de calle','2.2 preparado','V6 de competición','V8 larga duración','V8 oval spec'],intake:['Filtro recuperado','Doble filtro','Plenum de aluminio','Admisión sellada','Ram-air carbono'],gearbox:['Manual 4 marchas','Manual reforzada','Close-ratio 5','Secuencial 6','Secuencial Pro'],differential:['Abierto usado','Autoblocante 25%','LSD de discos','LSD endurance','LSD competición'],suspension:['Amortiguadores usados','Coilovers Club','Monotubo Sport','Doble vía Enduro','Tres vías Pro'],brakes:['Discos de serie','Discos ventilados','Pinzas 4 pistones','Enduro 6 pistones','Pro flotantes'],tyres:['Calle usados','Duro Club','Medio Sport','Duro Endurance','Blando clasificación'],cooling:['Radiador de serie','Aluminio Club','Doble núcleo','Triple núcleo','Intercambiador Pro'],aero:['Carrocería de calle','Labio + spoiler','Splitter Sport','Alerón Enduro','Alerón + difusor'],exhaust:['Escape de serie','Colector 4-2-1','Línea inoxidable','Línea de titanio','Salida lateral Pro'],tank:['Tanque 42 litros','Celda 55 litros','Celda 68 litros','Celda 86 litros','Celda 105 litros']};
const parts=slots.flatMap(slot=>grades.map((g,i)=>({
 id:slot.id+'-'+i,slot:slot.id,name:partNames[slot.id][i],grade:i,brand:g.brand,color:g.color,tier:g.tier,
 price:Math.round(basePrices[slot.id]*g.price/10)*10,factor:g.factor,initialCondition:g.condition,
 durability:slot.id==='tyres'?[.7,1.15,.88,1.6,.65][i]:[.74,1,1.16,1.52,1.45][i],
 weight:[1.07,1,.94,.9,.84][i],capacity:slot.id==='tank'?[42,55,68,86,105][i]:0,
 grip:slot.id==='tyres'?[.86,1,1.13,1.06,1.27][i]:0
})));
const categories=[
 {id:'scrap',name:'Circuitos amateur',label:'DIVISIÓN DE BARRIO',tier:0,rep:0,entry:180,prize:1050,sponsor:180,color:'#e9a85f',legacyMinutes:[45,60,45,75,60,90],minutes:[10,12,15,15,12,15],story:'Stock cars usados, manos manchadas de aceite y una oportunidad.'},
 {id:'club',name:'Liga regional',label:'CAMPEONATO REGIONAL',tier:1,rep:24,entry:650,prize:3100,sponsor:500,color:'#5bafa5',legacyMinutes:[90,120,90,150,120,180],minutes:[10,12,15,15,12,15],story:'El equipo deja de ser un sueño de fin de semana.'},
 {id:'national',name:'Campeonato nacional',label:'SERIE NACIONAL',tier:2,rep:65,entry:1800,prize:7800,sponsor:1200,color:'#e36e50',legacyMinutes:[180,240,180,300,240,360],minutes:[10,12,15,15,12,15],story:'Más velocidad. Más exposición. Más responsabilidad.'},
 {id:'pro',name:'Liga mundial',label:'LA CIMA DEL ENDURANCE',tier:3,rep:130,entry:4800,prize:21000,sponsor:3200,color:'#a59acb',legacyMinutes:[360,480,360,600,480,720],minutes:[10,12,15,15,12,15],story:'De un galpón prestado a competir entre los mejores.'},
 {id:'elite',name:'Copa Elite',label:'LA ÚLTIMA REFERENCIA',tier:4,rep:210,entry:6400,prize:28000,sponsor:4400,color:'#e5c16f',legacyMinutes:[360,480,360,600,480,720],minutes:[10,12,15,15,12,15],story:'Precisión, constancia y un equipo que sostiene cada decisión.'}
];
const cars=[
 {id:'cedar',baseSpeed:200,name:'Cedar 88',subtitle:'Stock 01 · base usada',tier:0,price:2200,power:112,mass:1160,drag:1.08,shape:'sedan',color:'#d76b4d'},
 {id:'comet',baseSpeed:215,name:'Comet RS',subtitle:'Stock 01 · preparación inicial',tier:0,price:5400,power:133,mass:1080,drag:1,shape:'coupe',color:'#dcba5c'},
 {id:'bison',baseSpeed:220,name:'Bison Club',subtitle:'Stock regional · 2005',tier:1,price:13500,power:208,mass:1210,drag:.96,shape:'muscle',color:'#6a9693'},
 {id:'arrow',baseSpeed:225,name:'Arrow R6',subtitle:'Stock 01 · chasis tubular',tier:1,price:19500,power:232,mass:1150,drag:.92,shape:'coupe',color:'#b7bac0'},
 {id:'stallion',baseSpeed:285,name:'Stallion V8',subtitle:'Stock nacional · 2018',tier:2,price:44000,power:358,mass:1310,drag:.88,shape:'muscle',color:'#bd5757'},
 {id:'falcon',baseSpeed:295,name:'Falcon Enduro',subtitle:'Stock endurance · 2021',tier:2,price:58000,power:390,mass:1260,drag:.86,shape:'stock',color:'#557b99'},
 {id:'thunder',baseSpeed:340,name:'Thunder X',subtitle:'Pro stock · 2025',tier:3,price:125000,power:530,mass:1340,drag:.81,shape:'stock',color:'#8674a8'},
 {id:'nova',baseSpeed:365,name:'Nova Works',subtitle:'Pro endurance · 2026',tier:3,price:165000,power:575,mass:1280,drag:.79,shape:'stock',color:'#46766c'},
 {id:'condor',baseSpeed:395,name:'Cóndor 27',subtitle:'Elite · chasis de larga duración',tier:4,price:220000,power:620,mass:1280,drag:.78,shape:'stock',color:'#c7aa62'},
 {id:'aurora',baseSpeed:440,name:'Aurora E27',subtitle:'Elite · desarrollo oficial',tier:4,price:275000,power:655,mass:1250,drag:.77,shape:'stock',color:'#bfc9cc'}
];
const tracks=[
 {id:'dust',name:'Óvalo del Astillero',location:'Puerto Viejo',km:.82,radius:102,straight:170,bank:5,abrasion:1.08,temp:24,grip:.94,gearing:28,spring:34,pressure:38,downforce:27,desc:'Corto, plano y áspero. Importa salir bien de cada curva.',color:'#b4a18a'},
 {id:'pampa',name:'Anillo de la Pampa',location:'Santa Lucía',km:1.6,radius:128,straight:250,bank:14,abrasion:.84,temp:29,grip:1.02,gearing:57,spring:56,pressure:53,downforce:49,desc:'Un óvalo equilibrado con peralte medio y largas tandas.',color:'#a9b29a'},
 {id:'mesa',name:'Gran Óvalo del Sol',location:'Valle Seco',km:2.85,radius:165,straight:350,bank:24,abrasion:.92,temp:35,grip:1.06,gearing:83,spring:75,pressure:66,downforce:72,desc:'Rápido, caluroso y muy peraltado. Cuidá la temperatura.',color:'#c2ac8b'},
 {id:'nogal',name:'Anillo Largo de El Nogal',location:'El Nogal',km:28.5,radius:450,straight:3500+1200*Math.PI,bank:12,abrasion:.82,temp:23,grip:1.02,gearing:90,spring:65,pressure:58,downforce:45,pitCompact:true,maxLapFuelFraction:.5,maxLapTyreWear:35,desc:'28,5 km entre bosques y rectas extensas. Diez veces el Gran Óvalo del Sol. Único acceso a boxes en la recta norte: pedí la parada antes de pasarlo.',color:'#78976d'}
];
const setups=[
 {id:'gearing',name:'Relación final',left:'Corta · aceleración',right:'Larga · velocidad',help:'Una relación demasiado larga penaliza las salidas; una corta limita la velocidad final.'},
 {id:'spring',name:'Dureza de suspensión',left:'Blanda',right:'Firme',help:'Adaptá el apoyo al peralte. Una suspensión fuera de equilibrio castiga las gomas.'},
 {id:'pressure',name:'Presión de neumáticos',left:'Baja · flexión',right:'Alta · rigidez',help:'Desviarse de la ventana de presión pierde agarre y aumenta el desgaste.'},
 {id:'downforce',name:'Carga aerodinámica',left:'Baja resistencia',right:'Más apoyo',help:'Más carga mejora el apoyo, pero suma resistencia en las rectas.'},
 {id:'cooling',name:'Apertura de refrigeración',left:'Cerrada · velocidad',right:'Abierta · protección',help:'Abrir enfría el motor a costa de velocidad. Fundamental con calor y mucho ritmo.'},
 {id:'bias',name:'Balance de frenos',left:'Más atrás',right:'Más adelante',help:'Un reparto desequilibrado aumenta las correcciones y la pérdida de tiempo.'}
];
const people=[
 {id:'ines',name:'Inés Ferreyra',role:'driver',age:24,skill:58,care:74,stamina:78,fee:800,wage:160,rep:0,color:'#7e9d92',initials:'IF',bio:'Corre karting desde chica. Busca un equipo que le dé una primera oportunidad.'},
 {id:'tomas',name:'Tomás Ríos',role:'driver',age:31,skill:67,care:57,stamina:68,fee:1500,wage:240,rep:10,color:'#b78666',initials:'TR',bio:'Rápido en clasificación. Todavía está aprendiendo a cuidar el auto durante horas.'},
 {id:'mar',name:'Mar Aguirre',role:'driver',age:29,skill:76,care:86,stamina:88,fee:3800,wage:480,rep:24,color:'#7c90ac',initials:'MA',bio:'Especialista en tandas largas. Su mejor vuelta suele ser la última.'},
 {id:'bruno',name:'Bruno Costa',role:'driver',age:38,skill:85,care:80,stamina:83,fee:9000,wage:1050,rep:65,color:'#a38caa',initials:'BC',bio:'Veterano de stock cars. Puede leer una carrera antes de que cambie.'},
 {id:'luz',name:'Luz Navarro',role:'driver',age:27,skill:94,care:89,stamina:94,fee:23000,wage:2400,rep:130,color:'#c0a46d',initials:'LN',bio:'Piloto de fábrica. Quiere volver a un equipo donde su voz cuente.'},
 {id:'alma',name:'Alma Vidal',role:'mechanic',age:26,skill:54,care:74,stamina:70,fee:550,wage:110,rep:0,color:'#bb9366',initials:'AV',bio:'Trabajó en un taller de barrio. Ingeniosa, metódica y lista para viajar.'},
 {id:'oscar',name:'Óscar Medina',role:'mechanic',age:49,skill:69,care:83,stamina:62,fee:1450,wage:200,rep:8,color:'#829caa',initials:'OM',bio:'Reconstruye motores desde antes de que vos aprendieras a manejar.'},
 {id:'vero',name:'Vero Salas',role:'mechanic',age:33,skill:82,care:88,stamina:80,fee:4200,wage:470,rep:24,color:'#9e9e79',initials:'VS',bio:'Especialista en boxes. Cree que una buena parada se gana antes de empezar.'},
 {id:'elias',name:'Elías Duarte',role:'mechanic',age:36,skill:93,care:95,stamina:87,fee:12000,wage:1200,rep:65,color:'#a1867a',initials:'ED',bio:'Ingeniero de competición. Deja una estructura grande para construir algo propio.'}
];
const rivals=['Taller Roldán','Los del Puente','Sur Motor','Escudería Brava','Línea Roja','Hierro Racing','Estrella Norte','Cobalto Sport','Delta Garage'];
const rivalColors=['#cbac65','#559a9c','#8b7fac','#c46f62','#6e899a','#8b9c6b','#b68662','#737d93','#bf8b9e'];
const stories=[
 {id:'first',title:'Un galpón, un auto y tus ahorros.',rep:0,body:'El Cedar está listo. Tu nombre figura como director, mecánico y primer piloto. Un comercio del barrio ofrece ayudarte: quiere verte terminar la primera carrera.',choices:[{text:'Aceptar el apoyo del barrio',detail:'+$450 · +1 reputación',cash:450,rep:1},{text:'Mantener el proyecto independiente',detail:'+3 reputación',cash:0,rep:3}]},
 {id:'bench',title:'La mesa del fondo ya queda chica.',rep:14,body:'Después de varias carreras, una escuela técnica propone colaborar. Podés invertir en herramientas para mejorar los boxes o hacer una exhibición para ganar apoyo.',choices:[{text:'Equipar el taller',detail:'−$650 · herramientas +1',cash:-650,tools:1},{text:'Organizar una jornada abierta',detail:'+$500 · +4 reputación',cash:500,rep:4}]},
 {id:'regional',title:'Una invitación al regional.',rep:24,body:'Ya conocen tu equipo fuera del barrio. Un patrocinador ofrece un aporte para comprar el primer stock regional. También podés usar el contacto para sumar prestigio.',choices:[{text:'Financiar el salto de categoría',detail:'+$3.500',cash:3500},{text:'Construir relaciones a largo plazo',detail:'+8 reputación',rep:8}]},
 {id:'national',title:'El equipo ya tiene historia.',rep:65,body:'Una marca quiere aparecer en tu próxima temporada nacional. El acuerdo puede financiar piezas o mejorar de forma permanente tu taller.',choices:[{text:'Invertir en el auto',detail:'+$8.000',cash:8000},{text:'Preparar mejores paradas',detail:'herramientas +2',tools:2}]},
 {id:'pro',title:'El mismo sueño, otra escala.',rep:130,body:'Todavía conservás la primera llave del galpón. Llegaron ofertas para la serie profesional. Tu próxima decisión ya no es cómo empezar, sino hasta dónde llegar.',choices:[{text:'Firmar el patrocinio profesional',detail:'+$22.000',cash:22000},{text:'Invertir en la estructura',detail:'+$10.000 · herramientas +2',cash:10000,tools:2}]}
];
for(const [index,base,id,name] of [[0,'cooling-1','cooling-c27','Radiador Astillero G27'],[1,'suspension-2','suspension-r27','Suspensión Regional G27'],[2,'tank-3','tank-n27','Celda Nacional 92 L'],[3,'cooling-4','cooling-m27','Refrigeración Mundial G27'],[4,'suspension-4','suspension-e27','Suspensión Elite G27']]){const original=parts.find(p=>p.id===base);parts.push({...original,id,name,brand:'GALPÓN 27 / DESARROLLO',price:Math.round(original.price*1.25),factor:original.factor*1.04,durability:original.durability*1.12,capacity:id==='tank-n27'?92:original.capacity,unlockChallenge:'reto-'+index+'-1'});}
const raceMinutes={dust:10,pampa:12,mesa:15,nogal:15};
const raceSchedule=['dust','pampa','mesa','nogal','pampa','mesa'];
const expanded=root.GalponTrackExpansion||(typeof require==='function'?require('./track-expansion'):[]);tracks.push(...expanded);for(const t of expanded)raceMinutes[t.id]=t.km<1.1?10:t.km>3?15:12;
const grandPrix=root.GalponGrandPrix||(typeof require==='function'?require('./grand-prix-tracks'):[]);tracks.push(...grandPrix);for(const t of grandPrix)raceMinutes[t.id]=t.km>=6?15:t.downforce>=90?12:10;
function legacySchedule(tier,season){return season===1?raceSchedule:raceSchedule.map((_,i)=>expanded[((season-2)*6+tier*5+i)%expanded.length].id);}
function schedule(tier,season,edition=2){if(edition===1)return legacySchedule(tier,season);const pool=grandPrix.filter(t=>t.championshipTier===tier);if(season===1)return pool.length===5?[[ 'dust','pampa','mesa','nogal','mesa'][tier],...pool.map(t=>t.id)]:['mesa',...pool.slice(0,2).map(t=>t.id),'nogal',...pool.slice(2).map(t=>t.id)];return [...Array.from({length:3},(_,i)=>expanded[((season-2)*3+tier*5+i)%expanded.length].id),...Array.from({length:3},(_,i)=>pool[((season-2)*3+i)%pool.length].id)];}
function scheduleFor(s,tier){const l=s.leagues[tier];return schedule(tier,l.season,l.calendarVersion??s.calendarVersion??1);}
const api={scheduleFor,grandPrix,legacySchedule,schedule,raceSchedule,raceMinutes,version:'0.6.0',slots,grades,parts,categories,cars,tracks,setups,people,rivals,rivalColors,stories,part:id=>parts.find(p=>p.id===id),car:id=>cars.find(c=>c.id===id),track:id=>tracks.find(t=>t.id===id)};
root.OvalCatalog=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
