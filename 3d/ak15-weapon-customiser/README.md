# AK-74M weapon customiser

URL: `/3d/ak15-weapon-customiser/`. The URL keeps its original name; the model is an AK-74M. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; there is no build step. Uses Three.js 0.160.0 (OrbitControls, GLTFLoader) and the shared `/assets/viewer-loader.css`. The viewer structure is adapted from `/3d/lousiana-flag-mount-test-xxl/`.

Plan: see `ROADMAP.md`. Current status: step 1 (base viewer) on the real model.

## Model
`model/ak-74m-zenitco.glb` is [low-poly AK-74M Zenitco](https://sketchfab.com/3d-models/low-poly-ak-74m-zenitco-35ad8e37a513453cbbbd04064fa5fb79) by [D_U](https://sketchfab.com/DU1701), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The page shows this credit.

Change from the original: the loose cartridge (`54539_4`), spent case (`54539 case_5`) and spare empty magazine (`ak74 30rnd empty mag (polymer)_7`) displayed beside the rifle were removed, and unused data pruned (2.9 MB → 2.2 MB). The seated magazine is kept. `model-source/strip-loose-parts.mjs` reproduces this from the original download. Geometry and materials are otherwise unchanged.

`viewer.js` lays the long axis along +x and treats the slimmer end as the muzzle. It then scales the model to the AK-74M's published 943 mm overall length with the stock extended; with the Zenitco stock and DTK-1 this is approximate. `PARTS` groups source nodes into named, selectable parts. GLTFLoader sanitizes node names, so the lookup applies the same sanitizing. `SOCKETS` places the step 2 mount points in the source file's coordinates.
