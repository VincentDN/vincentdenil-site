// Sound, all synthesised live (no recordings): an original industrial march in the spirit of late-1990s RTS scores
// (drum machine, distorted power-chord riff, synth stabs, a low pad), a sea-and-wind ambience bed with gulls and a
// distant horn, and small interface sounds. Web Audio only.
let ctx, master, musicBus, ambBus, sfxBus, noiseBuf, timer;
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
function shaper(k) { const n = 2048, c = new Float32Array(n); for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; c[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); } const w = ctx.createWaveShaper(); w.curve = c; w.oversample = '2x'; return w; }

// ---------- drums ----------
function kick(t) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18); env(g, t, 0.002, 1.1, 0.35); o.connect(g).connect(musicBus); o.start(t); o.stop(t + 0.4); }
function snare(t, v = 1) {
  const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.7;
  env(g, t, 0.001, 0.55 * v, 0.2); n.connect(f).connect(g).connect(musicBus); n.start(t, Math.random()); n.stop(t + 0.25);
  const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(210, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.08);
  env(og, t, 0.001, 0.35 * v, 0.1); o.connect(og).connect(musicBus); o.start(t); o.stop(t + 0.15);
}
function hat(t, open) { const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'highpass'; f.frequency.value = 7500; env(g, t, 0.001, open ? 0.16 : 0.09, open ? 0.22 : 0.04); n.connect(f).connect(g).connect(musicBus); n.start(t, Math.random()); n.stop(t + 0.3); }
function anvil(t) { // metallic industrial hit
  const c = ctx.createOscillator(), m = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
  c.frequency.value = 520; m.frequency.value = 520 * 3.47; mg.gain.value = 900; m.connect(mg).connect(c.frequency);
  env(g, t, 0.001, 0.18, 0.5); c.connect(g).connect(musicBus); c.start(t); m.start(t); c.stop(t + 0.6); m.stop(t + 0.6);
}
// ---------- riff, stabs, pad ----------
let guitar;
function chug(t, semi, len, mute) {
  const f = 41.2 * 2 ** (semi / 12), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = mute ? 900 : 2600;
  for (const [m, d] of [[1, -6], [1.5, 5], [2, 3]]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * m * 2; o.detune.value = d; o.connect(lp); o.start(t); o.stop(t + len + 0.05); }
  env(g, t, 0.004, 0.5, len, 0.0001); lp.connect(g).connect(guitar);
}
function stab(t, semi, len) {
  const g = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 6;
  lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(500, t + len);
  for (const d of [-9, 9]) { const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 329.6 * 2 ** (semi / 12); o.detune.value = d; o.connect(lp); o.start(t); o.stop(t + len + 0.05); }
  env(g, t, 0.005, 0.14, len); lp.connect(g).connect(musicBus);
}
function pad(t, semi, len) {
  const g = ctx.createGain(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
  for (const m of [1, 1.5, 2.01]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 82.4 * m * 2 ** (semi / 12); o.connect(lp); o.start(t); o.stop(t + len + 0.1); }
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.07, t + len * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + len); lp.connect(g).connect(musicBus);
}

// 16-step bars. Riff steps: [semitone above low E, length in steps, palm-muted]
const RIFF_A = [[0, 1, 1], null, [0, 1, 1], [0, 1, 1], null, [0, 1, 1], [3, 2, 0], null, [0, 1, 1], null, [0, 1, 1], [1, 1, 0], null, [0, 1, 1], [-2, 2, 0], null];
const RIFF_B = [[0, 1, 1], null, [0, 1, 1], [0, 1, 1], null, [5, 2, 0], null, [3, 2, 0], null, [0, 1, 1], [0, 1, 1], [6, 1, 0], [5, 1, 0], null, [3, 2, 0], null];
const STABS = [[12, 0], [15, 6], [13, 10], [10, 14]];
const BPM = 128, SIX = 60 / BPM / 4;
let step = 0, nextT = 0;
function schedule() {
  while (nextT < ctx.currentTime + 0.15) {
    const s = step % 16, bar = Math.floor(step / 16) % 16, t = nextT;
    const section = bar < 2 ? 'intro' : bar < 10 ? 'main' : bar < 12 ? 'break' : 'drive';
    if (section === 'intro' || section === 'break') { if (s === 0) pad(t, bar % 2 ? -2 : 0, SIX * 16); if (s % 4 === 0) hat(t, false); if (section === 'break' && s === 8) anvil(t); }
    else {
      if (s === 0 || s === 8 || s === 10 || (section === 'drive' && s === 14)) kick(t);
      if (s === 4 || s === 12) snare(t);
      if (section === 'drive' && s === 15) snare(t, 0.5);
      hat(t, s % 4 === 2);
      if (s === 6 && bar % 2) anvil(t);
      const riff = bar % 4 === 3 ? RIFF_B : RIFF_A, n = riff[s];
      if (n) chug(t, n[0], n[1] * SIX * 0.92, n[2]);
      if (section === 'drive' || bar % 4 >= 2) for (const [semi, at] of STABS) if (at === s) stab(t, semi + (bar % 2 ? -2 : 0), SIX * 3);
    }
    step++;
    nextT += SIX;
  }
}

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
  musicBus = ctx.createGain(); musicBus.gain.value = st.music ? 0.32 : 0; musicBus.connect(master);
  ambBus = ctx.createGain(); ambBus.gain.value = st.amb ? 0.7 : 0; ambBus.connect(master);
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8; sfxBus.connect(master);
  // the guitar: distortion, a cabinet-like band, a little room
  guitar = ctx.createGain(); const ws = shaper(80), cab = ctx.createBiquadFilter(), hp = ctx.createBiquadFilter(), gg = ctx.createGain();
  cab.type = 'peaking'; cab.frequency.value = 1400; cab.gain.value = 5; hp.type = 'highpass'; hp.frequency.value = 70; gg.gain.value = 0.16;
  guitar.connect(ws).connect(hp).connect(cab).connect(gg).connect(musicBus);
  const tickAmb = ambience();
  nextT = ctx.currentTime + 0.3;
  timer = setInterval(() => { schedule(); tickAmb(); }, 40);
}
export function toggle(which) {
  st[which] = !st[which];
  if (ctx) (which === 'music' ? musicBus : ambBus).gain.setTargetAtTime(st[which] ? (which === 'music' ? 0.32 : 0.7) : 0, ctx.currentTime, 0.2);
  return st[which];
}
document.addEventListener('visibilitychange', () => { if (ctx) document.hidden ? ctx.suspend() : ctx.resume(); });
