# WW2044: Total War, barracks slice

Unit customisation screen: pick a section, click a soldier, try on a kit (buy with war bonds), train him with merit to raise his level and veterancy. Static, buildless three.js page. Source: vdn-ww2044 `projects/total-war/barracks/` (this is a copy without `tools/`).

It shares two files with its sibling `../strategic-map/` instead of duplicating them: three.js r169 (`vendor/three.module.min.js`) and the game-icons.net sprite (`img/icons.svg`, CC BY 3.0).

- `js/main.js`: camera, selection, interface, placeholder roster and kits (all names and numbers are placeholders).
- `js/scene.js`: the ruined town square, all procedural (canvas textures, primitives, smoke sprites).
- `js/soldiers.js`: loader for the baked soldiers, plus the green recognition-tape shader patch.
- `data/`: the posed soldiers of Escape From Claudov (Riposte: Frontline engine, MIT, BenDBSS), nine kits at low ready holding the StG 44 (Partisan Project asset, cleared by Vincent for Claudov). Quantised geometry in `soldiers.bin`, layout in `soldiers.json`, kit atlases as WebP, shared roughness/metal/tape atlas as PNG (lossless, its red channel marks the tape).
- `tools/bake-claudov-soldiers.mjs`: re-bakes `data/` from an escape-from-claudov checkout (headless Chromium via its test harness):
  `EFC_REPO=/abs/path/escape-from-claudov node tools/bake-claudov-soldiers.mjs data assault:stg44,smg:stg44,sniper:stg44,nomad:stg44,tempest:stg44,verdant:stg44,raptor:stg44,void:stg44,gilet:stg44 0`

The reference screenshot that inspired the layout is not used or shipped here; the interface and text are original.
