(function(root){
'use strict';
// Original scores: no recordings, samples or quotations of existing works.
// Beats are quarter notes. Explicit melodic phrases sit above a changing bass
// and broken chords, with A/B reprises, a contrasting middle and a cadence.
const themes={
 base:{title:'Minueto del galpón',bpm:104,meter:3,key:60,minor:false,
  melody:[[4,3,2,1,2,3],[5,4,3,2,1,0],[2,3,4,5,4,3],[2,1,0,1,2,4],[5,6,7,6,5,4],[3,4,5,4,3,2],[1,2,3,2,1,6],[7,6,5,4,1,0]],chords:[0,3,4,0,5,1,4,0]},
 town:{title:'Gavota de los pueblos',bpm:112,meter:4,key:55,minor:false,
  melody:[[0,2,4,3,2,1,2,0],[4,5,6,5,4,3,2,4],[3,2,1,2,3,4,5,3],[2,1,0,6,4,2,1,0],[5,4,3,4,5,6,7,5],[6,5,4,3,2,3,4,2],[1,2,3,4,5,4,3,1],[2,1,6,4,2,1,0,0]],chords:[0,4,3,0,5,1,4,0]},
 road:{title:'Rondó del camino',bpm:116,meter:3,key:57,minor:true,
  melody:[[0,2,4,5,4,2],[1,3,5,4,3,1],[2,4,6,5,4,2],[3,2,1,0,1,2],[4,6,7,6,5,4],[5,4,3,2,3,5],[4,3,2,1,6,4],[2,1,0,1,2,0]],chords:[0,3,6,2,5,3,4,0]},
 race:{title:'Tocata del óvalo',bpm:138,meter:4,key:50,minor:true,
  melody:[[0,2,4,7,6,4,2,1],[0,1,2,4,5,4,2,0],[6,4,2,1,2,4,6,7],[5,4,3,2,1,2,4,3],[2,4,5,6,7,6,5,4],[3,5,6,7,6,5,3,2],[1,3,4,6,5,4,2,1],[2,1,6,4,2,1,0,0]],chords:[0,0,6,3,5,1,4,0]}
};
function degree(t,d){const scale=t.minor?[0,2,3,5,7,8,11]:[0,2,4,5,7,9,11];return t.key+scale[((d%7)+7)%7]+12*Math.floor(d/7);}
function compose(id){const t=themes[id];if(!t)throw Error('Partitura desconocida.');const events=[],bars=48;
 const add=(beat,length,note,voice,velocity=1)=>events.push({beat,length,note,voice,velocity});
 for(let bar=0;bar<bars;bar++){
  const section=Math.floor(bar/8),phrase=bar%8,contrast=section===2||section===3,
   shift=contrast?2:0,chord=t.chords[phrase]+(contrast?2:0),start=bar*t.meter;
  const line=t.melody[phrase];
  for(let i=0;i<line.length;i++){
   const d=line[i]+shift+(section===4&&i%4===0?7:0),last=bar===bars-1;
   if(last&&i>=line.length-2){if(i===line.length-2)add(start+i*.5,1,degree(t,0)+12,'lead',.82);continue;}
   add(start+i*.5,.43,degree(t,d)+12,'lead',i%2===0?.85:.68);
  }
  // Bass on strong beats, then a light fifth; return firmly to the tonic.
  for(let beat=0;beat<t.meter;beat++)add(start+beat,.75,degree(t,bar===bars-1?0:chord+(beat%2?4:0))-12,'bass',beat===0?.75:.5);
  const pattern=id==='race'?[0,2,4,2]:[0,4,2,4];
  for(let step=0;step<t.meter*4;step++)add(start+step*.25,.19,degree(t,chord+pattern[step%4]),'arp',.35);
  if(section%2===1)for(let beat=0;beat<t.meter;beat++)add(start+beat,.8,degree(t,line[Math.min(beat*2,line.length-1)]+shift-2)+12,'counter',.27);
 }
 events.sort((a,b)=>a.beat-b.beat);return {id,title:t.title,bpm:t.bpm,meter:t.meter,beats:bars*t.meter,events};
}
const scores=Object.fromEntries(Object.keys(themes).map(id=>[id,compose(id)]));
const api={scores,frequency:n=>440*2**((n-69)/12)};root.GalponMusic=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
