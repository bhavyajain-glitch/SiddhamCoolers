import { Router } from 'express';
import CartController from '../controllers/CartController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', (req, res, next) => CartController.getCart(req, res, next));
router.post('/items', (req, res, next) => CartController.addItem(req, res, next));
router.put('/items/:productId', (req, res, next) => CartController.updateItem(req, res, next));
router.delete('/items/:productId', (req, res, next) => CartController.removeItem(req, res, next));
router.delete('/', (req, res, next) => CartController.clearCart(req, res, next));

export default router;
