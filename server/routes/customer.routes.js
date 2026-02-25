import express from 'express';
import { getCustomers } from '../controllers/customer.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin only
router.get('/', authenticateToken, requireAdmin, getCustomers);

export default router;
