import { findUser } from "./user.service";
import {
  IDailyLog,
  IEntryM,
  IEntry,
  IDaily,
} from "../models/Entries/dailyLog.model";
import {
  IGoalM,
  IMonthly,
  IMonthlyLog,
  IGoal,
} from "../models/Entries/monthlyLog.model";
import { ObjectId } from "mongoose";

export function formatDate(date: string) {
  // Date helper function
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }
  const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
  return { parsedDate, startOfDay, endOfDay };
}

interface ICreateLog {
  entries?: IDailyLog;
  goals?: IMonthlyLog;
}

async function insertAndGetIds<T>(Model: any, item: T[], user_id: ObjectId) {
  // returns ids
  try {
    const itemsWithUserId = item.map((item: any) => ({
      ...item,
      user_id,
    }));

    const docs = await Model.insertMany(itemsWithUserId);
    const ids = docs.map((doc: any) => doc._id);
    return ids;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function fetchLogsByDate( // fetches logs by date helper function
  user_id: ObjectId,
  startOfDay: Date,
  endOfDay: Date,
  Model: any,
  path: "entries" | "goals"
) {
  try {
    const log = await Model.findOne({
      user_id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate({
        path: path,
        options: {
          sort: {
            createdAt: 1,
          },
        },
      })
      .lean();

    return log;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function findLogs(user_id: ObjectId, Model: any, path: string) {
  try {
    if (!Model || !user_id) return;
    const AllLogs = await Model.find({ user_id })
      .populate({
        path: path,
        options: {
          sort: {
            createdAt: 1,
          },
        },
      })
      .sort({ date: 1 })
      .lean();

    if (!AllLogs) return;

    return AllLogs;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function createLog( // creates a log
  user_id: ObjectId,
  date: string,
  data: ICreateLog,
  logType: "daily" | "monthly" | "future"
) {
  try {
    const { parsedDate, startOfDay, endOfDay } = formatDate(date);

    let log;
    let docs: IEntry[] | IGoal[];
    let ids: ObjectId[];
    let logModel: typeof IDaily | typeof IMonthly = IDaily;
    let updateField;

    if (logType == "daily" && Array.isArray(data.entries)) {
      const ids = await insertAndGetIds(IEntryM, data.entries, user_id);

      logModel = IDaily;
      updateField = { entries: { $each: ids } };
    } else if (logType == "monthly" && Array.isArray(data.goals)) {
      const ids = await insertAndGetIds(IGoalM, data.goals, user_id);

      logModel = IMonthly;
      updateField = { goals: { $each: ids } };
    }

    if (!logModel) {
      throw new Error("Invalid log type");
    }

    let logInstance;
    if (typeof logModel === "function") {
      logInstance = new logModel();
    }

    // Find or create a daily log and add the new entries
    if (logInstance instanceof IDaily) {
      log = await IDaily.findOneAndUpdate(
        {
          user_id,
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        { $addToSet: updateField },
        { new: true, upsert: true } // upsert: true will create a new document if one doesn't exist
      ).lean();
    } else if (logInstance instanceof IMonthly) {
      log = await IMonthly.findOneAndUpdate(
        {
          user_id,
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        { $addToSet: updateField },
        { new: true, upsert: true } // upsert: true will create a new document if one doesn't exist
      ).lean();
    }

    if (!log) {
      return;
    }
    return log;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getLogByDate( // returns log
  user_id: ObjectId,
  date: string,
  logType: "daily" | "monthly"
) {
  try {
    const { parsedDate, startOfDay, endOfDay } = formatDate(date);
    let logModel;
    let log;
    let logInstance;

    if (logType == "daily") {
      logModel = IDaily;
    } else if (logType == "monthly") {
      logModel = IMonthly;
    }
    if (typeof logModel === "function") {
      logInstance = new logModel();
    }

    if (logInstance instanceof IDaily) {
      log = await fetchLogsByDate(
        user_id,
        startOfDay,
        endOfDay,
        IDaily,
        "entries"
      );
    } else if (logInstance instanceof IMonthly) {
      log = await fetchLogsByDate(
        user_id,
        startOfDay,
        endOfDay,
        IMonthly,
        "goals"
      );
    }

    if (!log) return;

    return log;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getAllLogs(user_id: ObjectId, logType: "daily" | "monthly") {
  try {
    let logModel;
    let logInstance;
    let logs;

    if (logType == "daily") {
      logModel = IDaily;
    } else if (logType == "monthly") {
      logModel = IMonthly;
    }

    if (logModel) {
      logInstance = new logModel();
    }

    if (logInstance instanceof IDaily) {
      logs = await findLogs(user_id, IDaily, "entries");
    } else if (logInstance instanceof IMonthly) {
      logs = await findLogs(user_id, IMonthly, "goals");
    }

    if (!logs) return false;
    return logs;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getAllUserEntries(user_id: ObjectId) {
  try {
    const Entries = await IEntryM.find({ user_id })
      .sort({ createdAt: 1 })
      .lean();
    if (!Entries) return false;
    return Entries;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export { createLog, getLogByDate, getAllLogs, getAllUserEntries };
