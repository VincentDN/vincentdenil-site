import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {formatLength} from './units.js';

// All scene coordinates are meters. Photo-derived assumptions, not a rigging design.
const W=12,H=8,LEFT=6,TOP=38,Z=2.7;
const stage=document.querySelector('#stage'),status=document.querySelector('#status');
const scene=new T.Scene();scene.background=new T.Color('#becdd1');scene.fog=new T.Fog('#becdd1',160,350);
const groups={flag:new T.Group(),mount:new T.Group(),human:new T.Group(),crane:new T.Group()};
Object.values(groups).forEach(g=>scene.add(g));
const annotations=new T.Group();scene.add(annotations);
const material=(color,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
const steel=material('#4f5958',.45),gold=material('#b49c62',.6),concrete=material('#a4aaa3'),orange=material('#ed8c36');
function mesh(geo,mat,pos,parent=scene){const o=new T.Mesh(geo,mat);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(size,pos,mat,parent=scene){return mesh(new T.BoxGeometry(...size),mat,pos,parent);}
function rod(a,b,r,mat,parent=scene){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const o=mesh(new T.CylinderGeometry(r,r,d.length(),10),mat,av.add(bv).multiplyScalar(.5).toArray(),parent);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
function line(points,color,parent=scene){const o=new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p))),new T.LineBasicMaterial({color}));parent.add(o);return o;}

// Quiet industrial setting, sized in meters to make the flag's scale legible.
box([700,.2,700],[0,-.15,0],material('#9da9a5'));
box([64,.05,25],[8,0,0],material('#b5b8ae'));
box([100,.025,7],[8,.02,15],material('#707c7f'));
for(let x=-42;x<58;x+=7)box([3,.03,.12],[x,.04,15],material('#d5d5c5'));
const grid=new T.GridHelper(90,18,'#829491','#a1afaa');grid.position.y=.032;scene.add(grid);
function container(x,z,color){const m=material(color);box([6.06,2.59,2.44],[x,1.3,z],m);for(let i=0;i<24;i++)box([.035,2.42,.07],[x-2.9+i*.25,1.3,z+1.25],m);for(const dx of [-1.48,1.48]){box([2.9,2.4,.035],[x+dx,1.3,z+1.255],m);rod([x+dx,0.25,z+1.3],[x+dx,2.35,z+1.3],.025,steel);}}
container(-12,-5,'#687e80');container(-19,-5,'#8f6250');
box([30,5.5,13],[20,2.75,-22],material('#8e9d9b'));box([31,.3,14],[20,5.6,-22],material('#667b80'));
for(let x=9;x<33;x+=6)box([3,3,.06],[x,2,-15.46],material('#c1c7bd'));
for(const x of [-22,27]){rod([x,0,12],[x,7,12],.065,steel);rod([x,7,12],[x+1.6,7,12],.06,steel);box([.8,.15,.32],[x+1.6,6.95,12],concrete);}

// 1.78 m reference figure with a hard hat; deliberately small at crane scale.
const human=groups.human;human.position.set(5,0,5);
box([.4,.57,.23],[0,1.14,0],orange,human);
for(const x of [-.12,.12]){rod([x,.08,0],[x,.87,0],.073,steel,human);box([.16,.1,.3],[x,.05,.06],steel,human);}
for(const s of [-1,1])rod([s*.24,1.35,0],[s*.31,.88,.04],.055,orange,human);
mesh(new T.SphereGeometry(.115,16,12),material('#b7967d'),[0,1.59,0],human);
mesh(new T.SphereGeometry(.135,16,12,0,Math.PI*2,0,Math.PI/2),gold,[0,1.645,0],human);

// The two upper corners stay fixed while the rest of the cloth drapes freely.
function clothPoint(u,v,t=0,strength=.45){
 const free=1-v,envelope=Math.sin(Math.PI*u);
 const sag=.32*envelope*v*v;
 const wave=strength*(.85*Math.sin(u*18+t*1.5)+.22*Math.sin(u*33-t*.9))*(.12*envelope+.88*free);
 return [LEFT+u*W+.17*strength*Math.sin(t+v*5)*free,TOP-H+v*H-sag-.10*strength*Math.sin(u*16+t)*free,Z+wave+1.2*strength*Math.sin(u*6+t*.8)*free];
}
const geo=new T.PlaneGeometry(W,H,120,80),positions=geo.attributes.position;
const uv=geo.attributes.uv;
const art=document.createElement('canvas');art.width=768;art.height=512;const ctx=art.getContext('2d');
['#ae2436','#eeeae0','#17477f'].forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(0,i*512/3,768,Math.ceil(512/3));});
// Woven thread texture is generated once, avoiding a large artwork dependency.
for(let y=0;y<512;y+=3){ctx.fillStyle=y%2?'#ffffff0a':'#00000008';ctx.fillRect(0,y,768,1);}
for(let x=0;x<768;x+=3){ctx.fillStyle='#ffffff08';ctx.fillRect(x,0,1,512);}
const texture=new T.CanvasTexture(art);texture.colorSpace=T.SRGBColorSpace;
const cloth=mesh(geo,new T.MeshStandardMaterial({map:texture,side:T.DoubleSide,roughness:.96}),[0,0,0],groups.flag);
cloth.name='12 × 8 m Dutch flag, two fixed upper corners';
const seams=[];
for(const inset of [.004,.009]){
 const coords=[];
 for(let i=0;i<=120;i++)coords.push([inset+(1-2*inset)*i/120,inset]);
 for(let i=1;i<=80;i++)coords.push([1-inset,inset+(1-2*inset)*i/80]);
 for(let i=1;i<=120;i++)coords.push([1-inset-(1-2*inset)*i/120,1-inset]);
 for(let i=1;i<=80;i++)coords.push([inset,1-inset-(1-2*inset)*i/80]);
 const seam=line(coords.map(([u,v])=>clothPoint(u,v)),'#dcc9ad',groups.flag);seams.push({seam,coords});
}
for(const x of [LEFT,LEFT+W]){
 // Outboard brackets put the cloth in front of the truss, with short vertical drops.
 rod([x,40.65,-1.7],[x,40.65,1.7],.11,steel,groups.mount);
 rod([x,40.65,.85],[x,40,.85],.09,steel,groups.mount);
 rod([x,40,.85],[x,40,Z],.09,steel,groups.mount);
 box([.42,.2,.38],[x,40,.85],gold,groups.mount);
 rod([x,40,Z],[x,TOP+.15,Z],.026,steel,groups.mount);
 const eye=mesh(new T.TorusGeometry(.12,.026,8,20),gold,[x,TOP+.05,Z],groups.mount);
 eye.name='Upper attachment eye';
}
const dimensions=[
 {id:'width',label:'Flag width',m:W,a:[LEFT,TOP+1.2,Z+1],b:[LEFT+W,TOP+1.2,Z+1],anchor:[12,TOP+1.6,Z+1],group:'flag',detail:'12 m finished width. The upper corners are held 12 m apart beneath the jib.'},
 {id:'height',label:'Flag height',m:H,a:[19.2,30,Z],b:[19.2,38,Z],anchor:[20,34,Z],group:'flag',detail:'8 m nominal fabric height. The free lower edge moves with the breeze.'},
 {id:'hoist',label:'Upper attachment height',m:TOP,a:[23,0,Z],b:[23,TOP,Z],anchor:[24,20,Z],group:'mount',detail:'Upper flag corners are 38 m above grade. Two short drops connect them to outboard jib brackets.'},
 {id:'clearance',label:'Lower edge above grade',m:30,a:[3,0,Z],b:[3,30,Z],anchor:[2,17,Z],group:'flag',detail:'30 m nominal ground clearance. The animated lower edge varies slightly around this height.'},
 {id:'jib',label:'Crane jib elevation',m:40,a:[-5,0,0],b:[-5,40,0],anchor:[-6,25,0],group:'crane',detail:'40 m nominal jib elevation; the top of the lattice is approximately 42.4 m. Source model proportions have been adapted.'},
 {id:'human',label:'Human reference',m:1.78,a:[5.8,0,5],b:[5.8,1.78,5],anchor:[5,3,5],group:'human',detail:'A 1.78 m person beside the crane. Use the Flag or Crane view to compare the scales.'}
];
let units='metric',selected=null,showDimensions=true,ready=false,motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer,camera,controls,craneModel;
const labels=[];
function value(d){return formatLength(d.m,units);}
function updateUnits(){for(const l of labels){l.button.textContent=value(l.d);l.button.setAttribute('aria-label',`${l.d.label}: ${value(l.d)}`);l.entry.querySelector('strong').textContent=value(l.d);}document.querySelectorAll('[data-units]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.units===units)));document.querySelector('#intro').textContent=`A ${formatLength(W,units)} × ${formatLength(H,units)} flag, suspended beneath a tower crane. Two upper attachment points. One very large canvas.`;}
function select(id){selected=selected===id?null:id;const spec=dimensions.find(d=>d.id===selected);document.querySelector('#detail').textContent=spec?.detail||'Select a measurement to highlight it in the scene.';for(const l of labels){const active=l.d.id===selected;l.button.setAttribute('aria-pressed',String(active));l.entry.setAttribute('aria-pressed',String(active));l.lines.material.color.set(active?'#e3812e':'#4e6871');}for(const [key,g] of Object.entries(groups))g.traverse(o=>{if(o.isMesh){for(const m of Array.isArray(o.material)?o.material:[o.material])if(m.emissive){m.emissive.set('#e3812e');m.emissiveIntensity=spec?.group===key ? .16 : 0;}}});}
for(const d of dimensions){
 const a=new T.Vector3(...d.a),b=new T.Vector3(...d.b),tick=new T.Vector3(d.id==='width'?0:.25,d.id==='width'?.25:0,0);
 const lines=new T.LineSegments(new T.BufferGeometry().setFromPoints([a,b,a.clone().sub(tick),a.clone().add(tick),b.clone().sub(tick),b.clone().add(tick)]),new T.LineBasicMaterial({color:'#4e6871',depthTest:false,transparent:true,opacity:.7}));annotations.add(lines);
 const button=document.createElement('button');button.className='marker';button.hidden=true;button.setAttribute('aria-pressed','false');button.onclick=()=>select(d.id);stage.append(button);
 const entry=document.createElement('button');entry.className='measurement';entry.innerHTML=`<span>${d.label}</span><strong></strong>`;entry.setAttribute('aria-pressed','false');entry.onclick=()=>select(d.id);document.querySelector('#measurements').append(entry);labels.push({d,button,entry,lines});
}
updateUnits();document.querySelectorAll('[data-units]').forEach(b=>b.onclick=()=>{units=b.dataset.units;updateUnits();});
document.querySelector('#motion').setAttribute('aria-pressed',String(motion));
document.querySelector('#motion').onclick=e=>{motion=!motion;e.currentTarget.setAttribute('aria-pressed',String(motion));};
document.querySelector('#dimensions').onclick=e=>{showDimensions=!showDimensions;annotations.visible=showDimensions;e.currentTarget.setAttribute('aria-pressed',String(showDimensions));};
document.querySelector('#person').onclick=e=>{human.visible=!human.visible;e.currentTarget.setAttribute('aria-pressed',String(human.visible));labels.find(l=>l.d.id==='human').lines.visible=human.visible;};
function deform(t){const strength=Number(document.querySelector('#wind').value);for(let i=0;i<positions.count;i++)positions.setXYZ(i,...clothPoint(uv.getX(i),uv.getY(i),t,strength));positions.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();for(const {seam,coords} of seams){const p=seam.geometry.attributes.position;coords.forEach(([u,v],i)=>{const pt=clothPoint(u,v,t,strength);pt[2]+=.012;p.setXYZ(i,...pt);});p.needsUpdate=true;seam.geometry.computeBoundingSphere();}}
try{
 renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;stage.prepend(renderer.domElement);
 camera=new T.PerspectiveCamera(40,1,.1,700);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.8;controls.maxDistance=180;controls.maxPolarAngle=Math.PI*.495;
 scene.add(new T.HemisphereLight('#f6eee0','#71888a',2.4));const sun=new T.DirectionalLight('#fff1da',3);sun.position.set(-30,70,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-60,right:60,top:60,bottom:-60,near:1,far:170});sun.shadow.normalBias=.05;scene.add(sun);
 function resize(){camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);}
 new ResizeObserver(resize).observe(stage);resize();
 function view(name){const portrait=Math.max(1,1/camera.aspect);let target,pos;if(name==='flag'){target=[12,34,Z];pos=[17,36,Z+25*portrait];}else if(name==='mount'){target=[6,38.9,2];pos=[9,40,8*portrait];}else if(name==='front'){target=[12,23,0];pos=[12,25,88*portrait];}else{target=[11,23,0];pos=[60*portrait,40+15*portrait,86*portrait];}controls.target.set(...target);camera.position.set(...pos);controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));}
 view('crane');document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));
 stage.addEventListener('keydown',e=>{if(e.target!==stage)return;const v=camera.position.clone().sub(controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight')v.applyAxisAngle(new T.Vector3(0,1,0),e.key==='ArrowLeft'?.1:-.1);else if(e.key==='ArrowUp'||e.key==='ArrowDown')v.y+=e.key==='ArrowUp'?2:-2;else if(e.key==='+'||e.key==='=')v.multiplyScalar(.9);else if(e.key==='-')v.multiplyScalar(1.1);else return;e.preventDefault();camera.position.copy(controls.target).add(v);controls.update();});
 const gltf=await new GLTFLoader().loadAsync('./models/crane.glb');craneModel=gltf.scene;groups.crane.add(craneModel);craneModel.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material=o.material.clone();}});
 // Independent materials keep measurement highlighting local to each group.
 for(const g of Object.values(groups))g.traverse(o=>{if(o.isMesh)o.material=o.material.clone();});
 deform(0);ready=true;status.hidden=true;
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.classList.remove('viewer-loading');status.textContent='Graphics context lost. Reload to reopen the viewer.';});
 let t=0,last=0;
 renderer.setAnimationLoop(now=>{const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(motion)t+=dt;deform(t);controls.update();camera.updateMatrixWorld();const occupied=[];for(const {d,button} of labels){const p=new T.Vector3(...d.anchor).project(camera);button.hidden=!ready||!showDimensions||p.z>1||p.z<-1||Math.abs(p.x)>.94||Math.abs(p.y)>.94||(d.id==='human'&&!human.visible);if(!button.hidden){const x=(p.x*.5+.5)*stage.clientWidth,y=(-p.y*.5+.5)*stage.clientHeight;const rect={x,y,w:button.offsetWidth+10,h:button.offsetHeight+6};if(occupied.some(r=>Math.abs(r.x-x)<(r.w+rect.w)/2&&Math.abs(r.y-y)<(r.h+rect.h)/2))button.hidden=true;else{occupied.push(rect);button.style.left=x+'px';button.style.top=y+'px';}}}renderer.render(scene,camera);});
}catch(err){console.error(err);status.classList.remove('viewer-loading');status.textContent='The 3D scene could not load. Check your connection and WebGL support, then reload.';}
