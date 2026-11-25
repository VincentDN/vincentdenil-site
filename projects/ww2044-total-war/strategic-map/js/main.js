// The strategic map: camera (pan, zoom toward the cursor), selection (click, shift-click, shift-drag box), move orders
// (right-click), the province tooltip, the clock and the interface wiring.
import * as T from 'three';
import {WORLD, PROVINCES, NATIONS, loadWorld, provinceAt, nationAt} from './world.js';
import {buildMap} from './map.js';
import {buildOverlay} from './overlay.js';
import {UNITS, PLAYER, buildUnits, setSelected, order, updateUnits, pickables} from './units.js';
import {startAudio, toggle, sfx, setMarching, acknowledge, loadMusic} from './audio.js';
import {loadSave, writeSave, newCampaign, engage, slug} from '../../battle/js/save.js';
import {lonlat} from './world.js';

const $ = id => document.getElementById(id);
const stage = $('stage');
const renderer = new T.WebGLRenderer({antialias: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
stage.append(renderer.domElement);
const scene = new T.Scene();
scene.background = new T.Color('#0c0e0e');
const camera = new T.PerspectiveCamera(32, innerWidth / innerHeight, 10, 20000);
const cam = {x: -20, z: 30, dist: 2000, want: 1500};

const grid = await loadWorld();
const overlay = await buildOverlay(grid);
overlay.flipY = false;
const map = buildMap(scene, grid, overlay);
overlay.anisotropy = renderer.capabilities.getMaxAnisotropy();
// campaign save: armies keep the strength, morale, veterancy and position the battles left them with
const save = loadSave();
if (save) for (const u of UNITS) { const a = save.armies[slug(u.name)]; if (a) { Object.assign(u, {str: a.str, mor: a.mor, vet: a.vet}); if (a.pos) [u.x, u.z] = a.pos; } }
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
  const hit = ray.intersectObjects(pickables(), true).find(h => h.object.userData.unit);
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
  showEngage();
  const u = list[0];
  $('card-img').src = u.img;
  if (list.length === 1) {
    $('card-name').textContent = u.name;
    $('card-sub').textContent = `${u.kindName} · ${NATIONS[u.nation].name}`;
    $('card-rows').innerHTML = row('Strength', u.str.toLocaleString('en-GB')) + row('Morale', u.mor + '%') + row('Veterancy', '★'.repeat(u.vet) + '☆'.repeat(3 - u.vet)) + row('Province', PROVINCES[provinceAt(u.x, u.z)]?.name ?? 'At sea');
  } else {
    $('card-name').textContent = `${list.length} armies selected`;
    $('card-sub').textContent = [...new Set(list.map(v => NATIONS[v.nation].name))].join(', ');
    $('card-rows').innerHTML = row('Strength', list.reduce((s, v) => s + v.str, 0).toLocaleString('en-GB')) + row('Morale', Math.round(list.reduce((s, v) => s + v.mor, 0) / list.length) + '%');
  }
}
const row = (k, v) => `<dt>${k}</dt><dd>${v}</dd>`;
// Engage: an own army may attack the nearest enemy army within reach (about 1.5 degrees of longitude)
const REACH = Math.abs(lonlat(21.5, 52)[0] - lonlat(20, 52)[0]);
function target(u) { let best = null, bd = REACH; for (const v of UNITS) if (v.nation !== u.nation && !(u.nation !== PLAYER && v.nation !== PLAYER)) { const d = Math.hypot(v.x - u.x, v.z - u.z); if (d < bd) { bd = d; best = v; } } return best; }
function showEngage() {
  const list = [...selected], btn = $('engage'), u = list[0];
  btn.hidden = !(list.length === 1 && u.nation === PLAYER);
  if (btn.hidden) return;
  const t = target(u); btn.disabled = !t; btn.dataset.t = t ? UNITS.indexOf(t) : '';
  btn.textContent = t ? `Engage ${t.name}` : 'No enemy army in reach';
}
$('engage').onclick = () => {
  const u = [...selected][0], t = UNITS[+$('engage').dataset.t]; if (!u || !t) return;
  const s = loadSave() || newCampaign(UNITS);
  for (const v of UNITS) { const a = s.armies[slug(v.name)]; if (a) a.pos = [v.x, v.z]; }
  location.href = engage(s, slug(u.name), slug(t.name), PROVINCES[provinceAt(t.x, t.z)]?.name ?? 'the frontier');
};

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
      acknowledge();
    } else if (selected.size) say('ONLY YOUR OWN ARMIES TAKE ORDERS STOP');
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
    const inBox = UNITS.filter(u => { const v = u.obj.position.clone().project(camera), sx = ((v.x + 1) / 2) * innerWidth, sy = ((1 - v.y) / 2) * innerHeight; return sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1; });
    select(inBox, true);
    $('box').hidden = true;
  } else if (!drag.moved) {
    const u = unitAt(e.clientX, e.clientY);
    if (u) select(selected.has(u) && e.shiftKey ? [] : [u], e.shiftKey);
    else {
      select([]);
      const p = groundAt(e.clientX, e.clientY);
      map.uniforms.uSel.value = p ? provinceAt(p.x, p.z) : -1;
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
    const i = provinceAt(p.x, p.z), land = i >= 0;
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
let speed = 0, lastSpeed = 1, day = new Date(Date.UTC(1936, 0, 1)), acc = 0;
function setSpeed(s) {
  if (s) lastSpeed = s;
  speed = s;
  $('state').textContent = s ? ['', 'Run ×1', 'Run ×3', 'Run ×8'][s] : 'Paused';
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
function say(text) {
  const t = $('toast'), span = t.querySelector('span');
  t.classList.remove('hide'); clearTimeout(toastT); clearInterval(typeT);
  let n = 0; span.textContent = '';
  typeT = setInterval(() => { span.textContent = text.slice(0, ++n); if (n % 2) sfx('type'); if (n >= text.length) { clearInterval(typeT); toastT = setTimeout(() => t.classList.add('hide'), 4500); } }, 28);
}
let typeT;
const GRID = ['capitol', 'dove', 'person', 'factory', 'money-stack', 'spy', 'helmet', 'shield', 'field-gun', 'medal', 'radar-dish', 'two-coins', 'book-cover', 'tank', 'gears', 'flag-objective', 'rifle', 'factory', 'wheat', 'oil-drum', 'ship-wheel', 'anchor', 'globe', 'compass', 'jet-fighter', 'rocket', 'radio-tower', 'walkie-talkie', 'satellite-communication', 'missile-launcher', 'bulldozer', 'barbed-wire'];
$('grid').innerHTML = GRID.map(n => `<button class="rb" title="${n.replace(/-/g, ' ')}"><svg><use href="img/icons.svg#i-${n}"/></svg></button>`).join('');
document.querySelectorAll('.topbar .rb:not(#music):not(#amb), .emblem, .sub-left .rb, .actions .rb').forEach(b => b.addEventListener('click', () => { sfx('click'); say(`${b.title.toUpperCase()} NOT IN THIS SLICE YET STOP`); }));
setSpeed(0);

// projector grain: four pre-made noise tiles, swapped and shifted a dozen times a second
const tiles = [0, 1, 2, 3].map(() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), im = g.createImageData(256, 256); for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); return `url(${c.toDataURL()})`; });
const grain = $('grain');
setInterval(() => { grain.style.backgroundImage = tiles[(Math.random() * 4) | 0]; grain.style.backgroundPosition = `${(Math.random() * 256) | 0}px ${(Math.random() * 256) | 0}px`; }, 80);

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
  if (acc > 1) { acc -= 1; day = new Date(day.getTime() + 86400000); $('date').textContent = `${day.getUTCDate()} ${'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'.split(' ')[day.getUTCMonth()]} ${day.getUTCFullYear()}`; if (day.getUTCDate() === 1) { const g = $('gold'); g.textContent = (parseInt(g.textContent.replace(/,/g, '')) + 135).toLocaleString('en-GB'); } }
  setMarching(updateUnits(gameDt, Math.max(1.3, Math.min(3, cam.dist / 650)), t));
  // armies march only while the clock runs; ordering while paused queues the move
  map.uniforms.uTime.value = t;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();
window.__map = {cam, UNITS, select, setSpeed, map, scene, renderer, camera, overlay: parts => buildOverlay(grid, parts)}; // for tests and tools/export-psd-layers.cjs
window.__nat = nationAt;
window.__screen = i => { const v = UNITS[i].obj.position.clone().project(camera); return {x: ((v.x + 1) / 2) * innerWidth, y: ((1 - v.y) / 2) * innerHeight - 20}; };

// ---------- start screen ----------
loadMusic();
$('start-msg').textContent = 'First of January, 1936. With 2039 technology, can you defeat the USSR and Germany?';
$('go').disabled = false;
$('go').onclick = () => {
  startAudio();
  $('start').classList.add('gone');
  cam.want = 1750;
  const last = save?.history?.at(-1);
  if (last && !last.reported) { last.reported = true; writeSave(save); setTimeout(() => say(last.winner === PLAYER ? 'FIELD REPORT STOP THE TOWN IS HELD STOP VETERANS PROMOTED STOP' : 'FIELD REPORT STOP OUR ARMY FELL BACK STOP LOSSES HEAVY STOP'), 900); return void setSpeed(1); }
  setTimeout(() => say('POLAND IS NOT YET LOST STOP 2039 PATTERN ARMOUR ISSUED TO ALL ARMIES STOP REICH AND SOVIETS MASSING ON BOTH FRONTIERS STOP'), 900);
  setSpeed(1);
};
