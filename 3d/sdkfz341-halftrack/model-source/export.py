"""Exports: glTF (web viewer), FBX (DCC interchange) and the GEM engine files
(.mdl/.ply/.vol/.anm/.mtl) for Call to Arms - Gates of Hell: Ostfront.

The GEM files are written with GemWerk (https://github.com/vsevoloden/gemwerk_io),
a third-party Blender add-on that is not vendored here; pass the path of a
checkout with --gemwerk. Without it everything else is still built.
"""

import os
import sys

import bpy
from mathutils import Matrix, Vector

import animate
import vehicle as vh
from geo import MeshBuilder, world_matrix

GEM_SCALE = 20.0      # GEM units per metre


def export_glb(path):
    bpy.ops.export_scene.gltf(
        filepath=path, export_format="GLB", use_visible=True, export_yup=True,
        export_image_format="JPEG", export_jpeg_quality=88,
        export_animations=True, export_animation_mode="NLA_TRACKS", export_force_sampling=True,
        export_optimize_animation_size=True, export_extras=False, export_cameras=False, export_lights=False)


def export_fbx(path):
    bpy.ops.export_scene.fbx(filepath=path, use_visible=True, object_types={"EMPTY", "MESH"},
                             bake_anim=False, path_mode="COPY", embed_textures=False,
                             axis_forward="Y", axis_up="Z", global_scale=1.0, apply_unit_scale=True,
                             mesh_smooth_type="FACE")


# ---------------------------------------------------------------------------
# GEM
# ---------------------------------------------------------------------------
def _load_gemwerk(path):
    sys.path.insert(0, path)
    import io_gemwerk
    try:
        io_gemwerk.register()
    except Exception:
        pass
    return io_gemwerk


def _volume(name, parent, shape, verts, faces, col, component=None):
    inv = world_matrix(parent).inverted()
    me = bpy.data.meshes.new(name + "_vol")
    me.from_pydata([tuple(inv @ Vector(v)) for v in verts], [], faces)
    me.update()
    ob = bpy.data.objects.new(name + "_vol", me)
    col.objects.link(ob)
    ob.parent = parent
    ob.matrix_parent_inverse = Matrix.Identity(4)
    g = ob.gem
    g.role = "VOLUME"
    g.game_name = name
    g.vol_shape = shape
    if shape == "polyhedron":
        g.vol_file = name + ".vol"
    if component:
        g.use_component = True
        g.component = component
    return ob


def _box_verts(lo, hi):
    return [(x, y, z) for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])]


def _closed_loft(rings):
    mb = MeshBuilder()
    mb.loft(rings, 0, caps=(True, True))
    # weld coincident vertices so the polyhedron is watertight
    key, verts, remap = {}, [], []
    for v in mb.verts:
        k = tuple(round(c, 5) for c in v)
        if k not in key:
            key[k] = len(verts)
            verts.append(v)
        remap.append(key[k])
    faces = []
    for f in mb.faces:
        f = [remap[i] for i in f]
        f = [i for k, i in enumerate(f) if i != f[k - 1]]
        if len(f) >= 3:
            for k in range(1, len(f) - 1):
                faces.append((f[0], f[k], f[k + 1]))
    return verts, faces


def prepare_gem_scene(parts, name="sdkfz341"):
    """Turn the showcase scene into what a GEM exporter wants: single-mesh tracks,
    GEM units (1 m = 20), a model root, bone roles, joint types, volumes, obstacle.
    Needs the GemWerk add-on registered (it provides the `gem` properties)."""
    scn = bpy.context.scene
    col = scn.collection

    # 1. single-mesh tracks instead of the showcase links
    for side in "lr":
        for ob in parts["_linkobjs"][side]:
            bpy.data.objects.remove(ob)
        bpy.data.objects.remove(parts["track" + side])
        single = parts.pop("track%s_game" % side)
        single.name = "track" + side
        for c in list(single.users_collection):
            c.objects.unlink(single)
        col.objects.link(single)
        parts["track" + side] = single
    animate.activate(parts, None)

    # 2. metres -> GEM units
    S = Matrix.Scale(GEM_SCALE, 4)
    for me in {o.data for o in scn.objects if o.type == "MESH"}:
        me.transform(S)
        me.update()
    for o in scn.objects:
        m = o.matrix_basis.copy()
        m.translation = m.translation * GEM_SCALE
        o.matrix_basis = m
    for act in bpy.data.actions:
        for layer in act.layers:
            for strip in layer.strips:
                for bag in strip.channelbags:
                    for fc in bag.fcurves:
                        if fc.data_path == "location":
                            for kp in fc.keyframe_points:
                                kp.co.y *= GEM_SCALE
                            fc.update()

    # 3. roles
    root = bpy.data.objects.new(name, None)
    root.gem.role = "MODEL"
    col.objects.link(root)
    basis = parts["basis"]
    basis.parent = root
    order = 0

    def mark(o):
        nonlocal order
        g = o.gem
        g.role = "BONE"
        g.game_name = o.name
        g.order = order
        order += 1
        if o.type == "MESH":
            g.has_view = True
            g.ply_file = o.name + ".ply"
        for c in sorted(o.children, key=lambda c: c.name):
            mark(c)
    mark(basis)
    for nm, kind, limits, speed in (("turret", "revolute", None, 0.03), ("gun", "revolute", (-10.0, 45.0), 0.03),
                                    ("sight", "revolute", None, 0.06), ("gun_barrel", "prizmatic", None, None)):
        g = parts[nm].gem
        g.kind = kind
        if limits:
            g.use_limits = True
            g.limits = limits
        if speed:
            g.use_speed = True
            g.speed = speed
    bpy.context.view_layer.update()

    # 4. collision / armour volumes (authored in metres, scaled here)
    k = GEM_SCALE

    def sc(vs):
        return [tuple(Vector(v) * k) for v in vs]
    rings = [[s["a"], s["b"], s["c"], vh.mir(s["c"]), vh.mir(s["b"]), vh.mir(s["a"])] for s in vh.ST]
    v, f = _closed_loft(rings)
    _volume("body", parts["body"], "polyhedron", sc(v), f, col)
    _volume("body_lower", parts["body"], "box", sc(_box_verts((-3.40, -0.82, 0.42), (3.20, 0.82, 1.00))), [], col)
    _volume("engine", parts["body"], "box", sc(_box_verts((1.80, -0.60, 0.90), (3.00, 0.60, 1.35))), [], col)
    base = [(1.02, -0.42), (1.02, 0.42), (0.62, 0.80), (-0.70, 0.80), (-1.04, 0.50), (-1.04, -0.50), (-0.70, -0.80), (0.62, -0.80)]
    top = [(0.30, -0.36), (0.30, 0.36), (0.14, 0.60), (-0.62, 0.60), (-0.88, 0.40), (-0.88, -0.40), (-0.62, -0.60), (0.14, -0.60)]
    T = vh.TURRET_POS
    v, f = _closed_loft([[(x + T.x, y + T.y, 0.08 + T.z) for x, y in base], [(x + T.x, y + T.y, 0.60 + T.z) for x, y in top]])
    _volume("turret", parts["turret"], "polyhedron", sc(v), f, col)
    G = T + vh.GUN_REL
    _volume("gun", parts["gun"], "box", sc(_box_verts((G.x, G.y - 0.07, G.z - 0.07), (T.x + vh.MUZZLE_X, G.y + 0.07, G.z + 0.07))), [], col)
    for side, s in (("l", 1), ("r", -1)):
        y = s * vh.TRACK_Y
        _volume("track" + side, parts["body"], "box",
                sc(_box_verts((vh.IDLER[0] - 0.30, y - vh.TRACK_W / 2, 0.0), (vh.SPROCKET[0] + 0.34, y + vh.TRACK_W / 2, 0.95))), [], col)
        y = s * vh.FRONT_TRACK_Y
        cyl = MeshBuilder()
        cyl.cyl((vh.FRONT_AXLE_X, y - vh.FRONT_W / 2, vh.FRONT_R), (vh.FRONT_AXLE_X, y + vh.FRONT_W / 2, vh.FRONT_R), vh.FRONT_R, n=12)
        _volume("wheel" + side, parts["wheel" + side], "cylinder", sc(cyl.verts), [], col)
    # footprint obstacle
    me = bpy.data.meshes.new("obstacle")
    me.from_pydata(sc([(-3.45, -1.48, 0), (3.62, -1.48, 0), (3.62, 1.48, 0), (-3.45, 1.48, 0)]), [], [(0, 1, 2, 3)])
    ob = bpy.data.objects.new("body_obstacle", me)
    col.objects.link(ob)
    ob.parent = root
    ob.gem.role = "SHAPE"
    ob.gem.shape_tag = "Obstacle"
    ob.gem.shape_kind = "Obb2"
    ob.gem.game_name = "body"
    for m in bpy.data.materials:
        if m.name.startswith("sdkfz341_"):
            m.gem.mtl_name = m.name + ".mtl"
    bpy.context.view_layer.update()
    return root


GEM_SEQUENCES = [("fire", "fire", False), ("ramp_open", "ramp", False), ("ramp_close", "ramp", True),
                 ("hatch_open", "hatches", False), ("hatch_close", "hatches", True)]


def export_gem(parts, out_dir, gemwerk_path, name="sdkfz341"):
    _load_gemwerk(gemwerk_path)
    from io_gemwerk import export_mdl, utils
    from io_gemwerk.formats import anm as anmfmt
    scn = bpy.context.scene
    os.makedirs(out_dir, exist_ok=True)
    root = prepare_gem_scene(parts, name)
    for sname, _, _ in GEM_SEQUENCES:
        it = root.gem.sequences.add()
        it.name = sname
    mdl_path = os.path.join(out_dir, name + ".mdl")
    # the .mtl files are hand-written in the mod folder (diffuse + bump + specular); GemWerk
    # only creates a material file when none exists
    ex = export_mdl.export_mdl(bpy.context, root, mdl_path, apply_modifiers=False, write_mtl=True, force_meshes=True)
    for w in ex.warnings:
        print("GEM warning:", w)
    for sname, clip, rev in GEM_SEQUENCES:
        animate.activate(parts, clip)
        objs = [o for o, _ in parts["_clips"][clip]]
        frames = list(range(0, animate.CLIPS[clip] + 1))
        if rev:
            frames.reverse()
        tracks = {i: [] for i in range(len(objs))}
        for fr in frames:
            scn.frame_set(fr)
            for i, o in enumerate(objs):
                tracks[i].append((utils.matrix_to_gem(utils.local_matrix(o)), 1))
        a = anmfmt.from_tracks([utils.gem_name(o) for o in objs], len(frames), tracks)
        anmfmt.write(os.path.join(out_dir, sname + ".anm"), a, 6)
    animate.activate(parts, None)
    scn.frame_set(0)
    return mdl_path


def verify_gem(mdl_path, gemwerk_path):
    """Read everything back with GemWerk's parsers and report."""
    _load_gemwerk(gemwerk_path)
    from io_gemwerk.formats import anm as anmfmt
    from io_gemwerk.formats import mdl as mdlfmt
    from io_gemwerk.formats import ply as plyfmt
    from io_gemwerk.formats import vol as volfmt
    d = os.path.dirname(mdl_path)
    m = mdlfmt.Model.read(mdl_path)
    bones = [b for b, _ in m.walk_bones()]
    tris = 0
    missing = []
    for b in bones:
        for v in b.views:
            p = os.path.join(d, v.file)
            if not os.path.isfile(p):
                missing.append(v.file)
                continue
            tris += len(plyfmt.read(p).indices) // 3
    for v in m.volumes:
        if v.shape == "polyhedron":
            volfmt.read(os.path.join(d, v.file))
    report = {"bones": len(bones), "mesh_bones": sum(1 for b in bones if b.views), "triangles": tris,
              "volumes": [v.name for v in m.volumes], "shapes": len(m.shapes), "sequences": {}, "missing": missing}
    for s in m.sequences:
        a = anmfmt.read(os.path.join(d, (s.file or s.name + ".anm")))
        report["sequences"][s.name] = {"frames": a.frame_count, "bones": list(a.bones)}
    return report
