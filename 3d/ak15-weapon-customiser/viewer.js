import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildStandIn} from './stand-in.js';

// Sketchfab "Low Poly AK-15" by its author (see README for licence/attribution).
// Drop the GLB download here, or unzip the glTF download into ./model/ as-is.
const MODEL_URLS=['./model/ak-15.glb','./model/scene.gltf'];
const SOURCE_URL='https://sketchfab.com/3d-models/low-poly-ak-15-k-68725380dd654391bb6b751e888e2c44';
// Downloaded models are rescaled to the real rifle's overall length (stock extended).
const OVERALL_LENGTH=.94;
const accent=0xef8f39;

const stage=document.querySelector('#stage'),status=document.querySelector('#status'),detail=document.querySelector('#detail');
const scene=new T.Scene();
let renderer,camera,controls,model,parts=[],sockets=[],selected=null,spinning=false;

// Sources differ in orientation; lay the longest axis along x, then center on the origin.
function normalize(root){
 root.updateMatrixWorld(true);
 let size=new T.Box3().setFromObject(root).getSize(new T.Vector3());
 if(size.z>size.x&&size.z>=size.y)root.rotation.y=Math.PI/2;
 else if(size.y>size.x&&size.y>size.z)root.rotation.z=Math.PI/2;
 root.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(root);size=bounds.getSize(new T.Vector3());
 // The muzzle is the slimmer end: compare vertical extent in the first and last 12% of length.
 const ends=[[Infinity,-Infinity],[Infinity,-Infinity]],v=new T.Vector3();
 root.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);const t=(v.x-bounds.min.x)/size.x,e=t<.12?ends[0]:t>.88?ends[1]:null;if(e){e[0]=Math.min(e[0],v.y);e[1]=Math.max(e[1],v.y);}}});
 if(ends[0][1]-ends[0][0]<ends[1][1]-ends[1][0])root.rotateY(Math.PI);
 root.updateMatrixWorld(true);
 root.scale.multiplyScalar(OVERALL_LENGTH/size.x);
 root.updateMatrixWorld(true);
 const center=new T.Box3().setFromObject(root).getCenter(new T.Vector3());
 const holder=new T.Group();holder.add(root);root.position.sub(center);return holder;
}

async function loadSource(){
 for(const url of MODEL_URLS){
  const head=await fetch(url,{method:'HEAD'}).catch(()=>null);
  if(!head?.ok)continue;
  const gltf=await new GLTFLoader().loadAsync(url);
  const root=gltf.scene;
  // Each named top-level node becomes a selectable part; attachment sockets are calibrated in step 2.
  const found=[];
  root.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;}});
  // Skip exporter wrapper nodes (Sketchfab nests several single-child roots).
  let top=root;while(top.children.length===1&&top.children[0].children.length)top=top.children[0];
  for(const node of top.children){
   const objects=[];node.traverse(o=>{if(o.isMesh)objects.push(o);});
   if(objects.length)found.push({id:node.uuid,label:node.name?node.name.replace(/_+/g,' '):`Part ${found.length+1}`,detail:'Part from the source model.',objects});
  }
  return {root,parts:found,sockets:[],source:'model'};
 }
 return {...buildStandIn(),source:'stand-in'};
}

function select(id){
 selected=selected===id?null:id;
 const part=parts.find(p=>p.id===selected);
 const highlighted=new Set(part?.objects||[]);
 model.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.setHex(highlighted.has(o)?accent:0);o.material.emissiveIntensity=highlighted.has(o)?.35:0;}});
 for(const p of parts)p.entry.setAttribute('aria-pressed',String(p.id===selected));
 detail.textContent=part?part.detail:'Select a part on the model or in this list to highlight it.';
}

try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;stage.prepend(renderer.domElement);
 camera=new T.PerspectiveCamera(35,1,.01,20);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.15;controls.maxDistance=3.5;controls.enablePan=true;
 scene.add(new T.HemisphereLight(0xeef3ff,0x3a3230,1.6));
 const key=new T.DirectionalLight(0xfff1df,3.2);key.position.set(.8,2,1.4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-.7,right:.7,top:.7,bottom:-.7,near:.5,far:5});key.shadow.normalBias=.01;scene.add(key);
 const rim=new T.DirectionalLight(0x9fc4ff,1.4);rim.position.set(-1.5,.8,-1.2);scene.add(rim);

 const source=await loadSource();
 model=normalize(source.root);parts=source.parts;sockets=source.sockets;scene.add(model);
 // Clone materials so highlighting and wireframe only touch this model's meshes.
 model.traverse(o=>{if(o.isMesh)o.material=o.material.clone();});
 const box=new T.Box3().setFromObject(model);
 const floor=new T.Mesh(new T.PlaneGeometry(4,4),new T.ShadowMaterial({opacity:.28}));floor.rotation.x=-Math.PI/2;floor.position.y=box.min.y-.002;floor.receiveShadow=true;scene.add(floor);

 document.querySelector('#source').innerHTML=source.source==='model'
  ?`Model: <a href="${SOURCE_URL}">Low Poly AK-15 on Sketchfab</a>, scaled to ${OVERALL_LENGTH*1000} mm.`
  :`Showing a code-built stand-in at ${OVERALL_LENGTH*1000} mm. The <a href="${SOURCE_URL}">Sketchfab model</a> replaces it once added to <code>model/</code>.`;

 for(const part of parts){
  const entry=document.createElement('button');entry.className='part';entry.setAttribute('aria-pressed','false');
  entry.innerHTML='<strong></strong><span></span>';entry.querySelector('strong').textContent=part.label;
  entry.querySelector('span').textContent=sockets.some(s=>s.userData.id===part.id)?'swappable':'';
  entry.onclick=()=>select(part.id);document.querySelector('#parts').append(entry);part.entry=entry;
 }

 const socketLabels=sockets.map(s=>{const el=document.createElement('div');el.className='socket';el.textContent=s.userData.label;el.hidden=true;stage.append(el);return {socket:s,el};});
 const socketMarkers=new T.Group();socketMarkers.visible=false;scene.add(socketMarkers);
 for(const s of sockets){const ring=new T.Mesh(new T.TorusGeometry(.012,.0022,8,24),new T.MeshBasicMaterial({color:accent,depthTest:false}));ring.renderOrder=10;ring.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),s.userData.direction);s.getWorldPosition(ring.position);socketMarkers.add(ring);}
 const socketButton=document.querySelector('#sockets');
 if(!sockets.length){socketButton.disabled=true;socketButton.title='Mount points are calibrated in step 2';}
 socketButton.onclick=e=>{socketMarkers.visible=!socketMarkers.visible;e.currentTarget.setAttribute('aria-pressed',String(socketMarkers.visible));};
 document.querySelector('#spin').onclick=e=>{spinning=!spinning;e.currentTarget.setAttribute('aria-pressed',String(spinning));};
 document.querySelector('#wire').onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';model.traverse(o=>{if(o.isMesh)o.material.wireframe=on;});e.currentTarget.setAttribute('aria-pressed',String(on));};

 const ray=new T.Raycaster(),pointer=new T.Vector2();let down=null;
 function partAt(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObject(model,true)[0];return hit&&parts.find(p=>p.objects.includes(hit.object));}
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
 renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<5){const p=partAt(e);if(p)select(p.id);else if(selected)select(selected);}down=null;});
 renderer.domElement.addEventListener('pointermove',e=>{if(!down)renderer.domElement.style.cursor=partAt(e)?'pointer':'';});

 function view(name){
  const aspect=stage.clientWidth/stage.clientHeight,d=Math.max(1.3,1.6/aspect);
  controls.target.set(0,0,0);
  const at={three:[d*.55,d*.32,d*.8],left:[0,.02,-d],right:[0,.02,d],top:[0,d,.001],muzzle:[d*.9,.06,d*.28]}[name];
  if(name==='muzzle')controls.target.set(.33,0,0);
  camera.position.set(...at);controls.update();
 }
 const resize=()=>{camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);};
 new ResizeObserver(resize).observe(stage);resize();view('three');
 for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>view(b.dataset.view);
 stage.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected)select(selected);if(e.target!==stage)return;const v=camera.position.clone().sub(controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight')v.applyAxisAngle(new T.Vector3(0,1,0),e.key==='ArrowLeft'?.1:-.1);else if(e.key==='ArrowUp'||e.key==='ArrowDown')v.applyAxisAngle(new T.Vector3(1,0,0),e.key==='ArrowUp'?.1:-.1);else if(e.key==='+'||e.key==='=')v.multiplyScalar(.9);else if(e.key==='-')v.multiplyScalar(1.1);else return;e.preventDefault();camera.position.copy(controls.target).add(v);controls.update();});

 status.hidden=true;
 const clock=new T.Clock();
 renderer.setAnimationLoop(()=>{
  const dt=clock.getDelta();
  if(spinning){model.rotation.y+=dt*.5;socketMarkers.rotation.y=model.rotation.y;}
  controls.update();
  for(const {socket,el} of socketLabels){const p=socket.getWorldPosition(new T.Vector3()).project(camera);el.hidden=!socketMarkers.visible||p.z>1;el.style.left=(p.x*.5+.5)*stage.clientWidth+'px';el.style.top=(-p.y*.5+.5)*stage.clientHeight-18+'px';}
  renderer.render(scene,camera);
 });
}catch(err){console.error(err);status.textContent='The viewer could not load. Reload in a browser with WebGL enabled.';}
