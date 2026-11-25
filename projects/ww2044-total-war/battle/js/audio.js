// Battle sound: CC0 gunfire, explosions and countryside ambience from Escape From Claudov (../sfx/credits.json).
// Web Audio, started on the first click or key (browser autoplay rules). Volume falls off with distance from the
// camera's focus and pans left/right by screen position. M mutes; the choice is remembered in this browser.
const FILES = {
  rifle: ['g_rifle_near-1', 'g_rifle_near-2', 'g_battle_near-1'], marksman: ['g_dmr_near-1'], smg: ['g_smg_near-1', 'g_smg_near-2'],
  mg: ['g_far_smg-1', 'g_far_smg-2'], hmg: ['g_far_smg-1', 'g_far_smg-2'], far: ['g_far_rifle-1', 'g_far_rifle-2'],
  'tank-gun': ['x_near-1', 'x_near-2'], boom: ['x_far-1', 'x_far-2'], debris: ['x_debris-1'], ric: ['i_ric-1', 'i_ric-2'], whiz: ['i_whiz-1', 'i_whiz-2'],
  bird: ['a_bird-1'], crow: ['a_crow-1'], gust: ['a_gust-1'],
};
const KEY = 'ww2044.battle.muted';

export function createAudio(view) {
  const base = new URL('../sfx/', import.meta.url).href, buffers = {}, recent = {};
  let ctx = null, master = null, bed = null, muted = false;
  try { muted = localStorage.getItem(KEY) === '1'; } catch {}
  const load = (name) => buffers[name] || (buffers[name] = fetch(base + name + '.mp3').then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)).catch(() => null));

  async function start() {
    if (ctx) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : 0.8; master.connect(ctx.destination);
    const b = await load('amb_bed'); if (!b) return;
    bed = ctx.createBufferSource(); bed.buffer = b; bed.loop = true; const g = ctx.createGain(); g.gain.value = 0.35; bed.connect(g).connect(master); bed.start();
    setInterval(() => { if (!muted && Math.random() < 0.5) play(['bird', 'crow', 'gust'][Math.floor(Math.random() * 3)], null, 0.25); }, 9000);
  }
  for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, start, {once: true});

  /** Play a sound kind at a world point (or flat when at is null). */
  async function play(kind, at, vol = 1) {
    if (!ctx || muted) return;
    let gain = vol, pan = 0;
    if (at) {
      const c = view.cam, d = Math.hypot(at.x - c.x, at.z - c.z);
      if (d > 200) return;
      gain *= Math.max(0.05, 1 - d / 200) * (60 / Math.max(40, c.d));
      const q = view.project(at.x, 1, at.z); if (q) pan = Math.max(-1, Math.min(1, (q.x / innerWidth) * 2 - 1)) * 0.8;
      if (d > 90 && (kind === 'rifle' || kind === 'smg' || kind === 'marksman')) kind = 'far';
    }
    const now = ctx.currentTime; if ((recent[kind] || 0) > now - (kind === 'mg' || kind === 'hmg' ? 0.09 : 0.05)) return; recent[kind] = now;
    const list = FILES[kind]; if (!list) return;
    const buf = await load(list[Math.floor(Math.random() * list.length)]); if (!buf) return;
    const src = ctx.createBufferSource(), g = ctx.createGain(), p = ctx.createStereoPanner();
    src.buffer = buf; src.playbackRate.value = 0.93 + Math.random() * 0.14; g.gain.value = Math.min(1.2, gain); p.pan.value = pan;
    src.connect(g).connect(p).connect(master); src.start();
  }

  function onEvents(events, sees) {
    for (const e of events) {
      if (e.kind === 'shot') { if (sees(e.from) || sees(e.to)) { play(e.w, e.from, e.w === 'tank-gun' ? 1 : 0.55); if (!e.hit && Math.random() < 0.08) play('ric', e.to, 0.4); } }
      else if (e.kind === 'death' && e.vehicle) play('boom', e.at, 1);
      else if (e.kind === 'destroyed') play('debris', null, 0.8);
    }
  }
  function toggle() { muted = !muted; try { localStorage.setItem(KEY, muted ? '1' : '0'); } catch {} if (master) master.gain.value = muted ? 0 : 0.8; return muted; }
  return {onEvents, toggle, get muted() { return muted; }};
}
