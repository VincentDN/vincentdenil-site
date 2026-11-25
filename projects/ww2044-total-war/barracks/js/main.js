// Barracks: pick a section, pick a soldier, swap his kit, train him up. Three posed soldiers stand in a ruined town square.
import * as T from 'three';
import { buildScene } from './scene.js';
import { loadSoldiers } from './soldiers.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
stage.append(renderer.domElement);
const { scene, env, update } = buildScene(renderer);
const camera = new T.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 400);

// ---------- data (all original placeholder content) ----------
const KITS = [
  { id: 'assault', name: 'Line Infantry', group: 'Standard issue', price: 0, sw: ['#8a8462', '#e6e2d8'] },
  { id: 'smg', name: 'Night Raiders', group: 'Standard issue', price: 0, sw: ['#4a4f58', '#33363c'] },
  { id: 'nomad', name: 'Desert Rats', group: 'Field sets', price: 900, sw: ['#b49a6c', '#7f6c50'] },
  { id: 'tempest', name: 'Gale Force', group: 'Field sets', price: 900, sw: ['#9a9a90', '#5f6060'] },
  { id: 'verdant', name: 'Green Ghost', group: 'Field sets', price: 1200, sw: ['#5f6b38', '#3f403a'] },
  { id: 'sniper', name: 'Hedgerow Ghillie', group: 'Field sets', price: 1500, sw: ['#545641', '#717550'] },
  { id: 'raptor', name: 'Raptor', group: 'Veteran sets', price: 2400, vet: 2, sw: ['#6e6a5c', '#2c2e33'] },
  { id: 'void', name: 'Nightfall', group: 'Veteran sets', price: 3000, vet: 3, sw: ['#1d1f24', '#3c4148'] },
  { id: 'gilet', name: 'Road Crew', group: 'Veteran sets', price: 600, sw: ['#d8c24a', '#4a463e'] },
];
const RANKS = ['Private', 'Private 1st Class', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Sergeant 1st Class', 'Master Sergeant', 'Sergeant Major', 'Warrant Officer'];
const SECTIONS = [
  { group: 'Infantry', name: 'Rifle Section', icon: 'i-rifle', blurb: 'The backbone of the line. Steady, cheap, and stubborn in a ditch.', men: [['Cpl. A. Rourke', 4, 0.35, 'assault'], ['Pte. T. Vale', 2, 0.8, 'assault'], ['L/Cpl. M. Osei', 3, 0.1, 'smg']] },
  { group: 'Infantry', name: 'Assault Pioneers', icon: 'i-hammer-nails', blurb: 'Breach, clear and hold. Wire cutters in one hand, a rifle in the other.', men: [['Sgt. H. Brandt', 6, 0.5, 'nomad'], ['Pte. J. Kell', 1, 0.2, 'smg'], ['Cpl. D. Ferreira', 4, 0.65, 'tempest']] },
  { group: 'Infantry', name: 'Recon Patrol', icon: 'i-spy', blurb: 'Eyes forward. Spots for the guns and slips away before the reply lands.', men: [['Cpl. R. Lind', 5, 0.4, 'sniper'], ['Pte. S. Nakamura', 3, 0.9, 'verdant'], ['L/Cpl. E. Duval', 3, 0.15, 'verdant']] },
  { group: 'Weapon teams', name: 'Heavy MG Team', icon: 'i-cannon', blurb: 'Pins anything that moves across open ground. Slow to set up.', men: [['Sgt. P. Novak', 7, 0.2, 'assault'], ['Pte. L. Brook', 2, 0.55, 'assault'], ['Pte. K. Ahn', 1, 0.05, 'assault']] },
  { group: 'Weapon teams', name: 'Mortar Team', icon: 'i-field-gun', blurb: 'Indirect fire from behind the hedge. Smoke on request.', men: [['Cpl. B. Hale', 4, 0.7, 'tempest'], ['Pte. N. Ruiz', 2, 0.3, 'tempest'], ['Pte. O. Mercer', 1, 0.6, 'nomad']] },
  { group: 'Weapon teams', name: 'Anti-tank Team', icon: 'i-missile-launcher', blurb: 'Waits for the armour to show its flank. One good shot is enough.', men: [['Sgt. W. Achterberg', 8, 0.45, 'raptor'], ['Cpl. F. Moreau', 5, 0.1, 'smg'], ['Pte. G. Ivers', 2, 0.85, 'smg']] },
];
const state = { bonds: 4250, merit: 380, owned: new Set(['assault', 'smg']), section: 0, sel: 1, preview: null };
// each section keeps its own soldiers (level, xp, kit)
const roster = SECTIONS.map((s) => s.men.map(([name, level, xp, kit]) => ({ name, level, xp, kit, stats: [0, 0, 0].map((_, i) => 40 + ((name.length * 13 + i * 29) % 30)) })));
for (const sec of roster) for (const m of sec) state.owned.add(m.kit); // kits the sections already wear are in the locker
const vetStars = (lv) => (lv >= 8 ? 3 : lv >= 5 ? 2 : lv >= 3 ? 1 : 0);

// ---------- soldiers ----------
const SLOTS = [[-1.05, -0.55, 0.32], [0, 0, 0], [1.1, -0.45, -0.28]];
const ring = new T.Mesh(new T.RingGeometry(0.44, 0.47, 48), new T.MeshBasicMaterial({ color: '#e2c98f', transparent: true, opacity: 0.55, depthWrite: false }));
ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; scene.add(ring);
const S = await loadSoldiers('data/', env);
const men = SLOTS.map(([x, z, ry], i) => { const m = S.make('assault'); m.position.set(x, 0, z); m.rotation.y = Math.PI + ry; m.userData.slot = i; m.userData.phase = i * 2.1; scene.add(m); return m; });
$('loading').hidden = true;

// ---------- camera: slow drift, drag to orbit a little ----------
const cam = { a: 0, p: 0.12, ta: 0, tp: 0.12, d: 5.6 };
function placeCamera(t) {
  cam.a += (cam.ta + Math.sin(t * 0.07) * 0.05 - cam.a) * 0.06; cam.p += (cam.tp - cam.p) * 0.06;
  const tx = innerWidth < 760 ? 0 : 0.1, d = cam.d * Math.max(1, Math.min(2.5, 1.15 / camera.aspect));
  camera.position.set(tx + Math.sin(cam.a) * d * Math.cos(cam.p), 1.0 + Math.sin(cam.p) * d, Math.cos(cam.a) * d * Math.cos(cam.p) - 0.2);
  camera.lookAt(tx, 0.95, -0.2);
  scene.fog.near = d + 0.9; scene.fog.far = d + 18; // fog starts just behind the squad, whatever the camera distance
}
const cv = renderer.domElement; let drag = null, moved = false;
cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, a: cam.ta, p: cam.tp }; moved = false; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', (e) => {
  if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    cam.ta = Math.max(-0.9, Math.min(0.9, drag.a - dx * 0.005)); cam.tp = Math.max(0.02, Math.min(0.45, drag.p + dy * 0.003)); return; }
  cv.style.cursor = pick(e) >= 0 ? 'pointer' : 'grab';
});
cv.addEventListener('pointerup', (e) => { if (!moved) { const i = pick(e); if (i >= 0) select(i); } drag = null; });
const ray = new T.Raycaster(), ndc = new T.Vector2();
function pick(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(men.map((m) => m.userData.body), false)[0];
  return hit ? men.findIndex((m) => m.userData.body === hit.object) : -1;
}

// ---------- interface ----------
const fmt = (n) => n.toLocaleString('en-GB');
const icon = (id) => `<svg><use href="../strategic-map/img/icons.svg#${id}"/></svg>`;
const chevrons = (lv) => '<span class="chev">' + '<i></i>'.repeat(Math.min(3, Math.ceil(lv / 3))) + '</span>';
const stars = (n) => '<span class="stars">' + [0, 1, 2].map((i) => `<b class="${i < n ? 'on' : ''}">★</b>`).join('') + '</span>';
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); }

function renderKits() {
  let html = '', g = '';
  const cur = roster[state.section][state.sel];
  for (const k of KITS) {
    if (k.group !== g) { g = k.group; html += `<li class="grp">${icon(g === 'Veteran sets' ? 'i-ribbon-medal' : g === 'Field sets' ? 'i-treasure-map' : 'i-helmet')}${g}</li>`; }
    const own = state.owned.has(k.id), lock = k.vet && vetStars(cur.level) < k.vet;
    html += `<li><button class="kit${cur.kit === k.id ? ' on' : ''}${state.preview === k.id ? ' pv' : ''}" data-kit="${k.id}"><span class="sw" style="background:linear-gradient(135deg,${k.sw[0]} 50%,${k.sw[1]} 50%)"></span>${k.name}`
      + (own ? (cur.kit === k.id ? '<em class="tag eq">Worn</em>' : '<em class="tag">Owned</em>') : lock ? `<em class="tag lock">Vet ${k.vet}</em>` : `<em class="tag price">${fmt(k.price)}</em>`) + '</button></li>';
  }
  $('kits').innerHTML = html;
}
function renderSections() {
  let html = '', g = '';
  SECTIONS.forEach((s, i) => {
    if (s.group !== g) { g = s.group; html += `<li class="grp">${g}</li>`; }
    const lv = Math.round(roster[i].reduce((a, m) => a + m.level, 0) / 3);
    html += `<li><button class="sec${i === state.section ? ' on' : ''}" data-sec="${i}"><span class="ic">${icon(s.icon)}</span>${s.name}<em>${stars(vetStars(lv))}</em></button></li>`;
  });
  $('sections').innerHTML = html;
}
function renderCard() {
  const s = SECTIONS[state.section], m = roster[state.section][state.sel], vs = vetStars(m.level);
  $('sec-name').textContent = s.name; $('sec-blurb').textContent = s.blurb;
  $('man-name').textContent = m.name; $('man-rank').textContent = RANKS[m.level - 1];
  $('man-lv').textContent = m.level; $('man-vet').innerHTML = stars(vs) + `<span>Veterancy ${['none', 'I', 'II', 'III'][vs]}</span>`;
  $('xp-fill').style.width = (m.level >= 10 ? 100 : m.xp * 100) + '%';
  $('xp-txt').textContent = m.level >= 10 ? 'Max rank' : `${Math.round(m.xp * 1000)} / 1,000 XP`;
  const names = ['Marksmanship', 'Morale', 'Endurance'];
  $('stats').innerHTML = m.stats.map((v, i) => { const val = Math.min(99, v + m.level * 4 + vs * 3); return `<li><span>${names[i]}</span><i><b style="width:${val}%"></b></i><em>${val}</em></li>`; }).join('');
  const k = KITS.find((x) => x.id === (state.preview || m.kit));
  $('kit-name').textContent = k.name;
  const own = state.owned.has(k.id), lock = k.vet && vs < k.vet;
  $('buy').hidden = own; $('buy').disabled = !!lock || state.bonds < k.price;
  $('buy').innerHTML = lock ? `Needs veterancy ${['', 'I', 'II', 'III'][k.vet]}` : `${icon('i-two-coins')}<b>${fmt(k.price)}</b> Buy kit`;
  $('equip').hidden = !own || m.kit === k.id;
}
function renderTop() { $('bonds').textContent = fmt(state.bonds); $('merit').textContent = fmt(state.merit); }
function renderAll() { renderSections(); renderKits(); renderCard(); renderTop(); }

function applySection() {
  roster[state.section].forEach((m, i) => men[i].setKit(m.kit));
  state.preview = null; renderAll();
}
function select(i) { if (state.preview) { men[state.sel].setKit(roster[state.section][state.sel].kit); state.preview = null; } state.sel = i; renderAll(); }

$('sections').addEventListener('click', (e) => { const b = e.target.closest('[data-sec]'); if (!b) return; state.section = +b.dataset.sec; applySection(); });
$('kits').addEventListener('click', (e) => {
  const b = e.target.closest('[data-kit]'); if (!b) return;
  const id = b.dataset.kit, m = roster[state.section][state.sel];
  if (state.owned.has(id)) { m.kit = id; state.preview = null; men[state.sel].setKit(id); }
  else { state.preview = id; men[state.sel].setKit(id); }
  renderKits(); renderCard();
});
$('buy').addEventListener('click', () => {
  const k = KITS.find((x) => x.id === state.preview); if (!k || state.bonds < k.price) return;
  state.bonds -= k.price; state.owned.add(k.id); roster[state.section][state.sel].kit = k.id; state.preview = null;
  toast(`${k.name} kit purchased`); renderAll();
});
$('equip').addEventListener('click', () => { const m = roster[state.section][state.sel]; if (state.preview) { m.kit = state.preview; state.preview = null; } renderAll(); });
$('train').addEventListener('click', () => {
  const m = roster[state.section][state.sel]; if (m.level >= 10) return toast('Already at the highest rank');
  if (state.merit < 40) return toast('Not enough merit');
  state.merit -= 40; m.xp += 0.35;
  if (m.xp >= 1) { const before = vetStars(m.level); m.xp -= 1; m.level++; toast(`${m.name} promoted to ${RANKS[m.level - 1]}`); burst(state.sel); if (vetStars(m.level) > before) setTimeout(() => toast(`Veterancy ${['', 'I', 'II', 'III'][vetStars(m.level)]} reached`), 1400); }
  renderAll();
});
$('squad-btn').addEventListener('click', () => document.body.classList.toggle('show-left'));
$('unit-btn').addEventListener('click', () => document.body.classList.toggle('show-right'));
$('credits-btn').addEventListener('click', () => $('credits').showModal());
$('credits-close').addEventListener('click', () => $('credits').close());

// nameplates over the soldiers' heads
const plates = men.map((_, i) => { const d = document.createElement('div'); d.className = 'plate'; d.addEventListener('click', () => select(i)); $('plates').append(d); return d; });
const v3 = new T.Vector3();
function placePlates() {
  men.forEach((m, i) => {
    const r = roster[state.section][i], p = plates[i];
    v3.set(m.position.x, 2.02, m.position.z).project(camera);
    p.style.transform = `translate(${(v3.x * 0.5 + 0.5) * innerWidth}px,${(-v3.y * 0.5 + 0.5) * innerHeight}px) translate(-50%,-100%)`;
    const html = `<b class="lv">${r.level}</b>${chevrons(r.level)}<span>${r.name.split(' ').slice(-1)[0]}</span>${stars(vetStars(r.level))}`;
    if (p._h !== html) { p.innerHTML = html; p._h = html; }
    p.classList.toggle('on', i === state.sel);
  });
}
// promotion burst: a few gold sparks rising around the soldier
const sparks = []; const sparkTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, '#fff'); g.addColorStop(0.3, 'rgba(255,215,122,.8)'); g.addColorStop(1, 'rgba(255,215,122,0)'); x.fillStyle = g; x.fillRect(0, 0, 32, 32); return new T.CanvasTexture(c); })();
const sparkMat = new T.SpriteMaterial({ map: sparkTex, color: '#ffd77a', transparent: true, depthWrite: false, blending: T.AdditiveBlending });
function burst(i) { for (let k = 0; k < 40; k++) { const s = new T.Sprite(sparkMat); const a = Math.random() * 6.28, r = 0.3 + Math.random() * 0.25; s.position.set(men[i].position.x + Math.cos(a) * r, Math.random() * 0.4, men[i].position.z + Math.sin(a) * r); s.scale.setScalar(0.07); s.userData = { v: 0.6 + Math.random() * 1.2, t: 0 }; scene.add(s); sparks.push(s); } }

addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') select((state.sel + 1) % 3); if (e.key === 'ArrowLeft') select((state.sel + 2) % 3); });

applySection();
const clock = new T.Clock();
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  if (!reduce) { update(dt); men.forEach((m) => { const ph = t * 1.6 + m.userData.phase; m.scale.set(1, 1 + Math.sin(ph) * 0.004, 1); m.rotation.z = Math.sin(ph * 0.31) * 0.006; }); }
  const sm = men[state.sel]; ring.position.x += (sm.position.x - ring.position.x) * 0.2; ring.position.z += (sm.position.z - ring.position.z) * 0.2;
  for (let i = sparks.length - 1; i >= 0; i--) { const s = sparks[i]; s.userData.t += dt; s.position.y += s.userData.v * dt; s.material.opacity = 1; if (s.userData.t > 1.4) { scene.remove(s); sparks.splice(i, 1); } }
  placeCamera(reduce ? 0 : t);
  renderer.render(scene, camera);
  placePlates();
});
