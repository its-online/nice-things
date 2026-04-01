# Nice Things

## What This Is

Nice Things is a public Astro-based bookmarks site generated from a local notes directory of markdown bookmark files. It is primarily a fast personal archive for finding saved links again, while also offering clean public browsing for anyone who opens the site.

## Core Value

Saved links must be easy to sync from notes and fast to find again through simple browsing and filtering.

## Requirements

### Validated

- ✓ Import bookmark metadata from notes directory into committed JSON dataset — v1.0 Phase 1
- ✓ Browse bookmarks publicly with search, tag filtering, and category filtering — v1.0 Phase 3
- ✓ Static site deployable on Cloudflare Pages — v1.0 Phase 4
- ✓ Dark theme by default — v1.1 Phase 5
- ✓ Remove tag pills, use dropdown only — v1.1 Phase 5
- ✓ Integrated search in dropdown — v1.1 Phase 5
- ✓ Side panel for bookmark details — v1.1 Phase 5
- ✓ External link visual distinction (icon + color) — v1.1 Phase 5
- ✓ Selected tag visually distinct — v1.2 Phase 6
- ✓ Dropdown and preview area tag selection synced — v1.2 Phase 6
- ✓ Preview show description instead of tags — v1.2 Phase 6
- ✓ External link icon removed — v1.2 Phase 6

### Active

<!-- v1.3 Simplification -->

- [ ] Remove `/b/[slug]` bookmark detail pages
- [ ] Remove `/tags/[tag]` tag listing pages
- [ ] Remove `/category/[...path]` category listing pages

### Out of Scope

- Server side rendering — intentionally static for simpler deployment
- Rendering bookmark markdown bodies — v1 uses frontmatter metadata only
- Light theme toggle — dark theme is the primary experience
- Dedicated detail pages — side panel provides same info on main page

## Context

- Source bookmarks live outside this repo at `../notes/resources/bookmarks/marks/`
- Source files are markdown with YAML frontmatter
- `articles/` include extra `.png` files and must be excluded from sync
- 186 bookmark records in committed dataset
- Routes: `/` only (after v1.3)
- Deployed on Cloudflare Pages

## Constraints

- **Tech stack**: Astro with Bun workflows and Cloudflare Pages deployment
- **Deployment**: Builds must succeed without access to the external notes repo
- **Data quality**: Invalid frontmatter or incomplete records warn and skip instead of breaking build
- **UI approach**: Dark theme, minimal UI, homepage with sidebar for navigation

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bun for scaffold, local dev, and build commands | One consistent toolchain | ✓ Good |
| Commit generated bookmark content into repo | Cloudflare Pages cannot access external notes | ✓ Good |
| Prioritize fast archival lookup over feature breadth | Primary user need is finding links | ✓ Good |
| Side panel for bookmark details | Eliminates page transitions, keeps context | ✓ Good |
| Warm dark theme (#1a1614, #d4a574) | User preference | ✓ Good |
| Remove tag pills, use dropdown only | Cleaner UI, less visual noise | ✓ Good |
| Integrated search in dropdown | Single control for search + filter | ✓ Good |
| Selected tag with checkmark indicator | Visual distinction for active filter | ✓ Good |
| Description in preview tooltip | Better quick info than tags | ✓ Good |
| External link icon removed | Cleaner UI per user feedback | ✓ Good |
| Homepage-only navigation | Side panel + search provides all needed access | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-01 after v1.3 milestone start*
