"""Build the Sd.Kfz.341 MRAP half-track from nothing.

    python3 build.py --out .. [--res 2048] [--renders] [--gemwerk /path/to/gemwerk_io]

Needs Blender's Python module (`pip install bpy`), or run it inside Blender:
`blender -b -P build.py -- --out ..`.
"""

import argparse
import json
import math
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import bpy  # noqa: E402
from mathutils import Matrix  # noqa: E402

import animate  # noqa: E402
import export  # noqa: E402
import preview  # noqa: E402
import texture  # noqa: E402
import vehicle  # noqa: E402

ENTITY = ("goh-mod", "sdkfz341_halftrack", "resource", "entity", "-vehicle", "germany", "btr", "sdkfz341")
POSE = (("turret", 38), ("ramp", -127.5), ("hatch_driver", -96), ("hatch_commander", -96), ("gun", -10),
        ("steerl", 22), ("steerr", 22))


def pose(parts, sign):
    for name, ang in POSE:
        o = parts[name]
        o.matrix_basis = o.matrix_basis @ Matrix.Rotation(math.radians(sign * ang), 4, "Z")


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, ".."))
    ap.add_argument("--res", type=int, default=2048, help="texture size per set")
    ap.add_argument("--gemwerk", default=os.environ.get("GEMWERK", ""), help="path of a GemWerk checkout")
    ap.add_argument("--renders", action="store_true")
    ap.add_argument("--no-export", action="store_true")
    a = ap.parse_args(argv)
    out = os.path.abspath(a.out)
    os.makedirs(out, exist_ok=True)
    t0 = time.time()

    bpy.ops.wm.read_factory_settings(use_empty=True)
    mats = preview.flat_materials(vehicle.MAT_NAMES)
    parts = vehicle.build(mats)
    texture.unwrap_sets(parts)
    mod_dir = os.path.join(out, *ENTITY)
    images = texture.make_textures(parts, os.path.join(out, "textures"), {k: a.res for k in texture.SETS}, dds_dir=mod_dir)
    texture.final_materials(parts, images)
    animate.split_tracks(parts)
    animate.animate(parts)
    print("built + textured in %.0fs" % (time.time() - t0))

    stats = {"mesh_objects": 0, "triangles_without_tracks": 0}
    for o in bpy.context.scene.objects:
        if o.type == "MESH" and not o.name.startswith("link"):
            stats["mesh_objects"] += 1
            stats["triangles_without_tracks"] += sum(len(p.vertices) - 2 for p in o.data.polygons)
    track_tris = sum(len(p.vertices) - 2 for p in parts["trackl_game"].data.polygons)
    stats["mesh_objects"] += 2
    stats["triangles"] = stats["triangles_without_tracks"] + 2 * track_tris
    stats["track_links_per_side"] = len(parts["_links"][0])
    stats["texture_size"] = a.res
    stats["clips"] = {k: {"frames": v, "nodes": len(parts["_clips"][k])} for k, v in animate.CLIPS.items()}

    blend = os.path.join(out, "sdkfz341.blend")
    for img in bpy.data.images:
        if img.filepath_raw:
            img.filepath = "//" + os.path.relpath(img.filepath_raw, out).replace(os.sep, "/")
    bpy.ops.wm.save_as_mainfile(filepath=blend, compress=True)

    if not a.no_export:
        export.export_glb(os.path.join(out, "sdkfz341.glb"))
        try:
            export.export_fbx(os.path.join(out, "sdkfz341.fbx"))
        except Exception as e:      # the FBX add-on may be missing from a bare bpy build
            print("FBX export skipped:", e)

    if a.renders:
        rd = os.path.join(out, "renders")
        os.makedirs(rd, exist_ok=True)
        sun, ground = preview.setup_world()
        for view in ("hero", "side", "front34", "rear34"):
            preview.render(os.path.join(rd, view + ".jpg"), view, res=(1600, 1000), samples=48)
        pose(parts, 1)
        preview.render(os.path.join(rd, "posed_rear.jpg"), "rearlow", res=(1600, 1000), samples=48)
        preview.render(os.path.join(rd, "posed_front.jpg"), "front34", res=(1600, 1000), samples=48)
        pose(parts, -1)
        bpy.data.objects.remove(sun)
        bpy.data.objects.remove(ground)

    if a.gemwerk:
        mdl = export.export_gem(parts, mod_dir, a.gemwerk)
        stats["gem"] = export.verify_gem(mdl, a.gemwerk)
    with open(os.path.join(out, "build-report.json"), "w") as f:
        json.dump(stats, f, indent=1)
    print(json.dumps(stats, indent=1))
    print("total %.0fs" % (time.time() - t0))


main()
