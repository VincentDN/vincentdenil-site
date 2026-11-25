// Armies on the map as 3D models standing on the terrain (slimmed copies of the WW2044 gallery models: Sherman M4,
// Sd.Kfz. 251, Fallschirmjäger squad), each with a typed plate above it (nation stripe and strength), a ground
// shadow, an amber ring when selected, and a dashed route while it moves.
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {NATIONS, heightAt} from './world.js';

const MODEL = {armour: 'models/sherman-m4.glb', mech: 'models/sdkfz251.glb', infantry: 'models/fallschirmjaeger.glb'};
const IMG = {armour: 'img/tank.webp', mech: 'img/halftrack.webp', infantry: 'img/infantry.webp'};
const KIND = {armour: 'Armoured division', mech: 'Mechanised brigade', infantry: 'Airborne regiment'};
const SIZE = {armour: 32, mech: 32, infantry: 15}; // longest side / height in map units at the base zoom
export const UNITS = [
  {name: '1st Lithia Armoured', kind: 'armour', nation: 0, x: -330, z: -230, str: 2620, mor: 82, vet: 2},
  {name: 'Oros Mountain Rifles', kind: 'infantry', nation: 0, x: -250, z: 20, str: 1840, mor: 91, vet: 3},
  {name: 'Vrisi Motor Column', kind: 'mech', nation: 0, x: 170, z: -230, str: 1260, mor: 74, vet: 1},
  {name: '7th Fallschirm Group', kind: 'infantry', nation: 0, x: -600, z: -150, str: 730, mor: 88, vet: 2},
  {name: 'Orion Garrison Corps', kind: 'armour', nation: 1, x: 120, z: 130, str: 3410, mor: 63, vet: 1},
  {name: 'Kastro Security Bde', kind: 'mech', nation: 1, x: 260, z: 300, str: 1520, mor: 58, vet: 0},
  {name: 'Agia Marina Watch', kind: 'infantry', nation: 1, x: -440, z: 60, str: 980, mor: 61, vet: 0},
  {name: 'Pelekas Militia', kind: 'infantry', nation: 2, x: -230, z: 330, str: 650, mor: 70, vet: 0},
  {name: 'Varenna Expeditionary', kind: 'armour', nation: 4, x: -300, z: -600, str: 4210, mor: 77, vet: 1},
  {name: 'Ostmark Lancers', kind: 'mech', nation: 5, x: 300, z: -560, str: 2950, mor: 69, vet: 2},
];
export const PLAYER = 0;

function plate(u, selected) {
  const c = document.createElement('canvas');
  c.width = 192; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = selected ? '#2b2414' : '#151918'; g.fillRect(0, 8, 192, 48);
  g.fillStyle = NATIONS[u.nation].color; g.fillRect(0, 8, 14, 48);
  g.strokeStyle = selected ? '#f2c46b' : '#5b6347'; g.lineWidth = 3; g.strokeRect(1.5, 9.5, 189, 45);
  g.fillStyle = '#f0e9d6'; g.font = '30px "Special Elite", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(u.str.toLocaleString('en-GB'), 103, 33);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return t;
}
const shadowTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 4, 32, 32, 30);
  r.addColorStop(0, 'rgba(0,0,0,.55)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(c);
})();

async function template(kind) {
  const gltf = await new GLTFLoader().loadAsync(MODEL[kind]);
  const root = gltf.scene;
  const box = new T.Box3().setFromObject(root), size = box.getSize(new T.Vector3()), c = box.getCenter(new T.Vector3());
  const k = SIZE[kind] / (kind === 'infantry' ? size.y : Math.max(size.x, size.z));
  root.position.set(-c.x * k, -box.min.y * k, -c.z * k);
  root.scale.setScalar(k);
  // models face +z in the gallery; armies face their heading
  const pivot = new T.Group();
  pivot.add(root);
  root.traverse(o => { if (o.isMesh) { o.material.side = T.FrontSide; o.userData.pick = true; } });
  return pivot;
}

export async function buildUnits(scene) {
  scene.add(new T.HemisphereLight(0xf0f4ee, 0x4a5048, 2.6));
  const sun = new T.DirectionalLight(0xfff1d6, 2.8);
  sun.position.set(-400, 900, -300);
  scene.add(sun);
  const kinds = Object.keys(MODEL), temps = Object.fromEntries(await Promise.all(kinds.map(async k => [k, await template(k)])));
  const ringGeo = new T.RingGeometry(0.82, 1, 48).rotateX(-Math.PI / 2), shadowGeo = new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  for (const u of UNITS) {
    u.kindName = KIND[u.kind];
    u.img = IMG[u.kind];
    u.obj = new T.Group();
    u.heading = Math.PI * 0.75;
    const body = new T.Group();
    if (u.kind === 'infantry') // a squad of three
      for (const [dx, dz, r] of [[0, 0, 0], [-5, 4, 0.3], [5, 3, -0.2]]) { const m = temps.infantry.clone(); m.position.set(dx, 0, dz); m.rotation.y = r; body.add(m); }
    else body.add(temps[u.kind].clone());
    u.body = body;
    body.traverse(o => { if (o.isMesh) o.userData.unit = u; });
    u.obj.add(body);
    const sh = new T.Mesh(shadowGeo, new T.MeshBasicMaterial({map: shadowTex, transparent: true, depthWrite: false}));
    sh.scale.set(40, 1, 30); sh.position.y = 0.3; sh.renderOrder = 2;
    u.obj.add(sh);
    u.tex = [plate(u, false), plate(u, true)];
    u.plate = new T.Sprite(new T.SpriteMaterial({map: u.tex[0], depthTest: false, transparent: true}));
    u.plate.center.set(0.5, 0);
    u.plate.renderOrder = 6;
    u.plate.userData.unit = u;
    u.ring = new T.Mesh(ringGeo, new T.MeshBasicMaterial({color: 0xf2c46b, transparent: true, opacity: 0.9, depthTest: false}));
    u.ring.renderOrder = 4;
    u.ring.visible = false;
    u.path = new T.Line(new T.BufferGeometry(), new T.LineDashedMaterial({color: 0xf2c46b, dashSize: 8, gapSize: 6, depthTest: false, transparent: true, opacity: 0.9}));
    u.path.renderOrder = 4;
    u.target = null;
    scene.add(u.obj, u.plate, u.ring, u.path);
    place(u);
  }
}
const ground = (x, z) => Math.max(0, heightAt(x, z)) * 0.45;
function place(u) {
  const y = ground(u.x, u.z);
  u.obj.position.set(u.x, y, u.z);
  u.obj.rotation.y = u.heading;
  u.ring.position.set(u.x, y + 0.6, u.z);
}
/** Everything a click can hit for this army. */
export const pickables = () => UNITS.flatMap(u => [u.plate, ...u.body.children]);
export function setSelected(u, on) {
  u.selected = on;
  u.plate.material.map = u.tex[on ? 1 : 0];
  u.ring.visible = on;
}
export function order(u, x, z) {
  u.target = {x, z};
  u.path.geometry.setFromPoints([new T.Vector3(u.x, ground(u.x, u.z) + 1, u.z), new T.Vector3(x, ground(x, z) + 1, z)]);
  u.path.computeLineDistances();
  u.path.visible = true;
}
/** Advance armies toward their orders; `scale` sizes the models and plates for the camera distance. Returns true while any army marches. */
export function updateUnits(dt, scale, t) {
  let moving = false;
  for (const u of UNITS) {
    if (u.target && dt > 0) {
      const dx = u.target.x - u.x, dz = u.target.z - u.z, d = Math.hypot(dx, dz), step = 26 * dt;
      const want = Math.atan2(dx, dz);
      u.heading += Math.atan2(Math.sin(want - u.heading), Math.cos(want - u.heading)) * Math.min(1, dt * 4);
      if (d <= step) { u.x = u.target.x; u.z = u.target.z; u.target = null; u.path.visible = false; }
      else { u.x += (dx / d) * step; u.z += (dz / d) * step; moving = true; }
      place(u);
      if (u.target) { const p = u.path.geometry.attributes.position; p.setXYZ(0, u.x, ground(u.x, u.z) + 1, u.z); p.needsUpdate = true; u.path.computeLineDistances(); }
    }
    u.obj.scale.setScalar(scale);
    u.body.position.y = u.target && dt > 0 ? Math.abs(Math.sin(t * 9)) * 0.25 : 0;
    const top = ground(u.x, u.z) + SIZE[u.kind] * scale * (u.kind === 'infantry' ? 1.15 : 0.55) + 3;
    u.plate.position.set(u.x, top, u.z);
    const ps = 6 + scale * 6;
    u.plate.scale.set(ps * 3, ps, 1);
    u.ring.scale.setScalar(scale * SIZE[u.kind] * (u.kind === 'infantry' ? 1.1 : 0.62) * (1 + 0.05 * Math.sin(t * 4)));
  }
  return moving;
}
