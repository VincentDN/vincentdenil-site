# WW2044: Total War, strategic map slice

Static, buildless three.js page (open `index.html` from any static server). Source: vdn-ww2044 `projects/total-war/strategic-map/` (this folder is a copy; edit there first).

- Scenario: Poland, 1 January 1936, with the real interwar borders ("Poland Is Not Yet Lost!": 2039 technology against Germany and the USSR).
- `js/world.js`: nations, projection (`lonlat`), and the loader for the baked map (`data/poland1936.webp`: height and province per cell; `data/poland1936.json`: provinces and rivers). It derives the coast and border distance fields at load.
- `tools/bake-poland1936.cjs`: offline bake (Node + pngjs; then convert the PNG to lossless WebP). Inputs: Natural Earth 10m GeoJSON (public domain) and Terrain Tiles z6 terrarium PNGs (AWS open data). Today's borders give the coasts and unchanged frontiers; the 1936 frontiers that moved (Danzig, the Corridor, East Prussia, the Wilno line, the Riga line) are hand-digitised in the script and approximate. Province seats are real towns (Polish names for interwar Poland, period names elsewhere). Not part of the site copy.
- `js/map.js`: the painted map shader (seas, shallows, contour lines, wave strokes, nation fills, borders, trees, relief) and the table.
- `js/overlay.js`: canvas overlay (Natural Earth rivers, Baltic shipping `LANES`, town and nation names).
- `js/units.js`: armies (`UNITS`) as 3D models on the terrain, typed strength plates, selection ring, move orders.
- `models/`: slimmed WW2044 gallery models (Sherman M4 v1, Sd.Kfz. 251, Fallschirmjäger v3), simplified and quantised with gltf-transform, 256 px WebP base colour only.
- `js/audio.js`: placeholder YouTube soundtrack (Field radio panel) and the PARTISAN campaign map soundscape (`audio/`, CC0 Freesound files copied from partisan-project `assets/audio`, authors in the Credits dialog).
- `js/main.js`: camera, input, clock, interface.
- `img/`: unit and portrait renders from the WW2044 model gallery (Sherman M4 v2, Sd.Kfz. 251, Fallschirmjäger v3); `icons.svg` from game-icons.net (CC BY 3.0, credited in the page's Credits dialog).
- `vendor/`: three.js r169 and its GLTFLoader (MIT, `vendor/three-LICENSE.txt`).
- Look: war-room telegram UI (Special Elite, Oswald, IBM Plex Mono) and a projector overlay (`#projector`: light falloff, grain, flicker, scan lines).

The reference screenshot that inspired the layout is not used or shipped here; all art is original or credited.

Release: the site's CDN caches .js and .css for 4 hours, so bump `?v=` in `index.html` (stylesheet, module script and every `./js/*.js` entry in the import map) on each deploy. The HTML itself is revalidated on every visit.
