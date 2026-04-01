export interface BookmarkRecord {
  title: string;
  url: string;
  description?: string;
  tags: string[];
  done: boolean;
  categoryPath: string[];
  slug: string;
  sourceRelativePath: string;
}

export interface SyncWarning {
  file: string;
  reason: string;
}

export interface SyncStats {
  discovered: number;
  synced: number;
  skipped: number;
  excluded: number;
}

export interface SyncBookmarksOptions {
  cwd?: string;
  sourceDir?: string;
  outputFile?: string;
}

export interface SyncBookmarksResult {
  bookmarks: BookmarkRecord[];
  warnings: SyncWarning[];
  stats: SyncStats;
  sourceDir: string;
  outputFile: string;
}
