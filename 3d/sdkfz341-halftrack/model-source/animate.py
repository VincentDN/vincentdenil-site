"""Showcase animation clips for the Sd.Kfz.341.

Every clip is one Action (a slot per object), stashed on an NLA track named after
the clip, so the glTF exporter writes one animation per clip. All joints turn
about / slide along their local Z axis (see vehicle.build).
"""

import math

import bpy
from mathutils import Matrix, Quaternion, Vector

import vehicle as vh
from geo import set_parent, world_matrix

FPS = 30
CLIPS = {"drive": 60, "steer": 60, "turret": 150, "fire": 24, "ramp": 45, "hatches": 30}


def ease(t):
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------------------
# track: separate link objects that travel around the belt
# ---------------------------------------------------------------------------
class Belt:
    def __init__(self, path):
        self.pts = [Vector((p[0], 0, p[1])) for p in path]
        self.cum = [0.0]
        n = len(self.pts)
        for i in range(n):
            self.cum.append(self.cum[-1] + (self.pts[(i + 1) % n] - self.pts[i]).length)
        self.total = self.cum[-1]

    def at(self, s):
        s %= self.total
        import bisect
        i = min(bisect.bisect_right(self.cum, s) - 1, len(self.pts) - 1)
        a, b = self.pts[i], self.pts[(i + 1) % len(self.pts)]
        seg = self.cum[i + 1] - self.cum[i]
        t = (s - self.cum[i]) / seg if seg > 1e-9 else 0.0
        # smooth the tangent a little over the joint so links don't snap
        d = (b - a).normalized()
        return a.lerp(b, t), d

    def matrix(self, s, y, span=0.06):
        p, _ = self.at(s)
        pa, _ = self.at(s - span)
        pb, _ = self.at(s + span)
        d = (pb - pa).normalized()
        nrm = d.cross(Vector((0, 1, 0)))
        return Matrix(((d.x, 0, -nrm.x, p.x), (0, 1, 0, y), (d.z, 0, -nrm.z, p.z), (0, 0, 0, 1)))


def split_tracks(parts):
    """Hide the single-mesh game tracks and add per-link objects for the showcase."""
    belt = Belt(parts["_path"])
    frames, pitch = parts["_links"]
    count = len(frames)
    link_me = parts["_tracklink"].data
    link_me.name = "tracklink"
    bpy.data.objects.remove(parts.pop("_tracklink"))
    col = bpy.context.scene.collection
    game = bpy.data.collections.new("game_tracks")
    col.children.link(game)
    out = {}
    for side, y in (("l", vh.TRACK_Y), ("r", -vh.TRACK_Y)):
        single = parts["track" + side]
        single.name = "track%s_game" % side
        for c in list(single.users_collection):
            c.objects.unlink(single)
        game.objects.link(single)
        parts["track%s_game" % side] = single
        holder = bpy.data.objects.new("track" + side, None)
        holder.empty_display_size = 0.05
        col.objects.link(holder)
        set_parent(holder, parts["body"])
        parts["track" + side] = holder
        links = []
        for i in range(count):
            ob = bpy.data.objects.new("link%s%02d" % (side, i), link_me)
            ob.matrix_basis = belt.matrix(i * belt.total / count, y)
            col.objects.link(ob)
            set_parent(ob, holder)
            links.append(ob)
        out[side] = links
    game.hide_viewport = True
    game.hide_render = True
    parts["_belt"] = belt
    parts["_linkobjs"] = out
    return out


# ---------------------------------------------------------------------------
# keyframe plumbing (slotted actions, Blender 4.4+)
# ---------------------------------------------------------------------------
def _fcurves(obj, action):
    ad = obj.animation_data or obj.animation_data_create()
    ad.action = action
    slot = ad.action_slot
    if slot is None:
        slot = action.slots.new(id_type="OBJECT", name=obj.name)
        ad.action_slot = slot
    layer = action.layers[0] if len(action.layers) else action.layers.new("Layer")
    strip = layer.strips[0] if len(layer.strips) else layer.strips.new(type="KEYFRAME")
    return strip.channelbag(slot, ensure=True).fcurves, slot


def _write(fcs, path, index, values):
    fc = fcs.new(path, index=index)
    fc.keyframe_points.add(len(values))
    flat = []
    for f, v in enumerate(values):
        flat += [float(f), float(v)]
    fc.keyframe_points.foreach_set("co", flat)
    fc.keyframe_points.foreach_set("interpolation", [1] * len(values))     # LINEAR
    fc.update()


def key_matrices(obj, action, mats, loc=True, rot=True):
    """mats: local matrix_basis per frame."""
    rest = obj.matrix_basis.copy()
    obj.rotation_mode = "QUATERNION"
    obj.matrix_basis = rest
    fcs, slot = _fcurves(obj, action)
    if loc:
        for i in range(3):
            _write(fcs, "location", i, [m.translation[i] for m in mats])
    if rot:
        qs = []
        prev = None
        for m in mats:
            q = m.to_quaternion()
            if prev is not None and prev.dot(q) < 0:
                q.negate()
            prev = q
            qs.append(q)
        for i in range(4):
            _write(fcs, "rotation_quaternion", i, [q[i] for q in qs])
    return slot


def spin(obj, action, angles):
    """Rotate about the object's local Z by the given angles (radians) per frame."""
    rest = obj.matrix_basis.copy()
    return key_matrices(obj, action, [rest @ Matrix.Rotation(a, 4, "Z") for a in angles], loc=False)


def slide(obj, action, offsets):
    rest = obj.matrix_basis.copy()
    return key_matrices(obj, action, [rest @ Matrix.Translation((0, 0, d)) for d in offsets], rot=False)


def animate(parts):
    scn = bpy.context.scene
    scn.render.fps = FPS
    acts = {name: bpy.data.actions.new(name) for name in CLIPS}
    used = {}       # clip -> [(obj, slot)]

    def reg(clip, obj, slot):
        used.setdefault(clip, []).append((obj, slot))

    # ---- drive: one front-wheel revolution, loops seamlessly ---------------
    n = CLIPS["drive"]
    ts = [f / n for f in range(n + 1)]
    A = acts["drive"]
    turns = {"wheell": 1, "wheelr": 1, "sprocketl": 2, "sprocketr": 2, "idlerl": 2, "idlerr": 2}
    for s in "lr":
        for i in range(1, 5):
            turns["wheel%s%d" % (s, i)] = 2
        for i in (1, 2):
            turns["roller%s%d" % (s, i)] = 6
    for name, k in turns.items():
        reg("drive", parts[name], spin(parts[name], A, [2 * math.pi * k * t for t in ts]))
    belt = parts["_belt"]
    frames, pitch = parts["_links"]
    count = len(frames)
    travel = round(2 * math.pi * vh.FRONT_R / (belt.total / count)) * belt.total / count
    for side, y in (("l", vh.TRACK_Y), ("r", -vh.TRACK_Y)):
        for i, ob in enumerate(parts["_linkobjs"][side]):
            s0 = i * belt.total / count
            reg("drive", ob, key_matrices(ob, A, [belt.matrix(s0 + travel * t, y) for t in ts]))

    # ---- steer ---------------------------------------------------------------
    n = CLIPS["steer"]
    A = acts["steer"]
    ang = [math.radians(28) * math.sin(2 * math.pi * f / n) for f in range(n + 1)]
    for name in ("steerl", "steerr"):
        reg("steer", parts[name], spin(parts[name], A, ang))

    # ---- turret scan -----------------------------------------------------------
    n = CLIPS["turret"]
    A = acts["turret"]
    ph = [2 * math.pi * f / n for f in range(n + 1)]
    reg("turret", parts["turret"], spin(parts["turret"], A, [math.radians(42) * math.sin(p) for p in ph]))
    # local Z of the gun = world +Y, so a negative angle raises the muzzle
    reg("turret", parts["gun"], spin(parts["gun"], A, [math.radians(-8 - 6 * math.sin(2 * p - 0.6)) for p in ph]))
    reg("turret", parts["sight"], spin(parts["sight"], A, [-p for p in ph]))

    # ---- fire: recoil ------------------------------------------------------------
    n = CLIPS["fire"]
    A = acts["fire"]

    def recoil(f):
        if f <= 2:
            return f / 2
        return max(0.0, 1 - ease(min(1, (f - 2) / 13)))
    reg("fire", parts["gun_barrel"], slide(parts["gun_barrel"], A, [-0.17 * recoil(f) for f in range(n + 1)]))
    reg("fire", parts["gun"], spin(parts["gun"], A, [math.radians(-1.1) * recoil(f) for f in range(n + 1)]))

    # ---- ramp / hatches ------------------------------------------------------------
    n = CLIPS["ramp"]
    reg("ramp", parts["ramp"], spin(parts["ramp"], acts["ramp"], [math.radians(-127.5) * ease(f / n) for f in range(n + 1)]))
    n = CLIPS["hatches"]
    for name in ("hatch_driver", "hatch_commander"):
        reg("hatches", parts[name], spin(parts[name], acts["hatches"], [math.radians(-96) * ease(f / n) for f in range(n + 1)]))

    # ---- stash every clip on its own NLA track -----------------------------------
    for clip, items in used.items():
        for obj, slot in items:
            ad = obj.animation_data
            ad.action = None
            tr = ad.nla_tracks.new()
            tr.name = clip
            st = tr.strips.new(clip, 0, acts[clip])
            try:
                st.action_slot = slot
            except Exception:
                pass
            tr.mute = True
    for a in acts.values():
        a.use_fake_user = True
    scn.frame_start, scn.frame_end = 0, CLIPS["drive"]
    parts["_clips"] = used
    return used


def activate(parts, clip):
    """Make one clip the live action on its objects (None = rest pose)."""
    for c, items in parts["_clips"].items():
        for obj, slot in items:
            ad = obj.animation_data
            if c == clip:
                ad.action = bpy.data.actions[c]
                ad.action_slot = slot
    for c, items in parts["_clips"].items():
        if c == clip:
            continue
        live = {o.name for o, _ in parts["_clips"].get(clip, [])} if clip else set()
        for obj, slot in items:
            if obj.name not in live:
                obj.animation_data.action = None
    if clip:
        bpy.context.scene.frame_start, bpy.context.scene.frame_end = 0, CLIPS[clip]
