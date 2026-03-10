import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Cloudinary lit automatiquement CLOUDINARY_URL depuis les variables d'environnement
// Pas besoin d'appeler cloudinary.config() manuellement

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'labelia', // Dossier pour organiser les images
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
    ]
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  }
});

// Middleware pour l'upload d'une seule image
export const uploadSingle = multer({ storage }).single('image');

// Middleware pour l'upload multiple (pour les variations de couleur)
export const uploadMultiple = multer({ storage }).array('images', 10); // max 10 images

// Exporter cloudinary si besoin ailleurs
export { cloudinary };
