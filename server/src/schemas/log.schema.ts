import { z } from "zod";

const EntrySchema = z.object({
  type: z
    .enum(["task", "note", "event"], {
      required_error: "Type is required",
      invalid_type_error:
        "Invalid type. Must be one of 'task', 'note', or 'event'.",
    })
    .describe("Type of the entry"),
  content: z
    .string({
      required_error: "Content is required",
    })
    .min(1, "Content cannot be empty")
    .describe("Content of the entry"),
  status: z
    .enum(["pending", "completed", "migrated"])
    .default("pending")
    .describe("Status of the entry"),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional()
    .describe("Creation date of the entry"),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional()
    .describe("Last update date of the entry"),
});

const GoalSchema = z.object({
  type: z
    .enum(["task"], {
      required_error: "Type is required",
      invalid_type_error: "Invalid type. Must be 'task'.",
    })
    .describe("Type of the goal"),
  content: z
    .string({
      required_error: "Content is required",
    })
    .min(1, "Content cannot be empty")
    .describe("Content of the goal"),
  status: z
    .enum(["pending", "completed", "migrated"])
    .default("pending")
    .describe("Status of the goal"),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional()
    .describe("Creation date of the goal"),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional()
    .describe("Last update date of the goal"),
});

const DailyLogSchema = z
  .object({
    body: z.object({
      entries: z.array(EntrySchema).min(1, "Entries are required"),
    }),
  })
  .describe("Schema for the Daily Log");

const MonthlyLogSchema = z
  .object({
    body: z.object({
      goals: z.array(GoalSchema).min(1, "Goals are required"),
    }),
  })
  .describe("Schema for the Monthly Log");

export { DailyLogSchema, EntrySchema, GoalSchema, MonthlyLogSchema };
