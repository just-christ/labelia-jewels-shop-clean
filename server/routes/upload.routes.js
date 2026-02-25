import express from 'express';
import { uploadSingle, deleteImage } from '../middleware/upload.js';

const router = express.Router();

// Route pour uploader une seule image
router.post('/single', uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Image uploadée avec succès',
      filename: req.file.filename,
      url: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
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
