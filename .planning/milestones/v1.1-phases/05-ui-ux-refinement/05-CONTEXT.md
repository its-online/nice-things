# Phase 5: UI/UX Refinement - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Site has a dark-first redesign with cleaner layout (no tag pills, dropdown-only selectors, integrated search) and improved bookmark interactions (hover preview, side panel, visual distinction for external links).

</domain>

<decisions>
## Implementation Decisions

### Theme
- Dark-first design (full redesign, not just CSS variable swap)
- Warm dark palette: dark backgrounds with warm brown/amber tones
- Color scheme: #1a1614 background, warm accents
- CSS variables for theming

### Layout
- Tag pills removed from main UI
- Tag/category selector uses single dropdown only
- Search input integrated into the dropdown selector
- No dedicated `/b/[slug]` pages - replaced by side panel

### Side Panel
- Hover shows quick preview (title, URL, tags)
- Click opens detailed side panel
- Side panel slides in from right side
- Shows: title, external URL (clickable link), description, tags, category, source path
- "Visit Site" button opens external URL in new tab

### External Links
- Visual distinction: icon + color for external bookmark links
- External link icon on bookmark titles
- Different color (warm amber accent) for external links

### Bookmark Interactions
- Hover preview: title, URL, tags
- Click opens side panel with full details
- External links have icon + color distinction

### Search
- Integrated with tag/category dropdown
- Real-time filtering as user types (debounce)
- URL query params preserved

### Typography
- Keep serif font family ("Iowan Old Style", Georgia, serif)
- Consistent with warm dark aesthetic

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/bookmarks.json` — 186 bookmark records
- `src/lib/bookmarks/routes.ts` — `getAllTags()` and `getAllCategoryPaths()` helpers
- `src/styles/shared.css` — CSS variables (will be redesigned)
- `src/pages/index.astro` — current homepage with filters and bookmark list

### Established Patterns
- Serif font family: "Iowan Old Style", Georgia, serif
- CSS variables for theming (already in shared.css)
- URL query params for search/filter state
- Grouped bookmark list by category

### Integration Points
- Homepage: `src/pages/index.astro`
- Bookmark detail pages: `src/pages/b/[slug].astro` (will be superseded by side panel)
- Tag pages: `src/pages/tags/[tag].astro`
- Category pages: `src/pages/category/[...path].astro`

</code_context>

<specifics>
## Specific Ideas

- Dark background: #1a1614
- Warm amber accent for external links
- Side panel width: ~400px
- Smooth slide-in animation for side panel
- Hover preview could be a small tooltip/popover

</specifics>

<deferred>
## Deferred Ideas

None — UI/UX refinements fully scoped.

</deferred>
