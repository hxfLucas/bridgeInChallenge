import { NextFunction, Request, Response } from 'express';
import { getDashboardStats } from './dashboard.service';

export async function dashboardFetchHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}
