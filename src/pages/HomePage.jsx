// src/pages/HomePage.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Vérifie ce chemin

// ... (tes Styled Components: HomePageContainer, Title, Subtitle, etc.)
const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px); 
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow: hidden; 
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem); 
  margin-bottom: ${({ theme }) => theme.spacing.md}; 
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary}, ${({ theme }) => theme.colors.primary});
  background-size: 200% auto; 
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShine 5s linear infinite;
  filter: drop-shadow(0 0 15px ${({ theme }) => theme.colors.primary}99); 

  @keyframes gradientShine {
    to {
      background-position: -200% center;
    }
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.5rem); 
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl}; 
  max-width: 700px;
  line-height: 1.7;
`;

const StyledLink = styled(Link)`
  text-decoration: none; 
`;

const CTANote = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.lg}; 
`;


// Définition du composant
const HomePage = () => { // Assure-toi que le nom du composant est bien 'HomePage'
  return (
    <HomePageContainer>
      <Title>Vision AI: Lunettes Réinventées</Title>
      <Subtitle>
        Découvrez la paire parfaite grâce à notre intelligence artificielle.
        Une analyse morphologique et stylistique pour un choix éclairé et personnalisé.
      </Subtitle>
      <StyledLink to="/start-analysis">
        <Button variant="solid" size="large">
          Commencer l'Expérience
        </Button>
      </StyledLink>
      <CTANote>Préparez votre webcam ou une photo de face pour une analyse optimale.</CTANote>
    </HomePageContainer>
  );
};

export default HomePage; // <--- LIGNE CRUCIALE !