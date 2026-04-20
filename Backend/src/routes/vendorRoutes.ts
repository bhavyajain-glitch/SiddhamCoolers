import { Router } from 'express';
import VendorController from '../controllers/VendorController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All vendor routes require authentication
router.use(authenticate);

// Vendor's own dashboard (must be before /:id to avoid conflict)
router.get('/me/dashboard', authorize('retailer'), (req, res, next) => VendorController.myDashboard(req, res, next));

// Admin-only routes
router.get('/', authorize('admin'), (req, res, next) => VendorController.getAll(req, res, next));
router.post('/', authorize('admin'), (req, res, next) => VendorController.create(req, res, next));
router.delete('/:id', authorize('admin'), (req, res, next) => VendorController.delete(req, res, next));

// Sales & payouts (vendor sees own; admin sees any)
router.get('/:id', authorize('admin'), (req, res, next) => VendorController.getById(req, res, next));
router.get('/:id/sales', authorize('admin', 'retailer'), (req, res, next) => VendorController.getSales(req, res, next));
router.get('/:id/payouts', authorize('admin', 'retailer'), (req, res, next) => VendorController.getPayouts(req, res, next));

export default router;
