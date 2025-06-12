import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const cardVariants = {
  initial: { scale: 1, opacity: 1, x: 0 },
  liked: { x: 150, rotate: 20, opacity: 0 },
  disliked: { x: -150, rotate: -20, opacity: 0 }
};

const questionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// --- STYLES ---
const PageContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
`;

const Instructions = styled.p`
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  animation: ${fadeIn} 0.5s ease;
`;

const Counter = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SwipeContainer = styled.div`
  position: relative;
  width: 90vw;
  max-width: 400px;
  min-height: 450px;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  width: 90%;
  max-width: 350px;
  aspect-ratio: 3/4;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface || '#fff'};
  box-shadow: 0px 10px 30px -5px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  user-select: none;
  overflow: hidden;
  position: relative;
`;

const CardImage = styled.img`
  max-width: 95%;
  max-height: 60%;
  object-fit: contain;
`;

const CardLabel = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem;
  pointer-events: none;
`;

const ConfirmButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  background: ${({ positive }) => (positive ? '#28a74522' : '#dc354522')};
  color: ${({ positive }) => (positive ? '#28a745' : '#dc3545')};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
`;

const QuestionContainer = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 1rem;
  text-align: center;
`;

const QuestionText = styled.h3`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.primary}20; }
`;

const FinishContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const FinishButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background === '#12121F' ? '#fff' : theme.colors.background};
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
`;

export default function QuizPage() {
  const [glasses, setGlasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('cards');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDir, setLastDir] = useState(null);
  const [likedMap, setLikedMap] = useState({});

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFinish, setShowFinish] = useState(false);
  const navigate = useNavigate();

  const questions = [
    { key: 'frameMaterial', text: 'Quel matériau préférez-vous pour la monture ?', options: ['Métal', 'Acétate', 'Bois'] },
    { key: 'shape', text: 'Quelle forme vous attire le plus ?', options: ['Carrée', 'Ronde', 'Papillon'] },
    { key: 'color', text: 'Quelle palette de couleurs ?', options: ['Neutre', 'Vive', 'Bicolore'] }
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/glasses')
      .then(({ data }) => {
        const list = data.slice(0, 5).map(item => ({ id: item.id, src: item.imageUrl, name: item.name }));
        setGlasses(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = glasses.length;
  const top = glasses[currentIndex];

  const onChoose = (dir, id) => {
    setLastDir(dir);
    setLikedMap(prev => ({ ...prev, [id]: dir === 'right' }));
    setTimeout(() => {
      if (currentIndex < total - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setPhase('questions');
      }
      setLastDir(null);
    }, 500);
  };

  const onAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (questionIndex < questions.length - 1) {
      setTimeout(() => setQuestionIndex(i => i + 1), 400);
    } else {
      setShowFinish(true);
    }
  };

  if (loading) return <PageContainer><Title>Chargement…</Title></PageContainer>;

  return (
    <PageContainer>
      <Title>Choisissez vos lunettes</Title>

      {phase === 'cards' && (
        <>
          <Instructions>Sélectionnez chaque modèle !</Instructions>
          <Counter>{currentIndex + 1} / {total}</Counter>

          <SwipeContainer>
            <AnimatePresence>
              {top && (
                <motion.div
                  key={top.id}
                  variants={cardVariants}
                  initial="initial"
                  animate="initial"
                  exit={lastDir === 'right' ? 'liked' : 'disliked'}
                  transition={{ duration: 0.4 }}>
                  <Card>
                    <CardImage src={top.src} alt={top.name} />
                    <CardLabel>{top.name}</CardLabel>
                    <ButtonOverlay>
                      <ConfirmButton onClick={() => onChoose('disliked', top.id)}>👎</ConfirmButton>
                      <ConfirmButton positive onClick={() => onChoose('liked', top.id)}>👍</ConfirmButton>
                    </ButtonOverlay>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </SwipeContainer>
        </>
      )}

      {phase === 'questions' && !showFinish && (
        <QuestionContainer>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={questionIndex}
              variants={questionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.4 }}>
              <QuestionText>{questions[questionIndex].text}</QuestionText>
              {questions[questionIndex].options.map(opt => (
                <OptionButton key={opt} onClick={() => onAnswer(questions[questionIndex].key, opt)}>
                  {opt}
                </OptionButton>
              ))}
            </motion.div>
          </AnimatePresence>
        </QuestionContainer>
      )}

      {showFinish && (
        <FinishContainer>
          <FinishButton onClick={() => navigate('/result', { state: { likedMap, answers } })}>
            Voir les résultats
          </FinishButton>
        </FinishContainer>
      )}
    </PageContainer>
  );
}

