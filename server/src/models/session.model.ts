import { Schema, model, Document } from "mongoose";
import { Session } from "../interfaces";

export interface ISession extends Session, Document {
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

export default model<ISession>("Sessions", sessionSchema);
