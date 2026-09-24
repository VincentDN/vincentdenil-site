// Attachment registry. Each slot sits on a mount point from viewer.js SOCKETS and owns the
// source-model part with the same id. Units are meters in the slot's frame: +x toward the
// muzzle, +y up, +z the rifle's right side, origin at the mount point.
//
// Option kinds:
//  - original: shows the source part, optionally posed ({rotationY, position, nodes:{name:[dx,dy,dz]}}).
//  - build(ctx): returns an Object3D that replaces the source part. ctx.original is the
//    source part's group (for clones) and ctx.materials holds the model's materials by name.
//  - neither: the slot is left empty.
// Each slot's camera is the snappy angle the viewer cuts to when that slot changes: the
// direction from the part to the camera (model space), the distance in meters, and an
// optional aim offset from the mount point toward the part's middle.
// Built attachments are illustrative low-poly shapes, not measured replicas.
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const merge=geos=>mergeGeometries(geos.map(g=>g.index?g.toNonIndexed():g));
const box=(w,h,d,[x,y,z]=[0,0,0])=>new T.BoxGeometry(w,h,d).translate(x,y,z);
// Cylinder along x from x0 to x1.
const tube=(r,x0,x1,[y,z]=[0,0],seg=10,r1=r)=>new T.CylinderGeometry(r1,r,x1-x0,seg).rotateZ(-Math.PI/2).translate((x0+x1)/2,y,z);
// Side profile (x,y) extruded to a thickness centered on z.
const profile=(points,depth,bevel=0)=>{const g=new T.ExtrudeGeometry(new T.Shape(points.map(p=>new T.Vector2(...p))),{depth:depth-bevel*2,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:1});return g.translate(0,0,-depth/2+bevel);};
function group(...meshes){const g=new T.Group();for(const [geos,material] of meshes){g.add(new T.Mesh(Array.isArray(geos)?merge(geos):geos,material));}return g;}
const plum=new T.MeshStandardMaterial({name:'polymer',color:'#3e1f22',roughness:.6});

// Copy the source part with its transforms baked into slot-space geometry, then warp each vertex.
function reshape(original,warp){
 original.updateMatrixWorld(true);
 const g=new T.Group(),inverse=original.matrixWorld.clone().invert(),v=new T.Vector3();
 original.traverse(o=>{
  if(!o.isMesh)return;
  const geometry=o.geometry.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld)),p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){warp(v.fromBufferAttribute(p,i));p.setXYZ(i,v.x,v.y,v.z);}
  g.add(new T.Mesh(geometry,o.material));// applyMatrix4 carried the source normals; the warps are gentle enough to keep them.
 });
 return g;
}
const smoothstep=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
// Illustrative masses: BASE_GRAMS is everything outside the slots (receiver, bolt group,
// barrel, B-10/B-19 handguard and B-13 mount); option grams are added on top. Magazines are empty.
export const BASE_GRAMS=2550;
// Finish colours for the furniture. Original keeps the source colour; only polymer and black-finish
// surfaces are recoloured, so steel stays steel.
export const FINISHES=[
 {id:'original',label:'Original'},
 {id:'plum',label:'Plum',color:'#4a2427'},
 {id:'fde',label:'FDE',color:'#76603f'},
 {id:'od',label:'OD green',color:'#3c4332'}
];
// Finish rows. A row with an option only shows (and only recolours) while that option is fitted.
export const FINISH_TARGETS=[
 {id:'handguard'},{id:'foregrip'},{id:'grip'},{id:'stock'},{id:'magazine'},
 {id:'suppressor',label:'Suppressor',part:'muzzle',option:'can',finishes:[
  {id:'original',label:'Black'},
  {id:'fde',label:'FDE',color:'#76603f'},
  {id:'od',label:'OD green',color:'#3c4332'},
  {id:'tungsten',label:'Tungsten grey',color:'#5b5f63'},
  {id:'bronze',label:'Burnt bronze',color:'#4e3d2b'}
 ]}
];
export const SLOTS=[
 {id:'muzzle',camera:{direction:[.55,.22,.8],distance:.42},label:'Muzzle',options:[
  {id:'dtk1',grams:160,label:'DTK-1',original:true},
  {id:'ak74',grams:70,label:'AK-74 brake',detail:'Classic two-chamber AK-74 brake with its wide front port.',build:({materials})=>group(
   [[tube(.0105,-.004,.03,[0,0],10),tube(.012,.03,.07,[0,0],10),tube(.0105,.07,.082,[0,0],10)],materials['h-190']],
   [[box(.018,.004,.026,[.05,0,0]),box(.012,.022,.004,[.05,0,.011]),box(.012,.022,.004,[.05,0,-.011])],materials.stell])},
  {id:'comp',grams:95,label:'Compensator',detail:'Short three-port compensator; ports vent upward to hold the muzzle down.',build:({materials})=>group(
   [[tube(.0135,-.004,.052,[0,0],8)],materials.stell],
   [[box(.008,.005,.012,[.012,.012,0]),box(.008,.005,.012,[.026,.012,0]),box(.008,.005,.012,[.04,.012,0])],materials['h-190']])},
  {id:'can',grams:540,label:'Suppressor',detail:'Full-length sound suppressor, 190 mm, on a quick-detach collar.',build:({materials})=>group(
   [[tube(.016,-.004,.024,[0,0],12)],materials.stell],
   [[tube(.0195,.024,.19,[0,0],12),tube(.017,.19,.198,[0,0],12,.0195)],materials['h-190']])},
  {id:'bare',grams:0,label:'Bare',detail:'Bare 24×1.5 mm threaded muzzle.'}
 ]},
 {id:'optic',camera:{direction:[-.45,.4,1],distance:.5},label:'Optic',rail:{min:-.06,max:.04,step:.01},options:[
  {id:'reddot',grams:210,label:'Red dot',original:true},
  {id:'holo',grams:320,label:'Holographic',detail:'Box-hooded holographic sight with a wide window.',build:({materials})=>{
   const g=group(
    [[box(.08,.012,.032,[0,.006,0]),box(.028,.026,.036,[-.02,.025,0]),box(.05,.004,.036,[.012,.058,0]),box(.05,.046,.004,[.012,.035,.017]),box(.05,.046,.004,[.012,.035,-.017]),box(.012,.012,.012,[-.02,.044,.02])],materials['h-190']],
    [box(.002,.034,.03,[.03,.037,0]),materials.glass]);
   const dot=new T.Mesh(new T.SphereGeometry(.0012,6,4),materials.red_emission);dot.position.set(.03,.04,0);g.add(dot);return g;}},
  {id:'scope',grams:460,label:'4× scope',detail:'4× fixed-power scope in two rings, 280 mm long.',build:({materials})=>group(
   [[tube(.0127,-.07,.07,[.046,0],12),tube(.021,.07,.12,[.046,0],12,.0127),tube(.021,.12,.15,[.046,0],12),tube(.0127,-.12,-.07,[.046,0],12,.019),tube(.019,-.155,-.12,[.046,0],12),
     new T.CylinderGeometry(.009,.009,.018,8).translate(0,.066,0),new T.CylinderGeometry(.009,.009,.018,8).rotateX(Math.PI/2).translate(0,.046,.02),
     box(.016,.03,.028,[-.05,.021,0]),box(.016,.03,.028,[.05,.021,0]),box(.026,.008,.03,[-.05,.004,0]),box(.026,.008,.03,[.05,.004,0])],materials['h-190']],
   [[tube(.019,.1495,.151,[.046,0],12),tube(.0165,-.1555,-.1545,[.046,0],12)],materials.glass])},
  {id:'none',label:'Irons',detail:'No optic: the rifle falls back to its iron sights.'}
 ]},
 {id:'foregrip',camera:{direction:[.1,-.28,1],distance:.46,aim:[0,-.03,0]},label:'Foregrip',rail:{min:-.08,max:0,step:.01},options:[
  {id:'rk1',grams:85,label:'RK-1',original:true},
  {id:'angled',grams:60,label:'Angled',detail:'Angled foregrip: a thumb ramp for a high, straight-arm hold.',build:({materials})=>group(
   [profile([[-.048,0],[.042,0],[.038,-.012],[-.028,-.046],[-.046,-.042]],.028,.003),materials.polymer])},
  {id:'stop',grams:30,label:'Hand stop',detail:'Low hand stop at the front of the lower rail.',build:({materials})=>group(
   [profile([[-.016,0],[.02,0],[.02,-.016],[.008,-.021],[-.016,-.008]],.024,.002),materials.polymer])},
  {id:'none',label:'None',detail:'Clean handguard, no foregrip.'}
 ]},
 {id:'magazine',camera:{direction:[.3,-.05,1],distance:.55,aim:[.03,-.1,0]},label:'Magazine',options:[
  {id:'30',grams:230,label:'30-rnd',original:true},
  // Stretched copies of the source magazine; the part inside the mag well keeps its shape.
  {id:'45',grams:310,label:'45-rnd RPK',detail:'45-round RPK-74 magazine: the 30-rounder lengthened by a third.',build:({original})=>reshape(original,v=>{if(v.y<0)v.y*=1.36;})},
  {id:'60',grams:450,label:'60-rnd quad',detail:'60-round quad-stack: single-stack at the feed lips, twice as wide below the mag well.',build:({original})=>reshape(original,v=>{if(v.y<0)v.y*=1.18;v.z*=1+.85*smoothstep(.02,.06,-v.y);})},
  // Drum: a short feed tower out of the mag well into a 136 mm drum, axis across the rifle.
  {id:'drum',grams:900,label:'95-rnd drum',detail:'95-round drum: a short feed tower into a 136 mm drum with a winding key on the right face.',build:({materials})=>group(
   [[profile([[-.062,.03],[.014,.03],[.02,-.02],[.03,-.07],[-.042,-.07],[-.056,-.02]],.026,.002),
     new T.CylinderGeometry(.068,.068,.05,16).rotateX(Math.PI/2).translate(-.008,-.118,0)],materials.polymer],
   [[new T.CylinderGeometry(.064,.064,.058,16).rotateX(Math.PI/2).translate(-.008,-.118,0),
     new T.CylinderGeometry(.018,.018,.066,10).rotateX(Math.PI/2).translate(-.008,-.118,0),
     box(.03,.006,.006,[-.008,-.118,.035])],materials['h-190']])},
  {id:'none',label:'None',detail:'Magazine removed.'}
 ]},
 {id:'grip',camera:{direction:[-.35,.05,1],distance:.42,aim:[-.02,-.05,0]},label:'Pistol grip',options:[
  {id:'rk9',grams:95,label:'RK-9',original:true},
  {id:'classic',grams:70,label:'Classic plum',detail:'Classic AK-74M-era plum polymer grip, slimmer and more steeply raked.',build:()=>group(
   [profile([[.016,.004],[-.02,.004],[-.062,-.112],[-.058,-.122],[-.03,-.124],[-.004,-.07],[.012,-.03]],.028,.003),plum])}
 ]},
 {id:'stock',camera:{direction:[-.7,.25,.7],distance:.55},label:'Stock',options:[
  {id:'extended',grams:430,label:'Extended',original:true},
  // The butt and cheek rest slide forward along the PT-1 base.
  {id:'collapsed',grams:430,label:'Collapsed',original:true,detail:'PT-1 butt slid fully forward on its base.',pose:{nodes:{'pt1 stock butt_18':[.06,0,0],'pt1 cheek_19':[.06,0,0]}}},
  // Folds 180° to the left about a hinge 35 mm left of the mount point (negative: swings through the left side).
  {id:'folded',grams:430,label:'Folded',original:true,detail:'PT-1 folded along the left side of the receiver.',pose:{rotationY:-Math.PI,position:[0,0,-.07]}},
  {id:'none',label:'Removed',detail:'Stock removed: bare trunnion.'}
 ]}
];
