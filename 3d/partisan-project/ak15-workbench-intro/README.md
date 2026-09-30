# Workbench intro (AK customiser experiment)

URL: `/3d/partisan-project/ak15-workbench-intro/`. Serve the repository root over HTTP; no build step. **Work on this rifle** (E, focused Enter, or gamepad A) now opens a persistent bench panel. Lift/set down the rifle, select parts, and use Skip or Cancel during changes. **Open full customiser** retains the build and opens the existing viewer inside the shell. Its Back link returns to the bench with the build preserved. Both AK-74M and AK-15K are supported by the prototype. Listed under `/3d/partisan-project/` and `/projects/3d/`, with `seo_hidden=true` and robots `noindex`.

Implementation checkpoint: 29 September 2026, rebased by fast-forward onto main **87567c3**. This is a working animation prototype; the complete roadmap's visual, audio and device acceptance gates are not yet all met.

- Shared `rifle-instance.js` owns loading, normalization and slot geometry. Shared `rifle-finishes.js` applies flat finishes, projected camo and wear in both presentations. `loadout.js` validates and serializes bench builds, retaining other hash settings. The full viewer retains its existing UI adapters.
- `bench-session.js` coordinates the panel, models, contact targets and transactional part changes. `bench-actions.js` supplies a wall-clock timeline with one commit, precommit rollback, postcommit preservation, Skip and cancellation. Hidden documents/page exits stop the current action and voices.
- `bench-motion.js` stages slot-family clearance and table-transfer paths. Presentation clones share resources and are removed at cleanup; permanent rifle geometry changes only at commit. Table resting height follows visible geometry. In-place stock/rail actions do not create loose duplicate parts.
- `bench-hands.js` adds articulated fingers and thumb opposition to the bench rig. Palm-space wrist solving keeps orientation independent of forearm rotation. Contact profiles are still coarse: visual review across attachment extremes remains necessary.
- `bench-audio-cues.js` schedules short sample/synth voices at action markers, skips obsolete transients after slow frames, and stops voices on cancellation/mute. Handling has separate controls; actions temporarily duck the persistent music. Existing sample provenance is still under audit; no new third-party audio was added.
- Bench, room and props (screwdriver, file, rag, ammo tin, power strip with a lit switch, lamp) are original low-poly geometry; the wood grain is a generated canvas texture. Lighting is one warm shadow-casting spot (the lamp), a cold fill and the customiser's `studio.hdr` at low intensity for the metal.
- Mouse, touch or a gamepad's left stick looks around a little (camera parallax, head turn) and nudges the rifle under the hands; the arms re-solve every frame. Idle breathing and camera sway are off under `prefers-reduced-motion`; part changes skip directly to their committed result. Quick changes shorten ordinary action timelines.
- Bench atmosphere (roadmap phase 1b): an old valve radio at the back of the bench (lit dial with a flickering glow) and the green Altis FIA flag lying across the table under the rifle and hanging off the near edge. The flag is a grid bent over the table edge on the CPU each frame, with cloth folds and a slow sway (sway off under reduced motion). `fia-flag.png` was supplied by the site owner; the FIA is a faction from Bohemia Interactive's Arma 3.
- Sound (`bench-audio.js`): the music plays out of the radio. `music.js`'s master gain is routed (its `route` option) through a small-speaker chain: high-pass 320 Hz, low-pass 3.4 kHz, a presence peak and light tanh drive, panned to the radio's position on screen. On first start the radio tunes in: static and a gliding heterodyne whistle, a snatch of another station's voice, then the song fades in. A crackle bed runs under it. Behind it is a synthesised camp: four muttering voices (sawtooth sources through two formant band-passes that jump between vowels, in phrases of 3–14 syllables with pauses), a campfire loop with pops, gusting wind and the odd distant metal clank, all low-passed and reverberant so it reads as outside and far away, never as words. Nothing is downloaded for the effects.
- Song: "The Duce Puts On His Uniform" (Βάζει ο Ντούτσε τη στολή του), a Greek war song from 1940, is the default track on every Partisan page. It lives with the customiser's tracks (`ak15-weapon-customiser/audio/duce-uniform.mp3`, see that README).
- The ♪ button switches the music and camp atmosphere on or off. Handling sounds have a separate checkbox and level slider in the bench panel. On/off, volume and track are shared with the customiser (`ak-customiser-music-v3`). Sound starts on the first click or key press where the browser blocks autoplay.
- Continuous music: `index.html` is a thin shell page. It creates the Partisan sound layer (`../sound-layer.js`: the music player routed through `bench-audio.js`) and shows the scene, `bench.html`, in a full-screen frame. *Open full customiser* navigates only the frame to the customiser, which picks up the shell's layer through `window.parent`, so the music plays on without stopping or restarting. The layer crossfades from the radio mix to the clean track (the radio plays at 81% of the clean level, so the music swells as you go in to modify), and the camp fades out; Back returns to the radio. The shell's address follows the frame (`?view=customiser` plus the loadout hash) so reloads and copied links come back to the same screen, and links inside the frame open at the top level (`<base target="_top">`). `bench.html` and the customiser also work on their own, each with its own layer.
- Camera entry and action timelines use elapsed wall time. The initial shoulder shot transitions to a higher working view, with a side panel on desktop and bottom panel on narrow screens. Coarse-pointer targets have a 44 px minimum.
- `moodboard/tlou2-workbench-reference.webp`: the reference frame (The Last of Us Part II workbench, © Sony Interactive Entertainment / Naughty Dog), kept for mood only and not used on the page.

The full plan for where this goes (holding and tilting the rifle, setting it down, modding at the bench) is `extras/tlouii-style-modding-roadmap.md` in the vdn-roadmap repo.

## Animation implementation roadmap

The [illustrated workbench roadmap](../workbench-roadmap/) (28 September 2026, baseline a6545cc) covers the current shell and sound system, contact-driven animation, hand articulation, sample synchronization, phased implementation and acceptance tests. It includes six timestamped reference stills from the supplied TLOU II video. The roadmap now includes an implementation checkpoint separating working features from outstanding acceptance gates.


## Review and tests

Open `bench.html?review=1` for an animation checkpoint selector. Choose Reach, Release, On table, Seat or Recover before starting a change. The action pauses at the selected beat; Resume continues without counting paused time. Skip and Cancel remain available. The review-only palm target error readout helps find unreachable poses; it is not a mesh-intersection detector.

Run from the repository root:

```sh
node --test 3d/partisan-project/ak15-workbench-intro/bench-actions.test.mjs 3d/partisan-project/ak15-workbench-intro/bench-audio.test.mjs
```

Ten tests cover late frames, stale audio suppression, one-time commit, cancellation around commit, skip, loadout round-trip, transfer visibility/continuity and checkpoint resume. Browser checks cover both rifle loads, all seven slot families through Skip, precommit optic cancellation, and appearance/navigation continuity. Physical-device performance, sound auditioning and comprehensive contact quality remain outstanding. See the illustrated roadmap for the current acceptance matrix.

Development paused by request on 30 September 2026. Latest remote main changes through ff628f3 are integrated. The last muzzle-reach adjustment has automated coverage but still needs visual re-verification; mobile/device, continuous-motion and audio audition gates remain open.
