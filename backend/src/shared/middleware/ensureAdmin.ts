import { RequestHandler } from 'express';

// Assumes `requestContextMiddleware` populates `req.user` with `{ id, role, companyId, ... }`.
export const ensureAdmin: RequestHandler = (req, res, next) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  return next();
};

export default ensureAdmin;
