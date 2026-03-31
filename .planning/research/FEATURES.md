# Feature Landscape

**Domain:** Public bookmark archive generated from local markdown notes
**Researched:** 2026-03-31
**Overall confidence:** MEDIUM

## Scope Framing

Reference set used for this feature split:

- Raindrop.io: modern bookmark manager with public collection pages, tags, filters, previews, full-text search, and backups
- Linkwarden: bookmark manager plus web archive with public collections, preservation, reader mode, annotations, and advanced search
- Pinboard: older but still relevant public bookmarking baseline with public pages, tags, search, and feeds
- Are.na: public collection/channel model with strong browsing, metadata extraction, and export/collaboration patterns

For this project, the right v1 is not "mini-Raindrop." It is a fast, static, public archive for re-finding links. That means table stakes should bias toward retrieval and browsing, while archival, collaboration, and automation features stay out of scope.

## Table Stakes

Features users expect from a public bookmark archive. Missing these makes the site feel unfinished or hard to use.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Homepage bookmark index | Every reference product exposes a browsable top-level list or collection view | Low | Must show all public bookmarks with fast initial render |
| Client-side search across title, URL, description, and tags | Search is the primary retrieval path in Pinboard, Raindrop.io, and Linkwarden | Medium | Use lightweight static index; prioritize substring matching over advanced syntax in v1 |
| Tag filtering | Tags are a standard organizational axis across all benchmark products | Medium | Needs normalized lowercase tags and empty-tag handling |
| Category or collection browsing | Public bookmark products consistently expose folders, collections, or channels | Medium | Your `categoryPath` should map directly to browsable archive pages |
| Stable bookmark detail pages | Public archives need a canonical page per saved link for sharing and re-finding | Low | `/b/[slug]` is enough if it includes all useful metadata and outbound link |
| Outbound link plus clear metadata | Users expect title, URL, description, tags, and category context at minimum | Low | Metadata-only detail pages fit the project scope well |
| Shareable tag pages | Tag archives are a common public navigation pattern | Medium | Needed for SEO and direct navigation even if homepage filtering exists |
| Shareable category pages | Collection/category landing pages are a standard public entry point | Medium | Important for shallow browsing when search intent is weak |
| Basic sort order | Users expect predictable browse order, usually newest first or manually curated | Low | Pick one default in v1; newest-first is simplest for retrieval |
| Clean empty states and zero-result feedback | Search and filtering without empty-state handling feels broken | Low | Required for usability once filters combine |

## Differentiators

Features that add real value, but are not required for a retrieval-first static v1.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Full-text search over saved page content | Moves the archive from metadata lookup to true research retrieval | High | Strong differentiator, but conflicts with metadata-only v1 and static simplicity |
| Saved previews or screenshots | Makes scanning faster and gives visual recognition cues | Medium | Useful later if metadata quality is uneven |
| Archived copy / anti-link-rot preservation | Protects the archive from dead links and content drift | High | Core differentiator in Linkwarden and Pinboard archive modes |
| RSS or JSON feeds for all bookmarks, tags, and categories | Lets people subscribe to new additions and reuse the archive elsewhere | Medium | Strong public-web feature with low ongoing product complexity |
| Related bookmarks on detail pages | Improves discovery without adding new IA complexity | Medium | Can be derived from shared tags or category path |
| Domain/source filtering | Helpful for retrieval when users remember the site but not the title | Medium | Often more useful than complex search syntax in personal archives |
| Multiple list views | Supports different scanning behaviors: dense list, cards, headlines | Medium | Nice-to-have, not needed for a focused v1 |
| Manual pinning or featured bookmarks | Gives the homepage editorial shape instead of a pure dump | Low | Good differentiator if you want a more curated public front page |
| Export surfaces for public collections | Makes the archive feel durable and reusable | Medium | HTML/JSON/RSS export fits public-web expectations better than account features |
| Reading annotations or highlights | Valuable for research archives, but changes the product from bookmark archive to knowledge tool | High | Defer unless note bodies become first-class |

## Anti-Features

Features to explicitly avoid in this milestone because they dilute the retrieval-first goal or force a different architecture.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| User accounts, saves, likes, comments | Pulls the project toward an app, moderation burden, and server state | Keep the site fully public and read-only |
| Collaborative collections | Valuable in Linkwarden/Are.na, but irrelevant for a personal static archive | Generate public pages from one source-of-truth notes directory |
| Browser extension or capture workflow | Capture is already solved by local markdown notes | Invest in reliable sync and normalization instead |
| AI tagging, summarization, or chat | Expensive, brittle, and unnecessary before basic retrieval proves itself | Start with clean metadata and simple keyword search |
| Full web clipping / reader mode in v1 | Adds storage, parsing, and content-rights complexity | Keep metadata-only pages and link out to originals |
| Heavy visual card UI with thumbnails everywhere | Slows browsing and weakens density for a retrieval-first archive | Prefer dense lists; add optional previews later |
| Complex advanced search syntax | Powerful, but overkill for a small v1 archive and hurts discoverability | Ship simple search + visible tag/category filters first |
| Personalized recommendations or ranking | Requires behavior data and state the product does not need | Use deterministic sorting and optional related-items logic later |

## Feature Dependencies

```text
Normalized bookmark metadata -> Homepage bookmark index
Normalized bookmark metadata -> Stable bookmark detail pages
Normalized tags -> Tag filtering
Normalized tags -> Shareable tag pages
Normalized categoryPath -> Category or collection browsing
Normalized categoryPath -> Shareable category pages
Homepage bookmark index -> Client-side search
Homepage bookmark index -> Basic sort order
Homepage bookmark index + filters -> Clean empty states and zero-result feedback
Stable bookmark detail pages + normalized tags/categoryPath -> Related bookmarks
Archived page content -> Full-text search over saved page content
Archived page content -> Archived copy / anti-link-rot preservation
Stored screenshots/previews -> Saved previews or screenshots
Public archive routes -> RSS or JSON feeds for all bookmarks, tags, and categories
```

## MVP Recommendation

Prioritize:

1. Homepage bookmark index
2. Client-side search across title, URL, description, and tags
3. Tag filtering
4. Category or collection browsing
5. Stable bookmark detail pages
6. Shareable tag pages and shareable category pages
7. Basic sort order plus clean empty states

This is the smallest credible product that matches current public bookmark expectations while staying aligned with the project constraints: static Astro build, metadata-only content, and fast retrieval.

## Recommended v1 vs Later

**Build in v1**

- Public homepage with dense list rendering
- Search box
- Tag filters
- Category filters
- Dedicated tag pages
- Dedicated category pages
- Bookmark detail page with outbound link and metadata
- Deterministic sort order
- Empty states for no results and missing metadata

**Defer to v1.1+**

- RSS/JSON feeds
- Related bookmarks
- Domain filtering
- Featured bookmarks

**Defer beyond v1 unless product direction changes**

- Full-text search
- Screenshots/previews
- Link preservation/archive copies
- Annotations/highlights
- Accounts/collaboration
- AI features

## Sources

- Raindrop.io homepage: https://raindrop.io/ (HIGH for current product capabilities shown publicly)
- Raindrop.io help center: https://help.raindrop.io/ (MEDIUM for product positioning and public-page expectations)
- Linkwarden docs overview: https://docs.linkwarden.app/Usage/overview (HIGH)
- Linkwarden collections docs: https://docs.linkwarden.app/Usage/collections (HIGH)
- Linkwarden advanced search docs: https://docs.linkwarden.app/Usage/advanced-search (HIGH)
- Linkwarden product site: https://linkwarden.app/ (MEDIUM, marketing claims but current)
- Are.na channels docs: https://help.are.na/docs/getting-started/channels (HIGH)
- Are.na blocks docs: https://help.are.na/docs/getting-started/blocks (HIGH)
- Are.na about/features page: https://www.are.na/about (MEDIUM)
- Pinboard blog update on public pages: https://blog.pinboard.in/ (MEDIUM; confirms continued importance of public pages)
- Example Pinboard public-board usage notes showing search, tag filters, and RSS: https://notes.pinboard.in/u:yrecs/notes/f1e5bb2ba91dd9d863ce (LOW; community example, used only to support older baseline patterns)

## Confidence Notes

- **Table stakes:** MEDIUM-HIGH. Strong agreement across current bookmark/archive products that search, tags, collections/categories, and shareable public pages are baseline.
- **Differentiators:** MEDIUM. Full-text search, preservation, previews, collaboration, and annotations are consistently marketed as premium or advanced capabilities rather than baseline.
- **Anti-features for this project:** HIGH as a product recommendation, because they directly follow from the static, metadata-only, retrieval-first constraints in [PROJECT.md](/mnt/data/Projects/nice-things/.planning/PROJECT.md) and [prd.md](/mnt/data/Projects/nice-things/prd.md).
