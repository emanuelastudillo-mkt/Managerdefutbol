(function(root){
'use strict';
const tileKey=(x,y)=>x+','+y;
function cells(bounds,size=256){
 if(!bounds||![bounds.left,bounds.top,bounds.right,bounds.bottom,size].every(Number.isFinite)||size<=0||bounds.right<bounds.left||bounds.bottom<bounds.top)throw Error('Área de sectores inválida.');
 const out=[];for(let y=Math.floor(bounds.top/size);y<=Math.floor(bounds.bottom/size);y++)for(let x=Math.floor(bounds.left/size);x<=Math.floor(bounds.right/size);x++)out.push({x,y,key:tileKey(x,y)});return out;
}
function cache(limit=12*1024*1024,dispose=()=>{}){
 const data=new Map();let bytes=0,peakBytes=0,evictions=0,hits=0,misses=0;
 return {get(key){const item=data.get(key);if(!item){misses++;return null;}data.delete(key);data.set(key,item);hits++;return item.value;},has:key=>data.has(key),
 put(key,value,size,protectedKeys=new Set()){
  if(!Number.isFinite(size)||size<=0||size>limit)return false;
  const old=data.get(key),available=limit-bytes+(old?.size||0)+[...data].reduce((n,[k,v])=>n+(k!==key&&!protectedKeys.has(k)?v.size:0),0);if(available<size)return false;
  if(old){bytes-=old.size;data.delete(key);if(old.value!==value)dispose(old.value);}
  while(bytes+size>limit){const victim=[...data.keys()].find(k=>!protectedKeys.has(k));if(victim===undefined)return false;const item=data.get(victim);data.delete(victim);bytes-=item.size;dispose(item.value);evictions++;}
  data.set(key,{value,size});bytes+=size;peakBytes=Math.max(peakBytes,bytes);return true;
 },clear(){for(const item of data.values())dispose(item.value);data.clear();bytes=0;},stats:()=>({entries:data.size,bytes,peakBytes,limit,evictions,hits,misses})};
}
function segmentDistance2(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,u=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/Math.max(1e-12,dx*dx+dy*dy)));return(p.x-a.x-u*dx)**2+(p.y-a.y-u*dy)**2;}
function index(points,size=256,padding=110){
 const grid=new Map();for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/(size*.5))),keys=new Set();
  const radius=padding+size*.25;
  for(let j=0;j<=steps;j++){const x=a.x+(b.x-a.x)*j/steps,y=a.y+(b.y-a.y)*j/steps;for(const cell of cells({left:x-radius,top:y-radius,right:x+radius,bottom:y+radius},size))keys.add(cell.key);}
  for(const key of keys){if(!grid.has(key))grid.set(key,[]);grid.get(key).push(i);}
 }
 return {points,at:(x,y)=>grid.get(tileKey(x,y))||[],near:(x,y)=>grid.get(tileKey(Math.floor(x/size),Math.floor(y/size)))||[],cells:grid.size};
}
function hash(x,y,seed=0){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^(seed|0);n=Math.imul(n^(n>>>13),1274126177);return(n^(n>>>16))>>>0;}
const api={cells,cache,index,segmentDistance2,hash,tileKey};root.GalponTerrainCache=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
