import React from 'react';
import styled from 'styled-components';
import Button from './common/Button';

const PanelContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SelectionBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem;
  text-align: center; 
`;

const SectionTitle = styled.h4`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
`;

const ProductIdentifier = styled.h3`
  margin-bottom: 1.5rem;
  font-weight: bold;
`;

const FavoriteButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  font-size: 0.9rem;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const InfoPanel = ({ selectedFrame, onDetectShape, onFavorite, faceShape }) => {
  return (
    <PanelContainer>
      {selectedFrame && (
        <SelectionBox>
          <SectionTitle>Votre sélection</SectionTitle>
          <ProductIdentifier>
            {selectedFrame.brand} - {selectedFrame.code}
          </ProductIdentifier>
          <FavoriteButton onClick={() => onFavorite(selectedFrame._id)}>
            ❤️ Ajouter aux favoris
          </FavoriteButton>
        </SelectionBox>
      )}
      <SelectionBox>
        <SectionTitle>Analyse</SectionTitle>
        {faceShape ? (
          <p>Forme du visage détectée : <strong>{faceShape}</strong></p>
        ) : (
          <p>Détecter la forme de votre visage pour de meilleures recommandations.</p>
        )}
        <Button onClick={onDetectShape} style={{ marginTop: '1.5rem', width: '100%' }}>
          {faceShape ? 'Relancer l’analyse' : 'Détecter la forme du visage'}
        </Button>
      </SelectionBox>
    </PanelContainer>
  );
};

export default InfoPanel;