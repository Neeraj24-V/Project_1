import { findUser } from "./user.service";
import IDaily, { IDailyLog, IEntryM } from "../models/Entries/dailyLog.model";
import { ObjectId } from "mongoose";

export function formatDate(date: string) {
  const parsedDate = new Date(date);
  const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
  return { parsedDate, startOfDay, endOfDay };
}

async function createLog(user_id: ObjectId, date: string, data: IDailyLog) {
  try {
    const { parsedDate, startOfDay, endOfDay } = formatDate(date);

    //add user_id to entries
    const entryWithUserId = data.entries.map(entry => ({
      ...entry,
      user_id
    }))
    const entryDocs = await IEntryM.insertMany(entryWithUserId);
    const entryIds = entryDocs.map((entry) => entry._id);

    // Find or create a daily log and add the new entries
    const dailyLog = await IDaily.findOneAndUpdate(
      {
        user_id,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      { $addToSet: { entries: { $each: entryIds } } },
      { new: true, upsert: true } // upsert: true will create a new document if one doesn't exist
    ).lean();

    if (!dailyLog) {
      return false;
    }
    return dailyLog;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getDailyEntries(user_id: ObjectId, date: string) {
  try {
    const { parsedDate, startOfDay, endOfDay } = formatDate(date);
    const dailyLog = await IDaily.findOne({
      user_id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate({
        path: "entries",
        options: {
          sort: {
            createdAt: 1,
          },
        },
      })
      .lean();
 
    if (!dailyLog) return false;
    return dailyLog;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getAllDailyLogs(user_id: ObjectId) {
  try {
    const AllLogs = await IDaily.find({ user_id })
      .populate({
        path: "entries",
        options: {
          sort: {
            createdAt: 1,
          },
        },
      })
      .sort({ date: 1 })
      .lean();
      console.log(AllLogs)
    if (!AllLogs) return false;
    return AllLogs;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function getUserEntries(user_id: ObjectId) {
  try {
    const Entries = await IEntryM.find({ user_id }).sort({ createdAt: 1 }).lean();
    if(!Entries) return false;
    return Entries;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export { createLog, getDailyEntries, getAllDailyLogs, getUserEntries };
