import { Router } from "express";
import {
  createUserHandler,
  getAllUsersHandler,
} from "../../controllers/user.controller";
import { createUserSchema } from "../../schemas/user.schema";
import { validateResource } from "../../middlewares/validateResource";

const _router = Router();

_router.post("/register", validateResource(createUserSchema), createUserHandler);

_router.get('/all-users', getAllUsersHandler)

export default _router;
