// src/pages/CapturePage.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Vérifie ce chemin

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

// Définition du composant
const CapturePage = () => { // Assure-toi que le nom du composant est bien 'CapturePage'
  return (
    <PageContainer>
      <Title>Étape 1: Votre Visage, Notre Toile</Title>
      <PlaceholderText>
        Ici, vous pourrez activer votre webcam ou téléverser une photo pour l'analyse faciale.
        <br />
        (Fonctionnalité à implémenter par Mame Mor)
      </PlaceholderText>
      <Link to="/preferences-quiz">
        <Button variant="outline">Passer au Questionnaire (Test)</Button>
      </Link>
    </PageContainer>
  );
};

export default CapturePage; // <--- LIGNE IMPORTANTE !