"""UVs, baking and procedural painting for the Sd.Kfz.341.

Cycles bakes three cheap helper passes per texture set (world position, world
normal, material id) plus ambient occlusion. The actual paint job - Hinterhalt
three-tone camouflage with ambush dots, markings wear, mud, streaks, rust - is
then computed in numpy from those passes, which keeps the pattern continuous
across hull and turret and makes the result reproducible.
"""

import math
import os

import bpy
import numpy as np

import vehicle as vh
from geo import MeshBuilder

SETS = {
    "sdkfz341_body": ["body", "hatch_driver", "hatch_commander", "ramp"],
    "sdkfz341_turret": ["turret", "gun", "gun_barrel", "sight"],
    "sdkfz341_chassis": ["wheell", "wheell1", "sprocketl", "idlerl", "rollerl1", "_tracklink"],
}
# objects that reuse another object's UVs: name -> (source, mode)
COPIES = {"wheelr": ("wheell", "mirror")}
for i in range(1, 5):
    if i > 1:
        COPIES["wheell%d" % i] = ("wheell1", "same")
    COPIES["wheelr%d" % i] = ("wheell1", "mirror")
COPIES.update({"sprocketr": ("sprocketl", "mirror"), "idlerr": ("idlerl", "mirror"),
               "rollerl2": ("rollerl1", "same"), "rollerr1": ("rollerl1", "mirror"), "rollerr2": ("rollerl1", "mirror"),
               "trackl": ("_tracklink", "tile"), "trackr": ("_tracklink", "tile")})

POS_RANGE = 6.0     # positions are stored as (p + POS_RANGE) / (2 * POS_RANGE)


def set_of(name):
    src = COPIES.get(name, (name,))[0]
    for s, names in SETS.items():
        if src in names:
            return s
    return None


# ---------------------------------------------------------------------------
# UVs
# ---------------------------------------------------------------------------
def _select_only(objs):
    bpy.context.view_layer.update()
    for o in bpy.context.scene.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]


# texel budget per material: flat-colour decals, hidden interior and tiny parts need less
ISLAND_SCALE = {vh.WHITE: 0.6, vh.BLACK: 0.6, vh.NUM: 0.6, vh.INTERIOR: 0.55, vh.GLASS: 0.6, vh.OPTIC: 0.6,
                vh.LAMP: 0.6, vh.RED: 0.6, vh.BLACK: 0.5}


def _scale_islands(me):
    """Shrink the UV islands of low-priority materials and of very small parts about their centre."""
    uv = np.zeros(len(me.loops) * 2, dtype=np.float32)
    me.uv_layers[0].data.foreach_get("uv", uv)
    uv = uv.reshape(-1, 2)
    parent = list(range(len(me.polygons)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i
    edge_face = {}
    for p in me.polygons:
        ls = list(p.loop_indices)
        vs = list(p.vertices)
        for k in range(len(vs)):
            a, b = vs[k], vs[(k + 1) % len(vs)]
            la, lb = ls[k], ls[(k + 1) % len(vs)]
            key = (min(a, b), max(a, b))
            ua, ub = (uv[la], uv[lb]) if a < b else (uv[lb], uv[la])
            if key in edge_face:
                f2, ua2, ub2 = edge_face[key]
                if abs(ua - ua2).max() < 1e-5 and abs(ub - ub2).max() < 1e-5:
                    parent[find(p.index)] = find(f2)
            else:
                edge_face[key] = (p.index, ua.copy(), ub.copy())
    groups = {}
    for p in me.polygons:
        groups.setdefault(find(p.index), []).append(p)
    for polys in groups.values():
        loops = [l for p in polys for l in p.loop_indices]
        area = sum(p.area for p in polys)
        sc = ISLAND_SCALE.get(polys[0].material_index, 1.0)
        if area < 0.0015:          # bolts, pins, lens rims
            sc = min(sc, 0.6)
        if sc != 1.0:
            c = uv[loops].mean(axis=0)
            uv[loops] = c + (uv[loops] - c) * sc
    me.uv_layers[0].data.foreach_set("uv", uv.ravel())


def unwrap_sets(parts):
    # temp single track link at the origin
    link = vh.build_track_link(parts["_links"][1]).to_object("_tracklink", list(parts["body"].data.materials))
    link.location = (0, 0, -3.0)
    parts["_tracklink"] = link
    for sname, names in SETS.items():
        objs = [parts[n] for n in names]
        for o in objs:
            if not o.data.uv_layers:
                o.data.uv_layers.new(name="UVMap")
        _select_only(objs)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.0, area_weight=0.0,
                                 correct_aspect=True, scale_to_bounds=False)
        bpy.ops.uv.select_all(action="SELECT")
        bpy.ops.uv.average_islands_scale()
        bpy.ops.object.mode_set(mode="OBJECT")
        for o in objs:
            _scale_islands(o.data)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.select_all(action="SELECT")
        bpy.ops.uv.pack_islands(margin=0.002, rotate=True, scale=True)
        bpy.ops.object.mode_set(mode="OBJECT")
    # propagate
    for name, (src, mode) in COPIES.items():
        dst, s = parts[name].data, parts[src].data
        if not dst.uv_layers:
            dst.uv_layers.new(name="UVMap")
        suv = np.zeros(len(s.loops) * 2, dtype=np.float32)
        s.uv_layers[0].data.foreach_get("uv", suv)
        suv = suv.reshape(-1, 2)
        if mode == "same":
            duv = suv
        elif mode == "mirror":
            duv = np.empty_like(suv)
            for sp, dp in zip(s.polygons, dst.polygons):
                a, n = sp.loop_start, sp.loop_total
                duv[dp.loop_start:dp.loop_start + n] = suv[a:a + n][::-1]
        else:   # tile: destination is the source repeated
            reps = len(dst.loops) // len(s.loops)
            assert reps * len(s.loops) == len(dst.loops), (name, len(dst.loops), len(s.loops))
            duv = np.tile(suv, (reps, 1))
        assert len(duv) == len(dst.loops), (name, len(duv), len(dst.loops))
        dst.uv_layers[0].data.foreach_set("uv", duv.astype(np.float32).ravel())


# ---------------------------------------------------------------------------
# baking helper passes
# ---------------------------------------------------------------------------
def _prep_bake_material(mat, idx, kind, image):
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    if kind == "ao":
        sh = nt.nodes.new("ShaderNodeBsdfDiffuse")
        sh.inputs[0].default_value = (0.8, 0.8, 0.8, 1)
        nt.links.new(sh.outputs[0], out.inputs[0])
    else:
        em = nt.nodes.new("ShaderNodeEmission")
        geo = nt.nodes.new("ShaderNodeNewGeometry")
        if kind == "id":
            v = (idx + 0.5) / 16.0
            em.inputs[0].default_value = (v, v, v, 1)
        else:
            mul = nt.nodes.new("ShaderNodeVectorMath")
            mul.operation = "MULTIPLY_ADD"
            k = 1.0 / (2 * POS_RANGE) if kind == "pos" else 0.5
            mul.inputs[1].default_value = (k, k, k)
            mul.inputs[2].default_value = (0.5, 0.5, 0.5)
            nt.links.new(geo.outputs["Position" if kind == "pos" else "Normal"], mul.inputs[0])
            nt.links.new(mul.outputs[0], em.inputs[0])
        nt.links.new(em.outputs[0], out.inputs[0])
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = image
    tex.select = True
    nt.nodes.active = tex


def bake_passes(parts, res):
    """Returns {set: {pass: float array (H, W, 4)}}."""
    scn = bpy.context.scene
    scn.render.engine = "CYCLES"
    scn.cycles.device = "CPU"
    mats = list(parts["body"].data.materials)
    # AO needs the ground
    me = bpy.data.meshes.new("_ao_ground")
    me.from_pydata([(-20, -20, 0), (20, -20, 0), (20, 20, 0), (-20, 20, 0)], [], [(0, 1, 2, 3)])
    ground = bpy.data.objects.new("_ao_ground", me)
    scn.collection.objects.link(ground)
    if scn.world is None:
        scn.world = bpy.data.worlds.new("World")
    scn.world.light_settings.distance = 1.2
    result = {}
    for sname, names in SETS.items():
        r = res[sname]
        objs = [parts[n] for n in names]
        result[sname] = {}
        for kind in ("pos", "nrm", "id", "ao"):
            img = bpy.data.images.new("_bake_%s_%s" % (sname, kind), r, r, alpha=True, float_buffer=True, is_data=True)
            img.colorspace_settings.name = "Non-Color"
            for i, m in enumerate(mats):
                _prep_bake_material(m, i, kind, img)
            _select_only(objs)
            scn.cycles.samples = 48 if kind == "ao" else 1
            scn.cycles.use_denoising = False
            scn.render.bake.margin = 6
            scn.render.bake.margin_type = "EXTEND"
            scn.render.bake.use_clear = True
            scn.render.bake.target = "IMAGE_TEXTURES"
            if kind != "ao":
                scn.render.bake.use_pass_direct = False
                scn.render.bake.use_pass_indirect = False
            bpy.ops.object.bake(type="AO" if kind == "ao" else "EMIT")
            a = np.empty(r * r * 4, dtype=np.float32)
            img.pixels.foreach_get(a)
            result[sname][kind] = a.reshape(r, r, 4).copy()
            bpy.data.images.remove(img)
    bpy.data.objects.remove(ground)
    return result


# ---------------------------------------------------------------------------
# numpy noise
# ---------------------------------------------------------------------------
def _hash(ix, iy, iz, seed):
    h = (ix.astype(np.uint32) * np.uint32(374761393) + iy.astype(np.uint32) * np.uint32(668265263)
         + iz.astype(np.uint32) * np.uint32(2246822519) + np.uint32(seed * 3266489917 & 0xFFFFFFFF))
    h = (h ^ (h >> np.uint32(13))) * np.uint32(1274126177)
    h = h ^ (h >> np.uint32(16))
    return h.astype(np.float32) / np.float32(4294967296.0)


def vnoise(p, seed=0):
    f = np.floor(p)
    t = p - f
    t = t * t * (3 - 2 * t)
    i = f.astype(np.int64)
    out = 0
    for dx in (0, 1):
        wx = t[:, 0] if dx else 1 - t[:, 0]
        for dy in (0, 1):
            wy = t[:, 1] if dy else 1 - t[:, 1]
            for dz in (0, 1):
                wz = t[:, 2] if dz else 1 - t[:, 2]
                out = out + _hash(i[:, 0] + dx, i[:, 1] + dy, i[:, 2] + dz, seed) * wx * wy * wz
    return out


def fbm(p, scale, octaves=4, seed=0, gain=0.5):
    out, amp, tot = 0, 1.0, 0.0
    q = p * scale
    for o in range(octaves):
        out = out + vnoise(q, seed + o * 17) * amp
        tot += amp
        amp *= gain
        q = q * 2.03 + 11.7
    return out / tot


def cells(p, scale, seed=0):
    """Nearest feature point: (distance in cell units, per-cell random)."""
    q = p * scale
    f = np.floor(q).astype(np.int64)
    best = np.full(len(p), 9.0, dtype=np.float32)
    rnd = np.zeros(len(p), dtype=np.float32)
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for dz in (-1, 0, 1):
                cx, cy, cz = f[:, 0] + dx, f[:, 1] + dy, f[:, 2] + dz
                px = cx + _hash(cx, cy, cz, seed + 1)
                py = cy + _hash(cx, cy, cz, seed + 2)
                pz = cz + _hash(cx, cy, cz, seed + 3)
                d = np.sqrt((q[:, 0] - px) ** 2 + (q[:, 1] - py) ** 2 + (q[:, 2] - pz) ** 2).astype(np.float32)
                m = d < best
                best = np.where(m, d, best)
                rnd = np.where(m, _hash(cx, cy, cz, seed + 4), rnd)
    return best, rnd


def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def mix(a, b, t):
    t = t[:, None] if t.ndim == 1 else t
    return a * (1 - t) + b * t


def col(r, g, b):
    return np.array([r, g, b], dtype=np.float32)


# ---------------------------------------------------------------------------
# paint
# ---------------------------------------------------------------------------
def srgb(r, g, b):
    return (np.array([r, g, b], dtype=np.float32) / 255.0) ** 2.2


YELLOW = srgb(166, 142, 92)      # Dunkelgelb
BROWN = srgb(96, 54, 40)         # Rotbraun
GREEN = srgb(68, 82, 50)         # Olivgruen
MUD = srgb(84, 70, 54)
DUST = srgb(150, 138, 116)
RUST = srgb(120, 66, 36)


def camo(p):
    warp = np.stack([fbm(p, 1.7, 2, 31), fbm(p, 1.7, 2, 32), fbm(p, 1.7, 2, 33)], axis=1) - 0.5
    q = p + warp * 0.55
    n1 = fbm(q, 0.95, 3, 1)
    n2 = fbm(q, 0.95, 3, 2)
    brown = sstep(0.515, 0.54, n1)
    green = sstep(0.455, 0.48, n2) * (1 - brown)
    c = np.broadcast_to(YELLOW, (len(p), 3)).copy()
    c = mix(c, GREEN, green)
    c = mix(c, BROWN, brown)
    # ambush dots: yellow on dark areas, brown / green on yellow
    d, r = cells(p, 8.5, 5)
    dot = sstep(0.25, 0.20, d) * (r > 0.35)
    dark = np.clip(brown + green, 0, 1)
    on_dark = dot * dark
    on_light = dot * (1 - dark)
    c = mix(c, YELLOW * 1.08, on_dark)
    c = mix(c, np.where((r > 0.65)[:, None], BROWN, GREEN), on_light)
    return c


def paint(passes, sname):
    """Returns diffuse (linear RGB), gloss (0..1), height arrays for one texture set."""
    r = passes["pos"].shape[0]
    pos = (passes["pos"][..., :3].reshape(-1, 3) * 2 - 1) * POS_RANGE
    nrm = passes["nrm"][..., :3].reshape(-1, 3) * 2 - 1
    mid = np.clip(np.round(passes["id"][..., 0].reshape(-1) * 16 - 0.5), 0, 15).astype(np.int32)
    cover = passes["id"][..., 3].reshape(-1) > 0.01
    ao = np.clip(passes["ao"][..., 0].reshape(-1), 0, 1)
    idx = np.nonzero(cover)[0]
    p, n, m, a = pos[idx].astype(np.float32), nrm[idx], mid[idx], ao[idx]
    N = len(idx)
    c = np.zeros((N, 3), dtype=np.float32)
    gloss = np.zeros(N, dtype=np.float32)
    height = np.zeros(N, dtype=np.float32)

    cam = camo(p)
    fine = fbm(p, 38.0, 3, 7)
    med = fbm(p, 6.0, 3, 8)
    chips = sstep(0.66, 0.70, fbm(p, 55.0, 2, 9)) * sstep(0.45, 0.6, fbm(p, 9.0, 2, 10))
    wear = sstep(0.60, 0.66, fbm(p, 30.0, 3, 11))

    def sel(k):
        return m == k

    # painted armour
    k = sel(vh.CAMO)
    cc = cam * (0.80 + 0.20 * med)[:, None]
    cc = mix(cc, col(0.07, 0.05, 0.04), chips * 0.85)
    c[k] = cc[k]
    gloss[k] = (0.20 + 0.10 * fine + 0.25 * chips)[k]
    height[k] = (0.35 * fine - 0.5 * chips)[k]
    # bare / blackened metal
    k = sel(vh.DARK)
    cc = mix(np.broadcast_to(col(0.050, 0.050, 0.048), (N, 3)), RUST, sstep(0.5, 0.75, med) * 0.5)
    c[k] = cc[k]
    gloss[k] = (0.30 + 0.2 * fine)[k]
    height[k] = (0.4 * fine)[k]
    k = sel(vh.RUBBER)
    c[k] = (col(0.022, 0.022, 0.022) * (0.8 + 0.5 * fine)[:, None])[k]
    gloss[k] = 0.12
    height[k] = (0.3 * fine)[k]
    k = sel(vh.TRACK)
    cc = mix(np.broadcast_to(col(0.085, 0.075, 0.065), (N, 3)), RUST, sstep(0.4, 0.7, fbm(p, 14.0, 3, 12)) * 0.6)
    c[k] = cc[k]
    gloss[k] = (0.35 + 0.3 * fine)[k]
    height[k] = (0.6 * fine)[k]
    k = sel(vh.GLASS)
    c[k] = col(0.012, 0.022, 0.028)
    gloss[k] = 0.92
    k = sel(vh.OPTIC)
    c[k] = (col(0.010, 0.014, 0.030) + col(0.02, 0.0, 0.03) * med[:, None])[k]
    gloss[k] = 0.95
    k = sel(vh.CANVAS)
    weave = 0.5 + 0.5 * np.sin(p[:, 0] * 900) * np.sin(p[:, 1] * 900 + p[:, 2] * 900)
    cc = col(0.165, 0.155, 0.085) * (0.75 + 0.35 * med + 0.12 * weave)[:, None]
    c[k] = cc[k]
    gloss[k] = 0.04
    height[k] = (0.5 * weave + 0.5 * med)[k]
    k = sel(vh.LAMP)
    c[k] = col(0.80, 0.76, 0.60)
    gloss[k] = 0.9
    k = sel(vh.RED)
    c[k] = col(0.42, 0.02, 0.012)
    gloss[k] = 0.85
    for kk, base in ((vh.WHITE, col(0.72, 0.72, 0.66)), (vh.BLACK, col(0.018, 0.018, 0.018)), (vh.NUM, col(0.42, 0.045, 0.03))):
        k = sel(kk)
        cc = mix(np.broadcast_to(base, (N, 3)) * (0.9 + 0.2 * med)[:, None], cam, wear * 0.9)
        c[k] = cc[k]
        gloss[k] = 0.2
    k = sel(vh.INTERIOR)
    cc = col(0.36, 0.39, 0.31) * (0.85 + 0.3 * med)[:, None]
    cc = mix(cc, col(0.08, 0.07, 0.06), sstep(0.62, 0.7, fbm(p, 22.0, 3, 13)) * 0.7)
    c[k] = cc[k]
    gloss[k] = 0.22
    height[k] = (0.3 * fine)[k]
    k = sel(vh.WOOD)
    grain = fbm(p * np.array([4.0, 60.0, 60.0], dtype=np.float32), 1.0, 3, 14)
    c[k] = (col(0.26, 0.16, 0.075) * (0.6 + 0.8 * grain)[:, None])[k]
    gloss[k] = 0.1
    height[k] = (0.6 * grain)[k]

    # --- weathering common to everything except lenses ----------------------
    soft = ~np.isin(m, [vh.GLASS, vh.OPTIC, vh.LAMP, vh.RED])
    w = soft.astype(np.float32)
    # crevice dirt from AO
    occ = np.clip(1 - a, 0, 1) ** 1.3
    c = mix(c, c * col(0.42, 0.37, 0.30), occ * 0.85)
    # rain streaks on steep faces
    streak = fbm(p * np.array([9.0, 9.0, 0.7], dtype=np.float32), 1.0, 3, 15)
    steep = 1 - np.abs(n[:, 2])
    c = mix(c, c * 0.62, sstep(0.55, 0.8, streak) * steep * 0.55 * w)
    c = mix(c, DUST, sstep(0.5, 0.25, streak) * steep * 0.10 * w)
    # dust settling on up-facing surfaces
    up = np.clip(n[:, 2], 0, 1)
    c = mix(c, DUST, up * (0.04 + 0.14 * med) * w)
    # mud and road dirt thrown up the lower hull and running gear
    z = p[:, 2]
    splash = sstep(1.55, 0.35, z) * (0.35 + 0.65 * sstep(0.35, 0.65, fbm(p, 3.2, 4, 16)))
    cake = sstep(0.62, 0.72, fbm(p, 11.0, 3, 17)) * sstep(1.2, 0.3, z)
    mudw = np.clip(splash * 0.75 + cake * 0.6, 0, 0.93)
    if sname == "sdkfz341_chassis":
        mudw = np.clip(0.12 + 0.45 * sstep(0.4, 0.7, fbm(p, 9.0, 4, 16)) + cake * 0.3, 0, 0.9)
    mudc = MUD * (0.8 + 0.5 * fine)[:, None]
    c = mix(c, mudc, mudw * (0.25 + 0.75 * w))
    gloss = gloss * (1 - 0.8 * mudw) * (1 - 0.5 * occ)
    height = height + 0.5 * mudw * fbm(p, 60.0, 2, 18)
    c = c * (0.55 + 0.45 * a)[:, None]            # bake a share of the AO into the diffuse, the GEM way

    def full(v, ch):
        out = np.zeros((r * r, ch), dtype=np.float32)
        out[idx] = v.reshape(N, ch)
        return out.reshape(r, r, ch)
    return full(np.clip(c, 0, 1), 3), full(gloss, 1)[..., 0], full(height, 1)[..., 0], cover.reshape(r, r), full(a, 1)[..., 0]


def height_to_normal(h, strength=2.0):
    dx = (np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)) * strength
    dy = (np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)) * strength
    nz = np.ones_like(h)
    ln = np.sqrt(dx * dx + dy * dy + 1)
    n = np.stack([-dx / ln, -dy / ln, nz / ln], axis=-1)
    return n * 0.5 + 0.5


def linear_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def save_image(name, arr, path, srgb):
    """arr: (H, W, 3 or 4) floats in display space (already sRGB encoded when srgb=True)."""
    h, w = arr.shape[:2]
    if arr.shape[2] == 3:
        arr = np.concatenate([arr, np.ones((h, w, 1), dtype=np.float32)], axis=2)
    img = bpy.data.images.new(name, w, h, alpha=False)
    img.colorspace_settings.name = "sRGB" if srgb else "Non-Color"
    # pixels are stored in the image's colour space for byte images
    img.pixels.foreach_set(arr.astype(np.float32).ravel())
    img.filepath_raw = path
    img.file_format = "PNG"
    img.save()
    img.pack() if False else None
    return img


# ---------------------------------------------------------------------------
# DDS (DXT1) writer so the game textures don't need an external tool
# ---------------------------------------------------------------------------
def _dxt1(rgb):
    """rgb: (H, W, 3) uint8, H and W multiples of 4. Range-fit BC1."""
    h, w = rgb.shape[:2]
    b = rgb.reshape(h // 4, 4, w // 4, 4, 3).transpose(0, 2, 1, 3, 4).reshape(-1, 16, 3).astype(np.float32)
    mean = b.mean(axis=1, keepdims=True)
    d = b - mean
    # principal axis by a couple of power iterations
    cov = np.einsum("nij,nik->njk", d, d)
    v = np.ones((len(b), 3), dtype=np.float32)
    for _ in range(4):
        v = np.einsum("njk,nk->nj", cov, v)
        v /= np.maximum(np.linalg.norm(v, axis=1, keepdims=True), 1e-6)
    t = np.einsum("nij,nj->ni", d, v)
    c0 = mean[:, 0] + v * t.max(axis=1, keepdims=True)
    c1 = mean[:, 0] + v * t.min(axis=1, keepdims=True)

    def to565(c):
        c = np.clip(np.round(c), 0, 255).astype(np.uint32)
        return ((c[:, 0] >> 3) << 11) | ((c[:, 1] >> 2) << 5) | (c[:, 2] >> 3)

    def from565(x):
        r, g, bl = (x >> 11) & 31, (x >> 5) & 63, x & 31
        return np.stack([(r << 3) | (r >> 2), (g << 2) | (g >> 4), (bl << 3) | (bl >> 2)], axis=1).astype(np.float32)
    q0, q1 = to565(c0), to565(c1)
    swap = q0 < q1
    q0, q1 = np.where(swap, q1, q0), np.where(swap, q0, q1)
    same = q0 == q1
    e0, e1 = from565(q0), from565(q1)
    pal = np.stack([e0, e1, (2 * e0 + e1) / 3, (e0 + 2 * e1) / 3], axis=1)        # (n, 4, 3)
    dist = ((b[:, :, None, :] - pal[:, None, :, :]) ** 2).sum(axis=3)              # (n, 16, 4)
    sel = dist.argmin(axis=2).astype(np.uint32)
    sel[same] = 0
    bits = np.zeros(len(b), dtype=np.uint32)
    for i in range(16):
        bits |= sel[:, i] << np.uint32(2 * i)
    out = np.empty((len(b), 8), dtype=np.uint8)
    out[:, 0] = q0 & 255
    out[:, 1] = q0 >> 8
    out[:, 2] = q1 & 255
    out[:, 3] = q1 >> 8
    for i in range(4):
        out[:, 4 + i] = (bits >> np.uint32(8 * i)) & 255
    return out.tobytes()


def write_dds(path, rgb8):
    """rgb8: (H, W, 3) uint8 with row 0 at the TOP. Writes DXT1 with a full mip chain."""
    import struct
    h, w = rgb8.shape[:2]
    mips = []
    cur = rgb8.astype(np.float32)
    while True:
        hh, ww = cur.shape[:2]
        pad = cur
        if hh % 4 or ww % 4:
            pad = np.pad(cur, ((0, (4 - hh % 4) % 4), (0, (4 - ww % 4) % 4), (0, 0)), mode="edge")
        mips.append(_dxt1(np.clip(np.round(pad), 0, 255).astype(np.uint8)))
        if hh == 1 and ww == 1:
            break
        nh, nw = max(1, hh // 2), max(1, ww // 2)
        cur = cur[:nh * 2 if hh > 1 else 1, :nw * 2 if ww > 1 else 1]
        if hh > 1 and ww > 1:
            cur = cur.reshape(nh, 2, nw, 2, 3).mean(axis=(1, 3))
        elif hh > 1:
            cur = cur.reshape(nh, 2, 1, 3).mean(axis=1)
        else:
            cur = cur.reshape(1, nw, 2, 3).mean(axis=2)
    flags = 0x1 | 0x2 | 0x4 | 0x1000 | 0x20000 | 0x80000
    hdr = struct.pack("<4s7I44x", b"DDS ", 124, flags, h, w, len(mips[0]), 0, len(mips))
    pf = struct.pack("<2I4s5I", 32, 0x4, b"DXT1", 0, 0, 0, 0, 0)
    caps = struct.pack("<4I4x", 0x1000 | 0x8 | 0x400000, 0, 0, 0)
    with open(path, "wb") as f:
        f.write(hdr + pf + caps)
        for m in mips:
            f.write(m)


# ---------------------------------------------------------------------------
# driver
# ---------------------------------------------------------------------------
def make_textures(parts, out_dir, res, dds_dir=None):
    """Bake + paint every set. Returns {set: {"diffuse": Image, "normal": Image, "orm": Image}}."""
    os.makedirs(out_dir, exist_ok=True)
    passes = bake_passes(parts, res)
    images = {}
    for sname in SETS:
        diff, gloss, height, cover, ao = paint(passes[sname], sname)
        nrm = height_to_normal(height, strength=0.55)
        d_srgb = linear_to_srgb(diff)
        rough = np.clip(1.0 - gloss, 0.04, 1.0)
        metal = np.zeros_like(rough)
        orm = np.stack([np.where(cover, ao, 1.0), rough, metal], axis=-1)
        spec = np.stack([gloss, gloss, gloss], axis=-1)
        images[sname] = {
            "diffuse": save_image(sname, d_srgb, os.path.join(out_dir, sname + ".png"), True),
            "normal": save_image(sname + "_n", nrm, os.path.join(out_dir, sname + "_n.png"), False),
            "orm": save_image(sname + "_orm", orm, os.path.join(out_dir, sname + "_orm.png"), False),
        }
        if dds_dir:
            os.makedirs(dds_dir, exist_ok=True)

            def top(a):
                return np.clip(np.round(a[::-1] * 255), 0, 255).astype(np.uint8)
            write_dds(os.path.join(dds_dir, sname + ".dds"), top(d_srgb))
            write_dds(os.path.join(dds_dir, sname + "_bp.dds"), top(nrm))
            write_dds(os.path.join(dds_dir, sname + "_sp.dds"), top(spec))
    return images


def final_materials(parts, images):
    """Replace the slot materials by one PBR material per texture set."""
    mats = {}
    for sname, im in images.items():
        m = bpy.data.materials.new(sname)
        m.use_nodes = True
        nt = m.node_tree
        b = nt.nodes["Principled BSDF"]
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = im["diffuse"]
        nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
        o = nt.nodes.new("ShaderNodeTexImage")
        o.image = im["orm"]
        sep = nt.nodes.new("ShaderNodeSeparateColor")
        nt.links.new(o.outputs["Color"], sep.inputs[0])
        nt.links.new(sep.outputs[1], b.inputs["Roughness"])
        nt.links.new(sep.outputs[2], b.inputs["Metallic"])
        nn = nt.nodes.new("ShaderNodeTexImage")
        nn.image = im["normal"]
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nt.links.new(nn.outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
        mats[sname] = m
    old = set()
    for name, ob in parts.items():
        if (name.startswith("_") and name != "_tracklink") or getattr(ob, "type", None) != "MESH":
            continue
        s = set_of(name)
        for mm in ob.data.materials:
            old.add(mm)
        ob.data.materials.clear()
        ob.data.materials.append(mats[s])
        ob.data.polygons.foreach_set("material_index", [0] * len(ob.data.polygons))
    for mm in old:
        if mm is not None and mm.users == 0:
            bpy.data.materials.remove(mm)
    return mats
