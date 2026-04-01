# Phase 1: Sync Contract - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning
**Source:** Auto-captured via `$gsd-next`

<domain>
## Phase Boundary

Phase 1 delivers a reliable bookmark sync pipeline that imports markdown frontmatter from the external notes directory into one committed, normalized artifact inside this repo. It covers import rules, normalization, duplicate protection, and automated sync tests. Astro content collections, public routes, and homepage UX remain outside this phase.

</domain>

<decisions>
## Implementation Decisions

### Sync Artifact Contract
- **D-01:** The deployable sync output is one committed JSON artifact at `src/data/bookmarks.json`, not synthetic markdown files under `src/content/`.
- **D-02:** The sync reads bookmark markdown from `../notes/resources/bookmarks/marks/` by default, with `BOOKMARKS_SOURCE_DIR` allowed only as a local override for sync runs.
- **D-03:** Phase 1 stops at the normalized data contract; Astro content collection wiring and route generation are deferred to Phase 2.

### Parsing and Filtering Rules
- **D-04:** Sync reads YAML frontmatter only and ignores markdown body content in v1.
- **D-05:** Sync excludes `articles/**` entirely and ignores all non-markdown files.
- **D-06:** Records missing `bookmark_title` or `bookmark_url`, or containing invalid frontmatter, are warned and skipped instead of failing the full run.

### Normalized Bookmark Shape
- **D-07:** Every synced bookmark exposes `title`, `url`, optional `description`, normalized `tags`, normalized `done`, derived `categoryPath`, stable `slug`, and `sourceRelativePath`.
- **D-08:** Tags are normalized by trimming and lowercasing; empty or missing tags become `[]`.
- **D-09:** Blank or missing `bookmark_done` values normalize to `done: false`.
- **D-10:** `categoryPath` is derived from folder segments under `marks`, and `sourceRelativePath` preserves the repo-relative source location for debugging.

### Failure Semantics and Test Surface
- **D-11:** Public bookmark route identity is filename-based in v1: `slug` comes from the source filename stem.
- **D-12:** Duplicate slugs are a hard error that aborts sync before bad data is written.
- **D-13:** Phase 1 must ship fixture-driven automated tests covering normalization, skip/warn behavior, and duplicate detection before later phases depend on the dataset.

### the agent's Discretion
- Exact script/module layout for the sync pipeline and test fixtures.
- Warning message wording, as long as warnings clearly identify skipped files and reasons.
- Deterministic output ordering inside the generated JSON, as long as it stays stable across unchanged source input.

</decisions>

<specifics>
## Specific Ideas

- Keep Bun as the only package manager and task runner for scaffold, sync, test, and build commands.
- The current notes corpus contains 194 markdown files total, with 8 markdown files under `articles/` that must be excluded from sync.
- Sample bookmark files are frontmatter-only today, but the sync contract must remain correct if markdown body text appears later.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/ROADMAP.md` — Phase 1 goal, requirement mapping, and success criteria for the sync contract.
- `.planning/REQUIREMENTS.md` — `SYNC-01` through `SYNC-10` and `TEST-01` through `TEST-02`, which define the required sync behavior and automated coverage.
- `.planning/PROJECT.md` — Product constraints, source directory location, deployment constraints, and v1 route expectations that shape the data contract.

### Product decisions already resolved
- `prd.md` — Locked decisions for Bun tooling, metadata-only bookmark pages, committed generated content, and sync/test expectations.

### Research that affects planning
- `.planning/research/STACK.md` — Recommendation to emit one committed JSON dataset and keep Phase 1 focused on the normalization boundary.
- `.planning/research/SUMMARY.md` — Architecture rationale for a two-stage pipeline and the dependency ordering of Phase 1 before routing/UI work.
- `.planning/research/PITFALLS.md` — Failure modes around deploy-time notes dependency, malformed frontmatter, duplicate slugs, and normalization drift.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet. The repo has planning artifacts and a PRD, but no application or sync implementation to reuse.

### Established Patterns
- Planning docs consistently frame the project as a static Astro site built from one committed normalized dataset.
- Bun is the intended toolchain for install, sync, test, dev, and build flows.

### Integration Points
- The sync entrypoint will read from `../notes/resources/bookmarks/marks/`.
- The generated artifact should live at `src/data/bookmarks.json` so later Astro phases can load it without the external notes directory.
- Phase 1 should establish test fixtures and commands that later build/deploy phases can reuse.

</code_context>

<deferred>
## Deferred Ideas

- Astro content collections, bookmark detail pages, tag pages, and category pages belong to Phase 2.
- Homepage search, filtering, ordering, and empty states belong to Phase 3.
- Cloudflare Pages build pinning and production verification belong to Phase 4.

</deferred>

---

*Phase: 01-sync-contract*
*Context gathered: 2026-04-01*
