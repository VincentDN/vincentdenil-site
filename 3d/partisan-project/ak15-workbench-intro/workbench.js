// Workbench intro: an over-the-shoulder opening shot in the style of The Last of Us Part II's
// workbench. The operator from the AK customiser leans over a table with the rifle lying flat,
// hands on it. "Start customising" pushes the camera in on the rifle, fades to black and hands
// over to the normal 3D viewer at /3d/partisan-project/ak15-weapon-customiser/.
// Scene space: operator's feet on y=0 facing +z, right side -x (see operator.js); meters.
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {MODELS,DEFAULT_MODEL} from '../ak15-weapon-customiser/models.js';
import {DEFAULT_OPERATOR,buildOperator} from '../ak15-weapon-customiser/operator.js';
import {solveArm} from '../ak15-weapon-customiser/field.js';
import {Music} from '../ak15-weapon-customiser/music.js';

const CUSTOMISER='../ak15-weapon-customiser/';
const TABLE={top:.86,x:[-.95,.95],z:[.24,1.04]};
const RIFLE_AT=new T.Vector3(.04,0,.47);// x/z on the table; y comes from the rifle's own thickness
// Camera behind and above the right shoulder, looking down at the rifle.
const SHOT={position:new T.Vector3(-.52,1.84,.06),target:new T.Vector3(.04,.88,.47)};
const PUSH_IN={duration:1.9,fadeAt:.75};// seconds; the fade starts at this fraction of the push
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Music: Abdulena, sharing the customiser's on/off and volume setting ----------
// Always Abdulena here, whatever track the customiser last played; it carries on playing
// into the customiser (music.js hands the position over) when that track is selected there.
const MUSIC_KEY='ak-customiser-music-v2';
const musicPrefs=(()=>{const base={on:true,volume:.4};try{return {...base,...JSON.parse(localStorage.getItem(MUSIC_KEY)||'{}')};}catch{return base;}})();
const music=new Music(),musicButton=document.querySelector('#music-toggle');
music.setVolume(musicPrefs.volume);music.setTrack('abdulena');
function saveMusic(){try{const saved=JSON.parse(localStorage.getItem(MUSIC_KEY)||'{}');localStorage.setItem(MUSIC_KEY,JSON.stringify({...saved,on:musicPrefs.on}));}catch{}}
const showMusic=()=>musicButton.setAttribute('aria-pressed',String(musicPrefs.on));showMusic();
// Browsers block sound until a gesture, so the first click or key press starts it.
function firstGesture(e){if(e.target===musicButton)return;stopWaiting();if(musicPrefs.on)music.start(1.5);}
function stopWaiting(){removeEventListener('pointerdown',firstGesture,true);removeEventListener('keydown',firstGesture,true);}
addEventListener('pointerdown',firstGesture,true);addEventListener('keydown',firstGesture,true);
if(musicPrefs.on)music.start(1.5).then(playing=>{if(playing)stopWaiting();});
musicButton.onclick=()=>{stopWaiting();if(musicPrefs.on&&!music.audible()){music.start(1.5);return;}musicPrefs.on=!musicPrefs.on;musicPrefs.on?music.start():music.stop();saveMusic();showMusic();};

const stage=document.querySelector('#stage'),status=document.querySelector('#status'),start=document.querySelector('#start'),fade=document.querySelector('#fade');
const renderer=new T.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;stage.append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color(0x07090a);scene.fog=new T.Fog(0x07090a,2.2,5);
const camera=new T.PerspectiveCamera(42,1,.05,20);camera.position.copy(SHOT.position);camera.lookAt(SHOT.target);

// ---------- Lighting: one warm work lamp, a cold fill, a dim HDR for the metal ----------
scene.add(new T.HemisphereLight(0x4a5a66,0x120d08,.35));
const lamp=new T.SpotLight(0xffc98a,26,4,.62,.55,2);lamp.position.set(.42,1.62,.78);lamp.target.position.set(.02,TABLE.top,.6);
lamp.castShadow=true;lamp.shadow.mapSize.set(2048,2048);lamp.shadow.bias=-.0004;lamp.shadow.normalBias=.01;scene.add(lamp,lamp.target);
const fill=new T.DirectionalLight(0x6f8fb0,.35);fill.position.set(-1.5,2,-1);scene.add(fill);
new RGBELoader().load('../ak15-weapon-customiser/lighting/studio.hdr',hdr=>{hdr.mapping=T.EquirectangularReflectionMapping;scene.environment=hdr;scene.environmentIntensity=.28;});

// ---------- Room and bench (original low-poly geometry) ----------
const std=(color,roughness=.85,extra={})=>new T.MeshStandardMaterial({color,roughness,...extra});
function woodTexture(){
 const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');
 g.fillStyle='#6b5238';g.fillRect(0,0,512,256);
 for(let i=0;i<150;i++){const y=Math.random()*256;g.strokeStyle=`rgba(${Math.random()<.5?'40,26,14':'150,118,82'},${.08+Math.random()*.18})`;g.lineWidth=.5+Math.random()*2;g.beginPath();g.moveTo(0,y);for(let x=0;x<=512;x+=32)g.lineTo(x,y+Math.sin(x/70+i)*3);g.stroke();}
 for(let i=0;i<40;i++){g.fillStyle=`rgba(20,14,8,${Math.random()*.25})`;g.beginPath();g.ellipse(Math.random()*512,Math.random()*256,4+Math.random()*30,2+Math.random()*10,0,0,Math.PI*2);g.fill();}// stains
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;return t;
}
const mesh=(geo,material,[x,y,z],shadow=true)=>{const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m;};
const W=TABLE.x[1]-TABLE.x[0],D=TABLE.z[1]-TABLE.z[0],CX=(TABLE.x[0]+TABLE.x[1])/2,CZ=(TABLE.z[0]+TABLE.z[1])/2;
mesh(new T.BoxGeometry(W,.05,D),std(0xffffff,.78,{map:woodTexture()}),[CX,TABLE.top-.025,CZ]);
for(const x of [TABLE.x[0]+.06,TABLE.x[1]-.06])for(const z of [TABLE.z[0]+.06,TABLE.z[1]-.06])mesh(new T.BoxGeometry(.07,TABLE.top-.05,.07),std(0x3b2c1f),[x,(TABLE.top-.05)/2,z]);
mesh(new T.PlaneGeometry(8,8).rotateX(-Math.PI/2),std(0x1b1d1e,.95),[0,0,0],false);
mesh(new T.PlaneGeometry(6,3),std(0x2b2f2c,.95),[0,1.5,TABLE.z[1]+.05],false);// back wall
mesh(new T.BoxGeometry(1.4,.8,.015),std(0x4a3f30,.9),[.1,1.42,TABLE.z[1]+.035],false);// pegboard
// Props: screwdriver, file, rag, ammo tin, power strip with a lit switch.
const tools=std(0x3a3f44,.45,{metalness:.7});
const driver=new T.Group();driver.add(new T.Mesh(new T.CylinderGeometry(.014,.016,.11,8).rotateZ(Math.PI/2),std(0x3f4b3a,.6)),new T.Mesh(new T.CylinderGeometry(.004,.004,.12,6).rotateZ(Math.PI/2).translate(.115,0,0),tools));
driver.position.set(-.2,TABLE.top+.016,.98);driver.rotation.y=.25;driver.traverse(m=>{if(m.isMesh)m.castShadow=true;});scene.add(driver);
mesh(new T.BoxGeometry(.2,.008,.025),tools,[-.52,TABLE.top+.004,.9]).rotation.y=-.4;
const rag=mesh(new T.IcosahedronGeometry(.1,1).scale(1.3,.28,1),std(0x6d6a60,.98,{flatShading:true}),[.6,TABLE.top+.012,.95]);rag.rotation.y=.6;
mesh(new T.BoxGeometry(.18,.1,.1),std(0x3e4a32,.7),[-.68,TABLE.top+.05,.62]).rotation.y=.3;
const strip=mesh(new T.BoxGeometry(.06,.035,.3),std(0x8e9092,.6),[.8,TABLE.top+.018,.5]);strip.rotation.y=-.15;
mesh(new T.BoxGeometry(.03,.012,.03),std(0xff2a1a,.4,{emissive:0xff2a1a,emissiveIntensity:2.5}),[.8,TABLE.top+.04,.4],false);
// The lamp itself: a shade and a glowing bulb above the bench.
mesh(new T.ConeGeometry(.12,.14,10,1,true),std(0x3c4a3f,.6,{side:T.DoubleSide}),[lamp.position.x,lamp.position.y+.05,lamp.position.z],false);
mesh(new T.SphereGeometry(.03,8,6),new T.MeshBasicMaterial({color:0xfff0d0}),[lamp.position.x,lamp.position.y,lamp.position.z],false);

// ---------- Operator, leaning over the bench ----------
const op=buildOperator({...DEFAULT_OPERATOR,headgear:'none',gloves:'none',pack:'none'});
op.root.traverse(m=>{if(m.isMesh)m.castShadow=m.receiveShadow=true;});scene.add(op.root);
const LEAN={hips:.1,spine:.16,chest:.18,neck:.08,head:.42};
function pose(time){
 const breath=reduceMotion?0:Math.sin(time*1.4)*.012;
 for(const [joint,x] of Object.entries(LEAN))op.joints[joint].rotation.x=x+(joint==='chest'?breath:0);
 op.joints.head.rotation.y=-.1+look.x*.12;
 for(const side of ['R','L']){op.joints['upperLeg'+side].rotation.x=-.08;op.joints['lowerLeg'+side].rotation.x=.14;}
 op.root.updateMatrixWorld(true);
}

// ---------- Rifle: lying flat on its side, hands resting on the grip and handguard ----------
function normalize(root,scale){// long axis along +x, muzzle (the slimmer end) at +x, meters, centered
 root.updateMatrixWorld(true);
 let size=new T.Box3().setFromObject(root).getSize(new T.Vector3());
 if(size.z>size.x&&size.z>=size.y)root.rotation.y=Math.PI/2;else if(size.y>size.x&&size.y>size.z)root.rotation.z=Math.PI/2;
 root.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(root);size=bounds.getSize(new T.Vector3());
 const ends=[[Infinity,-Infinity],[Infinity,-Infinity]],v=new T.Vector3();
 root.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);const t=(v.x-bounds.min.x)/size.x,e=t<.12?ends[0]:t>.88?ends[1]:null;if(e){e[0]=Math.min(e[0],v.y);e[1]=Math.max(e[1],v.y);}}});
 if(ends[0][1]-ends[0][0]<ends[1][1]-ends[1][0])root.rotateY(Math.PI);
 root.scale.multiplyScalar(scale);root.updateMatrixWorld(true);
 root.position.sub(new T.Box3().setFromObject(root).getCenter(new T.Vector3()));
 const holder=new T.Group();holder.add(root);return holder;
}
const rifle=new T.Group();scene.add(rifle);// yaw and tilt live here; the model inside lies on its left side
let rifleHalf=0,rifleLength=0;
async function loadRifle(){
 const config=MODELS[DEFAULT_MODEL],gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(CUSTOMISER+config.url.replace('./',''));
 const model=normalize(gltf.scene,config.scale);
 model.rotation.x=Math.PI/2;// top of the rifle points away from the operator, right side up
 model.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});
 model.updateMatrixWorld(true);
 const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3());
 model.position.sub(box.getCenter(new T.Vector3()));
 rifleHalf=size.y/2;rifleLength=size.x;rifle.add(model);
}
// Palm targets along the rifle: grip (right hand) and handguard (left hand), just above the top face.
const HOLD={R:{along:-.2,pole:new T.Vector3(-1,-.2,-.5)},L:{along:.2,pole:new T.Vector3(1,-.4,-.4)}};
function placeRifle(){
 const tilt=look.y*.07;// lift the far edge a touch, as if checking the ejection port
 rifle.position.set(RIFLE_AT.x,TABLE.top+rifleHalf+Math.abs(tilt)*rifleHalf,RIFLE_AT.z);
 rifle.rotation.set(tilt,-.22+look.x*.08,0,'YXZ');rifle.updateMatrixWorld(true);
 for(const [side,h] of Object.entries(HOLD)){
  const target=new T.Vector3(h.along*rifleLength,rifleHalf+.035,-.015).applyMatrix4(rifle.matrixWorld);
  solveArm(op,side,target,h.pole);
 }
}

// ---------- Look (mouse, touch, gamepad) and the push-in ----------
const look={x:0,y:0},want={x:0,y:0};
addEventListener('pointermove',e=>{want.x=e.clientX/innerWidth*2-1;want.y=e.clientY/innerHeight*2-1;});
function pollPad(){
 for(const pad of navigator.getGamepads?.()||[]){
  if(!pad)continue;
  const [x,y]=pad.axes;if(Math.hypot(x,y)>.15){want.x=x;want.y=y;}
  if(pad.buttons[0]?.pressed||pad.buttons[9]?.pressed)begin();
 }
}
let push=null;
function begin(){
 if(push||start.disabled)return;
 start.disabled=true;document.body.classList.add('leaving');
 const focus=rifle.getWorldPosition(new T.Vector3());
 push={start:performance.now()/1000,from:camera.position.clone(),fromTarget:currentTarget.clone(),to:focus.clone().add(new T.Vector3(-.08,.3,-.16)),toTarget:focus,faded:false};
 if(reduceMotion)push.start-=PUSH_IN.duration*PUSH_IN.fadeAt;
}
start.addEventListener('click',begin);
addEventListener('keydown',e=>{if(e.key==='e'||e.key==='E'||(e.key==='Enter'&&document.activeElement!==start))begin();});
// Coming back with the browser's back button restores this page from cache: reset the shot.
addEventListener('pageshow',e=>{if(e.persisted){push=null;start.disabled=false;document.body.classList.remove('leaving');fade.classList.add('clear');clock.getDelta();requestAnimationFrame(frame);}});

const currentTarget=SHOT.target.clone();
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;
 camera.fov=w/h<1?60:42;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

const clock=new T.Clock();
function frame(){
 const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime;
 pollPad();
 const k=1-Math.exp(-dt*(push?1.5:4));look.x+=(want.x-look.x)*k;look.y+=(want.y-look.y)*k;
 pose(time);placeRifle();
 if(push){
  // Wall-clock time, so a slow device still hands over on schedule.
  const t=performance.now()/1000-push.start,u=Math.min(t/PUSH_IN.duration,1),e=ease(u);
  camera.position.lerpVectors(push.from,push.to,e);currentTarget.lerpVectors(push.fromTarget,push.toTarget,e);
  if(u>=PUSH_IN.fadeAt&&!push.faded){push.faded=true;fade.classList.remove('clear');}
  // Fully black: stop rendering so the main thread is free for the navigation.
  if(t>=PUSH_IN.duration+.5){music.handoff();location.href=CUSTOMISER;return;}
 }else{
  const sway=reduceMotion?0:Math.sin(time*.6)*.006;
  camera.position.set(SHOT.position.x+look.x*.05,SHOT.position.y-look.y*.03+sway,SHOT.position.z);
  currentTarget.set(SHOT.target.x+look.x*.1,SHOT.target.y-look.y*.06,SHOT.target.z);
 }
 camera.lookAt(currentTarget);
 renderer.render(scene,camera);
 requestAnimationFrame(frame);
}

loadRifle().then(()=>{
 status.hidden=true;start.disabled=false;start.focus({preventScroll:true});
 requestAnimationFrame(frame);requestAnimationFrame(()=>fade.classList.add('clear'));
}).catch(err=>{status.textContent='Could not load the rifle: '+err.message;fade.classList.add('clear');});
