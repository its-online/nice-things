import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { DuplicateSlugError, syncBookmarks } from "../src/lib/bookmarks/sync";

const fixturesDir = path.resolve(import.meta.dir, "fixtures", "bookmarks-source");

describe("syncBookmarks", () => {
  test("normalizes bookmarks, skips invalid records, and writes the dataset", async () => {
    const outputDir = await mkdtemp(path.join(os.tmpdir(), "nice-things-sync-"));
    const outputFile = path.join(outputDir, "bookmarks.json");
    const result = await syncBookmarks({
      sourceDir: path.join(fixturesDir, "base"),
      outputFile
    });

    expect(result.stats.discovered).toBe(6);
    expect(result.stats.synced).toBe(3);
    expect(result.stats.skipped).toBe(2);
    expect(result.stats.excluded).toBe(1);
    expect(result.warnings).toHaveLength(2);

    const rootBookmark = result.bookmarks.find((bookmark) => bookmark.slug === "root-bookmark");
    const nestedBookmark = result.bookmarks.find((bookmark) => bookmark.slug === "test-tool");
    const blankValuesBookmark = result.bookmarks.find((bookmark) => bookmark.slug === "blank-values");

    expect(rootBookmark).toBeDefined();
    expect(rootBookmark?.categoryPath).toEqual([]);

    expect(nestedBookmark).toBeDefined();
    expect(nestedBookmark?.tags).toEqual(["tool", "testing"]);
    expect(nestedBookmark?.categoryPath).toEqual(["tools"]);

    expect(blankValuesBookmark).toBeDefined();
    expect(blankValuesBookmark?.tags).toEqual([]);
    expect(blankValuesBookmark?.done).toBe(false);
    expect(blankValuesBookmark?.description).toBeUndefined();
    expect(blankValuesBookmark?.categoryPath).toEqual(["nested"]);

    expect(result.warnings.map((warning) => warning.reason)).toEqual([
      expect.stringContaining("invalid frontmatter"),
      "missing required field(s): bookmark_url"
    ]);

    const writtenJson = await readFile(outputFile, "utf8");
    const writtenBookmarks = JSON.parse(writtenJson) as typeof result.bookmarks;

    expect(writtenBookmarks).toEqual(result.bookmarks);
  });

  test("throws a clear duplicate error before writing output", async () => {
    const outputDir = await mkdtemp(path.join(os.tmpdir(), "nice-things-duplicates-"));
    const outputFile = path.join(outputDir, "bookmarks.json");

    await expect(
      syncBookmarks({
        sourceDir: path.join(fixturesDir, "duplicates"),
        outputFile
      })
    ).rejects.toThrow(DuplicateSlugError);
  });
});
