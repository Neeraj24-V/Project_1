import { Schema, model, ObjectId } from "mongoose";

interface IGoal {
  user_id: ObjectId;
  type: "task";
  content: string;
  status: "pending" | "completed" | "migrated";
  createdAt: Date;
  updatedAt: Date;
}

interface IMonthlyLog {
  user_id: ObjectId;
  date: Date;
  goals: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const goalsSchema = new Schema<IGoal>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["task"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
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

goalsSchema.index({ user_id: 1, createdAt: 1 });

const monthlyLogSchema = new Schema<IMonthlyLog>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
    goals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Goals",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

monthlyLogSchema.index({ user_id: 1, date: 1 });

const IGoalM = model<IGoal>("Goals", goalsSchema);
const IMonthly = model<IMonthlyLog>("Monthly Logs", monthlyLogSchema);

export { IGoalM, IMonthly, IGoal, IMonthlyLog };
