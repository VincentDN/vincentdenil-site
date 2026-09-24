# Partisan loadout demo (AK weapon customiser)

URL: `/3d/ak15-weapon-customiser/`. Three screens: **Armoury** (two rifles, the AK-74M Zenitco and the AK-15K, with deep attachment customisation), **Operator** (a character creator) and **Field** (the operator holding the build). The plan it follows is `PARTISAN-ROADMAP.md`. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; there is no build step. Uses Three.js 0.169.0 (OrbitControls, GLTFLoader, RGBELoader; newer than the other 3D pages because environment rotation needs r162+) and the shared `/assets/viewer-loader.css`. The viewer structure is adapted from `/3d/lousiana-flag-mount-test-xxl/`.

Plan: see `ROADMAP.md`. Current status: step 7 (round two) in progress; see `ROADMAP.md`.

## Models
Both rifles are by [D_U](https://sketchfab.com/DU1701) on Sketchfab, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); the page credits whichever is shown.

- `model/ak-74m-zenitco.glb`: [low-poly AK-74M Zenitco](https://sketchfab.com/3d-models/low-poly-ak-74m-zenitco-35ad8e37a513453cbbbd04064fa5fb79). Removed: loose cartridge `54539_4`, case `54539 case_5`, spare mag `ak74 30rnd empty mag (polymer)_7` (2.9 → 2.2 MB).
- `model/ak-15k.glb`: [low-poly AK-15 K](https://sketchfab.com/3d-models/low-poly-ak-15-k-68725380dd654391bb6b751e888e2c44). Removed: loose cartridge `76239_11`, case `76239 case_12`, spare mag `akm 30rnd epmty mag (polymer)_13` (1.9 → 1.4 MB).

The seated magazines are kept; geometry and materials are otherwise unchanged. `model-source/strip-loose-parts.mjs` reproduces both from the original downloads.

`models.js` configures each rifle: `parts` (source nodes grouped into selectable parts; a node claimed by one part is excluded from the others, which is how the AK-15K's grip mesh `Object_12` is split out of its receiver), `sockets` (mount points in source coordinates), and per slot the factory options, accepted library options and rail limits. Both files share one frame and scale (0.943 m / 9.088 units, from the AK-74M's published 943 mm overall length), so the AK-15K comes out at 791 mm. The AK-15K's brake is modelled into its barrel, so its muzzle slot's factory option is empty and a suppressor threads on in front; it has no factory optic or foregrip, so those slots default to irons and none. Its optic socket sits 5 mm under the receiver-cover rail top, as on the AK-74M's B-13.

On load, `viewer.js` lays the long axis along +x with the slimmer end as the muzzle, scales and centers the rifle. GLTFLoader sanitizes node names, so lookups apply the same sanitizing. Switching rifles (buttons or `#rifle=ak15k`) loads the other file, disposes the old one and re-applies whatever of the current build and finishes the new rifle accepts; camera, lighting and music carry on.

## Lighting
Lighting is image-based: `scene.environment` is an HDR equirectangular map, rotated with `scene.environmentRotation` (and `backgroundRotation` when the backdrop is shown). A single directional light casts the floor shadow; it points at the HDR's brightest texel and turns with the environment, so the shadow always matches the reflections.

- `lighting/studio.hdr` is original: four soft-edged softboxes (key, rim, fill, overhead) on a dim gradient, 1024 × 512 RLE Radiance, 66 KB, peak ≈ 26. Regenerate with `python3 model-source/generate-studio-hdr.py` (NumPy).
- `lighting/quarry_01_1k.hdr` is [Quarry 01](https://polyhaven.com/a/quarry_01) and `lighting/venice_sunset_1k.hdr` is [Venice Sunset](https://polyhaven.com/a/venice_sunset), both from Poly Haven, CC0, copied unchanged from the three.js r160 examples.

Controls: Studio/Outdoor/Sunset, the Light rotation slider, or alt-drag (or shift-drag) on the stage; Backdrop shows the blurred HDR behind the rifle.

Launch look (`LAUNCH` in `viewer.js`): Sunset with the backdrop on and a 255° light offset, matched to a reference render from the hero view (`HERO`: azimuth −0.2 rad, elevation 0.1 rad). Every frame the environment, backdrop and shadow key are rotated by the camera's azimuth minus the hero azimuth plus the offset, so the lights follow the camera and the reference look holds from any angle. The turntable spins the rifle, not the camera, so it still shows the light moving across the rifle.

## Attachments
`attachments.js` lists the slots (Build order, snap camera) and a shared library of built options; each rifle in `models.js` adds its factory options and picks library options, optionally overriding labels and masses (the AK-15K's extended magazine is a 40-round RPK, its drum 75 rounds). A slot shares its id with a mount point and a part of the rifle. On load, `viewer.js` creates a container at each mount point and moves that part's source nodes into it, keeping their world transforms. Options then:

- `original: true` show the source part, optionally with a `pose` (a rotation and offset for the whole part, or per-node offsets in meters). The PT-1 collapsed and folded positions work this way. The fold hinges 35 mm left of the stock mount point.
- `build(ctx)` return new geometry in the slot's frame (meters, +x muzzle, origin at the mount point). It gets the source part (`ctx.original`) and the model's materials (`ctx.materials`).
- anything else leaves the slot empty.

Built attachments are illustrative low-poly shapes using the source materials (`h-190`, `stell`, `polymer`, `glass`, `red_emission`); the classic grip adds a plum polymer. The 45- and 60-round magazines copy the source magazine with its transforms baked into slot space, then warp vertices below the mag well (lengthened; the quad widens to about 1.85× from 20 mm below the well), keeping the source normals.

Slots with `rail` get a stepper that moves the container along x in 10 mm steps within the rail limits. Rail limits are fitted by eye to this model.

## Finish, stats and sharing
- `FINISHES` and `FINISH_TARGETS` in `attachments.js` define the colours. A target with `option` (the suppressor) has its own palette and only appears, and only recolours, while that option is fitted. Recolouring touches only materials named `h-190` or `polymer` in that part (including its attachments); Original restores each material's source colour.
- Length is the x-extent of visible meshes, measured with the turntable angle zeroed. Weight is the rifle's `baseGrams` plus each chosen option's `grams`; both masses are illustrative and exclude ammunition.
- Each rifle launches in its `defaults` build from `models.js`: black receiver, FDE furniture and magazine, suppressor (the AK-15K adds its micro dot and vertical grip). Reset returns there.
- The URL hash holds every non-default choice: `slot=option@offsetmm` and `part-finish=colour`, compared against the rifle's launch defaults (so `stock-finish=original` means black). Loading a hash (or changing it) restores the build; Reset clears it. Copy build link uses the clipboard, falling back to a prompt.

## Motion and mobile
Chip and stepper changes animate over 0.4 s (ease-out) and cut the camera to the slot's own angle (`camera` in each slot: direction, distance and an aim offset toward the part's middle) in 0.45 s. `applySlot` applies the final state first, so stats and the URL reflect it, then rewinds the changed objects and tweens them back: new parts slide 50 mm in along their mount direction, while poses and rail offsets interpolate. Frame time is capped at 1/30 s so slow frames never skip an animation. Reset and URL restores apply instantly. On screens under 780 px the viewer is sticky at the top of the page while the sidebar scrolls beneath it.

## Music
Two tracks, picked under Music: **Abdulena** (default) and **Ambient loop**. Both play through one Web Audio master gain, so volume and fades are shared, and switching dips through silence.

- `audio/abdulena.mp3` ("Abdulena", an Albanian anti-Ottoman song; 2:55, 192 kbps, 4.2 MB) was supplied by the site owner and is used unchanged. It loops, and with `preload="none"` it only downloads once music starts.
- The ambient loop is original, synthesised by `music.js` (86 BPM; Am9, Fmaj7, Cmaj7, Em7, two bars each): detuned saw pad, sine bass, a triangle arpeggio through a dotted-8th delay, soft kick/rim/hats and a generated reverb, into a gentle compressor. `scheduleBar()` only schedules notes, so the same score renders in an `OfflineAudioContext` for previews (peak about −2 dBFS before the master volume).

The player defaults to on at 40% volume and tries to autoplay as the page opens, fading in over about 4 s. Browsers only allow that where the visitor has engaged with the site before; otherwise `AudioContext.resume()` stays pending and music starts on the first click or key press anywhere on the page (the ♪ button starts it too, rather than switching it off, while it is still blocked). The ♪ button on the stage toggles it; the track buttons (which also switch music on) and the volume slider sit under Music. All three are saved in `localStorage` (`ak-customiser-music-v2`; the key changed when the default volume rose) and the page works without it. Music keeps playing while the tab is in the background; the synth schedules 3 s ahead to ride out background timer throttling.

## Handling stats and rules
`stats.js` is pure data: five illustrative 0–100 stats (Ergonomics, Recoil, Handling, Loudness, Sighting range), per-option modifiers keyed by slot and option id, and compatibility rules. Each rifle in `models.js` sets its base `stats`, and options may override `rounds` (the AK-15K's 40-round RPK and 75-round drum). The Build panel shows capacity, weight and length tiles plus stat bars. Hovering or focusing an option previews its change: green is better, red worse (for Recoil and Loudness, lower is better).

A rule blocks options in other slots while its trigger is fitted, in both directions: drum or quad-stack against the folded stock, the 4× scope against folded or removed stocks, the angled grip against the drum. Blocked chips stay visible (struck through, `aria-disabled`); clicking one explains the rule. Links that break a rule fall back to the later slot's default.

## Operator
`operator.js` builds an original low-poly character from a state object; there are no external character assets. The rig is a hierarchy of joints (hips, spine, chest, neck, head, and per side upper arm, forearm, hand, upper leg, lower leg, foot), each an `Object3D` whose local −y runs down the limb. Rigid, flat-shaded segments hang from the joints and are merged per joint and material, so a whole operator is a few dozen meshes and rebuilds instantly on every change. Feet sit on y = 0, facing +z (the operator's right is −x).

`OPERATOR_SECTIONS` drives the panel. Body: frame (male/female proportions), height 1.60–1.95 m, build, six skin tones. Head: hair, hair colour, facial hair, headgear (beanie, field cap, boonie, helmet), face cover (shemagh, balaclava), eyewear. Clothing: top (T-shirt, field jacket, smock), trousers, footwear, gloves, with solid colours or four generated camo patterns (seeded canvas blobs that tile). Gear: chest rig or plate carrier, assault pack or radio, a sidearm in a thigh or hip holster (right side), gear colour. Insignia: armband colour and a shoulder patch. Randomise and Default operator sit above the panel; each change snaps the camera to the part it affects.

## Field
`field.js` poses the operator with the current build in hand: Aim, Low ready, Patrol, Inspect and At ease. The rifle holder moves into a weapon anchor on the operator and is placed from its own geometry (`rifleFrame`): in the shouldered poses the sight line (optic mount plus the optic's `sightHeight`) runs through the right eye with the cheek weld over the stock, and Low ready dips the muzzle around the butt. Both arms are solved with analytic two-bone IK onto the pistol grip and the support point: the foregrip when one is fitted, otherwise the handguard. So moving the foregrip along its rail moves the hand, and a folded stock or short carbine changes the hold.

Save photo renders the current view to a PNG with a PARTISAN caption strip (rifle, pose, date).

## Loadout codes
The hash covers the whole loadout: `mode`, `pose`, rifle build and finishes (as before) and operator choices as `o.<key>=value`, all only where they differ from the defaults, for example `#mode=field&pose=ready&muzzle=comp&o.headgear=helmet&o.topColor=desert`. Reset build resets the rifle only; Default operator resets the character.

## Presets, camo and test fire
- **Presets** (Partisan, Scout, Breacher, Marksman) are whole loadouts written as hash fragments in `viewer.js`: rifle, build, finishes, operator and pose. Applying one keeps the current screen.
- **Rifle camo**: Woodland, Desert and Urban finishes reuse the operator's generated camo textures (`camoFor` in `operator.js`). The rifle files have no UVs, so recolourable materials get a triplanar projection in the rifle's own space, fixed per part at load so the pattern stays glued to each part when it moves.
- **Test fire** (Armoury and Field) plays an original synthesised shot from `sfx.js`: a noise crack, a body thump and a filtered tail, shaped by the muzzle device (the suppressor cuts the crack and tail, brakes brighten and lengthen it). Unsuppressed shots show a short muzzle flash with a point light; every shot kicks the rifle back and up in proportion to the build's Recoil stat.

## Quality and accessibility
- `model-source/smoke-test.mjs` walks every screen, both rifles, every Build option and finish, every Operator control, all poses and presets, test fire and a hash round-trip in headless Chromium, and fails on any page or console error or if the stats never change (227 checks at the time of writing). Run it before pushing; usage is in the file header (`--three=` serves Three.js from a local npm copy for offline runs).
- A Credits & licences panel at the foot of the sidebar lists every asset and licence and notes that stats are illustrative.
- `prefers-reduced-motion` makes camera moves and part swaps jump to their end state.
- First visit shows a dismissible hint (remembered in `localStorage` as `partisan-demo-seen`).

## Field motion, reload and loadout card
- The Field re-solves the pose every frame: the operator breathes, and the rifle sways in a slow figure of eight whose size grows with weight and poor Ergonomics. Test fire kicks the rifle inside the pose, so both hands ride the recoil.
- **Reload** (Field) animates the support hand to the magazine, drops the old one, fetches a fresh one from the chest and seats it, with synthesised release and seating clicks (`sfx.js`). Its duration follows Handling (1.4–3.6 s), longer for the quad-stack and drum. `body[data-reload]` exposes progress for tests.
- **Save loadout card** writes a 1600 × 900 PNG: the current view beside the rifle's stats, build, operator summary and the loadout link.

## Range drill
`range.js` fires five rounds at a 25 m target from the Aim pose, on a timeline from the build's stats: first-shot time and split times from Handling; per-shot spread (cm, 1σ) from the sight (Sighting range), sway (weight and Ergonomics) and, for follow-up shots, Recoil squared, with uncorrected climb walking the string upward. Hits are plotted on a 90 cm ringed target as each shot fires (with the Test fire sound, flash and kick), then scored out of 50 with group size and time. Averaged over 2,000 strings the model separates builds clearly, e.g. the scoped build ≈ 44.7/50, 18 cm, 4.0 s against a bare stockless AK-15K with a drum ≈ 34.2/50, 45 cm, 2.8 s: fast and loose against slow and tight.

## Side rail
A seventh slot on the right-hand handguard rail (both rifles) takes a weapon light, a laser or a combined unit, and slides in 10 mm steps. The light carries a real `SpotLight` that lights the scene and shows in photos; the laser draws a faint beam. They trade Handling and Ergonomics (`stats.js`).

## Performance
- Both rifle files are meshopt-compressed with quantized positions (`model-source/compress-models.mjs`, run after `strip-loose-parts.mjs`): AK-74M 2.2 → 0.6 MB, AK-15K 1.4 → 0.4 MB. The script checks node names are unchanged. The viewer loads them with `MeshoptDecoder`; `reshape()` expands quantized attributes to floats before stretching magazines.
- Resolution adapts: every 2 s the pixel ratio drops a quarter step while frames average over 28 ms (down to 1) and rises again under 14 ms. Phones (≤ 780 px or coarse pointer) start at ≤ 1.5× with a 1024 shadow map.
- Once idle, the page fetches the other rifle into the HTTP cache so switching is instant.

## Wear
The Wear slider under Finish (Factory new → Light → Field used → Battle worn, `wear=0–100` in the hash) adds two procedural layers in the rifle's shader, on the recolourable (black-finish and polymer) surfaces: lengthwise scuffs that expose bare steel (up to about a fifth of the surface) and soft dust that settles on upward faces. Both use 3D value noise in the rifle's own space, so they stay put when parts move and need no UVs.
