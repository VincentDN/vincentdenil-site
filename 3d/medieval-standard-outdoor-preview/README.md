# Medieval standard: outdoor scale preview

URL: `/3d/medieval-standard-outdoor-preview/`. Listed in `/projects/3d/`, with `seo_hidden=true` and robots `noindex`. Serve the repository root over HTTP; no build step. Uses Three.js 0.160.0 and OrbitControls, same stack as `/3d/lousiana-flag-mount-test-xxl/`.

Scene: a medieval re-enactment camp (wedge tents, striped pavilion, fire pit) in blue distance fog that starts about 7 m from the camera, so the flag stays the focus with a finial pole carrying a 72 × 24 in (1.8288 × 0.6096 m) swallow-tail standard that tapers to 9 in across the tails (two 3.5 in tails, 2 in notch gap, 12 in notch depth). Three crenulated sleeve tabs (6 in tabs, 3 in gaps) wrap the pole; the top tab is open at the top for a finial pole. Vincent's flat silhouette (`vincent-silhouette.json`, copied from the Louisiana study) stands 1.778 m (5 ft 10 in) next to the pole for scale. All geometry is in meters; `units.js` converts display labels only.

Artwork: `flag.webp` is a placeholder. It takes a customer-supplied reference image (upscaled 4x) and squeezes it vertically, column by column, into the tapered shape, then masks it to the swallow-tail outline (50 px per inch, 3600 × 1200). The reference's own fringe is cut away and replaced with a drawn pure-gold fringe (1 in band, all edges except the hoist), matching the single-colour gold fringe of the real product. Replace `flag.webp` with the final design in the same 3:1 layout (alpha = flag outline) when the proof is approved.

Views: `#field` (default), `#flag`, `#front` open the matching camera. Wind toggles an animated ripple. Pole, finial and tents are illustrative scenery, not part of an order.
