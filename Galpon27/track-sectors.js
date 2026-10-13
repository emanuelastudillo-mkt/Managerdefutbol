(function(root){
'use strict';
const G=root.OvalRaceGeometry,P=root.OvalPitLane,H=root.GalponTerrainCache,SIZE=256,sprites={},textures={},geometry=new Map();
const state={ready:false,error:'',builds:0,draws:0,prefetchBuilds:0,maxBuildMS:0,revision:0,visible:0,reference:'dust'};
const tiles=H.cache(12*1024*1024,c=>{c.width=0;c.height=0;});let protectedKeys=new Set(),queue=[],idle=0,activeKey='';
const make=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const regions={grass:[70,64,282,280],dirt:[447,64,283,280],gravel:[810,64,283,280],asphalt:[1186,64,282,280],tree:[78,386,290,290],gold:[440,382,300,300],bush:[805,398,293,279],tyres:[1200,426,269,240],stand:[30,704,400,264],garage:[451,720,375,222],tent:[902,730,188,193],barrier:[1174,780,330,92]};
async function load(){try{
 const image=new Image();image.src=root.GalponTrackKitSource;await image.decode();root.GalponTrackKitSource=null;
 for(const [name,[x,y,w,h]]of Object.entries(regions)){
  const c=make(w,h),ctx=c.getContext('2d');ctx.drawImage(image,x,y,w,h,0,0,w,h);const pixels=ctx.getImageData(0,0,w,h),d=pixels.data;let l=w,r=0,t=h,b=0;
  for(let i=0;i<d.length;i+=4){const alpha=d[i+3];d[i+3]=alpha<40?0:alpha>220?255:alpha;if(d[i+3]>64){const xx=(i/4)%w,yy=Math.floor(i/4/w);l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);}}
  ctx.putImageData(pixels,0,0);sprites[name]={image:c,x:l,y:t,w:r-l+1,h:b-t+1};
  if(['grass','dirt','gravel','asphalt'].includes(name)){const tex=make(128,128),tc=tex.getContext('2d');tc.imageSmoothingEnabled=false;tc.drawImage(c,Math.floor(w/2-80),Math.floor(h/2-80),160,160,0,0,128,128);textures[name]=tex;}
 }
 state.ready=true;state.revision++;root.dispatchEvent(new Event('galpon-track-art-ready'));
 }catch(e){state.error=e.message;console.error('Arte modular de circuitos:',e);}}load();
function drawProp(ctx,name,x,y,w,h,angle=0){const s=sprites[name];if(!s)return;h=h||w*s.h/s.w;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);ctx.drawImage(s.image,s.x,s.y,s.w,s.h,-w/2,-h/2,w,h);ctx.restore();}
function course(t){const key=G.key(t);if(geometry.has(key))return geometry.get(key);
 const points=t.outline?G.shape(t).points.map(p=>{const q=G.ovalPoint(p.s/G.shape(t).length-G.shape(t).origin,t);return{x:q.x,y:q.y,a:q.a};}):Array.from({length:1025},(_,i)=>G.ovalPoint(i/1024,t)),road=H.index(points,SIZE,115),route=P.route(t,0),pit=H.index(route.road||route.points,SIZE,165),bays=Array.from({length:t.pitTeams||10},(_,i)=>P.sample(P.route(t,i),P.route(t,i).stop));
 const curb=[];for(let i=0;i<1024;i++){const a=G.lanePoint(i/1024,t,-33),b=G.lanePoint((i+1)/1024,t,-33),c=G.lanePoint((i+1)/1024,t,-39),d=G.lanePoint(i/1024,t,-39);curb.push({p:[a,b,c,d],left:Math.min(a.x,b.x,c.x,d.x),right:Math.max(a.x,b.x,c.x,d.x),top:Math.min(a.y,b.y,c.y,d.y),bottom:Math.max(a.y,b.y,c.y,d.y),color:i%4<2?'#dedcc7':'#b4513e'});}
 let seed=0;for(const char of key)seed=Math.imul(seed,31)+char.charCodeAt(0)|0;
 const landmarks=[];for(const [f,name,w,lane]of [[.025,'stand',158,160],[.31,'garage',112,135],[.54,'stand',145,160],[.78,'tent',66,125]]){const p=G.lanePoint(f,t,lane);landmarks.push({...p,name,w});}
 const data={key,road,pit,route,bays,curb,seed,landmarks};geometry.set(key,data);if(geometry.size>3)geometry.delete(geometry.keys().next().value);return data;
}
function path(index,ids,off=0){const p=new Path2D();let previous=-2;for(const i of ids){const a=index.points[i-1],b=index.points[i],offset=q=>({x:q.x+Math.sin(q.a||0)*off,y:q.y-Math.cos(q.a||0)*off}),aa=offset(a),bb=offset(b);if(previous!==i-1)p.moveTo(aa.x,aa.y);p.lineTo(bb.x,bb.y);previous=i;}return p;}
function clearForProp(data,x,y,radius){
 const p={x,y};for(const [index,limit]of [[data.road,60+radius],[data.pit,72+radius]])for(const i of index.near(x,y))if(H.segmentDistance2(p,index.points[i-1],index.points[i])<limit*limit)return false;
 return !data.bays.some(p=>Math.hypot(p.x-x,p.y-y)<100+radius);
}
function build(t,data,x,y,prefetch=false){
 const begin=performance.now(),canvas=make(SIZE,SIZE),ctx=canvas.getContext('2d'),left=x*SIZE,top=y*SIZE;ctx.imageSmoothingEnabled=false;ctx.translate(-left,-top);
 const pattern=name=>ctx.createPattern(textures[name],'repeat'),arid=t.id==='mesa'||/desierto|dunas|arena|salitre/.test(t.id);
 ctx.fillStyle=arid?'#8d7950':'#65723e';ctx.fillRect(left,top,SIZE,SIZE);ctx.fillStyle=pattern(arid?'dirt':'grass');ctx.fillRect(left,top,SIZE,SIZE);
 const roadIDs=data.road.at(x,y),pitIDs=data.pit.at(x,y),center=path(data.road,roadIDs);
 const stroke=(p,color,width,dash=[])=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.setLineDash(dash);ctx.stroke(p);ctx.setLineDash([]);};
 stroke(center,'#6e7352',116);stroke(center,pattern('gravel'),103);stroke(center,'#abae97',86);stroke(center,'#252d30',76);stroke(center,pattern('asphalt'),66);
 for(const off of [-29,29])stroke(path(data.road,roadIDs,off),'#d0d0bd',1.1);
 for(const off of [-10,10])stroke(path(data.road,roadIDs,off),'#dedbc337',.8,[8,12]);
 // Static tire rubber and curbs use the same geometric centerline as the cars.
 for(const off of [-4,3,15])stroke(path(data.road,roadIDs,off),'#10171d25',1.7);
 for(const q of data.curb){if(q.right<left||q.left>left+SIZE||q.bottom<top||q.top>top+SIZE)continue;ctx.beginPath();q.p.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=q.color;ctx.fill();}
 stroke(path(data.road,roadIDs,41),'#b9bcaa',3);stroke(path(data.road,roadIDs,47),'#3a4c42',1.5);
 const pit=path(data.pit,pitIDs);stroke(pit,'#b6b6a0',51);stroke(pit,'#4b5050',48);stroke(pit,'#d9c078',1,[12,14]);
 for(const b of data.bays){if(b.x<left-30||b.x>left+SIZE+30||b.y<top-30||b.y>top+SIZE+30)continue;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.strokeStyle='#d7d8c4';ctx.lineWidth=1;ctx.strokeRect(-16,-10,32,20);ctx.restore();}
 // Props are deterministic in world coordinates; overlap is clipped per tile.
 for(let gy=Math.floor((top-75)/96);gy<=Math.floor((top+SIZE+75)/96);gy++)for(let gx=Math.floor((left-75)/96);gx<=Math.floor((left+SIZE+75)/96);gx++){
  const seed=H.hash(gx,gy,data.seed),px=gx*96+((seed>>>4)%51),py=gy*96+((seed>>>12)%51),name=seed%7===0?'bush':seed%5===0?'gold':'tree',w=name==='bush'?41:54+(seed%17);
  if(seed%9===0||!clearForProp(data,px,py,w*.43)||data.landmarks.some(p=>Math.hypot(p.x-px,p.y-py)<p.w*.7))continue;drawProp(ctx,name,px,py,w);
 }
 for(const p of data.landmarks){if(p.x<left-150||p.x>left+SIZE+150||p.y<top-150||p.y>top+SIZE+150||!clearForProp(data,p.x,p.y,p.w*.3))continue;drawProp(ctx,p.name,p.x,p.y,p.w,0,p.a);}
 const start=G.ovalPoint(0,t);if(start.x>=left-40&&start.x<=left+SIZE+40&&start.y>=top-40&&start.y<=top+SIZE+40){ctx.save();ctx.translate(start.x,start.y);ctx.rotate(start.a);for(let xx=0;xx<2;xx++)for(let yy=0;yy<14;yy++){ctx.fillStyle=(xx+yy)%2?'#eeeedd':'#20252b';ctx.fillRect(xx*3,-28+yy*4,3,4);}ctx.restore();}
 const sign=P.sample(data.route,data.route.limitStart);if(sign.x>=left-80&&sign.x<=left+SIZE+80&&sign.y>=top-50&&sign.y<=top+SIZE+50){ctx.save();ctx.translate(sign.x,sign.y);ctx.rotate(sign.a);ctx.fillStyle='#eedaa1';ctx.font='600 10px Arial,sans-serif';ctx.fillText('BOXES · 120',0,-32);ctx.restore();}
 state.builds++;if(prefetch)state.prefetchBuilds++;state.maxBuildMS=Math.max(state.maxBuildMS,performance.now()-begin);
 return canvas;
}
function key(data,x,y){return data.key+'|'+x+','+y+'|'+state.revision;}
function get(t,data,x,y,prefetch=false){const k=key(data,x,y),found=tiles.get(k);if(found)return found;const c=build(t,data,x,y,prefetch);if(!tiles.put(k,c,SIZE*SIZE*4,protectedKeys))return c;return c;}
function schedule(){if(idle||!queue.length)return;const work=deadline=>{idle=0;if(deadline&&deadline.timeRemaining()<2&&!deadline.didTimeout){schedule();return;}const next=queue.shift();if(next&&next.data.key===activeKey&&!tiles.has(key(next.data,next.x,next.y)))get(next.t,next.data,next.x,next.y,true);schedule();};idle=root.requestIdleCallback?requestIdleCallback(work,{timeout:200}):setTimeout(()=>work(null),30);}
function draw(ctx,t,scene){
 const data=course(t),scale=scene.scale,[cx,cy]=scene.proj(0,0),v=scene.viewport,box={left:(v.left-cx)/scale,top:(v.top-cy)/scale,right:(v.right-cx)/scale,bottom:(v.bottom-cy)/scale},visible=H.cells(box,SIZE);
 activeKey=data.key;protectedKeys=new Set(visible.map(p=>key(data,p.x,p.y)));state.visible=visible.length;
 ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);for(const p of visible)ctx.drawImage(get(t,data,p.x,p.y),p.x*SIZE,p.y*SIZE,SIZE,SIZE);ctx.restore();
 // Adjacent sectors are prepared during idle time, never in the animation loop.
 queue=H.cells({left:box.left-SIZE,top:box.top-SIZE,right:box.right+SIZE,bottom:box.bottom+SIZE},SIZE).filter(p=>!protectedKeys.has(key(data,p.x,p.y))&&!tiles.has(key(data,p.x,p.y))).map(p=>({...p,t,data}));schedule();state.draws++;
}
root.GalponTrackSectors={draw,drawProp,diagnostics:()=>({...state,tileSize:SIZE,cache:tiles.stats(),geometryTracks:geometry.size,atlasPieces:Object.keys(sprites).length})};
})(globalThis);
