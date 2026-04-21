import { Router } from 'express';
import CouponController from '../controllers/CouponController.js';

const router = Router();

router.post('/validate', (req, res, next) => CouponController.validate(req, res, next));

export default router;
