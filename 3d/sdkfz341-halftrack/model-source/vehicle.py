"""Sd.Kfz.341 MRAP half-track IFV: geometry.

Authored in metres, +X forward, +Y left, +Z up, ground at z=0. Each moving part
is its own mesh object parented under `basis`, which is exactly how the GEM
engine (Gates of Hell / Men of War) wants a vehicle: one object per bone.
"""

import math

import bpy
from mathutils import Matrix, Vector

from geo import MeshBuilder, V, bilerp, empty, frame, quad_normal, rot, set_parent, sub_quad, tr

# material slots (same order on every object)
CAMO, DARK, RUBBER, TRACK, GLASS, CANVAS, LAMP, RED, WHITE, BLACK, INTERIOR, OPTIC, WOOD, NUM = range(14)
MAT_NAMES = ["camo", "dark", "rubber", "track", "glass", "canvas", "lamp", "red", "white", "black",
             "interior", "optic", "wood", "num"]

# ---------------------------------------------------------------------------
# key dimensions
# ---------------------------------------------------------------------------
FRONT_AXLE_X = 2.25
FRONT_TRACK_Y = 1.22          # wheel centre
FRONT_R = 0.60
FRONT_W = 0.42
TRACK_Y = 1.10
TRACK_W = 0.44
ROAD_R = 0.30
ROAD_Z = 0.335
ROAD_X = [-2.15, -1.45, -0.75, -0.05]
IDLER = (-2.86, 0.50, 0.27)   # x, z, r
SPROCKET = (0.72, 0.58, 0.31)
ROLLERS_X = [-1.80, -0.40]
TURRET_POS = V((-0.95, 0.0, 2.30))
GUN_REL = V((0.62, -0.12, 0.36))
MUZZLE_X = 3.50               # relative to turret origin


def xr(z):
    """Rear plate plane: x as a function of height (leans forward towards the top)."""
    return -3.36 + 0.135 * (z - 1.05)


# upper hull stations, left half: a = lower edge, b = chine, c = roof edge
ST = [
    dict(a=(xr(1.00), 0.84, 1.00), b=(xr(1.50), 1.12, 1.50), c=(xr(2.16), 0.86, 2.16)),
    dict(a=(-2.45, 0.86, 1.00), b=(-2.45, 1.45, 1.50), c=(-2.45, 1.10, 2.30)),
    dict(a=(0.95, 0.86, 1.00), b=(0.95, 1.45, 1.50), c=(0.95, 1.10, 2.30)),
    dict(a=(1.38, 0.86, 1.00), b=(1.38, 1.42, 1.48), c=(1.38, 1.04, 1.80)),
    dict(a=(1.75, 0.80, 0.98), b=(1.75, 1.00, 1.42), c=(1.75, 0.86, 1.72)),
    dict(a=(3.05, 0.72, 0.90), b=(3.05, 0.90, 1.12), c=(3.05, 0.70, 1.30)),
    dict(a=(3.22, 0.70, 0.82), b=(3.22, 0.84, 0.98), c=(3.22, 0.62, 1.08)),
]


def mir(p):
    return (p[0], -p[1], p[2])


def side_quad(j, part, left=True):
    """Outward-facing quad of a hull side plate between stations j and j+1.
    u runs left->right as seen from outside, v runs up."""
    lo, hi = ("a", "b") if part == "lower" else ("b", "c")
    if left:
        return [ST[j + 1][lo], ST[j][lo], ST[j][hi], ST[j + 1][hi]]
    return [mir(ST[j][lo]), mir(ST[j + 1][lo]), mir(ST[j + 1][hi]), mir(ST[j][hi])]


def roof_quad(j):
    """u forward, v towards the left side."""
    return [mir(ST[j]["c"]), mir(ST[j + 1]["c"]), ST[j + 1]["c"], ST[j]["c"]]


def on(q, u, v, lift=0.0):
    return bilerp(q, u, v) + quad_normal(q) * lift


# ---------------------------------------------------------------------------
# decals
# ---------------------------------------------------------------------------
def balkenkreuz(mb, centre, ux, uy, size, lift=0.004):
    c, ux, uy = V(centre), V(ux).normalized(), V(uy).normalized()
    n = ux.cross(uy).normalized()

    def rect(w, h, mat, k):
        o = c + n * (lift * k)
        mb.poly([o - ux * w / 2 - uy * h / 2, o + ux * w / 2 - uy * h / 2,
                 o + ux * w / 2 + uy * h / 2, o - ux * w / 2 + uy * h / 2], mat)
    rect(size, size * 0.36, WHITE, 1)
    rect(size * 0.36, size, WHITE, 1)
    rect(size, size * 0.20, BLACK, 2)
    rect(size * 0.20, size, BLACK, 2)


_text_cache = {}


def text_mesh(s, offset=0.0, shear=0.0):
    key = (s, offset, shear)
    if key in _text_cache:
        return _text_cache[key]
    cu = bpy.data.curves.new("txt", "FONT")
    cu.body = s
    cu.align_x = "CENTER"
    cu.align_y = "CENTER"
    cu.offset = offset
    cu.shear = shear
    cu.resolution_u = 3
    ob = bpy.data.objects.new("txt", cu)
    bpy.context.scene.collection.objects.link(ob)
    dg = bpy.context.evaluated_depsgraph_get()
    me = ob.evaluated_get(dg).to_mesh()
    verts = [tuple(v.co) for v in me.vertices]
    faces = [tuple(p.vertices) for p in me.polygons]
    ob.evaluated_get(dg).to_mesh_clear()
    bpy.data.objects.remove(ob)
    bpy.data.curves.remove(cu)
    _text_cache[key] = (verts, faces)
    return verts, faces


def text(mb, s, centre, ux, uy, height, mat=NUM, lift=0.004, outline=None, shear=0.0):
    c, ux, uy = V(centre), V(ux).normalized(), V(uy).normalized()
    n = ux.cross(uy).normalized()

    def put(off, m, k):
        verts, faces = text_mesh(s, off, shear)
        vs = [c + ux * (x * height) + uy * (y * height) + n * (lift * k) for x, y, _ in verts]
        mb.add(vs, faces, m)
    if outline is not None:
        put(0.035, outline, 1)
        put(0.0, mat, 2)
    else:
        put(0.0, mat, 1)


def decal_axes(q):
    """In-plane right/up axes of a side quad (right = u direction, up = world-up projected)."""
    n = quad_normal(q)
    ux = (V(q[1]) - V(q[0])).normalized()
    uy = n.cross(ux).normalized()
    return ux, uy


# ---------------------------------------------------------------------------
# small reusable bits
# ---------------------------------------------------------------------------
def applique(mb, q, u0, u1, v0, v1, t=0.022, bolts=(3, 2), mat=CAMO, chamfer=0.0):
    """Bolted add-on armour plate on a hull facet."""
    pts = sub_quad(q, u0, u1, v0, v1)
    if chamfer:
        a, b, c, d = [V(p) for p in pts]
        ex, ey = (b - a).normalized() * chamfer, (d - a).normalized() * chamfer
        pts = [a + ex, b - ex, b + ey, c - ey, c - ex, d + ex, d - ey, a + ey]
    n = mb.slab(pts, t, mat)
    bu, bv = bolts
    for i in range(bu):
        for j in range(bv):
            if 0 < i < bu - 1 and 0 < j < bv - 1:
                continue
            uu = u0 + (u1 - u0) * (0.06 + 0.88 * (i / max(1, bu - 1)))
            vv = v0 + (v1 - v0) * (0.10 + 0.80 * (j / max(1, bv - 1)))
            mb.bolt(bilerp(q, uu, vv) + n * t, n, r=0.016, h=0.010, mat=mat)
    return n


def grab_rail(mb, p0, p1, n, stand=0.06, r=0.012, mat=CAMO):
    p0, p1, n = V(p0), V(p1), V(n).normalized()
    mb.tube([p0, p0 + n * stand, p1 + n * stand, p1], r, n=6, mat=mat)


def lifting_eye(mb, p, n, along, r=0.035, mat=CAMO):
    p, n, along = V(p), V(n).normalized(), V(along).normalized()
    pts = [p + along * (r * math.cos(a)) + n * (r * 0.2 + r * math.sin(a)) for a in
           [math.pi * k / 6 for k in range(7)]]
    mb.tube(pts, 0.009, n=5, mat=mat)


def vision_block(mb, q, u0, u1, v0, v1, depth=0.07, hood=0.05):
    """Armoured window: raised frame, recessed glass, eyebrow."""
    n = quad_normal(q)
    outer = sub_quad(q, u0, u1, v0, v1)
    mb.slab(outer, depth, CAMO)
    du, dv = (u1 - u0) * 0.12, (v1 - v0) * 0.16
    glass = sub_quad(q, u0 + du, u1 - du, v0 + dv, v1 - dv)
    mb.slab(glass, 0.006, GLASS, offset=depth)
    # eyebrow along the top edge
    a, b = V(outer[3]), V(outer[2])
    up = (V(outer[3]) - V(outer[0])).normalized()
    mb.slab([a + n * depth, b + n * depth, b + n * (depth + hood) - up * 0.01, a + n * (depth + hood) - up * 0.01][::-1],
            0.018, CAMO)
    for p in outer:
        mb.bolt(V(p) + n * depth + (bilerp(q, (u0 + u1) / 2, (v0 + v1) / 2) - V(p)).normalized() * 0.03, n, mat=CAMO)


def jerrycan(mb, M, mat=CAMO):
    prof = [(-0.08, 0.0), (0.08, 0.0), (0.085, 0.36), (0.05, 0.42), (-0.05, 0.42), (-0.085, 0.36)]
    mb.prism(prof, -0.17, 0.17, "y", mat, M=M)
    mb.cyl((0.03, 0.10, 0.42), (0.03, 0.10, 0.46), 0.022, n=8, mat=DARK, M=M)
    mb.tube([(0, -0.08, 0.42), (0, -0.08, 0.455), (0, 0.04, 0.455), (0, 0.04, 0.42)], 0.008, n=5, mat=mat, M=M)
    mb.box((0.087, 0, 0.2), (0.006, 0.22, 0.2), mat, M=M)


def canvas_roll(mb, p0, p1, r=0.11, seg=7, n=10, seed=1):
    """Lumpy rolled tarp with two straps."""
    import random
    rnd = random.Random(seed)
    p0, p1 = V(p0), V(p1)
    F = frame(p0, p1 - p0)
    L = (p1 - p0).length
    rings = []
    for j in range(seg + 1):
        t = j / seg
        rr = r * (0.82 + 0.18 * math.sin(math.pi * t)) * rnd.uniform(0.93, 1.07)
        if j in (0, seg):
            rr *= 0.72
        ring = [F @ V((L * t, rr * math.cos(2 * math.pi * k / n) * rnd.uniform(0.94, 1.06),
                       rr * 0.85 * math.sin(2 * math.pi * k / n) * rnd.uniform(0.94, 1.06))) for k in range(n)]
        rings.append(ring)
    vs = [v for ring in rings for v in ring]
    fs = [(j * n + k, j * n + (k + 1) % n, (j + 1) * n + (k + 1) % n, (j + 1) * n + k)
          for j in range(seg) for k in range(n)]
    mb.add(vs, fs, CANVAS, smooth=True)
    mb.add(rings[0], [tuple(reversed(range(n)))], CANVAS)
    mb.add(rings[-1], [tuple(range(n))], CANVAS)
    for t in (0.25, 0.75):
        c = p0 + (p1 - p0) * t
        d = (p1 - p0).normalized()
        mb.cyl(c - d * 0.02, c + d * 0.02, r * 1.03, n=n, mat=DARK, caps=(False, False))


def pack(mb, c, size, seed=0):
    """Soft stowage bag: tapered box in canvas with a flap."""
    mb.box(c, size, CANVAS, taper=(0.86, 0.9))
    mb.box((c[0], c[1], c[2] + size[2] * 0.28), (size[0] * 1.02, size[1] * 0.9, size[2] * 0.4), CANVAS, taper=(0.9, 0.9))
    mb.box((c[0], c[1], c[2]), (size[0] * 1.04, 0.03, size[2] * 0.9), DARK)


def antenna(mb, base, height, lean=(0, 0, 0), mat=DARK):
    b = V(base)
    mb.cyl(b, b + V((0, 0, 0.08)), 0.028, n=8, mat=mat)
    mb.cyl(b + V((0, 0, 0.08)), b + V((0, 0, 0.16)), 0.016, n=6, mat=mat)
    top = b + V((0, 0, height)) + V(lean)
    mb.cyl(b + V((0, 0, 0.16)), top, 0.007, n=4, mat=mat, r2=0.004)


# ---------------------------------------------------------------------------
# hull
# ---------------------------------------------------------------------------
def build_hull():
    mb = MeshBuilder()
    # --- upper hull shell ---------------------------------------------------
    rings = [[s["a"], s["b"], s["c"], mir(s["c"]), mir(s["b"]), mir(s["a"])] for s in ST]
    mb.loft(rings, CAMO, caps=(False, True))
    # --- lower tub (V-hull) -------------------------------------------------
    def tub_ring(x, top, low, keel, slanted=False):
        xs = (lambda z: xr(z)) if slanted else (lambda z: x)
        return [(xs(top[1]), top[0], top[1]), (xs(low[1]), low[0], low[1]), (xs(keel), 0.0, keel),
                (xs(low[1]), -low[0], low[1]), (xs(top[1]), -top[0], top[1])]
    tub = [tub_ring(0, (0.84, 1.02), (0.78, 0.56), 0.40, True),
           tub_ring(1.50, (0.84, 1.02), (0.78, 0.56), 0.40),
           tub_ring(2.90, (0.74, 0.94), (0.66, 0.62), 0.52),
           tub_ring(3.22, (0.70, 0.84), (0.60, 0.74), 0.70)]
    # ring order runs left-top -> keel -> right-top, i.e. the opposite way round to the
    # upper hull, so reverse for outward normals
    tub = [list(reversed(r)) for r in tub]
    mb.loft(tub, CAMO, caps=(False, True), closed=False)

    # --- rear plate with ramp opening --------------------------------------
    DW, DZ0, DZ1 = 0.62, 0.66, 2.00

    def rp(y, z):
        return (xr(z), y, z)

    def rear_half(b):
        b.poly([rp(0, 0.40), rp(0.78, 0.56), rp(DW, DZ0), rp(0, DZ0)][::-1], CAMO)
        b.poly([rp(0.78, 0.56), rp(0.84, 1.00), rp(1.12, 1.50), rp(0.86, 2.16), rp(DW, DZ1), rp(DW, DZ0)][::-1], CAMO)
        b.poly([rp(DW, DZ1), rp(0.86, 2.16), rp(0, 2.16), rp(0, DZ1)][::-1], CAMO)
        # door reveal
        d = 0.07
        b.quad(rp(DW, DZ0), rp(DW, DZ1), V(rp(DW, DZ1)) + V((d, 0, 0)), V(rp(DW, DZ0)) + V((d, 0, 0)), INTERIOR)
        b.quad(rp(0, DZ1), V(rp(0, DZ1)) + V((d, 0, 0)), V(rp(DW, DZ1)) + V((d, 0, 0)), rp(DW, DZ1), INTERIOR)
        b.quad(rp(0, DZ0), rp(DW, DZ0), V(rp(DW, DZ0)) + V((d, 0, 0)), V(rp(0, DZ0)) + V((d, 0, 0)), INTERIOR)
        # tail lights + reflectors
        b.box((xr(1.25) - 0.02, 0.98, 1.25), (0.05, 0.16, 0.10), DARK)
        b.cyl((xr(1.25) - 0.045, 1.02, 1.25), (xr(1.25) - 0.055, 1.02, 1.25), 0.032, n=8, mat=RED)
        b.cyl((xr(1.25) - 0.045, 0.94, 1.25), (xr(1.25) - 0.055, 0.94, 1.25), 0.032, n=8, mat=LAMP)
        # mud flap behind the track
        b.box2((xr(0.9) - 0.03, 0.86, 0.36), (xr(0.9), 1.34, 1.0), RUBBER)
        # jerry can rack
        b.box2((xr(1.8) - 0.20, 0.66, 1.52), (xr(1.8) - 0.0, 1.02, 1.54), DARK)
    mb.mirrored(rear_half)
    jerrycan(mb, tr(xr(1.8) - 0.105, 0.84, 1.54) @ rot("Z", 90))
    jerrycan(mb, tr(xr(1.8) - 0.105, -0.84, 1.54) @ rot("Z", 90))
    # tow hitch + rear tow eyes
    mb.box((xr(0.5) - 0.06, 0, 0.50), (0.14, 0.18, 0.12), DARK)
    mb.cyl((xr(0.5) - 0.16, 0, 0.44), (xr(0.5) - 0.16, 0, 0.56), 0.03, n=8, mat=DARK)
    for s in (1, -1):
        lifting_eye(mb, (xr(0.6), 0.55 * s, 0.6), (-1, 0, 0), (0, 0, 1), r=0.05, mat=DARK)
    # registration plate
    mb.slab([rp(-0.93, 1.62), rp(-0.70, 1.62), rp(-0.70, 1.74), rp(-0.93, 1.74)][::-1], 0.006, WHITE)

    # --- hood ---------------------------------------------------------------
    hood = roof_quad(4)
    n = quad_normal(hood)
    mb.slab(sub_quad(hood, 0.06, 0.90, 0.16, 0.84), 0.03, CAMO)
    for u in (0.2, 0.75):
        for v in (0.16, 0.84):
            p = on(hood, u, v, 0.03)
            mb.box((0, 0, 0), (0.12, 0.035, 0.03), CAMO, M=frame(p, V(hood[1]) - V(hood[0]), n))
    ux = (V(hood[1]) - V(hood[0])).normalized()
    balkenkreuz(mb, on(hood, 0.48, 0.5, 0.03), n.cross(ux) * -1, ux * -1, 0.62)
    grab_rail(mb, on(hood, 0.3, 0.92), on(hood, 0.7, 0.92), n)
    grab_rail(mb, on(hood, 0.3, 0.08), on(hood, 0.7, 0.08), n)
    # scuttle plate between hood and windscreen: wiper motor boxes + vents
    scut = roof_quad(3)
    for v in (0.3, 0.7):
        mb.box((0, 0, 0.02), (0.14, 0.22, 0.05), CAMO, M=frame(on(scut, 0.5, v), V(scut[1]) - V(scut[0]), quad_normal(scut)))

    def hood_side(b):
        q = side_quad(4, "upper")
        nn = quad_normal(q)
        # engine louvres
        for i in range(7):
            u = 0.22 + i * 0.075
            b.slab(sub_quad(q, u, u + 0.05, 0.2, 0.72), 0.02, DARK)
        b.slab(sub_quad(q, 0.19, 0.775, 0.14, 0.78), 0.008, CAMO)
        applique(b, side_quad(4, "lower"), 0.08, 0.80, 0.15, 0.9, bolts=(4, 2))
    mb.mirrored(hood_side)

    # --- nose, bumper, bull bar, winch ---------------------------------------
    mb.prism([(3.20, 0.60), (3.50, 0.60), (3.50, 0.80), (3.44, 0.90), (3.20, 0.90)], -1.10, 1.10, "y", CAMO)

    def bumper_end(b):
        # swept-back bumper ends
        b.add([(3.20, 1.10, 0.60), (3.50, 1.10, 0.60), (3.36, 1.46, 0.64), (3.14, 1.46, 0.64),
               (3.20, 1.10, 0.90), (3.44, 1.10, 0.90), (3.32, 1.46, 0.86), (3.14, 1.46, 0.86)],
              [(0, 1, 2, 3), (7, 6, 5, 4), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0), (0, 4, 5, 1)], CAMO)
        # bull bar: outer hoop + upright
        b.tube([(3.46, 0.92, 0.88), (3.50, 0.92, 1.16), (3.48, 0.80, 1.24), (3.48, 0.0, 1.24)], 0.035, n=8, mat=CAMO, caps=False)
        b.tube([(3.47, 0.40, 0.88), (3.49, 0.40, 1.24)], 0.028, n=8, mat=CAMO, caps=False)
        b.tube([(3.30, 1.44, 0.86), (3.34, 1.42, 1.08), (3.42, 1.10, 1.14), (3.49, 0.92, 1.10)], 0.028, n=8, mat=CAMO, caps=False)
        # tow shackle
        b.box((3.52, 0.62, 0.72), (0.05, 0.05, 0.14), DARK)
        b.tube([(3.54, 0.62, 0.76), (3.60, 0.62, 0.74), (3.62, 0.62, 0.66), (3.58, 0.62, 0.60), (3.54, 0.62, 0.64)],
               0.016, n=6, mat=DARK)
        # headlight cluster on the bumper top
        b.box((3.36, 1.02, 0.97), (0.14, 0.34, 0.15), CAMO)
        b.cyl((3.42, 1.10, 0.97), (3.445, 1.10, 0.97), 0.058, n=12, mat=LAMP, cap_mat=LAMP)
        b.cyl((3.42, 0.95, 0.97), (3.44, 0.95, 0.97), 0.040, n=10, mat=LAMP, cap_mat=LAMP)
        b.tube([(3.44, 1.20, 0.90), (3.47, 1.20, 1.05), (3.47, 0.86, 1.05), (3.44, 0.86, 0.90)], 0.010, n=5, mat=DARK)
        # skid plate / lower glacis
        b.quad((3.22, 0.0, 0.60), (2.92, 0.0, 0.50), (2.92, 0.66, 0.60), (3.22, 0.70, 0.62), CAMO)
    mb.mirrored(bumper_end)
    # winch
    mb.box((3.52, 0, 0.74), (0.10, 0.62, 0.22), DARK)
    mb.cyl((3.55, -0.22, 0.75), (3.55, 0.22, 0.75), 0.075, n=12, mat=DARK)
    for y in (-0.23, 0.23):
        mb.cyl((3.55, y - 0.012, 0.75), (3.55, y + 0.012, 0.75), 0.10, n=12, mat=DARK)
    mb.tube([(3.62, 0.02, 0.75), (3.66, 0.02, 0.66), (3.66, 0.02, 0.58), (3.69, 0.02, 0.54), (3.66, 0.02, 0.50)], 0.014, n=5, mat=DARK)
    mb.box((3.36, 0, 0.99), (0.10, 0.30, 0.12), CAMO)          # sensor / camera housing
    mb.cyl((3.41, 0.07, 0.99), (3.425, 0.07, 0.99), 0.035, n=10, mat=OPTIC, cap_mat=OPTIC)
    mb.cyl((3.41, -0.07, 0.99), (3.425, -0.07, 0.99), 0.035, n=10, mat=OPTIC, cap_mat=OPTIC)

    # --- front fenders ------------------------------------------------------
    def fender(b):
        # three convex plates: rear drop, top, front drop (+ outer lip)
        b.prism([(1.48, 0.72), (1.60, 1.27), (1.64, 1.21), (1.54, 0.72)], 0.90, 1.47, "y", CAMO)
        b.prism([(1.60, 1.27), (2.86, 1.27), (2.84, 1.21), (1.64, 1.21)], 0.90, 1.47, "y", CAMO)
        b.prism([(2.86, 1.27), (3.22, 0.94), (3.22, 0.88), (2.84, 1.21)], 0.90, 1.47, "y", CAMO)
        b.prism([(1.60, 1.27), (2.86, 1.27), (2.84, 1.15), (1.62, 1.15)], 1.47, 1.50, "y", CAMO)
        b.prism([(2.86, 1.27), (3.22, 0.94), (3.22, 0.84), (2.84, 1.15)], 1.47, 1.50, "y", CAMO)
        for x in (1.9, 2.25, 2.6):
            b.bolt((x, 1.42, 1.27), (0, 0, 1), r=0.016, mat=CAMO)
        b.box2((1.47, 0.92, 0.42), (1.50, 1.48, 0.74), RUBBER)       # mud flap
        # indicator / blackout light on the fender top
        b.box((2.80, 1.38, 1.30), (0.10, 0.08, 0.06), DARK)
        b.cyl((2.85, 1.38, 1.30), (2.86, 1.38, 1.30), 0.022, n=8, mat=LAMP, cap_mat=LAMP)
        # width marker pole
        b.cyl((3.10, 1.44, 0.98), (3.10, 1.44, 1.42), 0.008, n=5, mat=DARK)
        b.cyl((3.10, 1.44, 1.42), (3.10, 1.44, 1.46), 0.02, n=6, mat=WHITE)
        # mirror
        b.tube([(1.42, 1.40, 1.50), (1.50, 1.56, 1.62), (1.52, 1.60, 1.86)], 0.012, n=6, mat=DARK)
        b.box((1.52, 1.62, 1.84), (0.035, 0.14, 0.26), DARK)
        b.box((1.50, 1.62, 1.84), (0.004, 0.115, 0.22), GLASS)
        # step
        b.box((1.30, 1.40, 0.62), (0.26, 0.12, 0.03), DARK)
        b.tube([(1.20, 1.38, 0.62), (1.20, 1.34, 0.95)], 0.012, n=5, mat=DARK)
        b.tube([(1.40, 1.38, 0.62), (1.40, 1.34, 0.95)], 0.012, n=5, mat=DARK)
    mb.mirrored(fender)

    # --- cab: windscreen visors, side doors with windows ---------------------
    ws = roof_quad(2)
    for (v0, v1) in ((0.06, 0.47), (0.53, 0.94)):
        vision_block(mb, ws, 0.22, 0.86, v0, v1, depth=0.06, hood=0.07)
    mb.slab(sub_quad(ws, 0.02, 0.16, 0.05, 0.95), 0.03, CAMO)

    def cab_side(b):
        q = side_quad(1, "upper")           # big upper plate, u: front -> rear on the left
        nn = quad_normal(q)
        # crew door (front of the plate) with window
        applique(b, q, 0.015, 0.25, 0.04, 0.93, t=0.03, bolts=(2, 4))
        vision_block(b, q, 0.05, 0.19, 0.50, 0.84, depth=0.07, hood=0.05)
        b.box((0, 0, 0.025), (0.14, 0.03, 0.035), DARK, M=frame(on(q, 0.215, 0.36, 0.03), V(q[1]) - V(q[0]), nn))
        for v in (0.15, 0.8):
            b.cyl(on(q, 0.012, v - 0.05, 0.03), on(q, 0.012, v + 0.05, 0.03), 0.018, n=6, mat=CAMO)
        # two armour panels over the troop compartment
        applique(b, q, 0.275, 0.62, 0.05, 0.92, bolts=(4, 3), chamfer=0.03)
        applique(b, q, 0.64, 0.985, 0.05, 0.92, bolts=(4, 3), chamfer=0.03)
        # firing port / vision slit in the first troop panel
        vision_block(b, q, 0.40, 0.50, 0.58, 0.78, depth=0.05, hood=0.03)
        # grab rails
        grab_rail(b, on(q, 0.30, 0.955), on(q, 0.60, 0.955), nn, stand=0.05)
        grab_rail(b, on(q, 0.66, 0.955), on(q, 0.96, 0.955), nn, stand=0.05)
        # lower (undercut) plate panels
        ql = side_quad(1, "lower")
        for k in range(4):
            applique(b, ql, 0.02 + k * 0.245, 0.245 + k * 0.245, 0.12, 0.94, t=0.018, bolts=(3, 2))
        # chine rub rail
        b.tube([V(ST[2]["b"]) + V((0, 0.012, 0)), V(ST[1]["b"]) + V((0, 0.012, 0))], 0.018, n=6, mat=CAMO)
        # rear quarter plate
        qr = side_quad(0, "upper")
        applique(b, qr, 0.08, 0.9, 0.08, 0.9, bolts=(3, 3))
        for q in (side_quad(2, "upper"), side_quad(2, "lower"), side_quad(0, "lower"), side_quad(3, "lower")):
            for (u, v) in ((0.15, 0.15), (0.85, 0.15), (0.85, 0.85), (0.15, 0.85)):
                b.bolt(bilerp(q, u, v), quad_normal(q), r=0.016, mat=CAMO)
    mb.mirrored(cab_side)

    # --- side markings --------------------------------------------------------
    for left in (True, False):
        q = side_quad(1, "upper", left)
        ux, uy = decal_axes(q)
        f = (lambda t: t) if left else (lambda t: 1 - t)       # t = fraction back from the cab
        balkenkreuz(mb, on(q, f(0.45), 0.33, 0.024), ux, uy, 0.34)
        text(mb, "334", on(q, f(0.81), 0.50, 0.024), ux, uy, 0.42, NUM, outline=WHITE)
        text(mb, "Panzer vor!", on(q, f(0.135), 0.22, 0.032), ux, uy, 0.085, WHITE, shear=0.35)

    # --- pioneer tools (left), exhaust (right) --------------------------------
    ql = side_quad(1, "lower", True)
    nl = quad_normal(ql)
    a, b_ = on(ql, 0.30, 0.55, 0.05), on(ql, 0.62, 0.55, 0.05)
    mb.cyl(a, b_, 0.016, n=6, mat=WOOD)                                   # shovel
    mb.box((0, 0, 0), (0.24, 0.17, 0.012), DARK, M=frame(b_ + (b_ - a).normalized() * 0.12, b_ - a, nl))
    a, b_ = on(ql, 0.28, 0.30, 0.05), on(ql, 0.56, 0.30, 0.05)
    mb.cyl(a, b_, 0.016, n=6, mat=WOOD)                                   # axe
    mb.box((0, 0.04, 0), (0.07, 0.16, 0.02), DARK, M=frame(b_, b_ - a, nl))
    for u in (0.34, 0.5):
        mb.box((0, 0, 0), (0.03, 0.34, 0.06), DARK, M=frame(on(ql, u, 0.43, 0.03), V(ql[1]) - V(ql[0]), nl))
    # exhaust: muffler under the right cab side, shielded pipe up the cab corner
    mb.cyl((0.30, -1.30, 1.12), (1.20, -1.30, 1.12), 0.095, n=12, mat=DARK)
    mb.tube([(1.20, -1.30, 1.12), (1.36, -1.30, 1.12), (1.44, -1.24, 1.2), (1.50, -1.16, 1.34)], 0.04, n=8, mat=DARK)
    mb.tube([(0.30, -1.30, 1.12), (0.16, -1.36, 1.10), (0.06, -1.44, 1.04)], 0.035, n=8, mat=DARK)
    for x in (0.45, 1.05):
        mb.cyl((x - 0.015, -1.30, 1.12), (x + 0.015, -1.30, 1.12), 0.105, n=12, mat=DARK)
    mb.prism([(0.25, 1.26), (1.25, 1.26), (1.25, 1.22), (0.25, 1.22)], -1.43, -1.20, "y", DARK)

    # --- roof -----------------------------------------------------------------
    rq = roof_quad(1)
    # periscopes around the front hatches
    for y in (-0.52, 0.52):
        for dx, dy, ang in ((0.36, 0.0, 0), (0.26, 0.26, 40), (0.26, -0.26, -40)):
            mb.box((0, 0, 0.035), (0.07, 0.16, 0.07), CAMO, M=tr(0.42 + dx, y + dy, 2.30) @ rot("Z", ang))
            mb.box((0.036, 0, 0.04), (0.004, 0.12, 0.035), GLASS, M=tr(0.42 + dx, y + dy, 2.30) @ rot("Z", ang))
        # hatch coaming
        ring = [(0.42 + 0.30 * math.cos(math.radians(22.5 + 45 * k)), y + 0.30 * math.sin(math.radians(22.5 + 45 * k)))
                for k in range(8)]
        mb.prism(ring, 2.30, 2.325, "z", CAMO)
    # troop compartment roof hatches (fixed) behind the turret
    for y in (-0.5, 0.5):
        mb.slab([(-3.02, y - 0.30, 2.20), (-2.22, y - 0.34, 2.30), (-2.22, y + 0.34, 2.30), (-3.02, y + 0.30, 2.20)],
                0.03, CAMO)
        q0 = roof_quad(0)
        nn = quad_normal(q0)
        grab_rail(mb, (-2.5, y - 0.12, 2.29), (-2.5, y + 0.12, 2.29), nn, stand=0.05)
        for x in (-2.95, -2.35):
            mb.cyl((x, y + 0.36 * (1 if y > 0 else -1), 2.22 + (x + 3.02) * 0.125),
                   (x + 0.12, y + 0.36 * (1 if y > 0 else -1), 2.235 + (x + 3.02) * 0.125), 0.02, n=6, mat=CAMO)
    # turret ring guard
    mb.lathe([(0.0, 0.84), (0.0, 0.92), (0.05, 0.90), (0.05, 0.84)], n=32, mat=CAMO,
             M=tr(TURRET_POS) @ rot("Y", -90), flat=[True, False, True])
    # sensor mast (front right) with day/thermal camera head
    mb.cyl((0.86, -0.72, 2.30), (0.86, -0.72, 2.40), 0.035, n=8, mat=CAMO)
    mb.box((0.88, -0.72, 2.475), (0.20, 0.18, 0.15), CAMO)
    mb.cyl((0.98, -0.76, 2.49), (0.992, -0.76, 2.49), 0.045, n=10, mat=OPTIC, cap_mat=OPTIC)
    mb.cyl((0.98, -0.67, 2.46), (0.992, -0.67, 2.46), 0.025, n=8, mat=OPTIC, cap_mat=OPTIC)
    mb.box((0.90, -0.72, 2.556), (0.26, 0.20, 0.012), CAMO)
    # roof-edge stowage: rolled tarp (left), camo net bundle (right)
    canvas_roll(mb, (-0.15, 1.02, 2.40), (-2.1, 1.02, 2.40), r=0.12, seed=3)
    canvas_roll(mb, (-1.7, -1.0, 2.39), (-2.4, -1.0, 2.39), r=0.11, seg=4, seed=5)
    # antennas: tied-down whip arching from the right front fender, two on the rear roof
    arc = []
    for k in range(17):
        t = k / 16
        arc.append((1.86 - 3.0 * t, -1.36 + 0.42 * t, 1.30 + 1.05 * t + 2.3 * math.sin(math.pi * t) * (1 - 0.35 * t)))
    mb.cyl((1.86, -1.36, 1.27), (1.86, -1.36, 1.36), 0.03, n=8, mat=DARK)
    mb.tube(arc, 0.008, n=4, mat=DARK)
    antenna(mb, (-3.0, 0.72, 2.20), 1.9, lean=(-0.12, 0, 0))
    antenna(mb, (-3.0, -0.72, 2.20), 1.5, lean=(-0.10, 0, 0))
    # "weapon pods": countermeasure / stowage wedges on the rear quarters
    def pod(b):
        prof = [(-3.18, 1.62), (-2.30, 1.62), (-2.30, 2.02), (-2.52, 2.16), (-3.12, 2.16)]
        qq = side_quad(0, "upper")
        # extrude outward from the plate by building it straight in world space
        b.prism(prof, 1.02, 1.36, "y", CAMO)
        for i in range(3):
            for j in range(2):
                p = V((-2.28, 1.10 + 0.09 * i, 1.74 + 0.13 * j))
                b.cyl(p, p + V((0.10, 0, 0.03)), 0.036, n=8, mat=DARK, caps=(True, True), cap_mat=BLACK)
        b.box((-2.74, 1.365, 1.88), (0.5, 0.012, 0.3), CAMO)
        for x in (-3.0, -2.5):
            b.bolt((x, 1.37, 2.0), (0, 1, 0), mat=CAMO)
            b.bolt((x, 1.37, 1.76), (0, 1, 0), mat=CAMO)
    mb.mirrored(pod)

    # --- under-body: axle, diff, shafts, suspension arms ----------------------
    mb.cyl((FRONT_AXLE_X, -1.0, 0.60), (FRONT_AXLE_X, 1.0, 0.60), 0.065, n=10, mat=DARK)
    mb.lathe([(-0.18, 0.0), (-0.18, 0.12), (-0.08, 0.2), (0.08, 0.2), (0.18, 0.12), (0.18, 0.0)], n=12, mat=DARK,
             M=tr(FRONT_AXLE_X, 0.12, 0.60) @ rot("Z", 90))
    mb.cyl((FRONT_AXLE_X - 0.2, 0.12, 0.60), (0.9, 0.0, 0.58), 0.04, n=8, mat=DARK)
    mb.cyl((FRONT_AXLE_X - 0.28, -0.98, 0.52), (FRONT_AXLE_X - 0.28, 0.98, 0.52), 0.02, n=6, mat=DARK)   # tie rod

    def under(b):
        b.cyl((FRONT_AXLE_X + 0.05, 0.78, 0.62), (FRONT_AXLE_X + 0.02, 0.74, 1.05), 0.045, n=8, mat=DARK)   # damper
        b.tube([(FRONT_AXLE_X - 0.55, 0.72, 0.72), (FRONT_AXLE_X, 0.74, 0.52), (FRONT_AXLE_X + 0.55, 0.72, 0.74)], 0.03, n=6, mat=DARK)
        for x in ROAD_X:
            # trailing arm from hull pivot to the road wheel hub
            p0, p1 = V((x + 0.34, 0.86, 0.60)), V((x, 0.90, ROAD_Z))
            b.box((0, 0, 0), ((p1 - p0).length + 0.1, 0.07, 0.09), DARK, M=frame((p0 + p1) / 2, p1 - p0, (0, 1, 0)))
            b.cyl((x + 0.34, 0.78, 0.60), (x + 0.34, 0.93, 0.60), 0.06, n=8, mat=DARK)
            b.cyl((x, 0.86, ROAD_Z), (x, TRACK_Y + 0.02, ROAD_Z), 0.035, n=8, mat=DARK)
        for x in (ROAD_X[0], ROAD_X[-1]):
            b.cyl((x + 0.05, 0.92, ROAD_Z + 0.06), (x + 0.36, 0.90, 0.92), 0.032, n=6, mat=DARK)
        b.cyl((SPROCKET[0], 0.70, SPROCKET[1]), (SPROCKET[0], TRACK_Y, SPROCKET[1]), 0.07, n=10, mat=DARK)
        b.lathe([(0.0, 0.0), (0.0, 0.2), (0.12, 0.2), (0.18, 0.12), (0.18, 0.0)], n=12, mat=DARK,
                M=tr(SPROCKET[0], 0.74, SPROCKET[1]) @ rot("Z", 90))
        b.cyl((IDLER[0], 0.72, IDLER[1]), (IDLER[0], TRACK_Y, IDLER[1]), 0.045, n=8, mat=DARK)
        b.box((IDLER[0] + 0.25, 0.86, IDLER[1] + 0.02), (0.6, 0.06, 0.08), DARK)
        for x in ROLLERS_X:
            b.cyl((x, 0.80, 0.80), (x, TRACK_Y, 0.80), 0.03, n=6, mat=DARK)
    mb.mirrored(under)

    # --- interior ------------------------------------------------------------
    def iring(x):
        h = [(0.80, 0.62), (0.82, 1.08), (1.30, 1.50), (1.02, 2.22)]
        pts = [(x, y, z) for y, z in h] + [(x, -y, z) for y, z in reversed(h)]
        return pts
    x0, x1 = xr(1.3) + 0.07, 0.90
    r0, r1 = iring(x0), iring(x1)
    r0[0] = (xr(0.62) + 0.07, r0[0][1], r0[0][2]); r0[-1] = (xr(0.62) + 0.07, r0[-1][1], r0[-1][2])
    r0[3] = (xr(2.2) + 0.07, r0[3][1], r0[3][2]); r0[4] = (xr(2.2) + 0.07, r0[4][1], r0[4][2])
    mb.loft([r1, r0], INTERIOR, caps=(True, False))     # reversed order -> faces point inwards

    def bench(b):
        b.box2((-3.05, 0.44, 0.98), (-0.25, 0.84, 1.06), INTERIOR)
        b.box2((-3.05, 0.78, 0.62), (-0.25, 0.82, 0.98), INTERIOR)
        for k in range(4):
            xa = -2.98 + k * 0.68
            b.box2((xa, 0.46, 1.06), (xa + 0.60, 0.84, 1.12), CANVAS, taper=(0.94, 0.94))
            b.box((0, 0, 0), (0.56, 0.07, 0.52), CANVAS, M=frame((xa + 0.30, 1.03, 1.36), (1, 0, 0), (0, -0.66, 0.75)))
        # driver / commander seats
        b.box2((0.35, 0.28, 1.0), (0.80, 0.74, 1.08), CANVAS, taper=(0.94, 0.94))
        b.box2((0.28, 0.30, 1.08), (0.36, 0.72, 1.70), CANVAS)
        b.box2((0.35, 0.40, 0.62), (0.75, 0.62, 1.0), INTERIOR)
    mb.mirrored(bench)
    mb.box2((-0.2, -0.80, 0.62), (-0.14, 0.80, 0.95), INTERIOR)     # step bulkhead
    # steering wheel (left hand drive) + dash
    mb.box2((0.80, -0.9, 1.30), (0.90, 0.9, 1.62), INTERIOR)
    mb.tube([(0.76 + 0.0, 0.50 + 0.17 * math.cos(a), 1.42 + 0.17 * math.sin(a)) for a in
             [2 * math.pi * k / 12 for k in range(12)]], 0.014, n=5, mat=BLACK, closed=True)
    mb.cyl((0.76, 0.50, 1.42), (0.82, 0.50, 1.46), 0.02, n=6, mat=BLACK)
    return mb


# ---------------------------------------------------------------------------
# hatches and ramp
# ---------------------------------------------------------------------------
def build_hatch(y):
    """Octagonal crew hatch, pivot on its rear hinge. Returns (builder, pivot)."""
    mb = MeshBuilder()
    cx = 0.42
    ring = [(cx + 0.27 * math.cos(math.radians(22.5 + 45 * k)), y + 0.27 * math.sin(math.radians(22.5 + 45 * k)))
            for k in range(8)]
    mb.prism(ring, 2.325, 2.36, "z", CAMO)
    ring2 = [(cx + 0.17 * math.cos(math.radians(22.5 + 45 * k)), y + 0.17 * math.sin(math.radians(22.5 + 45 * k)))
             for k in range(8)]
    mb.prism(ring2, 2.36, 2.385, "z", CAMO)
    for s in (-0.12, 0.12):
        mb.cyl((cx - 0.27, y + s - 0.04, 2.35), (cx - 0.27, y + s + 0.04, 2.35), 0.022, n=6, mat=CAMO)
    grab_rail(mb, (cx + 0.14, y - 0.08, 2.385), (cx + 0.14, y + 0.08, 2.385), (0, 0, 1), stand=0.04)
    mb.prism(ring2, 2.30, 2.325, "z", INTERIOR)       # padded inner face
    return mb, V((cx - 0.27, y, 2.35))


def build_ramp():
    mb = MeshBuilder()
    W, Z0, Z1 = 0.60, 0.68, 1.98
    T = 0.075

    def rp(y, z, d=0.0):
        return V((xr(z) + d, y, z))
    outer = [rp(-W, Z0), rp(W, Z0), rp(W, Z1), rp(-W, Z1)]          # CCW seen from behind? check below
    nrm = (outer[1] - outer[0]).cross(outer[3] - outer[0]).normalized()
    if nrm.x > 0:
        outer = outer[::-1]
    mb.slab(outer, T, INTERIOR, side_mat=CAMO, offset=-T)             # body of the door (inner face = interior)
    mb.poly(outer, CAMO)
    q = [rp(W, Z0), rp(-W, Z0), rp(-W, Z1), rp(W, Z1)]                # seen from behind: u left->right
    n = quad_normal(q)
    applique(mb, q, 0.05, 0.95, 0.42, 0.95, bolts=(4, 3), chamfer=0.03)
    applique(mb, q, 0.05, 0.95, 0.04, 0.38, bolts=(4, 2), chamfer=0.03)
    # emergency door outline + handle, vision block
    mb.slab(sub_quad(q, 0.30, 0.70, 0.46, 0.92), 0.012, CAMO, offset=0.022)
    vision_block(mb, q, 0.40, 0.60, 0.72, 0.86, depth=0.05, hood=0.03)
    mb.box((0, 0, 0.02), (0.035, 0.16, 0.035), DARK, M=frame(on(q, 0.66, 0.60, 0.034), V(q[1]) - V(q[0]), n))
    # hinges at the bottom
    for y in (-0.42, 0.0, 0.42):
        mb.cyl(rp(y - 0.09, Z0 - 0.01, -0.01), rp(y + 0.09, Z0 - 0.01, -0.01), 0.032, n=8, mat=CAMO)
    # tow cable stowed on the lower panel
    pts = [on(q, 0.12 + 0.76 * k / 10, 0.12 + 0.2 * math.sin(math.pi * k / 10) ** 0.5, 0.035) for k in range(11)]
    mb.tube(pts, 0.012, n=5, mat=DARK)
    # Balkenkreuz on the upper panel right
    ux, uy = decal_axes(q)
    balkenkreuz(mb, on(q, 0.82, 0.68, 0.024), ux, uy, 0.22)
    # inner face: tread strips
    for k in range(7):
        z = Z0 + 0.12 + k * 0.17
        mb.box2(rp(-W + 0.06, z, T), rp(W - 0.06, z + 0.03, T + 0.012), INTERIOR)
    return mb, V((xr(Z0), 0, Z0))


# ---------------------------------------------------------------------------
# running gear
# ---------------------------------------------------------------------------
def build_front_wheel():
    """Wheel centred on the origin, axle along Y, outer face towards +Y."""
    mb = MeshBuilder()
    R, W = FRONT_R, FRONT_W
    h = W / 2
    # tyre carcass (axial, radius), outward normals: trace -h -> +h over the top
    prof = [(-h * 0.80, R * 0.62), (-h * 0.98, R * 0.74), (-h, R * 0.90), (-h * 0.86, R * 0.965),
            (h * 0.86, R * 0.965), (h, R * 0.90), (h * 0.98, R * 0.74), (h * 0.80, R * 0.62)]
    M = rot("Z", 90)
    mb.lathe(prof, n=32, mat=RUBBER, M=M)
    # tread blocks: chevron pairs
    nb = 22
    for k in range(nb):
        a = 360.0 * k / nb
        for side, off in ((1, 0.0), (-1, 180.0 / nb)):
            Mb = rot("Y", a + off) @ tr(0, side * h * 0.47, R * 0.955) @ rot("Z", side * 18)
            mb.box((0, 0, 0.02), (0.085, h * 0.86, 0.045), RUBBER, M=Mb, taper=(0.8, 0.94))
    # rim
    rim = [(-h * 0.80, R * 0.62), (-h * 0.70, R * 0.60), (-h * 0.20, R * 0.56), (h * 0.40, R * 0.56),
           (h * 0.70, R * 0.60), (h * 0.80, R * 0.62)]
    mb.lathe(list(reversed(rim)), n=24, mat=CAMO, M=M)        # inner barrel faces the axle
    disc = [(h * 0.80, R * 0.62), (h * 0.74, R * 0.56), (h * 0.36, R * 0.50), (h * 0.30, R * 0.30),
            (h * 0.52, R * 0.22), (h * 0.60, R * 0.12), (h * 0.60, 0.0)]
    mb.lathe(list(reversed(disc)), n=24, mat=CAMO, M=M)
    back = [(-h * 0.80, R * 0.62), (-h * 0.5, R * 0.5), (-h * 0.5, 0.0)]
    mb.lathe(back, n=16, mat=DARK, M=M)
    # beadlock bolts, wheel nuts, CTIS hub
    for k in range(16):
        a = math.radians(360 * k / 16)
        mb.bolt((R * 0.59 * math.cos(a), h * 0.76, R * 0.59 * math.sin(a)), (0, 1, 0), r=0.014, h=0.012, mat=CAMO)
    for k in range(8):
        a = math.radians(360 * k / 8 + 22.5)
        mb.bolt((R * 0.26 * math.cos(a), h * 0.45, R * 0.26 * math.sin(a)), (0, 1, 0), r=0.02, h=0.025, mat=DARK)
    for k in range(8):   # hand holes
        a = math.radians(360 * k / 8)
        p = V((R * 0.41 * math.cos(a), h * 0.335, R * 0.41 * math.sin(a)))
        mb.cyl(p, p + V((0, 0.006, 0)), 0.034, n=8, mat=BLACK, cap_mat=BLACK)
    mb.cyl((0, h * 0.60, 0), (0, h * 0.72, 0), 0.045, n=8, mat=DARK)
    return mb


def build_road_wheel(R=ROAD_R, W=0.30, spokes=0, teeth=0, holes=6):
    """Double-disc steel road wheel, axle along Y, centred."""
    mb = MeshBuilder()
    M = rot("Z", 90)
    for s in (1, -1):
        y0, y1 = s * 0.035, s * W / 2
        lo, hi = min(y0, y1), max(y0, y1)
        tyre = teeth == 0
        r_t = R if tyre else R * 0.86
        prof = [(lo, R * 0.30), (lo, r_t * 0.88), (lo, r_t), (hi, r_t), (hi, r_t * 0.88), (hi, R * 0.30)]
        mats = [DARK, RUBBER if tyre else DARK, RUBBER if tyre else DARK, RUBBER if tyre else DARK, DARK]
        mb.lathe(prof, n=20, mat=DARK, M=M, mats=mats, flat=[True, True, False, True, True])
        # outer dish
        if s == 1:
            dish = [(hi, R * 0.30), (hi + 0.03, R * 0.2), (hi + 0.035, 0.0)]
            mb.lathe(list(reversed(dish)), n=12, mat=DARK, M=M)
            for k in range(6):
                a = math.radians(60 * k)
                mb.bolt((R * 0.24 * math.cos(a), hi + 0.012, R * 0.24 * math.sin(a)), (0, 1, 0), r=0.014, h=0.012, mat=DARK)
            for k in range(holes):
                a = math.radians(360 * k / holes + 30)
                p = V((R * 0.60 * math.cos(a), hi, R * 0.60 * math.sin(a)))
                mb.cyl(p, p + V((0, 0.004, 0)), R * 0.13, n=8, mat=BLACK, cap_mat=BLACK)
        if teeth:
            for k in range(teeth):
                a = 360.0 * k / teeth
                Mt = rot("Y", a) @ tr(0, (lo + hi) / 2, r_t)
                mb.box((0, 0, 0.02), (0.07, (hi - lo), 0.07), DARK, M=Mt, taper=(0.45, 1.0))
    mb.cyl((0, -W / 2, 0), (0, W / 2, 0), R * 0.3, n=10, mat=DARK, caps=(False, False))
    return mb


def track_path():
    """Closed belt around the running gear in the XZ plane (list of (x, z)), CCW seen from +Y...
    returned so that the lower run travels rearwards when the vehicle drives forward."""
    circles = [(x, ROAD_Z, ROAD_R) for x in ROAD_X] + [(IDLER[0], IDLER[1], IDLER[2]), (SPROCKET[0], SPROCKET[1], SPROCKET[2] * 0.9)]
    t = 0.018
    pts = []
    for cx, cz, r in circles:
        for k in range(96):
            a = 2 * math.pi * k / 96
            pts.append((cx + (r + t) * math.cos(a), cz + (r + t) * math.sin(a)))
    pts = sorted(set(pts))

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    hull = lower[:-1] + upper[:-1]       # CCW in (x, z): bottom runs rear -> front
    hull.reverse()                        # top runs rear -> front, bottom front -> rear
    return hull


def resample_closed(path, count):
    pts = [V((p[0], 0, p[1])) for p in path]
    segs = [(pts[i], pts[(i + 1) % len(pts)]) for i in range(len(pts))]
    lens = [(b - a).length for a, b in segs]
    total = sum(lens)
    step = total / count
    out = []
    i, acc = 0, 0.0
    for k in range(count):
        d = k * step
        while acc + lens[i] < d:
            acc += lens[i]
            i += 1
        a, b = segs[i]
        t = (d - acc) / lens[i]
        p = a.lerp(b, t)
        out.append((p, (b - a).normalized()))
    return out, step


def build_track_link(pitch):
    """One link centred on the origin, travel direction +X, outer (ground) side -Z."""
    mb = MeshBuilder()
    W = TRACK_W
    L = pitch * 0.94
    mb.box((0, 0, 0), (L, W, 0.03), TRACK)
    for y in (-W * 0.27, W * 0.27):                                # rubber pads
        mb.box((0, y, -0.026), (L * 0.72, W * 0.36, 0.026), RUBBER, taper=(1, 1))
    mb.box((0, 0, 0.045), (L * 0.36, 0.035, 0.085), TRACK, taper=(0.5, 0.7))     # guide horn
    for y in (-W / 2 + 0.02, W / 2 - 0.02):
        mb.box((0, y, 0.02), (L * 0.5, 0.035, 0.03), TRACK)
    mb.cyl((L / 2, -W / 2, 0), (L / 2, W / 2, 0), 0.014, n=6, mat=TRACK, smooth=False)       # pin
    return mb


def build_track(links, left=True):
    """Whole track as one mesh (what the game wants), plus link frames for showcase animation."""
    mb = MeshBuilder()
    link = build_track_link(links[1])
    y = TRACK_Y if left else -TRACK_Y
    for p, d in links[0]:
        # link local +X = travel direction d, local -Z = outward of the loop
        # loop is traversed top rear->front, so "outward" is to the left of travel in XZ: n = d x Y
        nrm = d.cross(V((0, 1, 0)))      # points out of the belt
        M = Matrix((
            (d.x, 0, -nrm.x, p.x),
            (0, 1, 0, y),
            (d.z, 0, -nrm.z, p.z),
            (0, 0, 0, 1)))
        mb.merge(link, M)
    return mb


# ---------------------------------------------------------------------------
# turret
# ---------------------------------------------------------------------------
def build_turret():
    """Unmanned Puma-style turret. Built in turret-local coordinates (origin on the ring)."""
    mb = MeshBuilder()
    mb.cyl((0, 0, -0.01), (0, 0, 0.08), 0.80, n=32, mat=CAMO)
    base = [(1.02, -0.42), (1.02, 0.42), (0.62, 0.80), (-0.70, 0.80), (-1.04, 0.50), (-1.04, -0.50), (-0.70, -0.80), (0.62, -0.80)]
    top = [(0.30, -0.36), (0.30, 0.36), (0.14, 0.60), (-0.62, 0.60), (-0.88, 0.40), (-0.88, -0.40), (-0.62, -0.60), (0.14, -0.60)]
    Z0, Z1 = 0.08, 0.60
    r0 = [(x, y, Z0) for x, y in base]
    r1 = [(x, y, Z1) for x, y in top]
    mb.loft([r0, r1], CAMO, caps=(True, True))
    mb.add(r0, [tuple(range(8))], CAMO)     # underside overhang
    # facet quads (outward): index i between ring points i and i+1
    def fq(i):
        i2 = (i + 1) % 8
        return [r0[i], r0[i2], r1[i2], r1[i]]
    glacis, left, right, rear = fq(0), fq(2), fq(6), fq(4)
    # gun housing: wedge box sitting in the glacis, right of centre
    gy = GUN_REL.y
    prof = [(0.34, 0.20), (1.00, 0.16), (1.00, 0.44), (0.86, 0.56), (0.30, 0.62)]
    for (ya, yb) in ((gy - 0.30, gy - 0.13), (gy + 0.13, gy + 0.30)):
        mb.prism(prof, ya, yb, "y", CAMO)
    mb.box2((0.30, gy - 0.13, 0.56), (0.80, gy + 0.13, 0.63), CAMO)
    mb.box2((0.34, gy - 0.13, 0.12), (0.96, gy + 0.13, 0.20), CAMO)
    for ys in (gy - 0.305, gy + 0.305):
        for (x, z) in ((0.46, 0.30), (0.86, 0.26), (0.86, 0.46), (0.46, 0.52)):
            mb.bolt((x, ys, z), (0, 1 if ys > gy else -1, 0), r=0.016, mat=CAMO)
    # coaxial MG port
    mb.cyl((0.96, gy + 0.215, 0.34), (1.16, gy + 0.215, 0.34), 0.022, n=8, mat=DARK)
    mb.cyl((1.00, gy + 0.215, 0.34), (1.06, gy + 0.215, 0.34), 0.035, n=8, mat=DARK)
    # gunner's sight: armoured box front-left on the glacis with two windows and doors
    mb.prism([(0.20, 0.58), (0.60, 0.42), (0.66, 0.50), (0.66, 0.74), (0.20, 0.80)], 0.26, 0.56, "y", CAMO)
    mb.box((0.662, 0.34, 0.63), (0.008, 0.11, 0.15), OPTIC)
    mb.box((0.662, 0.48, 0.63), (0.008, 0.11, 0.15), OPTIC)
    mb.box((0.69, 0.41, 0.76), (0.10, 0.32, 0.012), CAMO)
    # side armour modules + numbers
    for q, sgn in ((left, 1), (right, -1)):
        n = quad_normal(q)
        applique(mb, q, 0.04, 0.50, 0.08, 0.92, t=0.03, bolts=(3, 2), chamfer=0.03)
        applique(mb, q, 0.52, 0.96, 0.08, 0.92, t=0.03, bolts=(3, 2), chamfer=0.03)
        ux, uy = decal_axes(q)
        text(mb, "334", on(q, 0.50, 0.50, 0.034), ux, uy, 0.30, NUM, outline=WHITE)
        lifting_eye(mb, on(q, 0.12, 1.0), (0, 0, 1), (1, 0, 0))
        lifting_eye(mb, on(q, 0.88, 1.0), (0, 0, 1), (1, 0, 0))
        # front-corner sensor panel (APS radar) on the angled cheek
        qc = fq(1) if sgn > 0 else fq(7)
        mb.slab(sub_quad(qc, 0.15, 0.85, 0.18, 0.82), 0.04, CAMO)
        mb.slab(sub_quad(qc, 0.22, 0.78, 0.26, 0.74), 0.006, OPTIC, offset=0.04)
        qr = fq(3) if sgn > 0 else fq(5)
        mb.slab(sub_quad(qr, 0.15, 0.85, 0.18, 0.82), 0.04, CAMO)
        mb.slab(sub_quad(qr, 0.22, 0.78, 0.26, 0.74), 0.006, OPTIC, offset=0.04)
        # smoke grenade launchers: 4 tubes fanned on a bracket at the rear corner
        bx = V((-0.80, 0.66 * sgn, 0.66))
        mb.box(bx, (0.22, 0.20, 0.06), CAMO)
        for k in range(4):
            yaw = sgn * (20 + 22 * (k % 2)) + (180 if False else 0)
            Ml = tr(bx + V((-0.06 + 0.11 * (k // 2), 0.02 * sgn * (k % 2), 0.03))) @ rot("Z", yaw + (0 if True else 0)) @ rot("Y", -38)
            mb.cyl((0, 0, 0), (0.22, 0, 0), 0.042, n=8, mat=CAMO, M=Ml, cap_mat=BLACK)
        # hard-kill countermeasure launcher (twin tube) on the roof edge
        mb.box((-0.20, 0.47 * sgn, 0.66), (0.34, 0.20, 0.12), CAMO)
        for dy in (-0.05, 0.05):
            mb.cyl((-0.04, 0.47 * sgn + dy, 0.67), (0.02, 0.47 * sgn + dy, 0.68), 0.04, n=8, mat=DARK, cap_mat=BLACK)
        mb.box((-0.20, 0.47 * sgn, 0.726), (0.38, 0.24, 0.012), CAMO)
    # roof: service hatch, bolts, drone jammer dome on a mast, antennas
    mb.slab([(-0.55, -0.30, Z1), (-0.05, -0.30, Z1), (-0.05, 0.05, Z1), (-0.55, 0.05, Z1)], 0.022, CAMO)
    grab_rail(mb, (-0.42, -0.2, Z1 + 0.022), (-0.42, -0.05, Z1 + 0.022), (0, 0, 1), stand=0.035)
    mb.cyl((-0.70, 0.0, Z1), (-0.70, 0.0, Z1 + 0.30), 0.03, n=8, mat=CAMO)
    mb.lathe([(0.0, 0.0), (0.0, 0.11), (0.05, 0.11), (0.10, 0.08), (0.13, 0.0)], n=12, mat=CAMO,
             M=tr(-0.70, 0.0, Z1 + 0.30) @ rot("Y", -90))
    for k, (y, hgt) in enumerate(((0.30, 1.7), (-0.30, 1.3), (0.0, 2.0))):
        antenna(mb, (-0.84 + (0.02 if y else -0.0), y * 1.05, Z1), hgt, lean=(-0.15 - 0.05 * k, 0, 0))
    # rear bustle basket with stowage
    bz0, bz1 = 0.16, 0.50
    xa, xb = -1.04, -1.42
    for z in (bz0, bz1):
        mb.tube([(xa + 0.02, 0.48, z), (xb, 0.46, z), (xb, -0.46, z), (xa + 0.02, -0.48, z)], 0.014, n=5, mat=CAMO)
    for y in (-0.46, -0.15, 0.15, 0.46):
        mb.tube([(xb, y, bz0), (xb, y, bz1)], 0.010, n=5, mat=CAMO)
    mb.box2((xb, -0.46, bz0 - 0.01), (xa, 0.46, bz0), DARK)
    pack(mb, (-1.24, 0.24, 0.31), (0.30, 0.36, 0.28))
    pack(mb, (-1.23, -0.20, 0.29), (0.28, 0.40, 0.24), seed=2)
    canvas_roll(mb, (-1.25, -0.44, 0.56), (-1.25, 0.44, 0.56), r=0.085, seg=5, seed=9)
    # rear plate: access door, tool clips
    applique(mb, rear, 0.12, 0.88, 0.1, 0.9, t=0.02, bolts=(3, 3))
    return mb


def build_gun():
    """Elevating mass, local origin on the trunnion axis. Barrel is a separate recoiling part."""
    mb = MeshBuilder()
    mb.cyl((0, -0.125, 0), (0, 0.125, 0), 0.15, n=16, mat=CAMO)             # rotor / mantlet drum
    mb.prism([(0.0, -0.13), (0.50, -0.10), (0.62, -0.06), (0.62, 0.06), (0.50, 0.10), (0.0, 0.13)], -0.115, 0.115, "y", CAMO)
    mb.cyl((0.62, 0, 0), (0.70, 0, 0), 0.085, n=12, mat=CAMO)
    # ammunition feed chute + cradle detail
    mb.box((0.22, 0.0, 0.125), (0.30, 0.16, 0.05), CAMO)
    for x in (0.12, 0.40):
        for y in (-0.117, 0.117):
            mb.bolt((x, y, 0.0), (0, 1 if y > 0 else -1, 0), r=0.02, mat=CAMO)
    return mb


def build_barrel():
    """30 mm autocannon barrel, origin at the trunnion, pointing +X."""
    mb = MeshBuilder()
    end = MUZZLE_X - GUN_REL.x
    prof = [(0.66, 0.0), (0.66, 0.070), (1.10, 0.070), (1.14, 0.052), (1.50, 0.050), (1.54, 0.040), (end - 0.36, 0.034),
            (end - 0.36, 0.0)]
    mb.lathe(prof, n=12, mat=DARK, M=Matrix.Identity(4), flat=[True, False, True, False, True, False, True])
    # barrel rigidity sleeve clamps
    for x in (1.30, 1.9):
        mb.cyl((x, 0, 0), (x + 0.05, 0, 0), 0.058, n=10, mat=DARK)
    # muzzle brake: slotted cage
    mb.cyl((end - 0.38, 0, 0), (end - 0.32, 0, 0), 0.052, n=10, mat=DARK)
    for k in range(4):
        x = end - 0.30 + k * 0.075
        mb.cyl((x, 0, 0), (x + 0.03, 0, 0), 0.058, n=10, mat=DARK)
    for k in range(4):
        a = math.radians(45 + 90 * k)
        mb.box((end - 0.17, 0.05 * math.cos(a), 0.05 * math.sin(a)), (0.33, 0.022, 0.022), DARK, M=None)
    mb.cyl((end - 0.34, 0, 0), (end, 0, 0), 0.036, n=10, mat=BLACK, caps=(False, True), cap_mat=BLACK)
    # muzzle velocity radar coil
    mb.box((end - 0.48, 0, 0.055), (0.12, 0.05, 0.035), DARK)
    return mb


def build_sight():
    """Commander's independent panoramic sight, origin on its rotation axis at roof level."""
    mb = MeshBuilder()
    mb.cyl((0, 0, 0), (0, 0, 0.06), 0.11, n=12, mat=CAMO)
    mb.cyl((0, 0, 0.06), (0, 0, 0.22), 0.075, n=10, mat=CAMO)
    mb.box((0.0, 0, 0.34), (0.24, 0.26, 0.26), CAMO)
    mb.box((0.122, 0.055, 0.35), (0.008, 0.10, 0.16), OPTIC)
    mb.box((0.122, -0.065, 0.36), (0.008, 0.09, 0.12), OPTIC)
    mb.box((0.02, 0, 0.476), (0.30, 0.30, 0.012), CAMO)
    for y in (-0.135, 0.135):
        mb.box((0.0, y, 0.34), (0.16, 0.012, 0.18), CAMO)
    return mb


# ---------------------------------------------------------------------------
# assembly
# ---------------------------------------------------------------------------
def build(materials):
    """Create all objects. Joint convention (GEM): a revolute bone turns about its local Z,
    a prismatic bone slides along its local Z."""
    from geo import AXIS_X, AXIS_Y
    scn = bpy.context.scene
    col = scn.collection
    parts = {}

    def obj(name, mb, pivot=(0, 0, 0), parent=None, R=None, M=None):
        if M is not None:
            m2 = MeshBuilder()
            m2.merge(mb, M)
            mb = m2
        ob = mb.to_object(name, materials, pivot, col, R)
        if parent is not None:
            set_parent(ob, parent)
        parts[name] = ob
        return ob

    basis = empty("basis", (0, 0, 0), size=0.5)
    parts["basis"] = basis
    body = obj("body", build_hull(), parent=basis)

    # hatches + ramp (hinge axis = local Z)
    for name, y in (("hatch_driver", 0.52), ("hatch_commander", -0.52)):
        mb, pv = build_hatch(y)
        obj(name, mb, pv, body, AXIS_Y)
    mb, pv = build_ramp()
    obj("ramp", mb, pv, body, AXIS_Y)

    # front wheels on steering knuckles
    fw = build_front_wheel()
    for name, s in (("l", 1), ("r", -1)):
        steer = empty("steer" + name, (FRONT_AXLE_X, s * 1.0, FRONT_R), body, size=0.15)
        parts["steer" + name] = steer
        pos = (FRONT_AXLE_X, s * FRONT_TRACK_Y, FRONT_R)
        obj("wheel" + name, fw, pos, steer, AXIS_Y, M=tr(pos) @ Matrix.Diagonal((1, s, 1, 1)))

    # tracked bogie
    rw = build_road_wheel()
    sp = build_road_wheel(R=SPROCKET[2], W=0.30, teeth=13, holes=5)
    idl = build_road_wheel(R=IDLER[2], W=0.30, holes=5)
    rol = MeshBuilder()
    rol.cyl((0, -0.07, 0), (0, 0.07, 0), 0.10, n=12, mat=RUBBER, cap_mat=DARK)
    path = track_path()
    per = sum((V((a[0], 0, a[1])) - V((b[0], 0, b[1]))).length for a, b in zip(path, path[1:] + path[:1]))
    count = round(per / 0.125)
    links = resample_closed(path, count)
    for name, s in (("l", 1), ("r", -1)):
        def inst(src, nm, pos):
            obj(nm, src, pos, body, AXIS_Y, M=tr(pos) @ Matrix.Diagonal((1, s, 1, 1)))
        for i, x in enumerate(ROAD_X):
            inst(rw, "wheel%s%d" % (name, i + 1), (x, s * TRACK_Y, ROAD_Z))
        inst(sp, "sprocket" + name, (SPROCKET[0], s * TRACK_Y, SPROCKET[1]))
        inst(idl, "idler" + name, (IDLER[0], s * TRACK_Y, IDLER[1]))
        for i, x in enumerate(ROLLERS_X):
            inst(rol, "roller%s%d" % (name, i + 1), (x, s * TRACK_Y, 0.80))
        obj("track" + name, build_track(links, left=(s > 0)), (0, 0, 0), body)

    # turret group
    T = TURRET_POS
    turret = obj("turret", build_turret(), T, body, M=tr(T))
    G = T + GUN_REL
    gun = obj("gun", build_gun(), G, turret, AXIS_Y, M=tr(G))
    barrel = obj("gun_barrel", build_barrel(), G, gun, AXIS_X, M=tr(G))
    SP = T + V((-0.30, 0.34, 0.60))
    obj("sight", build_sight(), SP, turret, M=tr(SP))

    # attachment points (GEM uses bones as FX / crew anchors)
    anchors = {
        "foresight3": (barrel, T + V((MUZZLE_X, GUN_REL.y, GUN_REL.z))),
        "foresight4": (gun, G + V((0.55, 0.215, -0.02))),
        "fx_exhaust": (body, (0.04, -1.46, 1.02)),
        "headlight_l": (body, (3.46, 1.10, 0.97)),
        "headlight_r": (body, (3.46, -1.10, 0.97)),
        "stoplight_l": (body, (xr(1.25) - 0.06, 1.02, 1.25)),
        "stoplight_r": (body, (xr(1.25) - 0.06, -1.02, 1.25)),
        "seat_driver": (body, (0.55, 0.50, 1.10)),
        "seat_commander": (body, (0.55, -0.50, 1.10)),
        "emit_rear": (body, (-4.2, 0.0, 0.0)),
        "fx_smoke_l": (turret, T + V((-0.80, 0.70, 0.74))),
        "fx_smoke_r": (turret, T + V((-0.80, -0.70, 0.74))),
    }
    for k in range(8):
        side = 1 if k % 2 == 0 else -1
        anchors["seat%d" % (k + 1)] = (body, (-2.68 + (k // 2) * 0.68, 0.64 * side, 1.14))
    for nm, (par, pos) in anchors.items():
        parts[nm] = empty(nm, pos, par, size=0.08)
    parts["_links"] = links
    parts["_path"] = path
    return parts
