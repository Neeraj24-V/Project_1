import { FilterQuery } from "mongoose";
import { User } from "../interfaces";
import userModel, { IUserModel } from "../models/user.model";
import { omit } from "lodash";

async function createUser(input: User) {
  try {
    const user = await userModel.create(input);
    return omit(user.toJSON(), "password");
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await userModel.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

async function findUser(query: FilterQuery<IUserModel>) {
  return userModel.findOne(query).select("-password").lean();
}

export { createUser, validatePassword, findUser };
