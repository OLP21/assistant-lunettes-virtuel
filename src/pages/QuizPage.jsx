
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 1.1rem;
`;

const QuizPage = () => {

  const navigate = useNavigate();

  return (
    <PageContainer>
      <Title>Étape 2: Exprimez Votre Style</Title>
      <PlaceholderText>
        Un questionnaire interactif pour cerner vos préférences en matière de lunettes.
        <br />
        (Fonctionnalité à implémenter par Mame Mor)
      </PlaceholderText>
       {/* Exemple de navigation */}
      <Link to="/recommendations">
        <Button variant="outline">Voir les Recommandations (Test)</Button>
      </Link>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Button variant="primary" onClick={() => navigate('/start-analysis')}>Précédent</Button>
          <Button variant="primary" onClick={() => navigate('/recommendations')}>Suivant</Button>
        </div>
    </PageContainer>
  );
};

export default QuizPage;