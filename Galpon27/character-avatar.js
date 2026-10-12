(function(root){
'use strict';
const P=root.GalponStoryProfile||(typeof require==='function'?require('./story-profile'):null);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Every face has its own anatomy; all geometry stays on the 128px pixel grid.
const models=Object.freeze({
 oval:[22,23,18,10,88,54,0,5,15],square:[23,24,23,15,87,53,1,6,17],round:[23,26,21,12,86,53,0,5,14],angular:[21,24,17,9,89,53,2,5,16],
 long:[20,21,17,9,94,55,1,6,14],heart:[24,23,16,7,89,52,2,4,16],highcheeks:[21,25,16,9,91,51,2,5,17],broad:[24,26,25,16,89,54,1,8,19],
 soft:[21,23,18,11,86,55,0,4,16],aquiline:[21,22,19,11,92,52,2,7,14],freckled:[22,24,18,10,88,53,0,5,17],mature:[23,24,21,12,91,54,1,6,16]
});
function portrait(profile,extra=''){
 const a=profile.appearance,[temple,cheek,jaw,chin,end,ey,brow,nose,mouth]=models[a.face]||models.oval,female=a.gender==='female';
 const color=k=>(P.options[k].find(x=>x[0]===a[k])||P.options[k][0])[2],hair=color('hairColor'),skin=color('skin'),eye=color('eyes');
 const shade=(c,n)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+n)).toString(16).padStart(2,'0')).join('');
 const s0=shade(skin,-41),s1=shade(skin,-25),s2=shade(skin,-12),s3=shade(skin,12),s4=shade(skin,23),h0=shade(hair,-24),h1=shade(hair,-12),h2=shade(hair,17),h3=shade(hair,32),ink='#252b30';
 let out='';const rect=(x,y,w,h,c)=>{out+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;},path=(d,c)=>{out+=`<path d="${d}" fill="${c}"/>`;};
 // Workshop window, tool rack and cabinets: subdued behind the face.
 rect(0,0,128,128,'#172a31');rect(4,4,120,120,'#293d40');rect(8,8,112,81,'#344b49');rect(8,9,112,3,'#5c6e5a');
 rect(13,15,28,46,'#20383d');rect(16,18,22,14,'#71857a');rect(16,34,22,12,'#5c7a75');rect(16,48,22,10,'#3a5c60');rect(25,18,3,40,'#253f43');rect(16,32,22,3,'#253f43');rect(12,61,31,3,'#1e3136');
 rect(99,17,3,62,'#6a705a');rect(102,17,2,62,'#1f3338');rect(108,25,9,3,'#8c8260');rect(109,28,3,21,'#24383e');rect(113,28,3,14,'#24383e');rect(107,52,11,3,'#73806a');
 rect(8,80,112,6,'#1d3036');rect(8,87,112,34,'#293b3d');rect(12,92,22,16,'#42504a');rect(14,92,18,2,'#76735b');rect(14,99,18,2,'#293c3c');rect(18,95,7,1,'#a49a70');
 if(['long','ponytail','bob','braids'].includes(a.hair)){
  path('M43 24h40v4h7v7h4v56h-5v13H35V89h-3V39h4V29h7z',ink);path('M44 27h38v4h6v9h3v50h-5v10H38V87h-3V40h4v-9h5z',h0);
  if(a.hair==='ponytail'){path('M88 40h10v5h5v13h-3v29h-4v11h-8V84h3V58h-3z',h1);rect(89,45,10,4,'#c19353');rect(94,54,3,25,h2);}
 }
 // Racing overalls, shoulder pads, seams, zipper and embroidered patches.
 path('M46 93h36v4h12v4h10v5h7v8h5v14H12v-14h5v-8h7v-5h10v-4h12z',ink);path('M46 96h36v4h12v5h9v7h7v16H18v-16h7v-7h9v-5h12z','#37586c');
 path('M24 109h14v19H18v-13h6z','#2b4356');path('M90 106h11v7h9v15H90z','#263f51');path('M35 103h7v25h-5v-17h-6v-4h4z','#66808a');path('M85 103h7v4h5v4h-9v17h-5v-21h2z','#526f7b');
 rect(39,108,4,20,'#c3b579');rect(85,108,4,20,'#a89c63');rect(45,117,12,8,'#213947');rect(46,118,10,2,'#d7d7b9');rect(46,121,4,2,'#a0ada5');rect(52,121,4,2,'#a0ada5');
 rect(72,113,12,8,'#202f39');rect(73,114,10,3,'#bba266');rect(74,118,7,1,'#dcd5ae');rect(62,109,3,19,'#1b303f');rect(63,113,1,14,'#98a4a1');rect(61,111,5,4,'#b4b8a4');
 rect(53,80,22,21,s0);rect(55,84,18,19,skin);rect(65,86,9,16,s2);rect(56,94,8,5,s3);path('M46 96h8l10 10-8 7-8-9z','#97a5a3');path('M75 96h7l-3 10-8 7-7-7z','#738b92');path('M48 98h5l9 9-6 3-5-7z','#c8c9b6');path('M77 99h3l-3 7-6 4-4-3z','#a2b0a9');
 const t=temple-(female?1:0),c=cheek-(female?1:0),j=jaw-(female?2:0);
 const face=`M${64-t+7} 26H${64+t-7}v4h5v5h2v11H${64+c}v25h-3v8H${64+j}v5h-4v5H${64+chin}V${end}H${64-chin}V89H${64-j+4}v-5h-4v-5H${64-c+3}v-8h-3V46H${64-t}V35h2v-5h5z`;
 for(const x of [64-c-5,64+c-1]){rect(x,52,6,17,ink);rect(x+1,53,4,14,s1);rect(x+1,54,3,4,skin);rect(x+2,59,2,6,s0);rect(x+2,64,2,2,s2);}
 path(face,skin);
 path(`M${64+c-4} 47h4v24h-3v8H${64+j}v5h-4v5H${64+chin}V${end}H${64-chin}V89H${64-j+4}v-5h-4v-5H${64-c+3}v-8h-3V47h4v23h3v9h4v5h5v3h20v-3h5v-5h4v-9h3z`,s1);
 rect(48,35,25,8,s3);rect(50,34,19,2,s4);rect(48,43,17,3,s3);path(`M${64-c+3} 62h7v5h5v5h-4v6h-5v-7h-3z`,s2);path(`M${64+c-8} 60h5v13h-4v7h-5v4h-4v-5h4V68h4z`,s2);
 rect(47,64,9,4,s3);rect(48,65,6,2,s4);rect(74,64,7,3,s3);rect(55,end-5,15,2,s2);rect(57,end-4,12,2,s3);rect(60,end-3,6,1,s4);
 const spacing=({round:-2,broad:-2,highcheeks:-1,long:2,aquiline:1,soft:1,heart:-1})[a.face]||0;
 if(female){path(`M${45+spacing} ${ey-6+brow}h3v-1h7v1h2v1h-8v1h-4z`,shade(hair,-10));path(`M${70-spacing} ${ey-6}h7v1h5v2h-5v-1h-7z`,shade(hair,-10));}
 else{path(`M${45+spacing} ${ey-7+brow}h4v-1h7v2h2v2h-5v-1h-8z`,shade(hair,-10));path(`M${70-spacing} ${ey-6}h7v1h5v3h-5v-1h-7z`,shade(hair,-10));}
 rect(46+spacing,ey-3,11,2,s1);rect(70-spacing,ey-3,11,2,s1);
 const ex=female?1:0;for(const [x,iris]of [[46+spacing,52+spacing],[70-spacing,73-spacing]]){rect(x,ey-1,10,1,ink);rect(x+1,ey,9,4+ex,'#c7c6b3');rect(x+2,ey,6,3+ex,'#eee4cd');rect(iris,ey,4,4+ex,shade(eye,-23));rect(iris,ey+1,3,3,eye);rect(iris+1,ey,2,3,ink);rect(iris,ey,1,1,'#fff4d7');rect(x+1,ey+4+ex,9,1,s0);rect(x+2,ey+5+ex,7,1,s2);}
 if(female){rect(44+spacing,ey-1,2,1,ink);rect(80-spacing,ey-1,3,1,ink);rect(81-spacing,ey-2,1,1,ink);}
 const ne=ey+(a.face==='aquiline'?18:a.face==='long'?17:15);rect(63,ey,3,ne-ey-3,s2);rect(62,ey+2,2,ne-ey-4,s3);rect(62,ey+4,1,6,s4);path(`M65 ${ey+6}h2v${ne-ey-8}h${nose-3}v4H${63-nose+2}v-2h3v-3h2v-1z`,s1);rect(61,ne-3,5,2,s3);rect(62,ne-3,2,1,s4);rect(60,ne,3,1,s0);rect(67,ne-1,2,1,s0);
 if(a.face==='aquiline'){rect(66,ey+8,2,6,s1);rect(67,ey+12,2,2,s0);}
 const my=Math.max(ne+6,end-11),mw=mouth+(female?1:0),mx=64-Math.floor(mw/2);rect(61,my-3,5,2,s2);rect(mx+2,my-1,mw-4,1,s2);rect(mx,my,mw,1,shade(skin,-43));rect(mx+1,my+1,mw-2,2,female?shade(skin,-28):s1);rect(mx+3,my+1,mw-6,1,shade(skin,4));rect(mx+3,my+3,mw-6,1,s3);rect(mx-1,my,1,2,s1);rect(mx+mw,my,1,2,s1);
 if(['angular','highcheeks'].includes(a.face)){rect(43,70,5,1,s1);rect(78,70,5,1,s1);rect(46,72,3,1,s2);}
 if(a.face==='freckled')for(const [x,y]of [[47,65],[50,68],[53,64],[56,67],[60,66],[67,66],[72,67],[76,64],[79,68],[82,65]])rect(x,y,1,1,s0);
 if(a.face==='mature'){rect(50,44,26,1,s2);rect(54,47,18,1,s2);rect(43,ey+7,9,1,s1);rect(76,ey+7,8,1,s1);rect(55,my-6,1,4,s1);rect(73,my-5,1,4,s1);rect(46,ey+3,1,2,s0);rect(81,ey+3,2,1,s0);if(!female)for(let x=49;x<80;x+=3){rect(x,my+5+(x%2),1,1,s0);rect(x+1,my+7,1,1,s1);}}
 const hairstyles={
 short:'M45 20h35v3h7v5h5v9h1v17h-5V42h-4V32H57v4H46v16h-7V32h3v-8h3z',side:'M46 20h33v3h9v5h5v25h-6V36h-7v-5h-6v8H62v4H49v7H39V33h3v-9h4z',waves:'M45 22h8v-7h18v3h12v5h7v7h5v24h-7V41h-5v-9h-8v7H65v-5H55v6H44v15h-7V35h3v-8h5z',
 curls:'M44 21h8v-6h12v-3h10v5h9v5h8v6h5v13h-4v12h-7V38h-7v4h-9v-7H57v7H46v13h-8V43h-4V30h5v-5h5z',long:'M46 21h32v3h9v6h6v61h-7V43h-4V33H68v-4h-5v5H49v9h-6v49h-8V37h4V28h7z',ponytail:'M46 22h33v3h8v7h5v23h-7V41h-4V34H48v8h-5v14h-6V35h4v-9h5z',
 shaved:'M48 26h31v4h7v7h4v14h-5V39h-5v-7H49v7h-5v12h-5V38h3v-8h6z',bob:'M44 22h36v4h8v8h5v43h-6v7h-9v-6h4V38H71v-6h-8v5H48v42h3v6H39v-9h-5V38h4V28h6z',braids:'M46 21h32v4h9v8h5v21h-7V38H67v-7h-5v7H47v16h-7V34h2v-9h4z',undercut:'M48 18h28v3h10v6h4v8h-5v-4H71v7H52v5H41V32h3V22h4z'};
 path(hairstyles[a.hair]||hairstyles.short,h0);
 if(a.hair==='shaved'){rect(49,28,30,2,hair);rect(46,31,9,3,h1);rect(79,32,5,5,hair);for(let x=49;x<79;x+=4)rect(x,31,2,1,h2);}
 else{
  path('M48 24h27v3h9v3H65v3H49v5h-6V29h5z',hair);rect(50,24,19,2,h2);rect(52,24,10,1,h3);rect(46,28,12,2,h2);rect(43,33,4,7,h1);
  if(a.hair==='side'){path('M47 29h25v4H62v4H51v3H44v-5h3z',hair);rect(48,30,17,2,h2);rect(45,34,10,2,h2);rect(49,33,7,1,h3);}
  if(a.hair==='waves')for(const [x,y,w]of [[54,18,13],[48,23,12],[67,26,12],[45,32,10],[76,31,8]]){rect(x,y,w,3,hair);rect(x+1,y,w-3,1,h3);rect(x+2,y+3,w-3,2,h1);}
  if(a.hair==='curls')for(const [x,y]of [[55,17],[66,15],[76,21],[44,25],[56,27],[68,24],[82,29],[39,34],[49,34],[72,35],[88,39]]){rect(x,y,7,6,hair);rect(x+1,y,4,2,h2);rect(x+1,y,2,1,h3);rect(x+4,y+4,3,2,h1);}
  if(['long','bob'].includes(a.hair)){rect(37,43,4,a.hair==='long'?43:30,hair);rect(39,44,1,26,h2);rect(87,41,3,a.hair==='long'?44:30,h1);rect(87,44,1,26,h2);rect(43,37,3,21,hair);rect(44,39,1,13,h3);rect(84,36,2,23,hair);if(a.hair==='bob'){rect(38,74,9,3,h1);rect(83,74,7,3,h1);rect(51,31,9,2,h2);}}
  if(a.hair==='ponytail'){rect(42,35,3,12,hair);rect(83,34,3,12,h1);rect(50,28,24,1,h2);rect(51,31,20,1,h1);}
  if(a.hair==='braids'){rect(63,26,2,9,s1);for(const x of [37,86])for(let y=48;y<99;y+=7){rect(x,y,7,6,h1);rect(x+(y%2?1:2),y,4,3,hair);rect(x+2,y,2,1,h2);}rect(37,94,7,3,'#bfa15f');rect(86,94,7,3,'#bfa15f');}
  if(a.hair==='undercut'){rect(40,42,5,11,shade(hair,22));rect(85,38,4,15,h1);rect(40,43,5,1,hair);rect(41,47,4,1,h1);rect(49,21,22,3,hair);rect(52,21,13,1,h3);rect(47,27,19,2,h2);rect(49,31,11,2,h2);}
 }
 rect(0,0,128,3,'#9caa80');rect(0,3,3,125,'#768b70');rect(125,3,3,125,'#162b31');rect(3,125,122,3,'#162b31');
 return `<svg class="character-portrait ${esc(extra)}" viewBox="0 0 128 128" shape-rendering="crispEdges" role="img" aria-label="Retrato de ${esc(profile.name)}" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}
const api={portrait,models};root.GalponCharacterAvatar=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
