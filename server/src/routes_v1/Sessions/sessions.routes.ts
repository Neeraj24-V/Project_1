import { Router } from "express";
import {
  createUserSessionHandler,
  getUserSessionHandler,
  deleteSessionHandler,
} from "../../controllers/sessions.controller";
import { validateResource } from "../../middlewares/validateResource";
import sessionSchema from "../../schemas/session.schema";
import requireUser from "../../middlewares/requireUser";

const _router = Router();

_router.post(
  "/login",
  validateResource(sessionSchema),
  createUserSessionHandler
);

_router.get("/", requireUser, getUserSessionHandler);

_router.delete("/", requireUser, deleteSessionHandler);

export default _router;
