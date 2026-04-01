# Requirements: Nice Things

**Defined:** 2026-03-31
**Core Value:** Saved links must be easy to sync from notes and fast to find again through simple browsing and filtering.

## v1.3 Requirements

Simplification milestone — remove dedicated route pages (v1.2 shipped: 2026-04-01)

### Route Cleanup

- [ ] **CLEANUP-01**: `/b/[slug]` bookmark detail pages removed from site generation
- [ ] **CLEANUP-02**: `/tags/[tag]` tag listing pages removed from site generation
- [ ] **CLEANUP-03**: `/category/[...path]` category listing pages removed from site generation
- [ ] **CLEANUP-04**: Build output contains only homepage (`/`) and static assets

### Verification

- [ ] **VERIFY-01**: Site builds successfully with only homepage route
- [ ] **VERIFY-02**: All 186 bookmarks accessible via homepage search/filter/side panel

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
| Dedicated `/b/[slug]` detail page | Side panel provides same info on main page |
| `/tags/[tag]` listing page | Navigation via homepage dropdown |
| `/category/[...path]` listing page | Navigation via homepage dropdown |
| Light theme toggle | Dark theme is the primary experience |
| Server-side rendering | Static site keeps deployment simple |
| Rendering bookmark markdown bodies | v1 is metadata-only for simplicity |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEANUP-01 | Phase 7 | Pending |
| CLEANUP-02 | Phase 7 | Pending |
| CLEANUP-03 | Phase 7 | Pending |
| CLEANUP-04 | Phase 7 | Pending |
| VERIFY-01 | Phase 7 | Pending |
| VERIFY-02 | Phase 7 | Pending |

**Coverage:**
- v1.3 requirements: 6 total
- Mapped to phases: 6 (Phase 7)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-04-01 after v1.3 milestone start*
