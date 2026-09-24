// Code-built low-poly AK-15 stand-in, used until the Sketchfab model is in ./model/.
// Meters. Muzzle points +x, up is +y, the rifle's right side (selector, charging handle) is +z.
// Proportions follow the published 940 mm overall / 415 mm barrel figures; details are illustrative.
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const mat=(color,roughness=.7,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness,flatShading:true});
const steel=mat('#6a7074',.42,.5),polymer=mat('#3a3e40',.78),rubber=mat('#232526',.95),brake=mat('#575d61',.38,.6);

// Extrusions are non-indexed, so merge everything non-indexed.
const merge=geos=>mergeGeometries(geos.map(g=>g.index?g.toNonIndexed():g));
const boxG=(w,h,d,[x,y,z]=[0,0,0])=>new T.BoxGeometry(w,h,d).translate(x,y,z);
// Cylinder whose axis runs along x.
const tubeG=(r,len,[x,y,z],seg=8)=>new T.CylinderGeometry(r,r,len,seg).rotateZ(-Math.PI/2).translate(x,y,z);
// Extrude a side profile (x,y points) to a thickness centered on z=0.
function profileG(points,depth){const g=new T.ExtrudeGeometry(new T.Shape(points.map(p=>new T.Vector2(...p))),{depth,bevelEnabled:false});return g.translate(0,0,-depth/2);}
// Picatinny-style rail: base plus cross-slots at the standard 10 mm pitch.
function railG(len,[x,y,z]){const parts=[boxG(len,.006,.021,[x,y,z])];for(let i=0;i<Math.floor(len/.01);i++)parts.push(boxG(.0053,.004,.021,[x-len/2+.005+i*.01,y+.005,z]));return merge(parts);}

export function buildStandIn(){
 const root=new T.Group();root.name='AK-15 stand-in';
 const parts=[];
 function part(id,label,detail,geos,material){
  const mesh=new T.Mesh(geos.length>1?merge(geos):geos[0],material);
  mesh.name=label;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
  parts.push({id,label,detail,objects:[mesh]});return mesh;
 }
 part('receiver','Receiver & dust cover','Stamped receiver with the hinged AK-15 dust cover. The cover carries the optic rail.',[
  boxG(.27,.055,.036,[.005,.0075,0]),
  new T.CylinderGeometry(.018,.018,.27,8).rotateZ(-Math.PI/2).scale(1,.6,1).translate(.005,.037,0),
  boxG(.05,.05,.04,[.165,.01,0]),
  boxG(.055,.005,.006,[.1,.022,.021]),// selector lever, right side
  new T.CylinderGeometry(.006,.006,.022,6).rotateX(Math.PI/2).translate(.1,.022,.029)// charging handle
 ],steel);
 part('rail','Top rail','Full-length rail on the dust cover. Optic mount point for step 2.',[railG(.22,[0,.0495,0])],steel);
 part('handguard','Handguard','Polymer handguard and gas-tube cover. The 6 o\'clock rail takes foregrips.',[
  new T.CylinderGeometry(.024,.024,.19,6).rotateZ(-Math.PI/2).scale(1,.9,1).translate(.285,.003,0),
  tubeG(.014,.18,[.28,.034,0],6),
  railG(.12,[.3,.024,0]).rotateX(Math.PI)// flipped: base at y=-.024, slots face down
 ],polymer);
 part('barrel','Barrel & gas block','415 mm barrel with gas block and front sight.',[
  tubeG(.0085,.415,[.3475,.01,0]),
  boxG(.03,.045,.026,[.405,.02,0]),
  profileG([[.505,-.005],[.535,-.005],[.53,.06],[.515,.06]],.02)
 ],steel);
 part('muzzle','Muzzle brake','Two-chamber brake on a threaded muzzle. Swappable in step 2.',[
  tubeG(.013,.075,[.5925,.01,0]),
  boxG(.012,.006,.018,[.578,.022,0]),boxG(.012,.006,.018,[.605,.022,0])
 ],brake);
 // Curved 30-round magazine: spine sweeps forward as it drops.
 const front=[],rear=[];
 for(let i=0;i<=8;i++){const t=i/8,x=.074+.07*t*t,y=-.018-.175*t;front.push([x,y]);rear.push([x-.056+.004*t,y+.012*t]);}
 part('magazine','Magazine','30-round 7.62×39 polymer magazine.',[profileG([...front,...rear.reverse()],.026)],polymer);
 part('grip','Pistol grip','Raked polymer pistol grip with trigger and guard.',[
  profileG([[-.045,-.02],[-.088,-.02],[-.128,-.128],[-.1,-.134],[-.072,-.07],[-.058,-.05]],.03),
  boxG(.08,.004,.012,[-.01,-.056,0]),boxG(.004,.036,.012,[.028,-.038,0]),
  profileG([[.002,-.02],[.007,-.02],[.002,-.048],[-.004,-.046]],.006)
 ],polymer);
 part('stock','Stock','Folding, adjustable polymer stock with cheek comb and rubber butt pad.',[
  boxG(.03,.05,.036,[-.142,.008,0]),
  profileG([[-.157,.022],[-.157,.045],[-.285,.05],[-.285,.018],[-.2,.02]],.03),
  profileG([[-.157,-.012],[-.157,.004],[-.285,-.045],[-.285,-.072]],.022),
  boxG(.013,.13,.04,[-.2915,-.02,0])
 ],polymer);
 const pad=new T.Mesh(boxG(.012,.13,.042,[-.304,-.02,0]),rubber);pad.castShadow=true;pad.name='Butt pad';
 root.add(pad);parts.find(p=>p.id==='stock').objects.push(pad);
 // Mount points for step 2 attachments: position + the direction an attachment extends.
 const sockets=[
  ['muzzle','Muzzle',[.63,.01,0],[1,0,0]],
  ['optic','Optic rail',[.02,.059,0],[0,1,0]],
  ['underbarrel','Under rail',[.3,-.03,0],[0,-1,0]],
  ['magazine','Mag well',[.047,-.02,0],[0,-1,0]],
  ['grip','Grip',[-.07,-.02,0],[0,-1,0]],
  ['stock','Stock',[-.157,.01,0],[-1,0,0]]
 ].map(([id,label,p,d])=>{const o=new T.Object3D();o.name='socket:'+id;o.position.set(...p);o.userData={id,label,direction:new T.Vector3(...d)};root.add(o);return o;});
 return {root,parts,sockets};
}
