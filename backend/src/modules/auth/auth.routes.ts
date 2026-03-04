import { Router } from 'express';
import { refreshTokens, signIn, signUp } from './auth.handler';

const authRouter = Router();

authRouter.post('/sign-in', signIn);
authRouter.post('/sign-up', signUp);
authRouter.post('/refresh-tokens', refreshTokens);

export default authRouter;

