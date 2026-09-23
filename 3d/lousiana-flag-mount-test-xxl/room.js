import {formatLength} from './units.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
const stage=document.querySelector('#stage'),status=document.querySelector('#status');
// Meter-based dimensions. The 6 x 10 ft envelope includes both sewn sleeves.
const W=3.048,H=1.8288,BOTTOM=1.12,TOP=BOTTOM+H,SR=.0147,OPENING=.0127,Z=.13;
// Preview construction assumptions: 0.6 mm cloth, 2.4 mm folded hem, 18 mm hem width.
const FABRIC=.0006,HEM=.0024,HEM_WIDTH=.018,NECK=.042;
const CLOTH_BOTTOM=BOTTOM+SR+NECK,CLOTH_TOP=TOP-SR-NECK;
const orange=0xef8f39,scene=new T.Scene(),room=new T.Group();scene.add(room);
const mat=(color,roughness=.85)=>new T.MeshStandardMaterial({color,roughness});
const plaster=mat('#d3c7b1'),cream=mat('#e0d8c7'),frame=mat('#aaa38f'),wood=mat('#765039'),metal=mat('#454b49',.4),blue=mat('#0b4771'),thread=mat(orange,.72);
const groups={flag:[],sleeve:[],human:[],sofa:[],mount:[]};
function add(g,m,p,group){const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=true;o.receiveShadow=true;room.add(o);if(group)groups[group].push(o);return o;}
function box(w,h,d,p,m,r=.025,group){return add(r?new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)):new T.BoxGeometry(w,h,d),m,p,group);}
function sphere(r,p,m,group){return add(new T.SphereGeometry(r,20,14),m,p,group);}
function rod(a,b,r,m,group,r2=r){const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av);const o=add(new T.CylinderGeometry(r2,r,v.length(),16),m,av.clone().add(bv).multiplyScalar(.5).toArray(),group);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
function curve(points,r,m,group){return add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),32,r,6,false),m,[0,0,0],group);}
box(6.8,.12,4.8,[0,-.06,2.3],mat('#c7bba6'),.015);
box(6.8,3.25,.12,[0,1.625,-.07],plaster,.01);
box(.12,3.25,4.8,[-3.46,1.625,2.3],plaster,.01);
box(6.8,.11,.025,[0,.055,.012],cream,.008);
box(.025,.11,4.8,[-3.388,.055,2.3],cream,.008);
box(3.9,.018,2.65,[.05,.012,2.02],mat('#c2a779'),.009);
// Sectional: 2.8 m wide, 0.87 m high, with a right chaise.
for(const x of [-1.22,1.22])for(const z of [.4,1.05])rod([x,.02,z],[x,.2,z],.042,wood);
box(2.8,.2,.94,[0,.27,.73],frame,.06,'sofa');
box(2.8,.47,.16,[0,.6,.32],frame,.04,'sofa');
for(const x of [-1.3,1.3])box(.2,.45,.98,[x,.47,.76],frame,.04,'sofa');
for(const x of [-.82,0,.82]){box(.78,.17,.73,[x,.445,.8],cream,.06,'sofa');const back=box(.78,.47,.16,[x,.635,.46],cream,.055,'sofa');back.rotation.x=-.1;}
box(.95,.19,.8,[.8,.27,1.43],frame,.04,'sofa');box(.9,.16,.85,[.8,.445,1.43],cream,.06,'sofa');
for(const x of [.46,1.1])rod([x,.02,1.72],[x,.2,1.72],.04,wood);
for(const [x,z,angle] of [[-.95,.68,.2],[.93,.7,-.3]]){const p=box(.35,.33,.14,[x,.69,z],mat('#96694d'),.065);p.rotation.z=angle;}
// Coffee table, armchair, floor lamp and small plants echo the reference room.
const table=add(new T.CylinderGeometry(.52,.52,.075,64),mat('#ae9064'),[-.35,.365,2.14]);
for(let a=0;a<Math.PI*2;a+=Math.PI*2/3)rod([-.35+Math.cos(a)*.41,.03,2.14+Math.sin(a)*.41],[-.35+Math.cos(a)*.41,.34,2.14+Math.sin(a)*.41],.028,wood);

const chairStart=room.children.length;
box(.9,.17,.8,[2.1,.33,2.65],frame,.04);box(.72,.17,.7,[2.1,.45,2.65],cream,.04);box(.8,.48,.15,[2.1,.69,2.98],cream,.045);
for(const x of [1.72,2.48]){box(.13,.37,.82,[x,.55,2.68],frame,.025);for(const z of [2.36,2.98])rod([x,.02,z],[x,.27,z],.035,wood);}
// Rotate all chair components 90 degrees counterclockwise as viewed from above.
const chairPivot=new T.Vector3(2.1,0,2.65);
for(const part of room.children.slice(chairStart)){part.position.sub(chairPivot).applyAxisAngle(new T.Vector3(0,1,0),Math.PI/2).add(chairPivot);part.rotateY(Math.PI/2);}
add(new T.CylinderGeometry(.18,.2,.035,32),metal,[-1.95,.025,.8]);
curve([[-1.95,.03,.8],[-1.95,1.58,.8],[-1.79,1.78,.8],[-1.58,1.58,.8]],.014,mat('#a98b51'));
add(new T.ConeGeometry(.2,.18,32,1,true),mat('#bb9d64'),[-1.58,1.52,.8]);
function plant(x,y,z,scale=1){add(new T.CylinderGeometry(.1*scale,.08*scale,.14*scale,20),mat('#9a8265'),[x,y+.07*scale,z]);for(let i=0;i<9;i++){const a=i*2.399;rod([x,y+.12*scale,z],[x+Math.cos(a)*.12*scale,y+(.3+(i%3)*.07)*scale,z+Math.sin(a)*.12*scale],.012*scale,mat('#62754a'));}}
plant(-.45,.405,2.1,.65);plant(-2.55,0,.45,1.6);
// Small art prints on the left return wall.
for(const [z,y,c] of [[1.05,2.13,'#bf9660'],[1.77,2.28,'#b9ba86'],[2.45,1.97,'#b78373']]){box(.055,.65,.47,[-3.36,y,z],wood,.018);box(.012,.53,.35,[-3.325,y,z],mat(c),.002);}
// Human reference is a traced planar silhouette, loaded below at 1.778 m tall.
// Rod centers and sleeves stay within the exact 1.8288 m finished flag height.
for(const y of [BOTTOM+SR,TOP-SR]){
 rod([-W/2-.085,y,Z],[W/2+.085,y,Z],.0105,metal,'mount');
 for(const x of [-W/2-.06,W/2+.06]){box(.052,.072,.012,[x,y,.012],metal,.006,'mount');rod([x,y,.018],[x,y,Z],.008,metal,'mount');sphere(.018,[x,y,Z],metal,'mount');}
 // Folded fabric surrounds the rod and tapers to the stitched flag neck.
 function drop(r,tip,half){const s=new T.Shape();s.moveTo(-half,tip);s.bezierCurveTo(-half,.027,-r,.014,-r,0);s.bezierCurveTo(-r,-r*.552,-r*.552,-r,0,-r);s.bezierCurveTo(r*.552,-r,r,-r*.552,r,0);s.bezierCurveTo(r,.014,half,.027,half,tip);s.closePath();return s;}
 const sleeve=drop(SR,NECK,HEM/2);
 sleeve.holes.push(new T.Path(drop(OPENING,NECK-.004,FABRIC/2).getPoints(24)));
 const sleeveGeometry=new T.ExtrudeGeometry(sleeve,{depth:W,bevelEnabled:false,steps:1,curveSegments:24});
 sleeveGeometry.rotateY(Math.PI/2);
 if(y>2)sleeveGeometry.rotateX(Math.PI);
 sleeveGeometry.translate(-W/2,y,Z);
 add(sleeveGeometry,blue,[0,0,0],'sleeve').name='Folded teardrop pole sleeve';
}
let renderer,camera,controls,selected=null,showDimensions=true,ready=false;
const approval=document.querySelector('#approve'),alphaTooltip=document.querySelector('#alpha-tooltip');
approval.onclick=()=>{alphaTooltip.hidden=false;};
approval.addEventListener('blur',()=>{alphaTooltip.hidden=true;});
approval.addEventListener('keydown',e=>{if(e.key==='Escape')alphaTooltip.hidden=true;});
const labels=[],annotations=new T.Group();scene.add(annotations);
const vincentTip=document.createElement('div');
vincentTip.id='vincent-tooltip';vincentTip.role='tooltip';vincentTip.hidden=true;
vincentTip.textContent='not depicted - Vincent muttering in French about denier weights and non-DIN conforming hoist attachments';
stage.append(vincentTip);
const showVincentTip=()=>{vincentTip.hidden=selected==='human';};
const hideVincentTip=()=>{vincentTip.hidden=true;};
stage.addEventListener('keydown',e=>{if(e.key==='Escape')hideVincentTip();});
let units='imperial';
const length=m=>formatLength(m,units);
const dimensions=[
 {id:'width',label:'Flag width',meters:W,anchor:[0,3.12,.17],a:[-W/2,3.09,.17],b:[W/2,3.09,.17],targets:['flag']},
 {id:'height',label:'Flag height',meters:H,anchor:[-1.84,2.02,.17],a:[-1.77,BOTTOM,.17],b:[-1.77,TOP,.17],targets:['flag','sleeve']},
 {id:'sleeve',label:'Pole sleeves',meters:.0254,prefix:'Ø',anchor:[1.14,2.94,.19],targets:['sleeve','mount']},
 {id:'thread',label:'Orange stitching',meters:.003,suffix:'*',anchor:[-1.18,1.19,.2],targets:['thread']},
 {id:'human',label:'Vincent for Scale',meters:1.778,anchor:[2.55,.16,.82],a:[2.67,0,.75],b:[2.67,1.778,.75],targets:['human']},
 {id:'clearance',label:'Bottom above floor',meters:BOTTOM,anchor:[-2.1,.57,.15],a:[-2.05,0,.15],b:[-2.05,BOTTOM,.15],targets:['mount']}
];
function valueOf(spec){if(spec.id==='human'&&units==='imperial')return '5ft10in (70in)';if(spec.id==='sleeve')return units==='imperial'?'Ø1in Pole':'Ø25.4mm Pole';return (spec.prefix||'')+length(spec.meters)+(spec.suffix||'');}
function dimensionText(id){return {
 width:()=>`Finished width: ${length(W)}. The flag is wider than the ${length(2.8)} sofa.`,
 height:()=>`Finished height: ${length(H)}, including both sleeve envelopes.`,
 sleeve:()=>`Top and bottom sleeve openings: Ø${length(.0254)}. Rod diameter: Ø${length(.021)}. Brackets project ${length(.13)} from the wall.`,
 thread:()=>`Orange thread matches the interface accent. Two stitched rows along each sleeve, with edge stitching. Thread diameter ${length(.003)} is exaggerated for visibility.`,
 human:()=>`Vincent for Scale — ${length(1.778)}. not depicted - Vincent muttering in French about denier weights and non-DIN conforming hoist attachments`,
 clearance:()=>`Bottom edge: ${length(BOTTOM)} above the floor, about ${length(.25)} above the sofa back. Top edge: ${length(TOP)}. Assumed ceiling: ${length(3.25)}.`
 }[id]();}
function renderMarker(spec,button){
 const expanded=spec.id==='human'&&selected==='human';
 button.classList.toggle('vincent-expanded',expanded);
 button.replaceChildren(document.createTextNode(valueOf(spec)));
 if(expanded){const joke=document.createElement('span');joke.className='marker-joke';joke.textContent=vincentTip.textContent;button.append(joke);}
}
function updateUnits(){
 for(const {spec,button,entry} of labels){const value=valueOf(spec);renderMarker(spec,button);button.setAttribute('aria-label',spec.label+': '+value);entry.querySelector('strong').textContent=value;}
 for(const b of document.querySelectorAll('[data-units]'))b.setAttribute('aria-pressed',String(b.dataset.units===units));
 document.querySelector('#intro').textContent=`A ${length(W)} × ${length(H)} flag above a cream sectional. Orange stitched hems and twin wall-mounted poles, with a flat dark-grey Vincent silhouette for scale.`;
 if(selected)document.querySelector('#detail').textContent=dimensionText(selected);
}
function select(id){selected=selected===id?null:id;const spec=dimensions.find(d=>d.id===selected);document.querySelector('#detail').textContent=(spec?dimensionText(spec.id):null)||'Select a measurement on the model or in this list to highlight its geometry and dimension lines.';const highlighted=new Set(spec?.targets.flatMap(k=>groups[k]||[])||[]);room.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.setHex(highlighted.has(o)?orange:0);o.material.emissiveIntensity=highlighted.has(o)?.22:0;}});for(const {spec:s,button,line,entry}of labels){const active=s.id===selected;renderMarker(s,button);if(selected==='human')hideVincentTip();button.setAttribute('aria-pressed',String(active));entry.setAttribute('aria-pressed',String(active));if(line)line.material.color.setHex(active?orange:0x35505b);}}
for(const spec of dimensions){let line;if(spec.a){const a=new T.Vector3(...spec.a),b=new T.Vector3(...spec.b),horizontal=Math.abs(a.x-b.x)>.1,tick=new T.Vector3(horizontal?0:.045,horizontal?.045:0,0);line=new T.LineSegments(new T.BufferGeometry().setFromPoints([a,b,a.clone().sub(tick),a.clone().add(tick),b.clone().sub(tick),b.clone().add(tick)]),new T.LineBasicMaterial({color:0x35505b,depthTest:false}));line.renderOrder=20;annotations.add(line);}const button=document.createElement('button');button.className='marker';button.textContent=valueOf(spec);button.setAttribute('aria-label',spec.label+': '+valueOf(spec));button.setAttribute('aria-pressed','false');button.hidden=true;button.onclick=()=>select(spec.id);if(spec.id==='human')button.title='not depicted - Vincent muttering in French about denier weights and non-DIN conforming hoist attachments';stage.append(button);const entry=document.createElement('button');entry.className='measurement';entry.setAttribute('aria-pressed','false');entry.innerHTML='<span>'+spec.label+'</span><strong>'+valueOf(spec)+'</strong>';entry.onclick=()=>select(spec.id);document.querySelector('#measurements').append(entry);labels.push({spec,button,line,entry});}
const vincentLabel=labels.find(l=>l.spec.id==='human');
for(const target of [vincentLabel.button,vincentLabel.entry]){
 target.removeAttribute('title');target.setAttribute('aria-describedby','vincent-tooltip');
 target.addEventListener('pointerenter',showVincentTip);target.addEventListener('pointerleave',hideVincentTip);
 target.addEventListener('focus',showVincentTip);target.addEventListener('blur',hideVincentTip);
 target.addEventListener('click',showVincentTip);
}
for(const button of document.querySelectorAll('[data-units]'))button.onclick=()=>{units=button.dataset.units;updateUnits();};
updateUnits();
try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#d7cdbd',0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;stage.prepend(renderer.domElement);
 camera=new T.PerspectiveCamera(42,1,.02,60);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.3;controls.maxDistance=15;controls.maxPolarAngle=Math.PI*.49;controls.minAzimuthAngle=-Math.PI*.42;controls.maxAzimuthAngle=Math.PI*.42;
 scene.add(new T.HemisphereLight(0xfff4db,0x74746f,2));const sun=new T.DirectionalLight(0xffedcf,3);sun.position.set(2.5,6,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:15});sun.shadow.normalBias=.02;scene.add(sun);const fill=new T.DirectionalLight(0xe4eeff,1);fill.position.set(-2,3,5);scene.add(fill);
 function view(name){const aspect=stage.clientWidth/stage.clientHeight;const distance=Math.max(9.5,7.8/aspect);if(name==='mount'){controls.target.set(1.43,TOP-.045,Z);camera.position.set(2.02,TOP-.16,.46);}else if(name==='front'){controls.target.set(0,1.55,.1);camera.position.set(0,1.95,distance);}else{controls.target.set(.3,1.35,1);camera.position.set(distance*.33,4.7,distance*.94);}controls.update();}
 const resize=()=>{camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);};new ResizeObserver(resize).observe(stage);resize();view('room');for(const button of document.querySelectorAll('[data-view]'))button.onclick=()=>view(button.dataset.view);
 document.querySelector('#dimensions').onclick=e=>{showDimensions=!showDimensions;e.currentTarget.setAttribute('aria-pressed',String(showDimensions));annotations.visible=showDimensions;};document.querySelector('#person').onclick=e=>{const visible=e.currentTarget.getAttribute('aria-pressed')!=='true';groups.human.forEach(o=>o.visible=visible);e.currentTarget.setAttribute('aria-pressed',String(visible));const h=labels.find(l=>l.spec.id==='human');h.line.visible=visible;};
 stage.addEventListener('keydown',e=>{if(e.key==='Escape')select(selected);if(e.target!==stage)return;const v=camera.position.clone().sub(controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight')v.applyAxisAngle(new T.Vector3(0,1,0),e.key==='ArrowLeft'?.1:-.1);else if(e.key==='ArrowUp'||e.key==='ArrowDown')v.applyAxisAngle(new T.Vector3(1,0,0),e.key==='ArrowUp'?.1:-.1);else if(e.key==='+'||e.key==='=')v.multiplyScalar(.9);else if(e.key==='-')v.multiplyScalar(1.1);else return;e.preventDefault();camera.position.copy(controls.target).add(v);controls.update();});
 const silhouetteResponse=await fetch('./vincent-silhouette.json');
 if(!silhouetteResponse.ok)throw new Error('Silhouette could not load');
 const silhouetteData=await silhouetteResponse.json();
 const rings=silhouetteData.rings.map(r=>r.map(p=>new T.Vector2(...p)));
 const outlines=rings.filter(r=>T.ShapeUtils.isClockWise(r));
 const silhouetteShapes=outlines.map(r=>new T.Shape(r));
 function contains(r,p){let inside=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;}
 for(const hole of rings.filter(r=>!T.ShapeUtils.isClockWise(r))){const i=outlines.findIndex(r=>contains(r,hole[0]));if(i>=0)silhouetteShapes[i].holes.push(new T.Path(hole));}
 const silhouetteMaterial=mat('#393c40');silhouetteMaterial.side=T.DoubleSide;
 const woman=add(new T.ShapeGeometry(silhouetteShapes),silhouetteMaterial,[2.2,0,.68],'human');
 woman.name='Vincent for Scale — 5 ft 10 in (1.778 m)';
 const figureRay=new T.Raycaster(),pointer=new T.Vector2();
 function overVincent(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);figureRay.setFromCamera(pointer,camera);return woman.visible&&figureRay.intersectObject(woman).length>0;}
 renderer.domElement.addEventListener('pointermove',e=>{const hit=overVincent(e);renderer.domElement.style.cursor=hit?'help':'';if(hit)showVincentTip();else hideVincentTip();});
 renderer.domElement.addEventListener('pointerleave',hideVincentTip);
 renderer.domElement.addEventListener('click',e=>{if(overVincent(e)){select('human');showVincentTip();}else hideVincentTip();});
 const texture=await new T.TextureLoader().loadAsync('./flag.png');texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const cloth=new T.MeshStandardMaterial({map:texture,roughness:.96});
 const height=CLOTH_TOP-CLOTH_BOTTOM;
 function clothThickness(x,y){const edge=Math.min(W/2-Math.abs(x),y-CLOTH_BOTTOM,CLOTH_TOP-y);return edge<=HEM_WIDTH?HEM:FABRIC;}
 function clothCenter(x,y){return Z+.008*Math.sin(x*14)*Math.sin(Math.PI*(y-CLOTH_BOTTOM)/height)**2*Math.sin(Math.PI*(x/W+.5))**2;}
 const xs=[-W/2,-W/2+HEM_WIDTH,...Array.from({length:99},(_,i)=>-W/2+HEM_WIDTH+.001+(W-2*HEM_WIDTH-.002)*i/98),W/2-HEM_WIDTH,W/2];
 const ys=[CLOTH_BOTTOM,CLOTH_BOTTOM+HEM_WIDTH,...Array.from({length:59},(_,i)=>CLOTH_BOTTOM+HEM_WIDTH+.001+(height-2*HEM_WIDTH-.002)*i/58),CLOTH_TOP-HEM_WIDTH,CLOTH_TOP];
 const positions=[],uvs=[],indices=[],nx=xs.length,ny=ys.length,count=nx*ny;
 for(const side of [1,-1])for(const y of ys)for(const x of xs){positions.push(x,y,clothCenter(x,y)+side*clothThickness(x,y)/2);uvs.push(x/W+.5,(y-CLOTH_BOTTOM)/height);}
 for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=j*nx+i,b=a+1,c=a+nx,d=c+1;indices.push(a,b,c,b,d,c,a+count,c+count,b+count,b+count,c+count,d+count);}
 const perimeter=[];for(let i=0;i<nx;i++)perimeter.push(i);for(let j=1;j<ny;j++)perimeter.push(j*nx+nx-1);for(let i=nx-2;i>=0;i--)perimeter.push((ny-1)*nx+i);for(let j=ny-2;j>0;j--)perimeter.push(j*nx);
 for(let i=0;i<perimeter.length;i++){const a=perimeter[i],b=perimeter[(i+1)%perimeter.length];indices.push(a,a+count,b,b,a+count,b+count);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();
 add(geo,cloth,[0,0,0],'flag').name='Solid fabric with thick folded perimeter hem';
 groups.thread=[];const stitches=[];function stitch(a,b){for(const p of [a,b])p[2]=clothCenter(p[0],p[1])+clothThickness(p[0],p[1])/2+.0015;const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av);const g=new T.CylinderGeometry(.0015,.0015,delta.length(),5);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());stitches.push(g);}
 for(const y of [CLOTH_BOTTOM+.006,CLOTH_BOTTOM+.014,CLOTH_TOP-.006,CLOTH_TOP-.014])for(let x=-W/2+.012;x<W/2-.012;x+=.014)stitch([x,y,0],[Math.min(x+.009,W/2-.01),y,0]);
 for(const x of [-W/2+.009,W/2-.009])for(let y=CLOTH_BOTTOM+.018;y<CLOTH_TOP-.018;y+=.014)stitch([x,y,0],[x,Math.min(y+.009,CLOTH_TOP-.018),0]);
 add(mergeGeometries(stitches),thread,[0,0,0],'thread');stitches.forEach(g=>g.dispose());
 // Clone shared materials so highlighting affects only selected meshes.
 room.traverse(o=>{if(o.isMesh)o.material=o.material.clone();});ready=true;status.hidden=true;
 renderer.setAnimationLoop(()=>{controls.update();camera.updateMatrixWorld();for(const {spec,button}of labels){const p=new T.Vector3(...spec.anchor).project(camera);button.hidden=!ready||!showDimensions||p.z>1||Math.abs(p.x)>.95||Math.abs(p.y)>.95||(spec.id==='human'&&!groups.human[0].visible);const half=button.offsetWidth/2+8;button.style.left=Math.max(half,Math.min(stage.clientWidth-half,(p.x*.5+.5)*stage.clientWidth))+'px';button.style.top=(-p.y*.5+.5)*stage.clientHeight+'px';}renderer.render(scene,camera);});
}catch(err){console.error(err);status.textContent='The scene could not load. Reload in a browser with WebGL enabled.';}
