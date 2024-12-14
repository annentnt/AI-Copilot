import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authMiddleware, authController.logout);

export default router;
