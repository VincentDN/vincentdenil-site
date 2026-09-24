# AK weapon customiser

URL: `/3d/ak15-weapon-customiser/`. Two rifles: the AK-74M Zenitco (default) and the AK-15K, switchable in place. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; there is no build step. Uses Three.js 0.169.0 (OrbitControls, GLTFLoader, RGBELoader; newer than the other 3D pages because environment rotation needs r162+) and the shared `/assets/viewer-loader.css`. The viewer structure is adapted from `/3d/lousiana-flag-mount-test-xxl/`.

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
- The URL hash holds every non-default choice: `slot=option@offsetmm` and `part-finish=colour`. Loading a hash (or changing it) restores the build; Reset clears it. Copy build link uses the clipboard, falling back to a prompt.

## Motion and mobile
Chip and stepper changes animate over 0.4 s (ease-out) and cut the camera to the slot's own angle (`camera` in each slot: direction, distance and an aim offset toward the part's middle) in 0.45 s. `applySlot` applies the final state first, so stats and the URL reflect it, then rewinds the changed objects and tweens them back: new parts slide 50 mm in along their mount direction, while poses and rail offsets interpolate. Frame time is capped at 1/30 s so slow frames never skip an animation. Reset and URL restores apply instantly. On screens under 780 px the viewer is sticky at the top of the page while the sidebar scrolls beneath it.

## Music
Two tracks, picked under Music: **Albulena** (default) and **Ambient loop**. Both play through one Web Audio master gain, so volume and fades are shared, and switching dips through silence.

- `audio/albulena.mp3` ("Albulena", an Albanian anti-Ottoman song; 2:55, 192 kbps, 4.2 MB) was supplied by the site owner and is used unchanged. It loops, and with `preload="none"` it only downloads once music starts.
- The ambient loop is original, synthesised by `music.js` (86 BPM; Am9, Fmaj7, Cmaj7, Em7, two bars each): detuned saw pad, sine bass, a triangle arpeggio through a dotted-8th delay, soft kick/rim/hats and a generated reverb, into a gentle compressor. `scheduleBar()` only schedules notes, so the same score renders in an `OfflineAudioContext` for previews (peak about −2 dBFS before the master volume).

The player defaults to on at 18% volume. Browsers block audio until a user gesture, so it starts on the first click or key press anywhere on the page. The ♪ button on the stage toggles it; the track buttons (which also switch music on) and the volume slider sit under Music. All three are saved in `localStorage` (`ak-customiser-music`) and the page works without it. Audio pauses while the tab is hidden.
