# Workbench intro (AK customiser experiment)

URL: `/3d/ak15-workbench-intro/`. An opening screen for the AK customiser in the style of the workbench in The Last of Us Part II: an over-the-shoulder shot of the operator leaning over a bench, the rifle lying flat on its side under a work lamp, both hands resting on it. **Start customising** (or E / Enter / gamepad A) pushes the camera in on the rifle, fades to black and hands over to the normal 3D viewer at `/3d/ak15-weapon-customiser/`. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; no build step.

- Reuses the customiser's modules directly: `models.js` (the AK-74M Zenitco GLB and its scale), `operator.js` (the procedural operator, default look without headgear or gloves) and `field.js` (`solveArm`, two-bone IK that puts the palms on the grip and handguard). Nothing is copied except the small `normalize` helper, which `viewer.js` doesn't export.
- Bench, room and props (screwdriver, file, rag, ammo tin, power strip with a lit switch, lamp) are original low-poly geometry; the wood grain is a generated canvas texture. Lighting is one warm shadow-casting spot (the lamp), a cold fill and the customiser's `studio.hdr` at low intensity for the metal.
- Mouse, touch or a gamepad's left stick looks around a little (camera parallax, head turn) and nudges the rifle under the hands; the arms re-solve every frame. Idle breathing and camera sway are off under `prefers-reduced-motion`, which also shortens the push-in to the fade.
- The push-in runs on wall-clock time (1.9 s, fade from 75 %) so slow devices still hand over on schedule. Coming back with the browser's Back button resets the shot.
- `moodboard/tlou2-workbench-reference.webp`: the reference frame (The Last of Us Part II workbench, © Sony Interactive Entertainment / Naughty Dog), kept for mood only and not used on the page.

The full plan for where this goes (holding and tilting the rifle, setting it down, modding at the bench) is `extras/tlouii-style-modding-roadmap.md` in the vdn-roadmap repo.
