# AK-15 weapon customiser — roadmap

Built step by step. Each step ships as a working page at `/3d/ak15-weapon-customiser/`.

## Step 1 — Base viewer ✅ (this commit)
- Viewer adapted from the Louisiana XXL page: Three.js 0.160.0, OrbitControls, the shared loader and the same sidebar layout.
- Loads the Sketchfab model from `model/` (`ak-15.glb` or an unzipped `scene.gltf`). Until that file is added, it shows a code-built low-poly stand-in (`stand-in.js`).
- Any source model is auto-normalised: its long axis is laid along +x, the muzzle is found as the slimmer end, and it is scaled to the real 940 mm overall length.
- Camera presets (3/4, left, right, top, muzzle), turntable, wireframe, keyboard orbit/zoom.
- Click-to-inspect parts (named nodes from the GLB, or stand-in parts).
- Mount points preview: muzzle, optic rail, under rail, mag well, grip, stock (stand-in only for now).

## Step 1b — Swap in the Sketchfab model ⏳ blocked on the file
- Download "Low Poly AK-15" from Sketchfab (needs a Sketchfab login). Commit it to `model/`. The build container cannot reach sketchfab.com.
- Record the licence and author credit in README and on the page (CC BY requires credit).
- Check the part names it exposes. If the author used one merged mesh, split the swappable parts (muzzle, mag, grip, stock) in Blender.

## Step 2 — Attachment system
- Calibrate mount points on the real model (a `sockets.json` per model: position, direction, rail length).
- Attachment registry (`attachments.js`): id, slot, label, geometry/GLB, offset, what it hides (e.g. a muzzle device replaces the stock brake).
- Sidebar slot pickers: a "stock / none / option" list per slot. Swaps are instant; the camera frames the changed slot.
- Rail slots snap along the 10 mm slot pitch (drag or ± buttons).

## Step 3 — First attachment set (low-poly, code-built or CC0)
- Muzzle: stock brake, compensator, suppressor.
- Optic: red dot, holographic, 4× scope.
- Under rail: vertical grip, angled grip.
- Magazine: 30-round, 60-round quad, drum.
- Stock: extended, collapsed, folded.

## Step 4 — Finish and share
- Colourways per part (black / plum / FDE / OD).
- Stats panel (length, illustrative weight) that updates with the build.
- Build codes in the URL hash so builds can be shared; reset button.
- Optional GLB export of the current build.

## Step 5 — Polish
- Swap animations, part hover outline, studio HDRI, mobile bottom-sheet pickers.
