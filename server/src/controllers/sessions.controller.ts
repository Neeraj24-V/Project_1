import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../services/sessions.service";
import { validatePassword } from "../services/user.service";
import { signJWT } from "../utils/jwt.utils";
import config from "../config/default";

async function createUserSessionHandler(req: Request, res: Response) {
  // validate the user's password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(
    user._id as string,
    req.get("user-agent") || ""
  );

  // create an access token
  const accessToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    config.keys["accessTokenSecret"],
    { expiresIn: "3m" }
  );

  // create a refresh token
  const refreshToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    config.keys["refreshTokenSecret"],
    { expiresIn: "30d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ accessToken });
}

async function getUserSessionHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;
    const session = await findSessions({ userId, valid: true });
    return res.status(200).json(session);
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function deleteSessionHandler(req: Request, res: Response) {
  try {
    const sessionId = res.locals.user.session;
    await updateSession({ _id: sessionId }, { valid: false });
    res.clearCookie("jwt");
    return res.status(200).json({ accessToken: null });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export {
  createUserSessionHandler,
  getUserSessionHandler,
  deleteSessionHandler,
};
