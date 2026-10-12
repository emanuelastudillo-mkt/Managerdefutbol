(function(root){
'use strict';
const G=root.OvalRaceGeometry||(typeof require==='function'?require('./race-geometry'):null);
const motionFactor=1.5,limit=1200,atlases=new Map(),roads=new Map(),colors=['#501e1c','#9b3022','#d94a20','#f47726','#ffae41','#ffd879','#fff2b0','#fff9de'];
let race=null,clock=0,lastNow=0,marks=[],wheels=new Map(),lastMark=0,active=false,reduced=false;
const counts={fire:0,dust:0,grip:0,road:0,sparks:0};let sparkPanels=[];
const random=n=>{let v=Math.imul(n+17,1103515245)+12345;v^=v>>>13;return (v>>>0)/4294967296;};
function flowPhase(distance,km,factor=motionFactor){return -(factor-1)*distance/km;}
function begin(r,points,playing,lessMotion,now=performance.now()){
 if(r!==race){race=r;clock=0;lastNow=now;marks=[];wheels.clear();lastMark=0;}
 sparkPanels=[];const dt=Math.max(0,Math.min((now-lastNow)/1000,.1));lastNow=now;active=playing&&r?.phase==='running';reduced=lessMotion;if(active&&!reduced)clock+=dt;
 if(active&&clock-lastMark>=.055){lastMark=clock;for(const {e,p}of points){
  if(!root.OvalArcade.effects(r,e).extraGrip||e.pitVisit||e.traffic?.speed<10){wheels.delete(e.id);continue;}
  const co=Math.cos(p.a),si=Math.sin(p.a),pair=[-1,1].map(sign=>({x:p.x-co*8-si*sign*4.4,y:p.y-si*8+co*sign*4.4})),old=wheels.get(e.id);
  if(old){const d=Math.hypot(pair[0].x-old[0].x,pair[0].y-old[0].y);if(d>.7&&d<55){for(let i=0;i<2;i++)marks.push({a:old[i],b:pair[i],born:clock});wheels.set(e.id,pair);}}
  else wheels.set(e.id,pair);
 }}
 marks=marks.filter(m=>clock-m.born<22);if(marks.length>limit)marks.splice(0,marks.length-limit);
}
function road(ctx,t,scene,distance){if(!active||reduced)return;
 if(!roads.has(t.id)){roads.set(t.id,Array.from({length:1024},(_,i)=>({f:i/1024,lane:random(i)*50-25,color:i%3?'#a6aca918':'#0d121a50',length:1+random(i+132)*3})));}
 const phase=flowPhase(distance,t.km);ctx.save();for(const s of roads.get(t.id)){const p=G.lanePoint(s.f+phase,t,s.lane),[x,y]=scene.proj(p.x,p.y),v=scene.viewport;if(v&&(x<v.left-12||x>v.right+12||y<v.top-12||y>v.bottom+12))continue;ctx.fillStyle=s.color;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,scene.scale*s.length),Math.max(1,scene.scale*.8));}ctx.restore();counts.road++;
}
function ground(ctx,scene){ctx.save();ctx.lineCap='round';ctx.lineWidth=Math.max(1,scene.scale*1.7);for(const m of marks){const a=scene.proj(m.a.x,m.a.y),b=scene.proj(m.b.x,m.b.y);ctx.strokeStyle='rgba(5,7,9,'+(.76*Math.min(1,(22-(clock-m.born))/5))+')';ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}ctx.restore();counts.grip=marks.length;}
function atlas(frame){frame=((frame%12)+12)%12;if(atlases.has(frame))return atlases.get(frame);const canvas=document.createElement('canvas');canvas.width=40;canvas.height=18;const c=canvas.getContext('2d');
 // Pixel cells follow a tapered turbulent plume, with hot white/yellow roots,
 // an orange/red cooler envelope, a blue ignition core and drifting embers.
 for(let x=0;x<34;x++){const length=26+Math.floor(random(frame*31)*8),fall=1-x/length,center=8+Math.sin(x*.42+frame*.8)*x*.055,half=Math.max(0,fall*5.8+(random(x*13+frame*37)-.5)*2);
  if(x>=length)continue;for(let y=0;y<18;y++){const edge=Math.abs(y-center)/Math.max(.1,half);if(edge>1)continue;const heat=Math.max(0,Math.min(7,Math.floor((1-edge*.65-x/length*.8)*8)));c.fillStyle=colors[heat];c.fillRect(36-x,y,1,1);}}
 c.fillStyle='#b5e8fa';c.fillRect(34,7,4,3);c.fillStyle='#6999e0';c.fillRect(35,6,3,1);c.fillRect(35,10,3,1);
 for(let i=0;i<7;i++){c.fillStyle=i%2?'#ffbc53':'#e96e2d';c.fillRect(Math.floor(random(i+frame*17)*17),Math.floor(random(i+frame*43)*18),1,1);}atlases.set(frame,canvas);return canvas;
}
function under(ctx,r,e,x,y,pose){if(e.status!=='running'||e.pitVisit)return;const fx=root.OvalArcade.effects(r,e);if(!fx.turbo)return;const seed=Number(e.id.replace(/\D/g,''))||0,frame=reduced?0:Math.floor(clock*18+seed*3)%12;
 ctx.save();ctx.translate(x,y);ctx.rotate(pose.heading);ctx.scale(pose.scale,pose.scale);ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#ff9d2920';ctx.fillRect(-38,-8,28,16);const fire=atlas(frame);for(const sign of [-1,1])ctx.drawImage(fire,-43,sign*3.2-4,33,8);ctx.restore();counts.fire++;
}
function sparks(ctx,e,x,y,pose){
 if(e.status==='dnf'||e.status==='finished')return;
 const origins={front:[12,0,1,0],rear:[-12,0,-1,0],left:[0,-5.8,0,-1],right:[0,5.8,0,1]};
 for(const [panel,hit]of Object.entries(e.telemetry?.impacts||{})){if(hit.remaining<=0)continue;const [ox,oy,nx,ny]=origins[panel];sparkPanels.push({id:e.id,panel,x:ox,y:oy});
  ctx.save();ctx.translate(x,y);ctx.rotate(pose.heading);ctx.scale(pose.scale,pose.scale);
  for(let i=0;i<20;i++){const phase=(clock*4+random(i+71))%1,length=2+random(i+313)*11,spread=(random(i+533)-.5)*8,px=ox+nx*length*phase-ny*spread*phase-phase*5,py=oy+ny*length*phase+nx*spread*phase;ctx.globalAlpha=1-phase*.75;ctx.fillStyle=['#fff9d4','#ffe286','#ffb63d','#ec662b'][i%4];ctx.fillRect(Math.round(px),Math.round(py),i%5===0?2:1,1);}
  ctx.restore();counts.sparks++;
 }
}
function over(ctx,r,e,x,y,pose){if(e.status!=='running'||e.pitVisit||!root.OvalArcade.effects(r,e).repair)return;
 ctx.save();ctx.translate(x,y);ctx.scale(pose.scale,pose.scale);ctx.fillStyle='#e7bfff20';ctx.fillRect(-13,-9,26,18);
 for(let i=0;i<38;i++){const phase=(clock*.65+random(i+211))%1,angle=random(i+137)*Math.PI*2+clock*.6,rad=4+random(i+73)*17,px=Math.cos(angle)*rad,py=Math.sin(angle)*rad*.65-phase*10+4,size=i%5===0?2:1;
  ctx.globalAlpha=Math.sin(phase*Math.PI)*.8+.2;ctx.fillStyle=['#fff9d4','#f7d1ff','#cab6ff','#ffe58e'][i%4];ctx.fillRect(Math.round(px),Math.round(py),size,size);
  if(i%5===0){ctx.fillRect(Math.round(px)-2,Math.round(py),5,1);ctx.fillRect(Math.round(px),Math.round(py)-2,1,5);}}
 ctx.restore();counts.dust++;
}
const api={motionFactor,flowPhase,begin,road,ground,under,over,sparks,diagnostics:()=>({motionFactor,clock,active,reduced,marks:marks.length,markLimit:limit,atlasFrames:atlases.size,counts:{...counts},sparkPanels:sparkPanels.map(p=>({...p}))})};
root.GalponRaceFX=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
