import express from 'express';
import { login, registerAdmin, getAdmins } from '../controllers/auth.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register-admin', authenticateToken, requireAdmin, registerAdmin);  // 🆕 Route protégée
router.get('/admins', authenticateToken, requireAdmin, getAdmins);  // 🆕 Route protégée

export default router;
