import { PrismaClient } from '@prisma/client';

let prisma;

if (typeof global.prisma !== 'undefined') {
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
  global.prisma = prisma;
}

export const getPromotions = async (req, res) => {
  try {
    console.log('🔍 Getting promotions...');
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log('✅ Promotions found:', promotions.length);
    res.json(promotions);
  } catch (error) {
    console.error('❌ Get promotions error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const createPromotion = async (req, res) => {
  try {
    console.log('📦 Body reçu:', req.body);
    const { code, description, discount, isPercentage, startDate, endDate } = req.body;
    
    // Validation
    if (!code) {
      return res.status(400).json({ error: 'Code promotion requis' });
    }
    
    if (discount === undefined || discount === null || discount === "" || isNaN(parseFloat(discount))) {
      return res.status(400).json({ error: 'Montant de réduction requis' });
    }
    
    const promotion = await prisma.promotion.create({
      data: {
        code,
        description: description || '',
        discount: parseFloat(discount),
        isPercentage: Boolean(isPercentage),
        active: true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });
    
    res.status(201).json(promotion);
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, discount, isPercentage, startDate, endDate, active } = req.body;
    
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        ...(code !== undefined && { code }),
        ...(description !== undefined && { description }),
        ...(discount !== undefined && { discount: parseFloat(discount) }),
        ...(isPercentage !== undefined && { isPercentage: Boolean(isPercentage) }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      }
    });
    
    res.json(promotion);
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.promotion.delete({
      where: { id }
    });
    
    res.json({ message: 'Promotion supprimée avec succès' });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validatePromotionCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    const promotion = await prisma.promotion.findFirst({
      where: { 
        code,
        active: true,
        OR: [
          { startDate: { lte: new Date() } },
          { endDate: { gte: new Date() } }
        ]
      }
    });
    
    if (!promotion) {
      return res.json({ valid: false, message: 'Code promotion invalide ou expiré' });
    }
    
    res.json({ 
      valid: true, 
      promotion: {
        id: promotion.id,
        code: promotion.code,
        discount: promotion.discount,
        isPercentage: promotion.isPercentage,
        description: promotion.description
      }
    });
  } catch (error) {
    console.error('Validate promotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
