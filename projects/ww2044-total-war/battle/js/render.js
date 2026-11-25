// three.js view of the sim. Ground, ruins and houses use the CC0 Claudov textures in ../tex/ (credits.json there);
// soldiers are the baked Claudov soldiers from ../barracks/data/, vehicles the WW2044 glb models from ../strategic-map/models/.
// The view never writes to the sim: it reads positions each frame and eases meshes toward them.
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadSoldiers} from '../../barracks/js/soldiers.js';

const SIDE = [new T.Color('#8fd16a'), new T.Color('#e0583c')], NEUTRAL = new T.Color('#d8d0bc');
const KITS = [{rifle: ['assault', 'smg'], pioneer: ['nomad', 'tempest'], recon: ['sniper', 'verdant'], mg: ['assault']}, {rifle: ['void', 'raptor'], pioneer: ['raptor'], recon: ['void'], mg: ['void']}];
const VEH = {halftrack: ['sdkfz251', 6.2], tank: ['sherman-m4', 6.4]};

export async function createView(canvas, world) {
  const renderer = new T.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new T.Scene(), tl = new T.TextureLoader(), base = new URL('../tex/', import.meta.url).href;
  const sky = tl.load(base + 'sky.webp'); sky.mapping = T.EquirectangularReflectionMapping; sky.colorSpace = T.SRGBColorSpace;
  scene.background = sky; scene.environment = sky; scene.environmentIntensity = 0.55; scene.fog = new T.Fog('#b7bcb6', 160, 420);
  scene.add(new T.HemisphereLight('#dfe6ea', '#4a4636', 0.9));
  const sun = new T.DirectionalLight('#fff1dc', 2.4); sun.position.set(-90, 140, 60); sun.castShadow = true;
  Object.assign(sun.shadow.camera, {left: -170, right: 170, top: 170, bottom: -170, near: 10, far: 400}); sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006;
  scene.add(sun);

  const tex = (name, rep, srgb = true) => { const t = tl.load(`${base}${name}/map.webp`); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; if (srgb) t.colorSpace = T.SRGBColorSpace; return t; };
  const nrm = (name, rep) => tex(name, rep, false);
  const mat = (name, rep, extra = {}) => { const m = new T.MeshStandardMaterial({map: tex(name, rep), roughness: 0.95, ...extra}); const nt = tl.load(`${base}${name}/normal.webp`); nt.wrapS = nt.wrapT = T.RepeatWrapping; nt.repeat.set(rep[0], rep[1]); m.normalMap = nt; return m; };

  // ground, roads, dirt pads under the points
  const [W] = world.map.size;
  const ground = new T.Mesh(new T.PlaneGeometry(W * 1.6, W * 1.6), mat('lawn', [44, 44], {color: '#b8b49a'})); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const road = mat('cobble', [1, 1], {color: '#b0a898', polygonOffset: true, polygonOffsetFactor: -1});
  for (const [[ax, az], [bx, bz]] of world.map.roads) {
    const len = Math.hypot(bx - ax, bz - az), m = new T.Mesh(new T.PlaneGeometry(7, len), road.clone());
    m.material.map = tex('cobble', [1.5, len / 5]); m.position.set((ax + bx) / 2, 0.02, (az + bz) / 2); m.rotation.set(-Math.PI / 2, 0, Math.atan2(bx - ax, bz - az)); m.receiveShadow = true; scene.add(m);
  }
  const dirt = mat('dirt', [3, 3], {transparent: true, polygonOffset: true, polygonOffsetFactor: -2});
  dirt.alphaMap = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 20, 64, 64, 64); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
  for (const p of world.points) { const d = new T.Mesh(new T.CircleGeometry(world.map.captureRadius * 1.6, 40), dirt); d.rotation.x = -Math.PI / 2; d.position.set(p.x, 0.03, p.z); d.receiveShadow = true; scene.add(d); }

  // ruins, houses, hedges, sandbags
  const brick = mat('brick', [2, 1]), plaster = mat('plaster', [2, 1], {color: '#c9c0ae'}), roof = mat('rooftiles', [3, 2]), burlap = mat('burlap', [2, 1]), hedgeM = mat('lawn', [4, 1], {color: '#55683e'}), timber = mat('timber', [2, 1]);
  const box = (w, h, d, m, x, y, z, ry = 0) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = o.receiveShadow = true; scene.add(o); return o; };
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const b of world.map.blocks) {
    const [x, z] = b.at, [w, d] = b.size;
    if (b.kind === 'ruin') { // four broken brick walls with rubble
      const t = 0.5;
      for (const [wx, wz, ww, wd] of [[x, z - d / 2, w, t], [x, z + d / 2, w, t], [x - w / 2, z, t, d], [x + w / 2, z, t, d]]) {
        const segs = 3; for (let i = 0; i < segs; i++) { if (rnd() < 0.25) continue; const h = 1.2 + rnd() * 3.5, f = (i + 0.5) / segs - 0.5; box(ww > t ? ww / segs : t, h, wd > t ? wd / segs : t, brick, wx + (ww > t ? f * ww : 0), h / 2, wz + (wd > t ? f * wd : 0)); }
      }
      for (let i = 0; i < 6; i++) box(0.6 + rnd() * 1.2, 0.3 + rnd() * 0.5, 0.6 + rnd(), brick, x + (rnd() - 0.5) * w, 0.2, z + (rnd() - 0.5) * d, rnd() * 3);
    } else if (b.kind === 'house') {
      box(w, 4.2, d, plaster, x, 2.1, z);
      const r = new T.Mesh(new T.ConeGeometry(Math.hypot(w, d) / 2 * 1.02, 3, 4, 1), roof); r.position.set(x, 5.7, z); r.rotation.y = Math.PI / 4; r.scale.set(w / Math.hypot(w, d) * 1.41, 1, d / Math.hypot(w, d) * 1.41); r.castShadow = true; scene.add(r);
    } else if (b.kind === 'hedge') box(w, 1.5, d, hedgeM, x, 0.75, z);
    else if (b.kind === 'sandbags') { const n = Math.max(2, Math.round(Math.max(w, d) / 0.9)); for (let i = 0; i < n; i++) for (let row = 0; row < 2; row++) { const f = (i + 0.5 + row * 0.5) / n - 0.5; if (row && i === n - 1) continue; box(w > d ? 0.85 : 0.45, 0.32, w > d ? 0.45 : 0.85, burlap, x + (w > d ? f * w : 0), 0.16 + row * 0.3, z + (w > d ? 0 : f * d)); } }
  }

  // camera
  const camera = new T.PerspectiveCamera(42, 1, 1, 900);
  const cam = {x: world.map.spawns[0].at[0], z: world.map.spawns[0].at[1] - 30, d: 60, yaw: 0, pitch: 0.82};
  const placeCam = () => { const h = Math.sin(cam.pitch) * cam.d, r = Math.cos(cam.pitch) * cam.d; camera.position.set(cam.x + Math.sin(cam.yaw) * r, h, cam.z + Math.cos(cam.yaw) * r); camera.lookAt(cam.x, 0, cam.z); };
  function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();

  // models
  const soldiers = await loadSoldiers(new URL('../../barracks/data/', import.meta.url).href, sky);
  const probe = soldiers.make('assault'), sb = new T.Box3().setFromObject(probe), sk = 1.8 / (sb.max.y - sb.min.y);
  const gl = new GLTFLoader(), vmodels = {};
  await Promise.all(Object.entries(VEH).map(async ([k, [file, len]]) => {
    const g = await gl.loadAsync(new URL(`../../strategic-map/models/${file}.glb`, import.meta.url).href), root = g.scene, bb = new T.Box3().setFromObject(root), sz = bb.getSize(new T.Vector3());
    root.scale.setScalar(len / Math.max(sz.x, sz.z)); root.position.y = -bb.min.y * root.scale.y; root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const wrap = new T.Group(); wrap.add(root); wrap.userData.alongX = sz.x > sz.z; if (wrap.userData.alongX) root.rotation.y = Math.PI / 2; vmodels[k] = wrap;
  }));
  const blob = new T.MeshBasicMaterial({color: 0, transparent: true, opacity: 0.35, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3});
  const blobGeo = new T.CircleGeometry(0.45, 12).rotateX(-Math.PI / 2);
  const ringGeo = new T.RingGeometry(3.6, 4.1, 40).rotateX(-Math.PI / 2);
  const ringMats = SIDE.map((c) => new T.MeshBasicMaterial({color: c, transparent: true, opacity: 0.85, depthWrite: false}));

  function makeMan(s, i) {
    if (s.vehicle) { const o = vmodels[s.type].clone(); if (s.side) o.traverse((m) => { if (m.isMesh) { m.material = m.material.clone(); m.material.color.multiplyScalar(0.55); } }); return o; }
    const kits = KITS[s.side][s.type] || KITS[s.side].rifle, o = soldiers.make(kits[i % kits.length]);
    o.scale.setScalar(sk); o.children.forEach((c) => { c.castShadow = false; });
    const b = new T.Mesh(blobGeo, blob); b.scale.setScalar(1 / sk); b.position.y = 0.04 / sk; o.add(b); return o;
  }

  // buildings of the two sides (procedural, original)
  function makeBuilding(b) {
    const g = new T.Group(), add = (m) => { m.castShadow = m.receiveShadow = true; g.add(m); return m; }, B = (w, h, d, m, x = 0, y = h / 2, z = 0) => { const o = add(new T.Mesh(new T.BoxGeometry(w, h, d), m)); o.position.set(x, y, z); return o; };
    const [sx, sz] = world.data.buildings[b.type].size.map((v) => v * 2);
    if (b.type === 'command-post') { B(sx, 2.6, sz, timber); B(sx + 1, 0.4, sz + 1, roof, 0, 2.8); for (const k of [-1, 1]) B(sx * 0.9, 0.7, 0.5, burlap, 0, 0.35, k * (sz / 2 + 1)); B(0.12, 9, 0.12, timber, sx / 2 - 0.5, 4.5, sz / 2 - 0.5); const f = add(new T.Mesh(new T.PlaneGeometry(2.2, 1.4), new T.MeshStandardMaterial({color: SIDE[b.side], side: T.DoubleSide}))); f.position.set(sx / 2 + 0.6, 8.2, sz / 2 - 0.5); }
    else if (b.type === 'signal-mast') { for (let i = 0; i < 4; i++) B(0.15, 12, 0.15, timber, (i & 1 ? 1 : -1) * 0.6, 6, (i & 2 ? 1 : -1) * 0.6); B(2, 0.2, 0.2, timber, 0, 11.5); B(sx * 0.8, 0.9, sz * 0.8, burlap, 0, 0.45); }
    else { const h = b.type === 'armour-shed' ? 5.5 : b.type === 'motor-pool' ? 4.5 : 3.2; B(sx, h, sz, b.type === 'rifle-depot' ? burlap : timber); const r = B(sx + 0.8, 0.35, sz + 0.8, roof, 0, h + 0.2); r.rotation.z = 0.05; }
    g.position.set(b.x, 0, b.z); if (b.side) g.rotation.y = Math.PI; scene.add(g); return g;
  }

  // capture points: pole, flag and ground ring coloured by owner
  const pointViews = world.points.map((p) => {
    const g = new T.Group(); g.position.set(p.x, 0, p.z);
    const pole = new T.Mesh(new T.CylinderGeometry(0.08, 0.1, 7), new T.MeshStandardMaterial({color: '#3a3a36', metalness: 0.6, roughness: 0.4})); pole.position.y = 3.5; pole.castShadow = true;
    const flag = new T.Mesh(new T.PlaneGeometry(1.8, 1.1), new T.MeshStandardMaterial({color: NEUTRAL, side: T.DoubleSide})); flag.position.set(0.95, 6.3, 0);
    const ring = new T.Mesh(new T.RingGeometry(world.map.captureRadius - 0.4, world.map.captureRadius, 64).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({color: NEUTRAL, transparent: true, opacity: 0.7, depthWrite: false})); ring.position.y = 0.06;
    const prog = new T.Mesh(new T.RingGeometry(world.map.captureRadius + 0.2, world.map.captureRadius + 1, 64, 1, 0, 0.001).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({color: '#fff', transparent: true, opacity: 0.9, depthWrite: false})); prog.position.y = 0.07;
    g.add(pole, flag, ring, prog); scene.add(g); return {p, flag, ring, prog, lastCap: null};
  });

  // tracers and puffs
  const MAXT = 400, tpos = new Float32Array(MAXT * 6), tcol = new Float32Array(MAXT * 6), tlife = new Float32Array(MAXT); let tn = 0;
  const tgeo = new T.BufferGeometry(); tgeo.setAttribute('position', new T.BufferAttribute(tpos, 3)); tgeo.setAttribute('color', new T.BufferAttribute(tcol, 3));
  const tracers = new T.LineSegments(tgeo, new T.LineBasicMaterial({vertexColors: true, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false})); tracers.frustumCulled = false; scene.add(tracers);
  const puffTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(220,215,205,.8)'); gr.addColorStop(1, 'rgba(220,215,205,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })();
  const puffs = [];
  const puff = (x, z, size, color = '#d8d2c4', life = 2.5) => { const s = new T.Sprite(new T.SpriteMaterial({map: puffTex, color, transparent: true, depthWrite: false})); s.position.set(x, size * 0.4, z); s.scale.setScalar(size); scene.add(s); puffs.push({s, life, max: life, grow: size * 0.6}); };

  const views = new Map(), bviews = new Map(), wrecks = [];
  const moveMarker = new T.Mesh(new T.RingGeometry(0.8, 1.2, 24).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({color: '#e2c98f', transparent: true, depthWrite: false})); moveMarker.visible = false; scene.add(moveMarker);
  let markerT = 0;
  const v3 = new T.Vector3();

  function draw(dt, selected) {
    // squads and men
    const seen = new Set();
    for (const s of world.squads) {
      let v = views.get(s.id);
      if (!v) { v = {men: new Map(), ring: new T.Mesh(ringGeo, ringMats[s.side])}; v.ring.visible = false; scene.add(v.ring); views.set(s.id, v); }
      seen.add(s.id);
      const live = new Set();
      s.men.forEach((m, i) => {
        let o = v.men.get(m); if (!o) { o = makeMan(s, i); o.position.set(m.x, 0, m.z); scene.add(o); v.men.set(m, o); }
        live.add(m);
        const k = 1 - Math.exp(-dt * 12); o.position.x += (m.x - o.position.x) * k; o.position.z += (m.z - o.position.z) * k;
        const yaw = (s.vehicle ? s.heading : m.face ?? s.heading); o.rotation.y += (((yaw - o.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * k;
        if (!s.vehicle) o.position.y = s.moving ? Math.abs(Math.sin(performance.now() / 160 + i)) * 0.06 : 0;
      });
      for (const [m, o] of v.men) if (!live.has(m)) { if (s.vehicle) wreck(o); else scene.remove(o); v.men.delete(m); }
      v.ring.visible = selected.has(s.id); if (v.ring.visible) { v.ring.position.set(s.x, 0.08, s.z); v.ring.scale.setScalar(s.vehicle ? 1.1 : 1); }
    }
    for (const [id, v] of views) if (!seen.has(id)) { for (const o of v.men.values()) scene.remove(o); scene.remove(v.ring); views.delete(id); }
    // buildings
    const bseen = new Set();
    for (const b of world.buildings) { let g = bviews.get(b.id); if (!g) { g = makeBuilding(b); bviews.set(b.id, g); } bseen.add(b.id); g.scale.y = 0.15 + 0.85 * b.done; }
    for (const [id, g] of bviews) if (!bseen.has(id)) { wreck(g); bviews.delete(id); }
    // points
    for (const pv of pointViews) {
      const p = pv.p, c = p.owner === null ? NEUTRAL : SIDE[p.owner];
      pv.flag.material.color.copy(c); pv.ring.material.color.copy(c); pv.ring.material.opacity = p.owner !== null && !p.linked[p.owner] ? 0.3 : 0.75;
      pv.flag.position.y = 2 + 4.3 * Math.abs(p.cap); pv.flag.rotation.y = Math.sin(performance.now() / 700 + p.x) * 0.3;
      if (pv.lastCap !== p.cap) { pv.lastCap = p.cap; pv.prog.geometry.dispose(); pv.prog.geometry = new T.RingGeometry(world.map.captureRadius + 0.2, world.map.captureRadius + 1, 64, 1, Math.PI / 2, Math.max(0.001, Math.abs(p.cap) * Math.PI * 2)).rotateX(-Math.PI / 2); pv.prog.material.color.copy(p.cap > 0 ? SIDE[0] : SIDE[1]); }
    }
    // tracers fade
    for (let i = 0; i < MAXT; i++) if (tlife[i] > 0) { tlife[i] -= dt; if (tlife[i] <= 0) for (let j = 0; j < 6; j++) tpos[i * 6 + j] = 0; }
    tgeo.attributes.position.needsUpdate = true; tgeo.attributes.color.needsUpdate = true;
    for (let i = puffs.length - 1; i >= 0; i--) { const p = puffs[i]; p.life -= dt; p.s.material.opacity = Math.max(0, p.life / p.max) * 0.8; p.s.scale.addScalar(p.grow * dt); p.s.position.y += dt * 0.6; if (p.life <= 0) { scene.remove(p.s); p.s.material.dispose(); puffs.splice(i, 1); } }
    if (moveMarker.visible) { markerT -= dt; moveMarker.scale.setScalar(1 + (0.6 - markerT) * 2); moveMarker.material.opacity = markerT / 0.6; if (markerT <= 0) moveMarker.visible = false; }
    placeCam(); renderer.render(scene, camera);
  }
  function wreck(o) { o.traverse((m) => { if (m.isMesh) { m.material = m.material.clone(); m.material.color?.multiplyScalar(0.25); } }); wrecks.push(o); puff(o.position.x, o.position.z, 8, '#5a5650', 6); }

  function onEvents(events) {
    for (const e of events) {
      if (e.kind === 'shot') {
        if (Math.random() > (e.w === 'hmg' || e.w === 'mg' ? 0.4 : 0.9) && e.w !== 'tank-gun') continue;
        const i = tn = (tn + 1) % MAXT, big = e.w === 'tank-gun', miss = e.hit ? 0 : 1.5;
        tpos.set([e.from.x, big ? 2.2 : 1.3, e.from.z, e.to.x + (Math.random() - 0.5) * miss * 2, e.hit ? 1 : 0.2, e.to.z + (Math.random() - 0.5) * miss * 2], i * 6);
        const c = big ? [1, 0.75, 0.4] : [1, 0.85, 0.5]; tcol.set([...c, ...c.map((x) => x * 0.3)], i * 6); tlife[i] = big ? 0.15 : 0.06;
        if (big) { puff(e.from.x, e.from.z, 3, '#cfc8b8', 1.5); puff(e.to.x, e.to.z, 4, '#7a6a55', 2.5); }
      } else if (e.kind === 'death' && e.vehicle) puff(e.at.x, e.at.z, 7, '#3a3632', 5);
    }
  }
  function marker(x, z) { moveMarker.position.set(x, 0.1, z); moveMarker.visible = true; markerT = 0.6; }

  /** Ground point under a screen position. */
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  function pick(cx, cy) { ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); const t = -ray.ray.origin.y / ray.ray.direction.y; return t > 0 ? {x: ray.ray.origin.x + ray.ray.direction.x * t, z: ray.ray.origin.z + ray.ray.direction.z * t} : null; }
  /** Screen position of a world point, or null behind the camera. */
  function project(x, y, z) { v3.set(x, y, z).project(camera); return v3.z > 1 ? null : {x: (v3.x + 1) / 2 * innerWidth, y: (1 - v3.y) / 2 * innerHeight}; }
  return {draw, onEvents, pick, project, marker, cam, renderer};
}
