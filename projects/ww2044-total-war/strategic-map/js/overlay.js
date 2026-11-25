// The overlay sheet, drawn once on a canvas: rivers traced downhill from the mountains, dashed sea trade routes,
// settlement names, and the nations' names lettered along gentle arcs across their land.
import * as T from 'three';
import {WORLD, PROVINCES, NATIONS, provinceAt, sampleGrid} from './world.js';

const W = 4096, H = Math.round((W * WORLD.d) / WORLD.w), K = W / WORLD.w;
const px = x => (x + WORLD.w / 2) * K, pz = z => (z + WORLD.d / 2) * K;

// Sea lanes (map units): ports and the waypoints between them, chosen to stay over water.
export const ROUTES = [
  [[-250, -130], [-420, -330], [-560, -470]],
  [[30, -200], [120, -330], [160, -430]],
  [[420, 60], [600, -60], [760, -200], [900, -280]],
  [[480, 240], [700, 230], [830, 300]],
  [[-140, 430], [-190, 540]],
  [[120, 470], [60, 610]],
  [[330, 420], [430, 500]],
  [[-500, 160], [-760, 200], [-1100, 260], [-1260, 300]],
  [[60, 610], [100, 800]], [[-190, 600], [-300, 820]], [[440, 520], [700, 620], [900, 820]],
  [[-640, -170], [-470, -40], [-420, 40]],
  [[900, -280], [1100, -200], [1260, -230]],
];

function curve(g, pts, tension = 0.5) {
  g.moveTo(px(pts[0][0]), pz(pts[0][1]));
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    g.bezierCurveTo(px(c1[0]), pz(c1[1]), px(c2[0]), pz(c2[1]), px(p2[0]), pz(p2[1]));
  }
}

function rivers(g, grid) {
  const {cols, rows, h} = grid, starts = [];
  for (let j = 4; j < rows - 4; j += 6) for (let i = 4; i < cols - 4; i += 6) {
    const k = j * cols + i;
    if (h[k] > 30 && starts.every(([a, b]) => Math.hypot(a - i, b - j) > 26)) starts.push([i, j]);
  }
  g.lineCap = g.lineJoin = 'round';
  for (const [si, sj] of starts) {
    let i = si, j = sj;
    const path = [[i, j]], seen = new Set([j * cols + i]);
    for (let step = 0; step < 400; step++) {
      let best = null, bh = h[j * cols + i];
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
        const ni = i + di, nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= cols || nj >= rows) continue;
        const k = nj * cols + ni;
        if (!seen.has(k) && h[k] < bh + 0.15) { bh = h[k]; best = [ni, nj]; }
      }
      if (!best) break;
      [i, j] = best;
      seen.add(j * cols + i);
      path.push(best);
      if (h[j * cols + i] <= 0) break;
    }
    if (path.length < 22 || h[j * cols + i] > 0) continue;
    const toW = ([a, b]) => [-WORLD.w / 2 + a * grid.sx + Math.sin(b * 0.9) * 1.2, -WORLD.d / 2 + b * grid.sz + Math.cos(a * 0.8) * 1.2];
    const pts = path.filter((_, n) => n % 3 === 0 || n === path.length - 1).map(toW);
    for (let n = 1; n < pts.length; n++) {
      g.beginPath();
      curve(g, pts.slice(n - 1, n + 1));
      g.strokeStyle = 'rgba(48,82,104,.75)';
      g.lineWidth = 1.2 + (n / pts.length) * 2.6;
      g.stroke();
    }
  }
}

function arcText(g, text, x, y, angle, size, bend) {
  g.save();
  g.translate(x, y);
  g.rotate(angle);
  g.font = `600 ${size}px Cinzel, serif`;
  const spacing = size * 0.18;
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
    g.strokeStyle = 'rgba(40,28,18,.28)';
    g.strokeText(ch, 0, 0);
    g.fillStyle = 'rgba(252,246,232,.9)';
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
    if (sampleGrid(grid, grid.sd, x, z) > 2) owner[j * C + i] = PROVINCES[provinceAt(x, z)].nation;
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
      const name = NATIONS[n].name.toUpperCase();
      const size = Math.max(30, Math.min(96, ((len * K) / name.length) * 1.15));
      arcText(g, name, px(mx), pz(mz), ang, size, 0.32);
    }
  }
}

export async function buildOverlay(grid) {
  try { await Promise.all([document.fonts.load('600 40px Cinzel'), document.fonts.load('italic 20px "EB Garamond"')]); } catch {}
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  rivers(g, grid);
  // trade routes
  g.setLineDash([18, 13]);
  g.lineCap = 'round';
  for (const r of ROUTES) {
    g.beginPath(); curve(g, r);
    g.strokeStyle = 'rgba(20,28,36,.3)'; g.lineWidth = 6; g.stroke();
    g.strokeStyle = 'rgba(238,240,234,.85)'; g.lineWidth = 3.4; g.stroke();
  }
  g.setLineDash([]);
  // settlements on Yantis: a dot and an italic name
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  for (const p of PROVINCES.filter(p => p.seat)) {
    const x = px(p.x), y = pz(p.z);
    g.beginPath(); g.arc(x, y, 5, 0, 7);
    g.fillStyle = '#2b2118'; g.fill();
    g.lineWidth = 2; g.strokeStyle = '#efe4c8'; g.stroke();
    g.font = 'italic 500 24px "EB Garamond", serif';
    g.lineWidth = 4; g.strokeStyle = 'rgba(245,236,214,.55)'; g.strokeText(p.name, x + 10, y - 2);
    g.fillStyle = '#2b2118'; g.fillText(p.name, x + 10, y - 2);
  }
  nationLabels(g, grid);
  const tex = new T.CanvasTexture(cv);
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = T.LinearMipmapLinearFilter;
  return tex;
}
