# Phase 7: Route Cleanup - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure cleanup - no UI decisions)

<domain>
## Phase Boundary

Remove dedicated `/b/`, `/tags/`, and `/category/` pages from the site since the homepage with sidebar provides all necessary navigation.

</domain>

<decisions>
## Implementation Decisions

### Files to Remove
- `src/pages/b/[slug].astro` - bookmark detail pages
- `src/pages/tags/[tag].astro` - tag listing pages
- `src/pages/category/[...path].astro` - category listing pages

### Verification
- Run `bun run build` and verify only `/` is generated (no `/b/`, `/tags/`, `/category/`)
- Verify homepage still shows all bookmarks via search/filter

### the agent's Discretion
All other implementation choices are at the agent's discretion.

</decisions>

<code_context>
## Existing Code

### Files to Delete
- src/pages/b/[slug].astro
- src/pages/tags/[tag].astro
- src/pages/category/[...path].astro

### Keep
- src/pages/index.astro - homepage with sidebar
- src/data/bookmarks.json - bookmark data
- src/lib/bookmarks/ - bookmark utilities

</code_context>

<specifics>
## Specific Tasks

1. Delete src/pages/b/ directory
2. Delete src/pages/tags/ directory  
3. Delete src/pages/category/ directory
4. Run `bun run build` to verify
5. Check build output only contains index.html and static assets

</specifics>

<deferred>
## Deferred Ideas

None - straightforward cleanup.

</deferred>
