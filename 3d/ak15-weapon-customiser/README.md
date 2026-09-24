# AK-74M weapon customiser

URL: `/3d/ak15-weapon-customiser/`. The URL keeps its original name; the model is an AK-74M. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; there is no build step. Uses Three.js 0.169.0 (OrbitControls, GLTFLoader, RGBELoader; newer than the other 3D pages because environment rotation needs r162+) and the shared `/assets/viewer-loader.css`. The viewer structure is adapted from `/3d/lousiana-flag-mount-test-xxl/`.

Plan: see `ROADMAP.md`. Current status: step 5 (finish and share) done.

## Model
`model/ak-74m-zenitco.glb` is [low-poly AK-74M Zenitco](https://sketchfab.com/3d-models/low-poly-ak-74m-zenitco-35ad8e37a513453cbbbd04064fa5fb79) by [D_U](https://sketchfab.com/DU1701), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The page shows this credit.

Change from the original: the loose cartridge (`54539_4`), spent case (`54539 case_5`) and spare empty magazine (`ak74 30rnd empty mag (polymer)_7`) displayed beside the rifle were removed, and unused data pruned (2.9 MB → 2.2 MB). The seated magazine is kept. `model-source/strip-loose-parts.mjs` reproduces this from the original download. Geometry and materials are otherwise unchanged.

`viewer.js` lays the long axis along +x and treats the slimmer end as the muzzle. It then scales the model to the AK-74M's published 943 mm overall length with the stock extended; with the Zenitco stock and DTK-1 this is approximate. `PARTS` groups source nodes into named, selectable parts. GLTFLoader sanitizes node names, so the lookup applies the same sanitizing. `SOCKETS` places the step 2 mount points in the source file's coordinates.

## Lighting
Lighting is image-based: `scene.environment` is an HDR equirectangular map, rotated with `scene.environmentRotation` (and `backgroundRotation` when the backdrop is shown). A single directional light casts the floor shadow; it points at the HDR's brightest texel and turns with the environment, so the shadow always matches the reflections.

- `lighting/studio.hdr` is original: four soft-edged softboxes (key, rim, fill, overhead) on a dim gradient, 1024 × 512 RLE Radiance, 66 KB, peak ≈ 26. Regenerate with `python3 model-source/generate-studio-hdr.py` (NumPy).
- `lighting/quarry_01_1k.hdr` is [Quarry 01 from Poly Haven](https://polyhaven.com/a/quarry_01), CC0, copied unchanged from the three.js r160 examples.

Controls: Studio/Outdoor, the Light rotation slider, or shift-drag on the stage; Backdrop shows the blurred HDR behind the rifle.

## Attachments
`attachments.js` lists slots and options. A slot shares its id with a mount point in `SOCKETS` and a part in `PARTS`. On load, `viewer.js` creates a container at each mount point and moves that part's source nodes into it, keeping their world transforms. Options then:

- `original: true` show the source part, optionally with a `pose` (a rotation and offset for the whole part, or per-node offsets in meters). The PT-1 collapsed and folded positions work this way. The fold hinges 35 mm left of the stock mount point.
- `build(ctx)` return new geometry in the slot's frame (meters, +x muzzle, origin at the mount point). It gets the source part (`ctx.original`) and the model's materials (`ctx.materials`).
- anything else leaves the slot empty.

Built attachments are illustrative low-poly shapes using the source materials (`h-190`, `stell`, `polymer`, `glass`, `red_emission`); the classic grip adds a plum polymer. The 45- and 60-round magazines copy the source magazine with its transforms baked into slot space, then warp vertices below the mag well (lengthened; the quad widens to about 1.85× from 20 mm below the well), keeping the source normals.

Slots with `rail` get a stepper that moves the container along x in 10 mm steps within the rail limits. Rail limits are fitted by eye to this model.

## Finish, stats and sharing
- `FINISHES` and `FINISH_PARTS` in `attachments.js` define the furniture colours. Recolouring touches only materials named `h-190` or `polymer` in that part (including its attachments); Original restores each material's source colour.
- Length is the x-extent of visible meshes, measured with the turntable angle zeroed. Weight is `BASE_GRAMS` plus each chosen option's `grams`; both masses are illustrative and exclude ammunition.
- The URL hash holds every non-default choice: `slot=option@offsetmm` and `part-finish=colour`. Loading a hash (or changing it) restores the build; Reset clears it. Copy build link uses the clipboard, falling back to a prompt.
