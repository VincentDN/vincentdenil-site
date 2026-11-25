// Sound: the soundtrack plays from a YouTube embed in the field-radio panel (placeholder, see the Credits dialog);
// the ambience is the PARTISAN campaign map soundscape; interface sounds are synthesised with Web Audio.
let ctx, master, ambBus, sfxBus, noiseBuf, timer, yt, ytReady = false;
const st = {music: true, amb: true};

function makeNoise() {
  const b = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate), d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noiseBuf = b;
  const br = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate), e = br.getChannelData(0); // brown noise for the sea
  for (let i = 0; i < e.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; e[i] = last * 3.5; }
  return br;
}
const noise = () => { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; return s; };
function env(g, t, a, peak, dec, sus = 0.0001) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(sus, t + a + dec); }

// ---------- ambience: the PARTISAN campaign map soundscape (CC0 Freesound recordings, see the Credits dialog) ----------
// A countryside bed, marching feet while armies move, distant radio chatter now and then, and a murmur of voices
// acknowledging each order.
const FILES = {country: 'amb-countryside', feet: 'march-gravel', walla: 'voices', r1: 'radio-chatter-1', r2: 'radio-chatter-2', r3: 'radio-chatter-3', r4: 'radio-chatter-4'};
const buffers = {}, loops = {};
let marching = false, ackAt = -9;
function play(key, level, {loop = false, duration = 0, offset = 0, lp = 5500} = {}) {
  if (!buffers[key]) return null;
  const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  s.buffer = buffers[key]; s.loop = loop; f.type = 'lowpass'; f.frequency.value = lp;
  g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(level, ctx.currentTime + (loop ? 1.5 : 0.08));
  s.connect(f).connect(g).connect(ambBus);
  s.start(0, offset % s.buffer.duration);
  if (duration) { g.gain.setTargetAtTime(0, ctx.currentTime + Math.max(0.1, duration - 0.2), 0.07); s.stop(ctx.currentTime + duration); }
  s.gain = g;
  return s;
}
function ambience() {
  makeNoise();
  for (const [k, f] of Object.entries(FILES))
    fetch(new URL(`../audio/${f}.mp3`, import.meta.url)).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => { buffers[k] = buf; }).catch(() => {});
  let radioAt = ctx.currentTime + 8;
  return () => {
    if (!loops.country && buffers.country) loops.country = play('country', 0.45, {loop: true});
    if (marching && !loops.feet && buffers.feet) loops.feet = play('feet', 0.32, {loop: true});
    if (!marching && loops.feet) { loops.feet.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15); loops.feet.stop(ctx.currentTime + 0.6); loops.feet = null; }
    if (ctx.currentTime > radioAt) { play('r' + (1 + Math.floor(Math.random() * 4)), 0.22, {duration: 4, lp: 1700}); radioAt = ctx.currentTime + 24 + Math.random() * 16; }
  };
}
export function setMarching(on) { marching = on; }
export function acknowledge() {
  if (!ctx || ctx.currentTime - ackAt < 2) return;
  if (play('walla', 0.4, {duration: 1.3, offset: Math.random() * 20, lp: 1000})) ackAt = ctx.currentTime;
}

// ---------- interface sounds ----------
export function sfx(kind) {
  if (!ctx) return;
  const t = ctx.currentTime;
  if (kind === 'select') { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(1320, t + 0.05); env(g, t, 0.003, 0.12, 0.12); o.connect(g).connect(sfxBus); o.start(t); o.stop(t + 0.2); }
  if (kind === 'order') { // radio squelch and a two-tone acknowledgement
    const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 1.5; env(g, t, 0.002, 0.12, 0.12); n.connect(f).connect(g).connect(sfxBus); n.start(t, Math.random()); n.stop(t + 0.15);
    for (const [fq, dt] of [[660, 0.12], [990, 0.22]]) { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'square'; o.frequency.value = fq; env(og, t + dt, 0.002, 0.05, 0.08); o.connect(og).connect(sfxBus); o.start(t + dt); o.stop(t + dt + 0.12); }
  }
  if (kind === 'type') { const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'bandpass'; f.frequency.value = 2400 + Math.random() * 1200; f.Q.value = 3; env(g, t, 0.001, 0.07, 0.025); n.connect(f).connect(g).connect(sfxBus); n.start(t, Math.random()); n.stop(t + 0.04); }
  if (kind === 'click') { const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'highpass'; f.frequency.value = 3000; env(g, t, 0.001, 0.1, 0.03); n.connect(f).connect(g).connect(sfxBus); n.start(t); n.stop(t + 0.05); }
}

export function startAudio() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
  master = ctx.createGain(); master.gain.value = 0.8; master.connect(comp).connect(ctx.destination);
  ambBus = ctx.createGain(); ambBus.gain.value = st.amb ? 0.7 : 0; ambBus.connect(master);
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8; sfxBus.connect(master);
  const tickAmb = ambience();
  timer = setInterval(tickAmb, 40);
  if (st.music) playMusic();
}
export function toggle(which) {
  st[which] = !st[which];
  if (which === 'music') st.music ? playMusic() : yt?.pauseVideo?.();
  else if (ctx) ambBus.gain.setTargetAtTime(st.amb ? 0.7 : 0, ctx.currentTime, 0.2);
  return st[which];
}
document.addEventListener('visibilitychange', () => { if (ctx) document.hidden ? ctx.suspend() : ctx.resume(); });

// ---------- soundtrack: YouTube IFrame player in the field-radio panel ----------
const VIDEO = 'RYUZT-N8868';
let wantPlay = false;
function playMusic() { wantPlay = true; if (ytReady) { yt.setVolume(40); yt.playVideo(); } }
export function loadMusic() {
  window.onYouTubeIframeAPIReady = () => {
    yt = new YT.Player('yt', {
      host: 'https://www.youtube-nocookie.com', videoId: VIDEO, width: 192, height: 108,
      playerVars: {autoplay: 0, controls: 1, loop: 1, playlist: VIDEO, modestbranding: 1, rel: 0, playsinline: 1},
      events: {
        onReady: () => { ytReady = true; if (wantPlay && st.music) playMusic(); },
        onError: () => document.getElementById('radio')?.classList.add('off'),
      },
    });
  };
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  s.onerror = () => document.getElementById('radio')?.classList.add('off');
  document.head.append(s);
}
