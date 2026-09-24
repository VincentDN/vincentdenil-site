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
