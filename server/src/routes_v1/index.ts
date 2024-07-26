import userRouter from './Users/users.routes';
import { Router } from 'express';
import sessionRouter from './Sessions/sessions.routes';
import dailyLogRouter from './Entries/dailyLogs.routes'
const _router: Router = Router();

_router.use('/users', userRouter);
_router.use('/sessions', sessionRouter);
_router.use('/entries', dailyLogRouter)


export default _router
