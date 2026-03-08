// Importer la configuration Cloudinary
import { uploadSingle, uploadMultiple } from '../config/cloudinary.js';

// Réexporter les middleware Cloudinary
export { uploadSingle, uploadMultiple };

// Garder la fonction deleteImage pour compatibilité (à implémenter plus tard si besoin)
export const deleteImage = (filename) => {
  // TODO: Implémenter la suppression d'image sur Cloudinary
  console.log(`🗑️ Delete image requested: ${filename} (Cloudinary deletion not implemented)`);
  return true; // Temporairement retourner true
};
