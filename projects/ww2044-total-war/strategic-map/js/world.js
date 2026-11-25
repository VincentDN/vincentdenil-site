// The world: Poland and its neighbours on 1 January 1936. Baked offline by tools/bake-poland1936.cjs into
// data/poland1936.webp (height and province per cell) and data/poland1936.json (provinces, rivers).
// Map units: +x east, +z south; sea level 0. A simple equirectangular projection centred on 21.75°E 52.2°N.

export const WORLD = {w: 2400, d: 1600};
const LON0 = 21.75, LAT0 = 52.2, KX = 0.6129, S = 159.8; // keep in step with the bake script
export const lonlat = (lon, lat) => [(lon - LON0) * KX * S, -(lat - LAT0) * S];

export const NATIONS = [
  {id: 'POL', name: 'Poland', long: 'Republic of Poland', color: '#b98a8a'},
  {id: 'GER', name: 'German Reich', long: 'German Reich', color: '#7c8186'},
  {id: 'SOV', name: 'Soviet Union', long: 'Union of Soviet Socialist Republics', color: '#8c4f45'},
  {id: 'DAN', name: 'Danzig', long: 'Free City of Danzig', color: '#b0624e'},
  {id: 'LIT', name: 'Lithuania', long: 'Republic of Lithuania', color: '#b48d55'},
  {id: 'LAT', name: 'Latvia', long: 'Republic of Latvia', color: '#6f8d5e'},
  {id: 'CSR', name: 'Czechoslovakia', long: 'Czechoslovak Republic', color: '#5d8a86'},
  {id: 'ROM', name: 'Romania', long: 'Kingdom of Romania', color: '#b6a35c'},
  {id: 'HUN', name: 'Hungary', long: 'Kingdom of Hungary', color: '#6f7d4b'},
  {id: 'AUT', name: 'Austria', long: 'Federal State of Austria', color: '#9a8f7c'},
  {id: 'SWE', name: 'Sweden', long: 'Kingdom of Sweden', color: '#6a7f9b'},
  {id: 'DEN', name: 'Denmark', long: 'Kingdom of Denmark', color: '#8a7a9a'},
  {id: 'EST', name: 'Estonia', long: 'Republic of Estonia', color: '#5f7f99'},
  {id: 'SWI', name: 'Switzerland', long: 'Swiss Confederation', color: '#a0907a'},
  {id: 'OTH', name: 'Neutral', long: 'Neutral', color: '#8a8a80'},
];
export const PROVINCES = []; // {name, nation, x, z, seat}
export let RIVERS = []; // [width, [x, z, x, z, ...]]
let G = null;

/** Load the baked world and derive the coast and border distance fields. */
export async function loadWorld() {
  const [meta, blob] = await Promise.all([fetch('data/poland1936.json?v=5').then(r => r.json()), fetch('data/poland1936.webp?v=5').then(r => r.blob())]);
  const bmp = await createImageBitmap(blob, {colorSpaceConversion: 'none', premultiplyAlpha: 'none'});
  const cv = new OffscreenCanvas(bmp.width, bmp.height), cx = cv.getContext('2d', {willReadFrequently: true});
  cx.drawImage(bmp, 0, 0);
  const px = cx.getImageData(0, 0, bmp.width, bmp.height).data;
  for (const [name, nation, x, z, seat] of meta.provinces) PROVINCES.push({name, nation, x, z, seat: !!seat});
  RIVERS = meta.rivers;
  const cols = meta.cols, rows = meta.rows, n = cols * rows;
  const h = new Float32Array(n), pid = new Int16Array(n);
  for (let k = 0; k < n; k++) {
    const r = px[k * 4], id = ((r >> 7) << 8) | px[k * 4 + 1];
    h[k] = (((r & 127) << 8) | px[k * 4 + 2]) / 390 - 20;
    pid[k] = id === 511 ? -1 : id;
  }
  const sx = WORLD.w / (cols - 1), sz = WORLD.d / (rows - 1);
  G = {cols, rows, sx, sz, h, pid};
  // seeds for the distance transforms: the coast, and the cells either side of a province or a nation border
  const land = k => pid[k] >= 0, nat = k => PROVINCES[pid[k]].nation;
  const dl = new Float32Array(n), ds = new Float32Array(n), dp = new Float32Array(n).fill(1e6), dn = new Float32Array(n).fill(1e6);
  const s = (sx + sz) / 2;
  for (let k = 0; k < n; k++) { dl[k] = h[k] > 0 ? 1e6 : 0; ds[k] = h[k] > 0 ? 0 : 1e6; }
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = j * cols + i;
    if (!land(k)) continue;
    for (const q of [i < cols - 1 ? k + 1 : -1, j < rows - 1 ? k + cols : -1]) {
      if (q < 0 || !land(q) || pid[q] === pid[k]) continue;
      dp[k] = dp[q] = s / 2;
      if (nat(q) !== nat(k)) dn[k] = dn[q] = s / 2;
    }
  }
  for (const D of [dl, ds, dp, dn]) chamfer(D, cols, rows, s);
  for (const D of [dp, dn]) for (let r = 0; r < 2; r++) blur(D, cols, rows); // soften the cell steps along borders
  const sd = new Float32Array(n);
  for (let k = 0; k < n; k++) sd[k] = h[k] > 0 ? dl[k] - s / 2 : -(ds[k] - s / 2);
  return Object.assign(G, {sd, dp, dn});
}
function blur(D, cols, rows) {
  const t = new Float32Array(D.length);
  for (let j = 0; j < rows; j++) for (let i = 1; i < cols - 1; i++) { const k = j * cols + i; t[k] = (D[k - 1] + D[k] + D[k + 1]) / 3; }
  for (let j = 1; j < rows - 1; j++) for (let i = 1; i < cols - 1; i++) { const k = j * cols + i; D[k] = (t[k - cols] + t[k] + t[k + cols]) / 3; }
}
function chamfer(D, cols, rows, s) {
  const dg = s * Math.SQRT2;
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
const cell = (x, z) => {
  const i = Math.round((x + WORLD.w / 2) / G.sx), j = Math.round((z + WORLD.d / 2) / G.sz);
  return i < 0 || j < 0 || i >= G.cols || j >= G.rows ? -1 : j * G.cols + i;
};
/** The province under a point, or -1 over water and off the map. */
export function provinceAt(x, z) { const k = cell(x, z); return k < 0 ? -1 : G.pid[k]; }
export const nationAt = (x, z) => { const p = provinceAt(x, z); return p < 0 ? -1 : PROVINCES[p].nation; };
export const heightAt = (x, z) => sampleGrid(G, G.h, x, z);
export function sampleGrid(g, arr, x, z) {
  const fx = (x + WORLD.w / 2) / g.sx, fz = (z + WORLD.d / 2) / g.sz;
  const i = Math.max(0, Math.min(g.cols - 2, Math.floor(fx))), j = Math.max(0, Math.min(g.rows - 2, Math.floor(fz)));
  const u = Math.min(1, Math.max(0, fx - i)), v = Math.min(1, Math.max(0, fz - j)), k = j * g.cols + i;
  const a = arr[k], b = arr[k + 1], c = arr[k + g.cols], d = arr[k + g.cols + 1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
