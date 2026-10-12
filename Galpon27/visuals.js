(function(root){
'use strict';
const C=root.OvalCatalog,E=root.OvalEngine;
const mix=(hex,amount)=>{const n=parseInt(hex.slice(1),16);return '#'+[n>>16,(n>>8)&255,n&255].map(v=>Math.round(E.clamp(v+amount,0,255)).toString(16).padStart(2,'0')).join('');};
function prepare(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,rect.width),h=Math.max(1,rect.height);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return {ctx,w,h};}
function poly(ctx,points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function carDraw(ctx,car,x,y,scale=1,exploded=false,selected='',mini=false,shell=true){
 const spec=C.car(car.id),proj=(a,b,c=0)=>[x+(a*.87-b*.79)*scale,y+(a*.32+b*.40-c)*scale];
 const p=(points,fill,stroke)=>poly(ctx,points.map(v=>proj(...v)),fill,stroke);
 const box=(a,b,c,w,d,h,col)=>{p([[a,b,c],[a+w,b,c],[a+w,b,c+h],[a,b,c+h]],mix(col,-24));p([[a+w,b,c],[a+w,b+d,c],[a+w,b+d,c+h],[a+w,b,c+h]],mix(col,-40));p([[a,b,c+h],[a+w,b,c+h],[a+w,b+d,c+h],[a,b+d,c+h]],col,mix(col,-25));};
 const part=slot=>C.part(car.parts[slot].id),color=car.color||spec.color;
 ctx.save();ctx.fillStyle='rgba(25,38,36,.20)';ctx.beginPath();ctx.ellipse(x,y+36*scale,145*scale,49*scale,.05,0,Math.PI*2);ctx.fill();
 if(mini){box(-96,-43,18,190,86,25,color);p([[-43,-35,44],[28,-35,44],[37,-26,68],[-36,-26,68]],mix(color,18));p([[-36,-26,68],[37,-26,68],[37,26,68],[-36,26,68]],mix(color,30));p([[37,-26,68],[61,-36,43],[61,36,43],[37,26,68]],'#243b40');p([[-20,44,25],[25,44,25],[25,44,43],[-20,44,43]],'#e4ded0');ctx.restore();return;}
 // Far-side wheels are drawn before the chassis.
 const wheel=(a,b)=>{const pos=proj(a,b,18);ctx.save();ctx.translate(...pos);ctx.rotate(.31);ctx.fillStyle='#252c2a';ctx.beginPath();ctx.ellipse(0,0,22*scale,29*scale,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111a19';ctx.lineWidth=5*scale;ctx.stroke();ctx.fillStyle=part('tyres').grade>=2?'#c5c4bd':'#878d87';ctx.beginPath();ctx.ellipse(0,0,13*scale,19*scale,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#444c47';ctx.lineWidth=2*scale;for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*12*scale,Math.sin(a)*18*scale);ctx.stroke();}ctx.fillStyle=part('brakes').color;ctx.beginPath();ctx.arc(0,0,5*scale,0,Math.PI*2);ctx.fill();ctx.restore();};
 wheel(-65,-49);wheel(67,-49);
 box(-102,-45,16,208,90,8,'#444e49');
 // Visible mechanical assembly; each slot is built from its installed specification.
 box(-98,-33,25,35,66,17,part('tank').color);for(let i=0;i<3;i++)box(-96+i*10,-35,43,3,70,3,'#3f4b43');
 box(-48,-18,26,32,36,18,part('gearbox').color);box(-64,-21,26,13,42,12,part('differential').color);
 box(37,-26,27,43,52,26,part('engine').color);box(40,-24,54,38,48,5,'#adb4a6');
 for(let i=0;i<4;i++)box(40+i*9,-19,59,5,15,part('engine').grade>2?11:5,'#535e55');
 for(let i=0;i<(part('intake').grade>=2?2:1);i++){const pos=proj(52,8+i*15,65);ctx.fillStyle=part('intake').color;ctx.beginPath();ctx.ellipse(pos[0],pos[1],12*scale,6*scale,.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#38473e';ctx.stroke();}
 box(86,-32,27,7,64,32,part('cooling').color);for(let i=0;i<9;i++)p([[94,-29+i*7,29],[94,-29+i*7,57]],null,'#3c4d45');
 for(const axle of [-65,67]){for(const side of [-38,38]){const pos=proj(axle,side,29);ctx.strokeStyle=part('suspension').color;ctx.lineWidth=3*scale;ctx.beginPath();for(let i=0;i<8;i++){const xx=pos[0]+(i%2?4:-4)*scale,yy=pos[1]-i*3*scale;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}}
 ctx.strokeStyle=part('exhaust').color;ctx.lineWidth=(part('exhaust').grade>=2?6:4)*scale;ctx.beginPath();ctx.moveTo(...proj(60,29,23));ctx.lineTo(...proj(-90,37,23));ctx.stroke();
 box(-16,-26,25,29,52,20,'#2e3733');box(-10,-22,46,13,18,18,'#414c44');
 // Roll cage stays attached to the car, while the shell lifts in inspection mode.
 ctx.strokeStyle='#b4b8a9';ctx.lineWidth=3*scale;for(const side of [-32,32]){ctx.beginPath();ctx.moveTo(...proj(-39,side,27));ctx.lineTo(...proj(-28,side,72));ctx.lineTo(...proj(25,side,72));ctx.lineTo(...proj(42,side,27));ctx.stroke();}p([[-28,-32,72],[-28,32,72],[25,32,72],[25,-32,72]],null,'#9ba496');
 if(shell){const lift=exploded?108:0;ctx.save();if(exploded)ctx.globalAlpha=.86;
 const roof={sedan:{back:-28,front:24,height:75,rearBase:-42},coupe:{back:-43,front:14,height:69,rearBase:-68},muscle:{back:-32,front:20,height:70,rearBase:-53},stock:{back:-44,front:18,height:65,rearBase:-69}}[spec.shape];
 const z=n=>n+lift;const nose=spec.shape==='stock'?111:105;
 p([[-105,-44,z(30)],[nose,-44,z(30)],[nose,-43,z(48)],[-105,-43,z(48)]],mix(color,-30));
 p([[-105,44,z(30)],[nose,44,z(30)],[nose,43,z(48)],[-105,43,z(48)]],mix(color,-12),mix(color,-40));
 p([[nose,-44,z(30)],[nose,44,z(30)],[nose,43,z(48)],[nose,-43,z(48)]],mix(color,-24));
 p([[-105,-43,z(48)],[roof.rearBase,-43,z(48)],[roof.rearBase,43,z(48)],[-105,43,z(48)]],color);
 p([[42,-43,z(48)],[nose,-43,z(48)],[nose,43,z(48)],[42,43,z(48)]],mix(color,7));
 p([[roof.rearBase,-43,z(48)],[roof.back,-31,z(roof.height)],[roof.front,-31,z(roof.height)],[42,-43,z(48)]],mix(color,-17));
 p([[roof.rearBase,43,z(48)],[roof.back,31,z(roof.height)],[roof.front,31,z(roof.height)],[42,43,z(48)]],mix(color,-26),'#493e33');
 p([[roof.back,-31,z(roof.height)],[roof.front,-31,z(roof.height)],[roof.front,31,z(roof.height)],[roof.back,31,z(roof.height)]],mix(color,22),mix(color,-5));
 p([[roof.front,-31,z(roof.height)],[42,-40,z(49)],[42,40,z(49)],[roof.front,31,z(roof.height)]],'#3c5557','#cad3c8');
 p([[roof.rearBase,-40,z(49)],[roof.back,-31,z(roof.height)],[roof.back,31,z(roof.height)],[roof.rearBase,40,z(49)]],'#455e5e','#cad3c8');
 p([[roof.rearBase+6,43,z(49)],[roof.back+3,32,z(roof.height-5)],[roof.front-5,32,z(roof.height-5)],[34,43,z(49)]],'#283f40');
 for(let i=0;i<5;i++)p([[roof.rearBase+9+i*(25-roof.rearBase)/5,43,z(51)],[roof.back+4+i*(roof.front-roof.back-8)/5,32,z(roof.height-7)]],null,'#7d8b7d');
 // Hood stripe, hood vents, front lamps and door number.
 p([[45,-9,z(48.5)],[nose,-9,z(48.5)],[nose,9,z(48.5)],[45,9,z(48.5)]],'#e9e2ca');
 for(let i=0;i<part('intake').grade+2;i++)p([[62+i*7,-29,z(49)],[66+i*7,-29,z(49)],[66+i*7,-18,z(49)],[62+i*7,-18,z(49)]],'#435046');
 p([[nose+1,-35,z(35)],[nose+1,-16,z(35)],[nose+1,-16,z(43)],[nose+1,-35,z(43)]],'#f6e9b4');p([[nose+1,16,z(35)],[nose+1,35,z(35)],[nose+1,35,z(43)],[nose+1,16,z(43)]],'#f6e9b4');
 const np=proj(-7,44,z(42));ctx.save();ctx.translate(...np);ctx.transform(.87,.32,0,1,0,0);ctx.fillStyle='#fff5d9';ctx.font=`900 ${20*scale}px Arial`;ctx.textAlign='center';ctx.fillText(String(car.number).padStart(2,'0'),0,14*scale);ctx.restore();
 if(part('aero').grade>0){const height=part('aero').grade>=3?25:9;p([[-94,-47,z(49)],[-94,-47,z(49+height)]],null,'#26382d');p([[-94,47,z(49)],[-94,47,z(49+height)]],null,'#26382d');box(-100,-53,z(49+height),13,106,4,part('aero').color);p([[nose,-48,z(27)],[nose+12,-48,z(27)],[nose+12,48,z(27)],[nose,48,z(27)]],'#26382d');}
 ctx.restore();}wheel(-65,49);wheel(67,49);
 const anchors={engine:proj(60,0,52),intake:proj(53,15,68),gearbox:proj(-30,0,44),differential:proj(-60,0,38),suspension:proj(67,38,40),brakes:proj(-65,49,19),tyres:proj(67,49,18),cooling:proj(90,0,45),aero:proj(-94,-30,exploded?177:68),exhaust:proj(-37,37,23),tank:proj(-82,0,43)};
 if(selected&&anchors[selected]){const a=anchors[selected];ctx.strokeStyle='#db633f';ctx.lineWidth=2;ctx.beginPath();ctx.arc(...a,12*scale,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#db633f';ctx.beginPath();ctx.arc(...a,3*scale,0,Math.PI*2);ctx.fill();}
 ctx.restore();return anchors;
}
function workshop(canvas,state,exploded=false,selected='engine'){
 const {ctx,w,h}=prepare(canvas);ctx.fillStyle='#e8e6db';ctx.fillRect(0,0,w,h);
 const grad=ctx.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#d9ddd1');grad.addColorStop(.7,'#efeee4');grad.addColorStop(1,'#dddccb');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
 // A quiet architectural backdrop: grid floor, glazing, steel bench and stored parts.
 ctx.save();ctx.strokeStyle='rgba(98,111,96,.13)';ctx.lineWidth=1;for(let i=-10;i<20;i++){ctx.beginPath();ctx.moveTo(i*90,0);ctx.lineTo(i*90+h*1.7,h);ctx.stroke();ctx.beginPath();ctx.moveTo(i*110,0);ctx.lineTo(i*110-h*2,h);ctx.stroke();}ctx.restore();
 ctx.fillStyle='rgba(193,204,187,.65)';poly(ctx,[[w*.59,0],[w,0],[w,h*.25],[w*.59,h*.06]],'#d3dacb');
 ctx.strokeStyle='#c1caba';ctx.lineWidth=4;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(w*.61+i*w*.09,0);ctx.lineTo(w*.61+i*w*.09,h*.16);ctx.stroke();}
 poly(ctx,[[w*.05,h*.14],[w*.23,h*.09],[w*.29,h*.17],[w*.11,h*.24]],'#8d9986');poly(ctx,[[w*.11,h*.24],[w*.29,h*.17],[w*.29,h*.25],[w*.11,h*.32]],'#6d7d6a');
 for(let i=0;i<4;i++){ctx.fillStyle=['#bb5e43','#bfa66b','#557e78','#969f86'][i];ctx.fillRect(w*.12+i*13,h*.18,9,12);}
 const scale=Math.min(w/670,h/360)*(exploded?1.04:1.32);const anchors=carDraw(ctx,E.active(state),w*.52,h*(exploded?.65:.54),scale,exploded,selected);
 ctx.fillStyle='#81917d';ctx.font='600 10px monospace';ctx.fillText('GALPÓN 27 / ÁREA DE MONTAJE',22,h-22);
 ctx.fillStyle='#a7b29b';ctx.font='700 82px Arial';ctx.globalAlpha=.14;ctx.fillText('27',w-122,h-24);ctx.globalAlpha=1;
 if(exploded&&w>620){const rows=[['tank','gearbox','differential','exhaust','brakes'],['aero','intake','engine','cooling','suspension','tyres']];rows.forEach((list,side)=>list.forEach((slot,i)=>{const a=anchors[slot],left=side===0,xx=left?24:w-148,yy=48+i*(h-94)/Math.max(5,list.length-1);ctx.strokeStyle=slot===selected?'#db633f':'rgba(85,105,86,.44)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(left?xx+130:xx-10,yy+5);ctx.lineTo(left?xx+8:xx+130,yy+5);ctx.stroke();ctx.fillStyle=slot===selected?'#ce5d3d':'#475e4e';ctx.font='700 9px monospace';ctx.fillText(C.slots.find(s=>s.id===slot).short,xx,yy);ctx.fillStyle='#74816d';ctx.font='9px monospace';ctx.fillText(C.grades[C.part(E.active(state).parts[slot].id).grade].name.toUpperCase(),xx,yy+16);}));}
}
function ovalPoint(f,track){const radius=track.radius,straight=track.straight,total=2*straight+2*Math.PI*radius,d=((f%1+1)%1)*total;if(d<straight)return {x:-straight/2+d,y:-radius,a:0};if(d<straight+Math.PI*radius){const a=-Math.PI/2+(d-straight)/radius;return {x:straight/2+Math.cos(a)*radius,y:Math.sin(a)*radius,a:a+Math.PI/2};}if(d<2*straight+Math.PI*radius)return {x:straight/2-(d-straight-Math.PI*radius),y:radius,a:Math.PI};const a=Math.PI/2+(d-2*straight-Math.PI*radius)/radius;return {x:-straight/2+Math.cos(a)*radius,y:Math.sin(a)*radius,a:a+Math.PI/2};}
function raceTrack(canvas,state,preview=false){
 const {ctx,w,h}=prepare(canvas),r=state.race,t=C.track(r?.track||state.trackId),scale=Math.min(w/(t.straight+2*t.radius+170),h/(t.radius*1.45+t.straight*.23+90));
 const proj=(x,y,z=0)=>[w*.50+(x*.92-y*.5)*scale,h*.50+(x*.25+y*.53-z)*scale];
 ctx.fillStyle='#dce0cf';ctx.fillRect(0,0,w,h);const g=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,w*.7);g.addColorStop(0,'#eceddf');g.addColorStop(1,'#cbd3be');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const path=offset=>{const arr=[];for(let i=0;i<=160;i++){const p=ovalPoint(i/160,t);arr.push(proj(p.x+Math.sin(p.a)*offset,p.y-Math.cos(p.a)*offset));}return arr;};
 const outer=path(39);poly(ctx,outer,'#bbc4ae');poly(ctx,path(32),'#f0ede0');poly(ctx,path(28),'#4c5552');poly(ctx,path(-27),'#d1d9bd');poly(ctx,path(-35),'#dce2cc');
 ctx.strokeStyle='#9aa49b';ctx.lineWidth=1;ctx.setLineDash([7,9]);ctx.beginPath();path(0).forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#e5ddc6';ctx.lineWidth=2;ctx.beginPath();path(23).forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();
 const block=(x,y,ww,dd,hh,color)=>{poly(ctx,[proj(x,y),proj(x+ww,y),proj(x+ww,y,hh),proj(x,y,hh)],mix(color,-20));poly(ctx,[proj(x+ww,y),proj(x+ww,y+dd),proj(x+ww,y+dd,hh),proj(x+ww,y,hh)],mix(color,-35));poly(ctx,[proj(x,y,hh),proj(x+ww,y,hh),proj(x+ww,y+dd,hh),proj(x,y+dd,hh)],color);};
 // Pit lane and paddock sit inside the oval, grandstands outside it.
 poly(ctx,[proj(-t.straight*.45,20),proj(t.straight*.45,20),proj(t.straight*.45,45),proj(-t.straight*.45,45)],'#8e998b');
 for(let i=0;i<10;i++){const x=-t.straight*.45+i*t.straight*.09;block(x,48,t.straight*.075,19,12,i===0?'#ca7454':'#a6ad9d');const p=proj(x,25);ctx.fillStyle='#e9e4d0';ctx.font='8px monospace';ctx.fillText(String(i+1),...p);}
 for(let row=0;row<4;row++){block(-t.straight*.42,-t.radius-73+row*9,t.straight*.9,8,10+row*3,row%2?'#a8afa2':'#bec4b6');}
 block(-60,-30,40,27,20,'#b2baa7');block(10,-28,50,22,11,'#eee8d1');
 const start=ovalPoint(.08,t);for(let i=0;i<8;i++){const a=proj(start.x,start.y-27+i*7),b=proj(start.x+5,start.y-27+i*7),c=proj(start.x+5,start.y-20+i*7),d=proj(start.x,start.y-20+i*7);poly(ctx,[a,b,c,d],i%2?'#eee9da':'#242e2b');}
 for(let i=0;i<7;i++){const x=t.straight*.6+30+i*15,y=-t.radius-38+Math.sin(i)*12,p=proj(x,y,7);ctx.fillStyle='#829876';ctx.beginPath();ctx.ellipse(...p,9*scale,12*scale,0,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle='#65765f';ctx.textAlign='center';ctx.font=`800 ${Math.max(10,15*scale)}px Arial`;const logo=proj(0,-7);ctx.fillText('GALPÓN 27',...logo);ctx.font='9px monospace';ctx.fillStyle='#8a9980';ctx.fillText(t.location.toUpperCase(),logo[0],logo[1]+17);ctx.textAlign='left';
 if(r){const entries=[...r.entries].sort((a,b)=>{const aa=ovalPoint(a.distance/t.km,t),bb=ovalPoint(b.distance/t.km,t);return proj(aa.x,aa.y)[1]-proj(bb.x,bb.y)[1];});for(const e of entries){if(root.OvalTraffic.isCleared(e))continue;let point;if(e.status==='pit'){const i=r.entries.indexOf(e);point={x:-t.straight*.45+i*t.straight*.09,y:32,a:0};}else{point=ovalPoint(e.distance/t.km,t);const lane=(e.id==='player'?-3:(Number(e.id.slice(1))%3-1)*12);point.x+=Math.sin(point.a)*lane;point.y-=Math.cos(point.a)*lane;}const pp=proj(point.x,point.y);const angle=Math.atan2(Math.sin(point.a)*.53+Math.cos(point.a)*.25,Math.cos(point.a)*.92-Math.sin(point.a)*.5);ctx.save();ctx.translate(...pp);ctx.rotate(angle);ctx.fillStyle='rgba(20,28,25,.22)';ctx.fillRect(-9*scale,-4*scale,21*scale,10*scale);ctx.fillStyle=e.status==='dnf'?'#8c8d83':e.color;ctx.fillRect(-9*scale,-5*scale,20*scale,9*scale);ctx.fillStyle='#233e3d';ctx.fillRect(-2*scale,-4*scale,6*scale,7*scale);ctx.fillStyle='#e5e2d0';ctx.fillRect(7*scale,-4*scale,2*scale,3*scale);ctx.restore();if(e.id==='player'){ctx.strokeStyle='#dd643e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pp[0],pp[1],16*scale,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#b34d31';ctx.font='bold 10px monospace';ctx.fillText('#'+e.number,pp[0]-10,pp[1]-20*scale);}}}
 else{for(let i=0;i<6;i++){const p=ovalPoint(.06+i*.011,t),xy=proj(p.x,p.y);ctx.fillStyle=i===0?E.active(state).color:C.rivalColors[i];ctx.fillRect(xy[0],xy[1],12*scale,6*scale);}}
 ctx.fillStyle='#61745c';ctx.font='10px monospace';ctx.fillText('ISOMÉTRICA 2D / '+t.km.toFixed(2)+' KM / '+t.bank+'° PERALTE',20,h-20);
 if(r&&r.phase==='grid'){ctx.fillStyle='rgba(34,50,42,.8)';ctx.fillRect(w/2-105,28,210,34);ctx.fillStyle='#f4eddb';ctx.font='700 11px monospace';ctx.textAlign='center';ctx.fillText('PARRILLA FORMADA · ESPERANDO LARGADA',w/2,50);ctx.textAlign='left';}
}
root.OvalVisuals={workshop,raceTrack,carDraw,mechanicalDraw:(ctx,car,x,y,scale,selected)=>carDraw(ctx,car,x,y,scale,false,selected,false,false)};
})(globalThis);
