# Nice Things

## What This Is

Nice Things is a public Astro-based bookmarks site generated from a local notes directory of markdown bookmark files. It is primarily a fast personal archive for finding saved links again, while also offering clean public browsing for anyone who opens the site.

## Core Value

Saved links must be easy to sync from notes and fast to find again through simple browsing and filtering.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Import bookmark metadata from the notes directory into the Astro repo as normalized content
- [ ] Let visitors browse bookmarks publicly with search, tag filtering, and category filtering
- [ ] Generate bookmark, tag, and category pages as a static site deployable on Cloudflare Pages

### Out of Scope

- Server-side rendering — v1 is intentionally static for simpler deployment and lower maintenance
- Rendering bookmark markdown bodies — v1 uses frontmatter metadata only to keep sync and page generation simple

## Context

- Source bookmarks live outside this repo at `../notes/resources/bookmarks/marks/`
- Source files are markdown with YAML frontmatter; sampled files are currently frontmatter-only
- `articles/` includes extra `.png` files and must be excluded from sync
- `tags` may be empty and `bookmark_done` may be blank, so normalization is required
- There are currently 194 markdown bookmark files excluding `articles/`, with no slug collisions at the moment
- Generated bookmark content should be committed into this repo so Cloudflare Pages can build without access to the notes directory
- v1 routes are expected at `/`, `/tags/[tag]`, `/category/[...path]`, and `/b/[slug]`

## Constraints

- **Tech stack**: Astro with Bun workflows and Cloudflare Pages deployment — matches the intended static-site architecture and hosting target
- **Deployment**: Builds must succeed without access to the external notes repo — generated content has to be committed locally
- **Data quality**: Invalid frontmatter or incomplete bookmark records must warn and skip instead of breaking the site build — source notes are not guaranteed clean
- **Scope**: Homepage filtering in v1 is limited to search, tag, and category — keeps the first release focused on retrieval speed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bun for scaffold, local dev, and build commands | One consistent toolchain keeps project setup and deployment simpler | — Pending |
| Keep `/b/[slug]` as a metadata-only detail page in v1 | The archive value is in reliable retrieval, not rich bookmark rendering yet | — Pending |
| Commit generated bookmark content into the repo | Cloudflare Pages cannot depend on the external notes directory during builds | — Pending |
| Prioritize fast archival lookup over feature breadth | The primary user need is quickly finding saved links again | — Pending |

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
*Last updated: 2026-03-31 after initialization*
