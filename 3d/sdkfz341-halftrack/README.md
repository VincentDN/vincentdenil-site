# Sd.Kfz.341 MRAP half-track (WW2044)

3D model of the Sd.Kfz.341 half-track IFV from the WW2044 dev diary
["German Half-Track IFV's during the Battle of the Ardennes, 2044"](https://kaisercatcinema.com/blogs/dev-diaries/world-of-ww2044-german-half-track-ifvs-during-the-battle-of-the-ardennes-2044),
built in Blender 5.3 and prepared for Call to Arms – Gates of Hell: Ostfront. Preview page: `/3d/sdkfz341-halftrack/`.

## What is here

| Path | What |
| --- | --- |
| `sdkfz341.glb` | Animated model for the web viewer (clips: drive, steer, turret, fire, ramp, hatches) |
| `sdkfz341.blend` | Blender scene: one object per bone, clips on NLA tracks, hidden `game_tracks` collection with the single-mesh tracks |
| `sdkfz341.fbx` | Rest-pose FBX for other DCC tools |
| `textures/` | 2K PNG sets (body, turret, chassis): colour, normal, occlusion/roughness/metal |
| `renders/` | Cycles renders |
| `goh-mod/sdkfz341_halftrack/` | Mod folder skeleton: `mod.info`, draft `.def`, `.mtl` files, DDS textures |
| `model-source/` | The generator: every vertex comes from these Python scripts |
| `MODDING.md` | How to get it into the game, and what is still unverified |
| `build-report.json` | Counts from the last build |

## Rebuild

```
pip install bpy            # Blender as a Python module (5.3 used here)
cd model-source
python3 build.py --out .. --res 2048 --renders
```

Takes about ten minutes on four CPU cores, most of it the ambient-occlusion bake. `--res 4096` gives 4K textures.
Design dimensions, station profiles and part positions are constants at the top of `vehicle.py`; the paint job
(Hinterhalt three-tone with ambush dots, wear, mud) is in `texture.py`.

## Design read from the concept art

Widened Sd.Kfz.251-style faceted hull with a chine line, long sloped bonnet with a raised centre panel and
Balkenkreuz, two armoured windscreen visors, MRAP V-shaped lower hull, bull bar with winch, big steered front
wheels, four road wheels per side with front sprocket and rear idler, rear quarter pods, unmanned Puma-style turret
with a long 30 mm barrel, commander's panoramic sight, smoke launchers, sensor panels and antennas, tied-down whip
antenna, turret number 334 and "Panzer vor!" on the cab. The article gives no dimensions; the model is 7.1 m long,
3.0 m wide and 3.2 m to the top of the sight, scaled so standing soldiers reach the chine as in the art. The rear
ramp, roof hatches, interior benches and under-body are my additions where the art shows nothing.

## Honest status

- Geometry, UVs, textures, rig and the six clips are done and checked in renders and in the exported GLB.
- This is a first production pass, not yet a match for the stock Gates of Hell vehicles: it is hard-surface
  primitives with baked procedural paint. It has no sculpted welds, no hand-painted wear, no LODs, no destroyed
  ("x") model, and the crew compartment is a simple shell.
- The game files (`.mdl`, `.ply`, `.vol`, `.anm`) are **not** in the mod folder yet. The exporter step uses a
  third-party Blender add-on and was not run in the build session; see `MODDING.md`.
- Nothing has been loaded in the game. The `.def` is a draft written from general GEM-engine conventions.
