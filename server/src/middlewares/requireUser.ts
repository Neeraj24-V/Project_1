import { Request, Response, NextFunction } from "express";

function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  if (!user) {
    return res.status(403).send("Unauthorized");
  }
  return next();
}

export default requireUser