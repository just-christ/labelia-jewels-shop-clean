import express from 'express';
import { 
  createGiftCard, 
  getGiftCards, 
  validateGiftCard, 
  markGiftCardAsUsed 
} from '../controllers/giftcard.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes admin (protégées)
router.post('/', authenticateToken, requireAdmin, createGiftCard);  // Créer une carte cadeau
router.get('/', authenticateToken, requireAdmin, getGiftCards);  // Lister toutes les cartes

// Routes publiques
router.get('/validate/:code', validateGiftCard);  // Vérifier un code
router.post('/mark-used', markGiftCardAsUsed);  // Marquer comme utilisée

export default router;
