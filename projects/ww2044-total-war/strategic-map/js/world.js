// The placeholder world: the Yantis island from PARTISAN (map/island.js heightfield and settlements, ported as-is)
// set in a wider sea with a northern and an eastern mainland and an island chain, split into provinces and nations.
// Pure data and maths. Map units: +x east, +z south; sea level 0.

export const WORLD = {w: 2400, d: 1600};
export const YANTIS = {x: -40, z: 70, s: 1.35}; // centre and scale of the island in the world // where the island's centre sits in the world

// ---------- PARTISAN noise (map/island.js) ----------
function hash(x, z, seed) {
  let n = (Math.imul(x, 374761393) + Math.imul(z, 668265263) + Math.imul(seed, 1442695041)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
export function noise(x, z, seed = 1) {
  const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(xi, zi, seed), b = hash(xi + 1, zi, seed), c = hash(xi, zi + 1, seed), d = hash(xi + 1, zi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export const fbm = (x, z, seed = 1, oct = 5) => {
  let s = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += noise(x * f, z * f, seed + i * 17) * amp; f *= 2.03; amp *= 0.5; }
  return s;
};
const ridge = (x, z, seed) => {
  let s = 0, amp = 0.5, f = 1;
  for (let i = 0; i < 5; i++) { s += (1 - Math.abs(noise(x * f, z * f, seed + i * 31) * 2 - 1)) ** 2 * amp; f *= 2.1; amp *= 0.5; }
  return s;
};
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- Yantis (PARTISAN map/island.js heightAt, unchanged maths) ----------
const Y_SIZE = {w: 960, d: 720};
const PEAKS = [{x: -120, z: -90, r: 170, h: 62}, {x: 60, z: -170, r: 130, h: 54}, {x: 210, z: 40, r: 120, h: 34}, {x: -300, z: 120, r: 110, h: 24}];
function yantisHeight(x, z) {
  const nx = x / (Y_SIZE.w / 2), nz = z / (Y_SIZE.d / 2);
  const ang = Math.atan2(nz, nx), r = Math.hypot(nx, nz);
  if (r > 1.6) return -14;
  const coast = 0.86 + 0.09 * Math.sin(ang * 3 + 1.2) + 0.06 * Math.sin(ang * 7 - 0.4) + (fbm(nx * 2.2 + 5, nz * 2.2, 3) - 0.5) * 0.32;
  const land = smooth(coast + 0.05, coast - 0.18, r);
  let h = -14 + land * 18;
  h += (fbm(x / 90, z / 90, 7) - 0.45) * 22 * land;
  for (const p of PEAKS) {
    const d = Math.hypot(x - p.x, z - p.z) / p.r;
    if (d < 1.4) h += p.h * smooth(1.25, 0.05, d) * (0.55 + 0.75 * ridge(x / 70, z / 70, 11)) * land;
  }
  h -= smooth(0.5, 0.95, fbm(x / 60 + 40, z / 60, 21)) * 10 * smooth(0.72, 1, r);
  if (land > 0.7) h = Math.max(h, 0.8 + (land - 0.7) * 8);
  return h;
}

// ---------- the wider world (placeholder geography around Yantis) ----------
const ISLETS = [[-190, 600, 62], [40, 650, 50], [250, 610, 46], [440, 520, 40], [-380, 520, 34], [620, 360, 44], [-640, -170, 50]];
function mainland(x, z) {
  const w = (fbm(x / 260, z / 260, 41) - 0.5) * 170;
  const north = -470 + 70 * Math.sin(x * 0.0042 + 1.3) + 55 * Math.sin(x * 0.011 + 0.4) + w - z; // > 0 on land
  const east = x - (820 + 70 * Math.sin(z * 0.006 + 2) + 40 * Math.sin(z * 0.017)) + w * 0.9 - Math.max(0, z - 380) * 0.25;
  const west = -x - 1060 + 60 * Math.sin(z * 0.009) + w;
  const L = Math.max(north, east, west);
  const land = smooth(-30, 40, L);
  let h = -14 + land * 18 + (fbm(x / 110, z / 110, 9) - 0.45) * 22 * land;
  h += 46 * smooth(120, 360, L) * (0.4 + 0.8 * ridge(x / 80, z / 80, 13)) * land;
  return h;
}
export function heightAt(x, z) {
  let h = Math.max(yantisHeight((x - YANTIS.x) / YANTIS.s, (z - YANTIS.z) / YANTIS.s), mainland(x, z));
  for (const [ix, iz, r] of ISLETS) {
    const d = Math.hypot(x - ix, z - iz) / r + (fbm(x / 22, z / 22, 5) - 0.5) * 0.9;
    if (d < 2) h = Math.max(h, -14 + 22 * smooth(1.3, 0.35, d) + 10 * smooth(0.6, 0, d));
  }
  return h;
}

// ---------- nations and provinces ----------
// Yantis keeps PARTISAN's three factions; the mainland nations are placeholders.
export const NATIONS = [
  {id: 'free', name: 'Free Yantis', color: '#8fae7c'},
  {id: 'occ', name: 'Occupation Authority', color: '#c98a6a'},
  {id: 'neu', name: 'Neutral Cantons', color: '#d8c08a'},
  {id: 'dir', name: 'Northern Directorate', color: '#b27a5e'},
  {id: 'var', name: 'Kingdom of Varenna', color: '#7d86b8'},
  {id: 'ost', name: 'Ostmark Federation', color: '#d7876d'},
  {id: 'sey', name: 'Republic of Seyla', color: '#9a76b5'},
  {id: 'kau', name: 'Kaur Hegemony', color: '#d9b46a'},
];
const FACTION = {resistance: 0, invader: 1, neutral: 2};
// PARTISAN settlements (map/island.js), in island coordinates.
const SETTLEMENTS = [
  ['Kastro', 'invader', 220, 160], ['Agia Marina', 'invader', -290, 0], ['Fort Orion', 'invader', 120, 40], ['Myrtia', 'invader', 320, -30],
  ['Pelekas', 'neutral', -150, 200], ['Korfos', 'neutral', -60, 110], ['Lithia', 'resistance', -240, -190], ['Oros Camp', 'resistance', -180, -30],
  ['Vrisi', 'resistance', 160, -200],
];
const SYL = ['ka', 'ver', 'os', 'tri', 'lan', 'mor', 'dei', 'sa', 'vel', 'run', 'ha', 'kel', 'bra', 'nis', 'ost', 'ul', 'gra', 'den', 'ri', 'mar'];
const rnd = (i, s) => hash(i, s, 99);
const pname = i => { const a = SYL[Math.floor(rnd(i, 1) * 20)], b = SYL[Math.floor(rnd(i, 2) * 20)], c = rnd(i, 3) > 0.5 ? SYL[Math.floor(rnd(i, 4) * 20)] : ''; const n = a + b + c; return n[0].toUpperCase() + n.slice(1); };

export const PROVINCES = [];
SETTLEMENTS.forEach(([name, f, x, z], i) => {
  PROVINCES.push({name, nation: FACTION[f], x: x * YANTIS.s + YANTIS.x, z: z * YANTIS.s + YANTIS.z, seat: true});
  for (let k = 0; k < 2; k++) { const a = rnd(i, 10 + k) * 6.28, r = 55 + rnd(i, 20 + k) * 45; PROVINCES.push({name: pname(i * 7 + k), nation: FACTION[f], x: x * YANTIS.s + YANTIS.x + Math.cos(a) * r, z: z * YANTIS.s + YANTIS.z + Math.sin(a) * r}); }
});
ISLETS.forEach(([x, z], i) => PROVINCES.push({name: pname(200 + i), nation: i === 6 ? 4 : i % 2 ? 2 : 1, x, z}));
// mainland: a jittered grid of seats, kept where there is land, owned by bands of nations
for (let j = 0; j < 9; j++)
  for (let i = 0; i < 14; i++) {
    const x = -1150 + i * 175 + (rnd(i * 31 + j, 5) - 0.5) * 120, z = -760 + j * 175 + (rnd(i * 17 + j, 6) - 0.5) * 120;
    if (mainland(x, z) < 2) continue;
    const nation = x > 760 ? (z < 120 ? 6 : 7) : x < -1000 && z > -350 ? 4 : x < -520 ? 3 : x < 60 ? 4 : x < 470 ? 5 : 6;
    PROVINCES.push({name: pname(400 + i * 9 + j), nation, x, z});
  }

/** The organic warp applied to province borders (identical in the shader). */
export const warp = (x, z) => [x + 14 * Math.sin(z * 0.045 + 1.7) + 7 * Math.sin(z * 0.13 + x * 0.05), z + 14 * Math.sin(x * 0.041 + 0.3) + 7 * Math.sin(x * 0.12 - z * 0.04)];
export function provinceAt(x, z) {
  const [wx, wz] = warp(x, z);
  let best = 0, bd = Infinity;
  PROVINCES.forEach((p, i) => { const d = (wx - p.x) ** 2 + (wz - p.z) ** 2; if (d < bd) { bd = d; best = i; } });
  return best;
}

/** The world baked on a grid: heights and signed distance to the coast (+ on land), in map units. */
export function bake(cols = 768, rows = 512) {
  const sx = WORLD.w / (cols - 1), sz = WORLD.d / (rows - 1), n = cols * rows;
  const h = new Float32Array(n), dl = new Float32Array(n), ds = new Float32Array(n);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) h[j * cols + i] = heightAt(-WORLD.w / 2 + i * sx, -WORLD.d / 2 + j * sz);
  // chamfer distance transforms: to the nearest sea cell (for land) and to the nearest land cell (for sea)
  const BIG = 1e6, s = (sx + sz) / 2, dg = s * Math.SQRT2;
  for (let k = 0; k < n; k++) { dl[k] = h[k] > 0 ? BIG : 0; ds[k] = h[k] > 0 ? 0 : BIG; }
  for (const D of [dl, ds]) {
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const k = j * cols + i; let v = D[k];
      if (i > 0) v = Math.min(v, D[k - 1] + s);
      if (j > 0) { v = Math.min(v, D[k - cols] + s); if (i > 0) v = Math.min(v, D[k - cols - 1] + dg); if (i < cols - 1) v = Math.min(v, D[k - cols + 1] + dg); }
      D[k] = v;
    }
    for (let j = rows - 1; j >= 0; j--) for (let i = cols - 1; i >= 0; i--) {
      const k = j * cols + i; let v = D[k];
      if (i < cols - 1) v = Math.min(v, D[k + 1] + s);
      if (j < rows - 1) { v = Math.min(v, D[k + cols] + s); if (i < cols - 1) v = Math.min(v, D[k + cols + 1] + dg); if (i > 0) v = Math.min(v, D[k + cols - 1] + dg); }
      D[k] = v;
    }
  }
  const sd = new Float32Array(n);
  for (let k = 0; k < n; k++) sd[k] = h[k] > 0 ? dl[k] - s / 2 : -(ds[k] - s / 2);
  return {cols, rows, sx, sz, h, sd};
}
export function sampleGrid(g, arr, x, z) {
  const fx = (x + WORLD.w / 2) / g.sx, fz = (z + WORLD.d / 2) / g.sz;
  const i = Math.max(0, Math.min(g.cols - 2, Math.floor(fx))), j = Math.max(0, Math.min(g.rows - 2, Math.floor(fz)));
  const u = Math.min(1, Math.max(0, fx - i)), v = Math.min(1, Math.max(0, fz - j)), k = j * g.cols + i;
  const a = arr[k], b = arr[k + 1], c = arr[k + g.cols], d = arr[k + g.cols + 1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
