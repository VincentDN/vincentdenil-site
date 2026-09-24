# AK-15 weapon customiser

URL: `/3d/ak15-weapon-customiser/`. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; there is no build step. Uses Three.js 0.160.0 (OrbitControls, GLTFLoader) and the shared `/assets/viewer-loader.css`. The viewer structure is adapted from `/3d/lousiana-flag-mount-test-xxl/`.

Plan: see `ROADMAP.md`. Current status: step 1 (base viewer).

## Model
Source: [Low Poly AK-15 on Sketchfab](https://sketchfab.com/3d-models/low-poly-ak-15-k-68725380dd654391bb6b751e888e2c44). Download it while logged in, then put it in `model/` as `ak-15.glb`, or unzip the glTF download so that `model/scene.gltf` exists. Add the author's credit and licence here when committing it.

Until the file is added, `viewer.js` falls back to `stand-in.js`, a code-built low-poly rifle. It has named parts and mount points for step 2. It uses meters, points the muzzle along +x, and puts the right side at +z. It follows the published 940 mm overall and 415 mm barrel lengths; other proportions are illustrative.

Loaded models are normalised automatically. The long axis goes to +x, the slimmer end is treated as the muzzle, and the model is scaled to 940 mm. Each named node below the exporter's wrapper nodes becomes a selectable part.
