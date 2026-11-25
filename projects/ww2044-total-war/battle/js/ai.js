// Rule-based opponent, re-evaluated every 2 s: keep a production queue, tech when it can, take unlinked points, retreat hurt squads.
import {order, hq, dist} from './sim.js';
import {canBuy, canConstruct, canUpgrade, canReinforce, has} from './build.js';

export function makeAi(side) {
  return function aiSystem(w) {
    if (w.tick % 20 !== 7 || w.winner !== null) return;
    const mine = w.squads.filter((s) => s.side === side), queued = w.buildings.filter((b) => b.side === side).reduce((a, b) => a + b.queue.length, 0);
    // build order
    for (const t of ['rifle-depot', 'motor-pool', 'signal-mast', 'armour-shed']) if (!canConstruct(w, side, t)) { order(w, side, {kind: 'construct', type: t}); break; }
    const pioneers = mine.filter((s) => s.type === 'pioneer').length;
    if (queued < 2 && (has(w, side, 'rifle-depot') || pioneers < 1)) {
      const want = pioneers < 1 ? ['pioneer'] : w.time > 420 && has(w, side, 'armour-shed') ? ['tank', 'rifle'] : has(w, side, 'motor-pool') ? ['halftrack', 'mg', 'rifle', 'recon'] : ['rifle', 'mg', 'rifle', 'recon'];
      for (const t of want) if (!canBuy(w, side, t)) { order(w, side, {kind: 'buy', type: t}); break; }
    }
    for (const s of mine) for (const u of ['lmg', 'grenades', 'skirts']) if (!canUpgrade(w, s, u) && w.res[side].o > 70) order(w, side, {kind: 'upgrade', ids: [s.id], id: u});
    // squads
    const h = hq(w, side), taken = new Set();
    for (const s of mine) {
      if (s.state === 'retreat') { if (!s.path.length) s.state = 'idle'; continue; }
      if (!s.vehicle && s.men.length <= Math.max(1, s.size * 0.34)) { order(w, side, {kind: 'retreat', ids: [s.id]}); continue; }
      if (s.men.length < s.size && !canReinforce(w, s)) { order(w, side, {kind: 'reinforce', ids: [s.id]}); continue; }
      if (s.state !== 'idle') continue;
      const enemy = w.squads.filter((o) => o.side !== side).sort((a, b) => dist(a, s) - dist(b, s))[0];
      if (s.vehicle && enemy && dist(enemy, s) < 70) { order(w, side, {kind: 'attack', ids: [s.id], target: enemy.id}); continue; }
      const goal = w.points.filter((p) => p.owner !== side && !taken.has(p.id)).sort((a, b) => dist(a, s) - dist(b, s) + (a.owner === null ? -30 : 0) - (b.owner === null ? -30 : 0))[0];
      if (goal && !s.vehicle) { taken.add(goal.id); order(w, side, {kind: 'move', ids: [s.id], x: goal.x + (w.rand() - 0.5) * 6, z: goal.z + (w.rand() - 0.5) * 6}); }
      else if (enemy) order(w, side, {kind: 'attack', ids: [s.id], target: enemy.id});
      else if (h) { const e = hq(w, 1 - side); if (e) order(w, side, {kind: 'attack', ids: [s.id], target: e.id}); }
    }
  };
}
export const aiSystem = makeAi(1);
