import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const stage = document.querySelector('#stage');
const status = document.querySelector('#status');

const COLORS = {
  navy: '#112b5b',
  navyDark: '#0a1c3d',
  hoist: '#173a79',
  hoistDark: '#0d2350',
  tan: '#ecb97b',
  goldA: '#caa03c',
  goldB: '#e6c366',
  goldC: '#a9812c',
  bronze: 0x8a7346,
  bronzeDark: 0x2a2118,
  wood: '#6b4a30',
  woodDark: '#4a3220'
};

// ---- flag dimensions (meters) ----
const flagHeight = 1.0;
const hoistW = 0.15;
const canvasW = 1.45;
const totalW = hoistW + canvasW;
const thickness = 0.006;
const halfW = totalW / 2;
const halfH = flagHeight / 2;
const hoistCenterX = -halfW + hoistW / 2;
const canvasCenterX = -halfW + hoistW + canvasW / 2;

function makeCanvasTexture(pxW, pxH, draw) {
  const c = document.createElement('canvas');
  c.width = pxW; c.height = pxH;
  const ctx = c.getContext('2d');
  draw(ctx, pxW, pxH);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function drawEmblem(ctx, cx, cy, size, stroke, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = stroke;
  ctx.lineJoin = 'miter';
  const r = size / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.stroke();
  const s = (size * 0.78) / 2;
  ctx.strokeRect(cx - s, cy - s, s * 2, s * 2);
  const cr = size * 0.34;
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.stroke();
}

const fieldTexture = makeCanvasTexture(1024, Math.round((1024 * flagHeight) / canvasW), (ctx, w, h) => {
  ctx.fillStyle = COLORS.navy;
  ctx.fillRect(0, 0, w, h);
  const inset = w * 0.018;
  ctx.strokeStyle = COLORS.tan;
  ctx.lineWidth = w * 0.012;
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
  drawEmblem(ctx, w * 0.5, h * 0.5, Math.min(w, h) * 0.52, w * 0.018, COLORS.tan);
});

const hoistTexture = makeCanvasTexture(160, Math.round((160 * flagHeight) / hoistW), (ctx, w, h) => {
  ctx.fillStyle = COLORS.hoist;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.font = `${Math.round(w * 0.9)}px ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HOIST', 0, 0);
  ctx.restore();
});

const woodTexture = makeCanvasTexture(512, 512, (ctx, w, h) => {
  ctx.fillStyle = COLORS.wood;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++) {
    const y = (i / 40) * h + (Math.random() - 0.5) * 6;
    ctx.strokeStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.08})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 4);
    }
    ctx.stroke();
  }
});
woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(4, 3);

// ---- renderer / scene / camera ----
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1622);
scene.fog = new THREE.Fog(0x0b1622, 4, 9);

const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 50);
const presets = {
  perspective: [1.55, 1.5, 1.85],
  top: [0, 2.7, 0.35]
};
camera.position.set(...presets.perspective);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2 - 0.03;
controls.minDistance = 0.9;
controls.maxDistance = 4.5;

scene.add(new THREE.HemisphereLight(0xbfd6ff, 0x1a140c, 0.65));
const sun = new THREE.DirectionalLight(0xfff3e0, 1.35);
sun.position.set(2.4, 3.2, 1.6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 10;
sun.shadow.camera.left = -2;
sun.shadow.camera.right = 2;
sun.shadow.camera.top = 2;
sun.shadow.camera.bottom = -2;
sun.shadow.bias = -0.0015;
scene.add(sun);

// ---- table ----
const table = new THREE.Mesh(
  new THREE.PlaneGeometry(3.4, 2.4),
  new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.85, metalness: 0.02 })
);
table.rotation.x = -Math.PI / 2;
table.receiveShadow = true;
scene.add(table);

// ---- flag plates ----
function makePlate(width, depth, topTexture, sideColor) {
  const geo = new THREE.BoxGeometry(width, thickness, depth);
  const side = new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.85 });
  const bottom = new THREE.MeshStandardMaterial({ color: 0x090f18, roughness: 0.9 });
  const top = new THREE.MeshStandardMaterial({ map: topTexture, roughness: 0.75 });
  const mesh = new THREE.Mesh(geo, [side, side, top, bottom, side, side]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

const flagGroup = new THREE.Group();
flagGroup.position.y = thickness / 2;

const canvasPlate = makePlate(canvasW, flagHeight, fieldTexture, COLORS.navyDark);
canvasPlate.position.x = canvasCenterX;
flagGroup.add(canvasPlate);

const hoistPlate = makePlate(hoistW, flagHeight, hoistTexture, COLORS.hoistDark);
hoistPlate.position.x = hoistCenterX;
flagGroup.add(hoistPlate);

// ---- grommets ----
const grommetOuter = new THREE.TorusGeometry(0.014, 0.0045, 10, 20);
const grommetMat = new THREE.MeshStandardMaterial({ color: COLORS.bronze, metalness: 0.85, roughness: 0.35 });
const holeMat = new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.9 });
[0.32, -0.32].forEach((zFrac) => {
  const z = zFrac * halfH;
  const grommet = new THREE.Mesh(grommetOuter, grommetMat);
  grommet.rotation.x = Math.PI / 2;
  grommet.position.set(hoistCenterX, thickness + 0.001, z);
  grommet.castShadow = true;
  flagGroup.add(grommet);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.01, 20), holeMat);
  hole.rotation.x = -Math.PI / 2;
  hole.position.set(hoistCenterX, thickness + 0.0005, z);
  flagGroup.add(hole);
});

// ---- fringe ----
const fringeLen = 0.09;
const fringeGeo = new THREE.ConeGeometry(1, 1, 8, 1);
fringeGeo.rotateZ(-Math.PI / 2);
fringeGeo.translate(0.5, 0, 0);
const fringeMat = new THREE.MeshStandardMaterial({ color: COLORS.goldA, roughness: 0.5, metalness: 0.35 });

const strandTransforms = [];
function addEdgeStrands(axis, fixedCoord, outward, spanFrom, spanTo, spacing) {
  const len = spanTo - spanFrom;
  const count = Math.max(2, Math.round(len / spacing));
  const step = len / count;
  for (let i = 0; i < count; i++) {
    const coord = spanFrom + step * (i + 0.5) + (Math.random() - 0.5) * step * 0.3;
    const pos = axis === 'x'
      ? new THREE.Vector3(coord, 0, fixedCoord)
      : new THREE.Vector3(fixedCoord, 0, coord);
    const jitterAngle = (Math.random() - 0.5) * 0.35;
    const dir = new THREE.Vector3(outward.x, 0, outward.z).applyAxisAngle(new THREE.Vector3(0, 1, 0), jitterAngle);
    const length = fringeLen * (0.85 + Math.random() * 0.3);
    const radius = 0.0045 * (0.8 + Math.random() * 0.5);
    strandTransforms.push({ pos, dir, length, radius });
  }
}

const spacing = 0.019;
addEdgeStrands('x', -halfH, new THREE.Vector3(0, 0, -1), -halfW, halfW, spacing);
addEdgeStrands('x', halfH, new THREE.Vector3(0, 0, 1), -halfW, halfW, spacing);
addEdgeStrands('z', -halfW, new THREE.Vector3(-1, 0, 0), -halfH, halfH, spacing);
addEdgeStrands('z', halfW, new THREE.Vector3(1, 0, 0), -halfH, halfH, spacing);

const fringeMesh = new THREE.InstancedMesh(fringeGeo, fringeMat, strandTransforms.length);
fringeMesh.castShadow = true;
const dummy = new THREE.Object3D();
const xAxis = new THREE.Vector3(1, 0, 0);
strandTransforms.forEach((s, i) => {
  dummy.position.set(s.pos.x, thickness * 0.45, s.pos.z);
  dummy.quaternion.setFromUnitVectors(xAxis, s.dir.clone().normalize());
  dummy.scale.set(s.length, s.radius, s.radius);
  dummy.updateMatrix();
  fringeMesh.setMatrixAt(i, dummy.matrix);
  const shade = 0.8 + Math.random() * 0.4;
  fringeMesh.setColorAt(i, new THREE.Color(COLORS.goldA).multiplyScalar(shade));
});
flagGroup.add(fringeMesh);

scene.add(flagGroup);

// ---- resize ----
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
new ResizeObserver(resize).observe(stage);
resize();

// ---- UI ----
document.querySelector('#perspective').onclick = () => {
  controls.autoRotate = false;
  document.querySelector('#rotate').setAttribute('aria-pressed', 'false');
  camera.position.set(...presets.perspective);
  controls.target.set(0, 0, 0);
  controls.update();
};
document.querySelector('#top').onclick = () => {
  controls.autoRotate = false;
  document.querySelector('#rotate').setAttribute('aria-pressed', 'false');
  camera.position.set(...presets.top);
  controls.target.set(0, 0, 0);
  controls.update();
};
document.querySelector('#rotate').onclick = (e) => {
  controls.autoRotate = !controls.autoRotate;
  e.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate));
};
controls.autoRotateSpeed = 1.6;

status.hidden = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
