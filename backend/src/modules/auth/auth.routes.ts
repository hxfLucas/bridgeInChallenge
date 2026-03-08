import { Router } from 'express';
import { checkSession, refreshTokens, signIn, signOut, signUp, getNotifications } from './auth.handler';
import { jwtGuard } from '../../shared/middleware/jwtGuard';
import { validateBody } from '../../shared/middleware/validateBody';
import { SignInDto, SignUpDto, RefreshTokensDto } from './auth.dtos';

const authRouter = Router();

authRouter.post('/sign-in',  signIn);
authRouter.post('/sign-up', signUp);
authRouter.post('/refresh-tokens', refreshTokens);
authRouter.get('/check-session', jwtGuard, checkSession);
authRouter.get('/notifications', jwtGuard, getNotifications);
authRouter.post('/sign-out', signOut);

export default authRouter;

