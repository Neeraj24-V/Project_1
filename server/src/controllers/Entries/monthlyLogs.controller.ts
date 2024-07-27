import { Request, Response, NextFunction } from "express";
import {
  createLog,
  getLogByDate,
  getAllLogs,
} from "../../services/content.service";

async function createMonthlyLogHandler(req: Request, res: Response) {
  try {
    const user_id = res.locals.user._id;
    const { date } = req.query;
    if (typeof date == "undefined") {
      throw new Error("Date format is incorrect");
    }

    const monthlyLog = await createLog(
      user_id,
      date as string,
      req.body,
      "monthly"
    );
    if (!monthlyLog)
      return res
        .status(404)
        .json({ success: false, message: "No monthly log found" });

    return res.status(201).json({ success: true, monthlyLog });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getMonthlyLogHandler(req: Request, res: Response) {
  try {
    const user_id = res.locals.user._id;
    const { date } = req.query;
    const monthlyLogs = await getLogByDate(user_id, date as string, "monthly");
    if (!monthlyLogs)
      return res
        .status(404)
        .json({ success: false, message: "No monthly logs found" });
    return res.status(200).json({ success: true, monthlyLogs });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getAllMonthlyLogsHandler(req: Request, res: Response) {
  try {
    const user_id = res.locals.user._id;
    const allMonthlyLogs = await getAllLogs(user_id, "monthly");
    if (!allMonthlyLogs)
      return res
        .status(404)
        .json({ success: false, message: "No monthly logs found" });
    return res.status(200).json({ success: true, allMonthlyLogs });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export {
  createMonthlyLogHandler,
  getMonthlyLogHandler,
  getAllMonthlyLogsHandler,
};
