// Campaign <-> battle handoff. The player is always nation 0 (Poland) on side 0.
import {loadSave, writeSave, applyBattleResult} from './save.js';
import {spawnSquad, hq} from './sim.js';

/** Strategic map: queue a battle and go to it. (Wired into the strategic map in M6.) */
export function engage(save, attackerId, defenderId, province, map = 'town-square') {
  const id = `b${save.turn}-${Date.now().toString(36)}`;
  save.pendingBattle = {id, attacker: attackerId, defender: defenderId, province, map, seed: (Math.random() * 2 ** 31) | 0};
  writeSave(save);
  return `../battle/index.html?b=${id}`;
}

/** Put the starting squads on the field: the first two infantry sections of each army in the save, or a default pair. */
export function deploy(world, save) {
  const pb = save?.pendingBattle, armies = pb ? [pb.attacker, pb.defender].map((id) => save.armies[id]) : [];
  const bySide = [0, 1].map((side) => armies.find((a) => a && (side === 0 ? a.nation === 0 : a.nation !== 0)));
  bySide.forEach((army, side) => {
    const h = hq(world, side), dir = side ? -1 : 1;
    const secs = army ? army.sections.map((id) => [id, save.sections[id]]).filter(([, s]) => s && world.data.units[s.type] && world.data.units[s.type].men).slice(0, 2) : [];
    if (secs.length) secs.forEach(([id, sec], i) => spawnSquad(world, side, sec.type, h.x + (i ? 8 : -8), h.z - 14 * dir, sec, id));
    else { spawnSquad(world, side, 'pioneer', h.x - 8, h.z - 14 * dir); spawnSquad(world, side, 'rifle', h.x + 8, h.z - 14 * dir); }
  });
}

/** End of battle: per-section results back into the save. Returns lines for the end screen. */
export function finish(world, save) {
  const winner = world.winner, lines = [];
  const all = [...world.squads, ...(world.fallen || [])];
  for (const s of all) if (s.side === 0) lines.push(`${world.data.units[s.type].name}: ${s.men.length ? `${s.men.length} of ${s.size} came back` : 'lost'}, ${s.kills} kills${s.xp ? `, ${Math.round(s.xp * 100)} XP` : ''}`);
  if (!save?.pendingBattle) return lines;
  const result = {id: save.pendingBattle.id, winner, duration: world.time, sections: {}}, bonus = (side) => (side === winner ? world.data.veterancy.xp.win : 0) + world.data.veterancy.xp.survive;
  for (const s of all) if (s.section) result.sections[s.section] = s.men.length
    ? {survivors: s.men.filter((m) => m.idx >= 0).map((m) => m.idx), reinforced: s.men.filter((m) => m.idx < 0).length, xp: s.xp + bonus(s.side), kills: s.kills, upgrades: s.upgrades}
    : {wiped: true};
  const {promoted} = applyBattleResult(save, result); writeSave(save);
  if (promoted.length) lines.push(`Promoted: ${promoted.join(', ')}`);
  return lines;
}

export {loadSave};
