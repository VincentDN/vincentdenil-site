// A small ruined town square, autumn 1944 in spirit: cobbles, broken brick walls, sandbags, hedgehogs, a lamp post, haze and smoke.
// Everything is procedural (canvas textures and primitives): no downloaded assets.
import * as T from 'three';

const rnd = ((s) => () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296)(9071);
const FOG = new T.Color('#9aa3a6');

function canvasTex(w, h, draw, repeat = 1, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat, repeat); t.anisotropy = 8;
  if (srgb) t.colorSpace = T.SRGBColorSpace; return t;
}
const cobbles = (ctx, w, h) => {
  ctx.fillStyle = '#4a4640'; ctx.fillRect(0, 0, w, h);
  const s = 32;
  for (let y = 0; y < h; y += s * 0.8) for (let x = (y / (s * 0.8)) % 2 ? -s / 2 : 0; x < w; x += s) {
    const l = 70 + rnd() * 40, g = l - 4 - rnd() * 6;
    ctx.fillStyle = `rgb(${l},${g},${g - 8})`;
    ctx.beginPath(); ctx.ellipse(x + s / 2 + (rnd() - 0.5) * 4, y + s * 0.4, s * 0.44, s * 0.34, rnd() * 0.3, 0, 7); ctx.fill();
  }
  for (let i = 0; i < 90; i++) { // mud and puddle stains
    const x = rnd() * w, y = rnd() * h, r = 20 + rnd() * 70, gr = ctx.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(58,48,36,${0.25 + rnd() * 0.35})`); gr.addColorStop(1, 'rgba(58,48,36,0)'); ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
};
const bricks = (ctx, w, h) => {
  ctx.fillStyle = '#5b4a40'; ctx.fillRect(0, 0, w, h);
  const bw = 32, bh = 12;
  for (let y = 0; y < h; y += bh) for (let x = (y / bh) % 2 ? -bw / 2 : 0; x < w; x += bw) {
    const r = 120 + rnd() * 40, g = 80 + rnd() * 25, b = 64 + rnd() * 20; ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(x + 1, y + 1, bw - 2, bh - 2);
  }
  for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() * h, r = 10 + rnd() * 60; ctx.fillStyle = `rgba(30,26,24,${rnd() * 0.25})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
};
const plaster = (ctx, w, h) => { ctx.fillStyle = '#a49c8c'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { ctx.fillStyle = `rgba(${rnd() < 0.5 ? '60,55,50' : '200,195,180'},${rnd() * 0.12})`; ctx.fillRect(rnd() * w, rnd() * h, 4 + rnd() * 40, 4 + rnd() * 40); } };
const burlap = (ctx, w, h) => { ctx.fillStyle = '#8d7d5c'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < w; i += 2) { ctx.fillStyle = `rgba(40,30,20,${rnd() * 0.25})`; ctx.fillRect(i, 0, 1, h); ctx.fillRect(0, i, w, 1); } };
const smoke = (ctx, w) => { const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(210,210,205,0.55)'); g.addColorStop(1, 'rgba(210,210,205,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, w); };

export function buildScene(renderer) {
  const scene = new T.Scene();
  scene.fog = new T.Fog(FOG, 6.5, 24); // soldiers (about 5.6 m away) stay crisp; the walls and ruins fade into haze behind them

  // sky dome: hazy overcast gradient, also used as the environment map
  const skyMat = new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new T.Color('#7f8c96') }, mid: { value: new T.Color('#c9ccc6') }, low: { value: FOG } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top, mid, low; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.08 ? mix(mid, top, smoothstep(0.08, 0.7, h)) : mix(low, mid, smoothstep(-0.05, 0.08, h)); gl_FragColor = vec4(c, 1.); }' });
  const sky = new T.Mesh(new T.SphereGeometry(200, 32, 16), skyMat); scene.add(sky);
  const envScene = new T.Scene(); envScene.add(new T.Mesh(sky.geometry, skyMat));
  const pm = new T.PMREMGenerator(renderer), env = pm.fromScene(envScene, 0.04).texture; pm.dispose();

  scene.add(new T.HemisphereLight('#dfe5ea', '#5a5044', 1.7));
  const sun = new T.DirectionalLight('#fff1dc', 2.8);
  sun.position.set(-6, 10, 7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 }); scene.add(sun);

  const M = (o) => new T.MeshStandardMaterial(Object.assign({ roughness: 0.95, metalness: 0, envMap: env, envMapIntensity: 0.5 }, o));
  const ground = new T.Mesh(new T.CircleGeometry(60, 48), M({ map: canvasTex(512, 512, cobbles, 14) }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const brickM = M({ map: canvasTex(256, 256, bricks, 1) }), plasterM = M({ map: canvasTex(256, 256, plaster, 1) }), woodM = M({ color: '#5a4a38' }),
    ironM = M({ color: '#3a3b3a', roughness: 0.6, metalness: 0.6 }), bagM = M({ map: canvasTex(64, 64, burlap, 1) });
  const box = (w, h, d, mat, x, y, z, ry = 0, rz = 0) => {
    const g = new T.BoxGeometry(w, h, d), uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * Math.max(w, d) / 2, uv.getY(i) * h / 2);
    const m = new T.Mesh(g, mat); m.position.set(x, y, z); m.rotation.set(0, ry, rz); m.castShadow = m.receiveShadow = true; scene.add(m); return m;
  };
  // ruined wall behind the square, with a broken, stepped top and a gateway
  for (let i = -9; i <= 9; i++) {
    if (Math.abs(i) < 1) continue;
    const h = 1.6 + Math.abs(Math.sin(i * 1.7)) * 1.6 + (Math.abs(i) > 5 ? 1.2 : 0);
    box(1.02, h, 0.45, brickM, i * 1.0, h / 2, -14);
  }
  box(0.6, 3.8, 0.6, plasterM, -0.9, 1.9, -14); box(0.6, 3.8, 0.6, plasterM, 0.9, 1.9, -14); box(2.4, 0.5, 0.6, plasterM, 0, 4.0, -14);
  // bombed-out house, left and right: facades with window holes
  const facade = (x, z, ry, floors) => {
    const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    for (let f = 0; f < floors; f++) for (let c = 0; c < 4; c++) {
      if (f === floors - 1 && c > 1 + (x > 0 ? 1 : 0)) continue; // collapsed corner
      const y = f * 3; const add = (w, h, px, py) => { const m = new T.Mesh(new T.BoxGeometry(w, h, 0.4), plasterM); m.position.set(px, py, 0); m.castShadow = m.receiveShadow = true; g.add(m); };
      add(0.7, 3, c * 2.2 - 3.3, y + 1.5); add(1.5, 0.9, c * 2.2 - 2.2, y + 0.45); add(1.5, 0.6, c * 2.2 - 2.2, y + 2.7);
    }
    return g;
  };
  facade(-10, -6, Math.PI / 2.6, 3); facade(10.5, -5, -Math.PI / 2.4, 2);
  // rubble piles
  for (let i = 0; i < 70; i++) {
    const side = i % 2 ? 1 : -1, s = 0.15 + rnd() * 0.35;
    box(s * 1.6, s, s, rnd() < 0.6 ? brickM : plasterM, side * (5.5 + rnd() * 4), s / 2, -8 + rnd() * 4, rnd() * 3, (rnd() - 0.5) * 0.6);
  }
  // sandbag wall, front left and right of the squad
  const bagG = new T.CapsuleGeometry(0.16, 0.34, 4, 8); bagG.rotateZ(Math.PI / 2); bagG.scale(1, 0.62, 1);
  for (const [cx, cz, ry] of [[-4.6, -2.6, 0.5], [4.8, -3.2, -0.4]]) for (let r = 0; r < 3; r++) for (let k = 0; k < 6 - r; k++) {
    const m = new T.Mesh(bagG, bagM); m.position.set(cx + Math.cos(ry) * (k - (5 - r) / 2) * 0.62, 0.1 + r * 0.19, cz - Math.sin(ry) * (k - (5 - r) / 2) * 0.62);
    m.rotation.y = ry + (rnd() - 0.5) * 0.15; m.castShadow = m.receiveShadow = true; scene.add(m);
  }
  // steel hedgehogs
  const hedgehog = (x, z, ry) => { const g = new T.Group(); g.position.set(x, 0.55, z); g.rotation.y = ry; scene.add(g);
    for (const [a, b] of [[0.75, 0], [-0.75, 0], [0, 1.57]]) { const m = new T.Mesh(new T.BoxGeometry(0.1, 1.7, 0.1), ironM); m.rotation.set(a, b, b ? 0.75 : 0); m.castShadow = true; g.add(m); } };
  hedgehog(-6.5, -6, 0.3); hedgehog(6.2, -7.5, 1.1); hedgehog(3, -9, 0.7);
  // crates and a lamp post
  box(0.8, 0.6, 0.6, woodM, -3.2, 0.3, -4.2, 0.3); box(0.6, 0.45, 0.5, woodM, -3.1, 0.82, -4.15, 0.6);
  const post = new T.Mesh(new T.CylinderGeometry(0.06, 0.09, 4.2, 8), ironM); post.position.set(-3.2, 2.1, -8.5); post.castShadow = true; scene.add(post);
  const lamp = new T.Mesh(new T.CylinderGeometry(0.18, 0.12, 0.4, 6), ironM); lamp.position.set(-3.2, 4.3, -8.5); scene.add(lamp);
  // bare trees behind the wall
  for (let i = 0; i < 9; i++) { const h = 5 + rnd() * 4, t = new T.Mesh(new T.CylinderGeometry(0.08, 0.22, h, 6), M({ color: '#3d362f' })); t.position.set(-12 + i * 3 + rnd(), h / 2, -17 - rnd() * 4); t.rotation.z = (rnd() - 0.5) * 0.2; scene.add(t); }

  // drifting smoke
  const smokeMat = new T.SpriteMaterial({ map: canvasTex(64, 64, smoke), depthWrite: false, fog: true, transparent: true, opacity: 0.5 });
  const puffs = [];
  for (let i = 0; i < 22; i++) { const s = new T.Sprite(smokeMat); s.userData = { x: 6 + rnd() * 3, z: -10 + rnd() * 3, t: rnd() * 12 }; scene.add(s); puffs.push(s); }
  const update = (dt) => {
    for (const s of puffs) { const u = s.userData; u.t = (u.t + dt * 0.6) % 12; const k = u.t / 12;
      s.position.set(u.x + k * 4, 0.5 + k * 7, u.z - k * 2); const sc = 1 + k * 5; s.scale.set(sc, sc, 1); s.material.opacity = 0.5; s.visible = true; }
  };
  return { scene, env, update };
}
