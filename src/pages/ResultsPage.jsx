// src/pages/ResultsPage.jsx
import React from 'react';
import styled from 'styled-components';
import PageNavigation from '../components/common/PageNavigation';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GlassesGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const GlassCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  width: 180px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlaceholderImg = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  width: 100%;
  height: 120px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const GlassName = styled.p`
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const GlassBrand = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const placeholderGlasses = [
  { id: 1, name: 'Modèle Épuré', brand: 'Marque A' },
  { id: 2, name: 'Style Moderne', brand: 'Marque B' },
  { id: 3, name: 'Design Classique', brand: 'Marque C' },
];

const ResultsPage = () => (
  <PageContainer>
    <Title>Votre Sélection Personnalisée</Title>
    <GlassesGrid>
      {placeholderGlasses.map(glass => (
        <GlassCard key={glass.id}>
          <PlaceholderImg />
          <GlassName>{glass.name}</GlassName>
          <GlassBrand>{glass.brand}</GlassBrand>
        </GlassCard>
      ))}
    </GlassesGrid>
    <PageNavigation previous='/preferences-quiz' />
  </PageContainer>
);

export default ResultsPage;
