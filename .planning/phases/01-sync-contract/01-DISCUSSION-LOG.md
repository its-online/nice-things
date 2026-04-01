# Phase 1: Sync Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning or execution agents.
> Decisions are captured in `01-CONTEXT.md`.

**Date:** 2026-04-01
**Phase:** 01-sync-contract
**Mode:** auto
**Areas discussed:** Sync artifact contract, parsing and filtering rules, normalized bookmark shape, failure semantics and tests

---

## Sync Artifact Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Single committed JSON artifact | One normalized dataset committed inside the repo for later Astro loading | ✓ |
| Generated markdown collection | Synthetic markdown files per bookmark inside `src/content/` | |

**Auto selection:** Single committed JSON artifact
**Why selected:** ROADMAP Phase 1 asks for one committed structured artifact, `prd.md` requires repo-local generated content, and research recommends `src/data/bookmarks.json` over synthetic markdown churn.

---

## Parsing and Filtering Rules

| Option | Description | Selected |
|--------|-------------|----------|
| Frontmatter-only import with warn-and-skip invalid records | Parse YAML frontmatter, ignore body, skip bad/incomplete records with warnings | ✓ |
| Strict fail-fast import | Abort the whole sync on any malformed or incomplete file | |

**Auto selection:** Frontmatter-only import with warn-and-skip invalid records
**Why selected:** `SYNC-03`, `SYNC-04`, and `SYNC-05` explicitly require frontmatter-only parsing and visible skip/warn behavior.

---

## Normalized Bookmark Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Normalize to one typed bookmark record | Emit title, url, optional description, tags, done, categoryPath, slug, and sourceRelativePath | ✓ |
| Preserve raw frontmatter shape | Store source fields with minimal normalization and let later phases clean them up | |

**Auto selection:** Normalize to one typed bookmark record
**Why selected:** Phase 2 and Phase 3 depend on a stable contract. `SYNC-06` through `SYNC-10` already define the normalized fields.

---

## Failure Semantics and Tests

| Option | Description | Selected |
|--------|-------------|----------|
| Duplicate slug is a hard error with fixture tests | Abort on collisions before writing bad output; add automated tests for normalization and duplicate detection | ✓ |
| Last-write-wins duplicate handling | Keep syncing and let later phases reconcile collisions | |

**Auto selection:** Duplicate slug is a hard error with fixture tests
**Why selected:** `SYNC-09`, `TEST-01`, and `TEST-02` require explicit duplicate detection and automated coverage before later phases build on the dataset.

---

## the agent's Discretion

- Script/module layout for the sync implementation.
- Warning formatting and output ordering details.

## Deferred Ideas

- Astro content collection loading and public archive routes.
- Homepage retrieval UX.
- Deployment hardening and Cloudflare verification.
