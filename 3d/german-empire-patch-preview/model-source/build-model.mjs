import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import * as THREE from 'three';
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {JSDOM} from 'jsdom';
import pc from 'polygon-clipping';
import ClipperLib from 'clipper-lib';
globalThis.DOMParser = new JSDOM().window.DOMParser;
globalThis.FileReader = class { readAsArrayBuffer(b){b.arrayBuffer().then(v=>{this.result=v;this.onloadend?.();});} };
const out=fileURLToPath(new URL('../',import.meta.url));
let source=fs.readFileSync(new URL('../artwork.svg',import.meta.url),'utf8').replace(/<g id="safe-area">[\s\S]*?<\/g>/,'').replace(/<g id="cut-line">[\s\S]*?<\/g>/,'');
const paths=new SVGLoader().parse(source).paths.filter(p=>p.userData.node.getAttribute('class')!=='cls-4');
const model=new THREE.Group();model.name='German Empire PVC patch — 127 x 75 mm';
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.86,metalness:0});
const black=mat('#232727'), gold=mat('#aa9e6d'), red=mat('#c92e2d');
function rounded(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
function mesh(shape,z,depth,material,name,bevel=.08){const geo=new THREE.ExtrudeGeometry(shape,{depth:depth-2*bevel,steps:1,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:2,curveSegments:12});geo.translate(0,0,z+bevel);const m=new THREE.Mesh(geo,material);m.name=name;model.add(m);return m;}
// Bevels are contained inside the nominal envelope.
mesh(rounded(126.8,74.8,7.9),0,2,black,'PVC backing • assumed 2 mm',.1);
const rim=rounded(126.84,74.84,7.92);rim.holes.push(new THREE.Path(rounded(122.76,70.76,5.88).getPoints(24)));
mesh(rim,2,1,black,'Outer frame • 2.2 mm wide',.08);
const inner=rounded(119.6,67.6,4.3);
mesh(rounded(119.48,67.48,4.24),2,.35,black,'Artwork bed • sewing channel inner edge',.06);
const clip=[[inner.getPoints(32).map(p=>[p.x,p.y])]];
function polys(p){return SVGLoader.createShapes(p).map(s=>[s.getPoints(10),...s.holes.map(h=>h.getPoints(10))].map(r=>{let a=r.map(v=>[(v.x-188.6)*119.6/342.2,(109.8-v.y)*67.6/199.2]);if(a[0][0]!==a.at(-1)[0]||a[0][1]!==a.at(-1)[1])a.push(a[0]);return a;}));}
const all=paths.map(polys);
function shapes(polygons,inset=0){
 if(inset){const co=new ClipperLib.ClipperOffset(2,.001*10000);for(const polygon of polygons)polygon.forEach((r,i)=>{let a=r.slice(0,-1).map(([x,y])=>({X:Math.round(x*10000),Y:Math.round(y*10000)}));if(ClipperLib.Clipper.Orientation(a)!==(i===0))a.reverse();co.AddPath(a,ClipperLib.JoinType.jtRound,ClipperLib.EndType.etClosedPolygon);});const tree=new ClipperLib.PolyTree();co.Execute(tree,-inset*10000);const paths=ClipperLib.Clipper.PolyTreeToPaths(tree);polygons=[];const rings=paths.map(p=>p.map(v=>[v.X/10000,v.Y/10000]));for(let i=0;i<rings.length;i++){if(ClipperLib.Clipper.Orientation(paths[i]))polygons.push([rings[i]]);else{const pt=paths[i][0];const parent=polygons.find(p=>ClipperLib.Clipper.PointInPolygon(pt,p[0].map(([x,y])=>({X:x*10000,Y:y*10000})))!==0);if(parent)parent.push(rings[i]);}}}
 return polygons.map(poly=>{const s=new THREE.Shape(poly[0].map(([x,y])=>new THREE.Vector2(x,y)));s.holes=poly.slice(1).map(r=>new THREE.Path(r.map(([x,y])=>new THREE.Vector2(x,y))));return s;});
}
// Flatten SVG painter order into disjoint panel regions; preserve emblem fine detail.
for(let i=0;i<paths.length-2;i++){
 let visible=pc.intersection(all[i],clip);
 for(let j=i+1;j<paths.length-2;j++)visible=pc.difference(visible,all[j]);
 const emblem=i===paths.length-3;
 const ss=shapes(visible,emblem?.08:.56);
 if(ss.length)mesh(ss,2,emblem?.85:.8,paths[i].userData.node.getAttribute('class')==='cls-6'?red:paths[i].userData.node.getAttribute('class')==='cls-1'?black:gold,emblem?'Medallion':'Raised color panel',emblem?.03:.06);
}
mesh(shapes(all.at(-2)),2.85,.35,black,'Raised eagle • SVG outline',.015);
mesh(shapes(all.at(-1)),3.2,.15,gold,'Quartered shield • SVG outline',.008);
// Individual stitch segments follow the recessed 1.5 mm sewing channel.
const seam=rounded(121.1,69.1,5.05);const pts=seam.getSpacedPoints(180);
for(let i=0;i<180;i++){const a=pts[i],b=pts[i+1],d=a.distanceTo(b);const stitch=new THREE.Mesh(new THREE.CapsuleGeometry(.19,Math.max(.1,d*.55-.38),3,6),mat('#50534a'));stitch.position.set((a.x+b.x)/2,(a.y+b.y)/2,2.17);stitch.rotation.z=-Math.atan2(b.x-a.x,b.y-a.y);model.add(stitch);}
model.scale.setScalar(.001);model.updateMatrixWorld(true);
const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());
console.log('Bounds mm',size.multiplyScalar(1000).toArray(),'meshes',model.children.length);
const glb=await new GLTFExporter().parseAsync(model,{binary:true});fs.writeFileSync(out+'/patch.glb',Buffer.from(glb));
fs.writeFileSync(out+'/artwork.svg',source);
console.log('GLB bytes',glb.byteLength);


