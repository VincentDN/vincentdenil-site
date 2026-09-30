# Weapon roster & attachment content roadmap

Goal: grow the Armoury from two AK variants with code-built (illustrative, non-measured)
attachments into a roster built on real downloaded assets, without breaking the
CC0/CC BY-only licensing rule this project already follows (see `README.md`'s Models
section and `PARTISAN-ROADMAP.md` §7 Risks). Every source below was found with a handful
of web searches, not exhaustively vetted — **"license: verify" means confirm the exact
licence on the model's own page before download**, the same check already done for the
AK-74M and AK-15K.

Kept from the AK-74M/AK-15K precedent: strip loose/duplicate parts and compress with
meshopt (`model-source/strip-loose-parts.mjs`, `compress-models.mjs`) before shipping,
credit every asset in the Credits panel, and add a `models.js` entry (parts, sockets,
factory options) plus any new library options in `attachments.js`.

## Stage 1 — Real assets, no placeholders; add the G3A3

Today's muzzle devices, optics, foregrips, magazines, grips and stocks in
`attachments.js` are low-poly shapes built in code from the AK model's own materials
("illustrative shapes, not measured replicas" — `ROADMAP.md` Step 4). Stage 1 swaps as
many of these as practical for real downloaded models, and adds one new rifle.

| Item | Source | Licence | Notes |
|---|---|---|---|
| Generic attachment donor pack | [Low Poly Weapon Pack](https://opengameart.org/node/187893) by byzmod3d, OpenGameArt | **CC0**, confirmed | `.obj` pack; also the easiest source for Stage 2's M16 and Stage 3's STG44 bases (see below) — one download covers three roadmap items |
| Modular parts reference | [Low Poly Firearms](https://chilly-durango.itch.io/low-poly-firearms) by chilly-durango, itch.io | **CC0**, confirmed | AK/M4/AUG/SMGs with slides, mags, triggers as separate meshes — useful as a *second* geometry reference for building real optic/grip/stock shapes to replace the code-built ones, since it's already modelled part-by-part |
| Optics/suppressors/rails, none found as a ready CC0 pack | — | — | No free tactical-attachment pack surfaced in this pass (only paid ones: Superhive "25 Tactical Attachments", Gumroad "Tactical Gun Attachments"). **Open item**: either license-check a paid pack against this project's CC0/CC BY-only rule (likely a no), or keep building these low-poly in code but modelled closer to real references (measured, not illustrative) |
| G3A3 | [3DCADBrowser G3A3](https://www.3dcadbrowser.com/3d-model/g3a3) | **license: verify** — 3DCADBrowser models are usually royalty-free-for-use rather than CC0/CC BY, so check the exact terms before treating it like the Sketchfab downloads | No CC0/CC BY G3A3 surfaced on Sketchfab in this pass; if the licence doesn't clear, search Sketchfab directly for "G3" or "CETME" (same roller-delayed blowback family, visually close) as a substitute base |

Exit criteria: at least the magazine, one muzzle device and one optic are real downloaded
geometry instead of code-built primitives; G3A3 shipped as a third rifle in `models.js`.

## Stage 2 — Modernized RPK, modernized M16, Mk14 EBR, SIG Spear

| Item | Source | Licence | Notes |
|---|---|---|---|
| M16 (base for "modernized") | [Low Poly Weapon Pack](https://opengameart.org/node/187893) (`m16.obj`) — same CC0 pack as Stage 1 | **CC0**, confirmed | Also: [M16 A4](https://gintoki1234.itch.io/m16-a4) by Gintoki1234, itch.io, **CC BY 4.0** (needs credit) as a second, more detailed option |
| Modernized RPK | none found | — | No CC0/CC BY RPK surfaced. Best lead: check [D_U's Sketchfab catalog](https://sketchfab.com/DU1701) directly — the same creator as the current AK-74M and AK-15K (both CC BY 4.0), so an RPK from them would match the existing art style exactly. Otherwise, kitbash: the customiser already simulates an RPK-style 40-round magazine on the AK-15K; a full RPK could reuse the AK-74M/AK-15K receiver plus a longer barrel and bipod bashed in |
| Mk14 EBR | [Sketchfab: notcplkerry](https://sketchfab.com/notcplkerry) (animated Mk14 EBR) and [Sketchfab: samanthacford](https://sketchfab.com/samanthacford/models) (Low Poly MK14) | **license: verify** — neither model's licence was visible from search results; open each page and check before download | Two independent leads is a good sign something downloadable exists; whichever clears the CC0/CC BY bar wins |
| SIG Spear (MCX-SPEAR) | none free found | — | Only paid results: [Sig Sauer MCX Shrike](https://sketchfab.com/3d-models/sig-sauer-mcx-shrike-72b04e481e9c403cbb3b702176628ea6) (Sketchfab, premium, 79k tri — too dense anyway), [3DMilitaryAssets XM7 MCX Spear](https://3dmilitaryassets.com/products/sig-sauer-xm7-mcx-spear) ($30). The hardest item on the whole roadmap to source for free — likely needs a code-built placeholder (matching this project's existing Stage-1-style approach) until a CC0/CC BY upload appears, or a paid-asset decision from the project owner |

Exit criteria: RPK, M16, Mk14 EBR and SIG Spear each have a `models.js` entry; any slot
still without a cleared real asset stays clearly marked illustrative/placeholder rather
than silently shipped as if it were the real thing.

## Stage 3 — WW2 kitbashes into modern-looking variants

STG44 and PPSh-41 → M4 Custom, AK, "PPSh" builds; take the WW2 shape and re-skin/re-part
it with modern furniture (rail, red dot, foregrip) the way the AK attachments already work.

| Item | Source | Licence | Notes |
|---|---|---|---|
| Modernized STG (44) | [Low Poly Weapon Pack](https://opengameart.org/node/187893) (`stg44.obj`) — same CC0 pack as Stage 1 & 2 | **CC0**, confirmed | Third item out of the same single download |
| Modernized PPSh | [mini pack of weapons of the second world war](https://victorcstr.itch.io/mini-pack-of-weapons-of-the-second-world-war) by victorcstr, itch.io — includes a PPSh-41 with its drum/box mags and ammo | **license: verify** — not stated in search results, check the itch.io page | Also several paid PPSh-41 options on CGTrader/TurboSquid/Fab if this one doesn't clear |
| Modernized Bren | none found | — | No CC0/CC BY Bren surfaced. Leads to check by hand: [bigmack's WWII Mega Gun Pack](https://bigmack.itch.io/wwii-mega-gun-pack), [jimhatama's World Wars Weapons Pack](https://jimhatama.itch.io/world-wars-weapons-pack), [marmok1932's Soviet Weapons Pack](https://marmok1932.itch.io/soviet) — general WW2 bundles that may or may not include one; none confirmed to contain a Bren in this pass |
| Modernized Chauchat | none found | — | The rarest weapon on this whole roadmap as a free asset — a WWI French LMG gets modelled far less often than WW2 subjects. No lead surfaced at all in this pass. Likely needs either a from-scratch build (code-built, like today's attachments) or a commissioned/paid model if the project wants it sooner than "whenever someone uploads one" |

Exit criteria: STG and PPSh shipped as modernized kitbash builds (real base geometry,
modern furniture); Bren and Chauchat at minimum have a confirmed source lined up, even if
not yet built.

## Open items carried forward

- No free tactical-attachment pack (optics/suppressors/rails) was found; Stage 1's
  attachment upgrade may end up "better code-built shapes" rather than "downloaded parts"
  unless one turns up.
- Four items across the roadmap have no confirmed free source yet: SIG Spear, RPK, Bren,
  Chauchat. Checking D_U's Sketchfab catalog directly (rather than by search) is the
  single most promising unopened lead, since it's the exact art style already in use and
  already cleared for this project once.
- Every "license: verify" row must be individually opened and checked — CC0/CC BY only,
  same bar as the existing README's Models section — before any download is added to the
  repo or `model-source/`.
