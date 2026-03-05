import { NextFunction, Request, Response } from 'express';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction){
  const status = err?.status || 500;
  console.error('Unhandled error handler:', err);
  res.status(status).json({ message: err?.message || 'Internal Server Error' });
}
