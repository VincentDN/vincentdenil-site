# WW2044: Total War, strategic map slice

Static, buildless three.js page (open `index.html` from any static server). Source: vdn-ww2044 `projects/total-war/strategic-map/` (this folder is a copy; edit there first).

- `js/world.js`: placeholder world. The Yantis island heightfield and settlements are ported from PARTISAN `map/island.js`; seas, mainland nations and provinces are placeholders.
- `js/map.js`: the painted map shader (seas, shallows, contour lines, wave strokes, nation fills, borders, trees, relief) and the table.
- `js/overlay.js`: canvas overlay (rivers, trade routes `ROUTES`, settlement and nation names).
- `js/units.js`: armies (`UNITS`) as 3D models on the terrain, typed strength plates, selection ring, move orders.
- `models/`: slimmed WW2044 gallery models (Sherman M4 v1, Sd.Kfz. 251, Fallschirmjäger v3), simplified and quantised with gltf-transform, 256 px WebP base colour only.
- `js/audio.js`: original synthesised music (Web Audio) and the PARTISAN campaign map soundscape (`audio/`, CC0 Freesound files copied from partisan-project `assets/audio`, authors in the Credits dialog).
- `js/main.js`: camera, input, clock, interface.
- `img/`: unit and portrait renders from the WW2044 model gallery (Sherman M4 v2, Sd.Kfz. 251, Fallschirmjäger v3); `icons.svg` from game-icons.net (CC BY 3.0, credited in the page's Credits dialog).
- `vendor/`: three.js r169 and its GLTFLoader (MIT, `vendor/three-LICENSE.txt`).
- Look: war-room telegram UI (Special Elite, Stardos Stencil, IBM Plex Mono) and a projector overlay (`#projector`: light falloff, grain, flicker, scan lines).

The reference screenshot that inspired the layout is not used or shipped here; all art is original or credited.
