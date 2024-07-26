import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const server_port = process.env.PORT || 3000;
const mongo_username = process.env.MONGO_USERNAME || "";
const mongo_password = process.env.MONGO_PASSWORD || "";
const URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.ll5m7op.mongodb.net/Bullet_Journal?retryWrites=true&w=majority&appName=Cluster0`;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error(
    "One or more RSA keys are not defined in the environment variables"
  );
}

interface Keys {
  [key: string]: string;
}

const config = {
  mongo: {
    URI,
  },
  server: {
    port: server_port,
  },
  keys: {
    accessTokenSecret,
    refreshTokenSecret,
  } as Keys,
};

export default config;
