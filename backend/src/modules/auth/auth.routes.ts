import { Router } from 'express';
import { checkSession, refreshTokens, signIn, signUp } from './auth.handler';
import { jwtGuard } from './jwtGuard';

const authRouter = Router();

authRouter.post('/sign-in', signIn);
authRouter.post('/sign-up', signUp);
authRouter.post('/refresh-tokens', refreshTokens);
authRouter.get('/check-session', jwtGuard, checkSession);

export default authRouter;

