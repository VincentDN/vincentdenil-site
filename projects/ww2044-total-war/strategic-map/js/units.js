// Armies on the map as 3D models standing on the terrain (slimmed copies of the WW2044 gallery models: Sherman M4,
// Sd.Kfz. 251, Fallschirmjäger squad), each with a typed plate above it (nation stripe and strength), a ground
// shadow, an amber ring when selected, and a dashed route while it moves.
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {NATIONS, heightAt, lonlat} from './world.js';

const MODEL = {armour: 'models/sherman-m4.glb', mech: 'models/sdkfz251.glb', infantry: 'models/fallschirmjaeger.glb'};
const IMG = {armour: 'img/tank.webp', mech: 'img/halftrack.webp', infantry: 'img/infantry.webp'};
const KIND = {armour: 'Armoured army', mech: 'Mechanised corps', infantry: 'Infantry corps'};
const SIZE = {armour: 32, mech: 32, infantry: 15}; // longest side / height in map units at the base zoom
// 1 January 1936: Poland's field armies on their peacetime stations, the Reich in Pomerania, Silesia and East Prussia,
// the Red Army's western districts beyond the Riga line. Positions in lon, lat.
export const UNITS = [
  {name: 'Armia Pomorze', kind: 'armour', nation: 0, at: [18.25, 53.3], str: 3120, mor: 84, vet: 1},
  {name: 'Armia Poznań', kind: 'mech', nation: 0, at: [17.15, 52.3], str: 2480, mor: 86, vet: 1},
  {name: 'Armia Modlin', kind: 'infantry', nation: 0, at: [20.5, 52.9], str: 1960, mor: 88, vet: 2},
  {name: 'Armia Łódź', kind: 'armour', nation: 0, at: [19.1, 51.5], str: 2870, mor: 82, vet: 1},
  {name: 'Armia Kraków', kind: 'mech', nation: 0, at: [19.5, 50.35], str: 2650, mor: 85, vet: 2},
  {name: 'Armia Karpaty', kind: 'infantry', nation: 0, at: [22.5, 49.65], str: 1540, mor: 90, vet: 3},
  {name: 'KOP Wilno Brigade', kind: 'infantry', nation: 0, at: [25.7, 54.45], str: 910, mor: 92, vet: 2},
  {name: 'Armia Prusy', kind: 'armour', nation: 0, at: [20.4, 51.75], str: 3400, mor: 87, vet: 0},
  {name: 'Heeresgruppe Nord', kind: 'armour', nation: 1, at: [20.6, 53.95], str: 4210, mor: 78, vet: 1},
  {name: '4. Armee', kind: 'mech', nation: 1, at: [16.6, 53.75], str: 2950, mor: 74, vet: 1},
  {name: 'Heeresgruppe Süd', kind: 'armour', nation: 1, at: [17.4, 51.05], str: 4630, mor: 76, vet: 1},
  {name: '8. Armee', kind: 'infantry', nation: 1, at: [16.15, 51.75], str: 2100, mor: 71, vet: 0},
  {name: 'Belorussian Front', kind: 'armour', nation: 2, at: [28.3, 53.8], str: 5120, mor: 66, vet: 0},
  {name: 'Kiev Special District', kind: 'armour', nation: 2, at: [28.1, 50.2], str: 4870, mor: 64, vet: 0},
  {name: '3rd Army', kind: 'mech', nation: 2, at: [28.8, 55.1], str: 2760, mor: 61, vet: 0},
  {name: '5th Army', kind: 'infantry', nation: 2, at: [28.1, 51.6], str: 2330, mor: 63, vet: 1},
].map(u => { const [x, z] = lonlat(...u.at); return Object.assign(u, {x, z}); });
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
