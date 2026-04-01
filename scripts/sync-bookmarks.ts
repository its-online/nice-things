import path from "node:path";

import { formatWarning, syncBookmarks } from "../src/lib/bookmarks/sync";

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
