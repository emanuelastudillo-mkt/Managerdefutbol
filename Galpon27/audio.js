(function(root){
'use strict';
const M=root.GalponMusic,KEY='galpon27-audio-v1',defaults={music:.28,effects:.5,muted:false};
let preferences={...defaults};try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved)for(const key of ['music','effects'])if(Number.isFinite(saved[key])&&saved[key]>=0&&saved[key]<=1)preferences[key]=saved[key];if(typeof saved?.muted==='boolean')preferences.muted=saved.muted;}catch(ignored){}
let ctx,master,musicBus,fxBus,compressor,noise,engine,unlocked=false,unavailable=false,scene='base',playing='',scoreBus,index=0,epoch=0,timer,
 latest=null,observed=null,lastUpdate=-1,lastPass=-10,voices=new Set(),musicVoices=new Set(),counts={},racing=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),frequency=M.frequency;
function param(p,value,seconds=.05){p.setTargetAtTime(value,ctx.currentTime,seconds);}
function note(context,destination,noteValue,at,duration,voice='lead',velocity=1,registry){
 const osc=context.createOscillator(),gain=context.createGain(),settings={lead:['square',.047],bass:['triangle',.13],arp:['triangle',.075],counter:['sine',.08]},s=settings[voice];
 osc.type=s[0];osc.frequency.setValueAtTime(frequency(noteValue),at);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(s[1]*velocity,at+.008);gain.gain.setValueAtTime(s[1]*velocity*.8,at+Math.max(.01,duration*(voice==='arp' ? .18 : .65)));gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
 osc.connect(gain);gain.connect(destination);osc.start(at);osc.stop(at+duration+.015);
 const item={osc,gain};registry?.add(item);osc.onended=()=>{osc.disconnect();gain.disconnect();registry?.delete(item);};return item;
}
function makeNoise(context){const b=context.createBuffer(1,context.sampleRate,context.sampleRate),d=b.getChannelData(0);let seed=27123;for(let i=0;i<d.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;d[i]=(seed/4294967296*2-1)*.65;}return b;}
function makeEngine(){const gain=ctx.createGain(),filter=ctx.createBiquadFilter(),osc=ctx.createOscillator(),harmonic=ctx.createOscillator(),hg=ctx.createGain(),road=ctx.createBufferSource(),rg=ctx.createGain();
 filter.type='lowpass';filter.frequency.value=900;gain.gain.value=0;osc.type='sawtooth';harmonic.type='triangle';hg.gain.value=.32;road.buffer=noise;road.loop=true;rg.gain.value=.15;
 osc.connect(filter);harmonic.connect(hg);hg.connect(filter);road.connect(rg);rg.connect(filter);filter.connect(gain);gain.connect(fxBus);osc.start();harmonic.start();road.start();return{gain,filter,osc,harmonic};}
function init(){if(unavailable)return false;if(ctx)return true;const Constructor=root.AudioContext||root.webkitAudioContext;if(!Constructor){unavailable=true;paint();return false;}
 try{ctx=new Constructor();master=ctx.createGain();musicBus=ctx.createGain();fxBus=ctx.createGain();compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-12;compressor.ratio.value=6;musicBus.connect(master);fxBus.connect(master);master.connect(compressor);compressor.connect(ctx.destination);noise=makeNoise(ctx);engine=makeEngine();mix();timer=setInterval(schedule,50);return true;}catch(error){unavailable=true;if(ctx)ctx.close().catch(()=>{});ctx=null;engine=null;paint();return false;}}
function mix(){if(!ctx)return;param(master.gain,preferences.muted?0:.8);param(musicBus.gain,preferences.music);param(fxBus.gain,preferences.effects);}
async function unlock(){if(!init())return;try{if(!document.hidden&&!preferences.muted)await ctx.resume();unlocked=true;paint();schedule();}catch(ignored){paint();}}
function stopScore(){for(const v of musicVoices){try{v.osc.stop(ctx.currentTime+.05);}catch(ignored){}}if(scoreBus){const old=scoreBus;param(old.gain,0,.015);setTimeout(()=>old.disconnect(),150);}playing='';}
function schedule(){if(!ctx||ctx.state!=='running'||document.hidden||preferences.muted)return;
 if(!preferences.music){if(playing)stopScore();return;}
 const score=M.scores[scene];if(playing!==scene){stopScore();scoreBus=ctx.createGain();scoreBus.gain.value=0;scoreBus.connect(musicBus);param(scoreBus.gain,1,.3);playing=scene;epoch=ctx.currentTime+.06;index=0;}
 const beat=60/score.bpm,loop=score.beats*beat;
 // Skip elapsed notes after device interruption, never emit a catch-up burst.
 if(ctx.currentTime-epoch>loop){epoch+=Math.floor((ctx.currentTime-epoch)/loop)*loop;index=0;}
 while(true){const event=score.events[index],at=epoch+event.beat*beat;if(at>ctx.currentTime+.18)break;if(at>=ctx.currentTime-.01)note(ctx,scoreBus,event.note,Math.max(at,ctx.currentTime),event.length*beat,event.voice,event.velocity,musicVoices);index++;if(index===score.events.length){index=0;epoch+=loop;}}
}
const cues={
 start:[[72,0,.1],[72,.16,.1],[84,.36,.3]],finish:[[62,0,.16],[65,.18,.16],[69,.36,.16],[74,.54,.6]],
 turbo:[[45,0,.08],[52,.07,.08],[59,.14,.1],[69,.22,.2]],grip:[[74,0,.12],[81,.09,.25]],repair:[[67,0,.1],[71,.13,.1],[74,.26,.28]],
 pit:[[60,0,.12],[55,.15,.22]],service:[[72,0,.06],[67,.09,.06],[72,.18,.08]],exit:[[60,0,.1],[67,.13,.2]],
 pass:[[57,0,.08],[69,.09,.12]],gear:[[40,0,.045]],warning:[[66,0,.13],[66,.2,.13]],contact:[[30,0,.16]],retire:[[57,0,.18],[53,.2,.18],[50,.4,.35]]
};
function sfx(id,pan=0){if(!ctx||ctx.state!=='running'||preferences.muted||!preferences.effects||document.hidden||!cues[id]||voices.size>40)return false;
 counts[id]=(counts[id]||0)+1;const p=ctx.createStereoPanner();p.pan.value=clamp(pan,-1,1);p.connect(fxBus);for(const [n,delay,duration] of cues[id])note(ctx,p,n,ctx.currentTime+delay,duration,id==='contact'?'bass':'arp',id==='gear'?.55:1.9,voices);
 setTimeout(()=>p.disconnect(),1600);return true;
}
function observe(r,active){if(!r){observed=null;return;}const e=r.entries[0],position=[...r.entries].sort((a,b)=>b.distance-a.distance).findIndex(v=>v.id==='player'),snapshot={ref:r,serial:r.serial,time:r.time,phase:r.phase,position,gear:e.telemetry?.gear||0,pit:e.pitVisit?.phase||'',damage:e.damage,status:e.status,fuel:e.fuel};
 if(observed&&observed.ref===r&&snapshot.time>=observed.time){
  if(snapshot.phase==='finished'&&observed.phase!=='finished')sfx('finish');
  if(active){if(snapshot.phase==='running'&&observed.phase==='grid')sfx('start');if(snapshot.gear!==observed.gear&&e.traffic?.speed>25)sfx('gear');if(snapshot.pit!==observed.pit){if(snapshot.pit==='entry')sfx('pit');if(snapshot.pit==='service')sfx('service');if(snapshot.pit==='exit')sfx('exit');}
   if(snapshot.damage>observed.damage+.2)sfx('contact');if(snapshot.status==='dnf'&&observed.status!=='dnf')sfx('retire');
   if(snapshot.position!==observed.position&&!snapshot.pit&&ctx&&ctx.currentTime-lastPass>.8){sfx('pass',snapshot.position<observed.position?.7:-.7);lastPass=ctx.currentTime;}
   if(snapshot.fuel<8&&observed.fuel>=8)sfx('warning');}
 }observed=snapshot;
}
function update(state,view,running,travelRunning,now=performance.now()){
 latest={state,view,running,travelRunning};const r=state.race,e=r?.entries[0];scene=view==='carrera'&&r?(r.phase==='finished'?'town':'race'):travelRunning?'road':state.journey.location==='base'?'base':'town';
 racing=!!(running&&view==='carrera'&&r?.phase==='running'&&e?.status!=='dnf'&&!document.hidden);
 if(now-lastUpdate<80)return;lastUpdate=now;observe(r,!!(running&&view==='carrera'&&!document.hidden));
 if(ctx){const moving=racing,service=e?.pitVisit?.phase==='service',rpm=e?.telemetry?.rpm||1800,v=e?.traffic?.speed||0;
  param(engine.gain.gain,moving?(service ? .012 : .032+clamp(v/300,0,1)*.048):(travelRunning&&!document.hidden ? .024 : 0),.08);
  const hz=moving?clamp(rpm/75,35,180):42;param(engine.osc.frequency,hz,.08);param(engine.harmonic.frequency,hz*.5,.08);param(engine.filter.frequency,moving?350+clamp(v,0,320)*5:450,.08);
 }schedule();
}
function setPreferences(values){for(const key of ['music','effects'])if(Number.isFinite(values[key]))preferences[key]=clamp(values[key],0,1);if(typeof values.muted==='boolean')preferences.muted=values.muted;
 try{localStorage.setItem(KEY,JSON.stringify(preferences));}catch(ignored){}mix();if(ctx&&preferences.muted){stopScore();ctx.suspend().catch(()=>{});}else unlock();paint();}
function paint(){const button=document.getElementById('audioButton');if(button){button.textContent=preferences.muted?'♪ ×':'♪';button.setAttribute('aria-label',preferences.muted?'Sonido silenciado: abrir ajustes':'Música y efectos: abrir ajustes');}
 const status=document.getElementById('audioStatus');if(status)status.textContent=unavailable?'Este navegador no permite reproducir audio.':preferences.muted?'Todo el sonido está silenciado.':unlocked?'Sonido activado.':'El sonido se activa al interactuar con el juego.';
 const mute=document.getElementById('audioMute');if(mute){mute.textContent=preferences.muted?'Activar sonido':'Silenciar todo';mute.setAttribute('aria-pressed',String(preferences.muted));}}
function open(){let dialog=document.getElementById('audioDialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='audioDialog';dialog.setAttribute('aria-labelledby','audioTitle');document.body.append(dialog);}
 dialog.innerHTML=`<div class="audio-panel"><div class="eyebrow">GALPÓN 27 / SONIDO</div><h2 id="audioTitle">Música y efectos</h2><p>Melodías originales de inspiración clásica con timbres de videojuego. Cada lugar tiene su propia música.</p><label for="musicVolume">Música <output id="musicValue">${Math.round(preferences.music*100)}%</output></label><input id="musicVolume" type="range" min="0" max="100" value="${Math.round(preferences.music*100)}"><label for="effectsVolume">Efectos <output id="effectsValue">${Math.round(preferences.effects*100)}%</output></label><input id="effectsVolume" type="range" min="0" max="100" value="${Math.round(preferences.effects*100)}"><p id="audioStatus" role="status"></p><div class="audio-actions"><button class="btn secondary" id="audioTest">Probar efectos</button><button class="btn secondary" id="audioMute">Silenciar todo</button><button class="btn orange" id="audioClose">Listo</button></div><small>Astillero: 10 min · Pampa: 12 min · Sol: 15 min. La pausa detiene el motor y el reloj; la música continúa.</small></div>`;
 for(const key of ['music','effects'])dialog.querySelector('#'+key+'Volume').oninput=event=>{const value=Number(event.target.value);setPreferences({[key]:value/100});dialog.querySelector('#'+key+'Value').value=value+'%';};
 dialog.querySelector('#audioMute').onclick=()=>setPreferences({muted:!preferences.muted});dialog.querySelector('#audioTest').onclick=async()=>{await unlock();sfx('turbo');};dialog.querySelector('#audioClose').onclick=()=>dialog.close();dialog.onclick=event=>{if(event.target===dialog)dialog.close();};paint();dialog.showModal();
}
document.addEventListener('pointerdown',()=>{if(!unlocked||ctx?.state==='suspended'&&!preferences.muted)unlock();},{capture:true});document.addEventListener('keydown',event=>{if(!event.ctrlKey&&!event.metaKey&&(!unlocked||ctx?.state==='suspended'&&!preferences.muted))unlock();},{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(ctx)ctx.suspend().catch(()=>{});}else if(unlocked&&!preferences.muted){lastUpdate=-1;unlock();if(latest)update(latest.state,latest.view,false,false);}});
const api={update,sfx,open,setPreferences,renderNote:note,makeNoise,cues,diagnostics:()=>({available:!unavailable,unlocked,context:ctx?.state||'locked',scene,playing,preferences:{...preferences},voices:voices.size,musicVoices:musicVoices.size,engineLevel:engine?.gain.gain.value||0,counts:{...counts}})};
root.GalponAudio=api;paint();
})(globalThis);
