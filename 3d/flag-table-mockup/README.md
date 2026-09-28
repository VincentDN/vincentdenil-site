# Fringed flag table mockup

URL: `/3d/flag-table-mockup/`. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; no build step. Uses Three.js 0.160.0 and OrbitControls.

A rough concept mockup: a fringed ceremonial-style flag lying flat on a table, requested to show a grommeted hoist tape and gold bullion fringe running around all four sides. Everything is procedurally built in `preview.js` — there is no supplied artwork, GLB, or texture file. The flag field, hoist tape and table wood grain are drawn at runtime onto `<canvas>` elements and used as Three.js textures; the fringe is a single `InstancedMesh` of tapered cone strands (~290 instances) positioned and jittered per edge in code; the two grommets are a bronze torus plus a dark circle standing in for the punched hole.

All geometry is in meters. Flag body: 1.6 × 1.0 m overall (0.15 m hoist tape + 1.45 m field), 6 mm thick placeholder slab. Fringe strands: ~9 cm long, randomized ±15% in length/radius and ±20° in outward angle for a hand-tied look. Grommets: 14 mm ring radius, set at 32% in from the top and bottom of the hoist tape. These are illustrative guesses, not measurements from physical fringe or grommet hardware.

The center emblem (interlocking diamond, square and circle) is a simplified stand-in drawn with canvas stroke paths — it approximates the supplied reference image's motif without reproducing its exact interlacing/over-under weave.

The table is a large wood-toned plane with a canvas-generated grain texture, tiled. Lighting is a hemisphere fill plus one shadow-casting directional light so the flag reads as resting on the table. Camera presets: `Perspective` (default 3/4 product-shot angle) and `Top` (near-vertical, slightly forward-tilted to avoid the OrbitControls pole singularity). `Auto-rotate` toggles `OrbitControls.autoRotate`.

This is a rough visual concept, not a production spec: fringe density, grommet placement and fabric thickness are all placeholders pending real hardware references.
