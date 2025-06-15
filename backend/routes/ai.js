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

    // Étape 1 : Pré-filtrage dans notre base de données
    const query = { 'tags.shapeMatch': faceShape || 'Ovale' };
    if (quizAnswers.style && quizAnswers.style !== 'Indifférent') {
      query['tags.style'] = quizAnswers.style;
    }
    const candidateGlasses = await Glasses.find(query).limit(10);

    if (candidateGlasses.length === 0) {
      return res.json({ recommendations: [] });
    }

    const candidateList = JSON.stringify(candidateGlasses.map(g => ({ code: g.code, name: g.name, brand: g.brand, tags: g.tags })));
    let favoritesText = "The client has not specified any favorite styles yet.";
    if (favoriteStyles && favoriteStyles.length > 0) {
        favoritesText = `They have previously favorited glasses like: ${favoriteStyles.join(', ')}.`;
    }
    const userStyle = `For a ${quizAnswers.style} style, for ${quizAnswers.occasion} occasions. They like ${quizAnswers.color} colors.`;

    // Étape 2 : Prompt mis à jour pour ne demander QUE les 'code' et 'reasoning'
    const prompt = `
      You are a world-class expert eyewear stylist.
      A client has a "${faceShape}" face shape. Their personal style is: "${userStyle}". ${favoritesText}

      From the following 'Candidate List', your only task is to select the top 3 best matches.
      Your final answer MUST be a valid JSON object with a single key "recommendations" which holds an array of exactly 3 objects.
      Each object must have ONLY two keys: "code" (the product code from the list) and "reasoning" (a brief explanation in French for your choice).
      Do not include any other data like name, brand, or imageUrl in your response.

      Candidate List:
      ${candidateList}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    if (!aiResponse.recommendations || !Array.isArray(aiResponse.recommendations)) {
      throw new Error("La réponse de l'IA n'a pas la structure attendue.");
    }

    // Étape 3 : Extraire les codes et les raisonnements
    const recommendedCodes = aiResponse.recommendations.map(rec => rec.code);
    const reasoningMap = aiResponse.recommendations.reduce((map, rec) => {
      map[rec.code] = rec.reasoning;
      return map;
    }, {});

    // Étape 4 : Récupérer les données 100% fiables depuis VOTRE base de données
    const finalGlassesData = await Glasses.find({ 'code': { $in: recommendedCodes } });

    // Étape 5 : Assembler la réponse finale et fiable
    const finalRecommendations = finalGlassesData.map(glass => ({
      ...glass.toObject(),
      reasoning: reasoningMap[glass.code] || "Cette paire est un excellent choix."
    }));
    
    // On s'assure que l'ordre est le même que celui recommandé par l'IA
    finalRecommendations.sort((a, b) => recommendedCodes.indexOf(a.code) - recommendedCodes.indexOf(b.code));

    res.json({ recommendations: finalRecommendations });

  } catch (error) {
    console.error('Erreur de l\'API OpenAI ou du parsing:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des recommandations IA.' });
  }
});

module.exports = router;