# WW2044: Total War, strategic map slice

Static, buildless three.js page (open `index.html` from any static server). Source: vdn-ww2044 `projects/total-war/strategic-map/` (this folder is a copy; edit there first).

- `js/world.js`: placeholder world. The Yantis island heightfield and settlements are ported from PARTISAN `map/island.js`; seas, mainland nations and provinces are placeholders.
- `js/map.js`: the painted map shader (seas, shallows, contour lines, wave strokes, nation fills, borders, trees, relief) and the table.
- `js/overlay.js`: canvas overlay (rivers, trade routes `ROUTES`, settlement and nation names).
- `js/units.js`: armies (`UNITS`), badges, selection ring, move orders.
- `js/audio.js`: original music and ambience, synthesised with Web Audio (no audio files).
- `js/main.js`: camera, input, clock, interface.
- `img/`: unit and portrait renders from the WW2044 model gallery (Sherman M4 v2, Sd.Kfz. 251, Fallschirmjäger v3); `icons.svg` from game-icons.net (CC BY 3.0, credited in the page's Credits dialog).
- `vendor/three.module.min.js`: three.js r169 (MIT, `vendor/three-LICENSE.txt`).

The reference screenshot that inspired the layout is not used or shipped here; all art is original or credited.
