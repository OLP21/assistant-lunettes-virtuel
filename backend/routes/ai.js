const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const Glasses = require('../models/Glasses');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/recommendations', auth, async (req, res) => {
  try {
    const { faceShape, favoriteStyles, quizAnswers } = req.body;

    const allGlasses = await Glasses.find({}, 'code name brand imageUrl tags -_id');
    const masterList = JSON.stringify(allGlasses);

    let favoritesText = "The client has not specified any favorite styles yet.";
    if (favoriteStyles && favoriteStyles.length > 0) {
        favoritesText = `They have previously favorited glasses like: ${favoriteStyles.join(', ')}.`;
    }
    const userStyle = `For a ${quizAnswers.style} style, for ${quizAnswers.occasion} occasions. They like ${quizAnswers.color} colors.`;

    const prompt = `
      You are a world-class expert eyewear stylist.
      A client has a "${faceShape}" face shape.
      Their personal style is: "${userStyle}".
      ${favoritesText}

      Based on all this information, from the following master list of available glasses, you MUST recommend exactly 3 pairs.
      Your recommendations MUST be chosen exclusively from the items in the 'Master List' below. Do not invent any glasses or properties.
      When you choose a pair, you MUST use the exact, unmodified "code", "name", "brand", and "imageUrl" from the Master List item.
      For each recommendation, provide a brief "reasoning" in French explaining WHY it's a great choice.
      Your final answer MUST be a valid JSON object with a single key "recommendations" which holds an array of exactly 3 objects. Do not include any other text or explanations outside of this JSON structure.

      Master List:
      ${masterList}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    let recommendationsData = JSON.parse(completion.choices[0].message.content);
    
    if (Array.isArray(recommendationsData)) {
      recommendationsData = { recommendations: recommendationsData };
    } else if (!recommendationsData.recommendations || !Array.isArray(recommendationsData.recommendations)) {
      throw new Error("La réponse de l'IA n'a pas le format attendu.");
    }

    res.json(recommendationsData);

  } catch (error) {
    console.error('Erreur de l\'API OpenAI ou du parsing:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des recommandations IA.' });
  }
});

module.exports = router;