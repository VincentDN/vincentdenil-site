Workbench handling sounds for the Partisan customiser
====================================================================================


reels/reel-00-shortlist.mp3   Start here. The 42 strongest takes (6 per class); a quiet beep
                              marks each one. -index.csv gives the file at each reel time.
reels/reel-<class>.mp3        Every take in one class, loudest first, with an index.
cuts/<class>/*.wav            542 foley cuts (mono, 44.1 kHz, peaked to -3 dBFS, short fades),
                              named <weapon>-<source seconds>. cuts/ui-suspect/ holds 181 sounds
                              that match the game's UI sounds; kept, not deleted, in case a real
                              click got caught.
cuts/cue-sheet.csv            Every cut: class, chapter, source time, length, original level,
                              SNR, spectral centroid, low-end ratio, internal click count.

Classes are from acoustic features, not listening: click (short, bright), clunk (short, heavy
low end), ratchet (evenly spaced clicks: screws, threading), slide (sustained scrape), hit
(other short impacts), handle (quiet handling), long (longer mechanical actions: bolt cycles
come from the bolt-action chapter).

Chapters (source seconds): Bolt Action Rifle 0-131, Pump Shotgun 131-183, Bow 183-264,
Semi Auto Pistol 264-371, Revolver 371-478, Semi Auto Rifle 478-586 (AK-type: stock ~500,
magazine ~520, scope ~538, burst fire ~556), Double Barrel Shotgun 586-690, Crossbow 690-786,
Military Pistol 786-890, Hunting Pistol 890-1008. The first five chapters are the cleanest
(foley ~40 dB over the floor); the later ones have an ambient bed about 15 dB louder.

