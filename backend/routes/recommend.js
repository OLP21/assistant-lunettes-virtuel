const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', async (req, res) => {
  const { quizAnswers, likedGlasses, faceShape } = req.body;
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY manquante' });
    }

    const jsonPath = path.join(__dirname, '..', '..', 'glassesData.json');
    const json = fs.readFileSync(jsonPath, 'utf-8');
    const allGlasses = JSON.parse(json);
    let recommended = [];

    const prompt = `Tu es un assistant qui recommande des montures de lunettes. En te basant sur les réponses au quiz suivantes ${JSON.stringify(quizAnswers)}, sur les modèles aimés ${JSON.stringify(likedGlasses)} et sur la forme du visage ${faceShape}, choisis trois montures parmi cette liste : ${allGlasses.map(g => g.code).join(', ')}. Réponds uniquement par un tableau JSON des codes.`;

    try {
      const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });

      const codes = JSON.parse(data.choices[0].message.content);
      recommended = allGlasses.filter(g => codes.includes(g.code)).slice(0, 3);
    } catch (err) {
      console.error('OpenAI request failed');
      return res.status(500).json({ error: "Échec de l'appel à OpenAI" });
    }

    if (recommended.length === 0) {
      return res.status(500).json({ error: 'Aucune recommandation reçue' });
    }

    res.json(recommended);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Échec de la recommandation' });
  }
});

module.exports = router;
