// One sound layer for the Partisan pages: the music player (music.js) routed through the bench's
// radio and camp graph (bench-audio.js), plus the shared on/off, volume and track setting.
//
// The workbench URL is a shell page (ak15-workbench-intro/index.html) that creates the layer and
// shows the bench, then the customiser, in a full-screen frame. Pages inside the frame find the
// shell's layer through window.parent and use it instead of making their own, so the music keeps
// playing across page changes. Opened on their own, the pages make a layer of their own.
//
// layer.scene('bench'|'viewer')  where the listener is: the radio with the camp around it, or the
//                                clean track. The switch crossfades; the music never restarts.
import {Music,TRACKS} from './ak15-weapon-customiser/music.js';
import {createBench} from './ak15-workbench-intro/bench-audio.js';

// v3: the default track became "The Duce Puts On His Uniform". On/off and volume carry over from
// v2; the saved track doesn't, so everyone starts on the new default.
const KEY='ak-customiser-music-v3',OLD_KEY='ak-customiser-music-v2';
function loadPrefs(){
 const base={on:true,volume:.4,track:TRACKS[0].id};
 try{
  const saved=JSON.parse(localStorage.getItem(KEY)||'null');
  if(saved)return {...base,...saved};
  const old=JSON.parse(localStorage.getItem(OLD_KEY)||'{}');
  return {...base,...('on' in old?{on:old.on}:{}),...('volume' in old?{volume:old.volume}:{})};
 }catch{return base;}
}

function createLayer(){
 const prefs=loadPrefs();
 if(!TRACKS.some(t=>t.id===prefs.track))prefs.track=TRACKS[0].id;
 let bench=null,where='viewer',tuned=false;
 const music=new Music({route:ctx=>(bench=createBench(ctx)).radioIn});
 music.setVolume(prefs.volume);music.setTrack(prefs.track);
 const level=()=>prefs.on?prefs.volume:0;
 const mix=(seconds)=>bench?.mix(where,level(),seconds);
 const listeners=new Set();
 const layer={
  music,prefs,TRACKS,
  get bench(){return bench;},
  save(){try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch{}},
  // Pages re-read the state (♪ button, track buttons, slider) when another page changes it.
  subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
  changed(){for(const fn of listeners)try{fn();}catch{listeners.delete(fn);}},// a dead page's listener throws
  // Resolves true once sound is running; false while the browser still blocks autoplay.
  start(fade=1.5){
   const started=music.start(fade);
   // First time on the bench: the radio tunes in before the song.
   if(where==='bench'&&!tuned){tuned=true;bench.tune();}
   mix(3);return started;
  },
  stop(){music.stop();bench?.mix(where,0,.6);},
  scene(name){
   if(name===where)return;where=name;
   if(where==='bench'&&music.playing&&!tuned){tuned=true;bench?.tune();}
   mix(1.5);
  },
  setVolume(v){prefs.volume=v;music.setVolume(v);mix(.3);},
  setTrack(id){prefs.track=id;music.setTrack(id);},
  // True when this layer outlives page changes (it belongs to the shell).
  shared:false
 };
 return layer;
}

// The layer for this page: the shell's if this page runs inside it, otherwise this window's own.
export function soundLayer(){
 try{if(window.parent!==window&&window.parent.partisanSound)return window.parent.partisanSound;}catch{}// cross-origin parent: ignore
 window.partisanSound??=createLayer();
 return window.partisanSound;
}
