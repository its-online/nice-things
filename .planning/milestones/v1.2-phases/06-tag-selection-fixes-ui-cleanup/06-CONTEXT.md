# Phase 6: Tag Selection Fixes & UI Cleanup - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix tag selection interaction bugs and remove external link icon per user feedback.

</domain>

<decisions>
## Implementation Decisions

### TAG-01: Selected Tag Distinct
- Selected tag in dropdown needs stronger visual distinction
- CSS currently uses `var(--color-accent)` background but may not stand out enough
- Solution: Add a clear visual indicator (e.g., checkmark, different background intensity, or underline)

### TAG-02 & TAG-03: Dropdown/Preview Area Sync
- User selects tag in dropdown, but preview area doesn't update to show what's selected
- Add a "selected tag" display area near the bookmark list that shows currently active tag
- When tag is selected in dropdown, this preview area updates
- When user clicks tag in preview area, dropdown updates

### PREVIEW-01: Description in Preview
- Hover tooltip currently shows tags (tooltipTags)
- Change to show bookmark description instead

### CLEANUP-01: Remove External Icon
- Remove the external link icon SVG from bookmark title buttons
- The bookmark title button already links to the external URL, icon is redundant

</decisions>

<code_context>
## Existing Code Insights

### Files to Modify
- `src/pages/index.astro`

### Current Issues (from code review)
1. Line 209-213: `external-icon` SVG in bookmark-title-btn - needs removal
2. Line 243-244: tooltipTags shows tags - should show description instead
3. Lines 313-338: updateFilterOptions() sets active class but no preview area syncs
4. No "selected tag" visual indicator in the bookmark list area

### CSS Variables (from shared.css dark theme)
- `--color-accent`: #d4a574 (amber)
- `--color-bg`: #1a1614 (dark background)
- `--color-bg-elevated`: slightly lighter
- `--color-text`: #e8e0d5 (light text)
- `--color-border`: rgba(232, 224, 213, 0.1)

</code_context>

<specifics>
## Specific Ideas

1. Selected tag: Add a visual badge or highlight to show "Tag: selected" in a visible area
2. Sync: Add event listener so clicking in preview area updates activeTag and calls updateFilterOptions()
3. Description: Change tooltip to show `bookmark.description` instead of `bookmark.tags`
4. Icon: Remove the entire `<svg class="external-icon">...</svg>` block from bookmark-title-btn

</specifics>

<deferred>
## Deferred Ideas

None — all issues are clear from user feedback.

</deferred>
