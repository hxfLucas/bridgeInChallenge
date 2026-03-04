import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'Contents root - list placeholder' });
});

router.get('/:id', async (req, res) => {
  res.json({ id: req.params.id, content: 'Example content' });
});

export default router;
