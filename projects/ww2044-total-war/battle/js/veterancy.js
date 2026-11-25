// Veterancy rules shared by battle, barracks and strategic map. Thresholds match barracks/js/main.js `vetStars`.

/** Soldier level (1 to 10) to stars (0 to 3). */
export const vetStars = (lv) => (lv >= 8 ? 3 : lv >= 5 ? 2 : lv >= 3 ? 1 : 0);

/** A section's stars: rounded mean of its men. */
export const sectionStars = (sec) => sec.men.length ? Math.round(sec.men.reduce((a, m) => a + vetStars(m.level), 0) / sec.men.length) : 0;

/** Give `xp` (in levels, 1 = one full level) to every man; returns names of men promoted. */
export function splitXp(men, xp) {
  const promoted = [];
  for (const m of men) {
    m.xp += xp;
    while (m.xp >= 1 && m.level < 10) { m.xp -= 1; m.level++; promoted.push(m.name); }
    if (m.level >= 10) m.xp = 0;
  }
  return promoted;
}

/** Multipliers for a squad in battle from its stars and data.veterancy. */
export function bonuses(stars, rules) {
  const p = rules.perStar;
  return {acc: 1 + stars * p.acc, suppResist: 1 + stars * p.suppResist, speed: 1 + stars * p.speed, sight: stars >= 3 ? 1 + (rules.star3.sight || 0) * 0.1 : 1};
}

/** XP a squad earns from one battle event. kind: damage | kill | capture | survive | win. Also lifts stars mid-battle. */
export function award(squad, kind, amount, rules) {
  squad.xp += (rules.xp[kind] || 0) * amount;
  const live = Math.min(3, squad.stars + Math.floor(squad.xp / 0.6)); // in-battle field promotion, every 0.6 XP
  if (live > (squad.liveStars ?? squad.stars)) { squad.liveStars = live; squad.vet = bonuses(live, rules); return true; }
  return false;
}
