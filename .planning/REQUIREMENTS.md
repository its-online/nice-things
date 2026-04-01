# Requirements: Nice Things

**Defined:** 2026-03-31
**Core Value:** Saved links must be easy to sync from notes and fast to find again through simple browsing and filtering.

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
| Dedicated `/b/[slug]` detail page | Side panel provides same info without page navigation |
| Light theme toggle | Dark theme is the primary experience |
| Server-side rendering | Static site keeps deployment simple |
| Rendering bookmark markdown bodies | v1 is metadata-only for simplicity |
| User accounts, likes, comments | Public read-only archive |
| Browser capture, web clipping | External notes repo owns authoring |

---
_All completed requirements archived in `.planning/milestones/`_
