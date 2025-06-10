import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
  text-align: center;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const Image = styled.img`
  width: 300px;
  height: 400px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  object-fit: contain;
  margin-bottom: 1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 2rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  background-color: ${({ like }) => (like ? '#28a745' : '#dc3545')};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const QuestionTitle = styled.h3`
  margin-bottom: 1rem;
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ChoiceButton = styled.button`
  border: 2px solid ${({ selected }) => (selected ? '#007bff' : '#ccc')};
  border-radius: 12px;
  padding: 10px;
  width: 140px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#e6f0ff' : '#fff')};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  user-select: none;

  &:hover {
    border-color: #007bff;
  }
`;

const NextButton = styled.button`
  padding: 10px 30px;
  border-radius: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  margin-top: 1rem;
`;

const QuizPage = () => {
  // Étape 1 : Swipe simplifié avec boutons "J’aime" / "J’aime pas"
  const glassesImages = [
    'assets/lunettes/AN6216.png',
    'assets/lunettes/AN7209.png',
    'assets/lunettes/OV5459U.png',
    'assets/lunettes/OX8026.png',
    'assets/lunettes/OX8156.png',
  ];

  const [currentGlassesIndex, setCurrentGlassesIndex] = useState(0);
  const [likedGlasses, setLikedGlasses] = useState({});
  const [currentStep, setCurrentStep] = useState('swipe'); // swipe ou questions

  // Étape 2 : Questions avec choix multiples emojis
  const questions = [
    {
      id: 1,
      question: "Quel style de lunettes préférez-vous ?",
      choices: [
        { id: 'classique', label: 'Classique', emoji: '👓' },
        { id: 'moderne', label: 'Moderne', emoji: '🕶️' },
        { id: 'rétro', label: 'Rétro', emoji: '🥽' },
        { id: 'sport', label: 'Sport', emoji: '🏃‍♂️' },
      ],
    },
    {
      id: 2,
      question: "Quelle matière préférez-vous pour vos lunettes ?",
      choices: [
        { id: 'metal', label: 'Métal', emoji: '🔩' },
        { id: 'plastique', label: 'Plastique', emoji: '🧴' },
        { id: 'bois', label: 'Bois', emoji: '🌳' },
        { id: 'titane', label: 'Titane', emoji: '⚙️' },
      ],
    },
    {
      id: 3,
      question: "Pour quelle occasion portez-vous principalement vos lunettes ?",
      choices: [
        { id: 'quotidien', label: 'Quotidien', emoji: '🏠' },
        { id: 'travail', label: 'Travail', emoji: '💼' },
        { id: 'sport', label: 'Sport', emoji: '⚽' },
        { id: 'sorties', label: 'Sorties', emoji: '🎉' },
      ],
    },
    {
      id: 4,
      question: "Quelle couleur vous attire le plus ?",
      choices: [
        { id: 'noir', label: 'Noir', emoji: '⬛' },
        { id: 'marron', label: 'Marron', emoji: '🟫' },
        { id: 'transparent', label: 'Transparent', emoji: '⬜' },
        { id: 'rouge', label: 'Rouge', emoji: '🟥' },
      ],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Gestion choix j'aime / j'aime pas lunettes
  const handleGlassesChoice = (like) => {
    const image = glassesImages[currentGlassesIndex];
    setLikedGlasses((prev) => ({
      ...prev,
      [image]: like,
    }));

    if (currentGlassesIndex + 1 < glassesImages.length) {
      setCurrentGlassesIndex(currentGlassesIndex + 1);
    } else {
      setCurrentStep('questions');
    }
  };

  // Gestion choix question
  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoice = answers[currentQuestion?.id];

  const selectChoice = (choiceId) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceId,
    }));
  };

  const nextQuestion = () => {
    if (!selectedChoice) return;
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSubmit = () => {
    console.log('Choix lunettes:', likedGlasses);
    console.log('Réponses questions:', answers);
    alert('Merci pour vos réponses !');
  };

  return (
    <PageContainer>
      {currentStep === 'swipe' && (
        <>
          <Title>Étape 1 : Évaluez ces lunettes</Title>
          <Image
            src={`/${glassesImages[currentGlassesIndex]}`}
            alt="Lunettes"
            onError={e => {
              e.target.onerror = null;
              e.target.src =
                'https://via.placeholder.com/300x400.png?text=Lunettes';
            }}
          />
          <ButtonsContainer>
            <Button like={false} onClick={() => handleGlassesChoice(false)}>
              J’aime pas
            </Button>
            <Button like={true} onClick={() => handleGlassesChoice(true)}>
              J’aime
            </Button>
          </ButtonsContainer>
          <p>
            {currentGlassesIndex + 1} / {glassesImages.length}
          </p>
        </>
      )}

      {currentStep === 'questions' && (
        <>
          <Title>Étape 2 : Question {currentQuestionIndex + 1} / {questions.length}</Title>
          <QuestionTitle>{currentQuestion.question}</QuestionTitle>
          <ChoicesContainer>
            {currentQuestion.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                selected={selectedChoice === choice.id}
                onClick={() => selectChoice(choice.id)}
              >
                <span style={{ fontSize: '3rem' }}>{choice.emoji}</span>
                {choice.label}
              </ChoiceButton>
            ))}
          </ChoicesContainer>

          {!isLastQuestion && (
            <NextButton onClick={nextQuestion} disabled={!selectedChoice}>
              Suivant
            </NextButton>
          )}
          {isLastQuestion && selectedChoice && (
            <NextButton onClick={handleSubmit}>Valider</NextButton>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default QuizPage;




