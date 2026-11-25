// The strategic map: camera (pan, zoom toward the cursor), selection (click, shift-click, shift-drag box), move orders
// (right-click), the province tooltip, the clock and the interface wiring.
import * as T from 'three';
import {WORLD, PROVINCES, NATIONS, bake, provinceAt, sampleGrid} from './world.js';
import {buildMap} from './map.js';
import {buildOverlay} from './overlay.js';
import {UNITS, PLAYER, buildUnits, setSelected, order, updateUnits} from './units.js';
import {startAudio, toggle, sfx} from './audio.js';

const $ = id => document.getElementById(id);
const stage = $('stage');
const renderer = new T.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
stage.append(renderer.domElement);
const scene = new T.Scene();
scene.background = new T.Color('#3b2a1c');
const camera = new T.PerspectiveCamera(32, innerWidth / innerHeight, 10, 20000);
const cam = {x: 20, z: 60, dist: 2000, want: 1500};

const grid = bake();
const overlay = await buildOverlay(grid);
overlay.flipY = false;
const map = buildMap(scene, grid, overlay);
overlay.anisotropy = renderer.capabilities.getMaxAnisotropy();
await buildUnits(scene);

// ---------- camera ----------
const MIN = 260, MAX = 2300;
function placeCamera() {
  const k = (cam.dist - MIN) / (MAX - MIN), pitch = 0.92 + 0.32 * k; // tilted when close, nearly top-down when far
  cam.x = Math.max(-WORLD.w / 2 + 80, Math.min(WORLD.w / 2 - 80, cam.x));
  cam.z = Math.max(-WORLD.d / 2 + 80, Math.min(WORLD.d / 2 - 80, cam.z));
  camera.position.set(cam.x, Math.sin(pitch) * cam.dist, cam.z + Math.cos(pitch) * cam.dist);
  camera.lookAt(cam.x, 0, cam.z);
}
const ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
function groundAt(cx, cy) {
  ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const p = new T.Vector3();
  return ray.ray.intersectPlane(plane, p) ? p : null;
}
function unitAt(cx, cy) {
  ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(UNITS.map(u => u.sprite))[0];
  return hit ? hit.object.userData.unit : null;
}

// ---------- selection ----------
const selected = new Set();
function select(list, add = false) {
  if (!add) for (const u of [...selected]) { setSelected(u, false); selected.delete(u); }
  for (const u of list) { setSelected(u, true); selected.add(u); }
  if (list.length) sfx('select');
  showCard();
}
function showCard() {
  const card = $('card'), list = [...selected];
  card.hidden = !list.length;
  if (!list.length) return;
  const u = list[0];
  $('card-img').src = u.img;
  if (list.length === 1) {
    $('card-name').textContent = u.name;
    $('card-sub').textContent = `${u.kindName} · ${NATIONS[u.nation].name}`;
    $('card-rows').innerHTML = row('Strength', u.str.toLocaleString('en-GB')) + row('Morale', u.mor + '%') + row('Veterancy', '★'.repeat(u.vet) + '☆'.repeat(3 - u.vet)) + row('Province', PROVINCES[provinceAt(u.x, u.z)].name);
  } else {
    $('card-name').textContent = `${list.length} armies selected`;
    $('card-sub').textContent = [...new Set(list.map(v => NATIONS[v.nation].name))].join(', ');
    $('card-rows').innerHTML = row('Strength', list.reduce((s, v) => s + v.str, 0).toLocaleString('en-GB')) + row('Morale', Math.round(list.reduce((s, v) => s + v.mor, 0) / list.length) + '%');
  }
}
const row = (k, v) => `<dt>${k}</dt><dd>${v}</dd>`;

// ---------- input ----------
const cv = renderer.domElement;
let drag = null;
cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId);
  if (e.button === 2) {
    const own = [...selected].filter(u => u.nation === PLAYER), p = groundAt(e.clientX, e.clientY);
    if (own.length && p) {
      own.forEach((u, i) => { const a = (i / own.length) * 6.28; order(u, p.x + (own.length > 1 ? Math.cos(a) * 26 : 0), p.z + (own.length > 1 ? Math.sin(a) * 26 : 0)); });
      sfx('order');
    } else if (selected.size) say('Only your own armies take orders');
    return;
  }
  drag = {x: e.clientX, y: e.clientY, cx: cam.x, cz: cam.z, start: groundAt(e.clientX, e.clientY), box: e.shiftKey, moved: false};
});
cv.addEventListener('pointermove', e => {
  if (drag) {
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 4) drag.moved = true;
    if (drag.box) {
      const b = $('box');
      b.hidden = !drag.moved;
      Object.assign(b.style, {left: Math.min(drag.x, e.clientX) + 'px', top: Math.min(drag.y, e.clientY) + 'px', width: Math.abs(e.clientX - drag.x) + 'px', height: Math.abs(e.clientY - drag.y) + 'px'});
    } else if (drag.moved && drag.start) {
      cv.classList.add('dragging');
      cam.x = drag.cx; cam.z = drag.cz; placeCamera();
      const p = groundAt(e.clientX, e.clientY);
      if (p) { cam.x = drag.cx + (drag.start.x - p.x); cam.z = drag.cz + (drag.start.z - p.z); placeCamera(); }
    }
    $('tip').hidden = true;
    return;
  }
  hover(e.clientX, e.clientY);
});
cv.addEventListener('pointerup', e => {
  cv.classList.remove('dragging');
  if (!drag) return;
  if (drag.box && drag.moved) {
    const x0 = Math.min(drag.x, e.clientX), x1 = Math.max(drag.x, e.clientX), y0 = Math.min(drag.y, e.clientY), y1 = Math.max(drag.y, e.clientY);
    const inBox = UNITS.filter(u => { const v = u.sprite.position.clone().project(camera), sx = ((v.x + 1) / 2) * innerWidth, sy = ((1 - v.y) / 2) * innerHeight; return sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1; });
    select(inBox, true);
    $('box').hidden = true;
  } else if (!drag.moved) {
    const u = unitAt(e.clientX, e.clientY);
    if (u) select(selected.has(u) && e.shiftKey ? [] : [u], e.shiftKey);
    else {
      select([]);
      const p = groundAt(e.clientX, e.clientY);
      map.uniforms.uSel.value = p && sampleGrid(grid, grid.sd, p.x, p.z) > 0 ? provinceAt(p.x, p.z) : -1;
      sfx('click');
    }
  }
  drag = null;
});
cv.addEventListener('wheel', e => {
  e.preventDefault();
  const before = groundAt(e.clientX, e.clientY);
  cam.want = Math.max(MIN, Math.min(MAX, cam.want * Math.exp(e.deltaY * 0.0012)));
  zoomAnchor = before ? {x: e.clientX, y: e.clientY, p: before} : null;
}, {passive: false});
let zoomAnchor = null;
function hover(x, y) {
  const tip = $('tip'), u = unitAt(x, y), p = groundAt(x, y);
  let html = '';
  if (u) html = `<b>${u.name}</b><small>${u.kindName} · ${u.str.toLocaleString('en-GB')} men · ${NATIONS[u.nation].name}</small>`;
  else if (p && Math.abs(p.x) < WORLD.w / 2 && Math.abs(p.z) < WORLD.d / 2) {
    const land = sampleGrid(grid, grid.sd, p.x, p.z) > 0, i = provinceAt(p.x, p.z);
    map.uniforms.uHover.value = land ? i : -1;
    if (land) html = `<b>${PROVINCES[i].name}</b><small>${NATIONS[PROVINCES[i].nation].name}</small>`;
  } else map.uniforms.uHover.value = -1;
  cv.style.cursor = u ? 'pointer' : '';
  tip.hidden = !html;
  if (html) { tip.innerHTML = html; tip.style.left = x + 16 + 'px'; tip.style.top = y + 14 + 'px'; }
}
const keys = new Set();
addEventListener('keydown', e => {
  if (e.target.closest('dialog')) return;
  keys.add(e.key.toLowerCase());
  if (e.key === ' ') { e.preventDefault(); setSpeed(speed ? 0 : lastSpeed); }
  if (['1', '2', '3'].includes(e.key)) setSpeed(+e.key);
  if (e.key.toLowerCase() === 'm') $('music').click();
  if (e.key.toLowerCase() === 'n') $('amb').click();
  if (e.key === 'Escape') select([]);
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

// ---------- clock and interface ----------
let speed = 0, lastSpeed = 1, day = new Date(Date.UTC(2044, 2, 14)), acc = 0;
function setSpeed(s) {
  if (s) lastSpeed = s;
  speed = s;
  $('state').textContent = s ? ['', 'Normal', 'Fast', 'Fastest'][s] : 'Paused';
  $('state').classList.toggle('run', !!s);
  [...$('speed').children].forEach((i, n) => i.classList.toggle('on', n < (s || 0)));
  $('pause').querySelector('use').setAttribute('href', `img/icons.svg#i-${s ? 'pause' : 'play'}-button`);
}
$('pause').onclick = () => { sfx('click'); setSpeed(speed ? 0 : lastSpeed); };
$('speed').onclick = () => { sfx('click'); setSpeed((lastSpeed % 3) + 1); };
$('music').onclick = e => { e.currentTarget.setAttribute('aria-pressed', toggle('music')); };
$('amb').onclick = e => { e.currentTarget.setAttribute('aria-pressed', toggle('amb')); };
$('credits-btn').onclick = () => $('credits').showModal();
let toastT;
function say(text) { const t = $('toast'); t.querySelector('span').textContent = text; t.classList.remove('hide'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hide'), 4200); }
const GRID = ['crown', 'dove', 'person', 'castle', 'scroll-unfurled', 'quill-ink', 'helmet', 'shield', 'cannon', 'trophy-cup', 'radar-dish', 'two-coins', 'book-cover', 'treasure-map', 'gears', 'flag-objective', 'chess-knight', 'factory', 'wheat', 'oil-drum', 'ship-wheel', 'anchor', 'globe', 'compass', 'jet-fighter', 'rocket', 'radio-tower', 'walkie-talkie', 'satellite-communication', 'missile-launcher', 'bulldozer', 'barbed-wire'];
$('grid').innerHTML = GRID.map(n => `<button class="rb" title="${n.replace(/-/g, ' ')}"><svg><use href="img/icons.svg#i-${n}"/></svg></button>`).join('');
document.querySelectorAll('.topbar .rb:not(#music):not(#amb), .emblem, .sub-left .rb, .actions .rb').forEach(b => b.addEventListener('click', () => { sfx('click'); say(`${b.title[0].toUpperCase() + b.title.slice(1)}: not in this slice yet`); }));
setSpeed(0);

// ---------- loop ----------
const clock = new T.Clock();
placeCamera();
function frame() {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  // keyboard pan, scaled with zoom
  const pan = cam.dist * 0.9 * dt;
  if (keys.has('w') || keys.has('arrowup')) cam.z -= pan;
  if (keys.has('s') || keys.has('arrowdown')) cam.z += pan;
  if (keys.has('a') || keys.has('arrowleft')) cam.x -= pan;
  if (keys.has('d') || keys.has('arrowright')) cam.x += pan;
  // smooth zoom that keeps the point under the cursor in place
  if (Math.abs(cam.want - cam.dist) > 0.5) {
    cam.dist += (cam.want - cam.dist) * Math.min(1, dt * 9);
    placeCamera();
    if (zoomAnchor) { const p = groundAt(zoomAnchor.x, zoomAnchor.y); if (p) { cam.x += zoomAnchor.p.x - p.x; cam.z += zoomAnchor.p.z - p.z; } }
  }
  placeCamera();
  const gameDt = dt * [0, 1, 3, 8][speed];
  acc += gameDt;
  if (acc > 1) { acc -= 1; day = new Date(day.getTime() + 86400000); $('date').textContent = `${day.getUTCDate()}/${day.getUTCMonth() + 1}/${day.getUTCFullYear()}`; if (day.getUTCDate() === 1) { const g = $('gold'); g.textContent = (parseInt(g.textContent.replace(/,/g, '')) + 135).toLocaleString('en-GB'); } }
  updateUnits(gameDt || (speed ? 0 : 0), Math.max(24, Math.min(80, cam.dist * 0.065)), t);
  // armies march only while the clock runs; ordering while paused queues the move
  map.uniforms.uTime.value = t;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();
window.__map = {cam, UNITS, select, setSpeed}; // for tests
window.__screen = i => { const v = UNITS[i].sprite.position.clone().project(camera); return {x: ((v.x + 1) / 2) * innerWidth, y: ((1 - v.y) / 2) * innerHeight - 20}; };

// ---------- start screen ----------
$('start-msg').textContent = 'Fourteenth of March, 2044. The island waits.';
$('go').disabled = false;
$('go').onclick = () => {
  startAudio();
  $('start').classList.add('gone');
  cam.want = 1750;
  setTimeout(() => say('Coalition formed'), 900);
  setSpeed(1);
};
