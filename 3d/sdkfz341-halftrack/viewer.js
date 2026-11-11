// Adapted from /projects/3d/viewer/: Three.js, OrbitControls, lighting and responsive renderer.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const stage = document.querySelector('#stage'), status = document.querySelector('#status');
try {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.prepend(renderer.domElement);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  sun.position.set(6, 9, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30});
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, new THREE.HemisphereLight(0xdfe9f5, 0x2a3138, 0.7));
  const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.ShadowMaterial({opacity: 0.38}));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 3;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.target.set(0, 1.3, 0);
  // glTF space: +X forward, +Y up, +Z = vehicle right
  const views = {hero: [9, 4.6, -7.5], side: [0.2, 1.8, -13], rear: [-10, 3.2, 5.5], top: [0.01, 17, 0]};
  const setView = k => { camera.position.set(...views[k]); controls.target.set(0, 1.3, 0); controls.update(); };
  setView('hero');
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.aspect = w / h;
    camera.fov = w < h ? 50 : 35;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  new ResizeObserver(resize).observe(stage);
  resize();
  document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => setView(b.dataset.view));
  const rot = document.querySelector('#rotate');
  rot.onclick = () => { controls.autoRotate = !controls.autoRotate; rot.setAttribute('aria-pressed', String(controls.autoRotate)); };

  let mixer = null;
  const actions = {};
  new GLTFLoader().load('./sdkfz341.glb', g => {
    g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    scene.add(g.scene);
    mixer = new THREE.AnimationMixer(g.scene);
    for (const clip of g.animations) actions[clip.name] = mixer.clipAction(clip);
    status.hidden = true;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-loop]').forEach(b => {
      const a = actions[b.dataset.loop];
      if (!a) { b.disabled = true; return; }
      b.onclick = () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        if (on) a.reset().play(); else a.stop();
      };
    });
    document.querySelectorAll('[data-once]').forEach(b => {
      const a = actions[b.dataset.once];
      if (!a) { b.disabled = true; return; }
      a.setLoop(THREE.LoopOnce);
      b.onclick = () => a.reset().play();
    });
    document.querySelectorAll('[data-toggle]').forEach(b => {
      const a = actions[b.dataset.toggle];
      if (!a) { b.disabled = true; return; }
      a.setLoop(THREE.LoopOnce);
      a.clampWhenFinished = true;
      b.onclick = () => {
        const open = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(open));
        a.paused = false;
        a.timeScale = open ? 1 : -1;
        if (!a.isRunning()) { a.time = open ? 0 : a.getClip().duration; }
        a.play();
      };
    });
    if (!reduce) document.querySelector('[data-loop=drive]').click();
  }, undefined, err => {
    console.error(err);
    status.textContent = 'The 3D model could not load. Please reload, or use the downloads.';
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    if (mixer) mixer.update(dt);
    controls.update();
    renderer.render(scene, camera);
  });
} catch (error) {
  console.error(error);
  status.textContent = 'WebGL is unavailable. Use a browser with WebGL enabled, or use the downloads.';
}
