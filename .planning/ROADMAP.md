# Roadmap: Nice Things

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-04-01)
- ✅ **v1.1 UI/UX Refinement** — Phase 5 (shipped 2026-04-01)
- ✅ **v1.2 Tag Selection Fixes** — Phase 6 (shipped 2026-04-01)
- 🚧 **v1.3 Simplification** — Phase 7 (in progress)
- 📋 **v2.0 [TBD]** — Planned

## Phases

- [ ] **Phase 7: Route Cleanup** - Remove unused detail/listing routes, verify homepage-only build

## Phase Details

### Phase 7: Route Cleanup
**Goal**: Site contains only homepage route with all bookmark access via search/filter/side panel
**Depends on**: Phase 6
**Requirements**: CLEANUP-01, CLEANUP-02, CLEANUP-03, CLEANUP-04, VERIFY-01, VERIFY-02
**Success Criteria** (what must be TRUE):
  1. Build output contains only `/` and static assets (no `/b/`, `/tags/`, `/category/` routes)
  2. Site builds successfully with homepage-only route generation
  3. All 186 bookmarks accessible via homepage search
  4. All 186 bookmarks accessible via homepage tag dropdown
  5. Side panel displays bookmark details without page navigation
**Plans**: TBD

### 📋 v2.0 [TBD] (Planned)

**Milestone Goal:** [To be determined]

---

_Detailed milestone archives: `.planning/milestones/`_

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Sync Contract | v1.0 | 1/1 | ✅ Complete | 2026-04-01 |
| 2. Static Archive Routes | v1.0 | 1/1 | ✅ Complete | 2026-04-01 |
| 3. Homepage Retrieval UX | v1.0 | 1/1 | ✅ Complete | 2026-04-01 |
| 4. Deployable Static Release | v1.0 | 1/1 | ✅ Complete | 2026-04-01 |
| 5. UI/UX Refinement | v1.1 | 1/1 | ✅ Complete | 2026-04-01 |
| 6. Tag Selection Fixes | v1.2 | 1/1 | ✅ Complete | 2026-04-01 |
| 7. Route Cleanup | v1.3 | 0/? | Not started | - |
