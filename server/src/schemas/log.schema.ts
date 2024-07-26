import { z } from "zod";
import { Types } from "mongoose";

const EntrySchema = z.object({
  type: z.enum(["task", "note", "event"]),
  content: z.string({
    required_error: "Content is required",
  }),
  status: z.enum(["pending", "completed", "migrated"]).default("pending"),
  createdAt: z.date().default(() => new Date()).optional(),
  updatedAt: z.date().default(() => new Date()).optional(),
});

const DailyLogSchema = z.object({
  body: z.object({
    entries: z.array(EntrySchema).min(1, "Entries are required"),
  }),
}).describe("Schema for the Daily Log");

export { DailyLogSchema, EntrySchema };
