// src/pages/QuizPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PageContainer = styled.div`
  padding: 8rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;

const Instructions = styled.p`
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const QuestionContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  text-align: center;
`;

const QuestionText = styled.h3`
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const FinishButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 2rem;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const questionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchedFavorites, setFetchedFavorites] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { faceShape } = location.state || { faceShape: null };

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3001/api/user/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFetchedFavorites(res.data);
        console.log('★ Favoris récupérés via API :', res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des favoris :", err);
        // Optionally, notify the user that favorites couldn't be loaded
        // toast.warn("Impossible de charger vos favoris pour les recommandations.");
      }
    };

    fetchFavorites();
  }, []);

  const questions = [
    {
      key: 'occasion',
      text: 'Pour quelle occasion principale porterez-vous ces lunettes ?',
      options: ['Travail / Professionnel', 'Tous les jours / Casual', 'Soirée / Élégant', 'Indifférent']
    },
    {
      key: 'style',
      text: 'Quel style de monture vous attire le plus ?',
      options: ['moderne', 'classique', 'audacieux', 'tendance', 'vintage', 'iconique', 'original', 'rétro', 'Indifférent']
    },
    {
      key: 'color',
      text: 'Quelle couleur préférez-vous ?',
      options: ['noir', 'gris', 'écaille', 'marron', 'doré', 'argenté', 'transparent', 'rouge', 'Indifférent']
    }
  ];

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(i => i + 1);
    }
  };

  const handleGetRecommendations = async () => {
    setIsSubmitting(true);

    const userDataForAI = {
      faceShape: faceShape, // No need for fallback here, it's handled in backend
      favoriteStyles: fetchedFavorites.map(f => f.name),
      quizAnswers: answers
    };

    console.log("📤 Données envoyées à l'IA :", userDataForAI);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3001/api/ai/recommendations', userDataForAI, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/results', { state: { recommendations: res.data.recommendations } });
    } catch (err) {
      toast.error("Une erreur est survenue lors de la génération de vos recommandations.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  return (
    <PageContainer>
      <Title>Affinez votre style</Title>
      <Instructions>Répondez à quelques questions pour nous aider à trouver la paire parfaite pour vous.</Instructions>
      <QuestionContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            variants={questionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <QuestionText>{questions[questionIndex].text}</QuestionText>
            {questions[questionIndex].options.map(opt => (
              <OptionButton key={opt} onClick={() => handleAnswer(questions[questionIndex].key, opt)}>{opt}</OptionButton>
            ))}
          </motion.div>
        </AnimatePresence>
      </QuestionContainer>

      {allQuestionsAnswered && (
        <FinishButton onClick={handleGetRecommendations} disabled={isSubmitting}>
          {isSubmitting ? 'Analyse en cours...' : 'Obtenir mes recommandations'}
        </FinishButton>
      )}
    </PageContainer>
  );
}