// Points: decap then cap by infantry in the circle, cut-off through the map's link graph, income, victory pools.
import {dist} from './sim.js';
import {award} from './veterancy.js';

function linkAll(w) {
  for (const side of [0, 1]) {
    const seen = new Set([`hq${side}`]), queue = [`hq${side}`], owned = new Map(w.points.filter((p) => p.owner === side).map((p) => [p.id, p]));
    while (queue.length) {
      const cur = queue.shift();
      for (const [a, b] of w.map.links) { const nb = a === cur ? b : b === cur ? a : null; if (nb && owned.has(nb) && !seen.has(nb)) { seen.add(nb); queue.push(nb); } }
    }
    for (const p of w.points) p.linked[side] = p.owner === side && seen.has(p.id);
  }
}

export function economySystem(w, dt) {
  const r = w.map.captureRadius, rate = dt / w.map.captureTime, eco = w.data.economy;
  for (const p of w.points) {
    const near = [0, 1].map((side) => w.squads.filter((s) => s.side === side && !s.vehicle && s.state !== 'retreat' && dist(s, p) < r));
    p.contested = near[0].length && near[1].length;
    const side = near[0].length && !near[1].length ? 0 : near[1].length && !near[0].length ? 1 : -1;
    if (side < 0) continue;
    const dir = side === 0 ? 1 : -1, before = p.owner, k = 1 + 0.25 * (near[side].length - 1);
    if (p.owner === side) continue;
    p.cap = Math.max(-1, Math.min(1, p.cap + dir * rate * k));
    if (p.owner !== null && Math.sign(p.cap) !== (p.owner === 0 ? 1 : -1)) { p.owner = null; w.events.push({kind: 'lost', side: 1 - side, point: p.id}); }
    if (Math.abs(p.cap) >= 1) p.owner = side;
    if (p.owner !== before && p.owner === side) { w.events.push({kind: 'captured', side, point: p.id}); near[side].forEach((s) => award(s, 'capture', 1, w.data.veterancy)); }
  }
  if (w.tick % 5 === 0) linkAll(w);
  for (const side of [0, 1]) {
    const inc = {...eco.trickle}, mast = w.buildings.some((b) => b.side === side && b.type === 'signal-mast' && b.done >= 1) ? 1 + (w.data.buildings['signal-mast'].income || 0) : 1;
    for (const p of w.points) if (p.linked[side]) for (const [k, v] of Object.entries(eco[p.kind] || {})) inc[k] = (inc[k] || 0) + v * mast;
    w.income[side] = inc;
    for (const k of ['m', 'o', 'f']) w.res[side][k] += (inc[k] || 0) * dt;
  }
  const held = [0, 1].map((side) => w.points.filter((p) => p.owner === side).length);
  if (held[0] !== held[1]) { const loser = held[0] < held[1] ? 0 : 1; w.pool[loser] = Math.max(0, w.pool[loser] - eco.drainPerPoint * Math.abs(held[0] - held[1]) * dt); if (!w.pool[loser] && w.winner === null) w.winner = 1 - loser; }
}

/** Population in use. */
export const popUsed = (w, side) => w.squads.filter((s) => s.side === side).reduce((a, s) => a + w.data.units[s.type].pop, 0)
  + w.buildings.filter((b) => b.side === side).reduce((a, b) => a + b.queue.reduce((q, it) => q + w.data.units[it.type].pop, 0), 0);
