# AK-74M weapon customiser — roadmap

Built step by step. Each step ships as a working page at `/3d/ak15-weapon-customiser/`.

## Step 1 — Base viewer ✅
- Viewer adapted from the Louisiana XXL page: Three.js 0.160.0, OrbitControls, the shared loader and the same sidebar layout.
- Camera presets (3/4, left, right, top, muzzle), turntable, wireframe, keyboard orbit/zoom.
- Click-to-inspect parts; mount points preview (muzzle, optic rail, under rail, mag well, grip, stock).

## Step 1b — Real model ✅
- Sketchfab "low-poly AK-74M Zenitco" by D_U (CC BY 4.0) replaces the code-built stand-in. The AK-15 link wasn't downloadable from the container.
- Loose rounds and spare magazine removed; parts grouped and named (Zenitco B-13, B-10/B-19, RK-1, RK-9, PT-1, DTK-1); mount points placed on the real geometry.

## Step 2 — Rotatable HDR lighting ✅
- Image-based lighting from HDR environments: an original generated studio (four softboxes, `model-source/generate-studio-hdr.py`) and Poly Haven "Quarry 01" (CC0) outdoors.
- Light rotation slider, plus shift-drag on the model. The HDR environment and the shadow-casting key light turn together; the key is aimed at each HDR's brightest point automatically.
- Optional blurred HDR backdrop. The page moves to Three.js 0.169.0 for `scene.environmentRotation`.

## Step 3 — Attachment system
- Fine-tune mount points and add rail lengths (B-13 top rail, handguard rails).
- Attachment registry (`attachments.js`): id, slot, label, geometry/GLB, offset, what it hides (e.g. a muzzle device replaces the stock brake).
- Sidebar slot pickers: a "stock / none / option" list per slot. Swaps are instant; the camera frames the changed slot.
- Rail slots snap along the 10 mm slot pitch (drag or ± buttons).

## Step 4 — First attachment set (low-poly, code-built or CC0)
- Muzzle: stock brake, compensator, suppressor.
- Optic: red dot, holographic, 4× scope.
- Under rail: vertical grip, angled grip.
- Magazine: 30-round, 60-round quad, drum.
- Stock: extended, collapsed, folded.

## Step 5 — Finish and share
- Colourways per part (black / plum / FDE / OD).
- Stats panel (length, illustrative weight) that updates with the build.
- Build codes in the URL hash so builds can be shared; reset button.
- Optional GLB export of the current build.

## Step 6 — Polish
- Swap animations, part hover outline, more HDR environments, mobile bottom-sheet pickers.
