// Adapted from /projects/3d/viewer/: Three.js, OrbitControls, lighting and responsive renderer.
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const stage=document.querySelector('#stage'),status=document.querySelector('#status'),tooltip=document.querySelector('#tooltip');
try {
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.001,5);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;stage.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xf4f6eb,0x223747,2));
const key=new THREE.DirectionalLight(0xfff2d9,3);key.position.set(-.08,.1,.15);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-.09,right:.09,top:.07,bottom:-.07,near:.01,far:.5});key.shadow.bias=-.00001;key.shadow.normalBias=.00004;scene.add(key);
const fill=new THREE.DirectionalLight(0xc1e2ff,1.5);fill.position.set(.1,-.05,.06);scene.add(fill);
const backLight=new THREE.DirectionalLight(0xe2e7de,2.2);backLight.position.set(-.08,.09,-.12);scene.add(backLight);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=.09;controls.maxDistance=.6;controls.autoRotateSpeed=.6;controls.target.set(0,0,.0015);
let baseDistance=.24,showMeasurements=true,active=null;
function preset(type){controls.autoRotate=false;document.querySelector('#rotate').setAttribute('aria-pressed','false');const v=type==='front'?[0,0,1]:type==='back'?[.12,.25,-1]:type==='edge'?[0,-.95,.22]:[.16,.42,1];camera.position.set(...v).normalize().multiplyScalar(baseDistance);controls.target.set(0,0,.0015);controls.update();}
function resize(){const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);baseDistance=Math.max(.18,.078/(Math.tan(THREE.MathUtils.degToRad(17.5))*camera.aspect));}
new ResizeObserver(resize).observe(stage);resize();preset('perspective');
for(const id of ['front','back','edge','perspective'])document.getElementById(id).onclick=()=>preset(id);
document.querySelector('#rotate').onclick=e=>{controls.autoRotate=!controls.autoRotate;e.currentTarget.setAttribute('aria-pressed',String(controls.autoRotate));};
document.querySelector('#measure').onclick=e=>{showMeasurements=!showMeasurements;e.currentTarget.setAttribute('aria-pressed',String(showMeasurements));if(!showMeasurements){tooltip.hidden=true;active=null;}};
const specs=[
['127 mm',[0,-.039,.003],'Overall width','127 mm (12.7 cm), measured across the outside of the frame.'],
['75 mm',[-.065,0,.003],'Overall height','75 mm (7.5 cm), measured across the outside of the frame.'],
['3 mm',[.034,.036,.003],'Outer frame','3 mm wide around the patch perimeter.'],
['1.5 mm',[.05975,.012,.0023],'Sewing channel','1.5 mm recessed channel between the frame and artwork. Stitch spacing is illustrative.'],
['1 mm',[.036,-.009,.003],'Color separation','1 mm gap between main panels. Fine eagle and shield details preserve their original SVG spacing.'],
['3.6 mm*',[.05,-.032,.00315],'Assumed thickness','3.6 mm maximum: 2 mm base, up to 1.15 mm emblem relief, and 0.45 mm Velcro-style backing. Depth was not supplied in the reference.']];
const markers=specs.map(([label,p,title,body],i)=>{const b=document.createElement('button');b.className='hotspot';b.textContent=label;b.setAttribute('aria-label',title+': '+label);b.setAttribute('aria-pressed','false');b.hidden=true;stage.append(b);const open=()=>{active=i;tooltip.replaceChildren();const strong=document.createElement('strong');strong.textContent=title+' · '+label;tooltip.append(strong,document.createTextNode(body));tooltip.hidden=false;};b.addEventListener('pointerenter',open);b.addEventListener('focus',open);b.addEventListener('click',open);b.addEventListener('pointerleave',()=>{if(document.activeElement!==b){tooltip.hidden=true;active=null;}});b.addEventListener('blur',()=>{tooltip.hidden=true;active=null;});return {b,p:new THREE.Vector3(...p)};});
stage.addEventListener('keydown',e=>{if(e.key==='Escape'){tooltip.hidden=true;active=null;}if(e.target!==stage)return;const v=camera.position.clone().sub(controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight')v.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?.12:-.12);else if(e.key==='ArrowUp'||e.key==='ArrowDown')v.applyAxisAngle(new THREE.Vector3(1,0,0),e.key==='ArrowUp'?.12:-.12);else if(e.key==='+'||e.key==='=')v.multiplyScalar(.9);else if(e.key==='-')v.multiplyScalar(1.1);else return;e.preventDefault();v.clampLength(controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(v);controls.update();});
let loaded=false;
new GLTFLoader().load('./patch.glb',g=>{g.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});scene.add(g.scene);loaded=true;status.hidden=true;},undefined,err=>{console.error(err);status.textContent='The 3D model could not load. Please reload or download the GLB below.';});
renderer.setAnimationLoop(()=>{controls.update();const front=camera.position.z>.01;markers.forEach(({b,p},i)=>{const v=p.clone().project(camera);b.hidden=!loaded||!showMeasurements||!front||Math.abs(v.x)>1||Math.abs(v.y)>1;b.style.left=(v.x*.5+.5)*stage.clientWidth+'px';b.style.top=(-v.y*.5+.5)*stage.clientHeight+'px';b.setAttribute('aria-pressed',String(active===i));});if(!front)tooltip.hidden=true;renderer.render(scene,camera);});
}catch(error){console.error(error);status.textContent='WebGL is unavailable. Use a browser with WebGL enabled, or download the GLB below.';}


