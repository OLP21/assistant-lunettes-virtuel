// src/pages/ResultsPage.jsx
import React from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */ /* Peut-être pas centré si la liste est longue */
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 1.1rem;
`;

const ResultsPage = () => {

  const navigate = useNavigate();

  return (
    <PageContainer>
      <Title>Votre Sélection Personnalisée</Title>
      <PlaceholderText>
        Affichage de la galerie des lunettes recommandées par l'IA.
        <br />
        (Logique IA par Teddy, Affichage par Mame Mor)

        <Button variant="outline" onClick={() => navigate('/preferences-quiz')}>
  Précédent
</Button>
      </PlaceholderText>
      {/* Ici, tu mapperas sur les résultats pour afficher des RecommendationCard */}
    </PageContainer>
  );
};

export default ResultsPage;