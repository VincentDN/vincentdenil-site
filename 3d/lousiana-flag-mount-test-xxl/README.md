# FMP Design Studio — Louisiana XXL wall mount study

URL: `/3d/lousiana-flag-mount-test-xxl/`. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; no build step. Uses Three.js 0.160.0 and OrbitControls.

The flag and FMP logo are supplied artwork. The room is modeled geometry. The armchair rotates 90 degrees counterclockwise as viewed from above.

All geometry uses meters. Finished flag: 3.048 × 1.8288 m (10 × 6 ft), including sleeves. Sleeve opening: 25.4 mm; outer diameter: 29.4 mm; illustrative rods: 21 mm diameter, 130 mm from the wall. Orange stitching: exaggerated 3 mm diameter. Material: 150dn polyester, single-layer double sided.

Room assumptions: 6.8 × 4.8 m footprint, 3.25 m ceiling, 2.8 m sofa. Flag bottom: 1.12 m; top: 2.9488 m. This is an illustrative preview, not an installation specification.

`vincent-silhouette.json` traces the supplied image, preserving separate upper/lower outlines and interior cutouts while removing the background. The flat, double-sided dark-grey figure is exactly 1.778 m (5 ft 10 in). Its marker tooltip and selected measurement show the requested French/denier/hoist-attachments joke.

Imperial opens by default. `units.js` converts display labels only: decimal feet with total inches, except the compact pole label `Ø1in Pole` (metric: `Ø25.4mm Pole`). Measurement selection highlights geometry and dimension lines.

The approval button only displays `unavailable in alpha!`. It does not download, submit, approve, forward or contact any service. The previous GLB export UI is removed.

Shared loading styles are in `/assets/viewer-loader.css`. The room and base viewer use a simple ring; the German Empire patch uses nested groove rings. Each inherits its project's `--accent` and respects reduced motion. Reference links are recorded in the stylesheet. Asset failure replaces the loader with the existing readable error message.

Updated construction: both pole sleeves use hollow teardrop profiles that converge into the fabric at a sewn neck, rather than separate cylindrical tubes. The flag body is a closed mesh with 0.6 mm center thickness and a 2.4 mm folded perimeter hem, 18 mm wide. These thicknesses are preview assumptions. Stitch positions follow the thickened surface; the finished 10 × 6 ft envelope is retained. Vincent's marker is anchored near his feet. Mount detail favors a side view of the sleeve cross-section.
