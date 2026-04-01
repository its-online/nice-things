# Phase 3: Homepage Retrieval UX - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the public homepage with search, tag/category filters, deterministic ordering, and empty states. Visitors can use the homepage as the fastest retrieval surface for the bookmark archive.

</domain>

<decisions>
## Implementation Decisions

### Default Bookmark Ordering
- By category first, then alphabetical within each category. Groups related bookmarks together for topic-based browsing.

### Search UX
- Real-time filter as you type with debounce. Instant results as user types.

### the agent's Discretion
Filter UI presentation (pills vs dropdown vs sidebar), empty state visual design, and other implementation details are at the agent's discretion.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/bookmarks.json` — normalized bookmark dataset
- `src/lib/bookmarks/types.ts` — BookmarkRecord interface
- `src/lib/bookmarks/routes.ts` — `getAllTags()` and `getAllCategoryPaths()` helpers
- `src/styles/shared.css` — Design system tokens

### Established Patterns
- Serif font family: "Iowan Old Style", Georgia, serif
- Warm cream gradient: linear-gradient(180deg, #f6efe0 0%, #fffaf2 100%)
- Text: #2f2418
- Max width: 42rem with 1.5rem padding
- Bookmark detail: two-column layout (Phase 2)
- Tag/category listings: vertical list (Phase 2)

### Integration Points
- Homepage: src/pages/index.astro (currently scaffold)
- Search/filter state: URL query params for shareability

</code_context>

<specifics>
## Specific Ideas

No additional specifics — using decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
