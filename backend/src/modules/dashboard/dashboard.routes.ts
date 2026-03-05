import { Router } from 'express';
import { jwtGuard } from '../auth/jwtGuard';
import { dashboardFetchHandler } from './dashboard.handler';

const router = Router();

router.get('/fetch', jwtGuard, dashboardFetchHandler);

export default router;
