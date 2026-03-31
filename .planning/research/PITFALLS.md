# Domain Pitfalls

**Domain:** Public Astro bookmarks archive generated from local markdown notes and deployed to Cloudflare Pages
**Researched:** 2026-03-31
**Overall confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Treating the notes directory as part of the deploy environment
**What goes wrong:** The site quietly depends on `../notes/...` during local development or build scripts, then fails or publishes stale data on Cloudflare Pages because that directory does not exist in CI.
**Why it happens:** Teams build the sync step around their local filesystem and forget that Pages only has the Git repo contents.
**Consequences:** Empty builds, broken previews, or successful deploys with outdated bookmark content.
**Warning signs:**
- `bun run build` only works on the author machine
- Preview deploys differ from local output
- Generated content changes after running sync locally, but those changes were not committed
- Build scripts reference `BOOKMARKS_SOURCE_DIR` without a safe fallback for CI
**Prevention:** Keep the notes directory strictly local input for `sync:bookmarks`, commit normalized output into the repo, and make production builds consume only committed generated content. Add a CI check that runs sync and fails if it produces a diff.
**Detection:** Run a clean build with the notes directory unavailable. If output changes after sync, the repo is not self-contained.
**Phase should address it:** Sync/import pipeline and CI/deployment setup

### Pitfall 2: Assuming bookmark frontmatter is clean and stable
**What goes wrong:** One malformed or incomplete markdown file breaks the import, or inconsistent metadata produces fragmented filters and wrong counts.
**Why it happens:** Personal notes evolve informally. Empty tags, blank booleans, missing required fields, and occasional malformed YAML are normal.
**Consequences:** Broken builds, missing bookmarks, duplicate taxonomies, and distrust in search/filter results.
**Warning signs:**
- Tags appear in multiple forms such as `AI`, `ai`, and `ai `
- A single bad file aborts the whole sync
- Homepage counts do not match the source directory minus excluded/skipped files
- Optional fields leak through as `undefined` strings or inconsistent shapes
**Prevention:** Build a strict normalization layer before content enters Astro. Warn and skip invalid or incomplete records, normalize tags and booleans, preserve source-relative path for debugging, and snapshot import counts in tests.
**Detection:** Maintain fixture-based sync tests for malformed YAML, blank `bookmark_done`, empty tags, missing description, and missing required fields.
**Phase should address it:** Data normalization and importer validation

### Pitfall 3: Mixing Astro’s internal content identifiers with the public bookmark slug
**What goes wrong:** The implementation stores `slug` in the wrong place, collides with Astro’s reserved content behavior, or accidentally exposes folder-derived IDs instead of the intended `/b/[slug]` route.
**Why it happens:** Astro content collections already generate entry IDs, and `slug` has reserved meaning in Astro content systems. It is easy to confuse collection entry identity with the app’s own bookmark URL identity.
**Consequences:** Build errors, route mismatches, unstable URLs, or public URLs that leak internal folder structure.
**Warning signs:**
- Astro throws a `ContentSchemaContainsSlugError`
- Generated URLs include source folder paths unexpectedly
- Bookmark detail pages resolve locally but not from generated links
- Refactors to the source tree would change public URLs
**Prevention:** Keep a clear distinction between Astro collection entry identity and the app-level bookmark route key. Do not define `slug` naively in a legacy collection schema. If a custom public slug is needed, model it intentionally and test for collisions and URL stability.
**Detection:** Add route-generation tests proving every bookmark resolves to exactly one `/b/[slug]` page and that source folder moves do not silently change public URLs.
**Phase should address it:** Content model and routing design

### Pitfall 4: Incomplete static path generation for tags, categories, and detail pages
**What goes wrong:** Dynamic routes build incompletely, especially for nested categories or normalized tags, and some links 404 only after deploy.
**Why it happens:** Astro static mode requires all route variants at build time. Catch-all category routes and normalized tag routes are easy to under-generate.
**Consequences:** Broken archive navigation, missing tag/category pages, and production-only 404s.
**Warning signs:**
- A route works on the homepage filter but not as a dedicated page
- Nested categories fail while top-level categories work
- Tags with spaces, punctuation, or case differences produce broken links
- New content appears on `/` but not under `/tags/...` or `/category/...`
**Prevention:** Derive all route params from the same normalized dataset used by the homepage. Centralize route generation, percent-encode safely, and test representative edge cases including empty states, nested category paths, and special-character tags.
**Detection:** Build-time assertions should compare generated pages against the set of normalized tags, categories, and slugs.
**Phase should address it:** Static routing and page generation

### Pitfall 5: Shipping client-side search with an oversized or poorly shaped payload
**What goes wrong:** The site stays static, but the homepage ships too much bookmark data to the browser and becomes slow as the archive grows.
**Why it happens:** The simplest implementation serializes the full bookmark collection into client JavaScript for filtering.
**Consequences:** Larger bundles, slower first load, slower search interactions, and worse mobile performance.
**Warning signs:**
- Homepage JavaScript grows with each added bookmark
- Search/filter requires hydrating fields that are never rendered
- Lighthouse performance drops even though the site is “static”
- Search feels laggy on low-end devices
**Prevention:** Build a minimal client search index containing only the fields needed for filtering, and keep everything else server-rendered into HTML. Measure bundle size early and treat index growth as a tracked budget.
**Detection:** Compare bundle size and payload size before and after adding sample bulk bookmarks. Fail CI if the index or client bundle exceeds an agreed threshold.
**Phase should address it:** Homepage browse/search implementation

## Moderate Pitfalls

### Pitfall 6: Assuming slug uniqueness will remain true forever
**What goes wrong:** Two bookmark files in different folders eventually share a basename, and the sync either fails late or silently routes both to the same public page.
**Why it happens:** Filename-based slugs feel safe in a small personal archive, but folder growth makes basename collisions more likely over time.
**Consequences:** Build failures, overwritten records, or unstable URLs.
**Warning signs:**
- New bookmarks are added under new subfolders with familiar names like `index.md`, `home.md`, or duplicated article titles
- Sync logs mention duplicate slugs
- Contributors start renaming files defensively without a documented rule
**Prevention:** Keep hard duplicate detection in sync from day one. If collisions become common, switch the public slug strategy deliberately instead of patching around collisions ad hoc.
**Detection:** Collision tests should run against fixtures and the real source tree during sync.
**Phase should address it:** Import normalization and URL policy

### Pitfall 7: Letting tag and category normalization drift from URL normalization
**What goes wrong:** The UI, generated pages, and internal filters disagree about whether `AI`, `ai`, `A.I.`, or `ai/` represent the same taxonomy.
**Why it happens:** Normalization rules often get duplicated in sync code, route generation, and client filtering instead of living in one canonical place.
**Consequences:** Duplicate taxonomy pages, broken filter chips, and URLs that are hard to predict or preserve.
**Warning signs:**
- Clicking a tag chip and visiting the corresponding tag page yield different result sets
- Canonical tag strings differ between generated content and runtime filtering
- The same category appears with different casing or whitespace in navigation
**Prevention:** Define one canonical normalization function for tags and one for category segments, and reuse them everywhere: import, route generation, UI display mapping, and tests.
**Detection:** Add round-trip tests from source metadata -> normalized route param -> rendered page listing.
**Phase should address it:** Normalization utilities and routing integration

### Pitfall 8: Leaving Cloudflare Pages runtime versions implicit
**What goes wrong:** A previously healthy deploy starts failing after a Pages build image update or a Bun change that was never pinned.
**Why it happens:** Cloudflare Pages updates its build image over time, and Bun changes can affect install/build behavior.
**Consequences:** Surprise deploy breakage, “works locally” drift, and emergency version pinning after production failure.
**Warning signs:**
- Local Bun version differs from Pages default
- Lockfile changes are not reflected in deploy behavior
- A deploy breaks without application code changes
- Preview and production builds differ after build image changes
**Prevention:** Pin `BUN_VERSION`, commit the lockfile, and keep local and CI tool versions aligned. Treat deployment config as part of the app, not dashboard trivia.
**Detection:** Periodically rebuild with the pinned production versions and document them in the repo.
**Phase should address it:** Deployment hardening and CI reproducibility

## Minor Pitfalls

### Pitfall 9: Ignoring archive hygiene because the site is “just static”
**What goes wrong:** The site technically builds, but outbound bookmarks rot, descriptions become misleading, and users stop trusting the archive.
**Why it happens:** Static-site projects often optimize for publishing, not long-term content quality.
**Consequences:** Reduced usefulness, confusing search results, and a public archive that feels abandoned.
**Warning signs:**
- Many bookmarks lead to dead or redirected destinations
- Titles/descriptions no longer match the destination content
- Old tags remain even after taxonomy conventions change
**Prevention:** Defer automated link checking if necessary, but reserve a later phase for archive hygiene: optional link audits, stale-link marking, and taxonomy cleanup workflows.
**Detection:** Sample-check a subset of bookmarks regularly and track broken-link rate.
**Phase should address it:** Post-MVP maintenance or backlog

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Sync/import pipeline | Local filesystem dependency leaks into deploys | Commit generated content and verify production builds without notes access |
| Data normalization | Bad frontmatter breaks the pipeline | Warn-and-skip invalid records, normalize aggressively, test fixtures |
| Content model | Astro reserved `slug` conflicts with custom route design | Separate Astro entry identity from public bookmark URL identity |
| Static routing | Missing `getStaticPaths()` coverage or bad catch-all params | Generate all slugs/tags/categories from one normalized source of truth |
| Homepage search/filter | Full dataset shipped to client | Build a minimal search index and enforce a payload budget |
| Deployment/CI | Bun or Pages image drift | Pin versions and run reproducible CI builds |
| Future archive growth | Slug collisions and taxonomy drift | Detect collisions early and centralize normalization rules |

## Sources

- Astro docs: Content schema reserved `slug` error — https://docs.astro.build/en/reference/errors/content-schema-contains-slug-error/ (HIGH)
- Astro docs: Static mode dynamic routes require `getStaticPaths()` — https://docs.astro.build/en/reference/errors/get-static-paths-required/ (HIGH)
- Astro docs: Content collections and custom IDs/slugs — https://v6.docs.astro.build/en/guides/content-collections/ (HIGH)
- Cloudflare Pages docs: Astro deployment guide — https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ (HIGH)
- Cloudflare Pages docs: Build image versions and `BUN_VERSION` pinning — https://developers.cloudflare.com/pages/configuration/build-image/ (HIGH)
- Project context from [PROJECT.md](/mnt/data/Projects/nice-things/.planning/PROJECT.md) and [prd.md](/mnt/data/Projects/nice-things/prd.md); the phase recommendations and archive-specific failure modes are inferred from these constraints plus the official docs above (MEDIUM where inferential)
