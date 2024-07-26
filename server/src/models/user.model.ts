import { Schema, model, Document } from "mongoose";
import { User } from "../interfaces";
import bcrypt from "bcrypt";

export interface IUserModel extends User, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next): Promise<void> {
  let user = this as IUserModel;
  if (!user.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(user.password, 11);
  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    let user = this as IUserModel;
    return bcrypt.compare(candidatePassword, user.password);
  } catch (err: any) {
    console.log(err.message);
    return false;
  }
};

export default model<IUserModel>("User", userSchema);
