// The overlay sheet, drawn once on a canvas: the real rivers (Natural Earth), dashed Baltic shipping lanes, town names,
// and the nations' names lettered along gentle arcs across their land.
import * as T from 'three';
import {WORLD, PROVINCES, NATIONS, RIVERS, nationAt, lonlat, sampleGrid} from './world.js';

const W = 4096, H = Math.round((W * WORLD.d) / WORLD.w), K = W / WORLD.w;
const px = x => (x + WORLD.w / 2) * K, pz = z => (z + WORLD.d / 2) * K;

// Baltic shipping lanes in 1936 (lon, lat): Gdynia and Danzig to the Sound, to Stockholm and to Königsberg, Stettin and Memel.
const LANES = [
  [[18.62, 54.6], [18.9, 54.9], [17.6, 55.25], [15.8, 55.3], [14.4, 55.15], [13.2, 55.1], [12.75, 55.45], [12.7, 55.9]],
  [[18.9, 54.9], [19.1, 55.6], [18.9, 56.4], [18.9, 57.4]],
  [[18.9, 54.9], [19.6, 54.9], [19.88, 54.66]],
  [[14.27, 53.95], [14.4, 54.4], [14.9, 54.75], [15.8, 55.3]],
  [[21.08, 55.72], [20.4, 55.75], [19.6, 55.5], [19.1, 55.6]],
  [[10.2, 54.42], [10.9, 54.5], [11.6, 54.5], [12.4, 54.55], [13.3, 54.75], [14.4, 55.15]],
  [[21.0, 56.52], [20.4, 56.4], [19.4, 55.9]],
].map(l => l.map(([lo, la]) => lonlat(lo, la)));

function curve(g, pts, tension = 0.5) {
  g.moveTo(px(pts[0][0]), pz(pts[0][1]));
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    g.bezierCurveTo(px(c1[0]), pz(c1[1]), px(c2[0]), pz(c2[1]), px(p2[0]), pz(p2[1]));
  }
}

function rivers(g) {
  g.lineCap = g.lineJoin = 'round';
  for (const [w, pts] of RIVERS) {
    g.beginPath();
    for (let k = 0; k < pts.length; k += 2) (k ? g.lineTo : g.moveTo).call(g, px(pts[k]), pz(pts[k + 1]));
    g.strokeStyle = 'rgba(40,74,96,.8)';
    g.lineWidth = 1.2 + Math.min(4, w * 1.6);
    g.stroke();
  }
}

function arcText(g, text, x, y, angle, size, bend) {
  g.save();
  g.translate(x, y);
  g.rotate(angle);
  g.font = `600 ${size}px Oswald, "Arial Narrow", sans-serif`;
  const spacing = size * 0.22;
  const widths = [...text].map(ch => g.measureText(ch).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0) - spacing;
  const R = total / Math.max(0.05, bend); // the arc's radius: a wider name bends less
  let a = -total / 2 / R;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  [...text].forEach((ch, i) => {
    const w = widths[i], mid = a + (w - spacing) / 2 / R;
    g.save();
    g.translate(Math.sin(mid) * R, R - Math.cos(mid) * R);
    g.rotate(mid);
    g.lineWidth = size * 0.12;
    g.strokeStyle = 'rgba(10,14,14,.35)';
    g.strokeText(ch, 0, 0);
    g.fillStyle = 'rgba(236,240,230,.82)';
    g.fillText(ch, 0, 0);
    g.restore();
    a += w / R;
  });
  g.restore();
}

function nationLabels(g, grid) {
  // biggest connected piece of each nation on a coarse grid, then its centre and long axis
  const C = 240, R = Math.round((C * WORLD.d) / WORLD.w), owner = new Int16Array(C * R).fill(-1);
  const at = (i, j) => [-WORLD.w / 2 + ((i + 0.5) * WORLD.w) / C, -WORLD.d / 2 + ((j + 0.5) * WORLD.d) / R];
  for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
    const [x, z] = at(i, j);
    if (sampleGrid(grid, grid.sd, x, z) > 2) owner[j * C + i] = nationAt(x, z);
  }
  const seen = new Uint8Array(C * R), best = {};
  for (let s = 0; s < C * R; s++) {
    if (owner[s] < 0 || seen[s]) continue;
    const n = owner[s], cells = [], stack = [s];
    seen[s] = 1;
    while (stack.length) {
      const k = stack.pop(), i = k % C, j = (k - i) / C;
      cells.push(at(i, j));
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = i + di, nj = j + dj, q = nj * C + ni;
        if (ni >= 0 && nj >= 0 && ni < C && nj < R && !seen[q] && owner[q] === n) { seen[q] = 1; stack.push(q); }
      }
    }
    (best[n] ||= []).push(cells);
  }
  for (const [n, pieces] of Object.entries(best)) {
    pieces.sort((a, b) => b.length - a.length);
    for (const cells of pieces.slice(0, 2)) {
      if (cells.length < (pieces[0] === cells ? 40 : 160)) continue;
      let mx = 0, mz = 0;
      for (const [x, z] of cells) { mx += x; mz += z; }
      mx /= cells.length; mz /= cells.length;
      let sxx = 0, szz = 0, sxz = 0;
      for (const [x, z] of cells) { sxx += (x - mx) ** 2; szz += (z - mz) ** 2; sxz += (x - mx) * (z - mz); }
      let ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
      if (ang > Math.PI / 2) ang -= Math.PI; if (ang < -Math.PI / 2) ang += Math.PI;
      const len = 2.4 * Math.sqrt((sxx * Math.cos(ang) ** 2 + szz * Math.sin(ang) ** 2 + 2 * sxz * Math.sin(ang) * Math.cos(ang)) / cells.length);
      const name = (+n === 1 && mx > 0 ? 'East Prussia' : NATIONS[n].name).toUpperCase();
      const size = Math.max(26, Math.min(120, ((len * K) / name.length) * 1.15));
      arcText(g, name, px(mx), pz(mz), ang, size, 0.12);
    }
  }
}

/** Draw the overlay; `parts` picks layers (the PSD export draws them one at a time). */
export async function buildOverlay(grid, parts = ['rivers', 'lanes', 'markers', 'names', 'nations']) {
  const on = k => parts.includes(k);
  try { await Promise.all([document.fonts.load('600 40px Oswald'), document.fonts.load('20px "Special Elite"'), document.fonts.load('30px "Special Elite"')]); } catch {}
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  if (on('rivers')) rivers(g);
  // trade routes
  g.setLineDash([18, 13]);
  g.lineCap = 'round';
  for (const r of on('lanes') ? LANES : []) {
    g.beginPath(); curve(g, r);
    g.strokeStyle = 'rgba(20,28,36,.3)'; g.lineWidth = 6; g.stroke();
    g.strokeStyle = 'rgba(238,240,234,.85)'; g.lineWidth = 3.4; g.stroke();
  }
  g.setLineDash([]);
  // towns: a square marker and a typed name; capitals larger
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  const CAPITALS = ['Warszawa', 'Berlin', 'Kaunas', 'Rīga', 'Praha', 'Wien', 'Budapest', 'København', 'Danzig', 'Minsk', 'Kiev'];
  for (const p of PROVINCES.filter(p => p.seat && Math.abs(p.x) < WORLD.w / 2 - 20 && Math.abs(p.z) < WORLD.d / 2 - 20)) {
    const x = px(p.x), y = pz(p.z), cap = CAPITALS.includes(p.name), r = cap ? 7 : 4;
    if (on('markers')) { g.fillStyle = cap ? '#f2c46b' : '#efe9d8'; g.fillRect(x - r, y - r, r * 2, r * 2); g.lineWidth = 2; g.strokeStyle = '#1a1d1b'; g.strokeRect(x - r, y - r, r * 2, r * 2); }
    if (!on('names')) continue;
    g.font = `${cap ? 26 : 17}px "Special Elite", monospace`;
    g.lineWidth = 4; g.strokeStyle = 'rgba(15,18,17,.6)'; g.strokeText(p.name.toUpperCase(), x + r + 4, y - 1);
    g.fillStyle = '#efe9d8'; g.fillText(p.name.toUpperCase(), x + r + 4, y - 1);
  }
  if (on('nations')) nationLabels(g, grid);
  const tex = new T.CanvasTexture(cv);
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = T.LinearMipmapLinearFilter;
  return tex;
}
