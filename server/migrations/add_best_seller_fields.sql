-- Migration pour ajouter les champs best seller à la table products
-- À exécuter manuellement sur Render Dashboard

-- Ajout du champ isBestSeller
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE;

-- Ajout du champ bestSellerOrder  
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS best_seller_order INTEGER;

-- Mise à jour des produits existants (optionnel)
UPDATE products 
SET is_best_seller = FALSE 
WHERE is_best_seller IS NULL;

UPDATE products 
SET best_seller_order = NULL 
WHERE best_seller_order IS NULL;
