// Workbench sound: the music plays out of the old radio on the bench (band-limited, a little
// driven, panned to where the radio sits), with a crackle bed and a tuning sweep when it comes
// on; behind it a synthesised partisan camp: muttering voices, a campfire, wind and the odd
// clank of metal. Everything is generated live with Web Audio; no recordings are downloaded.
//
// createBench(ctx) builds the graph on the music player's AudioContext and returns:
//   radioIn  where music.js's master gain connects (see Music's `route` option)
//   tune()   the tuning sweep: static and a whistle, then the station locks in
//   fade(on,volume,seconds)  the camp and crackle level (the music level is music.js's own)
//   setPan(x)  -1…1, the radio's horizontal position on screen

// ---------- Helpers ----------
const rand=(a,b)=>a+Math.random()*(b-a);
function noise(ctx,seconds,{brown=false}={}){
 const b=ctx.createBuffer(1,Math.floor(ctx.sampleRate*seconds),ctx.sampleRate),d=b.getChannelData(0);
 let last=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;if(brown){last=(last+.02*w)/1.02;d[i]=last*3.5;}else d[i]=w;}
 return b;
}
function loop(ctx,buffer,destination){const s=ctx.createBufferSource();s.buffer=buffer;s.loop=true;s.connect(destination);s.start();return s;}
function filter(ctx,type,frequency,Q=.7){const f=ctx.createBiquadFilter();f.type=type;f.frequency.value=frequency;f.Q.value=Q;return f;}
function gain(ctx,value){const g=ctx.createGain();g.gain.value=value;return g;}
function reverb(ctx,seconds=2.2){
 const c=ctx.createConvolver(),n=Math.floor(ctx.sampleRate*seconds),b=ctx.createBuffer(2,n,ctx.sampleRate);
 for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n)**4;}
 c.buffer=b;return c;
}
// Crackle: sparse clicks of random size over faint hiss, 5 s, looped.
function crackleBuffer(ctx){
 const b=ctx.createBuffer(1,ctx.sampleRate*5,ctx.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.05;
 for(let k=0;k<160;k++){const at=Math.floor(Math.random()*d.length),size=Math.random()**3,len=20+Math.floor(Math.random()*200);for(let j=0;j<len&&at+j<d.length;j++)d[at+j]+=(Math.random()*2-1)*size*(1-j/len);}
 return b;
}
// Campfire: low roar plus pops and snaps, 7 s, looped.
function fireBuffer(ctx){
 const sr=ctx.sampleRate,b=ctx.createBuffer(1,sr*7,sr),d=b.getChannelData(0);
 let last=0;for(let i=0;i<d.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;d[i]=last*1.6;}
 for(let k=0;k<90;k++){const at=Math.floor(Math.random()*d.length),size=.15+Math.random()**2*.8,len=Math.floor(sr*rand(.002,.02));for(let j=0;j<len&&at+j<d.length;j++)d[at+j]+=(Math.random()*2-1)*size*Math.exp(-6*j/len);}
 return b;
}

// ---------- Muttering ----------
// A voice is a buzzy source (sawtooth at speaking pitch) through two formant band-passes; each
// syllable moves the formants to a random vowel and the pitch along a falling phrase contour,
// under a short amplitude envelope. Phrases of a few syllables are separated by pauses. Heard
// from a distance (low-passed, reverberant, quiet), that reads as people talking, never as words.
const VOWELS=[[730,1090],[570,840],[300,870],[270,2290],[530,1840],[660,1720],[440,1020]];// F1,F2 (Hz)
function voice(ctx,out,{pitch,pan,level,start,stop}){
 const osc=ctx.createOscillator();osc.type='sawtooth';osc.frequency.value=pitch;
 const f1=filter(ctx,'bandpass',500,6),f2=filter(ctx,'bandpass',1500,8),amp=gain(ctx,0),panner=ctx.createStereoPanner();panner.pan.value=pan;
 osc.connect(f1).connect(amp);osc.connect(f2).connect(amp);amp.connect(panner).connect(out);osc.start();
 let next=start??ctx.currentTime+rand(.3,3);
 if(stop)osc.stop(stop);
 return function schedule(until){
  while(next<until){
   const syllables=Math.floor(rand(3,14)),rate=rand(4,6.5);// syllables per second
   let t=next,contour=pitch*rand(1,1.15);
   for(let i=0;i<syllables;i++){
    const len=1/rate*rand(.7,1.3),[v1,v2]=VOWELS[Math.floor(Math.random()*VOWELS.length)],p=contour*(1-.12*i/syllables)*rand(.97,1.03);
    osc.frequency.setTargetAtTime(p,t,.03);f1.frequency.setTargetAtTime(v1,t,.02);f2.frequency.setTargetAtTime(v2,t,.02);
    amp.gain.setTargetAtTime(level*rand(.6,1),t,.015);amp.gain.setTargetAtTime(0,t+len*.7,.03);
    t+=len;
   }
   next=t+rand(.8,5);// pause before the next phrase (another voice often answers in it)
  }
 };
}
// A distant metallic clank (mess tin, rifle bolt): a few inharmonic partials with a fast decay.
function clank(ctx,out,t){
 const amp=gain(ctx,0),pan=ctx.createStereoPanner();pan.pan.value=rand(-.8,.8);amp.connect(pan).connect(out);
 const base=rand(500,1400);
 for(const ratio of [1,2.76,5.4,8.9]){const o=ctx.createOscillator();o.frequency.value=base*ratio;o.connect(amp);o.start(t);o.stop(t+.6);}
 amp.gain.setValueAtTime(0,t);amp.gain.linearRampToValueAtTime(rand(.02,.05),t+.003);amp.gain.exponentialRampToValueAtTime(.0001,t+rand(.25,.5));
}

// ---------- Graph ----------
export function createBench(ctx){
 const out=ctx.destination;
 // Radio: music in, band-limited to a small speaker, lightly driven, panned to the radio.
 const radioIn=gain(ctx,1),station=gain(ctx,1),drive=ctx.createWaveShaper(),radioPan=ctx.createStereoPanner(),radioOut=gain(ctx,.9);
 const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i/511.5-1;curve[i]=Math.tanh(2.2*x)/Math.tanh(2.2);}drive.curve=curve;
 radioIn.connect(station).connect(filter(ctx,'highpass',320)).connect(filter(ctx,'lowpass',3400)).connect(filter(ctx,'peaking',1400,1.2)).connect(drive).connect(radioPan).connect(radioOut).connect(out);
 // The radio's own noise: crackle bed and the tuning sweep, band-limited like the music.
 const noiseBus=gain(ctx,0),noiseTone=filter(ctx,'bandpass',1800,.6);noiseBus.connect(noiseTone).connect(radioPan);
 const crackle=gain(ctx,.35);loop(ctx,crackleBuffer(ctx),crackle);crackle.connect(noiseBus);
 const hiss=gain(ctx,0);loop(ctx,noise(ctx,3),hiss);hiss.connect(noiseBus);
 // Camp: behind the listener and off to the sides, far away and reverberant.
 const camp=gain(ctx,0),space=reverb(ctx),wet=gain(ctx,.5),distance=filter(ctx,'lowpass',1300);
 camp.connect(distance);distance.connect(out);distance.connect(space).connect(wet).connect(out);
 const voices=[{pitch:112,pan:-.7,level:.05},{pitch:128,pan:-.25,level:.04},{pitch:98,pan:.55,level:.045},{pitch:185,pan:.8,level:.025}].map(v=>voice(ctx,camp,v));
 const fire=gain(ctx,.5),firePan=ctx.createStereoPanner();firePan.pan.value=-.5;loop(ctx,fireBuffer(ctx),fire);fire.connect(filter(ctx,'lowpass',2600)).connect(firePan).connect(camp);
 const wind=gain(ctx,.35);loop(ctx,noise(ctx,6,{brown:true}),wind);const windTone=filter(ctx,'lowpass',420);wind.connect(windTone).connect(camp);
 // Scheduler, like music.js: runs 1.5 s ahead so background-tab timer throttling doesn't gap it.
 let nextClank=ctx.currentTime+rand(4,10);
 setInterval(()=>{
  const until=ctx.currentTime+1.5;for(const v of voices)v(until);
  while(nextClank<until){clank(ctx,camp,nextClank);nextClank+=rand(7,22);}
  windTone.frequency.setTargetAtTime(rand(250,650),ctx.currentTime,1.5);// gusts
 },250);

 return {
  radioIn,
  // Static and a heterodyne whistle sliding into place, then the station fades in over it.
  tune(){
   const t=ctx.currentTime;
   station.gain.cancelScheduledValues(t);station.gain.setValueAtTime(0,t);station.gain.setValueAtTime(0,t+1.3);station.gain.linearRampToValueAtTime(1,t+2.4);
   hiss.gain.cancelScheduledValues(t);hiss.gain.setValueAtTime(.5,t);hiss.gain.setTargetAtTime(.05,t+1.4,.35);
   const whistle=ctx.createOscillator(),wg=gain(ctx,0);whistle.type='sine';whistle.connect(wg).connect(noiseBus);
   whistle.frequency.setValueAtTime(2600,t);whistle.frequency.exponentialRampToValueAtTime(700,t+.6);whistle.frequency.exponentialRampToValueAtTime(1500,t+.9);whistle.frequency.exponentialRampToValueAtTime(60,t+1.5);
   wg.gain.setValueAtTime(0,t);wg.gain.linearRampToValueAtTime(.06,t+.05);wg.gain.setValueAtTime(.06,t+1.2);wg.gain.linearRampToValueAtTime(0,t+1.5);
   whistle.start(t);whistle.stop(t+1.6);
   // A snatch of another station's voice passing by mid-sweep.
   voice(ctx,noiseBus,{pitch:140,pan:0,level:.25,start:t+.55,stop:t+1.6})(t+.56);
  },
  fade(on,volume,seconds=1){
   const t=ctx.currentTime,k=seconds/3;
   camp.gain.setTargetAtTime(on?volume*.9:0,t,k);noiseBus.gain.setTargetAtTime(on?volume*.5:0,t,k);
  },
  setPan(x){radioPan.pan.setTargetAtTime(Math.max(-1,Math.min(1,x)),ctx.currentTime,.1);}
 };
}
