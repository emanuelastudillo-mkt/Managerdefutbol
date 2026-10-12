(function(root){
'use strict';
const SP=root.GalponStoryProfile||(typeof require==='function'?require('./story-profile'):null);

const N=root.GalponStory||(typeof require==='function'?require('./story-campaign'):null);
const costs=Object.freeze({office:1200,team:1800});
const names=Object.freeze({office:'Dirección',team:'Equipo'});
function ensure(s){if(N.is(s)&&s.baseStory===undefined)s.baseStory={version:1,renovated:{office:false,team:false}};return s.baseStory;}
function isOpen(s,key){return !N.is(s)||!Object.hasOwn(costs,key)||s.baseStory?.renovated?.[key]===true;}
function assertAccess(s,key){if(!isOpen(s,key))throw Error('Remodelá '+names[key]+' en Galpón 27 para habilitar sus funciones.');}
function renovate(s,key,E){
 if(!N.is(s)||!Object.hasOwn(costs,key))throw Error('Edificio de historia inválido.');
 E.assertCareerIdle(s);
 if(s.journey.location!=='base')throw Error('Volvé a Galpón 27 para remodelar sus edificios.');
 validate(s);
 if(isOpen(s,key))throw Error('Este edificio ya está remodelado.');
 if(s.cash<SP.cost(s,costs[key]))throw Error('No alcanza el efectivo para remodelar '+names[key]+'.');
 E.careerMoney(s,-costs[key],'Remodelación · '+names[key]);
 ensure(s).renovated[key]=true;
 return SP.cost(s,costs[key]);
}
function validate(s){const b=s.baseStory;if(b===undefined)return;if(!b||b.version!==1||!b.renovated||typeof b.renovated!=='object'||Array.isArray(b.renovated)||Object.keys(b.renovated).length!==2||Object.keys(costs).some(k=>typeof b.renovated[k]!=='boolean'))throw Error('Remodelaciones de la base inválidas.');}
const api={costs,names,ensure,isOpen,assertAccess,renovate,validate};root.GalponBaseStory=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
