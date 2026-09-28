import bpy, os, math, bmesh
from mathutils import Vector, Matrix
from pathlib import Path
HERE=Path(__file__).resolve().parent
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=str(HERE / 'Crane-On-Ground.fbx'))
o=list(bpy.context.scene.objects)[0]
world=o.matrix_world.copy()
for v in o.data.vertices:
 p=world@v.co
 dx,dy=p.x-.06097484,p.y+.07281494
 v.co=Vector(((-.47244537*dx-.88135996*dy)*1.15,(.88135996*dx-.47244537*dy)*.8,p.z*40/51))
o.matrix_world=Matrix.Identity(4)
bm=bmesh.new();bm.from_mesh(o.data)
# The original cargo and cable occupy the space used by the new flag.
bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.co.x>5.8 and 1<v.co.z<38.8],context='VERTS')
bm.to_mesh(o.data);bm.free()
o.data.materials.clear()
for name,color,metal in [('Weathered ochre steel',(0.48,.39,.20,1),.55),('Concrete ballast',(.36,.39,.38,1),0),('Cab glazing',(.10,.19,.23,1),.3)]:
 m=bpy.data.materials.new(name);m.diffuse_color=color;m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=color;bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=.7
 o.data.materials.append(m)
for p in o.data.polygons:
 c=sum((o.data.vertices[i].co for i in p.vertices),Vector())/len(p.vertices)
 p.material_index=1 if c.z<.65 or (c.x<-7 and c.z>39) else 0
o.name='Majadroid tower crane — adapted CC0'
bpy.context.view_layer.objects.active=o;o.select_set(True)
dest=str(HERE.parent / 'models')
os.makedirs(dest,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=dest+'/crane.glb',export_format='GLB',use_selection=True)
print('EXPORTED',len(o.data.vertices),'vertices')
