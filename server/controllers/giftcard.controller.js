import prisma from '../config/db.js';

// Générer un code unique pour carte cadeau
function generateGiftCardCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'LABELIA-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Créer une carte cadeau
export const createGiftCard = async (req, res) => {
  try {
    const { amount, percentage, isPercentage } = req.body;

    if (!amount && !percentage) {
      return res.status(400).json({ error: 'Montant ou pourcentage requis' });
    }

    if (isPercentage && (percentage < 1 || percentage > 100)) {
      return res.status(400).json({ error: 'Le pourcentage doit être entre 1 et 100' });
    }

    if (!isPercentage && amount <= 0) {
      return res.status(400).json({ error: 'Le montant doit être supérieur à 0' });
    }

    const code = generateGiftCardCode();

    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        amount: isPercentage ? 0 : parseFloat(amount),
        percentage: isPercentage ? parseFloat(percentage) : null,
        isPercentage: Boolean(isPercentage)
      }
    });

    res.status(201).json({
      message: 'Carte cadeau créée avec succès',
      giftCard
    });
  } catch (error) {
    console.error('Create gift card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Récupérer toutes les cartes cadeaux
export const getGiftCards = async (req, res) => {
  try {
    const giftCards = await prisma.giftCard.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(giftCards);
  } catch (error) {
    console.error('Get gift cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Vérifier un code de carte cadeau
export const validateGiftCard = async (req, res) => {
  try {
    const { code } = req.params;

    const giftCard = await prisma.giftCard.findUnique({
      where: { code }
    });

    if (!giftCard) {
      return res.status(404).json({ error: 'Carte cadeau invalide' });
    }

    if (giftCard.isUsed) {
      return res.status(400).json({ error: 'Carte cadeau déjà utilisée' });
    }

    res.json({
      valid: true,
      giftCard: {
        id: giftCard.id,
        code: giftCard.code,
        amount: giftCard.amount,
        percentage: giftCard.percentage,
        isPercentage: giftCard.isPercentage
      }
    });
  } catch (error) {
    console.error('Validate gift card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Marquer une carte cadeau comme utilisée
export const markGiftCardAsUsed = async (req, res) => {
  try {
    const { code, email } = req.body;

    const giftCard = await prisma.giftCard.findUnique({
      where: { code }
    });

    if (!giftCard) {
      return res.status(404).json({ error: 'Carte cadeau invalide' });
    }

    if (giftCard.isUsed) {
      return res.status(400).json({ error: 'Carte cadeau déjà utilisée' });
    }

    const updatedGiftCard = await prisma.giftCard.update({
      where: { id: giftCard.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
        usedBy: email
      }
    });

    res.json({
      message: 'Carte cadeau marquée comme utilisée',
      giftCard: updatedGiftCard
    });
  } catch (error) {
    console.error('Mark gift card as used error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
