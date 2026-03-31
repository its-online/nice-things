# Requirements: Nice Things

**Defined:** 2026-03-31
**Core Value:** Saved links must be easy to sync from notes and fast to find again through simple browsing and filtering.

## v1 Requirements

### Sync Pipeline

- [x] **SYNC-01**: Maintainer can sync bookmark records from `../notes/resources/bookmarks/marks/` into the repo with one command
- [x] **SYNC-02**: Sync excludes `articles/**` and ignores non-markdown files
- [x] **SYNC-03**: Sync parses YAML frontmatter from bookmark markdown files without depending on markdown body content
- [x] **SYNC-04**: Sync skips records missing `bookmark_title` or `bookmark_url` and logs warnings
- [x] **SYNC-05**: Sync skips records with invalid frontmatter and logs warnings instead of failing the whole build
- [x] **SYNC-06**: Sync normalizes tags by trimming and lowercasing, with empty or missing tags becoming `[]`
- [x] **SYNC-07**: Sync normalizes blank or missing `bookmark_done` values to `done: false`
- [x] **SYNC-08**: Sync derives `categoryPath` from folder segments under `marks`
- [x] **SYNC-09**: Sync assigns a stable bookmark route key from the source file name and fails with a clear error on duplicates
- [x] **SYNC-10**: Sync writes normalized bookmark data into a committed generated artifact inside this repo so production builds do not depend on the notes directory

### Archive Browsing

- [x] **ARCH-01**: Visitor can open a public homepage that lists all synced bookmarks
- [x] **ARCH-02**: Visitor can search bookmarks on the homepage by title, URL, description, and tags
- [x] **ARCH-03**: Visitor can filter bookmarks on the homepage by tag
- [x] **ARCH-04**: Visitor can filter bookmarks on the homepage by category
- [x] **ARCH-05**: Visitor sees a clear empty state when search or filters return no bookmarks
- [x] **ARCH-06**: Visitor sees bookmarks in a deterministic default order

### Taxonomy Pages

- [x] **TAX-01**: Visitor can open a dedicated page for every normalized tag
- [x] **TAX-02**: Visitor can open a dedicated page for every category path present in the synced bookmarks
- [x] **TAX-03**: Tag and category pages list only bookmarks that belong to the selected taxonomy value

### Bookmark Detail

- [x] **DET-01**: Visitor can open a dedicated `/b/[route-key]` page for every synced bookmark
- [x] **DET-02**: Bookmark detail pages show title, outbound URL, description when present, tags, category path, and source-relative path
- [x] **DET-03**: Bookmark detail pages include a clear outbound link to the original resource

### Build and Deployment

- [x] **BLD-01**: `bun run build` runs bookmark sync before `astro build`
- [x] **BLD-02**: The site builds successfully from committed repo contents without access to the notes directory
- [x] **BLD-03**: Cloudflare Pages can deploy the site from `dist`
- [x] **BLD-04**: Build configuration pins the intended Bun version for reproducible deploys
- [x] **BLD-05**: The site generates all required static routes for bookmarks, tags, and categories without deploy-time 404 gaps

### Verification

- [x] **TEST-01**: Automated tests verify sync normalization for empty tags, blank `bookmark_done`, invalid frontmatter, and missing required fields
- [x] **TEST-02**: Automated checks verify duplicate route-key detection aborts sync clearly
- [x] **TEST-03**: Automated checks verify homepage, tag pages, category pages, and bookmark detail pages build and resolve successfully

## v1.1 Requirements

UI/UX refinement milestone (v1.0 shipped: 2026-03-31)

### Theme

- [ ] **THEME-01**: Site defaults to dark color scheme on first load
- [ ] **THEME-02**: Dark-first design with appropriate contrast ratios
- [ ] **THEME-03**: Design system uses CSS variables for easy theme switching

### Layout

- [ ] **LAYOUT-01**: Tag pills removed from main bookmark list UI
- [ ] **LAYOUT-02**: Tag/category selector uses dropdown only
- [ ] **LAYOUT-03**: Search input integrated into the dropdown selector
- [ ] **LAYOUT-04**: Side panel for bookmark details (replaces `/b/[slug]` page)

### Bookmark Interactions

- [ ] **INTER-01**: Hover on bookmark shows quick preview (title, URL, tags)
- [ ] **INTER-02**: Click on bookmark opens detailed side panel
- [ ] **INTER-03**: Side panel shows: title, external URL (as clickable link), description, tags, category, source path
- [ ] **INTER-04**: "Visit Site" button in side panel opens external URL in new tab
- [ ] **INTER-05**: External bookmark links have visual distinction (icon + color)

### Search & Filter

- [ ] **SEARCH-01**: Search input integrated with tag/category dropdown
- [ ] **SEARCH-02**: Search filters bookmarks in real-time as user types
- [ ] **SEARCH-03**: URL query params preserved for search state

## v2 Requirements

### Bookmark Management

- **MGMT-01**: Maintainer can add new bookmarks via sync
- **MGMT-02**: Maintainer can edit bookmark metadata
- **MGMT-03**: Maintainer can delete bookmarks from archive

### Social Features

- **SOCIAL-01**: Share individual bookmark via URL
- **SOCIAL-02**: Share collection/tag via public URL

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dedicated `/b/[slug]` detail page | Side panel provides same info without page navigation (v1.1) |
| Light theme toggle | Dark theme is the primary experience (v1.1) |
| Server-side rendering | Static site keeps deployment simple |
| Rendering bookmark markdown bodies | v1 is metadata-only for simplicity |
| User accounts, likes, comments | Public read-only archive |
| Browser capture, web clipping | External notes repo owns authoring |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 5 | Pending |
| THEME-02 | Phase 5 | Pending |
| THEME-03 | Phase 5 | Pending |
| LAYOUT-01 | Phase 5 | Pending |
| LAYOUT-02 | Phase 5 | Pending |
| LAYOUT-03 | Phase 5 | Pending |
| LAYOUT-04 | Phase 5 | Pending |
| INTER-01 | Phase 5 | Pending |
| INTER-02 | Phase 5 | Pending |
| INTER-03 | Phase 5 | Pending |
| INTER-04 | Phase 5 | Pending |
| INTER-05 | Phase 5 | Pending |
| SEARCH-01 | Phase 5 | Pending |
| SEARCH-02 | Phase 5 | Pending |
| SEARCH-03 | Phase 5 | Pending |

**Coverage:**
- v1.1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-04-01 after v1.1 milestone start*
