// Adapted from /projects/3d/viewer/: Three.js, OrbitControls and responsive renderer.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// background: quiet grey code lines that type themselves in and drift upward
// ---------------------------------------------------------------------------
const MANTRA = [
  'PNP NEVER DIES LAURENCE, IT DOES NOT DIE, IT CANNOT DIE',
  '// PNP never dies, Laurence. It does not die. It cannot die.',
  'assert(pnp.alive === true);   // PNP NEVER DIES, LAURENCE',
  'while (true) { pnp.live(); }  // it does not die, it cannot die',
  'if (pnp.dies()) throw new Impossible("IT CANNOT DIE, LAURENCE");',
  'const PNP = Object.freeze({ dies: false, canDie: false });  // Laurence.',
  'pnp.kill();  // Error: PNP NEVER DIES. IT DOES NOT DIE. IT CANNOT DIE.',
  '# laurence: pnp never dies / it does not die / it cannot die',
  'SELECT status FROM pnp WHERE dead = 1;  -- 0 rows, Laurence. It cannot die.',
  'try { pnp.die(); } catch (e) { log("IT DOES NOT DIE"); } finally { log("IT CANNOT DIE"); }',
  'return pnp.neverDies(laurence) && !pnp.doesDie() && !pnp.canDie();',
  'LAURENCE: PNP NEVER DIES. IT. DOES. NOT. DIE. IT CANNOT DIE.',
];
const FILLER = [
  'function attach(socket, mesh) {', '  const bone = rig.find(socket);', '  if (!bone) return null;', '}',
  'for (let i = 0; i < links.length; i++) {', '  links[i].advance(dt * speed);', '}', 'export default turntable;',
  'let yaw = 0, pitch = 0.12;', 'yaw += dt * 0.35;', 'camera.lookAt(target);', 'renderer.render(scene, camera);',
  'const helm = load("stahlhelm_m44");', 'drone.fold(); pack.stow(drone);', 'radio.tune(41.250);', 'nvg.down();',
  'if (ammo.count === 0) reload();', 'rifle.attach("fg42m", hand_r);', 'squad.push(jaeger);', '// 0x2044',
  'uniform float uTime;', 'vec3 n = normalize(vNormal);', 'gl_FragColor = vec4(col, 1.0);', 'struct Bone { mat4 bind; int parent; };',
  'def unwrap(mesh): return pack(islands(mesh))', 'git commit -m "it lives"', 'make all && make deploy', 'ok',
];
const code = document.getElementById('code');
const ctx = code.getContext('2d');
let cw = 0, ch = 0, lineH = 18, rows = [], scroll = 0, since = 0;
const pick = a => a[Math.floor(Math.random() * a.length)];
function newRow(forceMantra) {
  const mantra = forceMantra || since >= 4 + Math.floor(Math.random() * 3);
  since = mantra ? 0 : since + 1;
  const text = mantra ? pick(MANTRA) : pick(FILLER);
  return {text, mantra, x: 16 + Math.floor(Math.random() * 6) * 22 + (mantra ? 0 : Math.floor(Math.random() * 3) * 180), typed: reduce ? text.length : 0};
}
function sizeCode() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cw = innerWidth; ch = innerHeight;
  code.width = Math.round(cw * dpr); code.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  lineH = cw < 640 ? 16 : 19;
  const n = Math.ceil(ch / lineH) + 2;
  rows = [];
  for (let i = 0; i < n; i++) { const r = newRow(i % 6 === 2); r.typed = r.text.length; rows.push(r); }
  drawCode(0);
}
function drawCode(dt) {
  if (!reduce) {
    scroll += dt * 14;
    while (scroll >= lineH) { scroll -= lineH; rows.shift(); rows.push(newRow(false)); }
    for (const r of rows) if (r.typed < r.text.length) r.typed = Math.min(r.text.length, r.typed + dt * 46);
  }
  ctx.clearRect(0, 0, cw, ch);
  ctx.font = (cw < 640 ? 11 : 13) + 'px ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace';
  ctx.textBaseline = 'top';
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i], y = i * lineH - scroll;
    ctx.fillStyle = r.mantra ? 'rgba(190,196,202,0.30)' : 'rgba(150,158,166,0.13)';
    ctx.fillText(r.text.slice(0, Math.floor(r.typed)), r.x, y);
  }
}
addEventListener('resize', sizeCode);
sizeCode();

// ---------------------------------------------------------------------------
// sound: browsers only allow audio after a click, so it starts from the button
// ---------------------------------------------------------------------------
const track = document.getElementById('track');
const soundBtn = document.getElementById('sound');
track.volume = 0.6;
track.addEventListener('error', () => {
  soundBtn.disabled = true;
  soundBtn.textContent = 'Sound unavailable';
  soundBtn.setAttribute('aria-pressed', 'false');
});
soundBtn.onclick = async () => {
  if (track.paused) {
    try { await track.play(); soundBtn.textContent = 'Sound on'; soundBtn.setAttribute('aria-pressed', 'true'); }
    catch (e) { soundBtn.textContent = 'Sound unavailable'; soundBtn.disabled = true; }
  } else { track.pause(); soundBtn.textContent = 'Sound off'; soundBtn.setAttribute('aria-pressed', 'false'); }
};

// ---------------------------------------------------------------------------
// turntable
// ---------------------------------------------------------------------------
const stage = document.getElementById('stage'), status = document.getElementById('status');
let spin = !reduce, renderer = null, scene, camera, controls, pivot = null;
const spinBtn = document.getElementById('spin');
const setSpin = on => { spin = on; spinBtn.textContent = on ? 'Turntable on' : 'Turntable off'; spinBtn.setAttribute('aria-pressed', String(on)); };
setSpin(spin);
spinBtn.onclick = () => setSpin(!spin);
try {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  stage.append(renderer.domElement);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  const key = new THREE.DirectionalLight(0xfff0e0, 2.8);
  key.position.set(3, 5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, {left: -2, right: 2, top: 2.5, bottom: -1, near: 1, far: 15});
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xc8372d, 1.6);
  rim.position.set(-4, 2.5, -4);
  scene.add(key, rim, new THREE.HemisphereLight(0xd8e0ea, 0x1a1d20, 0.6));
  const floor = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.ShadowMaterial({opacity: 0.45}));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false;
  controls.minDistance = 1.2; controls.maxDistance = 9; controls.maxPolarAngle = Math.PI * 0.52;
  controls.target.set(0, 0.98, 0);
  const fit = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.aspect = w / h; camera.fov = w < h ? 44 : 32; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  camera.position.set(0.9, 1.35, 4.6);
  new ResizeObserver(fit).observe(stage); fit(); controls.update();
  new GLTFLoader().load('./fallschirmjaeger.glb', g => {
    g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    pivot = new THREE.Group(); pivot.add(g.scene); scene.add(pivot);
    status.hidden = true;
  }, e => { if (e.total) status.textContent = 'Loading model… ' + Math.round(100 * e.loaded / e.total) + '%'; },
  err => { console.error(err); status.textContent = 'The 3D model could not load. Please reload.'; });
} catch (error) {
  console.error(error);
  status.textContent = 'WebGL is unavailable in this browser.';
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  drawCode(dt);
  if (renderer) {
    if (pivot && spin) pivot.rotation.y += dt * 0.45;
    controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
