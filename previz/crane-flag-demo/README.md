# WeaverShell — crane flag demo

Route: `/previz/crane-flag-demo/`. Linked from `/projects/previz/`, with `noindex` and `seo_hidden=true`. Serve the repository root over HTTP; no build step. Based on the Louisiana XXL viewer's sidebar, measurement interaction, meter-based geometry, units helper, FMP branding and Three.js 0.160.0 / OrbitControls setup.

## Scale assumptions

The supplied photo informs the large horizontal tricolour, tower-crane silhouette and two upper attachment points. It has no known measured reference; these are plausible visualization dimensions, not surveyed dimensions or a lift plan.

| Element | Assumed size |
| --- | --- |
| Finished flag | 12 × 8 m (96 m²) |
| Upper corners | 38 m above grade, 12 m apart |
| Nominal free lower edge | 30 m above grade |
| Jib elevation | approximately 40 m |
| Highest lattice | approximately 42.4 m |
| Forward jib reach | approximately 40.8 m from mast |
| Counter-jib reach | approximately 12.4 m |
| Human reference | 1.78 m |
| Shipping containers | 6.06 × 2.44 × 2.59 m |

Flag width is approximately 29% of forward jib reach, with a 3:2 Dutch tricolour. Single-layer, double-sided rendering means the reverse is the back of the same artwork. Wind animation is a visual deformation, not a cloth or wind-load simulation. The upper corners are fixed; sag and free-edge movement change the projected envelope slightly. The two seam lines suggest reinforced hems; they are not manufacturing specifications. Attachment hardware is illustrative and exaggerated for visibility.

## Open model and provenance

**Crane-On-Ground** from **3D House Construction Site (LowPoly, CC0)**, by **Majadroid / Maik Hoffmann**, published 9 February 2021; retrieved 28 September 2026.

- Source and license declaration: https://opengameart.org/content/3d-house-construction-site-lowpoly-cc0
- Original archive: https://opengameart.org/sites/default/files/lowpoly-house-construction-site-by-majadroid_2.zip
- License: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/
- Original editable FBX: `model-source/Crane-On-Ground.fbx`.
- Original author's license notice: `model-source/SOURCE-LICENSE.txt`.
- Browser asset: `models/crane.glb`; 1,350 vertices before glTF export splitting.

Adaptations: aligned jib to the X axis, rescaled the mast and reach to the scene dimensions, removed the hanging cable/load, replaced the source palette with neutral ochre steel and concrete materials, and exported GLB. New suspension hardware, flag and surroundings are generated in `viewer.js`. The supplied reference photograph is not redistributed.

To regenerate with Blender 4.4:

```sh
blender --background --python model-source/export-crane.py
```

## Interaction and validation

Crane, Flag, Front and Mount detail camera presets; mouse/touch orbit and zoom; keyboard arrows and +/− on the focused scene; metric/imperial display; selectable dimensions; measurement and human visibility; wind pause and breeze strength. Reduced-motion preferences disable wind by default. All measurement values remain available in the sidebar when projected labels overlap or leave the viewport.

Checked in headless Microsoft Edge with WebGL: GLB loading, all camera buttons, imperial conversion, dimension selection, visibility and motion buttons, 390 px mobile layout, and navigation from the PREVIZ index. Desktop, flag close-up, mount close-up and mobile screenshots were visually reviewed. Three.js modules use the same pinned jsDelivr dependency as the base viewer and require network access; the crane is served locally.

The viewer follows the previz no-outward-links convention: no site navigation or clickable credits. Attribution remains plain text; source URLs are retained here for provenance. This is a separate demo-shell clone; the original viewer remains at `/previz/crane-mounted-flag-xxl/`.

See ROADMAP.md for the phased WeaverShell feature. Part 1 adds the placeholder and device-local presenter video. Part 2 captures and exports interactions in `?author=1` mode. Synchronized playback and webcam capture remain Parts 3 and 4.
