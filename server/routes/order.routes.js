import express from 'express';
import { 
  createOrder, 
  getOrders, 
  updateOrderStatus,
  deleteOrder
} from '../controllers/order.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getOrders);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.delete('/:id', authenticateToken, requireAdmin, deleteOrder);

export default router;
