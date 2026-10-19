import {formatLength} from './units.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const stage=document.querySelector('#stage'),status=document.querySelector('#status');
// Meters. Flag: 72 x 24 in, hoist on the pole side, tapering to 9 in across the tails.
const IN=.0254,L=72*IN,FH=24*IN,TAILS=9*IN,POLE_TOP=2.62,TOPY=2.4,FX=.03,POLE_R=.0127;
const TABS=[[0,6,'#e8b923'],[9,15,'#1d7fc0'],[18,24,'#d62d20']];
const scene=new T.Scene(),world=new T.Group();scene.add(world);
scene.fog=new T.Fog('#bcd6e6',28,95);
const mat=(color,roughness=.85,extra={})=>new T.MeshStandardMaterial({color,roughness,...extra});
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};}
const rand=rng(7);
function add(g,m,p=[0,0,0],parent=world){const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function canvasTexture(w,h,draw,repeat){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;if(repeat){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(...repeat);}return t;}
// Ground: mown grass with a trodden clearing.
const grass=canvasTexture(512,512,(g,w,h)=>{g.fillStyle='#5f8a3f';g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){const s=rand();g.fillStyle=s<.5?'#6f9a48':s<.8?'#527a35':'#7aa353';g.fillRect(rand()*w,rand()*h,2,5);}},[60,60]);
const ground=add(new T.CircleGeometry(90,64),mat('#ffffff',1,{map:grass}));ground.rotation.x=-Math.PI/2;ground.castShadow=false;
const dirt=add(new T.CircleGeometry(4.2,48),mat('#8a7655',1));dirt.rotation.x=-Math.PI/2;dirt.position.y=.004;dirt.castShadow=false;
// Sky dome and distant hills.
const sky=new T.Mesh(new T.SphereGeometry(120,32,16),new T.MeshBasicMaterial({side:T.BackSide,fog:false,map:canvasTexture(8,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#5d93c8');gr.addColorStop(.55,'#a8cce4');gr.addColorStop(1,'#e4eef0');g.fillStyle=gr;g.fillRect(0,0,w,h);})}));scene.add(sky);
for(const [x,z,r,c] of [[-60,-70,38,'#5c7a4a'],[30,-85,46,'#6a8754'],[75,-40,34,'#587446'],[-85,-20,40,'#667f50']]){const h=add(new T.SphereGeometry(r,24,12,0,Math.PI*2,0,Math.PI/2),mat(c,1),[x,0,z]);h.scale.y=.45;h.castShadow=false;}
// Trees.
function tree(x,z,s=1){const t=add(new T.CylinderGeometry(.18*s,.28*s,2.4*s,8),mat('#5b4330'),[x,1.2*s,z]);for(const [dy,r] of [[3,1.7],[4.1,1.35],[5.1,.95]]){const f=add(new T.IcosahedronGeometry(r*s,1),mat(rand()<.5?'#3f6b34':'#4a7a3a',.95),[x+(rand()-.5)*.3,dy*s,z+(rand()-.5)*.3]);}}
for(let i=0;i<22;i++){const a=rand()*Math.PI*2,r=17+rand()*28;tree(Math.cos(a)*r,Math.sin(a)*r-6,.9+rand()*.7);}
// Camp: two wedge tents, a striped pavilion, fire pit, barrels and crates.
const canvasMat=mat('#d9ceb0',.95,{side:T.DoubleSide});
function wedgeTent(x,z,rot,w=3.2,h=2.1,d=4.4,color){const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});g.translate(0,0,-d/2);const m=add(g,color?mat(color,.95,{side:T.DoubleSide}):canvasMat,[x,0,z]);m.rotation.y=rot;add(new T.CylinderGeometry(.03,.03,d+.5,8),mat('#5b4330'),[0,h+.02,0],m).rotation.x=Math.PI/2;}
wedgeTent(-8.2,-3,.5,3.2,2.1,4.4);wedgeTent(-11,-7.5,.1,3,2,4.2,'#c9b98c');
const stripes=canvasTexture(256,8,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#e8dfc6':'#9b2d24';g.fillRect(i*32,0,32,h);}},[3,1]);
const pav=new T.Group();pav.position.set(10,0,-5);world.add(pav);
add(new T.CylinderGeometry(2.2,2.2,1.6,24,1,true),mat('#ffffff',.95,{map:stripes,side:T.DoubleSide}),[0,.8,0],pav);
add(new T.ConeGeometry(2.55,2.3,24,1,true),mat('#ffffff',.95,{map:stripes,side:T.DoubleSide}),[0,2.75,0],pav);
add(new T.CylinderGeometry(.03,.03,1.2,8),mat('#5b4330'),[0,4.5,0],pav);add(new T.SphereGeometry(.07,12,8),mat('#d6a31e',.4),[0,5.12,0],pav);
const firePos=[3.6,0,2.2];
for(let i=0;i<10;i++){const a=i/10*Math.PI*2;add(new T.IcosahedronGeometry(.13,0),mat('#7d7b76',.9),[firePos[0]+Math.cos(a)*.5,.08,firePos[2]+Math.sin(a)*.5]);}
for(let i=0;i<3;i++){const l=add(new T.CylinderGeometry(.05,.05,.7,8),mat('#4a3626'),[firePos[0],.12,firePos[2]]);l.rotation.z=Math.PI/2;l.rotation.y=i*1.05;}
const flame=add(new T.ConeGeometry(.13,.34,10),new T.MeshBasicMaterial({color:'#ff9a2e'}),[firePos[0],.3,firePos[2]]);flame.castShadow=false;
const fireLight=new T.PointLight('#ff9a50',2.2,5);fireLight.position.set(firePos[0],.7,firePos[2]);world.add(fireLight);
for(const [x,z] of [[-6.3,-1.2],[-6.85,-.95]])add(new T.CylinderGeometry(.28,.25,.7,14),mat('#8a6238',.8),[x,.35,z]);
for(const [x,z,r] of [[-9.6,-.7,.2],[-9.9,-.4,.9]]){const c=add(new T.BoxGeometry(.6,.45,.45),mat('#9a7547',.85),[x,.225,z]);c.rotation.y=r;}
// Standard: finial pole, three crenulated sleeve tabs, tapered swallow-tail flag.
const pole=new T.Group();world.add(pole);
add(new T.CylinderGeometry(POLE_R,POLE_R,POLE_TOP+.4,16),mat('#8a6a43',.7),[0,(POLE_TOP-.4)/2,0],pole);
add(new T.CylinderGeometry(.02,.02,.05,16),mat('#d6a31e',.35),[0,POLE_TOP+.02,0],pole);
add(new T.SphereGeometry(.026,16,12),mat('#d6a31e',.35),[0,POLE_TOP+.07,0],pole);
const spear=add(new T.ConeGeometry(.032,.2,4),mat('#cfd3d4',.25,{metalness:.7}),[0,POLE_TOP+.19,0],pole);spear.rotation.y=Math.PI/4;
const tabMeshes=[];
for(const [a,b,color] of TABS){const h=(b-a)*IN,cy=TOPY-(a+b)/2*IN;
 const tube=add(new T.CylinderGeometry(POLE_R+.0038,POLE_R+.0038,h,24,1,true),mat(color,.8,{side:T.DoubleSide}),[0,cy,0]);
 const flap=add(new T.BoxGeometry(FX,h,.003),mat(color,.8),[FX/2,cy,0]);tabMeshes.push(tube,flap);}
const tex=await new T.TextureLoader().loadAsync('./flag.webp');tex.colorSpace=T.SRGBColorSpace;
const clothMat=mat('#ffffff',.78,{map:tex,alphaTest:.5,side:T.DoubleSide});
const geo=new T.PlaneGeometry(L,FH,144,48);geo.translate(L/2+FX,TOPY-FH/2,0);
const base=geo.attributes.position.array.slice();
const flag=new T.Mesh(geo,clothMat);flag.castShadow=true;flag.receiveShadow=true;
flag.customDepthMaterial=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,map:tex,alphaTest:.5});
world.add(flag);
let wind=true,clock=0;
function ripple(t){const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x0=base[i*3]-FX,u=Math.max(0,x0/L),amp=wind?.09:.03;
 const ph=u*7.5-t*2.6;p.setZ(i,amp*Math.pow(u,1.15)*Math.sin(ph)+.015*u*Math.sin(base[i*3+1]*9+t));
 p.setY(i,base[i*3+1]-(wind?.025:.06)*u*u+.012*u*Math.cos(ph));}
 p.needsUpdate=true;geo.computeVertexNormals();}
ripple(0);
let renderer,camera,controls,ready=false,showDimensions=true,selected=null,units='imperial';
const labels=[],annotations=new T.Group();scene.add(annotations);
// Dimensions.
const flagTopFringeY=TOPY-7.5*IN,flagBottomFringeY=TOPY-16.5*IN;
const dimensions=[
 {id:'length',label:'Flag length',meters:L,anchor:[FX+L/2,TOPY+.2,.02],a:[FX,TOPY+.14,.02],b:[FX+L,TOPY+.14,.02]},
 {id:'hoist',label:'Hoist edge',meters:FH,anchor:[-.18,TOPY-FH/2,.02],a:[-.1,TOPY-FH,.02],b:[-.1,TOPY,.02]},
 {id:'tails',label:'Across the tails',meters:TAILS,anchor:[FX+L+.2,TOPY-12*IN,.02],a:[FX+L+.09,flagBottomFringeY,.02],b:[FX+L+.09,flagTopFringeY,.02]},
 {id:'pole',label:'Pole above ground',meters:POLE_TOP,anchor:[.3,1.15,.02],a:[.18,0,.02],b:[.18,POLE_TOP,.02]},
 {id:'human',label:'Vincent for Scale',meters:1.778,anchor:[-.8,.2,.55],a:[-1.2,0,.55],b:[-1.2,1.778,.55]}
];
const length=m=>formatLength(m,units);
function valueOf(s){return s.id==='human'&&units==='imperial'?'5ft10in (70in)':s.id==='tails'&&units==='imperial'?'0.75ft (9in)':s.id==='hoist'&&units==='imperial'?'2ft (24in)':s.id==='length'&&units==='imperial'?'6ft (72in)':length(s.meters);}
function detailText(id){return {
 length:`Overall length ${valueOf(dimensions[0])}, hoist to the tips of the tails.`,
 hoist:`Hoist edge ${valueOf(dimensions[1])}, carried by three 6in sleeve tabs with 3in gaps, wrapped around the pole. The top tab is open at the top so the pole and finial slide through.`,
 tails:`Total width across the two swallow tails: ${valueOf(dimensions[2])} (two 3.5in tails with a 2in notch gap). The notch is 12in deep.`,
 pole:`Illustrative finial pole, ${length(POLE_TOP)} above ground, Ø${length(.0254)}. Not part of the order.`,
 human:`Vincent for Scale — ${length(1.778)}. A flat dark-grey silhouette standing next to the pole.`
 }[id];}
const list=document.querySelector('#measurements');
function select(id){selected=selected===id?null:id;document.querySelector('#detail').textContent=selected?detailText(selected):'Select a measurement on the model or in this list to highlight its geometry and dimension lines.';for(const l of labels){const on=l.spec.id===selected;l.button.setAttribute('aria-pressed',String(on));l.entry.setAttribute('aria-pressed',String(on));l.line.material.color.set(on?'#ffffff':'#e0a526');}}
for(const spec of dimensions){const a=new T.Vector3(...spec.a),b=new T.Vector3(...spec.b),horizontal=Math.abs(a.x-b.x)>.1,tick=new T.Vector3(horizontal?0:.04,horizontal?.04:0,0);
 const line=new T.LineSegments(new T.BufferGeometry().setFromPoints([a,b,a.clone().sub(tick),a.clone().add(tick),b.clone().sub(tick),b.clone().add(tick)]),new T.LineBasicMaterial({color:'#e0a526',depthTest:false}));line.renderOrder=5;annotations.add(line);
 const button=document.createElement('button');button.className='marker';button.onclick=()=>select(spec.id);button.setAttribute('aria-pressed','false');stage.append(button);
 const entry=document.createElement('button');entry.className='measurement';entry.setAttribute('aria-pressed','false');entry.innerHTML=`<span>${spec.label}</span><strong></strong>`;entry.onclick=()=>select(spec.id);list.append(entry);
 labels.push({spec,button,entry,line});}
function updateUnits(){for(const {spec,button,entry} of labels){const v=valueOf(spec);button.textContent=v;button.setAttribute('aria-label',spec.label+': '+v);entry.querySelector('strong').textContent=v;}
 for(const b of document.querySelectorAll('[data-units]'))b.setAttribute('aria-pressed',String(b.dataset.units===units));
 document.querySelector('#intro').textContent=`A ${length(L)} × ${length(FH)} swallow-tail standard on a finial pole in a medieval re-enactment camp, with a flat dark-grey Vincent silhouette for scale.`;
 if(selected)document.querySelector('#detail').textContent=detailText(selected);}
for(const b of document.querySelectorAll('[data-units]'))b.onclick=()=>{units=b.dataset.units;updateUnits();};
updateUnits();
try{
 renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.outputColorSpace=T.SRGBColorSpace;stage.prepend(renderer.domElement);
 camera=new T.PerspectiveCamera(42,1,.02,300);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.4;controls.maxDistance=30;controls.maxPolarAngle=Math.PI*.495;
 scene.add(new T.HemisphereLight(0xdcecff,0x6b7f55,1.5));
 const sun=new T.DirectionalLight(0xfff0d2,3.2);sun.position.set(-6,10,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:40});sun.shadow.bias=-.0004;scene.add(sun);
 const views={field:{p:[4.8,2.0,6.4],t:[.8,1.6,0]},flag:{p:[1.1,2.15,2.1],t:[.95,2.1,0]},front:{p:[.9,1.7,4.6],t:[.9,1.7,0]}};
 function view(n){const v=views[n];camera.position.set(...v.p);controls.target.set(...v.t);controls.update();}
 const resize=()=>{camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);};new ResizeObserver(resize).observe(stage);resize();view(views[location.hash.slice(1)]?location.hash.slice(1):'field');
 for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>view(b.dataset.view);
 document.querySelector('#wind').onclick=e=>{wind=!wind;e.currentTarget.setAttribute('aria-pressed',String(wind));};
 document.querySelector('#dimensions').onclick=e=>{showDimensions=!showDimensions;e.currentTarget.setAttribute('aria-pressed',String(showDimensions));annotations.visible=showDimensions;};
 stage.addEventListener('keydown',e=>{if(e.key==='Escape')select(selected);if(e.target!==stage)return;const v=camera.position.clone().sub(controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight')v.applyAxisAngle(new T.Vector3(0,1,0),e.key==='ArrowLeft'?.1:-.1);else if(e.key==='+'||e.key==='=')v.multiplyScalar(.9);else if(e.key==='-')v.multiplyScalar(1.1);else return;e.preventDefault();camera.position.copy(controls.target.clone().add(v));});
 // Vincent: traced planar silhouette, 1.778 m (5 ft 10 in).
 const data=await (await fetch('./vincent-silhouette.json')).json();
 const rings=data.rings.map(r=>r.map(p=>new T.Vector2(...p)));
 const outlines=rings.filter(r=>T.ShapeUtils.isClockWise(r)),shapes=outlines.map(r=>new T.Shape(r));
 const inside=(r,p)=>{let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)c=!c;}return c;};
 for(const hole of rings.filter(r=>!T.ShapeUtils.isClockWise(r))){const i=outlines.findIndex(r=>inside(r,hole[0]));if(i>=0)shapes[i].holes.push(new T.Path(hole));}
 const sm=mat('#393c40');sm.side=T.DoubleSide;
 const human=add(new T.ShapeGeometry(shapes),sm,[-1.2,0,.55]);human.name='Vincent for Scale — 5 ft 10 in (1.778 m)';
 document.querySelector('#person').onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));human.visible=on;};
 ready=true;status.hidden=true;
 renderer.setAnimationLoop(()=>{clock+=1/60;ripple(clock);flame.scale.y=1+.15*Math.sin(clock*13);fireLight.intensity=2.1+.4*Math.sin(clock*17)*Math.sin(clock*5);controls.update();camera.updateMatrixWorld();
  for(const {spec,button} of labels){const p=new T.Vector3(...spec.anchor).project(camera);button.hidden=!ready||!showDimensions||p.z>1||Math.abs(p.x)>.95||Math.abs(p.y)>.95||(spec.id==='human'&&!human.visible);if(!button.hidden){button.style.left=((p.x+1)/2*stage.clientWidth)+'px';button.style.top=((1-p.y)/2*stage.clientHeight)+'px';}}
  renderer.render(scene,camera);});
}catch(err){console.error(err);status.textContent='The scene could not load. Reload in a browser with WebGL enabled.';}
