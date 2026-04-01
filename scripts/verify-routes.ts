import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

interface Bookmark {
  slug: string;
  tags: string[];
  categoryPath: string[];
}

function getAllTags(bookmarks: Bookmark[]): string[] {
  const tagSet = new Set<string>();
  for (const bookmark of bookmarks) {
    for (const tag of bookmark.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

function getAllCategoryPaths(bookmarks: Bookmark[]): string[][] {
  const pathSet = new Set<string>();
  for (const bookmark of bookmarks) {
    if (bookmark.categoryPath.length > 0) {
      pathSet.add(bookmark.categoryPath.join("/"));
    }
  }
  return Array.from(pathSet)
    .map((p) => p.split("/"))
    .sort((a, b) => a.join("/").localeCompare(b.join("/")));
}

function checkFileExists(filePath: string): boolean {
  const exists = existsSync(filePath);
  if (!exists) {
    console.error(`  MISSING: ${filePath}`);
  }
  return exists;
}

const DIST_DIR = resolve(process.cwd(), "dist");

const bookmarksPath = resolve(process.cwd(), "src/data/bookmarks.json");
const bookmarksContent = readFileSync(bookmarksPath, "utf-8");
const bookmarks: Bookmark[] = JSON.parse(bookmarksContent);

if (bookmarks.length === 0) {
  console.error("ERROR: No bookmarks found in bookmarks.json");
  process.exit(1);
}

console.log(`Loaded ${bookmarks.length} bookmarks\n`);

let exitCode = 0;

console.log("Checking homepage...");
if (!checkFileExists(resolve(DIST_DIR, "index.html"))) {
  exitCode = 1;
}

console.log("\nChecking bookmark detail routes...");
for (const bookmark of bookmarks) {
  const routePath = resolve(DIST_DIR, "b", bookmark.slug, "index.html");
  if (!checkFileExists(routePath)) {
    exitCode = 1;
  }
}

console.log("\nChecking tag routes...");
const allTags = getAllTags(bookmarks);
for (const tag of allTags) {
  const routePath = resolve(DIST_DIR, "tags", tag, "index.html");
  if (!checkFileExists(routePath)) {
    exitCode = 1;
  }
}

console.log("\nChecking category routes...");
const allCategories = getAllCategoryPaths(bookmarks);
for (const categoryPath of allCategories) {
  const routePath = resolve(DIST_DIR, "category", ...categoryPath, "index.html");
  if (!checkFileExists(routePath)) {
    exitCode = 1;
  }
}

if (exitCode === 0) {
  console.log("\n✓ All route verifications passed!");
} else {
  console.error("\n✗ Some routes are missing");
}

process.exit(exitCode);
