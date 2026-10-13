(function(root){
'use strict';
const TAU=Math.PI*2;
const key=t=>t.id+'|'+(t.legacyGeometry!==false?'legacy':'43')+(t.pitTeams>10?'|field'+t.pitTeams:'');
function raceTrack(r,t){return {...t,pitTeams:r?.fieldVersion===2?r.entries?.length||24:10,legacyGeometry:!!r&&!r.circuitModel};}
function dimensions(t){const scale=t.legacyGeometry!==false||t.outline?1:Math.max(1,Math.max(1800,((t.pitTeams||10)-1)*40/.24/.92)/t.straight);return{radius:t.radius*scale,straight:t.straight*scale};}
function ovalPoint(f,t){if(t.outline)return shapePoint(f,t);const {radius:R,straight:S}=dimensions(t),L=2*S+TAU*R,d=((f%1+1)%1)*L;if(d<S)return{x:-S/2+d,y:-R,a:0};if(d<S+Math.PI*R){const a=-Math.PI/2+(d-S)/R;return{x:S/2+Math.cos(a)*R,y:Math.sin(a)*R,a:a+Math.PI/2};}if(d<2*S+Math.PI*R)return{x:S/2-(d-S-Math.PI*R),y:R,a:Math.PI};const a=Math.PI/2+(d-2*S-Math.PI*R)/R;return{x:-S/2+Math.cos(a)*R,y:Math.sin(a)*R,a:a+Math.PI/2};}
// Rounded, closed traces sampled by arc length. All race systems share this
// cache: drawing, traffic, pit distance and minimaps use identical geometry.
const shapes=new Map();
function shape(t){if(shapes.has(key(t)))return shapes.get(key(t));
 const raw=t.outline.map(([x,y])=>({x,y}));if(raw[0].x===raw.at(-1).x&&raw[0].y===raw.at(-1).y)raw.pop();
 const points=[],lerp=(a,b,u)=>({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u});let length=0,longest=null;const straights=[];
 const add=p=>{const prev=points.at(-1);if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,s:length});};
 const corners=raw.map((b,i)=>{const a=raw[(i+raw.length-1)%raw.length],c=raw[(i+1)%raw.length],ab=Math.hypot(a.x-b.x,a.y-b.y),bc=Math.hypot(c.x-b.x,c.y-b.y),cut=Math.min(ab,bc)*(t.legacyGeometry!==false?(t.roadCourse?.20:.45):(t.roadCourse?.30:.45));return{b,in:lerp(b,a,cut/ab),out:lerp(b,c,cut/bc)};});
 for(let i=0;i<corners.length;i++){const a=corners[i],b=corners[(i+1)%corners.length];add(a.in);for(let k=1;k<=24;k++){const u=k/24,v=1-u;add({x:v*v*a.in.x+2*v*u*a.b.x+u*u*a.out.x,y:v*v*a.in.y+2*v*u*a.b.y+u*u*a.out.y});}const start=length,d=Math.hypot(b.in.x-a.out.x,b.in.y-a.out.y);add(b.in);const segment={start,end:length,length:d};straights.push(segment);if(!longest||d>longest.length+1e-9)longest=segment;}
 let factor=Math.max(12000,t.km*2400)/length;
 if(t.legacyGeometry===false){factor=Math.max(factor,Math.max(1800,((t.pitTeams||10)-1)*40/.24)/(longest.length*.92));
 // Separate nearby hairpins by at least two road widths. This changes drawing
 // scale, never the homologated kilometre distance or the physical turn radius.
 if(!t.overpass){const n=1400,sampled=[];let j=1;for(let i=0;i<n;i++){const d=i/n*length;while(j<points.length-1&&points[j].s<d)j++;const a=points[j-1],b=points[j],u=(d-a.s)/Math.max(1e-9,b.s-a.s);sampled.push(lerp(a,b,u));}
 let closest=Infinity;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){if(Math.min(j-i,n-j+i)/n*length*factor<200)continue;closest=Math.min(closest,Math.hypot(sampled[i].x-sampled[j].x,sampled[i].y-sampled[j].y));}if(closest>1e-8)factor=Math.max(factor,120/closest);
 }}
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 for(const p of points){p.x=(p.x-cx)*factor;p.y=(p.y-cy)*factor;p.s*=factor;}
 const grid=straights.filter(s=>s!==longest).sort((a,b)=>b.length-a.length)[0],origin=(grid.start+grid.end)/2/length,entry=((longest.start+longest.length*.04)/length-origin+1)%1,total=length*factor,result={points,length:total,origin,pitEntry:entry,pitExit:entry+longest.length*.92/length,bounds:{left:(Math.min(...xs)-cx)*factor,right:(Math.max(...xs)-cx)*factor,top:(Math.min(...ys)-cy)*factor,bottom:(Math.max(...ys)-cy)*factor}};shapes.set(key(t),result);return result;
}
function shapePoint(f,t){const r=shape(t),d=(((f+r.origin)%1+1)%1)*r.length;let lo=1,hi=r.points.length-1;while(lo<hi){const m=(lo+hi)>>1;if(r.points[m].s<d)lo=m+1;else hi=m;}const a=r.points[lo-1],b=r.points[lo],u=(d-a.s)/Math.max(1e-9,b.s-a.s);return{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,a:Math.atan2(b.y-a.y,b.x-a.x)};}
function course(t){const d=dimensions(t);return t.outline?shape(t).length:2*d.straight+TAU*d.radius;}
const bridges=new Map();
function bridge(t){if(!t.overpass)return null;if(bridges.has(key(t)))return bridges.get(key(t));const n=600,pts=Array.from({length:n+1},(_,i)=>ovalPoint(i/n,t));let result=null;for(let i=0;i<n&&!result;i++)for(let j=i+5;j<n;j++){if(i===0&&j>n-5)continue;const a=pts[i],b=pts[i+1],c=pts[j],d=pts[j+1],ux=b.x-a.x,uy=b.y-a.y,vx=d.x-c.x,vy=d.y-c.y,den=ux*vy-uy*vx;if(Math.abs(den)<1e-9)continue;const sx=c.x-a.x,sy=c.y-a.y,u=(sx*vy-sy*vx)/den,v=(sx*uy-sy*ux)/den;if(u>=0&&u<=1&&v>=0&&v<=1){const f=(i+u)/n,g=(j+v)/n;result={lower:f,upper:g,x:a.x+u*ux,y:a.y+u*uy,halfLength:105};break;}}bridges.set(key(t),result);return result;}
function arcGap(a,b,t){return Math.abs((((a-b)%1)+1.5)%1-.5)*course(t);}
function deck(f,t){const b=bridge(t);return !b?0:arcGap(f,b.lower,t)<b.halfLength?-1:arcGap(f,b.upper,t)<b.halfLength?1:0;}
function bounds(t){const {straight:S,radius:R}=dimensions(t);return t.outline?shape(t).bounds:{left:-S/2-R,right:S/2+R,top:-R,bottom:R};}
function isStraight(f,t){if(!t.outline){const d=((f%1+1)%1)*course(t),{straight:S,radius:R}=dimensions(t);return d<S||d>S+Math.PI*R&&d<2*S+Math.PI*R;}const a=ovalPoint(f-.002,t).a,b=ovalPoint(f+.002,t).a;return Math.abs(Math.atan2(Math.sin(b-a),Math.cos(b-a)))<.025;}
function lanePoint(f,t,lane=0){const p=ovalPoint(f,t);return{x:p.x+Math.sin(p.a)*lane,y:p.y-Math.cos(p.a)*lane,a:p.a};}
function project(x,y){return{x,y};}
function pose(heading,scale=1){const co=Math.cos(heading),si=Math.sin(heading);return{a:co*scale,b:si*scale,c:-si*scale,d:co*scale,heading,scale,screenAngle:heading,forward:{x:co*scale,y:si*scale},lateral:{x:-si*scale,y:co*scale}};}
function cameraPoint(p,focus,zoom,w,h){return{x:w/2+(p.x-focus.x)*zoom,y:h*.55+(p.y-focus.y)*zoom};}
const api={key,raceTrack,dimensions,course,bounds,shape,bridge,deck,arcGap,isStraight,ovalPoint,lanePoint,project,projectVector:project,pose,cameraPoint,projection:'orthographic-topdown',carLength:24};
root.OvalRaceGeometry=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
