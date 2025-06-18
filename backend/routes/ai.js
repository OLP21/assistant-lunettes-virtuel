// backend/routes/ai.js

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
    console.log("📥 Données reçues du client :", req.body);

    const { faceShape, favoriteStyles, quizAnswers } = req.body;

    // --- START OF FIX ---

    // 1. Get the face shape and convert it to lowercase to match the database values (e.g., "Ovale" -> "ovale").
    // This is the primary fix for the case-sensitivity issue.
    const shapeToQuery = (faceShape || 'Ovale').toLowerCase();

    // 2. Build the query using the corrected lowercase value.
    const query = { 'tags.shapeMatch': shapeToQuery };

    // 3. The style filter is now effective because the main shapeMatch query will work.
    if (quizAnswers.style && quizAnswers.style !== 'Indifférent') {
      // Your quiz and database 'style' values are already lowercase, so this works correctly.
      query['tags.style'] = quizAnswers.style;
    }

    // --- END OF FIX ---

    console.log("🔍 Requête MongoDB générée (corrigée) :", query);
    const candidateGlasses = await Glasses.find(query).limit(25); // Increased limit for more AI options

    console.log(`🕶️ ${candidateGlasses.length} montures candidates trouvées.`);

    if (candidateGlasses.length === 0) {
      console.log("⚠️ Aucune monture trouvée avec ce filtre. La combinaison de forme et style est peut-être trop restrictive ou n'existe pas en base.");
      return res.json({ recommendations: [] });
    }

    // Préparation du prompt
    const candidateList = JSON.stringify(candidateGlasses.map(g => ({
      code: g.code,
      name: g.name,
      brand: g.brand,
      tags: g.tags
    })));

    let favoritesText = "The client has not specified any favorite styles yet.";
    if (favoriteStyles && favoriteStyles.length > 0) {
      favoritesText = `They have previously favorited glasses like: ${favoriteStyles.join(', ')}.`;
    }

    const userStyle = `For a ${quizAnswers.style} style, for ${quizAnswers.occasion} occasions. They like ${quizAnswers.color} colors.`;

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

    console.log("🧠 Prompt envoyé à l'IA (après correction du filtre).");

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    console.log("🧾 Réponse OpenAI brute :", completion.choices[0].message.content);

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    if (!aiResponse.recommendations || !Array.isArray(aiResponse.recommendations)) {
      throw new Error("La réponse de l'IA n'a pas la structure attendue.");
    }

    const recommendedCodes = aiResponse.recommendations.map(rec => rec.code);
    const reasoningMap = aiResponse.recommendations.reduce((map, rec) => {
      map[rec.code] = rec.reasoning;
      return map;
    }, {});

    console.log("✅ Codes recommandés :", recommendedCodes);

    const finalGlassesData = await Glasses.find({ code: { $in: recommendedCodes } });

    const finalRecommendations = finalGlassesData.map(glass => ({
      ...glass.toObject(),
      reasoning: reasoningMap[glass.code] || "Cette paire est un excellent choix."
    }));

    // Ensure the final order matches the AI's recommendation order
    finalRecommendations.sort(
      (a, b) => recommendedCodes.indexOf(a.code) - recommendedCodes.indexOf(b.code)
    );

    console.log("🎁 Recommandations finales envoyées au client :", finalRecommendations);

    res.json({ recommendations: finalRecommendations });

  } catch (error) {
    console.error('❌ Erreur de l\'API OpenAI ou du parsing:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des recommandations IA.' });
  }
});

module.exports = router;