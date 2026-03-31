# Architecture Patterns

**Domain:** Public static bookmarks archive generated from local markdown bookmark notes
**Researched:** 2026-03-31

## Recommended Architecture

Use a two-stage static architecture:

1. A local-only ingestion pipeline reads bookmark markdown from the external notes repo and normalizes it into a committed content layer inside this Astro project.
2. Astro builds a fully static site from that committed content, using prerendered routes for bookmarks, tags, and categories, plus one small client island for homepage filtering.

That separation is the key boundary. The notes repo is an authoring source, not part of production runtime. Cloudflare Pages should only ever see this repo, committed generated bookmark entries, and a normal Astro static build.

```text
External notes repo
  -> sync script
  -> normalization + validation
  -> generated bookmark entries in src/content/bookmarks
  -> Astro content collection
  -> derived indexes in page generation
  -> static routes:
     /, /b/[slug], /tags/[tag], /category/[...path]
  -> dist/
  -> Cloudflare Pages
```

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| External bookmark source | Holds raw markdown bookmark notes under `../notes/resources/bookmarks/marks/` | Sync pipeline only |
| Sync pipeline | Scans files, excludes `articles/**`, parses frontmatter, normalizes fields, warns/skips bad records, fails on duplicate slugs | External source, generated content layer |
| Generated content layer | Stores normalized bookmark entries committed into `src/content/bookmarks` | Sync pipeline, Astro content collection |
| Astro content collection | Defines schema and typed access to bookmark entries at build time | Generated content layer, route builders |
| Route data layer | Derives lookup sets for homepage, tag pages, category pages, and detail pages | Content collection, Astro pages |
| Static page routes | Renders `/`, `/b/[slug]`, `/tags/[tag]`, `/category/[...path]` from build-time data | Route data layer, shared UI components |
| Filter island | Handles homepage search, tag filter, and category filter in the browser without server calls | Homepage route, serialized bookmark index |
| Shared presentation layer | Layouts, bookmark cards, taxonomy chips, breadcrumbs, metadata display | Static routes, filter island |
| Build/deploy layer | Runs sync before `astro build`, outputs `dist`, deploys to Cloudflare Pages | Sync pipeline, Astro build, Git/Cloudflare |

## Data Flow

### Primary build flow

```text
Raw markdown files
  -> file discovery
  -> frontmatter parse
  -> validation
  -> normalization
  -> duplicate slug check
  -> write normalized entries to src/content/bookmarks
  -> commit generated content
  -> Astro getCollection('bookmarks')
  -> route generation and page rendering
  -> static dist output
```

### Per-route flow

```text
Bookmark detail page
  content collection entry
  -> getStaticPaths() per slug
  -> /b/[slug]

Tag page
  all bookmarks
  -> unique normalized tags
  -> getStaticPaths() per tag
  -> /tags/[tag]

Category page
  all bookmarks
  -> unique categoryPath values
  -> getStaticPaths() per path
  -> /category/[...path]

Homepage
  all bookmarks
  -> sorted lightweight bookmark index
  -> static HTML + serialized filter data
  -> client island performs local filtering
```

### Runtime flow

In production, there should be no request-time data fetch. A visitor requests a prerendered HTML page, Astro serves static HTML, and only the homepage filter island hydrates on the client. This matches Astro’s default static model and keeps the site fast and cheap to host.

## Patterns to Follow

### Pattern 1: Source/Artifact Separation
**What:** Treat the external notes directory as the source of truth and `src/content/bookmarks` as a generated deploy artifact.
**When:** Always, because Cloudflare Pages cannot depend on local notes during CI builds.
**Why:** This prevents build-time coupling to external filesystem state and makes deployments reproducible.

### Pattern 2: Normalize Before Astro Sees Data
**What:** Perform cleanup in the sync script, not in page templates.
**When:** While importing frontmatter fields such as `tags`, `bookmark_done`, category folders, and slug.
**Why:** Astro pages should consume clean typed records, not carry source-specific edge-case logic.
**Example:**
```ts
type BookmarkEntry = {
  title: string;
  url: string;
  description?: string;
  tags: string[];
  done: boolean;
  categoryPath: string[];
  slug: string;
  sourceRelativePath: string;
};
```

### Pattern 3: Build-Time Taxonomy Expansion
**What:** Derive tags and categories from the bookmark collection during page generation.
**When:** For `/tags/[tag]` and `/category/[...path]`.
**Why:** Astro static mode requires all dynamic paths to be known at build time, so taxonomy pages must come from content-derived `getStaticPaths()` output.

### Pattern 4: One Interactive Island, Not a Client App
**What:** Keep filtering logic in a small homepage island and leave the rest of the site static.
**When:** Search and faceted filtering on `/`.
**Why:** Astro’s islands model avoids shipping JavaScript for pages that do not need it; a full SPA shell would add complexity with no product benefit here.

### Pattern 5: Fail Soft on Bad Records, Fail Hard on Structural Conflicts
**What:** Skip malformed or incomplete entries with warnings, but abort sync for duplicate slugs.
**When:** During sync.
**Why:** Bad individual notes should not block the whole archive, but ambiguous routes will break site correctness.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Reading the Notes Repo During Cloudflare Build
**What:** Making Astro build depend on `../notes/...` in CI.
**Why bad:** Production builds become non-reproducible and will fail when that path is unavailable.
**Instead:** Commit normalized generated entries into this repo before deployment.

### Anti-Pattern 2: Parsing Raw Frontmatter Inside Astro Pages
**What:** Letting route files parse source markdown directly.
**Why bad:** Validation, normalization, and rendering concerns get mixed; errors become harder to test and reason about.
**Instead:** Keep parsing in the sync pipeline and expose a stable typed content collection.

### Anti-Pattern 3: Using SSR for v1 Filtering
**What:** Adding server rendering or database-backed search for homepage filters.
**Why bad:** It adds infrastructure and runtime complexity to a dataset that is small and static.
**Instead:** Use static HTML plus client-side filtering over a compact serialized index.

### Anti-Pattern 4: Flattening Category Logic Into Strings Too Early
**What:** Storing categories only as one joined string.
**Why bad:** Breadcrumbs, nested routes, and future category navigation become awkward.
**Instead:** Keep `categoryPath: string[]` as the canonical representation and derive joined forms only for URLs or labels.

## Suggested Build Order

1. **Sync foundation**
   - Build the importer/normalizer first.
   - Define the normalized bookmark contract and duplicate-slug behavior.
   - This is the foundation because every downstream route depends on stable generated content.

2. **Content schema and fixtures**
   - Add Astro content collection schema for bookmarks.
   - Check that generated entries load correctly through Astro APIs.
   - This catches schema drift before UI work starts.

3. **Core route generation**
   - Implement `/b/[slug]`, `/tags/[tag]`, and `/category/[...path]` with `getStaticPaths()`.
   - This proves the archive shape and taxonomy model before homepage polish.

4. **Homepage archive experience**
   - Build the static index page and the single client island for search/filtering.
   - Use the already-stable content contract and route taxonomy.

5. **Shared UI and metadata polish**
   - Add layouts, cards, breadcrumbs, tag chips, external-link handling, empty states, and canonical metadata.
   - This is safer once core data contracts and page shapes are fixed.

6. **Build/deploy integration**
   - Wire `sync:bookmarks` into `bun run build`.
   - Configure Cloudflare Pages to build from committed generated content only.
   - Add regression checks around sync counts and static route coverage.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Traffic serving | Static hosting is trivial | Still trivial on CDN | Still trivial; CDN does the work |
| Bookmark volume | Simple in-memory arrays during build | Still fine for low thousands of entries | May need lighter serialized indexes or pagination if content grows substantially |
| Search/filter UX | Client-side filtering is simple | Still acceptable for a few thousand bookmarks | Reassess if payload becomes too large; precomputed mini-index or split archive pages may be needed |
| Taxonomy generation | Build-time route derivation is cheap | Still cheap | Watch build duration if tag/category counts explode |
| Authoring reliability | Manual sync is acceptable | Add validation and CI checks | Add stronger import reporting and content QA if more editors are involved |

## Build Order Implications For Roadmap

- Phase 1 should establish the ingest boundary and normalized schema before any frontend work.
- Phase 2 should prove static route generation for bookmark, tag, and category pages.
- Phase 3 should add homepage filtering as an island, not as a site-wide client app.
- Deployment should come after generated-content commits and build reproducibility are verified.

## Confidence

**Overall confidence:** HIGH

- **HIGH:** Astro content collections are the right fit for typed, build-time local content.
- **HIGH:** Dynamic bookmark/tag/category routes should be generated with `getStaticPaths()` in static mode.
- **HIGH:** Cloudflare Pages can deploy the resulting static Astro build from `dist`.
- **MEDIUM:** Client-side filtering remains the right long-term approach if the archive grows far beyond the current ~200 entries; revisit only if payload size becomes noticeable.

## Sources

- Astro content collections docs: https://docs.astro.build/en/guides/content-collections/
- Astro `getStaticPaths()` static routing requirement: https://docs.astro.build/en/reference/errors/get-static-paths-required/
- Astro islands architecture docs: https://docs.astro.build/en/concepts/islands/
- Astro template directives reference: https://docs.astro.build/en/reference/directives-reference/
- Cloudflare Pages Astro deployment guide: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
