import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 8rem 2rem 2rem 2rem;
  max-width: 960px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 3rem;
  font-size: 1.2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const RecommendationCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  width: 200px;
`;

const DetailsContainer = styled.div`
  text-align: left;
`;

const ReasoningText = styled.blockquote`
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  font-style: italic;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButton = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ResultsPage = () => {
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];

  // AJOUT DU TEST : Affiche la source et le contenu des données dans la console
  useEffect(() => {
    console.log("Données reçues par la ResultsPage via location.state :", recommendations);
  }, [recommendations]);


  if (recommendations.length === 0) {
    return (
      <PageContainer>
        <Title>Désolé !</Title>
        <Subtitle>Nous n'avons pas pu générer de recommandations. Veuillez réessayer.</Subtitle>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>Votre Sélection Personnalisée</Title>
      <Subtitle>Basé sur votre visage et vos préférences, voici les paires que notre IA vous recommande.</Subtitle>
      <ResultsGrid>
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.code}>
            <ImageContainer>
              <img src={rec.imageUrl} alt={rec.name} style={{ width: '100%' }} />
            </ImageContainer>
            <DetailsContainer>
              <h3>{rec.brand}</h3>
              <h4 style={{ fontWeight: 'normal' }}>{rec.name}</h4>
              <ReasoningText>"{rec.reasoning}"</ReasoningText>
              <ActionButton 
                to={`/start-analysis`} 
                state={{ preselectedCode: rec.code }} 
              >
                Essayer ce modèle
              </ActionButton>
            </DetailsContainer>
          </RecommendationCard>
        ))}
      </ResultsGrid>
    </PageContainer>
  );
};

export default ResultsPage;