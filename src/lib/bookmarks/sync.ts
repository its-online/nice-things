import matter from "gray-matter";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { bookmarkDatasetSchema } from "./schema";
import type {
  BookmarkRecord,
  SyncBookmarksOptions,
  SyncBookmarksResult,
  SyncWarning
} from "./types";

const DEFAULT_SOURCE_SEGMENTS = ["..", "notes", "resources", "bookmarks", "marks"] as const;
const DEFAULT_OUTPUT_SEGMENTS = ["src", "data", "bookmarks.json"] as const;

export class DuplicateSlugError extends Error {
  readonly duplicates: Record<string, string[]>;

  constructor(duplicates: Record<string, string[]>) {
    const details = Object.entries(duplicates)
      .map(([slug, files]) => `${slug}: ${files.join(", ")}`)
      .join("; ");

    super(`Duplicate bookmark slug(s) detected: ${details}`);
    this.name = "DuplicateSlugError";
    this.duplicates = duplicates;
  }
}

interface RawBookmarkFrontmatter {
  bookmark_title?: unknown;
  bookmark_url?: unknown;
  description?: unknown;
  tags?: unknown;
  bookmark_done?: unknown;
}

export function resolveSourceDirectory(options: Pick<SyncBookmarksOptions, "cwd" | "sourceDir"> = {}): string {
  const cwd = options.cwd ?? process.cwd();

  if (options.sourceDir) {
    return path.resolve(cwd, options.sourceDir);
  }

  if (process.env.BOOKMARKS_SOURCE_DIR) {
    return path.resolve(cwd, process.env.BOOKMARKS_SOURCE_DIR);
  }

  return path.resolve(cwd, ...DEFAULT_SOURCE_SEGMENTS);
}

export function resolveOutputFile(options: Pick<SyncBookmarksOptions, "cwd" | "outputFile"> = {}): string {
  const cwd = options.cwd ?? process.cwd();
  const outputFile = options.outputFile ?? path.join(...DEFAULT_OUTPUT_SEGMENTS);

  return path.resolve(cwd, outputFile);
}

export function formatWarning(warning: SyncWarning): string {
  return `[warn] ${warning.file}: ${warning.reason}`;
}

export async function syncBookmarks(
  options: SyncBookmarksOptions = {}
): Promise<SyncBookmarksResult> {
  const sourceDir = resolveSourceDirectory(options);
  const outputFile = resolveOutputFile(options);
  const markdownFiles = await collectMarkdownFiles(sourceDir);

  const warnings: SyncWarning[] = [];
  const bookmarks: BookmarkRecord[] = [];
  let skipped = 0;
  let excluded = 0;

  for (const absolutePath of markdownFiles) {
    const relativePath = toPosixPath(path.relative(sourceDir, absolutePath));

    if (isExcludedPath(relativePath)) {
      excluded += 1;
      continue;
    }

    const fileContents = await readFile(absolutePath, "utf8");

    let parsed;

    try {
      parsed = matter(fileContents);
    } catch (error) {
      skipped += 1;
      warnings.push({
        file: relativePath,
        reason: `invalid frontmatter (${toErrorMessage(error)})`
      });
      continue;
    }

    const normalized = normalizeBookmark(parsed.data as RawBookmarkFrontmatter, relativePath);

    if (!normalized.ok) {
      skipped += 1;
      warnings.push({
        file: relativePath,
        reason: normalized.reason
      });
      continue;
    }

    bookmarks.push(normalized.bookmark);
  }

  bookmarks.sort((left, right) => left.sourceRelativePath.localeCompare(right.sourceRelativePath));

  const duplicates = detectDuplicateSlugs(bookmarks);

  if (Object.keys(duplicates).length > 0) {
    throw new DuplicateSlugError(duplicates);
  }

  bookmarkDatasetSchema.parse(bookmarks);

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(bookmarks, null, 2)}\n`, "utf8");

  return {
    bookmarks,
    warnings,
    stats: {
      discovered: markdownFiles.length,
      synced: bookmarks.length,
      skipped,
      excluded
    },
    sourceDir,
    outputFile
  };
}

async function collectMarkdownFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files: string[] = [];

  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function isExcludedPath(relativePath: string): boolean {
  return relativePath.split("/").includes("articles");
}

function normalizeBookmark(
  frontmatter: RawBookmarkFrontmatter,
  relativePath: string
): { ok: true; bookmark: BookmarkRecord } | { ok: false; reason: string } {
  const title = normalizeRequiredString(frontmatter.bookmark_title);
  const url = normalizeRequiredString(frontmatter.bookmark_url);

  if (!title || !url) {
    const missing = [
      !title ? "bookmark_title" : null,
      !url ? "bookmark_url" : null
    ]
      .filter(Boolean)
      .join(", ");

    return {
      ok: false,
      reason: `missing required field(s): ${missing}`
    };
  }

  const posixRelativePath = toPosixPath(relativePath);
  const directory = path.posix.dirname(posixRelativePath);

  // Route identity stays flat and filename-based in v1.
  const slug = path.posix.parse(posixRelativePath).name;

  return {
    ok: true,
    bookmark: {
      title,
      url,
      description: normalizeOptionalString(frontmatter.description),
      tags: normalizeTags(frontmatter.tags),
      done: normalizeDone(frontmatter.bookmark_done),
      categoryPath: directory === "." ? [] : directory.split("/").filter(Boolean),
      slug,
      sourceRelativePath: posixRelativePath
    }
  };
}

function normalizeRequiredString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim().length > 0) {
      return [value.trim().toLowerCase()];
    }

    return [];
  }

  const tags = value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(tags)];
}

function normalizeDone(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  return ["1", "true", "yes", "done"].includes(normalized);
}

function detectDuplicateSlugs(bookmarks: BookmarkRecord[]): Record<string, string[]> {
  const slugMap = new Map<string, string[]>();

  for (const bookmark of bookmarks) {
    const files = slugMap.get(bookmark.slug) ?? [];
    files.push(bookmark.sourceRelativePath);
    slugMap.set(bookmark.slug, files);
  }

  return Object.fromEntries(
    [...slugMap.entries()].filter(([, files]) => files.length > 1)
  );
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
