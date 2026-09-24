# AK weapon customiser — roadmap

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

## Step 3 — Attachment system ✅
- `attachments.js` registry: slots on the six mount points, options that either pose the source part, replace it with built geometry, or leave the slot empty.
- Each slot's source nodes are regrouped under a container at its mount point, so swaps, poses and rail offsets act on one object; attachments stay clickable and highlightable as part of their slot.
- Build panel with a chip row per slot. The camera glides toward the changed slot.
- Optic (B-13 rail, −60 to +40 mm) and foregrip (lower handguard rail, −80 to 0 mm) move in 10 mm rail-slot steps.
- First options from the source model: DTK-1 on/off, red dot or irons, RK-1 on/off, magazine in/out, PT-1 extended / collapsed (butt forward 60 mm) / folded (to the left side).

## Step 4 — First attachment set ✅
Low-poly, code-built in `attachments.js` using the model's own materials. Illustrative shapes, not measured replicas.
- Muzzle: DTK-1, AK-74 brake, compensator, suppressor, bare.
- Optic: red dot, holographic, 4× scope, irons.
- Foregrip: RK-1, angled, hand stop, none.
- Magazine: 30-rnd, 45-rnd RPK and 60-rnd quad (warped copies of the source magazine), none.
- Pistol grip: RK-9, classic plum.
- Stock: extended, collapsed, folded, removed.

## Step 5 — Finish and share ✅
- Finish colours (Original / Plum / FDE / OD green) for the handguard, foregrip, pistol grip, stock and magazine. Only polymer and black-finish surfaces change; steel stays steel.
- Live stats: overall length measured from the visible geometry, and an illustrative empty weight from per-option masses.
- Build codes in the URL hash (e.g. `#muzzle=can&optic=scope@-20&stock-finish=fde`), a Copy build link button and Reset.
- Camera presets fit the current build's length.
- Deferred: GLB export of the current build (the source model is CC BY, so an export needs to carry the credit).

## Step 6 — Polish ✅
- Swap animations: new parts slide in along their mount direction; poses (stock fold/collapse) and rail steps glide. The PT-1 swings out through the left side as it folds.
- Hover lift on parts under the pointer, alongside the orange selection glow.
- Third HDR: Poly Haven "Venice Sunset" (CC0).
- Phones: the viewer stays pinned at the top while the pickers scroll underneath (a lighter take on a bottom sheet).

## Step 7 — Round two
- ✅ Launch build for both rifles: black receiver, FDE furniture and magazine, suppressor.
- ✅ Launch lighting from the reference render: Sunset HDR with the blurred backdrop, light offset 255°, hero camera just behind the right side. The lights follow the camera (environment, backdrop and shadow key turn with the camera's azimuth), so the look holds from every angle.
- ✅ Alt-drag turns the lights (shift-drag still works).
- ✅ Snappy per-slot camera angles when a Build option changes (0.45 s, ease-out quart).
- ✅ Drum magazine: 95 rounds, a feed tower into a 136 mm drum, recolourable with the magazine.
- ✅ Suppressor colours (Black, FDE, OD green, Tungsten grey, Burnt bronze), shown in Finish while the suppressor is fitted.
- ✅ Background music: an original ambient loop synthesised in Web Audio (`music.js`, no audio files), 18% default volume, ♪ toggle on the stage and a volume slider; starts on the first click, pauses in hidden tabs, choice remembered.
- ✅ "Abdulena" (supplied MP3) as the default music track, alongside the ambient loop; autoplays on open at 12% with a slow fade-in where the browser allows.
- ✅ AK-15K as a second rifle with an in-place switcher (`models.js`); builds carry across where both rifles accept the option. Library gains a micro red dot and a vertical foregrip for the AK-15K's bare rails.

## Ideas for later
- GLB export of the current build, carrying the CC BY credit.
- More attachments: drum magazine, side-folding stock variants, lasers/lights on the handguard side rails.
- Side-rail slots on the B-10/B-19 handguard.
