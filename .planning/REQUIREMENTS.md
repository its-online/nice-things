# Requirements: Nice Things

**Defined:** 2026-03-31
**Core Value:** Saved links must be easy to sync from notes and fast to find again through simple browsing and filtering.

## v1.4 Requirements

Mobile friendliness milestone (v1.3 shipped: 2026-04-01)

### Mobile Layout

- [x] **MOBILE-01**: Side panel adapts or replaces on mobile screens
- [x] **MOBILE-02**: Touch targets (buttons, links) are easy to tap on mobile
- [x] **MOBILE-03**: No horizontal scroll on mobile
- [x] **MOBILE-04**: Dropdown/search controls work on mobile

## v1.3 Requirements (Complete)

### Route Cleanup

- [x] **CLEANUP-01**: `/b/[slug]` bookmark detail pages removed — Phase 7
- [x] **CLEANUP-02**: `/tags/[tag]` tag listing pages removed — Phase 7
- [x] **CLEANUP-03**: `/category/[...path]` category listing pages removed — Phase 7
- [x] **CLEANUP-04**: Build output contains only homepage — Phase 7

### Verification

- [x] **VERIFY-01**: Site builds successfully — Phase 7
- [x] **VERIFY-02**: All bookmarks accessible via homepage — Phase 7

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
| MOBILE-01 | Phase 8 | ✅ Complete |
| MOBILE-02 | Phase 8 | ✅ Complete |
| MOBILE-03 | Phase 8 | ✅ Complete |
| MOBILE-04 | Phase 8 | ✅ Complete |

**Coverage:**
- v1.4 requirements: 4 total
- Mapped to phases: 4 (Phase 8)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-04-01 — v1.4 milestone started*
