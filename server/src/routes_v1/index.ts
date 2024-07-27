import userRouter from "./Users/users.routes";
import { Router } from "express";
import sessionRouter from "./Sessions/sessions.routes";
import dailyLogRouter from "./Entries/dailyLogs.routes";
import monthlyLogRouter from "./Entries/monthlyLogs.routes";

const _router: Router = Router();

_router.use("/users", userRouter);
_router.use("/sessions", sessionRouter);
_router.use("/entries", dailyLogRouter);
_router.use("/entries", monthlyLogRouter);

export default _router;
