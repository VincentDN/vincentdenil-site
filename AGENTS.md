# Repository instructions

## Projects and experiments: indexing and search visibility

All projects, experiments, prototypes, and previews are link-only pages. Apply these rules whenever creating, moving, renaming, or updating one:

1. Add a working link to the most fitting existing project index. For example, a 3D preview belongs in `/projects/3d/`, even when its actual URL is under `/3d/`. Use `/projects/experiment/` for experiments and `/projects/temp/` for temporary work when those categories fit. If no category fits, list it in `/projects/` or create an appropriate category and link that category from `/projects/`.
2. Keep the index entry's name, destination, and directory/file counts accurate. Update or remove stale entries when a page moves or is removed. Creating the page alone is not complete; its index link is part of the same change.
3. Always set `seo_hidden` to `true` and include `<meta name="robots" content="noindex">` on these pages and their project indexes. This repository currently serves plain static HTML and has no `seo_hidden` configuration field or build integration. In static HTML, record the convention as `<meta name="seo_hidden" content="true">` in the document head alongside the robots tag. If structured project metadata or a site generator is introduced, set its `seo_hidden: true` field as well.
4. Treat `seo_hidden` as an internal convention, not a search-engine directive. The robots `noindex` tag is required independently. Exclude link-only pages and their indexes from SEO sitemaps, search-engine submission lists, and any future automated SEO discovery feeds. Do not remove `noindex` to make an index link work.
5. Keep these pages accessible through direct links and the relevant project indexes. Link-only does not mean authenticated or private; do not publish secrets or sensitive material on that basis.

Before finishing, check that the appropriate index links to the intended page, the page links back to a useful index, the listing counts are correct, and both the page and any new or edited project index carry `seo_hidden` and `noindex`. Verify the links and metadata locally; verify the published result when deployment access is available.

These rules apply to the projects/experiments area and standalone project URLs, not automatically to the public portfolio homepage or contact page. Preserve existing project URLs unless the user requests a move.
