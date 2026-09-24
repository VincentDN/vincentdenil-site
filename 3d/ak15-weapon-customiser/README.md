# AK-74M weapon customiser

URL: `/3d/ak15-weapon-customiser/`. The URL keeps its original name; the model is an AK-74M. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; there is no build step. Uses Three.js 0.169.0 (OrbitControls, GLTFLoader, RGBELoader; newer than the other 3D pages because environment rotation needs r162+) and the shared `/assets/viewer-loader.css`. The viewer structure is adapted from `/3d/lousiana-flag-mount-test-xxl/`.

Plan: see `ROADMAP.md`. Current status: step 2 (rotatable HDR lighting) done.

## Model
`model/ak-74m-zenitco.glb` is [low-poly AK-74M Zenitco](https://sketchfab.com/3d-models/low-poly-ak-74m-zenitco-35ad8e37a513453cbbbd04064fa5fb79) by [D_U](https://sketchfab.com/DU1701), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The page shows this credit.

Change from the original: the loose cartridge (`54539_4`), spent case (`54539 case_5`) and spare empty magazine (`ak74 30rnd empty mag (polymer)_7`) displayed beside the rifle were removed, and unused data pruned (2.9 MB → 2.2 MB). The seated magazine is kept. `model-source/strip-loose-parts.mjs` reproduces this from the original download. Geometry and materials are otherwise unchanged.

`viewer.js` lays the long axis along +x and treats the slimmer end as the muzzle. It then scales the model to the AK-74M's published 943 mm overall length with the stock extended; with the Zenitco stock and DTK-1 this is approximate. `PARTS` groups source nodes into named, selectable parts. GLTFLoader sanitizes node names, so the lookup applies the same sanitizing. `SOCKETS` places the step 2 mount points in the source file's coordinates.

## Lighting
Lighting is image-based: `scene.environment` is an HDR equirectangular map, rotated with `scene.environmentRotation` (and `backgroundRotation` when the backdrop is shown). A single directional light casts the floor shadow; it points at the HDR's brightest texel and turns with the environment, so the shadow always matches the reflections.

- `lighting/studio.hdr` is original: four soft-edged softboxes (key, rim, fill, overhead) on a dim gradient, 1024 × 512 RLE Radiance, 66 KB, peak ≈ 26. Regenerate with `python3 model-source/generate-studio-hdr.py` (NumPy).
- `lighting/quarry_01_1k.hdr` is [Quarry 01 from Poly Haven](https://polyhaven.com/a/quarry_01), CC0, copied unchanged from the three.js r160 examples.

Controls: Studio/Outdoor, the Light rotation slider, or shift-drag on the stage; Backdrop shows the blurred HDR behind the rifle.
