import path from "node:path";
import { existsSync } from "node:fs";

import { formatWarning, syncBookmarks, resolveOutputFile } from "../src/lib/bookmarks/sync";

const outputFile = resolveOutputFile();

const sourceDir = process.env.BOOKMARKS_SOURCE_DIR
  ? path.resolve(process.cwd(), process.env.BOOKMARKS_SOURCE_DIR)
  : path.resolve(process.cwd(), "..", "notes", "resources", "bookmarks", "marks");

if (!existsSync(sourceDir)) {
  if (existsSync(outputFile)) {
    console.log(`Skipping sync: source directory not found, using existing ${path.relative(process.cwd(), outputFile)}`);
  } else {
    console.error("ENOENT: Source notes directory not found and no existing bookmarks.json. Please set BOOKMARKS_SOURCE_DIR or ensure ../notes/resources/bookmarks/marks exists.");
    process.exitCode = 1;
  }
  process.exit(0);
}

try {
  const result = await syncBookmarks();

  for (const warning of result.warnings) {
    console.warn(formatWarning(warning));
  }

  console.log(
    `Synced ${result.stats.synced} bookmarks to ${path.relative(process.cwd(), result.outputFile)} ` +
      `(${result.stats.skipped} skipped, ${result.stats.excluded} excluded).`
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
