// Campaign save shared by strategic map, barracks and battle. Shape: ../data/campaign-save.schema.json.
// Implemented now (small, and every later milestone depends on it).
import {sectionStars, splitXp} from './veterancy.js';

export const KEY = 'ww2044.campaign.v1';
export const VERSION = 1;
export const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Read the save, or null. Never throws (private windows, blocked storage). */
export function loadSave() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); return s ? migrate(s) : null; } catch { return null; }
}
export function writeSave(save) {
  try { localStorage.setItem(KEY, JSON.stringify(save)); return true; } catch { return false; }
}

/** Bring older saves up to VERSION. Add a case per bump; never drop fields silently. */
export function migrate(save) {
  if (save.version === VERSION) return save;
  throw new Error(`Unknown save version ${save.version}`);
}

/**
 * Seed a new campaign from the hard-coded scenario arrays.
 * @param {Array} units   strategic-map UNITS ({name, kind, nation, at, str, mor, vet})
 * @param {Function} rosterFor (army) => [{type, name, men:[{name, level, xp, kit}]}]; placeholder rosters until M6
 */
export function newCampaign(units, roster = rosterFor, scenario = 'poland1936') {
  const save = {version: VERSION, scenario, turn: 0, wallet: {bonds: 4250, merit: 380}, armies: {}, sections: {}, provinces: {}, pendingBattle: null, history: []};
  for (const u of units) {
    const id = slug(u.name), ids = [];
    roster(u).forEach((sec, i) => {
      const sid = `${id}-${sec.type}-${i + 1}`;
      save.sections[sid] = {upgrades: [], kills: 0, battles: 0, ...sec, army: id};
      ids.push(sid);
    });
    save.armies[id] = {name: u.name, kind: u.kind, nation: u.nation, at: u.at, pos: u.x !== undefined ? [u.x, u.z] : undefined, str: u.str, mor: u.mor, vet: u.vet, sections: ids};
  }
  return save;
}

/** Queue a battle in the save; returns the battle page URL relative to a sibling folder (../battle/...). */
export function engage(save, attackerId, defenderId, province, map = 'town-square') {
  const id = `b${save.turn}-${Date.now().toString(36)}`;
  save.pendingBattle = {id, attacker: attackerId, defender: defenderId, province, map, seed: (Math.random() * 2 ** 31) | 0};
  writeSave(save);
  return `../battle/index.html?b=${id}`;
}

const SURNAMES = ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Mazur', 'Krawczyk', 'Piotrowski', 'Grabowski', 'Pawlak', 'Michalski', 'Król', 'Wieczorek', 'Jabłoński'];
const KRAUT = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Neumann', 'Schwarz', 'Braun', 'Zimmermann', 'Krüger', 'Hartmann', 'Lange'];
const RUS = ['Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Vasiliev', 'Petrov', 'Sokolov', 'Mikhailov', 'Novikov', 'Fedorov', 'Morozov', 'Volkov', 'Alekseev', 'Lebedev', 'Semenov', 'Egorov', 'Pavlov', 'Kozlov', 'Stepanov', 'Nikolaev'];
/** Placeholder rosters until armies have real ones: four infantry sections, men levelled from the army's veterancy. */
export function rosterFor(army) {
  const names = [SURNAMES, KRAUT, RUS][army.nation] || SURNAMES, base = [1, 3, 5, 8][army.vet || 0];
  let k = army.name.length * 7;
  const men = (n, kit) => Array.from({length: n}, (_, i) => ({name: `${['Pte.', 'Cpl.', 'Sgt.'][i === 0 ? 2 : i === 1 ? 1 : 0]} ${names[(k += 3) % names.length]}`, level: Math.min(10, base + (i === 0 ? 1 : 0) + ((k >> 2) % 2)), xp: ((k * 37) % 100) / 100, kit}));
  return [{type: 'rifle', men: men(4, 'assault')}, {type: 'pioneer', men: men(3, 'nomad')}, {type: 'rifle', men: men(4, 'smg')}, {type: 'recon', men: men(3, 'sniper')}];
}

/** Strength-weighted mean of section stars, 0 to 3. */
export function armyVet(save, armyId) {
  const secs = save.armies[armyId].sections.map((s) => save.sections[s]).filter(Boolean);
  const w = secs.reduce((a, s) => a + s.men.length, 0);
  return w ? Math.round(secs.reduce((a, s) => a + sectionStars(s) * s.men.length, 0) / w) : 0;
}

const menOf = (save, armyId) => save.armies[armyId].sections.reduce((a, s) => a + (save.sections[s]?.men.length || 0), 0);

/**
 * Write a finished battle back into the campaign (see schema $defs.battleResult).
 * Survivors keep and gain XP, the dead are removed, reinforcements join at level 1,
 * wiped sections leave the army. Army str scales with men lost, mor moves with the result, vet is recomputed.
 * @returns {{promoted:string[], byArmy:Object<string,string[]>}}
 */
export function applyBattleResult(save, result) {
  const pb = save.pendingBattle, promoted = [], byArmy = {};
  const armies = pb ? [pb.attacker, pb.defender] : [...new Set(Object.keys(result.sections).map((s) => save.sections[s]?.army).filter(Boolean))];
  const before = Object.fromEntries(armies.map((a) => [a, menOf(save, a)]));
  for (const [sid, r] of Object.entries(result.sections)) {
    const sec = save.sections[sid]; if (!sec) continue;
    if (r.wiped) { const a = save.armies[sec.army]; a.sections = a.sections.filter((s) => s !== sid); delete save.sections[sid]; continue; }
    sec.men = (r.survivors ?? sec.men.map((_, i) => i)).map((i) => sec.men[i]).filter(Boolean);
    for (let i = 0; i < (r.reinforced || 0); i++) sec.men.push({name: `Pte. Recruit ${sec.men.length + 1}`, level: 1, xp: 0, kit: sec.men[0]?.kit});
    const up = splitXp(sec.men, r.xp || 0); promoted.push(...up); (byArmy[sec.army] ||= []).push(...up);
    sec.kills += r.kills || 0; sec.battles++;
    if (r.hp !== undefined) sec.hp = r.hp;
    if (r.upgrades) sec.upgrades = [...new Set([...sec.upgrades, ...r.upgrades])];
  }
  for (const id of armies) {
    const a = save.armies[id]; if (!a) continue;
    a.str = Math.round(a.str * (before[id] ? menOf(save, id) / before[id] : 1));
    a.mor = Math.max(0, Math.min(100, a.mor + (a.nation === result.winner ? 5 : -10)));
    a.vet = armyVet(save, id);
  }
  if (pb && result.winner === save.armies[pb.attacker]?.nation) save.provinces[pb.province] = result.winner;
  save.history.push({...result, turn: save.turn});
  save.pendingBattle = null;
  return {promoted, byArmy};
}
