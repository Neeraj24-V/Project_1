import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import config from "../config/default";
import { reIssueAccessToken } from "../services/sessions.service";

async function validateToken(req: Request, res: Response, next: NextFunction) {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) {
    return next();
  }

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const { decoded, expired } = verifyJWT(
    accessToken,
    config.keys["accessTokenSecret"]
  );

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const refreshTokenString = Array.isArray(refreshToken)
      ? refreshToken[0]
      : refreshToken;
    const newAccessToken = await reIssueAccessToken({
      refreshToken: refreshTokenString,
    });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = verifyJWT(
      newAccessToken as string,
      config.keys["accessTokenSecret"]
    );

    res.locals.user = result.decoded;

    return next();
  }
  return next();
}

export default validateToken;
