import { Router } from 'express';
import ensureAdmin from '../../shared/middleware/ensureAdmin';
import { validateReportHandler, submitReportHandler, listReportsHandler, deleteReportHandler, updateReportStatusHandler } from './reports.handler';

const router = Router();

// Public routes (no authentication)
router.get('/validate-report', validateReportHandler);
router.post('/submit-report', submitReportHandler);

// Protected routes (admin only)
router.get('/list', ensureAdmin, listReportsHandler);
router.delete('/delete-report/:id', ensureAdmin, deleteReportHandler);
router.patch('/update-report-status', ensureAdmin, updateReportStatusHandler);

export default router;
