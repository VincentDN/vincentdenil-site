// Targeting, hit chance (accuracy band x cover x moving x veterancy x suppression), damage, armour facing, suppression, deaths.
import {dist, byId, sees} from './sim.js';
import {award} from './veterancy.js';

const COVER = [1, 0.65, 0.4];
export const UPGRADE_WEAPON = {lmg: 'mg', auto: 'smg', pintle: 'mg'};

function weaponsOf(w, s) {
  const base = w.data.units[s.type].weapon, ws = s.men.map(() => base);
  for (const up of s.upgrades) if (UPGRADE_WEAPON[up] && ws.length) ws[s.vehicle ? 0 : Math.min(1, ws.length - 1)] = up === 'pintle' ? base : UPGRADE_WEAPON[up];
  if (s.upgrades.includes('pintle')) ws.push('mg'); // second gun on the hull
  return ws;
}

function pickTarget(w, s, range) {
  const forced = s.attack && byId(w, s.attack);
  if (forced && dist(s, forced) <= range && (forced.men ? forced.men.length : forced.hp > 0) && sees(w, s.side, forced.x, forced.z)) return forced;
  let best = null, bd = range;
  for (const o of w.squads) if (o.side !== s.side && o.men.length && sees(w, s.side, o.x, o.z)) { const d = dist(s, o); const camo = w.data.units[o.type].camo && !o.moving; if (d < bd && (!camo || d < range * 0.5)) { bd = d; best = o; } }
  if (!best && s.attack) return null;
  if (!best) for (const b of w.buildings) if (b.side !== s.side && dist(s, b) < range * 0.7 && sees(w, s.side, b.x, b.z)) return b;
  return best;
}

// Buildings with a weapon (the Command Post's MG) shoot the nearest enemy squad they can see.
function buildingFire(w, dt) {
  for (const b of w.buildings) {
    const wid = w.data.buildings[b.type].weapon; if (!wid || b.done < 1) continue;
    b.cool = (b.cool ?? 0) - dt; if (b.cool > 0) continue;
    const wpn = w.data.weapons[wid]; b.cool = 1 / wpn.rof;
    let t = null, bd = wpn.range;
    for (const o of w.squads) if (o.side !== b.side && o.men.length && sees(w, b.side, o.x, o.z)) { const d = dist(b, o); if (d < bd) { bd = d; t = o; } }
    if (!t) { b.cool = 0.5; continue; }
    const victim = t.men[Math.floor(w.rand() * t.men.length)], cell = w.grid.idx(victim.x, victim.z), band = bd < wpn.range / 3 ? 0 : bd < wpn.range * 2 / 3 ? 1 : 2;
    const hit = !t.vehicle && w.rand() < wpn.acc[band] * COVER[cell >= 0 ? w.grid.cover[cell] : 0];
    w.events.push({kind: 'shot', w: wid, from: {x: b.x, z: b.z}, to: victim, hit});
    if (!t.vehicle) t.supp = Math.min(1, t.supp + wpn.supp * 0.035 / t.vet.suppResist);
    if (hit) { victim.hp -= wpn.dmg; if (victim.hp <= 0) { t.men.splice(t.men.indexOf(victim), 1); w.events.push({kind: 'death', side: t.side, at: {x: victim.x, z: victim.z}}); if (!t.men.length) { w.squads.splice(w.squads.indexOf(t), 1); (w.fallen ||= []).push(t); w.events.push({kind: 'wiped', side: t.side, type: t.type}); } } }
  }
}

export function combatSystem(w, dt) {
  const rules = w.data.veterancy;
  buildingFire(w, dt);
  for (const s of w.squads) {
    if (!s.men.length || s.state === 'retreat') continue;
    const ws = weaponsOf(w, s), u = w.data.units[s.type];
    s.men.forEach((m, i) => {
      m.cool -= dt;
      if (m.cool > 0) return;
      const wid = ws[i] || ws[0], wpn = w.data.weapons[wid];
      if (u.setup && s.moving) { m.cool = 0.5; return; }
      const t = pickTarget(w, s, wpn.range);
      m.cool = (1 / wpn.rof) * (0.8 + w.rand() * 0.4);
      if (!t) { m.cool = 0.3; return; }
      if (wpn.arc && s.attack !== t.id) s.heading = Math.atan2(t.x - s.x, t.z - s.z);
      const d = dist(m, t), band = d < wpn.range / 3 ? 0 : d < wpn.range * 2 / 3 ? 1 : 2;
      if (t.kind === 'building') { // buildings: always hit, reduced damage from small arms
        t.hp -= wpn.dmg * (wpn.pen ? 1.5 : 0.25); w.events.push({kind: 'shot', w: wid, from: m, to: t, hit: true});
        if (t.hp <= 0) { w.buildings.splice(w.buildings.indexOf(t), 1); w.events.push({kind: 'destroyed', side: t.side, type: t.type}); if (t.type === 'command-post' && w.winner === null) w.winner = s.side; }
        return;
      }
      const victim = t.men[Math.floor(w.rand() * t.men.length)], cell = w.grid.idx(victim.x, victim.z);
      let p = wpn.acc[band] * s.vet.acc * (1 - s.supp * 0.5) * (s.moving ? 0.65 : 1) * (t.vehicle ? 1.2 : COVER[cell >= 0 ? w.grid.cover[cell] : 0]) * (t.moving && !t.vehicle ? 0.9 : 1);
      const hit = w.rand() < p;
      w.events.push({kind: 'shot', w: wid, from: m, to: victim, hit});
      if (!t.vehicle) t.supp = Math.min(1, t.supp + wpn.supp * 0.035 / t.vet.suppResist);
      if (!hit) return;
      let dmg = wpn.dmg * (t.state === 'retreat' ? 0.5 : 1);
      if (t.vehicle) { // armour by facing: front, side, rear
        const ang = Math.abs(((Math.atan2(s.x - t.x, s.z - t.z) - t.heading + Math.PI * 3) % (Math.PI * 2)) - Math.PI), arm = w.data.units[t.type].armour[ang < 0.8 ? 0 : ang < 2.3 ? 1 : 2] * (t.upgrades.includes('skirts') ? 1.2 : 1);
        dmg *= (wpn.pen || 0) >= arm ? 1 : (wpn.pen || 0) > arm * 0.6 ? 0.4 : 0.03;
      }
      victim.hp -= dmg;
      award(s, 'damage', dmg, rules);
      if (wpn.splash && !t.vehicle) for (const o of t.men) if (o !== victim && Math.hypot(o.x - victim.x, o.z - victim.z) < wpn.splash) o.hp -= dmg * 0.5;
      for (const o of [...t.men]) if (o.hp <= 0) { t.men.splice(t.men.indexOf(o), 1); s.kills++; award(s, 'kill', 1, rules); w.events.push({kind: 'death', side: t.side, at: {x: o.x, z: o.z}, vehicle: t.vehicle}); }
      if (!t.men.length) { w.squads.splice(w.squads.indexOf(t), 1); (w.fallen ||= []).push(t); w.events.push({kind: 'wiped', side: t.side, type: t.type}); }
    });
  }
}
