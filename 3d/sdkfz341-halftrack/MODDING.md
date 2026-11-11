# Getting the Sd.Kfz.341 into Gates of Hell

Call to Arms – Gates of Hell: Ostfront runs on the GEM engine. A vehicle is a folder under
`resource/entity/` holding:

| File | Role | State here |
| --- | --- | --- |
| `sdkfz341.mdl` | text file: bone tree, joint types, volumes, animation list | to export (step 2) |
| `*.ply` | one mesh per bone | to export (step 2) |
| `*.vol` | collision / armour polyhedra | to export (step 2) |
| `*.anm` | sequences: `fire`, `ramp_open`, `ramp_close`, `hatch_open`, `hatch_close` | to export (step 2) |
| `*.mtl` | materials pointing at the textures | written |
| `*.dds` | diffuse, `_bp` normal, `_sp` specular (DXT1, mipmapped) | written by the build |
| `sdkfz341.def` | gameplay definition: armour, chassis, weapons, seats | draft, see step 4 |

Everything below is what I know of the format and the tools; none of it has been run against the game.
Points I could not check are marked **verify**.

## 1. Install the mod folder

Copy `goh-mod/sdkfz341_halftrack` into `<game>/mods/`. Set `minGameVersion` / `maxGameVersion` in `mod.info`
to your game version. Enable the mod in the game's mod list.

## 2. Export the engine files from Blender

The scene is already laid out the way GEM wants it: one object per bone, every joint turns about (or slides along)
its local Z axis, bone names in the table below, single-mesh tracks kept in the hidden `game_tracks` collection.

Exporter: **GemWerk** (https://github.com/vsevoloden/gemwerk_io), a Blender 4.2+ add-on that reads and writes
`.mdl/.ply/.vol/.anm/.mtl`. Two ways:

- Scripted, the whole thing in one go:
  ```
  git clone https://github.com/vsevoloden/gemwerk_io
  cd model-source
  python3 build.py --out .. --res 2048 --gemwerk /path/to/gemwerk_io
  ```
  `export.py` swaps in the single-mesh tracks, scales metres to GEM units (×20), marks bones and joint types,
  adds the volumes (`body`, `body_lower`, `engine`, `turret`, `gun`, `trackl`, `trackr`, `wheell`, `wheelr`) and the
  footprint obstacle, writes everything into the mod's entity folder and reads it back as a check
  (`build-report.json`, key `gem`).
- By hand: install GemWerk in Blender, open `sdkfz341.blend`, and use the GEM sidebar tab plus
  File > Export > GEM Model. `export.prepare_gem_scene()` shows exactly which properties to set.

This step was written but not executed in the session that built the model, because it runs downloaded third-party
code. Run it yourself, or tell me to run it.

An alternative is the game's official route: the 3ds Max exporter that ships with the game's tools, fed with
`sdkfz341.fbx`. That needs the bones re-tagged in Max.

## 3. Bone names

| Bone | Type | Notes |
| --- | --- | --- |
| `basis` > `body` | fixed | hull, origin on the ground under the hull centre, +X forward |
| `turret` | revolute | 360°, Z up |
| `gun` | revolute | −10° to +45°, axis across the vehicle |
| `gun_barrel` | prismatic | recoil 0.17 m |
| `sight` | revolute | commander's panoramic sight |
| `steerl`, `steerr` > `wheell`, `wheelr` | steering knuckle > front wheel | radius 0.60 m |
| `wheell1`–`4`, `wheelr1`–`4` | road wheels | radius 0.30 m |
| `sprocketl/r`, `idlerl/r`, `rollerl1–2`, `rollerr1–2` | running gear | |
| `trackl`, `trackr` | track mesh | 73 links a side, all links share one UV tile so the texture can scroll |
| `ramp`, `hatch_driver`, `hatch_commander` | animated by `.anm` | |
| `foresight3`, `foresight4` | muzzle points | main gun, coaxial MG |
| `seat_driver`, `seat_commander`, `seat1`–`seat8`, `emit_rear` | crew and passenger anchors | |
| `fx_exhaust`, `headlight_l/r`, `stoplight_l/r`, `fx_smoke_l/r` | effect anchors | |

**Verify** against the stock half-track: unpack `resource/entity/entity.pak` (it is a zip), open the Sd.Kfz.251's
`.mdl` in a text editor and compare its bone names with this table. The engine finds wheels, tracks, the turret
and the gun by name, so where the stock file differs, rename ours. Names are plain strings in `vehicle.py`
(`build()`), so a rename is a one-line change and a rebuild.

## 4. The `.def`

`sdkfz341.def` in the mod folder is a draft in the older Men of War layout. Gates of Hell's own files use
include macros and property blocks I could not look at. The reliable way:

1. Copy the stock Sd.Kfz.251 `.def` over ours.
2. Point `{extension ...}` at `sdkfz341.mdl`.
3. Swap the weapon for a stock autocannon (the 2 cm KwK 38 of the Sd.Kfz.234/1 is the closest stock weapon;
   a 30 mm needs its own weapon and ammunition definitions later).
4. Set seats to 2 crew + 8 passengers, the rear dismount point to `emit_rear`, and the door sequences to
   `ramp_open` / `ramp_close`.
5. Carry over the armour values and mass from the draft.

Then start the game editor (F3 map editor), place the entity `sdkfz341`, and read the console for missing bones
or files. That log is the fastest way to finish the job; paste it to me and I will fix the model side.

## 5. Things to check in game

- **Scale and facing.** GEM uses 20 units per metre and vehicles face +X. Both are applied on export.
- **Joint axes.** I set revolute joints to turn about local Z and the recoil to slide along local Z, which is how
  I remember the engine's convention. If the turret or gun turns about the wrong axis, the fix is the `AXIS_*`
  rotation passed in `vehicle.build()`.
- **Wheel spin direction** on the right side, and whether the engine wants the road wheels as plain or revolute bones.
- **Track animation.** The engine scrolls the track texture; if it expects a different mesh or material name for
  that, copy the stock vehicle's.
- **Normal map convention** (green channel up or down) and whether textures may sit next to the model or must go
  under `resource/texture/`. If lighting looks inverted on the bump detail, flip the green channel in
  `texture.py` (`height_to_normal`).
- **Missing game assets:** a destroyed model, LODs, a 30 mm weapon definition, an icon for the unit bar, and an
  entry in a faction's unit list (breed/squad files) so it can be bought in skirmish or conquest.
