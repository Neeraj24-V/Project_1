import { Router } from "express";
import {
  createDailyLogHandler,
  updateDailyLogHandler,
  getDailyLogHandler,
  getAllDailyLogsHandler,
  getAllEntriesHandler
} from "../../controllers/Entries/dailyLogs.controller";
import { validateResource } from "../../middlewares/validateResource";
import requireUser from "../../middlewares/requireUser";
import { EntrySchema, DailyLogSchema } from "../../schemas/log.schema";

const _router = Router();

_router
  .post(
    "/daily",
    validateResource(DailyLogSchema),
    requireUser,
    createDailyLogHandler
  )
  .get("/daily", requireUser, getDailyLogHandler);

_router.get('/daily/all', requireUser, getAllDailyLogsHandler)

_router.get('/daily/entries/all', requireUser, getAllEntriesHandler)

export default _router;
