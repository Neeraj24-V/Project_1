import { Request, response, Response } from "express";
import {
  createLog,
<<<<<<< HEAD
  getDailyEntries,
  getAllDailyLogs,
  getUserEntries,
=======
  getLogByDate,
  getAllLogs,
  getAllUserEntries,
>>>>>>> Development
} from "../../services/content.service";
import { start } from "repl";

async function createDailyLogHandler(req: Request, res: Response) {
  try {
    const user_id = res.locals.user._id;
    const { date } = req.query;
    if (typeof date == "undefined") {
      throw new Error("Date is required");
    }

<<<<<<< HEAD
    const dailyLog = await createLog(user_id, date as string, req.body);
=======
    const dailyLog = await createLog(
      user_id,
      date as string,
      req.body,
      "daily"
    );
>>>>>>> Development
    if (!dailyLog) {
      return res
        .status(400)
        .json({ success: false, message: "Daily log not created" });
    }
    return res.status(201).json({ success: true, dailyLog });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function updateDailyLogHandler(req: Request, res: Response) {}

async function getDailyLogHandler(req: Request, res: Response) {
  try {
    const { date } = req.query;
    const user_id = res.locals.user._id;
<<<<<<< HEAD
    const dailyLogs = await getDailyEntries(user_id, date as string);
=======
    const dailyLogs = await getLogByDate(user_id, date as string, "daily");
>>>>>>> Development
    if (!dailyLogs)
      return res
        .status(404)
        .json({ success: false, message: "No daily logs found" });

    return res.status(200).json({ success: true, dailyLogs });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getAllDailyLogsHandler(req: Request, res: Response) {
  try {
    const user_id = res.locals.user._id;
<<<<<<< HEAD
    const allDailyLogs = await getAllDailyLogs(user_id);
=======
    const allDailyLogs = await getAllLogs(user_id, "daily");
>>>>>>> Development
    if (!allDailyLogs)
      return res
        .status(404)
        .json({ success: false, message: "No daily logs found" });

<<<<<<< HEAD

=======
>>>>>>> Development
    return res.status(200).json({ success: true, allDailyLogs });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getAllEntriesHandler(req: Request, res: Response) {
  try {
    const user_id = res.locals.user._id;
<<<<<<< HEAD
    const dailyEntries = await getUserEntries(user_id);
    if(!dailyEntries) res.status(404).json({success: false, message: "No Entries found"})

    return res.status(200).json({success: true, dailyEntries})
=======
    const dailyEntries = await getAllUserEntries(user_id);
    if (!dailyEntries)
      res.status(404).json({ success: false, message: "No Entries found" });

    return res.status(200).json({ success: true, dailyEntries });
>>>>>>> Development
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export {
  createDailyLogHandler,
  updateDailyLogHandler,
  getDailyLogHandler,
  getAllDailyLogsHandler,
<<<<<<< HEAD
  getAllEntriesHandler
=======
  getAllEntriesHandler,
>>>>>>> Development
};
