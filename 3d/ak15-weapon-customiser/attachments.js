// Attachment registry. Each slot sits on a mount point from viewer.js SOCKETS and owns the
// source-model part with the same id. Units are meters in the slot's frame: +x toward the
// muzzle, +y up, +z the rifle's right side, origin at the mount point.
//
// Option kinds:
//  - original: shows the source part, optionally posed ({rotationY, position, nodes:{name:[dx,dy,dz]}}).
//  - build(ctx): returns an Object3D that replaces the source part. ctx.original is the
//    source part's group (for clones) and ctx.materials holds the model's materials by name.
//  - neither: the slot is left empty.
export const SLOTS=[
 {id:'muzzle',label:'Muzzle',options:[
  {id:'dtk1',label:'DTK-1',original:true},
  {id:'bare',label:'Bare',detail:'Bare 24×1.5 mm threaded muzzle.'}
 ]},
 {id:'optic',label:'Optic',rail:{min:-.06,max:.04,step:.01},options:[
  {id:'reddot',label:'Red dot',original:true},
  {id:'none',label:'Irons',detail:'No optic: the rifle falls back to its iron sights.'}
 ]},
 {id:'foregrip',label:'Foregrip',rail:{min:-.08,max:0,step:.01},options:[
  {id:'rk1',label:'RK-1',original:true},
  {id:'none',label:'None',detail:'Clean handguard, no foregrip.'}
 ]},
 {id:'magazine',label:'Magazine',options:[
  {id:'30',label:'30-rnd',original:true},
  {id:'none',label:'None',detail:'Magazine removed.'}
 ]},
 {id:'grip',label:'Pistol grip',options:[
  {id:'rk9',label:'RK-9',original:true}
 ]},
 {id:'stock',label:'Stock',options:[
  {id:'extended',label:'Extended',original:true},
  // The butt and cheek rest slide forward along the PT-1 base.
  {id:'collapsed',label:'Collapsed',original:true,detail:'PT-1 butt slid fully forward on its base.',pose:{nodes:{'pt1 stock butt_18':[.06,0,0],'pt1 cheek_19':[.06,0,0]}}},
  // Folds 180° to the left about a hinge 35 mm left of the mount point.
  {id:'folded',label:'Folded',original:true,detail:'PT-1 folded along the left side of the receiver.',pose:{rotationY:Math.PI,position:[0,0,-.07]}}
 ]}
];
