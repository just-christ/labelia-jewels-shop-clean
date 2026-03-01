import express from 'express';
import { uploadSingle, deleteImage } from '../middleware/upload.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route pour uploader une seule image (admin uniquement)
router.post('/single', authenticateToken, requireAdmin, uploadSingle, (req, res) => {
  try {
    console.log('Upload request - file:', req.file);
    console.log('Upload request - body:', req.body);
    
    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Vérifier les erreurs de multer
    if (req.file && req.file.size === 0) {
      console.log('❌ Empty file');
      return res.status(422).json({ error: 'Fichier vide' });
    }

    console.log('✅ File received:', req.file.filename, 'Size:', req.file.size, 'Type:', req.file.mimetype);

    // URL dynamique selon l'environnement
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://labelia-backend.onrender.com'
      : 'http://localhost:5000';
    
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log('✅ Upload success:', imageUrl);
    
    res.json({
      message: 'Image uploadée avec succès',
      filename: req.file.filename,
      url: imageUrl
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Erreur lors de l\'upload', details: error.message });
  }
});

// Route pour supprimer une image
router.delete('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    if (deleteImage(filename)) {
      res.json({ message: 'Image supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Image non trouvée' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;
