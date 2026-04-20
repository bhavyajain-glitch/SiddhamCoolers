import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', (req, res, next) => ProductController.getAll(req, res, next));
router.get('/admin', authenticate, authorize('admin'), (req, res, next) => ProductController.getAllAdmin(req, res, next));
router.get('/:id', (req, res, next) => ProductController.getById(req, res, next));

// Admin-only routes
router.post('/', authenticate, authorize('admin'), (req, res, next) => ProductController.create(req, res, next));
router.put('/:id', authenticate, authorize('admin'), (req, res, next) => ProductController.update(req, res, next));
router.delete('/:id', authenticate, authorize('admin'), (req, res, next) => ProductController.delete(req, res, next));

export default router;
