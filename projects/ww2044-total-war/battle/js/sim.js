// Deterministic fixed-step battle world, 10 ticks per second. No three.js or DOM here, so it runs headless in Node.
// Player and AI act only through order(), applied at the start of the next tick.
import {sectionStars, bonuses} from './veterancy.js';

export const TICK = 0.1;
export function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }

const FORM = [[0, 0], [-2.4, 1.8], [2.4, 1.8], [-1.3, -2], [1.5, -2.1], [0, 3.4]];
export const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

// ---------- grid: blocked cells and cover (0 none, 1 light, 2 heavy) ----------
function buildGrid(map) {
  const cell = map.cell, n = Math.round(map.size[0] / cell), half = map.size[0] / 2;
  const block = new Uint8Array(n * n), cover = new Uint8Array(n * n);
  const g = {cell, n, half, block, cover,
    idx: (x, z) => { const i = Math.floor((x + half) / cell), j = Math.floor((z + half) / cell); return i < 0 || j < 0 || i >= n || j >= n ? -1 : j * n + i; },
    centre: (k) => ({x: (k % n + 0.5) * cell - half, z: (Math.floor(k / n) + 0.5) * cell - half})};
  const rect = (b, fn, pad = 0) => {
    for (let z = b.at[1] - b.size[1] / 2 - pad; z <= b.at[1] + b.size[1] / 2 + pad; z += cell / 2)
      for (let x = b.at[0] - b.size[0] / 2 - pad; x <= b.at[0] + b.size[0] / 2 + pad; x += cell / 2) { const k = g.idx(x, z); if (k >= 0) fn(k); }
  };
  g.stamp = (b) => {
    if (b.kind === 'ruin' || b.kind === 'house' || b.kind === 'building') { rect(b, (k) => { cover[k] = Math.max(cover[k], 2); }, cell); rect(b, (k) => { block[k] = 1; }); }
    else if (b.kind === 'sandbags') rect(b, (k) => { cover[k] = 2; }, cell * 0.75);
    else if (b.kind === 'hedge') rect(b, (k) => { cover[k] = Math.max(cover[k], 1); }, cell * 0.75);
  };
  for (const b of map.blocks) g.stamp(b);
  return g;
}
export function expandBlocks(map) {
  const out = [];
  for (const b of map.blocks) { out.push(b); if (b.mirror) out.push({...b, at: [-b.at[0], -b.at[1]], mirror: false}); }
  return {...map, blocks: out};
}

// ---------- A* on the grid (8 directions), then string-pulled ----------
function clear(g, a, b) {
  const d = Math.hypot(b.x - a.x, b.z - a.z), steps = Math.ceil(d / (g.cell / 3));
  for (let i = 1; i < steps; i++) { const k = g.idx(a.x + (b.x - a.x) * i / steps, a.z + (b.z - a.z) * i / steps); if (k < 0 || g.block[k]) return false; }
  return true;
}
export function findPath(g, from, to) {
  if (clear(g, from, to)) return [{x: to.x, z: to.z}];
  const n = g.n, s = g.idx(from.x, from.z); let t = g.idx(to.x, to.z);
  if (s < 0 || t < 0) return [];
  if (g.block[t]) { // nearest open cell to the target
    let best = -1, bd = 1e9; for (let k = 0; k < n * n; k++) if (!g.block[k]) { const c = g.centre(k), d = Math.hypot(c.x - to.x, c.z - to.z); if (d < bd) { bd = d; best = k; } }
    t = best; to = g.centre(t);
  }
  const gs = new Float32Array(n * n).fill(1e9), came = new Int32Array(n * n).fill(-1), closed = new Uint8Array(n * n), open = [s];
  const h = (k) => Math.hypot(k % n - t % n, Math.floor(k / n) - Math.floor(t / n));
  gs[s] = 0; const f = new Float32Array(n * n).fill(1e9); f[s] = h(s);
  while (open.length) {
    let bi = 0; for (let i = 1; i < open.length; i++) if (f[open[i]] < f[open[bi]]) bi = i;
    const k = open[bi]; open[bi] = open[open.length - 1]; open.pop();
    if (k === t) break; if (closed[k]) continue; closed[k] = 1;
    const x = k % n, z = Math.floor(k / n);
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dz) continue; const nx = x + dx, nz = z + dz; if (nx < 0 || nz < 0 || nx >= n || nz >= n) continue;
      const m = nz * n + nx; if (g.block[m] || closed[m]) continue;
      if (dx && dz && (g.block[z * n + nx] || g.block[nz * n + x])) continue; // no corner cutting
      const ng = gs[k] + (dx && dz ? 1.414 : 1);
      if (ng < gs[m]) { gs[m] = ng; f[m] = ng + h(m); came[m] = k; open.push(m); }
    }
  }
  if (came[t] < 0 && t !== s) return [];
  const raw = []; for (let k = t; k !== s && k >= 0; k = came[k]) raw.push(g.centre(k)); raw.reverse(); raw[raw.length - 1] = {x: to.x, z: to.z};
  const out = []; let cur = from, i = 0; // string pulling
  while (i < raw.length) { let j = raw.length - 1; while (j > i && !clear(g, cur, raw[j])) j--; out.push(raw[j]); cur = raw[j]; i = j + 1; }
  return out;
}

// ---------- world ----------
export function createWorld({map, data, seed = 1}) {
  map = expandBlocks(map);
  const eco = data.economy, w = {time: 0, tick: 0, rand: rng(seed), map, data, grid: null, nextId: 1,
    squads: [], buildings: [], points: map.points.map((p) => ({...p, x: p.at[0], z: p.at[1], cap: 0, owner: null, linked: [false, false]})),
    res: [0, 1].map(() => ({...(eco.start || {m: 300, o: 30, f: 10})})), income: [{m: 0, o: 0, f: 0}, {m: 0, o: 0, f: 0}],
    pool: [eco.victoryPool, eco.victoryPool], winner: null, events: [], orders: []};
  w.grid = buildGrid(map);
  map.spawns.forEach((s, side) => addBuilding(w, side, 'command-post', s.at[0], s.at[1], 1));
  return w;
}

export function addBuilding(w, side, type, x, z, done = 0) {
  const d = w.data.buildings[type], b = {id: w.nextId++, kind: 'building', side, type, x, z, hp: d.hp * (done ? 1 : 0.3), maxhp: d.hp, done, queue: []};
  w.buildings.push(b);
  w.grid.stamp({kind: 'building', at: [x, z], size: d.size.map((s) => s * 2)});
  return b;
}

/** Make a squad. `section` (optional) is a campaign section; its men keep their index for the write-back. */
export function spawnSquad(w, side, type, x, z, section = null, sectionId = null) {
  const u = w.data.units[type], vehicle = !u.men;
  const roster = section ? section.men : Array.from({length: vehicle ? 1 : u.men}, (_, i) => ({name: `${u.name} ${i + 1}`, level: 1, xp: 0}));
  const stars = section ? sectionStars(section) : 0;
  const men = roster.map((m, i) => ({idx: i, x: x + (FORM[i % 6][0]), z: z + (FORM[i % 6][1]), hp: u.hp, cool: w.rand() * 2, level: m.level || 1}));
  const s = {id: w.nextId++, kind: 'squad', side, type, vehicle, men, size: vehicle ? 1 : u.men, x, z, heading: side ? 0 : Math.PI, path: [], attack: null,
    state: 'idle', supp: 0, xp: 0, kills: 0, stars, vet: bonuses(stars, w.data.veterancy), upgrades: [...(section?.upgrades || [])], section: sectionId, reinforced: 0};
  w.squads.push(s);
  return s;
}

export const order = (w, side, cmd) => w.orders.push({...cmd, side});
export const byId = (w, id) => w.squads.find((s) => s.id === id) || w.buildings.find((b) => b.id === id);
export const hq = (w, side) => w.buildings.find((b) => b.side === side && b.type === 'command-post');

function moveTo(w, s, x, z) { s.path = findPath(w.grid, s, {x, z}); s.state = s.path.length ? 'move' : 'idle'; }

function applyOrders(w, handlers) {
  for (const o of w.orders.splice(0)) {
    const ids = o.ids || [], squads = ids.map((id) => w.squads.find((s) => s.id === id && s.side === o.side)).filter(Boolean);
    if (o.kind === 'move') squads.forEach((s, i) => { if (s.state === 'retreat') return; const ang = (i / Math.max(1, squads.length)) * Math.PI * 2, r = squads.length > 1 ? 6 : 0; s.attack = null; moveTo(w, s, o.x + Math.cos(ang) * r, o.z + Math.sin(ang) * r); });
    else if (o.kind === 'attack') squads.forEach((s) => { if (s.state !== 'retreat') { s.attack = o.target; s.path = []; s.state = 'attack'; } });
    else if (o.kind === 'stop') squads.forEach((s) => { if (s.state !== 'retreat') { s.attack = null; s.path = []; s.state = 'idle'; } });
    else if (o.kind === 'retreat') squads.forEach((s) => { const h = hq(w, s.side); if (!h) return; s.attack = null; moveTo(w, s, h.x + (w.rand() - 0.5) * 14, h.z + (s.side ? 12 : -12)); s.state = 'retreat'; });
    else handlers[o.kind]?.(w, o, squads);
  }
}

function movement(w, dt) {
  for (const s of w.squads) {
    if (s.state === 'attack') { // close to weapon range of the target
      const t = byId(w, s.attack);
      if (!t || (t.men && !t.men.length) || t.hp <= 0) { s.attack = null; s.state = 'idle'; s.path = []; }
      else {
        const range = w.data.weapons[w.data.units[s.type].weapon].range * 0.9;
        if (dist(s, t) > range) { if (!s.path.length || w.tick % 10 === 0) s.path = findPath(w.grid, s, t); }
        else s.path = [];
      }
    }
    const u = w.data.units[s.type];
    let speed = u.speed * s.vet.speed * (s.supp > 0.9 ? 0.3 : s.supp > 0.5 ? 0.6 : 1) * (s.state === 'retreat' ? 1.5 : 1);
    if (u.setup && s.state === 'attack') speed *= 0.7;
    const wp = s.path[0];
    if (wp) {
      const dx = wp.x - s.x, dz = wp.z - s.z, d = Math.hypot(dx, dz), step = speed * dt;
      if (d <= step) { s.x = wp.x; s.z = wp.z; s.path.shift(); } else { s.x += dx / d * step; s.z += dz / d * step; }
      if (d > 0.01) s.heading = Math.atan2(dx, dz);
      if (!s.path.length && s.state !== 'attack') s.state = 'idle';
    }
    s.moving = !!wp;
    const c = Math.cos(s.heading), sn = Math.sin(s.heading);
    s.men.forEach((m, i) => {
      const [fx, fz] = s.vehicle ? [0, 0] : FORM[i % 6], tx = s.x + fx * c + fz * sn, tz = s.z - fx * sn + fz * c;
      const dx = tx - m.x, dz = tz - m.z, d = Math.hypot(dx, dz), step = speed * 1.25 * dt;
      if (d > 0.05) { const k = Math.min(1, step / d); m.x += dx * k; m.z += dz * k; m.face = Math.atan2(dx, dz); }
    });
    s.supp = Math.max(0, s.supp - dt * 0.12);
  }
}

/** Advance one tick: orders, movement, then each system (economy, combat, build, AI). */
export function step(w, systems, handlers = {}) {
  w.events.length = 0;
  applyOrders(w, handlers);
  movement(w, TICK);
  for (const sys of systems) sys(w, TICK);
  w.tick++; w.time += TICK;
}
