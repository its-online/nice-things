# Technology Stack

**Project:** Nice Things
**Researched:** 2026-03-31

## Recommended Stack

This should be a static Astro site with a local sync pipeline that emits committed JSON data, not a runtime app and not a markdown-rendering pipeline. The source of truth stays in the notes repo, but the deploy artifact inside this repo should be typed, normalized, and buildable without external filesystem access.

### Core Framework
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `astro` | `5.x` stable | Static site framework | Astro is the standard fit for content-heavy static sites, and its content collections are the native way to model structured content. For this project, that means typed bookmark entries, static route generation, and minimal shipped JS. Use current stable `5.x`, not Astro 6 until this repo actually needs v6-only features. | HIGH |
| `typescript` | `5.8+` | App and sync script typing | The sync path is where this project can silently rot: malformed frontmatter, empty tags, duplicate slugs, and inconsistent category paths. TypeScript keeps the normalization layer explicit and testable instead of letting it become ad hoc string handling. | MEDIUM |
| `bun` | `1.2.x` | Package manager, script runner, local runtime | Bun is already part of the project intent, Astro documents Bun usage directly, and Cloudflare Pages currently ships Bun in the build image with `BUN_VERSION` support. That makes one toolchain viable from local sync to CI build. | HIGH |

### Data Layer
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro content collections + `file()` loader | Built into Astro 5 | Load committed generated bookmark data | This is the key stack choice. Do not generate per-bookmark markdown files in `src/content/`. Instead, generate one committed `src/data/bookmarks.json` file and load it through a content collection with Astro’s `file()` loader. Your source notes are markdown, but your deploy artifact is structured data. That matches the project’s frontmatter-only scope, reduces file churn, simplifies diffs, and keeps schema validation centralized. | HIGH |
| `astro:content` schema (`zod`) | Built into Astro 5 | Validate bookmark shape at build time | Astro’s collection schema gives you one canonical contract for `title`, `url`, `tags`, `done`, `categoryPath`, `slug`, and `sourceRelativePath`. Use that as the build-time gate after sync normalization. | HIGH |
| `gray-matter` | `4.x` | Parse YAML frontmatter from source markdown notes | The source format is markdown with YAML frontmatter, and `gray-matter` remains the standard battle-tested parser for exactly that. It is simpler and more reliable here than writing delimiter parsing yourself. | MEDIUM |

### Infrastructure
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Cloudflare Pages | Current Pages static build flow | Hosting and CI/CD | The site is static and Cloudflare Pages already has an Astro deploy path with `dist` output and preview deployments. This fits the committed-generated-content model well because the Pages build does not need access to the external notes directory. | HIGH |
| GitHub repository + Pages Git integration | Current | Source-driven deploys | This project wants generated content committed. Git-based deploys are the right operational model because every sync becomes auditable in diffs and every deploy is reproducible from the repo alone. | HIGH |

### Supporting Libraries
| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| `@astrojs/sitemap` | current Astro-compatible | Generate sitemap for bookmark, tag, and category pages | Use by default for a public archive. It is low-cost and helps discoverability for a site with many static routes. | HIGH |
| `@astrojs/check` | current Astro-compatible | Astro-aware type and diagnostics check | Use in CI and before deploys. This catches Astro/content typing issues earlier than a failed production build. | MEDIUM |
| `vitest` | `3.x` | Unit tests for sync normalization | Use for slug collision checks, invalid frontmatter handling, empty tags normalization, and category path derivation. This project’s real complexity is in the sync logic, not the UI. | MEDIUM |
| `@playwright/test` | `1.55+` | Static build smoke tests | Use for a small set of end-to-end checks: homepage loads, tag/category pages resolve, bookmark detail pages render, and client filtering works. Keep coverage narrow. | MEDIUM |
| `eslint-plugin-astro` | `1.x` | Lint Astro and TS files | Use if you want linting from the start. It is useful, but secondary to `astro check`, tests, and formatting for this project size. | MEDIUM |
| `prettier` | `3.x` | Formatting for Astro, TS, JSON, Markdown | Use by default. Generated JSON and content config files become noisy fast without consistent formatting. | MEDIUM |

## Prescriptive Implementation Choices

### 1. Generated artifact shape

Use:
- Source input: external markdown notes with YAML frontmatter
- Normalization output: `src/data/bookmarks.json`
- Astro collection: `src/content.config.ts` with `file("src/data/bookmarks.json")`

Do not use:
- Generated markdown files per bookmark in `src/content/bookmarks/*.md`

Why:
- v1 ignores markdown body content
- JSON is a better deploy artifact than synthetic markdown when the site only needs metadata
- one generated file is easier to diff, validate, and commit than hundreds of synthetic files
- Astro’s `file()` loader already supports JSON arrays with explicit IDs

### 2. Search and filtering UI

Use:
- Astro pages for static route generation
- a small client-side TypeScript module for homepage filtering
- simple in-memory filtering over the already-rendered bookmark payload

Do not use:
- React, Preact, or another client framework for v1
- Pagefind for v1

Why:
- The project only has about 200 bookmarks today and the filter surface is structured metadata, not large document bodies
- Astro’s default value is minimal client JS; introducing a UI framework here adds maintenance without solving a real problem
- Pagefind is strong for static full-text indexing across large HTML sites, but this archive needs deterministic metadata filtering first, not a second indexing pipeline

If fuzzy search becomes important later, add `fuse.js` then. Do not pay that complexity up front.

### 3. Deployment config

Use:
- Build command: `bun run build`
- Output directory: `dist`
- Cloudflare Pages env pin: `BUN_VERSION=1.2.15` or the chosen Bun release for the repo

Do not use:
- `@astrojs/cloudflare` for v1 static output
- Pages Functions / SSR

Why:
- Astro’s own Cloudflare integration docs explicitly say a static Astro site does not need the adapter
- Adding the adapter now would push the project toward server concerns it does not have
- Static output is simpler, cheaper, and better aligned with committed generated content

### 4. Validation boundary

Use:
- frontmatter parsing in the sync script
- normalization in the sync script
- schema validation in Astro content collections
- unit tests around sync edge cases

Do not use:
- “best effort” silent coercion everywhere
- build-time dependence on the external notes directory

Why:
- The external notes directory is messy by definition
- normalization failures should warn and skip invalid records, while schema and duplicate-slug failures should stay explicit
- Cloudflare must be able to build from committed repo contents only

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Hosting integration | Plain static Astro on Cloudflare Pages | `@astrojs/cloudflare` adapter | Unnecessary for static output; adds SSR-oriented complexity with no v1 benefit. |
| Generated content format | Single committed JSON file | Generated markdown collection files | Worse diff churn, more filesystem noise, and no benefit when bookmark bodies are ignored. |
| Search | Small custom client-side filter | Pagefind | Better for full-text document search at scale than for a small structured bookmark archive. |
| Client interactivity | Vanilla Astro + small TS script | React/Preact island | Extra framework weight for a filtering widget is unjustified at this size. |
| Persistence | No database | Astro DB / SQLite / D1 | The source of truth is local markdown notes; a DB duplicates state and complicates sync. |
| Runtime model | Fully static | SSR / hybrid rendering | Violates the project’s explicit v1 scope and adds operational cost. |

## Installation

```bash
# Core
bun add astro gray-matter

# Astro integrations
bun add @astrojs/sitemap

# Dev dependencies
bun add -d typescript @types/bun @astrojs/check vitest @playwright/test prettier eslint eslint-plugin-astro
```

## Recommended Scripts

```json
{
  "scripts": {
    "dev": "bun run sync:bookmarks && astro dev",
    "build": "bun run sync:bookmarks && astro build",
    "preview": "astro preview",
    "sync:bookmarks": "bun run scripts/sync-bookmarks.ts",
    "check": "astro check && tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "format": "prettier --write ."
  }
}
```

## Recommendation Summary

Use Astro 5 + Bun 1.2 + TypeScript, emit one committed normalized JSON file, load it through an Astro content collection, deploy pure static output to Cloudflare Pages, and keep search/filtering as a tiny client-side enhancement instead of introducing SSR, a database, or a search indexer.

That is the standard 2026 stack for this exact problem because it keeps the system aligned with the real shape of the product: local markdown notes in, typed static archive out.

## Sources

- Astro content collections docs: https://docs.astro.build/en/guides/content-collections/
- Astro Bun recipe: https://docs.astro.build/en/recipes/bun/
- Astro Cloudflare integration docs: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Cloudflare Pages Astro guide: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Cloudflare Pages build image docs: https://developers.cloudflare.com/pages/configuration/build-image/
- Bun docs: https://bun.sh/docs
- `gray-matter` package: https://www.npmjs.com/package/gray-matter
- `vitest` package: https://www.npmjs.com/package/vitest
- `@playwright/test` / Playwright package: https://www.npmjs.com/package/playwright
- `eslint-plugin-astro` package: https://www.npmjs.com/package/eslint-plugin-astro
- `prettier` package: https://www.npmjs.com/package/prettier
- `@astrojs/check` package: https://www.npmjs.com/package/%40astrojs/check
- Pagefind filtering docs: https://pagefind.app/docs/filtering/
