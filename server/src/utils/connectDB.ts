import { connect } from "mongoose";
import config from "../config/default";

async function connectDB(cb: any) {
  try {
    await connect(config.mongo.URI);
    console.log("Connected to MONGO_DB");
    cb();
  } catch (err: any) {
    console.log(err.message);
    cb(err);
  }
}

export default connectDB;
