// Production queues, tier buildings on fixed slots around the Command Post, upgrades, reinforcement.
// Pioneer placement anywhere on the grid is still TODO (M4); for now tiers are ordered from the Command Post.
import {addBuilding, spawnSquad, hq, dist, findPath} from './sim.js';
import {popUsed} from './economy.js';

const afford = (res, cost) => Object.entries(cost).every(([k, v]) => res[k] >= v);
const pay = (res, cost) => { for (const [k, v] of Object.entries(cost)) res[k] -= v; };
export const has = (w, side, type) => w.buildings.some((b) => b.side === side && b.type === type && b.done >= 1);

/** Why an action is not allowed right now, or '' when it is. Used by the HUD to grey out buttons. */
export function canBuy(w, side, type) {
  const u = w.data.units[type];
  if (!has(w, side, u.from)) return `Needs ${w.data.buildings[u.from].name}`;
  if (popUsed(w, side) + u.pop > w.data.economy.pop) return 'Population cap';
  return afford(w.res[side], u.cost) ? '' : 'Not enough resources';
}
export function canConstruct(w, side, type) {
  const d = w.data.buildings[type];
  if (w.buildings.some((b) => b.side === side && b.type === type)) return 'Built';
  for (const n of d.needs || []) if (!has(w, side, n)) return `Needs ${w.data.buildings[n].name}`;
  return afford(w.res[side], d.cost) ? '' : 'Not enough resources';
}
export function canUpgrade(w, s, id) {
  const up = w.data.upgrades[id];
  if (!up.for.includes(s.type)) return 'Not for this unit';
  if (s.upgrades.includes(id)) return 'Fitted';
  if (up.slot && s.upgrades.some((u) => w.data.upgrades[u].slot === up.slot)) return 'Weapon slot taken';
  if (!has(w, s.side, up.at)) return `Needs ${w.data.buildings[up.at].name}`;
  return afford(w.res[s.side], up.cost) ? '' : 'Not enough resources';
}
export function canReinforce(w, s) {
  if (s.vehicle || s.men.length >= s.size) return 'Full strength';
  const h = hq(w, s.side), ht = w.squads.some((o) => o.side === s.side && o.type === 'halftrack' && dist(o, s) < 15);
  if (!(h && dist(h, s) < 35) && !ht) return 'Go to the Command Post or a halftrack';
  return w.res[s.side].m >= reinforceCost(w, s) ? '' : 'Not enough muster';
}
const reinforceCost = (w, s) => Math.round(w.data.units[s.type].cost.m / s.size * 0.4);

export const handlers = {
  buy(w, o) { if (canBuy(w, o.side, o.type)) return; const b = w.buildings.find((x) => x.side === o.side && x.type === w.data.units[o.type].from && x.done >= 1); pay(w.res[o.side], w.data.units[o.type].cost); b.queue.push({type: o.type, t: 0}); },
  construct(w, o) {
    if (canConstruct(w, o.side, o.type)) return; const h = hq(w, o.side); if (!h) return;
    const used = w.buildings.filter((b) => b.side === o.side).length - 1, slot = w.map.slots[used % w.map.slots.length], dir = o.side ? -1 : 1;
    pay(w.res[o.side], w.data.buildings[o.type].cost); addBuilding(w, o.side, o.type, h.x + slot[0], h.z + slot[1] * dir);
  },
  upgrade(w, o, squads) { for (const s of squads) if (!canUpgrade(w, s, o.id)) { pay(w.res[o.side], w.data.upgrades[o.id].cost); s.upgrades.push(o.id); if (o.id === 'extra-man') { s.size++; s.men.push({...s.men[0], idx: -1, hp: w.data.units[s.type].hp, cool: 1}); s.reinforced++; } } },
  reinforce(w, o, squads) { for (const s of squads) if (!canReinforce(w, s)) { w.res[o.side].m -= reinforceCost(w, s); const m0 = s.men[0]; s.men.push({idx: -1, x: m0.x, z: m0.z, hp: w.data.units[s.type].hp, cool: 1, level: 1}); s.reinforced++; } },
  rally(w, o) { (w.rally ||= [])[o.side] = {x: o.x, z: o.z}; },
};

export function buildSystem(w, dt) {
  for (const b of w.buildings) {
    const d = w.data.buildings[b.type];
    if (b.done < 1) { b.done = Math.min(1, b.done + dt / (d.build || 1)); b.hp = Math.min(b.maxhp, b.hp + b.maxhp * 0.7 * dt / (d.build || 1)); if (b.done >= 1) w.events.push({kind: 'built', side: b.side, type: b.type}); continue; }
    const it = b.queue[0]; if (!it) continue;
    it.t += dt;
    if (it.t >= w.data.units[it.type].build) {
      b.queue.shift();
      const dir = b.side ? -1 : 1, s = spawnSquad(w, b.side, it.type, b.x, b.z - 10 * dir);
      const r = w.rally?.[b.side]; s.path = findPath(w.grid, s, r || {x: b.x + (w.rand() - 0.5) * 20, z: b.z - 22 * dir}); s.state = s.path.length ? 'move' : 'idle';
      w.events.push({kind: 'ready', side: b.side, type: it.type, id: s.id});
    }
  }
}
