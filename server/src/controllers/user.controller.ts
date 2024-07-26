import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { CreateUserInput } from "../schemas/user.schema";
import userModel from "../models/user.model";


async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).send(err.message);
  }
}

async function getAllUsersHandler(req: Request, res: Response<object>): Promise<object> {
  try {
    const users = await userModel.find();
    if(!users) {
      return res.status(200).send({message: "No users found"})
    }
    return res.status(200).json(users);
  } catch (err: any) {
    return res.status(400).send({success: false, message: err.message})
  }
}

export { createUserHandler, getAllUsersHandler };
