# Project Research Summary

**Project:** Nice Things
**Domain:** Public static bookmark archive generated from local markdown notes
**Researched:** 2026-03-31
**Confidence:** HIGH

## Executive Summary

Nice Things is not a bookmarking app. It is a static, public retrieval layer over a private markdown notes corpus. The research is consistent on the product shape: keep the notes repo as the authoring source, run a local normalization step, commit the generated artifact into this repo, and let Astro prerender a fast archive for bookmarks, tags, and nested categories. Experts would build this as a static content pipeline with one small interactive surface for homepage filtering, not as SSR, not as a database-backed app, and not as a markdown-body rendering system.

The recommended implementation is Astro 5 with Bun and TypeScript, deployed as pure static output to Cloudflare Pages. The strongest stack recommendation is to emit one committed normalized JSON dataset and validate it through Astro content collections, because v1 only needs bookmark metadata. Feature scope should stay retrieval-first: homepage index, simple client-side search, tag and category filtering, dedicated tag/category pages, and stable `/b/[slug]` detail pages. Everything else that pushes the product toward preservation, collaboration, or heavy search infrastructure should wait.

The main risks are architectural, not visual. The project will fail if production builds depend on the external notes directory, if normalization is spread across sync code and UI code, if Astro route identity is confused with the public slug, or if homepage search ships too much data to the client. Mitigation is straightforward: commit generated content, centralize normalization, treat duplicate slugs as hard errors, derive all static paths from the same normalized dataset, and enforce a minimal client search index with a payload budget.

## Key Findings

### Recommended Stack

The stack research strongly favors a minimal static pipeline over a richer app stack. Astro 5 fits the site shape, Bun keeps local and deployment tooling aligned, and TypeScript is most valuable in the sync layer where malformed frontmatter and taxonomy drift would otherwise become silent data bugs. Cloudflare Pages is a good fit because the output is plain static `dist` content and does not require runtime compute.

The most important implementation choice is data shape: generate one committed, typed bookmark dataset and load it through Astro content collections with schema validation. That keeps the deploy artifact reproducible, reduces file churn, and moves correctness checks to the ingestion boundary instead of scattering them through templates.

**Core technologies:**
- `astro` 5.x: static site framework and route generation layer — best fit for typed content, prerendered taxonomy routes, and minimal shipped JS
- `typescript` 5.8+: sync and normalization typing — prevents ad hoc frontmatter parsing and makes edge cases testable
- `bun` 1.2.x: package manager and script runtime — aligns local workflows with Cloudflare Pages builds
- Astro content collections with `file()` loader and Zod schema: build-time contract for normalized bookmark data — central validation gate for routes and templates
- `gray-matter` 4.x: markdown frontmatter parser — standard, reliable parser for the source notes format
- Cloudflare Pages: static hosting and preview deploys — matches committed generated content and `dist` output

### Expected Features

The feature research is clear: v1 should satisfy public bookmark archive expectations, not compete with tools like Raindrop or Linkwarden on advanced preservation features. The minimum credible release is a dense, searchable archive with stable bookmark, tag, and category routes. That is enough to prove retrieval value without introducing server state or a second indexing system.

**Must have (table stakes):**
- Homepage bookmark index — primary public browsing surface
- Client-side search across title, URL, description, and tags — core retrieval path
- Tag filtering — standard navigation axis for bookmark archives
- Category browsing from `categoryPath` — maps note folders into archive structure
- Stable bookmark detail pages at `/b/[slug]` — canonical shareable page per bookmark
- Shareable tag pages — direct navigation and SEO entry points
- Shareable category pages — browsable archive hierarchy
- Deterministic sort order — newest first is the simplest default
- Clear empty states for zero results and missing metadata — required once filters combine

**Should have (competitive):**
- RSS or JSON feeds — strong public-web enhancement with moderate cost
- Related bookmarks on detail pages — low-risk discovery improvement from existing metadata
- Domain/source filtering — practical retrieval aid once basic search is stable
- Manual pinning or featured bookmarks — adds editorial shape without architectural churn

**Defer (v2+):**
- Full-text search over page content — requires a different indexing strategy than metadata-only v1
- Saved previews or screenshots — useful later, not needed for launch
- Archived copies / anti-link-rot preservation — high-value but materially changes storage and sync scope
- Highlights, annotations, collaboration, accounts, or AI features — all out of scope for a static retrieval-first archive

### Architecture Approach

The architecture should stay two-stage and explicit: a local ingestion pipeline reads external markdown notes and emits normalized bookmark data committed into this repo, then Astro builds all public routes from that committed dataset. Production should never fetch source files at request time or build time. All dynamic pages must be generated from one normalized source of truth, and the only client interactivity should be a small homepage filter island over a minimal serialized index.

**Major components:**
1. External bookmark source — raw markdown notes under the separate notes repo
2. Sync pipeline — file discovery, exclusion rules, frontmatter parsing, normalization, duplicate-slug detection, and warning/skip behavior
3. Generated content layer — committed normalized bookmark dataset inside this repo
4. Astro content collection — typed schema and build-time access boundary
5. Route data layer — derives bookmarks, tags, categories, and static path params
6. Static page routes — `/`, `/b/[slug]`, `/tags/[tag]`, `/category/[...path]`
7. Homepage filter island — local search and filtering without server calls
8. Build/deploy layer — `sync:bookmarks`, `astro build`, and Cloudflare Pages configuration

### Critical Pitfalls

1. **Treating the notes directory as deploy-time input** — avoid by committing normalized output and proving builds work with the notes repo unavailable
2. **Assuming frontmatter is clean** — avoid by normalizing aggressively, warning and skipping bad records, and testing malformed fixture cases
3. **Confusing Astro entry identity with public bookmark slug** — avoid by modeling public route keys deliberately and testing URL stability and collisions
4. **Under-generating static paths for tags, categories, or detail pages** — avoid by deriving all paths from the same normalized dataset and testing nested and special-character cases
5. **Shipping an oversized client search payload** — avoid by serializing only filterable fields, measuring bundle growth, and enforcing a payload budget

## Implications for Roadmap

Based on the combined research, the roadmap should follow data dependency order rather than UI-first order. Every v1 feature depends on a stable normalization contract, and the static route model should be proven before the homepage filter UX is added.

### Phase 1: Import Boundary and Data Contract
**Rationale:** Everything else depends on stable normalized bookmark data and reproducible builds.
**Delivers:** `sync:bookmarks`, exclusion of `articles/**`, normalization rules for tags/booleans/category path, duplicate-slug detection, committed generated dataset, and sync tests.
**Addresses:** Homepage index, search, tag filtering, category browsing, and detail pages indirectly by establishing the canonical content contract.
**Avoids:** Local notes dependency in deploys, malformed frontmatter breakage, slug collision surprises, and taxonomy drift.

### Phase 2: Static Content Model and Public Routes
**Rationale:** Route correctness should be proven before investing in interactive homepage UX.
**Delivers:** Astro content collection schema, bookmark detail pages, tag pages, category pages, shared taxonomy utilities, and route coverage tests.
**Uses:** Astro 5 content collections, static `getStaticPaths()`, and the normalized generated dataset.
**Implements:** Generated content layer, route data layer, and public static routes.
**Avoids:** Reserved-slug mistakes, incomplete static path generation, and mismatched tag/category URL logic.

### Phase 3: Homepage Retrieval Experience
**Rationale:** Once route and taxonomy primitives are stable, add the main user-facing retrieval surface with low architectural risk.
**Delivers:** Dense homepage index, client-side search, tag/category filters, deterministic sort order, and zero-result empty states.
**Uses:** One small client island and a minimal serialized search index rather than a framework app or full-text engine.
**Implements:** Homepage route plus filter island.
**Avoids:** Oversized client payloads, duplicated normalization logic in the UI, and overbuilding with React/Pagefind/SSR.

### Phase 4: Deployment Hardening and Public-Web Enhancements
**Rationale:** Deployment reproducibility and low-risk enhancements should follow once core retrieval works end to end.
**Delivers:** Cloudflare Pages configuration, pinned `BUN_VERSION`, CI checks that sync produces no uncommitted diff, build smoke tests, sitemap, and optionally feeds or related bookmarks if time remains.
**Uses:** Cloudflare Pages, `@astrojs/check`, Playwright smoke coverage, and the already-proven static architecture.
**Implements:** Build/deploy layer plus selective v1.1 public-web enhancements.
**Avoids:** Environment drift, stale generated content in production, and premature investment in archival/preservation features.

### Phase Ordering Rationale

- Import and normalization must come first because all routes and filters depend on clean, typed bookmark data.
- Static bookmark, tag, and category routes should precede homepage filtering because they validate the core information architecture and URL model.
- Homepage search/filtering belongs after route generation because it should reuse stable taxonomy and normalization utilities rather than inventing its own logic.
- Deployment hardening comes last because it is only meaningful once the repo can already build the intended public site end to end.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** payload sizing and search-index shape may need a quick implementation spike if the serialized homepage index grows faster than expected
- **Phase 4:** if feeds or related-bookmark logic are included, choose exact output shapes and canonical URL behavior deliberately
- **Future preservation work:** full-text search, screenshots, and archived copies need separate research because they change architecture materially

Phases with standard patterns (skip research-phase):
- **Phase 1:** markdown ingestion, normalization, and schema-first validation are well-understood and already strongly specified
- **Phase 2:** Astro content collections plus static route generation for bookmarks/tags/categories are standard documented patterns
- **Base deployment setup in Phase 4:** Cloudflare Pages static Astro deployment with Bun is straightforward and documented

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | The core recommendations rely mostly on official Astro, Bun, and Cloudflare documentation and align tightly with project constraints. |
| Features | MEDIUM | Benchmark products strongly agree on table stakes, but differentiator prioritization remains partly product-strategy judgment. |
| Architecture | HIGH | The two-stage static pipeline, Astro route generation model, and island boundary are well-supported by official docs and fit the repo goals directly. |
| Pitfalls | HIGH | The major failure modes are concrete, repeat across the research, and map directly to this project’s source/deploy split. |

**Overall confidence:** HIGH

### Gaps to Address

- Public slug modeling versus Astro content identity: validate the exact content-collection representation during implementation so Astro reserved-field behavior is not triggered accidentally.
- Client search payload budget: define a concrete size threshold during Phase 3 so performance regressions are detectable rather than subjective.
- Sort order policy: newest-first is the simplest recommendation, but if source files do not provide a trustworthy date field, the project should explicitly choose a fallback ordering rule during planning.
- Generated artifact format: research leans toward one JSON dataset, while earlier project notes describe generated `src/content/bookmarks`; planning should resolve this in favor of the simpler committed structured artifact before implementation starts.

## Sources

### Primary (HIGH confidence)
- Astro content collections docs — typed content loading, schema validation, and collection access
- Astro `getStaticPaths()` docs — static dynamic-route requirements
- Astro islands docs — minimal client interactivity model
- Astro reserved `slug` error docs — content modeling constraint
- Cloudflare Pages Astro deployment guide — static deployment path and `dist` output
- Cloudflare Pages build image docs — Bun support and `BUN_VERSION` pinning

### Secondary (MEDIUM confidence)
- Bun docs — runtime and package-manager behavior
- `gray-matter` package docs — frontmatter parsing choice
- Raindrop.io, Linkwarden, Are.na, and Pinboard public docs — benchmark expectations for archive/search/tag/category behavior
- `vitest`, `@playwright/test`, `@astrojs/check`, and `@astrojs/sitemap` package docs — supporting tooling choices

### Tertiary (LOW confidence)
- Community Pinboard usage notes — only used to reinforce older public bookmark archive patterns, not as a primary decision source

---
*Research completed: 2026-03-31*
*Ready for roadmap: yes*
