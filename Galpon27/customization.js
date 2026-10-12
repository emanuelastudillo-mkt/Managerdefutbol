(function(root){
'use strict';
const defaults={rim:'auto',rimColor:'#b9bec6',decal:'stripe',accent:'#f5eed6'};
const prices={color:450,number:90,rim:240,rimColor:120,decal:180,accent:90};
const names={color:'Pintura de carrocería',number:'Nuevo dorsal',rim:'Diseño de llantas',rimColor:'Pintura de llantas',decal:'Diseño de vinilos',accent:'Color de acento'};
function normalize(input){
 if(!input||!Number.isInteger(input.number)||input.number<0||input.number>99)throw Error('Número entre 0 y 99.');
 for(const key of ['color','rimColor','accent'])if(typeof input[key]!=='string'||!/^#[0-9a-f]{6}$/i.test(input[key]))throw Error('Color de personalización inválido.');
 if(!['auto','steel','five','mesh'].includes(input.rim)||!['stripe','band','number','clean'].includes(input.decal))throw Error('Estilo de personalización inválido.');
 return{color:input.color.toLowerCase(),number:input.number,rim:input.rim,rimColor:input.rimColor.toLowerCase(),decal:input.decal,accent:input.accent.toLowerCase()};
}
function current(car){return normalize({color:car.color,number:car.number,...defaults,...car.appearance});}
function quote(car,input){const look=normalize(input),before=current(car),items=Object.keys(prices).filter(k=>look[k]!==before[k]).map(key=>({key,label:names[key],price:prices[key]}));return{carUid:car.uid,look,items,total:items.reduce((sum,item)=>sum+item.price,0)};}
function preview(car,input){const look=normalize(input);return{...car,color:look.color,number:look.number,appearance:{rim:look.rim,rimColor:look.rimColor,decal:look.decal,accent:look.accent}};}
const api={defaults,prices,names,normalize,current,quote,preview};root.OvalCosmetics=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
