(function(root){
'use strict';
const C=root.OvalCatalog||(typeof require==='function'?require('./catalog'):null);
const types=[{id:'motor',name:'Motor y potencia',slots:['engine','intake','exhaust'],crop:[72,32,440,270]},{id:'transmision',name:'Transmisión',slots:['gearbox','differential'],crop:[582,33,402,271]},{id:'chasis',name:'Chasis y frenos',slots:['suspension','brakes'],crop:[1038,32,457,272]},{id:'gomas',name:'Neumáticos',slots:['tyres'],crop:[72,326,440,272]},{id:'fluidos',name:'Refrigeración y combustible',slots:['cooling','tank'],crop:[582,328,402,270]},{id:'aero',name:'Aerodinámica',slots:['aero'],crop:[1037,328,458,270]}];
function forNode(n){const part=C.part(n?.part);return types.find(t=>t.slots.includes(part?.slot))||types[0];}
const api={types,forNode};root.GalponTownShops=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
