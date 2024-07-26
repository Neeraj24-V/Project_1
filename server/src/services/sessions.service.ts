import _, { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import sessionModel, { ISession } from "../models/session.model";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import config from "../config/default";
import { findUser } from "./user.service";

async function createSession(userId: string, userAgent: string) {
  const session = await sessionModel.create({ userId, userAgent });
  return session.toJSON();
}

async function findSessions(query: FilterQuery<ISession>) {
  return sessionModel.findOne(query).lean();
}
async function updateSession(
  query: FilterQuery<ISession>,
  update: UpdateQuery<ISession>
) {
  return sessionModel.updateOne(query, update).lean();
}

async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  const { decoded, expired } = verifyJWT(
    refreshToken,
    config.keys.refreshTokenSecret
  );
  if (!decoded || !get(decoded, "session")) return false;

  const session = await sessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  let user = await findUser({ _id: session.userId });

  if (!user) return false;
  const accessToken = signJWT(
    { ...user, session: session._id },
    config.keys["accessTokenSecret"],
    { expiresIn: "3m" } // 15 minutes
  );

  return accessToken;
}

export { createSession, findSessions, updateSession, reIssueAccessToken };
