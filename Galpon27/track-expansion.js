(function(root){
'use strict';
// Reference: the player's 7 x 4 diagram, in reading order. Kilometres are
// transcribed from that diagram (including its short version of the road course).
// Coordinates are hand-traced in each diagram cell; never used as real metres.
const rows=[
 ['herrerias','Estadio de las Herrerías',.4,'Bowman Gray Stadium',[[25,0],[80,0],[94,5],[100,17],[100,30],[94,40],[80,44],[25,44],[11,40],[4,30],[4,17],[11,5]]],
 ['ribera','Superóvalo de la Ribera',4,'Daytona International Speedway',[[20,0],[80,0],[94,5],[102,18],[101,31],[93,40],[68,50],[50,54],[32,50],[7,40],[0,31],[-1,18],[7,5]]],
 ['quebracho','Óvalo del Quebracho',2.4,'Atlanta Motor Speedway',[[20,0],[77,0],[91,6],[98,20],[96,35],[87,44],[65,49],[34,49],[12,44],[3,35],[1,20],[7,6]]],
 ['americas','Circuito de las Cuatro Sierras',3.8,'Circuit of The Americas',[[8,30],[28,19],[38,37],[42,36],[40,32],[38,27],[36,22],[33,16],[35,14],[39,20],[42,27],[47,31],[51,29],[47,24],[45,18],[47,14],[52,18],[56,25],[60,25],[59,19],[57,11],[61,7],[79,7],[84,10],[86,18],[81,20],[76,25],[72,31],[68,34],[64,35],[61,39],[57,41],[55,46],[52,48],[50,44],[48,42],[45,44],[44,52],[47,64],[44,67],[40,63],[8,30]]],
 ['ceniza','Óvalo de Puente Viejo',1.6,'Phoenix Raceway',[[24,0],[82,0],[96,6],[103,19],[101,34],[91,42],[64,49],[43,48],[20,37],[5,28],[1,18],[7,6]]],
 ['salitre','Superóvalo del Salitre',2.4,'Las Vegas Motor Speedway',[[23,0],[78,0],[94,6],[101,20],[98,34],[89,43],[67,50],[39,50],[15,43],[4,34],[1,21],[7,7]]],
 ['algodon','Óvalo del Algodón',2.1,'Darlington Raceway',[[23,4],[68,0],[82,4],[88,15],[88,30],[83,40],[73,45],[17,45],[5,40],[1,30],[1,18],[7,9]]],
 ['molinetes','Circuito de los Molinetes',.8,'Martinsville Speedway',[[20,0],[80,0],[91,4],[96,14],[96,22],[91,30],[80,33],[20,33],[9,30],[4,22],[4,14],[9,4]]],
 ['cantera','Cuenco de la Cantera',.8,'Bristol Motor Speedway',[[23,2],[73,0],[87,5],[94,17],[93,29],[86,40],[74,44],[24,44],[10,40],[3,29],[2,17],[9,6]]],
 ['trigal','Óvalo del Trigal',2.4,'Kansas Speedway',[[46,0],[66,5],[84,13],[94,23],[95,35],[87,44],[75,48],[20,48],[8,43],[2,33],[3,22],[14,12],[32,4]]],
 ['relampago','Superóvalo Relámpago',4.2,'Talladega Superspeedway',[[23,0],[82,0],[94,5],[102,18],[101,30],[92,39],[66,49],[51,53],[35,49],[8,39],[0,30],[-1,18],[7,5]]],
 ['estepa','Óvalo de la Estepa',2.3,'Texas Motor Speedway',[[23,0],[78,0],[92,5],[100,17],[100,29],[92,40],[71,47],[30,47],[9,40],[1,29],[1,17],[9,5]]],
 ['valle','Circuito del Valle Verde',3.9,'Watkins Glen International',[[8,22],[21,20],[28,13],[34,5],[75,5],[81,9],[86,5],[94,6],[98,12],[94,20],[88,22],[45,32],[39,35],[38,50],[33,54],[0,50],[-5,46],[-3,32],[0,23]]],
 ['granito','Óvalo de Granito',1.6,'Dover Motor Speedway',[[23,0],[74,0],[87,5],[93,17],[93,30],[88,41],[76,45],[22,45],[9,41],[3,30],[3,17],[9,5]]],
 ['herradura','Óvalo de la Herradura',2.4,'Charlotte Motor Speedway',[[42,0],[65,1],[86,9],[97,19],[98,34],[90,44],[76,48],[19,48],[6,44],[0,34],[0,20],[10,10],[29,3]]],
 ['barrancas','Óvalo de las Barrancas',2.1,'Nashville Superspeedway',[[48,0],[68,5],[88,14],[97,25],[98,35],[90,44],[76,48],[21,48],[8,44],[1,34],[2,24],[12,14],[30,5]]],
 ['lagos','Superóvalo de los Lagos',3.2,'Michigan International Speedway',[[22,0],[78,0],[94,6],[100,18],[100,32],[91,41],[68,49],[49,51],[30,49],[8,41],[0,32],[0,18],[7,6]]],
 ['triangulo','Triángulo de las Cumbres',4,'Pocono Raceway',[[29,2],[38,0],[46,2],[98,36],[103,44],[100,51],[92,54],[12,54],[3,51],[0,43],[3,35]]],
 ['costanera','Circuito de la Costanera',5.5,'Coronado Street Course',[[8,17],[22,12],[22,6],[32,5],[34,10],[60,11],[65,4],[74,9],[94,18],[99,23],[94,45],[100,49],[99,58],[93,64],[83,60],[84,52],[61,63],[51,64],[45,59],[20,43],[18,34],[7,31],[8,17]]],
 ['vinedos','Circuito de los Viñedos',3.2,'Sonoma Raceway',[[2,9],[9,14],[17,14],[21,10],[29,10],[34,14],[42,15],[46,11],[50,5],[57,4],[64,7],[71,8],[77,6],[83,7],[98,17],[108,28],[107,31],[102,30],[92,22],[82,20],[63,21],[55,25],[53,39],[48,46],[41,47],[29,42],[23,41],[20,47],[13,44],[2,38]]],
 ['llanura','Óvalo de la Llanura',2.4,'Chicagoland Speedway',[[44,0],[65,4],[84,13],[94,24],[95,36],[86,45],[65,50],[31,50],[10,45],[1,36],[2,23],[13,12],[31,3]]],
 ['tala','Óvalo del Tala',1,'North Wilkesboro Speedway',[[22,0],[72,0],[86,5],[93,17],[93,29],[86,39],[74,44],[22,44],[9,41],[2,30],[2,17],[9,5]]],
 ['rectangulo','Rectángulo de los Pioneros',4,'Indianapolis Motor Speedway',[[12,0],[88,0],[96,4],[100,12],[100,38],[96,46],[88,50],[12,50],[4,46],[0,38],[0,12],[4,4]]],
 ['espinillo','Óvalo del Espinillo',2.9,'Iowa Speedway',[[22,0],[74,0],[88,5],[95,17],[94,31],[87,41],[70,46],[48,49],[26,46],[10,41],[2,31],[1,18],[8,6]]],
 ['araucaria','Óvalo de la Araucaria',1.2,'Richmond Raceway',[[19,0],[75,0],[88,5],[94,17],[92,29],[84,36],[65,40],[43,41],[22,39],[7,34],[1,25],[1,14],[7,5]]],
 ['bosques','Óvalo de los Bosques',1.7,'New Hampshire Motor Speedway',[[18,0],[82,0],[92,5],[96,15],[96,25],[92,34],[82,38],[18,38],[8,34],[4,25],[4,15],[8,5]]],
 ['acerias','Óvalo de las Acerías',2,'World Wide Technology Raceway',[[17,0],[75,0],[90,5],[98,16],[98,29],[91,40],[77,43],[57,40],[23,37],[8,32],[1,22],[1,13],[7,4]]],
 ['palmares','Óvalo de los Palmares',2.4,'Homestead–Miami Speedway',[[20,0],[80,0],[93,5],[100,17],[100,30],[93,42],[80,47],[20,47],[7,42],[0,30],[0,17],[7,5]]]
];
const lapDistances=[[49,71,104,123,131],[8,13,18,18,18],[11,16,23,25,23],[8,13,17,18,19],[17,26,34,40,38],[11,16,22,25,23],[11,18,26,30,29],[28,41,53,62,66],[26,42,53,62,65],[12,16,23,27,25],[8,12,17,17,19],[10,16,23,26,26],[8,11,17,19,20],[18,26,34,40,38],[12,16,23,27,23],[13,18,24,30,29],[11,14,20,25,25],[8,13,18,19,18],[6,8,12,14,13],[10,13,18,21,25],[10,15,22,26,27],[22,32,43,50,48],[8,13,15,18,18],[10,14,19,22,19],[23,35,45,52,50],[15,24,29,37,36],[13,19,27,32,33],[11,16,23,27,23]];
const tracks=rows.map(([slug,name,km,reference,outline],i)=>({id:'ruta-'+slug,name,raceLaps:lapDistances[i],location:'',km,reference,referenceIndex:i+1,outline,roadCourse:[3,12,18,19].includes(i),radius:300,straight:800,bank:[3,12,18,19].includes(i)?2:8+(i%5)*3,abrasion:.85+(i%5)*.1,temp:19+i%9,grip:.96+(i%4)*.03,gearing:km>3?85:km<1?45:68,spring:50+i%4*5,pressure:48+i%5*3,downforce:[3,12,18,19].includes(i)?75:55,maxLapFuelFraction:.5,maxLapTyreWear:35,color:['#b99462','#739d89','#a18068','#88a1ad'][i%4],desc:'Trazado '+([3,12,18,19].includes(i)?'mixto':'oval')+' de '+km.toLocaleString('es-AR')+' km. Carrera por vueltas; acceso de boxes separado.'}));
root.GalponTrackExpansion=tracks;if(typeof module!=='undefined')module.exports=tracks;
})(globalThis);
