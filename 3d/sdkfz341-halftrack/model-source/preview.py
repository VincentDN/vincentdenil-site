"""Quick look renders (Cycles, CPU). Used while modelling and for the final beauty shots."""

import math

import bpy
from mathutils import Vector

FLAT = {
    "camo": (0.36, 0.33, 0.24), "dark": (0.06, 0.06, 0.06), "rubber": (0.025, 0.025, 0.025),
    "track": (0.10, 0.09, 0.08), "glass": (0.03, 0.05, 0.07), "canvas": (0.30, 0.27, 0.18),
    "lamp": (0.9, 0.85, 0.7), "red": (0.5, 0.03, 0.02), "white": (0.85, 0.85, 0.8), "black": (0.01, 0.01, 0.01),
    "interior": (0.42, 0.45, 0.40), "optic": (0.02, 0.03, 0.06), "wood": (0.30, 0.2, 0.1), "num": (0.45, 0.06, 0.04),
}


def flat_materials(names):
    mats = []
    for n in names:
        m = bpy.data.materials.new(n)
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (*FLAT[n], 1)
        b.inputs["Roughness"].default_value = 0.15 if n in ("glass", "optic", "lamp") else 0.7
        mats.append(m)
    return mats


def setup_world(strength=1.0, snow=True):
    scn = bpy.context.scene
    w = scn.world or bpy.data.worlds.new("World")
    scn.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    sky = nt.nodes.new("ShaderNodeBackground")
    sky.inputs[0].default_value = (0.75, 0.80, 0.88, 1)
    sky.inputs[1].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(sky.outputs[0], out.inputs[0])
    sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", "SUN"))
    sun.data.energy = 3.2
    sun.data.angle = math.radians(3)
    sun.rotation_euler = (math.radians(52), 0, math.radians(215))
    scn.collection.objects.link(sun)
    # ground
    me = bpy.data.meshes.new("ground")
    s = 60
    me.from_pydata([(-s, -s, 0), (s, -s, 0), (s, s, 0), (-s, s, 0)], [], [(0, 1, 2, 3)])
    g = bpy.data.objects.new("ground", me)
    m = bpy.data.materials.new("ground")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.82, 0.84, 0.88, 1) if snow else (0.3, 0.3, 0.3, 1)
    b.inputs["Roughness"].default_value = 0.9
    me.materials.append(m)
    scn.collection.objects.link(g)
    return sun, g


def camera(name, loc, target, lens=50):
    cam = bpy.data.objects.new(name, bpy.data.cameras.new(name))
    cam.data.lens = lens
    cam.location = loc
    d = Vector(target) - Vector(loc)
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.collection.objects.link(cam)
    return cam


VIEWS = {
    "front34": ((9.5, 7.5, 3.6), (0.3, 0, 1.2), 50),
    "rear34": ((-9.5, -7.0, 3.4), (-0.2, 0, 1.2), 50),
    "side": ((0.2, 13.5, 1.6), (0.2, 0, 1.3), 60),
    "top": ((0.1, 0.0, 16), (0.1, 0, 0), 60),
    "hero": ((8.2, 6.2, 5.6), (0.2, 0, 1.4), 45),
    "front": ((14, 0.0, 1.8), (0, 0, 1.4), 70),
    "detail": ((4.6, 3.6, 2.6), (1.4, 0.3, 1.6), 50),
    "rearlow": ((-8.5, 3.5, 1.5), (-1.5, 0, 1.3), 50),
}


def render(path, view="front34", res=(1280, 720), samples=24):
    scn = bpy.context.scene
    scn.render.engine = "CYCLES"
    scn.cycles.device = "CPU"
    scn.cycles.samples = samples
    scn.cycles.use_denoising = True
    scn.cycles.max_bounces = 3
    scn.render.threads_mode = "AUTO"
    scn.render.resolution_x, scn.render.resolution_y = res
    scn.render.image_settings.file_format = "JPEG" if path.endswith(".jpg") else "PNG"
    scn.render.image_settings.quality = 90
    scn.view_settings.view_transform = "Filmic" if "Filmic" in [
        i.identifier for i in type(scn.view_settings).bl_rna.properties["view_transform"].enum_items] else scn.view_settings.view_transform
    loc, tgt, lens = VIEWS[view]
    cam = camera("cam_" + view, loc, tgt, lens)
    scn.camera = cam
    scn.render.filepath = path
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(cam)
