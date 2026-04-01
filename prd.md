# Astro Bookmarks Site From Notes

## Summary
Validated against the current environment:

- this directory is empty, so it can be used as the new repo root.
- Source bookmarks exist at `../notes/resources/bookmarks/marks/`.
- Current source shape is Markdown files with YAML frontmatter; sampled files are frontmatter-only.
- `tags` may be empty, `bookmark_done` may be blank, and `articles/` contains extra `.png` files that must be ignored.
- There are currently `194` Markdown bookmark files excluding `articles/`, and there are no basename slug collisions right now.

This plan is now implementation-ready with the missing decisions resolved:
- Standardize on `bun` for scaffold, local dev, and build commands.
- Use client-side static filtering/search on the homepage.
- Keep `/b/[slug]` as a metadata-only detail page for v1.
- Commit generated bookmark content into the Astro repo so Cloudflare Pages can build without access to notes directory.

## Key Changes
- Initialize a new Astro site directly in current directory using Bun.
- Treat notes directory as local read-only input only; never require it during Cloudflare builds.
- Add a sync script in the Astro repo that:
  - Reads all `*.md` files under `marks`.
  - Excludes `marks/articles/**` entirely.
  - Parses YAML frontmatter only; ignore markdown body for v1.
  - Skips entries missing `bookmark_title` or `bookmark_url` and logs warnings.
  - Skips files with invalid frontmatter and logs warnings instead of failing the build.
  - Normalizes tags by trimming and lowercasing; empty/missing tags become `[]`.
  - Normalizes `bookmark_done` to `done: boolean`, defaulting blank/missing values to `false`.
  - Sets `categoryPath` from relative folder segments under `marks`.
  - Sets `slug` from the filename without extension.
  - Fails sync if duplicate slugs are detected in the normalized output.
- Generate normalized content into `src/content/bookmarks` and commit that generated content to Git.
- Define one Astro content collection for bookmarks with this interface:
  - `title: string`
  - `url: string`
  - `description?: string`
  - `tags: string[]`
  - `done: boolean`
  - `categoryPath: string[]`
  - `slug: string`
  - `sourceRelativePath: string`
- Build these routes:
  - `/` static list page with client-side search, tag filter, and category filter.
  - `/tags/[tag]` generated tag pages using normalized tag values.
  - `/category/[...path]` generated category pages from `categoryPath`.
  - `/b/[slug]` detail pages showing title, URL, description, tags, category path, slug, and `sourceRelativePath`.
- Add scripts:
  - `bun run sync:bookmarks` for local import/normalize.
  - `bun run build` to run sync first, then `astro build`.
  - `bun run dev` may also run sync first, or document that sync must be run before local dev.
- Deploy to Cloudflare Pages from GitHub with:
  - Build command: `bun run build`
  - Output directory: `dist`
  - Optional `BUN_VERSION` pin in Pages settings
- Keep `BOOKMARKS_SOURCE_DIR` as a local-only override for sync; do not depend on it in Cloudflare.

## Tests
- Sync validation:
  - Counts match source `.md` files minus `articles/**` minus skipped invalid/incomplete entries.
  - Empty `tags` becomes `[]`.
  - Blank `bookmark_done` becomes `false`.
  - Missing `description` is allowed.
  - Invalid frontmatter is warned and skipped.
  - Duplicate slug detection aborts sync with a clear error.
- Site generation:
  - Homepage renders all normalized entries.
  - Client-side search filters by title, URL, description, and tags.
  - Tag pages build for every unique normalized tag.
  - Category pages build for every category path actually present.
  - Detail pages resolve for every slug.
- Regression checks:
  - Non-markdown files under excluded folders do not affect sync.
  - Cloudflare production build succeeds without access to the notes repo because generated content is committed.

## Assumptions
- v1 is a static content site, not SSR.
- Markdown body content is ignored in v1 even if some notes gain body text later.
- Tag route params use normalized lowercase tag values.
- `slug` stays filename-based and flat; future basename collisions are an error, not auto-renamed.
- The notes repo remains the source of truth; generated content in the Astro repo is a deploy artifact refreshed by sync.
- Cloudflare Pages supports Astro Git builds with `dist` output, and its current build image includes Bun support, so `bun run build` is viable:
  - https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
  - https://developers.cloudflare.com/pages/configuration/build-image/
