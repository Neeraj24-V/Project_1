import { Schema, model, ObjectId } from "mongoose";

<<<<<<< HEAD
export interface IEntry {
=======
interface IEntry {
>>>>>>> Development
  user_id: ObjectId;
  type: "task" | "note" | "event";
  content: string;
  status: "pending" | "completed" | "migrated";
  createdAt: Date;
  updatedAt: Date;
}
<<<<<<< HEAD
export interface IDailyLog {
=======
interface IDailyLog {
>>>>>>> Development
  user_id: ObjectId;
  date: Date;
  entries: IEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const entrySchema = new Schema<IEntry>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["task", "note", "event"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "migrated"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const dailyLogSchema = new Schema<IDailyLog>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
<<<<<<< HEAD
      default: Date.now(),
=======
      default: () => Date.now(),
>>>>>>> Development
    },
    entries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entries",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

dailyLogSchema.index({ date: 1 });
entrySchema.index({ created_at: 1 });

<<<<<<< HEAD
export const IEntryM = model<IEntry>("Entries", entrySchema);
export default model<IDailyLog>("Daily Logs", dailyLogSchema);
=======
const IEntryM = model<IEntry>("Entries", entrySchema);
const IDaily = model<IDailyLog>("Daily Logs", dailyLogSchema);

export { IEntryM, IDaily, IDailyLog, IEntry};
>>>>>>> Development
