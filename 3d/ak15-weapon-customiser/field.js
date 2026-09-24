// Poses for the operator, with the built rifle in their hands. The rifle is placed from its own
// geometry (sight line, butt, grip, foregrip) and both arms are solved with two-bone IK, so every
// build is held differently: a longer stock, a moved foregrip or a folded stock all show.
// Operator space: feet on y=0, facing +z, right side -x (see operator.js).
import * as T from 'three';

export const POSES=[
 {id:'aim',label:'Aim',detail:'Shouldered, cheek on the stock, eye behind the sight.'},
 {id:'ready',label:'Low ready',detail:'Shouldered with the muzzle dipped, head up.'},
 {id:'patrol',label:'Patrol',detail:'Carried across the body, muzzle down and left.'},
 {id:'inspect',label:'Inspect',detail:'Held out sideways to show the build.'},
 {id:'stand',label:'At ease',detail:'Rifle slung out of view; arms relaxed.'}
];

const X=new T.Vector3(1,0,0),Y=new T.Vector3(0,1,0),DOWN=new T.Vector3(0,-1,0);
function resetJoints(op){for(const j of Object.values(op.joints)){j.rotation.set(0,0,0);}}

// Rotate `joint` so its local -y points at world direction `dir`.
function aimJoint(joint,dir){
 const parentQ=joint.parent.getWorldQuaternion(new T.Quaternion());
 const want=new T.Quaternion().setFromUnitVectors(DOWN,dir.clone().normalize());
 joint.quaternion.copy(parentQ.invert().multiply(want));
 joint.updateMatrixWorld(true);
}
// Two-bone IK: shoulder stays put; elbow bends toward `pole` (a world direction); the palm
// centre lands on `target` (or as close as the arm reaches).
export function solveArm(op,side,target,pole){
 const upper=op.joints['upperArm'+side],fore=op.joints['foreArm'+side];
 const a=op.lengths.upperArm,b=op.lengths.foreArm+op.lengths.hand*.5;
 const S=upper.getWorldPosition(new T.Vector3()),d=target.clone().sub(S);
 const dist=T.MathUtils.clamp(d.length(),Math.abs(a-b)+1e-3,a+b-1e-3),dir=d.normalize();
 const alpha=Math.acos(T.MathUtils.clamp((a*a+dist*dist-b*b)/(2*a*dist),-1,1));
 const perp=pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir)));
 if(perp.lengthSq()<1e-6)perp.copy(DOWN).sub(dir.clone().multiplyScalar(DOWN.dot(dir)));
 perp.normalize();
 const E=S.clone().addScaledVector(dir,Math.cos(alpha)*a).addScaledVector(perp,Math.sin(alpha)*a);
 const W=S.clone().addScaledVector(dir,dist);
 aimJoint(upper,E.clone().sub(S));aimJoint(fore,W.clone().sub(E));
}

// Rifle facts in its own (holder) space, read from the mounted build.
export function rifleFrame(rifle,box){
 const slot=id=>rifle.slots[id];
 const pos=id=>slot(id)?.container.position.clone();
 const optic=slot('optic')?.options.find(o=>o.id===rifle.build.optic);
 // Eye height above the optic mount: from the option, else irons just above the rail.
 const sightHeight=optic?.sightHeight??.02;
 const foregrip=slot('foregrip')?.options.find(o=>o.id===rifle.build.foregrip);
 const gripHeld=foregrip&&(foregrip.original||foregrip.build)&&foregrip.id!=='stop';
 const fg=pos('foregrip')||new T.Vector3(.2,0,0);
 return {
  butt:new T.Vector3(box.min.x,(pos('muzzle')?.y??0)-.03,0),
  cheek:new T.Vector3((pos('stock')?.x??box.min.x+.2)+.02,(pos('optic')?.y??.04)+sightHeight,0),
  grip:pos('grip').add(new T.Vector3(-.025,-.05,0)),
  // Support hand wraps the foregrip, or cups the handguard just behind the rail point.
  support:gripHeld?fg.clone().add(new T.Vector3(0,-.045,0)):fg.clone().add(new T.Vector3(-.03,.015,0)),
  length:box.max.x-box.min.x
 };
}

// Apply `pose` to operator `op`; `holder` is the rifle holder (a child of `anchor` in op space).
export function applyPose(op,pose,holder,frame){
 resetJoints(op);
 const s=op.height/1.78,J=op.joints;
 const armed=pose!=='stand'&&holder&&frame;
 if(holder)holder.visible=!!armed;
 op.root.updateMatrixWorld(true);
 if(!armed){
  J.upperArmR.rotation.z=-.12;J.upperArmL.rotation.z=.12;J.foreArmR.rotation.x=J.foreArmL.rotation.x=-.25;
  J.upperLegR.rotation.z=-.03;J.upperLegL.rotation.z=.03;
  return;
 }
 // Stance: bladed for shouldered poses, left foot forward.
 const shouldered=pose==='aim'||pose==='ready';
 if(shouldered){
  // Right-handed: hips turn to the right (negative y) so the left shoulder leads; the chest turns partly back.
  J.hips.rotation.y=-.38;J.chest.rotation.y=.2;J.spine.rotation.x=.08;
  J.upperLegL.rotation.x=-.28;J.lowerLegL.rotation.x=.22;J.footL.rotation.x=.06;
  J.upperLegR.rotation.x=.18;J.lowerLegR.rotation.x=.12;J.footR.rotation.x=-.3;J.upperLegR.rotation.z=-.08;
  J.neck.rotation.x=pose==='aim'?.2:.08;J.neck.rotation.z=pose==='aim'?.2:.05;J.neck.rotation.y=-.1;
 }else{
  J.upperLegL.rotation.x=-.08;J.upperLegR.rotation.x=.06;J.lowerLegR.rotation.x=.06;J.footR.rotation.x=-.12;
  J.upperLegR.rotation.z=-.04;J.upperLegL.rotation.z=.04;
  J.neck.rotation.x=pose==='inspect'?.25:.06;
 }
 op.root.updateMatrixWorld(true);

 // Rifle placement in operator space. Aim: sight line through the right eye, pointing +z.
 const anchor=holder.parent,toLocal=p=>anchor.worldToLocal(p.clone());
 const q=new T.Quaternion();let position;
 if(shouldered){
  const eye=toLocal(J.head.localToWorld(new T.Vector3(-.036*s,.112*s,.1*s)));
  q.setFromAxisAngle(Y,-Math.PI/2);
  // Put the cheek-weld point of the sight line just below and behind the eye.
  position=eye.clone().add(new T.Vector3(0,-.012,-.02)).sub(frame.cheek.clone().applyQuaternion(q));
  if(pose==='ready'){
   // Dip the muzzle about 28° around the butt.
   const butt=frame.butt.clone().applyQuaternion(q).add(position),dip=new T.Quaternion().setFromAxisAngle(X,.5);
   position.sub(butt).applyQuaternion(dip).add(butt);q.premultiply(dip);
  }
 }else if(pose==='patrol'){
  // Muzzle turned toward the left front, then dipped about 35°.
  q.setFromAxisAngle(Y,-Math.PI/2+.85).premultiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,.35).normalize(),.62));
  const gripAt=new T.Vector3(-.2*s,1.02*s,.2*s);
  position=gripAt.sub(frame.grip.clone().applyQuaternion(q));
 }else{
  // Inspect: sideways across the chest, right side of the rifle to the viewer, muzzle to the left.
  q.identity();
  const gripAt=new T.Vector3(-.16*s,1.2*s,.36*s);
  position=gripAt.sub(frame.grip.clone().applyQuaternion(q));
 }
 holder.quaternion.copy(q);holder.position.copy(position);holder.updateMatrixWorld(true);

 // Arms onto the rifle. Poles keep the elbows down and slightly out.
 const world=p=>holder.localToWorld(p.clone());
 const rootQ=op.root.getWorldQuaternion(new T.Quaternion());
 const pole=(x,y,z)=>new T.Vector3(x,y,z).applyQuaternion(rootQ).normalize();
 solveArm(op,'R',world(frame.grip),pole(-1,-.9,-.3));
 solveArm(op,'L',world(frame.support),pole(pose==='inspect'?.6:.35,-1,0));
 // Hands follow the forearms, tipped a little toward the grip.
 J.handR.rotation.set(-.35,0,0);J.handL.rotation.set(-.2,0,.3);
}
