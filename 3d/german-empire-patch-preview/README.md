# German Empire PVC patch preview

Static preview at `/3d/german-empire-patch-preview/`, adapted from this repository's `/projects/3d/viewer/` (Three.js 0.160.0 and OrbitControls).

`patch.glb` contains actual extruded vector geometry in meters: 127 × 75 mm overall. The supplied SVG determines the artwork. The reference specifies a 2.2 mm frame, 1.5 mm sewing channel and 1 mm separation between main panels. Fine emblem details retain the source spacing. The SVG is fitted to the inner artwork area; its aspect ratio differs slightly from the supplied physical dimensions.

Depth is illustrative, not a supplied manufacturing specification: 2 mm backing, 0.8 mm panel relief, 0.85 mm medallion relief, 0.35 mm eagle relief and 0.15 mm shield relief plus 0.45 mm Velcro-style backing (approximately 3.8 mm total maximum). The rear has a fabric carrier and staggered curved hook fibers, included in the downloadable GLB. Backing, stitch spacing and corner radii are illustrative. This is a visual prototype, not a mold-ready CAD solid.

The page supports drag/pinch/scroll, keyboard rotation and zoom, camera presets, auto-rotation, and focus/hover/tap measurement explanations. Measurements remain in the sidebar when WebGL is unavailable. GLB download is independent of the viewer.

To rebuild the asset with Node.js, run `pnpm install --frozen-lockfile` in `model-source`, then `node build-model.mjs`. The generator removes Illustrator guide paths, resolves SVG painter-order overlaps with polygon boolean operations, and creates extruded panels with real separating grooves. The static site has no build step; serve the repository root using any static HTTP server.
