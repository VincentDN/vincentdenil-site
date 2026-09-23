# Louisiana XXL wall mount study

Requested URL spelling: `/3d/lousiana-flag-mount-test-xxl/`. Linked from `/projects/3d/`; both pages use `seo_hidden=true` and robots `noindex`.

Uses the existing Three.js 0.160.0 / OrbitControls viewer system. Serve the repository root over HTTP; no build step. `room.js` generates the room, furniture, planar silhouette, fabric, orange stitches, hollow sleeves, rods and wall brackets. `flag.png` is the supplied artwork, fitted to the requested aspect ratio. The second reference informed the furniture and room palette; it is not used as a flat background.

All geometry uses meters. Finished flag envelope is 3.048 × 1.8288 m (10 × 6 ft), including sleeve outer extents. Sleeve opening diameter is 25.4 mm, outer diameter 29.4 mm; rods are 21 mm diameter. Rod axes are 130 mm from the wall. Sleeve material is shown as open cylinders with annular ends. Stitches are orange 3 mm diameter cylinders, intentionally exaggerated for inspection.

Room assumptions: 6.8 × 4.8 m footprint, 3.25 m ceiling, 2.8 m wide sectional, 5 ft 6 in (1.6764 m) woman silhouette. Flag bottom is 1.12 m above floor; top is 2.9488 m. Wall brackets and fabric drape are illustrative, not engineering or installation specifications.

Measurements are keyboard/touch selectable in the side panel and on-scene labels, and highlight relevant geometry. Camera presets include Room, Front and Mount detail. Measurements and human visibility can be toggled. GLB export includes the modeled room and flag artwork in meter units, without UI annotations or viewer lights.

The woman is a double-sided, zero-thickness dark-grey ShapeGeometry traced from the supplied black-on-white silhouette. woman-silhouette.json stores the outline and three interior cutouts in meters; the white background is discarded. Height is measured from shoe soles to the top of the head. The silhouette is fixed in the room, not a camera-facing billboard, and is included in GLB exports.
