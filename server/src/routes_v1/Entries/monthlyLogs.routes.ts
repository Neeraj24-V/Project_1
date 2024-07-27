import { Router } from "express";
import requireUser from "../../middlewares/requireUser";
import {
  createMonthlyLogHandler,
  getMonthlyLogHandler,
  getAllMonthlyLogsHandler,
} from "../../controllers/Entries/monthlyLogs.controller";

const _router = Router();

_router
  .post("/monthly-logs", requireUser, createMonthlyLogHandler)
  .get("/monthly-logs", requireUser, getMonthlyLogHandler);

_router.get("/monthly-logs/all", requireUser, getAllMonthlyLogsHandler);

export default _router;
