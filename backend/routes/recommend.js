const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Glasses = require('../models/Glasses');
const router = express.Router();

router.post('/', async (req, res) => {
  const { quizAnswers, likedGlasses, faceShape } = req.body;
  try {
    let allGlasses = [];

    try {
      allGlasses = await Glasses.find();
    } catch (dbErr) {
      console.warn('Database unavailable, falling back to JSON data');
    }

    if (!allGlasses || allGlasses.length === 0) {
      const jsonPath = path.join(__dirname, '..', '..', 'glassesData.json');
      const json = fs.readFileSync(jsonPath, 'utf-8');
      allGlasses = JSON.parse(json);
    }
    const prompt = `Tu es un assistant qui recommande des montures de lunettes. En te basant sur les réponses au quiz suivantes ${JSON.stringify(quizAnswers)}, sur les modèles aimés ${JSON.stringify(likedGlasses)} et sur la forme du visage ${faceShape}, choisis trois montures parmi cette liste : ${allGlasses.map(g => g.code).join(', ')}. Réponds uniquement par un tableau JSON des codes.`;

    const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    let codes = [];
    try {
      codes = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      return res.status(500).json({ error: 'Réponse OpenAI invalide' });
    }

    const recommended = allGlasses.filter(g => codes.includes(g.code)).slice(0, 3);
    res.json(recommended);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Échec de la recommandation' });
  }
});

module.exports = router;
