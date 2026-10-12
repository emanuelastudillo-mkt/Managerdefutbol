(function(root){
'use strict';
const A=root.GalponCharacterAvatar,P=root.GalponStoryProfile,fallback=A.portrait,faces={},hairs={},cache=new Map(),LIMIT=48;
const state={ready:false,error:'',builds:0,hits:0},esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const make=(w=256,h=256)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),color=(a,k)=>rgb((P.options[k].find(v=>v[0]===a[k])||P.options[k][0])[2]);
const clamp=n=>Math.max(0,Math.min(255,Math.round(n)));
function clean(c){const ctx=c.getContext('2d'),im=ctx.getImageData(0,0,c.width,c.height),d=im.data;for(let i=0;i<d.length;i+=4){if(d[i+3]<110||d[i]>d[i+1]*2.4&&d[i]>d[i+2]*2.4)d[i+3]=0;else d[i+3]=255;}ctx.putImageData(im,0,0);return c;}
function cell(img,i){const w=img.width/4,h=img.height/3,c=make(Math.round(w),Math.round(h)),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(img,i%4*w,Math.floor(i/4)*h,w,h,0,0,c.width,c.height);return clean(c);}
async function load(){try{
 const sources=root.GalponCharacterKitSource;
 for(const gender of ['male','female']){const img=new Image();img.src=sources[gender];await img.decode();faces[gender]=P.options.face.map((_,i)=>cell(img,i));}
 const img=new Image();img.src=sources.hair;await img.decode();P.options.hair.forEach(([id],i)=>hairs[id]=cell(img,i));
 root.GalponCharacterKitSource=null;state.ready=true;root.dispatchEvent(new Event('galpon-character-art-ready'));
 }catch(e){state.error=e.message;console.error('Retratos por capas:',e);}}load();
function compose(a){
 const id=P.options.face.findIndex(v=>v[0]===a.face),index=Math.max(0,id),gender=a.gender==='female'?'female':'male',source=faces[gender][index],row=Math.floor(index/4),base=make(192,256),ctx=base.getContext('2d');ctx.imageSmoothingEnabled=false;
 const sy=gender==='female'?.9:1,offset=gender==='female'?17+[0,16,16][row]*sy:[0,21,34][row];ctx.drawImage(source,0,offset*256/source.height,192,256*sy);
 const im=ctx.getImageData(0,0,192,256),d=im.data,target=color(a,'skin'),reference=[206,146,108],eye=color(a,'eyes');
 for(let y=0;y<256;y++)for(let x=0;x<192;x++){const i=(y*192+x)*4,r=d[i],g=d[i+1],b=d[i+2];if(!d[i+3])continue;
  const inHead=y<180&&x>31&&x<161||y<206&&y>=180&&x>72&&x<122;
  if(inHead&&r>g*1.08&&g>b*1.1&&r>65&&b/r>.25&&g/r>.48){for(let k=0;k<3;k++)d[i+k]=clamp(target[k]+(d[i+k]-reference[k])*.86);}
  // Recolor the iris ring only; keep the original dark pupils, lids and highlights.
  const iris=(x-76)**2/10+(y-104)**2/5<1||(x-122)**2/10+(y-104)**2/5<1;
  if(iris&&r>42&&r<160&&g<135){const light=(r+g+b)/3/100;for(let k=0;k<3;k++)d[i+k]=clamp(eye[k]*light);}
 }
 ctx.putImageData(im,0,0);
 const hi=P.options.hair.findIndex(v=>v[0]===a.hair),hair=hairs[a.hair]||hairs.short,hc=make(hair.width,hair.height),hctx=hc.getContext('2d');hctx.drawImage(hair,0,0);const hm=hctx.getImageData(0,0,hc.width,hc.height),hd=hm.data,hairColor=color(a,'hairColor');
 for(let i=0;i<hd.length;i+=4){if(!hd[i+3])continue;const lum=hd[i]*.3+hd[i+1]*.59+hd[i+2]*.11;for(let k=0;k<3;k++)hd[i+k]=clamp(hairColor[k]+(lum-76)*.95);}
 hctx.putImageData(hm,0,0);
 const opening=[170,156,160,170,112,112,117,117,104,139][Math.max(0,hi)],hy=(128-opening*.9)*256/hair.height;
 const canvas=make(),out=canvas.getContext('2d');out.imageSmoothingEnabled=false;out.fillStyle='#20353c';out.fillRect(0,0,256,256);out.fillStyle='#2b4143';out.fillRect(8,8,240,240);out.fillStyle='#384d48';out.fillRect(16,16,224,172);out.fillStyle='#253a40';out.fillRect(20,24,40,144);out.fillRect(204,32,24,132);out.fillStyle='#72806a';out.fillRect(24,30,32,3);out.fillRect(207,43,16,3);
 out.drawImage(base,32,0);out.drawImage(hc,32,hy,192,256*.9);out.fillStyle='#a7ad80';out.fillRect(0,0,256,4);out.fillRect(0,4,4,252);out.fillStyle='#152c33';out.fillRect(252,4,4,252);out.fillRect(4,252,248,4);state.builds++;return canvas.toDataURL('image/png');
}
A.portrait=function(profile,extra=''){
 if(!state.ready)return fallback(profile,extra);
 const p=P.normalize(profile),a=p.appearance,key=JSON.stringify(a);let src=cache.get(key);if(src){cache.delete(key);state.hits++;}else src=compose(a);cache.set(key,src);if(cache.size>LIMIT)cache.delete(cache.keys().next().value);
 return `<svg class="character-portrait ${esc(extra)}" viewBox="0 0 128 128" shape-rendering="crispEdges" role="img" aria-label="Retrato de ${esc(p.name)}" xmlns="http://www.w3.org/2000/svg"><image width="128" height="128" href="${src}" style="image-rendering:pixelated"/></svg>`;
};
root.GalponCharacterArt={diagnostics:()=>({...state,faces:24,hairstyles:10,cached:cache.size,limit:LIMIT})};
})(globalThis);
