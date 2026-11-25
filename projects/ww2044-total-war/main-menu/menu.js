// WW2044: Total War main menu. An over-the-shoulder shot of a commander leaning over a map table,
// copied from the Partisan workbench opener (vincentdenil-site /3d/partisan-project/ak15-workbench-intro/
// workbench.js) with the rifle swapped for a painted operations map of Yantis. Choosing a menu entry
// pushes the camera in on the map, fades to black and opens that page.
// Scene space: operator's feet on y=0 facing +z, right side -x (see operator.js); meters.
import * as T from 'three';
import {DEFAULT_OPERATOR,buildOperator} from './operator.js';
import {solveArm} from './field.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
try { await Promise.all([document.fonts.load('600 54px Oswald'), document.fonts.load('500 22px Barlow')]); } catch {} // the map sheet's lettering

const TABLE={top:.86,x:[-.95,.95],z:[.24,1.04]};
const MAP={x:-.1,z:.56,w:.72,d:.5,yaw:.8};
const SHOT={position:new T.Vector3(-.56,1.86,0),target:new T.Vector3(-.04,.84,.5)};
const PUSH_IN={duration:1.6,fadeAt:.7};
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

const stage=document.querySelector('#stage'),status=document.querySelector('#status'),fade=document.querySelector('#fade');
const renderer=new T.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;stage.append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color(0x07090a);scene.fog=new T.Fog(0x07090a,2.2,5);
const camera=new T.PerspectiveCamera(42,1,.05,20);camera.position.copy(SHOT.position);camera.lookAt(SHOT.target);

// ---------- Lighting: one warm lamp over the map, a cold fill ----------
scene.add(new T.HemisphereLight(0x4a5a66,0x120d08,.45));
const lamp=new T.SpotLight(0xffc98a,26,4,.62,.55,2);lamp.position.set(.42,1.62,.78);lamp.target.position.set(.02,TABLE.top,.6);
lamp.castShadow=true;lamp.shadow.mapSize.set(2048,2048);lamp.shadow.bias=-.0004;lamp.shadow.normalBias=.01;scene.add(lamp,lamp.target);
const fill=new T.DirectionalLight(0x6f8fb0,.35);fill.position.set(-1.5,2,-1);scene.add(fill);
// A dim generated room for reflections and to lift the operator out of the dark (the bench uses an HDR file).
scene.environment=new T.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.25;

// ---------- Room and table (original low-poly geometry) ----------
const std=(color,roughness=.85,extra={})=>new T.MeshStandardMaterial({color,roughness,...extra});
function seeded(seed){return()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};}
function woodTexture(){
 const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d'),r=seeded(7);
 g.fillStyle='#6b5238';g.fillRect(0,0,512,256);
 for(let i=0;i<150;i++){const y=r()*256;g.strokeStyle=`rgba(${r()<.5?'40,26,14':'150,118,82'},${.08+r()*.18})`;g.lineWidth=.5+r()*2;g.beginPath();g.moveTo(0,y);for(let x=0;x<=512;x+=32)g.lineTo(x,y+Math.sin(x/70+i)*3);g.stroke();}
 for(let i=0;i<40;i++){g.fillStyle=`rgba(20,14,8,${r()*.25})`;g.beginPath();g.ellipse(r()*512,r()*256,4+r()*30,2+r()*10,0,0,Math.PI*2);g.fill();}
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;return t;
}
const mesh=(geo,material,[x,y,z],shadow=true)=>{const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m;};
const W=TABLE.x[1]-TABLE.x[0],D=TABLE.z[1]-TABLE.z[0],CX=(TABLE.x[0]+TABLE.x[1])/2,CZ=(TABLE.z[0]+TABLE.z[1])/2;
mesh(new T.BoxGeometry(W,.05,D),std(0xffffff,.78,{map:woodTexture()}),[CX,TABLE.top-.025,CZ]);
for(const x of [TABLE.x[0]+.06,TABLE.x[1]-.06])for(const z of [TABLE.z[0]+.06,TABLE.z[1]-.06])mesh(new T.BoxGeometry(.07,TABLE.top-.05,.07),std(0x3b2c1f),[x,(TABLE.top-.05)/2,z]);
mesh(new T.PlaneGeometry(8,8).rotateX(-Math.PI/2),std(0x1b1d1e,.95),[0,0,0],false);
mesh(new T.PlaneGeometry(6,3),std(0x2b2f2c,.95),[0,1.5,TABLE.z[1]+.05],false);// back wall
mesh(new T.BoxGeometry(1.4,.8,.015),std(0x3a3328,.9),[.1,1.42,TABLE.z[1]+.035],false);// board
// Props: ammo tin, rag, a mug, a pencil, field glasses.
mesh(new T.BoxGeometry(.18,.1,.1),std(0x3e4a32,.7),[-.72,TABLE.top+.05,.66]).rotation.y=.3;
const rag=mesh(new T.IcosahedronGeometry(.1,1).scale(1.3,.28,1),std(0x6d6a60,.98,{flatShading:true}),[.68,TABLE.top+.012,.96]);rag.rotation.y=.6;
mesh(new T.CylinderGeometry(.04,.036,.1,12),std(0x58605a,.5,{metalness:.3}),[.62,TABLE.top+.05,.42]);// enamel mug
mesh(new T.CylinderGeometry(.004,.004,.16,6).rotateZ(Math.PI/2),std(0xc9a13b,.6),[.3,TABLE.top+.004,.2+.06]).rotation.y=.5;// pencil
const glasses=new T.Group();for(const x of [-.035,.035])glasses.add(new T.Mesh(new T.CylinderGeometry(.026,.028,.11,10).rotateX(Math.PI/2),std(0x22261f,.5)));
glasses.position.set(-.56,TABLE.top+.028,.9);glasses.rotation.y=.7;glasses.traverse(m=>{if(m.isMesh)m.castShadow=true;});scene.add(glasses);
// The lamp itself: a shade and a glowing bulb above the table.
mesh(new T.ConeGeometry(.12,.14,10,1,true),std(0x3c4a3f,.6,{side:T.DoubleSide}),[lamp.position.x,lamp.position.y+.05,lamp.position.z],false);
mesh(new T.SphereGeometry(.03,8,6),new T.MeshBasicMaterial({color:0xfff0d0}),[lamp.position.x,lamp.position.y,lamp.position.z],false);

// Field radio at the back of the table: wooden case, cloth grille, lit tuning dial, two knobs.
const radio=new T.Group();radio.position.set(-.3,TABLE.top,.94);radio.rotation.y=.25;scene.add(radio);
{
 const part=(geo,material,[x,y,z])=>{const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;radio.add(m);return m;};
 const W=.34,H=.21,D=.13,wood=std(0x4a2e1a,.6,{flatShading:true});
 part(new T.BoxGeometry(W,H,D),wood,[0,H/2,0]);
 part(new T.BoxGeometry(W+.012,.014,D+.012),std(0x2e1c10,.6),[0,H-.004,0]);
 part(new T.BoxGeometry(W*.52,H*.72,.004),std(0x8a7a5c,.95),[-W*.2,H*.47,-D/2-.001]);
 for(let i=0;i<5;i++)part(new T.BoxGeometry(W*.52,.008,.006),wood,[-W*.2,H*.18+i*H*.14,-D/2-.004]);
 part(new T.BoxGeometry(W*.3,H*.26,.006),std(0x1a1410,.5),[W*.29,H*.68,-D/2-.002]);
 radio.userData.dial=part(new T.PlaneGeometry(W*.26,H*.2).rotateY(Math.PI),std(0xffd9a0,.5,{emissive:0xffa447,emissiveIntensity:1.4}),[W*.29,H*.68,-D/2-.0055]);
 for(const x of [.2,.38])part(new T.CylinderGeometry(.017,.019,.018,10).rotateX(Math.PI/2),std(0x201a15,.4),[W*x+W*.03,H*.26,-D/2-.009]);
 part(new T.TorusGeometry(.07,.008,5,10,Math.PI),std(0x2a2522,.5,{metalness:.4}),[0,H+.002,0]);
}

// ---------- The map: a painted operations map of Yantis, slightly curled at the corners ----------
// Canvas u runs along the operator's left-to-right (-x world, so it is drawn mirrored back by the
// mesh), v runs away from the operator, so the map reads the right way up from the camera.
function mapTexture(){
 const w=1536,h=1072,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),r=seeded(2044);
 // Paper and sea wash.
 g.fillStyle='#d9ccaa';g.fillRect(0,0,w,h);
 g.fillStyle='rgba(88,118,128,.55)';g.fillRect(40,40,w-80,h-80);
 for(let i=0;i<2500;i++){g.fillStyle=`rgba(60,40,20,${r()*.05})`;g.fillRect(r()*w,r()*h,1+r()*3,1+r()*3);}
 // Island outline from a wobbly radial blob.
 const cx=w*.5,cy=h*.52,pts=[];
 for(let i=0;i<90;i++){const a=i/90*Math.PI*2,k=1+.13*Math.sin(a*3+1)+.07*Math.sin(a*7+2)+.04*Math.sin(a*13);pts.push([cx+Math.cos(a)*w*.33*k,cy+Math.sin(a)*h*.33*k]);}
 const island=(s=1)=>{g.beginPath();pts.forEach(([x,y],i)=>{const X=cx+(x-cx)*s,Y=cy+(y-cy)*s;i?g.lineTo(X,Y):g.moveTo(X,Y);});g.closePath();};
 g.strokeStyle='rgba(30,50,60,.5)';g.lineWidth=2;g.setLineDash([10,8]);for(const s of [1.09,1.18,1.3]){island(s);g.stroke();}g.setLineDash([]);
 // Three territories inside the island: wedges from an inland point with wavy borders.
 g.save();island();g.clip();
 const hub=[cx-w*.04,cy+h*.02],wedge=(a0,a1,color)=>{g.beginPath();g.moveTo(...hub);for(let a=a0;a<=a1;a+=.05){const R=w*.6;g.lineTo(hub[0]+Math.cos(a)*R,hub[1]+Math.sin(a)*R);}g.closePath();g.fillStyle=color;g.fill();};
 wedge(-Math.PI*1.05,-.15,'#7f9a5c');// Free Yantis (north)
 wedge(-.15,1.75,'#b8694a');// Occupation Authority (east and south-east)
 wedge(1.75,Math.PI*.95,'#cfb177');// Neutral Cantons (south-west)
 for(let i=0;i<900;i++){g.fillStyle=`rgba(40,30,20,${r()*.12})`;g.beginPath();g.arc(r()*w,r()*h,1+r()*6,0,7);g.fill();}// relief stipple
 g.strokeStyle='rgba(40,25,15,.65)';g.lineWidth=3;for(const a of [-.15,1.75,Math.PI*.95]){g.beginPath();g.moveTo(...hub);for(let t=0;t<1;t+=.04){const R=t*w*.6;g.lineTo(hub[0]+Math.cos(a+Math.sin(t*20)*.03)*R,hub[1]+Math.sin(a+Math.sin(t*20)*.03)*R);}g.stroke();}
 g.restore();
 g.strokeStyle='#2c2418';g.lineWidth=4;island();g.stroke();
 // Grid, labels, front line, compass rose and title block.
 g.strokeStyle='rgba(40,30,20,.25)';g.lineWidth=1;for(let x=40;x<w-40;x+=120){g.beginPath();g.moveTo(x,40);g.lineTo(x,h-40);g.stroke();}for(let y=40;y<h-40;y+=120){g.beginPath();g.moveTo(40,y);g.lineTo(w-40,y);g.stroke();}
 const label=(text,x,y,size,angle=0,color='#2a2016')=>{g.save();g.translate(x,y);g.rotate(angle);g.font=`600 ${size}px Oswald,'Arial Narrow',sans-serif`;g.fillStyle=color;g.textAlign='center';g.letterSpacing=size*.25+'px';g.fillText(text,0,0);g.restore();};
 label('FREE YANTIS',cx-w*.05,cy-h*.2,54,-.08);
 label('OCCUPATION AUTHORITY',cx+w*.17,cy+h*.06,32,-.25);
 label('NEUTRAL CANTONS',cx-w*.19,cy+h*.27,30,-.12);
 for(const [x,y,n] of [[.38,.36,'Arida'],[.58,.34,'Pyrgos'],[.78,.62,'Agravia'],[.44,.72,'Selakano'],[.62,.7,'Chalkeia']]){g.fillStyle='#1d160e';g.beginPath();g.arc(w*x,h*y,6,0,7);g.fill();g.font='500 22px Barlow,sans-serif';g.textAlign='left';g.letterSpacing='0px';g.fillText(n,w*x+10,h*y+6);}
 // Grease-pencil front line with arrows.
 g.strokeStyle='rgba(170,20,20,.85)';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(w*.3,h*.47);g.bezierCurveTo(w*.42,h*.42,w*.5,h*.52,w*.66,h*.4);g.stroke();
 const arrow=(x0,y0,x1,y1)=>{g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo((x0+x1)/2+20,(y0+y1)/2-30,x1,y1);g.stroke();const a=Math.atan2(y1-y0,x1-x0);g.beginPath();g.moveTo(x1,y1);g.lineTo(x1-28*Math.cos(a-.5),y1-28*Math.sin(a-.5));g.moveTo(x1,y1);g.lineTo(x1-28*Math.cos(a+.5),y1-28*Math.sin(a+.5));g.stroke();};
 arrow(w*.4,h*.3,w*.44,h*.43);arrow(w*.56,h*.28,w*.6,h*.42);
 g.strokeStyle='rgba(30,60,140,.8)';arrow(w*.68,h*.62,w*.6,h*.5);
 const rose=[w*.88,h*.18];g.fillStyle='#2a2016';for(let i=0;i<4;i++){g.save();g.translate(...rose);g.rotate(i*Math.PI/2);g.beginPath();g.moveTo(0,-70);g.lineTo(12,0);g.lineTo(-12,0);g.closePath();g.fill();g.restore();}label('N',rose[0],rose[1]-80,28);
 g.fillStyle='rgba(230,220,190,.92)';g.fillRect(70,h-190,520,130);g.strokeStyle='#2a2016';g.lineWidth=3;g.strokeRect(70,h-190,520,130);
 label('YANTIS · OPERATIONAL SITUATION',330,h-138,26);g.font='500 20px Barlow,sans-serif';g.letterSpacing='2px';g.fillStyle='#4a3a26';g.textAlign='center';g.fillText('14 · III · 2044   —   SHEET 1 OF 1   —   SECRET',330,h-96);
 g.strokeStyle='#2a2016';g.lineWidth=5;g.strokeRect(24,24,w-48,h-48);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const mapGroup=new T.Group();mapGroup.position.set(MAP.x,TABLE.top,MAP.z);mapGroup.rotation.y=MAP.yaw;scene.add(mapGroup);
{
 const geo=new T.PlaneGeometry(MAP.w,MAP.d,24,16).rotateX(-Math.PI/2).rotateY(Math.PI);// rotateY: text reads from the operator's side
 const p=geo.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i)/(MAP.w/2),z=p.getZ(i)/(MAP.d/2),e=Math.max(0,Math.abs(x)-.82)*Math.max(0,Math.abs(z)-.7);p.setY(i,.0015+e*.18+Math.max(0,Math.abs(x)-.93)*.02);}
 geo.computeVertexNormals();
 const sheet=new T.Mesh(geo,new T.MeshStandardMaterial({map:mapTexture(),color:0xa49c8c,roughness:.95,side:T.DoubleSide}));sheet.castShadow=sheet.receiveShadow=true;mapGroup.add(sheet);
 // Wooden unit blocks and pins standing on the map.
 const blocks=[[.12,-.08,0x2f4a2a],[-.06,-.11,0x2f4a2a],[.2,.05,0x7a2a1e],[-.12,.06,0x7a2a1e],[.02,.14,0xa88b4e]];
 for(const [x,z,c] of blocks){const b=new T.Mesh(new T.BoxGeometry(.045,.022,.028),std(c,.7,{flatShading:true}));b.position.set(x,.013,z);b.rotation.y=(x*37)%1;b.castShadow=b.receiveShadow=true;mapGroup.add(b);}
 for(const [x,z,c] of [[-.25,-.16,0xc4281c],[.28,-.18,0xc4281c],[-.02,.02,0x2448a8]]){const pin=new T.Mesh(new T.SphereGeometry(.009,8,6),std(c,.35));pin.position.set(x,.03,z);pin.castShadow=true;const stem=new T.Mesh(new T.CylinderGeometry(.0012,.0012,.03,4),std(0xbbbbbb,.3,{metalness:.8}));stem.position.set(x,.015,z);mapGroup.add(pin,stem);}
 // Brass protractor near the operator's right hand.
 const prot=new T.Mesh(new T.RingGeometry(.05,.075,24,1,0,Math.PI).rotateX(-Math.PI/2),std(0xb08a3a,.35,{metalness:.8,side:T.DoubleSide}));prot.position.set(.3,.004,.18);prot.rotation.y=.4;prot.scale.setScalar(.6);mapGroup.add(prot);
}

// ---------- Operator, leaning over the table ----------
const op=buildOperator({...DEFAULT_OPERATOR,headgear:'cap',gloves:'none',pack:'none'});
op.root.traverse(m=>{if(m.isMesh)m.castShadow=m.receiveShadow=true;});scene.add(op.root);
const LEAN={hips:.1,spine:.16,chest:.18,neck:.08,head:.48};
// Palm targets on the map's near edge (world space): right hand flat on the corner, left hand
// pointing at the front line, drifting a little with the look.
const HOLD={R:{at:new T.Vector3(-.28,TABLE.top+.03,.36),pole:new T.Vector3(-1,-.2,-.5)},L:{at:new T.Vector3(.04,TABLE.top+.03,.4),pole:new T.Vector3(1,-.4,-.4)}};
function pose(time){
 const breath=reduceMotion?0:Math.sin(time*1.4)*.012;
 for(const [joint,x] of Object.entries(LEAN))op.joints[joint].rotation.x=x+(joint==='chest'?breath:0);
 op.joints.head.rotation.y=-.1+look.x*.12;
 for(const side of ['R','L']){op.joints['upperLeg'+side].rotation.x=-.08;op.joints['lowerLeg'+side].rotation.x=.14;}
 op.root.updateMatrixWorld(true);
 const reach=reduceMotion?0:Math.sin(time*.5)*.02;
 solveArm(op,'R',HOLD.R.at,HOLD.R.pole);
 solveArm(op,'L',HOLD.L.at.clone().add(new T.Vector3(look.x*-.04,0,reach-look.y*.03)),HOLD.L.pole);
}

// ---------- Look (mouse, touch, gamepad) and the push-in ----------
const look={x:0,y:0},want={x:0,y:0};
addEventListener('pointermove',e=>{want.x=e.clientX/innerWidth*2-1;want.y=e.clientY/innerHeight*2-1;});
const entries=[...document.querySelectorAll('.menu a')];
function pollPad(){
 for(const pad of navigator.getGamepads?.()||[]){
  if(!pad)continue;
  const [x,y]=pad.axes;if(Math.hypot(x,y)>.15){want.x=x;want.y=y;}
  if(pad.buttons[0]?.pressed||pad.buttons[9]?.pressed)begin(entries[0].href);
 }
}
let push=null;
function begin(href){
 if(push)return;
 document.body.classList.add('leaving');
 const focus=mapGroup.getWorldPosition(new T.Vector3());
 push={href,start:performance.now()/1000,from:camera.position.clone(),fromTarget:currentTarget.clone(),to:focus.clone().add(new T.Vector3(-.06,.36,-.12)),toTarget:focus,faded:false};
 if(reduceMotion)push.start-=PUSH_IN.duration*PUSH_IN.fadeAt;
}
for(const a of entries)a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;e.preventDefault();begin(a.href);});
addEventListener('keydown',e=>{if(e.target.matches('a,button,input,select,textarea'))return;if(e.key==='e'||e.key==='E'||e.key==='Enter')begin(entries[0].href);});
// Coming back with the browser's back button restores this page from cache: reset the shot.
addEventListener('pageshow',e=>{if(e.persisted){push=null;document.body.classList.remove('leaving');fade.classList.add('clear');clock.getDelta();requestAnimationFrame(frame);}});

const currentTarget=SHOT.target.clone();
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<1?60:42;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

const clock=new T.Clock();
function frame(){
 const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime;
 pollPad();
 const k=1-Math.exp(-dt*(push?1.5:4));look.x+=(want.x-look.x)*k;look.y+=(want.y-look.y)*k;
 pose(time);
 radio.userData.dial.material.emissiveIntensity=1.3+Math.random()*.15;
 if(push){
  const t=performance.now()/1000-push.start,u=Math.min(t/PUSH_IN.duration,1),e=ease(u);
  camera.position.lerpVectors(push.from,push.to,e);currentTarget.lerpVectors(push.fromTarget,push.toTarget,e);
  if(u>=PUSH_IN.fadeAt&&!push.faded){push.faded=true;fade.classList.remove('clear');}
  if(t>=PUSH_IN.duration+.4){location.href=push.href;return;}
 }else{
  const sway=reduceMotion?0:Math.sin(time*.6)*.006;
  camera.position.set(SHOT.position.x+look.x*.05,SHOT.position.y-look.y*.03+sway,SHOT.position.z);
  currentTarget.set(SHOT.target.x+look.x*.1,SHOT.target.y-look.y*.06,SHOT.target.z);
 }
 camera.lookAt(currentTarget);
 renderer.render(scene,camera);
 requestAnimationFrame(frame);
}
status.hidden=true;entries[0].focus({preventScroll:true});
requestAnimationFrame(frame);requestAnimationFrame(()=>fade.classList.add('clear'));
