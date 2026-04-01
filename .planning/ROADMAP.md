# Roadmap: Nice Things

## Milestones

- ✅ **v1.0 MVP** - Phases 1-4 (shipped 2026-04-01)
- ✅ **v1.1 UI/UX Refinement** - Phase 5 (shipped 2026-04-01)
- ✅ **v1.2 Tag Selection Fixes** - Phase 6 (shipped 2026-04-01)
- 📋 **v2.0 [TBD]** - Planned

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) - SHIPPED 2026-04-01</summary>

### Phase 1: Sync Contract
**Goal**: Maintainer can reliably import bookmark metadata from notes into a committed structured data artifact that the repo can build from on its own.
**Depends on**: Nothing (first phase)
**Requirements**: SYNC-01, SYNC-02, SYNC-03, SYNC-04, SYNC-05, SYNC-06, SYNC-07, SYNC-08, SYNC-09, SYNC-10, TEST-01, TEST-02
**Success Criteria** (what must be TRUE):
  1. Maintainer can run one sync command and get a committed generated bookmark dataset inside the repo without copying synthetic markdown files around.
  2. Invalid frontmatter, missing required bookmark fields, and excluded files are skipped with visible warnings instead of breaking the import.
  3. Synced bookmarks always expose normalized tags, normalized done state, derived category paths, and stable route keys.
  4. Sync aborts with a clear duplicate route-key error before bad data reaches the site.
  5. Automated tests catch the required normalization and duplicate-detection cases before later phases build on the dataset.
**Plans**: 1 plan

Plans:
- [x] 01-01: Scaffold the Astro/Bun project, implement the bookmark sync pipeline, and add fixture tests.

### Phase 2: Static Archive Routes
**Goal**: Visitors can open every bookmark, tag, and category page as prerendered static routes generated from the normalized bookmark dataset.
**Depends on**: Phase 1
**Requirements**: TAX-01, TAX-02, TAX-03, DET-01, DET-02, DET-03, BLD-05
**Success Criteria** (what must be TRUE):
  1. Visitor can open a `/b/[route-key]` page for every synced bookmark and see its title, outbound URL, description when present, tags, category path, and source-relative path.
  2. Visitor can open a page for every normalized tag and see only bookmarks assigned to that tag.
  3. Visitor can open a page for every category path and see only bookmarks assigned to that category hierarchy.
  4. The generated static route set covers all bookmarks, tags, and categories with no missing-page gaps at build time.
**Plans**: 1 plan

Plans:
- [x] 02-01: Generate static bookmark detail pages, tag listing pages, and category listing pages from the normalized bookmark dataset.

### Phase 3: Homepage Retrieval UX
**Goal**: Visitors can use the homepage as the fastest retrieval surface for the bookmark archive.
**Depends on**: Phase 2
**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04, ARCH-05, ARCH-06
**Success Criteria** (what must be TRUE):
  1. Visitor can open the homepage and browse all synced bookmarks in a deterministic default order.
  2. Visitor can search bookmarks on the homepage by title, URL, description, and tags.
  3. Visitor can narrow the homepage list by tag and by category without losing route correctness established earlier.
  4. Visitor sees a clear empty state when the current search and filter combination returns no bookmarks.
**Plans**: 1 plan

Plans:
- [x] 03-01: Homepage with search, tag/category filters, grouped ordering

### Phase 4: Deployable Static Release
**Goal**: The site builds, deploys, and verifies as a reproducible static release without depending on the external notes directory.
**Depends on**: Phase 3
**Requirements**: BLD-01, BLD-02, BLD-03, BLD-04, TEST-03
**Success Criteria** (what must be TRUE):
  1. Maintainer can run `bun run build` and have bookmark sync execute before Astro builds the site.
  2. The project builds successfully from committed repo contents even when the external notes directory is unavailable.
  3. Cloudflare Pages has the required Bun version and build settings to deploy the generated `dist` output reproducibly.
  4. Automated verification confirms homepage, bookmark detail, tag, and category routes build and resolve successfully.
**Plans**: 1 plan

Plans:
- [x] 04-01: Build pipeline, Cloudflare Pages config, route verification

</details>

<details>
<summary>✅ v1.1 UI/UX Refinement (Phase 5) - SHIPPED 2026-04-01</summary>

### Phase 5: UI/UX Refinement
**Goal**: Site has a dark-first redesign with cleaner layout (no tag pills, dropdown-only selectors, integrated search) and improved bookmark interactions (hover preview, side panel, visual distinction for external links).
**Depends on**: Phase 4
**Requirements**: THEME-01, THEME-02, THEME-03, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04, INTER-01, INTER-02, INTER-03, INTER-04, INTER-05, SEARCH-01, SEARCH-02, SEARCH-03
**Success Criteria** (what must be TRUE):
  1. Site renders with dark-first design using CSS variables, with appropriate contrast ratios throughout the UI.
  2. Main bookmark list displays without tag pills; tag and category selection use a single dropdown control with integrated search input.
  3. Hovered a bookmark show a quick preview with title, URL, and tags; clicking a bookmark opens a side panel displaying full details (title, external URL as clickable link, description, tags, category, source path).
  4. Side panel contains a "Visit Site" button that opens the external URL in a new tab, and all external bookmark links have distinct visual styling (icon + color).
  5. Search filters bookmarks in real-time as the user types, with search state persisted in URL query parameters.
**Plans**: 1 plan

Plans:
- [x] 05-01: Dark-first redesign with warm dark palette, CSS variables

</details>

<details>
<summary>✅ v1.2 Tag Selection Fixes (Phase 6) - SHIPPED 2026-04-01</summary>

### Phase 6: Tag Selection Fixes & UI Cleanup
**Goal**: Fix tag selection interaction bugs and remove external link icon per user feedback.
**Depends on**: Phase 5
**Requirements**: TAG-01, TAG-02, TAG-03, PREVIEW-01, CLEANUP-01
**Success Criteria** (what must be TRUE):
  1. When a tag is selected in the dropdown, it displays with visually distinct styling (different color, weight, or indicator) compared to unselected tags.
  2. Selecting a tag in the dropdown control updates the tag display shown in the preview area to match.
  3. Selecting a tag in the preview area updates the dropdown control to reflect the selected tag.
  4. Preview area displays bookmark description text instead of showing a list of tags.
  5. External link icon is no longer rendered anywhere in the bookmark display UI.
**Plans**: 1 plan

Plans:
- [x] 06-01: Tag selection fixes and UI cleanup

</details>

### 📋 v2.0 [TBD] (Planned)

**Milestone Goal:** [To be determined]

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Sync Contract | v1.0 | 1/1 | Complete | 2026-04-01 |
| 2. Static Archive Routes | v1.0 | 1/1 | Complete | 2026-04-01 |
| 3. Homepage Retrieval UX | v1.0 | 1/1 | Complete | 2026-04-01 |
| 4. Deployable Static Release | v1.0 | 1/1 | Complete | 2026-04-01 |
| 5. UI/UX Refinement | v1.1 | 1/1 | Complete | 2026-04-01 |
| 6. Tag Selection Fixes & UI Cleanup | v1.2 | 1/1 | Complete | 2026-04-01 |
