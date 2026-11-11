"""Small mesh-building helpers for the Sd.Kfz.341 generator.

Everything is authored in metres, +X forward, +Y left, +Z up. A MeshBuilder
collects raw vertices / polygons with a material slot per face; primitives never
share vertices with each other, so hard edges between plates come for free.
"""

import math

import bpy
from mathutils import Matrix, Vector

V = Vector


def rot(axis, deg):
    return Matrix.Rotation(math.radians(deg), 4, axis)


def tr(x, y=0.0, z=0.0):
    if not isinstance(x, (int, float)):
        x, y, z = x
    return Matrix.Translation((x, y, z))


def frame(origin, xdir, up=(0, 0, 1)):
    """Matrix whose local +X points along xdir, local +Z close to `up`."""
    x = V(xdir).normalized()
    up = V(up)
    if abs(x.dot(up.normalized())) > 0.999:
        up = V((1, 0, 0))
    y = up.cross(x).normalized()
    z = x.cross(y).normalized()
    m = Matrix((
        (x.x, y.x, z.x, origin[0]),
        (x.y, y.y, z.y, origin[1]),
        (x.z, y.z, z.z, origin[2]),
        (0, 0, 0, 1)))
    return m


class MeshBuilder:
    def __init__(self):
        self.verts = []
        self.faces = []
        self.mats = []
        self.smooth = []

    # -- raw -------------------------------------------------------------
    def add(self, verts, faces, mat=0, smooth=False, M=None, flip=False):
        base = len(self.verts)
        if M is not None:
            verts = [M @ V(v) for v in verts]
            if M.determinant() < 0:
                flip = not flip
        self.verts.extend(tuple(v) for v in verts)
        for f in faces:
            f = [base + i for i in f]
            if flip:
                f.reverse()
            self.faces.append(f)
            self.mats.append(mat)
            self.smooth.append(smooth)

    def merge(self, other, M=None, mat_map=None):
        base = len(self.verts)
        flip = M is not None and M.determinant() < 0
        vs = other.verts if M is None else [tuple(M @ V(v)) for v in other.verts]
        self.verts.extend(vs)
        for f, m, s in zip(other.faces, other.mats, other.smooth):
            f = [base + i for i in f]
            if flip:
                f.reverse()
            self.faces.append(f)
            self.mats.append(mat_map[m] if mat_map else m)
            self.smooth.append(s)

    def mirrored(self, fn):
        """Run fn(builder) and add the result plus its Y mirror."""
        tmp = MeshBuilder()
        fn(tmp)
        self.merge(tmp)
        self.merge(tmp, Matrix.Diagonal((1, -1, 1, 1)))

    # -- primitives --------------------------------------------------------
    def quad(self, a, b, c, d, mat=0, M=None):
        self.add([a, b, c, d], [(0, 1, 2, 3)], mat, M=M)

    def poly(self, pts, mat=0, M=None, flip=False):
        self.add(pts, [tuple(range(len(pts)))], mat, M=M, flip=flip)

    def box(self, c, size, mat=0, M=None, taper=None):
        """Axis-aligned box centred on c. taper=(sx, sy) scales the +Z face."""
        hx, hy, hz = size[0] / 2, size[1] / 2, size[2] / 2
        tx, ty = taper or (1, 1)
        v = [(-hx, -hy, -hz), (hx, -hy, -hz), (hx, hy, -hz), (-hx, hy, -hz),
             (-hx * tx, -hy * ty, hz), (hx * tx, -hy * ty, hz), (hx * tx, hy * ty, hz), (-hx * tx, hy * ty, hz)]
        v = [(x + c[0], y + c[1], z + c[2]) for x, y, z in v]
        f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
        self.add(v, f, mat, M=M)

    def box2(self, lo, hi, mat=0, M=None, taper=None):
        c = [(a + b) / 2 for a, b in zip(lo, hi)]
        s = [abs(b - a) for a, b in zip(lo, hi)]
        self.box(c, s, mat, M, taper)

    def prism(self, profile, a, b, axis="y", mat=0, M=None, cap_mat=None):
        """Extrude a 2D polygon. axis 'y': profile is (x, z), spans y=a..b.
        axis 'x': profile is (y, z). axis 'z': profile is (x, y)."""
        n = len(profile)

        def p3(p, t):
            if axis == "y":
                return (p[0], t, p[1])
            if axis == "x":
                return (t, p[0], p[1])
            return (p[0], p[1], t)
        v = [p3(p, a) for p in profile] + [p3(p, b) for p in profile]
        sides = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        nrm = V((0, 0, 0))
        for i in range(n):
            nrm += V(v[i]).cross(V(v[(i + 1) % n]))
        d = V(v[n]) - V(v[0])
        out = nrm.dot(d) < 0          # cap a already faces away from the solid
        cm = mat if cap_mat is None else cap_mat
        self.add(v, sides, mat, M=M, flip=out)
        self.add(v, [tuple(range(n))], cm, M=M, flip=not out)
        self.add(v, [tuple(range(n, 2 * n))], cm, M=M, flip=out)

    def cyl(self, p0, p1, r, n=16, mat=0, r2=None, caps=(True, True), smooth=True, M=None, cap_mat=None):
        p0, p1 = V(p0), V(p1)
        r2 = r if r2 is None else r2
        F = frame(p0, p1 - p0)
        L = (p1 - p0).length
        vs = []
        for i in range(n):
            a = 2 * math.pi * i / n
            c, s = math.cos(a), math.sin(a)
            vs.append(F @ V((0, r * c, r * s)))
        for i in range(n):
            a = 2 * math.pi * i / n
            c, s = math.cos(a), math.sin(a)
            vs.append(F @ V((L, r2 * c, r2 * s)))
        sides = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        self.add(vs, sides, mat, smooth=smooth, M=M)
        cm = mat if cap_mat is None else cap_mat
        if caps[0] and r > 1e-6:
            self.add(vs[:n], [tuple(reversed(range(n)))], cm, M=M)
        if caps[1] and r2 > 1e-6:
            self.add(vs[n:], [tuple(range(n))], cm, M=M)

    def lathe(self, profile, n=24, mat=0, M=None, smooth=True, mats=None, flat=None):
        """Revolve (axial, radius) profile about local +Y... actually about local X.
        Profile points run along the axis; outward normals for increasing axial order
        are produced when the profile is traced so that the surface is to its left.
        mats: optional per-segment material list. flat: per-segment flat-shading flags."""
        k = len(profile)
        vs = []
        for (ax, r) in profile:
            for i in range(n):
                a = 2 * math.pi * i / n
                vs.append((ax, r * math.cos(a), r * math.sin(a)))
        for j in range(k - 1):
            fs = []
            for i in range(n):
                i2 = (i + 1) % n
                fs.append((j * n + i, j * n + i2, (j + 1) * n + i2, (j + 1) * n + i))
            m = mats[j] if mats else mat
            sm = smooth and not (flat and flat[j])
            # emit with own vertices so segments can differ in shading
            self.add(vs, fs, m, smooth=sm, M=M)
        # drop unused duplicate verts later (cleanup in to_object)

    def tube(self, pts, r, n=8, mat=0, caps=True, M=None, closed=False):
        """Swept round tube through a polyline (mitred joints)."""
        pts = [V(p) for p in pts]
        m = len(pts)
        rings = []
        prev_up = None
        for i, p in enumerate(pts):
            if closed:
                d = (pts[(i + 1) % m] - pts[i - 1]).normalized()
            elif i == 0:
                d = (pts[1] - p).normalized()
            elif i == m - 1:
                d = (p - pts[i - 1]).normalized()
            else:
                d = ((pts[i + 1] - p).normalized() + (p - pts[i - 1]).normalized()).normalized()
            up = prev_up if prev_up is not None else V((0, 0, 1))
            if abs(d.dot(up)) > 0.95:
                up = V((1, 0, 0)) if prev_up is None else up
            y = up.cross(d)
            if y.length < 1e-6:
                y = V((0, 1, 0)).cross(d)
            y.normalize()
            z = d.cross(y).normalized()
            prev_up = z
            # mitre scale
            sc = 1.0
            if 0 < i < m - 1 or closed:
                a = (pts[(i + 1) % m] - p).normalized()
                b = (p - pts[i - 1]).normalized()
                cosang = max(-1.0, min(1.0, a.dot(b)))
                sc = 1.0 / max(0.5, math.cos(math.acos(cosang) / 2))
            rings.append([p + (y * math.cos(2 * math.pi * k / n) + z * math.sin(2 * math.pi * k / n)) * r * sc
                          for k in range(n)])
        vs = [v for ring in rings for v in ring]
        fs = []
        segs = m if closed else m - 1
        for j in range(segs):
            j2 = (j + 1) % m
            for k in range(n):
                k2 = (k + 1) % n
                fs.append((j * n + k, j * n + k2, j2 * n + k2, j2 * n + k))
        self.add(vs, fs, mat, smooth=True, M=M)
        if caps and not closed:
            self.add(rings[0], [tuple(reversed(range(n)))], mat, M=M)
            self.add(rings[-1], [tuple(range(n))], mat, M=M)

    def loft(self, rings, mat=0, M=None, caps=(False, False), mats=None, closed=True):
        """Skin between rings (lists of 3D points, same length). Flat shaded quads.
        mats: optional callable (ring_index, seg_index) -> material."""
        n = len(rings[0])
        vs = [p for ring in rings for p in ring]
        segs = n if closed else n - 1
        for j in range(len(rings) - 1):
            for i in range(segs):
                i2 = (i + 1) % n
                m = mats(j, i) if mats else mat
                a, b, c, d = vs[j * n + i], vs[j * n + i2], vs[(j + 1) * n + i2], vs[(j + 1) * n + i]
                # skip degenerate
                pts = []
                for p in (a, b, c, d):
                    if not pts or (V(p) - V(pts[-1])).length > 1e-6:
                        pts.append(p)
                if len(pts) > 1 and (V(pts[0]) - V(pts[-1])).length < 1e-6:
                    pts.pop()
                if len(pts) >= 3:
                    self.add(pts, [tuple(range(len(pts)))], m, M=M)
        if caps[0]:
            self.add(rings[0], [tuple(reversed(range(n)))], mat, M=M)
        if caps[1]:
            self.add(rings[-1], [tuple(range(n))], mat, M=M)

    def slab(self, pts, thickness, mat=0, side_mat=None, M=None, offset=0.0):
        """Raised plate from a planar polygon (CCW seen from outside), lifted along its normal."""
        pts = [V(p) for p in pts]
        nrm = V((0, 0, 0))
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            nrm += a.cross(b)
        nrm.normalize()
        lo = [p + nrm * offset for p in pts]
        hi = [p + nrm * (offset + thickness) for p in pts]
        n = len(pts)
        self.add(hi, [tuple(range(n))], mat, M=M)
        sm = mat if side_mat is None else side_mat
        self.add(lo + hi, [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)], sm, M=M)
        return nrm

    def bolt(self, p, nrm, r=0.012, h=0.008, mat=0, M=None, n=6):
        """Hex bolt head as a low frustum, shallow enough to unwrap as a single UV island."""
        p = V(p)
        nrm = V(nrm).normalized()
        self.cyl(p, p + nrm * h, r, n=n, mat=mat, r2=r * 0.55, caps=(False, True), smooth=False, M=M)

    # -- output ------------------------------------------------------------
    def tri_count(self):
        return sum(len(f) - 2 for f in self.faces)

    def to_object(self, name, materials, pivot=(0, 0, 0), collection=None, R=None):
        """R: optional rest orientation of the object (4x4 rotation); the mesh is counter-rotated
        so the part looks the same but its local axes are the joint axes the engine expects."""
        pv = V(pivot)
        Rinv = R.inverted() if R is not None else None
        # compact unused vertices
        used = sorted({i for f in self.faces for i in f})
        remap = {old: new for new, old in enumerate(used)}
        verts = [tuple(V(self.verts[i]) - pv) for i in used]
        if Rinv is not None:
            verts = [tuple(Rinv @ V(v)) for v in verts]
        faces = [[remap[i] for i in f] for f in self.faces]
        me = bpy.data.meshes.new(name)
        me.from_pydata(verts, [], faces)
        for m in materials:
            me.materials.append(m)
        me.polygons.foreach_set("material_index", self.mats)
        me.polygons.foreach_set("use_smooth", self.smooth)
        me.update()
        me.validate()
        ob = bpy.data.objects.new(name, me)
        ob.matrix_basis = Matrix.Translation(pv) @ (R if R is not None else Matrix.Identity(4))
        (collection or bpy.context.scene.collection).objects.link(ob)
        return ob


def bilerp(q, u, v):
    """Point on quad q=(p00,p10,p11,p01) at (u, v)."""
    p00, p10, p11, p01 = [V(p) for p in q]
    return (p00 * (1 - u) + p10 * u) * (1 - v) + (p01 * (1 - u) + p11 * u) * v


def quad_normal(q):
    p00, p10, p11, p01 = [V(p) for p in q]
    return (p10 - p00).cross(p01 - p00).normalized()


def sub_quad(q, u0, u1, v0, v1):
    return [bilerp(q, u0, v0), bilerp(q, u1, v0), bilerp(q, u1, v1), bilerp(q, u0, v1)]


def world_matrix(ob):
    """World matrix from the parent chain (valid before the depsgraph has been evaluated)."""
    m = ob.matrix_basis.copy()
    p = ob.parent
    while p is not None:
        m = p.matrix_basis @ m
        p = p.parent
    return m


def empty(name, loc, parent=None, size=0.1, collection=None, R=None):
    ob = bpy.data.objects.new(name, None)
    ob.empty_display_size = size
    ob.matrix_basis = Matrix.Translation(V(loc)) @ (R if R is not None else Matrix.Identity(4))
    (collection or bpy.context.scene.collection).objects.link(ob)
    if parent is not None:
        set_parent(ob, parent)
    return ob


def set_parent(ob, parent):
    """Parent keeping the world transform. ob must not have a parent yet."""
    w = world_matrix(ob)
    ob.parent = parent
    ob.matrix_parent_inverse = Matrix.Identity(4)
    ob.matrix_basis = world_matrix(parent).inverted() @ w


AXIS_Y = Matrix.Rotation(math.radians(-90), 4, "X")     # local Z -> world +Y (axles, trunnions, hinges)
AXIS_X = Matrix.Rotation(math.radians(90), 4, "Y")      # local Z -> world +X (recoil)
