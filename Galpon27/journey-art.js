(function (root) {
  'use strict';
  const J = root.GalponJourney;
  const images = {}, sprites = {}, towns = new Map();
  const status = {ready:false, error:'', revision:0, townBuilds:0, truckDraws:0,terrainBuilds:0};
  const create = (w,h) => Object.assign(document.createElement('canvas'), {width:w,height:h});
  const fill = (ctx,color,x,y,w,h) => {ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
  function rng(seed) {return () => ((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}

  // Crop the production sheets once. Tiny alpha residues must not tint the scene.
  function sprite(image, bounds) {
    const [x,y,w,h]=bounds, out=create(w,h),ctx=out.getContext('2d');
    ctx.drawImage(image,x,y,w,h,0,0,w,h);
    const pixels=ctx.getImageData(0,0,w,h),d=pixels.data;
    for(let i=3;i<d.length;i+=4) d[i]=d[i]<64?0:d[i]>230?255:d[i];
    ctx.putImageData(pixels,0,0);
    return out;
  }
  function blit(ctx,name,x,y,w) {
    const img=sprites[name];if(!img)return;
    ctx.drawImage(img,Math.round(x),Math.round(y),Math.round(w),Math.round(w*img.height/img.width));
  }
  async function load() {
    try {
      await Promise.all(Object.entries(root.GalponJourneySources).map(async ([key,src])=>{
        const img=new Image();img.src=src;await img.decode();images[key]=img;
      }));
      const market=new Image();market.src=root.GalponTownMarketSource;await market.decode();root.GalponTownMarketSource=null;for(const type of root.GalponTownShops.types)sprites['shop-'+type.id]=sprite(market,type.crop);
      const regions={shop:[15,100,485,370],garage:[525,100,565,375],fuel:[1110,100,420,375],house:[20,545,480,390],gate:[520,575,540,355],trees:[1040,510,490,445]};
      for(const [key,box] of Object.entries(regions))sprites[key]=sprite(images.kit,box);
      sprites.truck=sprite(images.vehicles,[30,100,1090,490]);
      sprites.trailer=sprite(images.vehicles,[1180,100,970,490]);
      status.ready=true;status.revision++;root.dispatchEvent(new Event('galpon-journey-art-ready'));
    } catch(error) {status.error=error.message;root.dispatchEvent(new Event('galpon-journey-art-ready'));}
  }
  function road(ctx,points,gravel=false,width=8) {
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();
    points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.strokeStyle='#393b2c';ctx.lineWidth=width+4;ctx.stroke();
    ctx.strokeStyle=gravel?'#a68a56':'#66675e';ctx.lineWidth=width;ctx.stroke();
    ctx.strokeStyle=gravel?'#c8ad71':'#d8c897';ctx.lineWidth=.8;ctx.setLineDash(gravel?[1,5]:[4,6]);ctx.stroke();ctx.restore();
  }
  function bridge(ctx,x,y,horizontal) {
    ctx.save();ctx.translate(x,y);if(!horizontal)ctx.rotate(Math.PI/2);
    fill(ctx,'#222b2488',-16,-7,32,17);fill(ctx,'#686b62',-17,-5,34,10);
    fill(ctx,'#b1b1a1',-17,-7,34,2);fill(ctx,'#b1b1a1',-17,5,34,2);
    for(let xx=-14;xx<16;xx+=7){fill(ctx,'#535b50',xx,-8,2,3);fill(ctx,'#535b50',xx,6,2,3);}
    ctx.restore();
  }
  function crossings(ctx,edges=J.links) {
    const roads=edges.map(edge=>({edge,pts:J.path(...edge).map(p=>({x:p.x/2,y:p.y/2}))}));
    const drawn=new Set();
    for(let a=0;a<roads.length;a++)for(let b=a+1;b<roads.length;b++){
      if(roads[a].edge.some(id=>roads[b].edge.includes(id)))continue;
      for(let i=1;i<4;i++)for(let k=1;k<4;k++){
        const p=roads[a].pts[i-1],q=roads[a].pts[i],u=roads[b].pts[k-1],v=roads[b].pts[k];
        const horizontal=p.y===q.y,vertical=u.x===v.x;
        if(horizontal===vertical){const x=horizontal?u.x:p.x,y=horizontal?p.y:u.y;
          if(x>Math.min(p.x,q.x)+1&&x<Math.max(p.x,q.x)-1&&y>Math.min(u.y,v.y)+1&&y<Math.max(u.y,v.y)-1||!horizontal&&y>Math.min(p.y,q.y)+1&&y<Math.max(p.y,q.y)-1&&x>Math.min(u.x,v.x)+1&&x<Math.max(u.x,v.x)-1){
            const key=x+','+y;if(!drawn.has(key)){bridge(ctx,x,y,horizontal);drawn.add(key);}
          }
        }
      }
    }
    return drawn.size;
  }
  function riverBridges(ctx,edges=J.links) {
    const water=create(1280,850),wc=water.getContext('2d');wc.drawImage(images.mainland,0,0,1280,850);
    const d=wc.getImageData(0,0,1280,850).data,seen=new Set();
    // Follow the river corridor in this fixed art asset; blue forest shadows are not water.
    const river=[{x:300,y:0},{x:260,y:90},{x:232,y:160},{x:280,y:250},{x:316,y:330},{x:365,y:420},{x:342,y:500},{x:290,y:580},{x:275,y:665},{x:335,y:750},{x:360,y:850}];
    const wet=(x,y)=>{let center=river.at(-1).x;for(let k=1;k<river.length;k++)if(y<=river[k].y){const a=river[k-1],b=river[k];center=a.x+(b.x-a.x)*(y-a.y)/(b.y-a.y);break;}if(Math.abs(x-center)>23)return false;const i=(Math.round(y)*1280+Math.round(x))*4;return d[i+2]>d[i]*1.15&&d[i+1]>d[i]*1.12&&d[i+2]>48;};
    for(const edge of edges){const pts=J.path(...edge);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],len=Math.hypot(b.x-a.x,b.y-a.y)/2;
      for(let step=0;step<len;step+=3){const x=(a.x+(b.x-a.x)*step/Math.max(1,len))/2,y=(a.y+(b.y-a.y)*step/Math.max(1,len))/2;
        if(!wet(x,y))continue;const key=Math.round(x/30)+','+Math.round(y/30);if(seen.has(key))continue;seen.add(key);bridge(ctx,x,y,a.y===b.y);
      }
    }}status.riverBridges=seen.size;
  }
  function paintTerrain(ctx,visited=null) {
    const edges=visited?J.links.filter(e=>e.some(id=>visited.includes(id))):J.links;
    ctx.imageSmoothingEnabled=false;
    if(!status.ready){fill(ctx,'#556644',0,0,ctx.canvas.width,ctx.canvas.height);return;}
    for(let y=0;y<ctx.canvas.height;y+=850)for(let x=0;x<ctx.canvas.width;x+=1280){ctx.save();ctx.translate(x,y);if(y){ctx.translate(0,850);ctx.scale(1,-1);}if(x){ctx.translate(1280,0);ctx.scale(-1,1);}ctx.drawImage(images.mainland,0,0,1280,850);ctx.restore();}status.terrainBuilds++;
    edges.forEach(edge=>road(ctx,J.path(...edge).map(p=>({x:p.x/2,y:p.y/2})),J.links.indexOf(edge)%4===2));
    status.overpasses=crossings(ctx,edges);riverBridges(ctx,edges);
    for(const n of J.nodes){const x=n.x/2,y=n.y/2;
      fill(ctx,'#7c7c60',x-25,y-20,50,39);fill(ctx,'#777568',x-21,y-16,42,31);
      blit(ctx,n.id==='base'?'garage':'shop',x-27,y-29,34);
      blit(ctx,'house',x+3,y-14,24);blit(ctx,'fuel',x-22,y+1,14);
      if(n.challenge||n.circuit)blit(ctx,'gate',x+14,y+3,19);
    }
  }
  function drawTruck(ctx,x,y,heading,car,moving=false,scale=1) {
    if(!status.ready)return;
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(heading);ctx.scale(scale,scale);ctx.imageSmoothingEnabled=false;
    // The drawbar meets the pickup's rear hitch. Original race sprite on the empty deck.
    fill(ctx,'#20271b60',-37,5,51,3);
    fill(ctx,'#a6a99a',-15,-.65,6,1.3);blit(ctx,'trailer',-38,-6.1,26);blit(ctx,'truck',-12,-6.3,28);
    root.OvalVisuals.drawRaceSprite(ctx,car,-27.7,0,{heading:0,scale:17.5/root.OvalRaceGeometry.carLength});
    if(moving&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const phase=Math.floor(performance.now()/110)%3;
      fill(ctx,'#c6b18b70',-42-phase*3,2+phase,2,2);fill(ctx,'#ac956250',-47-phase*3,-2,3,2);
    }
    ctx.restore();status.truckDraws++;
  }
  function townScene(n) {
    if(towns.has(n.id)){const cached=towns.get(n.id);towns.delete(n.id);towns.set(n.id,cached);return cached;}
    const out=create(1040,560),ctx=out.getContext('2d'),index=J.nodes.indexOf(n),random=rng(2700+index*17),shift=(index%3-1)*22;
    ctx.imageSmoothingEnabled=false;
    const sx=Math.min(images.mainland.width-650,Math.max(0,n.x/2560*(images.mainland.width-650)));
    const sy=Math.min(images.mainland.height-350,Math.max(0,n.y/1700*(images.mainland.height-350)));
    ctx.drawImage(images.ground,sx,sy,650,350,0,0,1040,560);
    fill(ctx,'#a89970',38,45,964,477);fill(ctx,'#77776a',49,56,942,455);
    const pixels=12000;
    for(let i=0;i<pixels;i++)fill(ctx,i%3?'#d3bf9518':'#242f2925',49+Math.floor(random()*942),56+Math.floor(random()*455),2,2);
    road(ctx,[{x:0,y:335},{x:1040,y:335}],index%4===1,43);
    road(ctx,[{x:550+shift,y:0},{x:550+shift,y:560}],false,32);
    // Different yards, greenery and housing retain stable service locations.
    blit(ctx,'shop-'+root.GalponTownShops.forNode(n).id,75+shift,73,300);blit(ctx,'garage',640-shift,65,320);
    blit(ctx,'fuel',100+shift,373,190);blit(ctx,'house',623-shift,388,170);
    if(index%2)blit(ctx,'house',352+shift,407,135);
    for(let i=0;i<8;i++){const xx=12+i*139;blit(ctx,'trees',xx,-30-(i%2)*10,95+random()*25);if(i<6)blit(ctx,'trees',xx,492,75+random()*20);}
    for(let y=125;y<480;y+=110){blit(ctx,'trees',-38,y,102);if(!(n.challenge||n.circuit)||y<230||y>370)blit(ctx,'trees',985,y,105);}
    if(n.challenge||n.circuit){fill(ctx,'#60645d',883,294,157,80);blit(ctx,'gate',865,247,177);}
    else {fill(ctx,'#b1a783',865,278,110,105);blit(ctx,'trees',875,260,80);}
    for(let xx=363;xx<510;xx+=31){fill(ctx,'#d0c9ac',xx,272,23,2);fill(ctx,'#d0c9ac',xx,273,2,28);}
    fill(ctx,'#4d4a38',598,472,40,7);fill(ctx,'#b9975c',598,468,40,5);
    towns.set(n.id,out);if(towns.size>8)towns.delete(towns.keys().next().value);status.townBuilds++;return out;
  }
  function paintTown(canvas,s) {
    canvas.width=1040;canvas.height=560;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    if(!status.ready){fill(ctx,'#556644',0,0,1040,560);return;}
    const n=J.node(s.journey.location);ctx.drawImage(townScene(n),0,0);
    drawTruck(ctx,761,336,0,root.OvalEngine.active(s),false,2.1);
    canvas.dataset.artStyle='sede-16bit';canvas.dataset.location=n.id;canvas.dataset.shopSpecialty=root.GalponTownShops.forNode(n).id;canvas.dataset.carSprite='race-original';
  }
  function paintPump(canvas){canvas.width=240;canvas.height=210;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;blit(ctx,'fuel',0,0,240);}
  root.GalponJourneyArt={drawTruck,paintTerrain,paintTown,paintPump,diagnostics:()=>({...status,townCache:towns.size,carSprite:'OvalVisuals.drawRaceSprite'})};
  load();
})(globalThis);
