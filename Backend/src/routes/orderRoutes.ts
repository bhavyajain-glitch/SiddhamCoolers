import { Router } from 'express';
import OrderController from '../controllers/OrderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.post('/', (req, res, next) => OrderController.create(req, res, next));
router.get('/', (req, res, next) => OrderController.getAll(req, res, next));
router.get('/analytics', authorize('admin'), (req, res, next) => OrderController.getAnalytics(req, res, next));
router.get('/:id', (req, res, next) => OrderController.getById(req, res, next));
router.patch('/:id/status', authorize('admin'), (req, res, next) => OrderController.updateStatus(req, res, next));

export default router;
