// backend/routes/user.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Glasses = require('../models/Glasses');
const authMiddleware = require('../middleware/auth');

// POST /api/user/favorites
// Add a pair of glasses to the user's favorites
router.post('/favorites', authMiddleware, async (req, res) => {
  const { glassesId } = req.body;

  if (!glassesId) {
    return res.status(400).json({ error: 'ID de lunettes requis.' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const alreadyExists = user.favorites.some(
      fav => fav.glasses.toString() === glassesId
    );

    if (alreadyExists) {
      return res.status(200).json({ message: 'Déjà en favoris.' });
    }

    user.favorites.push({ glasses: glassesId });
    await user.save();

    res.status(201).json({ message: 'Ajouté aux favoris.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/user/favorites
// Fetch all glasses in the user's favorites
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites.glasses');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Extract populated glasses list
    const favoriteGlasses = user.favorites.map(fav => fav.glasses);
    res.status(200).json(favoriteGlasses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du chargement des favoris.' });
  }
});

// DELETE /api/user/favorites/:id
// Remove a pair of glasses from the user's favorites
router.delete('/favorites/:id', authMiddleware, async (req, res) => {
    const glassesIdToRemove = req.params.id;
  
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
  
      // Use $pull to remove the object containing the matching glasses ID
      // from the favorites array.
      user.favorites.pull({ glasses: glassesIdToRemove });
      
      await user.save();
      
      // Send back a success message
      res.status(200).json({ message: 'Favori supprimé avec succès.' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  
module.exports = router;
