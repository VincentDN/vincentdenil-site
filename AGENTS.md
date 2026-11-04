# Repository instructions

## Site indexing: nothing added stays unlinked

Anything added to this repo that isn't already reachable from the homepage (`/`) or another already-linked, already-public page - a new project, doc, experiment, prototype, preview, or any other section - must get a working link from `/projects/` (or from a category page that is itself linked from `/projects/`). This is a general site-navigation rule and applies regardless of whether the content is meant to be public or hidden from search engines (see the narrower rule below for that distinction). Apply it whenever creating, moving, renaming, or updating such a page:

1. Add a working link to the most fitting existing index. For example, a 3D preview belongs in `/projects/3d/`, even when its actual URL is under `/3d/`. Use `/projects/experiment/` for experiments, `/projects/temp/` for temporary work, and an entry (or category, e.g. `/projects/docs/`) for reference documentation. If no category fits, list it directly in `/projects/`, or create an appropriate category and link that category from `/projects/`.
2. Keep the index entry's name, destination, and directory/file counts accurate. Update or remove stale entries when a page moves or is removed. Creating the page alone is not complete; its index link is part of the same change.
3. This applies retroactively, not just to what you're adding right now: if you notice something already in the repo with no path in from `/` or `/projects/`, link it from `/projects/` as part of whatever change you're already making rather than leaving it orphaned.

## Search-engine visibility for hidden/experimental pages

Projects, experiments, prototypes, and previews specifically - not documentation or other content meant to be publicly discoverable - are link-only pages, deliberately hidden from search engines. Apply these additional rules to that subset:

4. Always set `seo_hidden` to `true` and include `<meta name="robots" content="noindex">` on these pages and their project indexes. This repository currently serves plain static HTML and has no `seo_hidden` configuration field or build integration. In static HTML, record the convention as `<meta name="seo_hidden" content="true">` in the document head alongside the robots tag. If structured project metadata or a site generator is introduced, set its `seo_hidden: true` field as well.
5. Treat `seo_hidden` as an internal convention, not a search-engine directive. The robots `noindex` tag is required independently. Exclude link-only pages and their indexes from SEO sitemaps, search-engine submission lists, and any future automated SEO discovery feeds. Do not remove `noindex` to make an index link work.
6. Keep these pages accessible through direct links and the relevant project indexes. Link-only does not mean authenticated or private; do not publish secrets or sensitive material on that basis.
7. Content that's meant to be found by search engines (reference docs, for example) still needs a `/projects/` link per the rule above, but must NOT carry `noindex`/`seo_hidden` - being listed alongside link-only pages doesn't make it one.

Before finishing, check that the appropriate index links to the intended page, the page links back to a useful index, the listing counts are correct, and - for hidden/experimental pages only - both the page and any new or edited project index carry `seo_hidden` and `noindex`. Verify the links and metadata locally; verify the published result when deployment access is available.

These indexing rules apply repo-wide. They don't require the public portfolio homepage or contact page to carry a self-referential `/projects/` link back to themselves. Preserve existing project URLs unless the user requests a move.

## Walking Through episodes and briefings: narrator

**Default narrator: Claudine (except Codex-authored material).** Spoken briefings and Walking Through episodes are narrated by Claudine, Vincent's voice assistant, named after the British narrator voice ElevenLabs uses to turn the Markdown into audio. Her job is to brief Vincent on what is happening in his businesses and to teach him what he needs to know. She speaks to him as "you", may say "I" and introduce herself by name at the start, and sounds like a knowledgeable British colleague: warm, clear, lightly wry, with British idiom, never salesy. Write for the ear: short sentences, numbers rounded the way a person says them, dates as words, and no tables, URLs, IDs or file paths in the narration (sources go below a closing `---` rule).

## Codex narrator (Vincent, 2 November 2026)

Codex-authored episodes and briefings use **Alistair**, a male British persona, never “Claudine here”. Preserve Claudine attribution for other agents’ work. For Microsoft narration, use `en-GB-RyanNeural` for Alistair, passing `--voice` explicitly.

For the Founders Curriculum conversation begun 2 November 2026, Vincent authorises merging completed changes to `main` at each turn after appropriate checks. This is conversation-scoped authorisation. Report genuine blockers without claiming a merge or audio delivery that did not happen.

## Narrated audio delivery (standing rule)

Narrated MP3s of Walking Through episodes and briefings are delivered to `outbound/audio/` (series in a subfolder), named after the MD they narrate, for Vincent to download from the repo. They are not site content: do not link them from `/projects/`, `/docs/` or any index, and do not put them next to the MD in `docs/`. `functions/outbound/` keeps `/outbound/` off the live site; the indexing rules above do not apply to `outbound/`. (Vincent, 1 Nov 2026.) How to make the MP3s (free Microsoft Edge voice `en-GB-SoniaNeural`, scripts and checks): [tools/narration/README.md](tools/narration/README.md).

## Agent instruction files (standing rule)

We run a multi-agent workflow, so `AGENTS.md` is the single source of instructions for every agent. `CLAUDE.md` must always exist, stay blank of instructions, and only defer to this file:

```
# Claude Code

@AGENTS.md
```

The `@AGENTS.md` line is an import, so Claude Code loads this file automatically at the start of every session. A plain Markdown link such as `Read [AGENTS.md](AGENTS.md)` does not: when a `CLAUDE.md` exists, Claude Code reads only that file, and the agent would have to choose to open this one (see https://code.claude.com/docs/en/memory, section "AGENTS.md").

Never add rules, notes or tool preferences to `CLAUDE.md`; put them in this file (mark agent-specific ones clearly). If you find instructions in `CLAUDE.md`, move them here and restore the pointer.

## Murky provenance: deliver for human rights review (standing rule)

When the provenance or rights of a file (image, scan, font, dataset, document) are unclear, do not publish it, add it to a shipping catalogue as cleared, or leave it as a bare link. Deliver the files as references into `outbound/rights-review/<source-name>/` (create `outbound/` if the repository has none), with human-legible file names (a readable title, reference number and date, never a hash or ID-only name). Add a `rights-review-sheet.csv` beside them with, for each file: the source page, the rights statement the source itself makes, why the provenance is murky, and blank reviewer, decision (CLEARED / NOT CLEARED / ASK SOURCE), date and notes columns. Human operators go through the sheet and clear the rights.

Until a human marks a file CLEARED it must not ship. Never use search-engine image results (Google Images and similar) as a source for files that will be published or sold; use archives, museums and other sources that state their terms.



Vincent, 3 November 2026: MP3 delivery must include committing the verified MP3 to `outbound/audio/` in the repository and merging it to `main` in this conversation. Temporary download artifacts alone do not complete delivery. Include the validation report when available and verify the committed file before reporting completion.

## Reliable TTS repository delivery (Vincent, 4 November 2026)

For every requested TTS delivery, append an explicit request to `tools/narration/requests.json` with a new unique ID, source SHA-256, source Markdown path, output directory under `outbound/audio/`, and the appropriate voice. Merge the request to `main`; the repository delivery workflow renders, validates and commits the MP3, validation report and delivery receipt to `main` for Vincent's local GitHub sync. This persistent repository-write workflow is authorised by Vincent's request to make delivery work every time. Do not treat temporary artifacts as final delivery. Check the run result and the MP3 on `main` before claiming success. Service failures must be reported; rerun the failed workflow after resolving them.

Codex uses Alistair / `en-GB-RyanNeural`. Read `tools/narration/README.md` for the queue and retention procedure. Keep scripts permanently. Cleanup applies only to ledger-managed audio under the selected retention policy; never rewrite Git history or silently delete untracked legacy audio. Until Vincent selects a retention period, timed deletion is disabled. Git cleanup also removes files from a synced working copy, so offline keepsakes must be copied outside that checkout.
