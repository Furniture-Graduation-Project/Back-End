import { Router } from 'express';
import { StatisticalController } from '../controllers/statistical.js';

const router = Router();

router.get('/from6months', StatisticalController.getStatisticalFrom6MonthsAgo);

export default router;