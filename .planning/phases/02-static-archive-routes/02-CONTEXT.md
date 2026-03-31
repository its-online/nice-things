# Phase 2: Static Archive Routes - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the Astro content model and generate bookmark, tag, and category routes from the synced bookmark dataset. Visitors can open every bookmark, tag, and category page as prerendered static routes generated from the normalized bookmark dataset.

</domain>

<decisions>
## Implementation Decisions

### Bookmark Detail Page Layout
- Two column layout: Title + Description on left, metadata (URL, tags, category, source) in a sidebar for quick access

### Tag & Category Listing Pages
- Simple vertical list: Title and URL in a stack. Fast to scan, matches the minimal aesthetic.

### the agent's Discretion
All other implementation choices are at the agent's discretion — route generation approach, Astro component structure, and build-time route discovery.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/bookmarks.json` — normalized bookmark dataset (BookmarkRecord[])
- `src/lib/bookmarks/types.ts` — BookmarkRecord, SyncWarning, SyncStats interfaces
- `src/lib/bookmarks/schema.ts` — validation logic
- `src/lib/bookmarks/sync.ts` — sync pipeline

### Established Patterns
- Astro pages in `src/pages/` directory
- Serif font family for headings: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia
- Warm cream gradient: linear-gradient(180deg, #f6efe0 0%, #fffaf2 100%)
- Dark text: #2f2418
- Max content width: 42rem with 1.5rem padding

### Integration Points
- Bookmark data: imported from `../data/bookmarks.json`
- Routes needed: `/b/[slug]`, `/tags/[tag]`, `/category/[...path]`

</code_context>

<specifics>
## Specific Ideas

No additional specifics — using decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
