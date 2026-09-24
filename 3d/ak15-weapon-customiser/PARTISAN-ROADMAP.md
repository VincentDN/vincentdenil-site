# Partisan: interactive customisation demo, roadmap

Status: in progress. Done so far: A-lite (stats and rules), the Operator creator and the Field poses with IK, photo mode and loadout codes. See §5. This turns the AK weapon customiser (`/3d/ak15-weapon-customiser/`) into an interactive demo for the Partisan project that shows deep weapon and character customisation.

Neither repository documents Partisan itself yet. The roadmap therefore assumes a character-driven game, since it asks for character customisation. It also assumes a low-poly art direction, which the current models and page share. The assumptions to confirm are listed at the end. Anything that depends on them is marked **(assumption)**.

---

## 1. What the demo should prove

A visitor should leave believing three things:

1. **Weapons are deep.** Parts have real consequences: they change handling stats, the silhouette and sound, and some parts rule others out.
2. **Characters are personal.** Body, face, clothing, gear and faction markings combine into someone who looks like *theirs*.
3. **The two belong together.** The character holds the weapon properly, the loadout reads as one person, and they can see both in motion, not only on a turntable.

Everything else is polish. When scope gets cut, protect those three.

## 2. What exists today, and what carries over

| Already built | Keeps working as |
|---|---|
| Slot and mount-point system (`attachments.js`, `models.js`) with factory and library options, poses and rails | The core of weapon customisation; it extends with rules, stats and more slots |
| Two rifles switched in place, sharing one frame and scale | The pattern for a weapon *roster* |
| Finish targets (per-part colours, suppressor palette) | The basis for materials, camo and wear |
| HDR lighting that follows the camera, hero framing, snappy slot cameras | Presentation for both the weapon and the character screens |
| Build codes in the URL hash; share link; reset to launch defaults | Loadout codes covering weapon *and* character |
| Music player (Abdulena and a synthesised loop), autoplay at 40% | The demo's audio bed; it grows into UI and weapon sound |
| Static site, no build step, Three.js from a CDN | Fine for phases A–B; phase C likely needs a bundler (see §6) |

The honest gap is that there is no character yet: no rigged model, no animation, no customisation system for bodies or clothes.

## 3. Demo shape

A single page with three screens and a mode switch, not three separate pages:

```
[ ARMOURY ] ──── [ OPERATOR ] ──── [ FIELD ]
 weapon build     character build    see them together
 (today's page)   (new)              (pose, photo mode, short range)
```

- **Armoury:** today's customiser, deepened (§4 phase A).
- **Operator:** character creator with body, face, clothing layers, gear and markings (phase B).
- **Field:** the character holding the built weapon. Includes a pose library, a photo mode with a shareable image, and optionally a small shooting range that shows off the stat differences (phases C–D).

The loadout (weapon plus character) sits in one state object and one share code, and it survives moving between screens.

## 4. Phases

Effort is in focused working days for one developer with AI help. Treat it as a rough guide; art sourcing is the biggest swing factor.

### Phase A: deep weapons (4–6 days)

Goal: the Armoury feels like a game system, not a colour picker.

- **Stats model.** Every option carries modifiers: ergonomics, recoil (vertical/horizontal), weight, length, sound signature, ADS speed, handling. A stat panel shows before/after deltas when you hover an option. Values are illustrative and consistent, not claimed as real data.
- **Compatibility rules.** Declarative rules in the registry: `requires`, `excludes` and `replaces`. For example, the drum excludes the prone-friendly short stock, the scope requires rail length N, and the suppressor excludes the comp. Blocked options stay visible, with the reason shown.
- **More slots.** Side rail (light, laser), sling mount, charging handle, trigger and the dust-cover rail as its own slot. The rail system becomes general: any rail has a length and a slot pitch, and attachments declare their footprint so two parts can't overlap.
- **Weapon roster.** Add 2–3 more platforms beyond the AK-74M and AK-15K (for example a PKM-style LMG, an SVD-style DMR or a pistol) for variety. Each is a `models.js` entry; the D_U low-poly library is the first place to look for a matching style.
- **Materials.** Camo patterns (tri-planar or UV-projected low-poly camo), wear/edge-scuff levels and per-part finishes on metal too (Cerakote-style).
- **Presets.** Curated builds ("Scout", "Breacher", "Marksman") as one-click starting points; they double as onboarding.
- **Sound.** Per-muzzle-device shot sounds (dry-fire click, suppressed thump) for a "test fire" button. Short, licensed or original samples.

Exit criteria: three weapons, rules that visibly bite, stat deltas on hover, presets, test-fire sound.

### Phase B: character customisation (6–10 days, art-dependent)

Goal: a character creator on par with a small game's, in the same low-poly style.

- **Base body.** One rigged low-poly humanoid (male and female bases, or a single adjustable base) with morph targets for build, height and face shape. Candidates: CC0 kits (Quaternius, Kenney) or a commissioned base **(assumption: no existing Partisan character art)**. It must be rigged to a standard skeleton, so animations are shared.
- **Layered outfit system.** Slots for head, face, torso, legs, feet, hands, vest, backpack and patches. Layers cull hidden body parts to avoid clipping. This reuses the slot/option architecture from `attachments.js`, but targets bones instead of mount points.
- **Faction/insignia layer.** Patches, armbands and colour identity **(assumption: Partisan has factions or resistance cells; this is where its identity shows)**. It builds on the existing flag/patch work on this site (the German Empire patch preview has the patch pipeline).
- **Colour and materials.** Palette-driven fabric colours, camo on clothing using the same camo system as weapons, and dirt/wear levels.
- **Camera.** Snappy per-slot framing, with the face close-up and gear three-quarter, reusing today's `frame()` pattern.

Exit criteria: two bases, around eight outfit slots with 3–5 options each, face/body sliders, insignia, no visible clipping in the default poses.

### Phase C: weapon on character (5–8 days)

Goal: the weapon sits in the character's hands convincingly.

- **Grip sockets.** Every weapon declares hand targets (pistol grip, support hand on handguard or foregrip, cheek weld on the stock). The foregrip slot moves the support-hand target, and a folded stock changes the stance. This is where deep customisation becomes *visible*.
- **IK.** Two-bone IK for the arms onto those targets; the weapon is parented to the right-hand bone with an offset. Three.js has CCDIK; a small custom two-bone solver is more stable.
- **Poses and animation.** Idle, ready, aim, low-ready, reload (magazine swap uses the chosen magazine) and inspect. Retargeted clips on the shared skeleton (Mixamo-style or CC0 motion packs).
- **Load/weight feedback.** The stat model feeds posture: a heavy build sags in low-ready, and the drum slows the reload.

Exit criteria: every weapon/foregrip/stock combination holds without hand clipping; five poses play smoothly.

### Phase D: Field and sharing (4–6 days)

Goal: a payoff moment and something to share.

- **Photo mode.** Pose picker, lighting environment and rotation (existing), depth-of-field, backdrop, and a PNG export with a subtle Partisan watermark. This is the single best marketing feature.
- **Loadout card.** Auto-generated image or card showing the operator, the weapon, key stats and the share code.
- **Mini range (optional).** A short first/third-person range with 5 targets, a timer and recoil driven by the stat model. Proves that customisation *matters*. Keep it to a single scene.
- **Share codes v2.** Versioned, compact (base64url), covering weapon and character; old AK hashes keep resolving.

Exit criteria: photo mode exporting images, loadout card, share codes round-trip, the range if time allows.

### Phase E: production polish (3–5 days)

- **Performance.** Draco/meshopt compression, texture atlases, lazy-loading weapons and outfits, LOD for the range, a mobile budget (target 60 fps mid-range phone in Armoury/Operator, 30 fps in Field).
- **Onboarding.** A 20-second guided first run (pick a preset, change one part, see the stat change, go to Operator).
- **Audio.** Soundtrack switching by screen, UI sounds and the existing volume/mute controls.
- **Accessibility.** Keyboard access for every picker (already true for chips), reduced-motion mode (skip camera glides and swap animations), colour-blind-safe stat deltas, captions for any voice lines.
- **Analytics (optional).** Which parts people pick, as signal for game design. Privacy-light, opt-in.

## 5. Suggested milestone order

1. ✅ **A-lite (2 days):** stats and deltas plus compatibility rules on the existing two rifles. This is the cheapest proof of "depth" and is demo-able immediately. *Done: `stats.js`.*
2. ✅ **B-spike (2 days):** one rigged character in the scene holding the AK (crude IK). This de-risks phase C before investing in outfits. *Done, and went further: an original procedural low-poly operator (`operator.js`) with a full creator, and five IK poses (`field.js`), with no external character assets or licences.*
3. **Rest of A**, then **B**, then **C**, then **D**, then **E**.

The spike order matters. Weapon-on-character (C) is the riskiest technical piece, and character art (B) is the riskiest content piece. Touching both early avoids a late surprise.

## 6. Architecture changes

- **State.** One `loadout` object (`{weapon:{rifle, build, finish, rails}, operator:{base, morphs, outfit, colours, insignia}}`) with an event bus. The screens are views onto it. Today's `rifle.build`/`rifle.finish` fold into this.
- **Registries.** `attachments.js` generalises into typed registries (weapon parts, outfit items, insignia). They share option semantics: `original`, `build`, `pose`, `requires`/`excludes`, `stats`, `finishes`.
- **Tooling.** Stay no-build through phase B if possible; adopt Vite at phase C (skinned meshes, animation clips and compression decoders get unwieldy from a CDN). Keep the page's URL.
- **Assets.** A `model-source/` script per asset (as now) for stripping, renaming nodes and compressing, so every shipped file can be regenerated from its source download.
- **Tests.** A headless Chromium smoke test (as used during development). It loads every screen, applies every option and checks for console errors and that the stats/length change. Run it before each push.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Art style mismatch between weapons (D_U low-poly) and characters | Pick the character kit first and judge it next to the rifles; restyle materials to one palette |
| Licences: CC BY models need visible credit; music rights (Abdulena) unverified | Credits panel listing every asset and licence; confirm music rights before any public push |
| Weapon realism vs sensitivity of the subject | Keep the stats illustrative, avoid real-world performance claims, and frame the demo around the game fiction |
| IK clipping across many weapon/grip combinations | Per-weapon hand targets authored and tested with the smoke test; fall back to a fixed pose per weapon |
| Mobile performance with character plus weapon | Compression, LOD, capped pixel ratio, simpler shadows on mobile |
| Scope creep (the range becoming a game) | The range is optional and single-scene; protect the three goals in §1 |

## 8. Decisions needed

1. **What is Partisan?** Setting, era and tone (historical WWII partisans, a modern resistance, a fictional Balkan setting?). This decides the weapon roster, clothing and insignia, and whether modern AKs fit at all.
2. **Existing art?** Are there Partisan characters, logos or style guides to follow, or does the demo set the style?
3. **Audience:** investors or publishers (polish the Field/photo mode), players (presets and sharing), or the team (tooling and registries)?
4. **Platform:** desktop-first or mobile-first?
5. **Budget for assets:** CC0/CC BY only, or can we buy or commission character art?
6. **Where it lives:** keep it under `/3d/` as a link-only, noindex prototype, or give it its own public page and domain?

Answering 1 and 5 unblocks phase B; the rest can wait until phase D.
