import type { BookmarkRecord } from "./types";

export function getAllTags(bookmarks: BookmarkRecord[]): string[] {
  const tagSet = new Set<string>();
  for (const bookmark of bookmarks) {
    for (const tag of bookmark.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export function getAllCategoryPaths(bookmarks: BookmarkRecord[]): string[][] {
  const pathSet = new Set<string>();
  for (const bookmark of bookmarks) {
    pathSet.add(bookmark.categoryPath.join("/"));
  }
  return Array.from(pathSet)
    .map((p) => p.split("/"))
    .sort((a, b) => {
      const aStr = a.join("/");
      const bStr = b.join("/");
      if (aStr < bStr) return -1;
      if (aStr > bStr) return 1;
      return 0;
    });
}
