import { z } from "zod";

import type { BookmarkRecord } from "./types";

export const bookmarkRecordSchema: z.ZodType<BookmarkRecord> = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  description: z.string().min(1).optional(),
  tags: z.array(z.string()),
  done: z.boolean(),
  categoryPath: z.array(z.string()),
  slug: z.string().min(1),
  sourceRelativePath: z.string().min(1)
});

export const bookmarkDatasetSchema = z.array(bookmarkRecordSchema);
