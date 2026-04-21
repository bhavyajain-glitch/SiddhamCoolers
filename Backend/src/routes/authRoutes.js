import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res, next) => AuthController.register(req, res, next));
router.post('/login', (req, res, next) => AuthController.login(req, res, next));
router.get('/me', authenticate, (req, res, next) => AuthController.getMe(req, res, next));
router.put('/profile', authenticate, (req, res, next) => AuthController.updateProfile(req, res, next));

export default router;
