import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Products root - placeholder' });
});

export default router;
