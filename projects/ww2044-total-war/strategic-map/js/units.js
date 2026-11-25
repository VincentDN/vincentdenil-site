// Armies on the map: round badges (the WW2044 model renders in a gilt ring, the nation's colour in the band, the
// strength on a plate below), selectable and, for the player's own, movable.
import * as T from 'three';
import {NATIONS, heightAt} from './world.js';

const IMG = {armour: 'img/tank.webp', mech: 'img/halftrack.webp', infantry: 'img/infantry.webp'};
const KIND = {armour: 'Armoured division', mech: 'Mechanised brigade', infantry: 'Airborne regiment'};
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
const images = {};
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });

function badge(u, selected) {
  const c = document.createElement('canvas');
  c.width = 160; c.height = 200;
  const g = c.getContext('2d'), cx = 80, cy = 78;
  if (selected) { g.shadowColor = '#ffe39a'; g.shadowBlur = 22; }
  const gold = g.createLinearGradient(0, 14, 0, 142);
  gold.addColorStop(0, selected ? '#fff1c2' : '#e9cf8e'); gold.addColorStop(0.5, selected ? '#e8c060' : '#9c7737'); gold.addColorStop(1, '#5b4119');
  g.beginPath(); g.arc(cx, cy, 64, 0, 7); g.fillStyle = gold; g.fill();
  g.shadowBlur = 0;
  g.beginPath(); g.arc(cx, cy, 56, 0, 7); g.fillStyle = NATIONS[u.nation].color; g.fill();
  g.beginPath(); g.arc(cx, cy, 56, 0, 7); g.lineWidth = 3; g.strokeStyle = '#1a140c'; g.stroke();
  const inner = g.createRadialGradient(cx - 10, cy - 14, 6, cx, cy, 48);
  inner.addColorStop(0, '#4b5660'); inner.addColorStop(1, '#141a20');
  g.beginPath(); g.arc(cx, cy, 47, 0, 7); g.fillStyle = inner; g.fill();
  g.save(); g.beginPath(); g.arc(cx, cy, 46, 0, 7); g.clip();
  const im = images[u.kind];
  if (im) g.drawImage(im, cx - 50, cy - 50, 100, 100);
  g.restore();
  // strength plate
  g.fillStyle = '#12171d'; g.strokeStyle = selected ? '#ffe39a' : '#9c7737'; g.lineWidth = 3;
  g.beginPath(); g.roundRect(28, 150, 104, 36, 6); g.fill(); g.stroke();
  g.fillStyle = '#f3ead6'; g.font = '600 24px Cinzel, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(u.str.toLocaleString('en-GB'), cx, 169);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return t;
}

export async function buildUnits(scene) {
  for (const [k, src] of Object.entries(IMG)) images[k] = await load(src);
  const group = new T.Group();
  scene.add(group);
  // a ring on the ground under each selected army
  const ringGeo = new T.RingGeometry(0.8, 1, 48).rotateX(-Math.PI / 2);
  for (const u of UNITS) {
    u.kindName = KIND[u.kind];
    u.img = IMG[u.kind];
    u.tex = [badge(u, false), badge(u, true)];
    u.sprite = new T.Sprite(new T.SpriteMaterial({map: u.tex[0], depthTest: false, transparent: true}));
    u.sprite.center.set(0.5, 0.18);
    u.sprite.renderOrder = 5;
    u.sprite.userData.unit = u;
    u.ring = new T.Mesh(ringGeo, new T.MeshBasicMaterial({color: 0xffe08a, transparent: true, opacity: 0.85, depthTest: false}));
    u.ring.renderOrder = 4;
    u.ring.visible = false;
    u.path = new T.Line(new T.BufferGeometry(), new T.LineDashedMaterial({color: 0xffe9b0, dashSize: 8, gapSize: 6, depthTest: false, transparent: true, opacity: 0.9}));
    u.path.renderOrder = 4;
    u.target = null;
    group.add(u.sprite, u.ring, u.path);
    place(u);
  }
  return group;
}
const ground = (x, z) => Math.max(0, heightAt(x, z)) * 0.45;
function place(u) {
  const y = ground(u.x, u.z);
  u.sprite.position.set(u.x, y + 2, u.z);
  u.ring.position.set(u.x, y + 0.6, u.z);
}
export function setSelected(u, on) {
  u.selected = on;
  u.sprite.material.map = u.tex[on ? 1 : 0];
  u.ring.visible = on;
}
export function order(u, x, z) {
  u.target = {x, z};
  const g = u.path.geometry;
  g.setFromPoints([new T.Vector3(u.x, ground(u.x, u.z) + 1, u.z), new T.Vector3(x, ground(x, z) + 1, z)]);
  u.path.computeLineDistances();
  u.path.visible = true;
}
/** Advance armies toward their orders; `scale` sizes badges for the camera distance. */
export function updateUnits(dt, scale, t) {
  for (const u of UNITS) {
    if (u.target && dt > 0) {
      const dx = u.target.x - u.x, dz = u.target.z - u.z, d = Math.hypot(dx, dz), step = 26 * dt;
      if (d <= step) { u.x = u.target.x; u.z = u.target.z; u.target = null; u.path.visible = false; }
      else { u.x += (dx / d) * step; u.z += (dz / d) * step; }
      place(u);
      if (u.target) {
        const p = u.path.geometry.attributes.position;
        p.setXYZ(0, u.x, ground(u.x, u.z) + 1, u.z); p.needsUpdate = true; u.path.computeLineDistances();
      }
    }
    const s = scale * (u.selected ? 1.12 : 1);
    u.sprite.scale.set(s * 0.8, s, 1);
    u.ring.scale.setScalar(s * 0.42 * (1 + 0.06 * Math.sin(t * 4)));
  }
}
