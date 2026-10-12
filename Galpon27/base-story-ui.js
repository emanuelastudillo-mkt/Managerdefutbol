(function(root){
'use strict';
const D=root.GalponPlacesUI,P=root.GalponPlaces,E=root.OvalEngine,N=root.GalponStory;
const originalBase=D.base,B=root.GalponBaseStory;
const money=v=>'$'+v.toLocaleString('es-AR');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image='assets/pixel/sede-historia-v44.png';
function spot(id,x,y,w,h,title,detail,tag=''){
 return `<button class="story-base-place" data-action="open-building" data-place="${id}" style="--x:${x}%;--y:${y}%;--w:${w}%;--h:${h}%" aria-label="${esc(title+' · '+detail)}"><span class="story-base-label"><strong>${esc(title)}</strong>${tag?`<small>${esc(tag)}</small>`:''}<span>${esc(detail)}</span></span></button>`;
}
function base(s){
 const car=E.active(s),spec=root.OvalCatalog.car(car.id),office=B.isOpen(s,'office'),team=B.isOpen(s,'team');
 return `<section class="world-view story-headquarters"><header class="world-heading"><div><div class="eyebrow">HISTORIA / TU BASE · SEMANA ${s.week}</div><h1>Galpón 27</h1>${s.storyProfile?`<div class="story-profile-chip">${GalponCharacterAvatar.portrait(s.storyProfile)}<b>${esc(s.storyProfile.name)}</b><small>${GalponStoryProfile.level(s).name}</small></div>`:''}<p>Raúl te presta el lugar. Alma te acompaña en el taller. El camino empieza acá.</p></div><span class="world-category">${esc(root.OvalCatalog.categories[spec.tier].name)}</span></header><div class="world-map-frame"><div class="map-scroll"><div class="pixel-scene story-base-scene"><img src="${image}" width="1536" height="1024" alt="Galpón 27: taller con cartel de neón viejo y apagado; casas de Dirección y Equipo; parcela oeste vacía y estacionamiento de la camioneta al este.">
 ${office?'<img class="story-base-restored office" src="assets/pixel/sede-remodelada-v44.png" width="1536" height="1024" alt="Dirección remodelada">':''}
 ${team?'<img class="story-base-restored team" src="assets/pixel/sede-remodelada-v44.png" width="1536" height="1024" alt="Equipo remodelado">':''}
 <canvas id="storyTruckCanvas" aria-label="Tu camioneta con el auto actual enganchado, estacionada en la parcela este"></canvas>
 ${spot('workshop',12,3.4,39,29,'Taller de Alma','Tu amiga y mecánica · auto y componentes','NEÓN APAGADO')}
 ${spot('office',66.4,8,22,26.2,'Dirección',office?'Cuentas e historia':'Remodelar · '+money(GalponStoryProfile.cost(s,1200)),office?'HABILITADA':'TAPIADA · '+money(GalponStoryProfile.cost(s,1200)))}
 ${spot('team',67.3,45.7,24,23.6,'Equipo',team?'Pilotos y mecánicos':'Remodelar · '+money(GalponStoryProfile.cost(s,1800)),team?'HABILITADO':'TAPIADA · '+money(GalponStoryProfile.cost(s,1800)))}
 ${spot('west',9,48,24,22,'Parcela oeste','Futuro banco de telemetría','RESERVADA')}
 ${spot('east',58,34.5,35,10.5,'Parcela este','Camioneta y remolque','ESTACIONAMIENTO')}
 ${spot('paddock',41.5,74,17,7,'Paddock','Fechas y carreras')}
 <button class="base-pump" data-action="open-building" data-place="fuel" aria-label="Surtidor de la base"><canvas id="basePumpCanvas" width="240" height="210" aria-hidden="true"></canvas><span>Surtidor</span></button>
 <button class="story-base-market btn secondary" data-action="open-building" data-place="market">Repuestos y autos →</button>
 </div></div><div class="story-base-tools"><button class="btn secondary" data-action="open-building" data-place="testing">Reglajes y pruebas actuales</button><button class="btn secondary" data-action="open-building" data-place="control">Control de carrera</button></div><p class="world-map-help">Mouse o Tab: iluminar · clic o Enter: conversar. La telemetría de la parcela oeste se construirá en una etapa futura.</p></div><div class="base-world-actions"><button class="btn orange" data-action="go-map">Salir al mapa →</button><button class="btn secondary" data-action="open-inventory">Mi depósito</button><button class="btn secondary" data-action="open-message" data-id="welcome">La llave de Raúl</button><button class="btn secondary" data-action="save-options">Partida y respaldos</button></div></section>`;
}
D.base=s=>N.is(s)?base(s):originalBase(s);
function draw(s){const canvas=document.getElementById('storyTruckCanvas');if(!canvas)return;canvas.width=520;canvas.height=180;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;root.GalponJourneyArt.drawTruck(ctx,334,98,0,E.active(s),false,5);canvas.dataset.carSprite='race-original';canvas.dataset.carUid=E.active(s).uid;}
function renovation(s,key){
 const cost=GalponStoryProfile.cost(s,B.costs[key]),busy=!!(s.race||s.journey.trip||s.setupJob),poor=s.cash<cost;
 return `<section class="story-base-renovation" aria-label="Remodelar ${esc(B.names[key])}"><div class="eyebrow">EDIFICIO SIN HABILITAR</div><h3>Recuperar ${esc(B.names[key])}</h3><p>Reparar techo y paredes, retirar las tablas y acondicionar la casa. Al pagar se habilitan ${key==='office'?'las cuentas, las decisiones y las mejoras de la sede':'los contratos y las asignaciones de pilotos y mecánicos'}.</p><p><b>Costo único: ${money(cost)}</b> · Efectivo: ${money(Math.round(s.cash))}</p><button class="btn orange" data-action="renovate-building" data-renovation="${key}" ${busy||poor?'disabled':''}>Remodelar y habilitar · ${money(cost)}</button>${busy?'<p class="warn">Terminá la carrera, el viaje o el trabajo de reglajes antes de remodelar.</p>':poor?'<p class="warn">Todavía no alcanza el efectivo. Podés seguir usando el taller y corriendo para reunirlo.</p>':''}<p>La obra se paga una sola vez. El neón del taller sigue apagado.</p></section>`;
}
root.GalponBaseStoryUI={base,draw,renovation};
})(globalThis);
