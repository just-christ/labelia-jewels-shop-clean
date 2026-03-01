import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { 
  getPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion,
  validatePromotionCode
} from '../controllers/promotion.controller.js';

const router = express.Router();

// Routes publiques (pas d'authentification)
router.get('/', getPromotions);
router.post('/validate', validatePromotionCode);

// Routes protégées (admin uniquement)
router.use(authenticateToken, requireAdmin);

router.post('/', createPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;
