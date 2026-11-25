// Loads the posed Escape From Claudov soldiers baked by tools/bake-claudov-soldiers.mjs (data/soldiers.json + soldiers.bin + textures).
// Geometry is quantised: positions int16 inside a bounding box, normals int8, uvs uint16, vertex colours uint8.
import * as T from 'three';

const TAG = new T.Color(0x8fd16a).convertSRGBToLinear().multiplyScalar(0.8); // the green recognition tape, as allies see it

function geometry(g, bin) {
  const n = g.n, q = new Int16Array(bin, g.pos, n * 3), pos = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) { const k = i % 3; pos[i] = g.min[k] + (q[i] + 32767) / 65534 * (g.max[k] - g.min[k]); }
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new T.BufferAttribute(new Int8Array(bin, g.nor, n * 3), 3, true));
  geo.setAttribute('color', new T.BufferAttribute(new Uint8Array(bin, g.col, n * 3), 3, true));
  if (g.uv >= 0) geo.setAttribute('uv', new T.BufferAttribute(new Uint16Array(bin, g.uv, n * 2), 2, true));
  if (g.idx >= 0) geo.setIndex(new T.BufferAttribute(g.i16 ? new Uint16Array(bin, g.idx, g.ni) : new Uint32Array(bin, g.idx, g.ni), 1));
  geo.computeBoundingSphere();
  return geo;
}

export async function loadSoldiers(base, envMap) {
  const [meta, bin] = await Promise.all([fetch(base + 'soldiers.json').then((r) => r.json()), fetch(base + 'soldiers.bin').then((r) => r.arrayBuffer())]);
  const tl = new T.TextureLoader(), cache = {};
  const tex = (f, srgb) => cache[f] || (cache[f] = (() => {
    const t = tl.load(base + f); t.anisotropy = 8; if (srgb) t.colorSpace = T.SRGBColorSpace; return t;
  })());
  const guns = {};
  for (const [k, g] of Object.entries(meta.guns)) guns[k] = geometry(g, bin);
  const gunMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.35, envMap, envMapIntensity: 0.8 });
  const kits = {};
  for (const u of meta.units) {
    const b = u.body, rm = tex(b.rm);
    const mat = new T.MeshStandardMaterial({ vertexColors: true, map: tex(b.map, true), normalMap: tex(b.normal), normalScale: new T.Vector2(0.36, 0.36),
      roughnessMap: rm, metalnessMap: rm, roughness: 1, metalness: 1, envMap, envMapIntensity: 0.7 });
    mat.onBeforeCompile = (s) => { // recognition tape: red channel of the roughness/metal atlas marks the tape tiles
      s.uniforms.uTag = { value: TAG };
      s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uTag;')
        .replace('#include <color_fragment>', '#include <color_fragment>\n  float skTag = smoothstep(0.7, 0.9, texture2D(roughnessMap, vRoughnessMapUv).r);\n  diffuseColor.rgb = mix(diffuseColor.rgb, uTag, skTag);');
    };
    kits[u.skin] = { geo: geometry(b, bin), mat, gun: u.gun };
  }
  // one soldier: body + rifle; kit can be swapped in place
  const make = (skin) => {
    const root = new T.Group(), body = new T.Mesh(kits[skin].geo, kits[skin].mat), gun = new T.Mesh(guns[kits[skin].gun], gunMat);
    for (const m of [body, gun]) { m.castShadow = true; m.receiveShadow = true; root.add(m); }
    root.userData = { skin, body };
    root.setKit = (s) => { body.geometry = kits[s].geo; body.material = kits[s].mat; gun.geometry = guns[kits[s].gun]; root.userData.skin = s; };
    return root;
  };
  return { kits, make };
}
