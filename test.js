// test-ai-recommendations.js
import axios from 'axios';


const API_URL = 'http://localhost:5000/api/ai/recommendations';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGE4ZWMwNDE0OWFiNmU1NDlhMmQ5ZCIsImlhdCI6MTc1MDIwMDgwNCwiZXhwIjoxNzUwODA1NjA0fQ.Sp01i_rTmiACAU4wZgKRvwsgjNbqIsFmMTqE5OIIwCY'; // Replace with a real token from a logged-in user

const testPayload = {
  faceShape: "Ovale",
  favoriteStyles: ["Sleek Modern", "Bold Round"], // optional
  quizAnswers: {
    occasion: "Tous les jours / Casual",
    style: "Minimaliste et Épuré",
    color: "Tons neutres (noir, gris)"
  }
};

axios.post(API_URL, testPayload, {
  headers: { Authorization: `Bearer ${TEST_TOKEN}` }
})
.then(res => {
  console.log("✅ Recommandations AI retournées :\n", JSON.stringify(res.data, null, 2));
})
.catch(err => {
  if (err.response) {
    console.error("❌ Erreur HTTP :", err.response.status);
    console.error("Détails :", err.response.data);
  } else {
    console.error("❌ Erreur réseau ou serveur :", err.message);
  }
});
