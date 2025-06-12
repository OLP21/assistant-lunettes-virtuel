// src/components/GlassesGallery.jsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import LoginPromptModal from './common/LoginPromptModal';
import { toast } from 'react-toastify';

const GalleryContainer = styled.div`
  margin-top: 2rem;
`;

const Title = styled.h3`
  text-align: left;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
`;

const GlassItem = styled.div`
  text-align: center;
  cursor: pointer;
`;

const GlassImage = styled.img`
  height: 80px;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;

const GlassText = styled.p`
  margin: 0.2rem 0;
  font-size: 0.9rem;
`;

const LikeButton = styled.button`
  margin-top: 0.4rem;
  font-size: 0.85rem;
  background: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 4px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.2s ease;

  &:hover {
    background: #ffe6e6;
    border-color: #ff4d4d;
    color: #d60000;
  }

  svg {
    fill: currentColor;
  }
`;

const GlassesGallery = ({ onSelect }) => {
  const [glasses, setGlasses] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/glasses')
      .then(res => setGlasses(res.data))
      .catch((err) => console.error('Failed to load glasses:', err));
  }, []);

  const handleFavorite = async (glassesId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/user/favorites',
        { glassesId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ajouté aux favoris !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout aux favoris");
    }
  };

  return (
    <GalleryContainer>
      <Title>Galerie de lunettes</Title>
      <Grid>
        {glasses.map(glass => (
          <GlassItem key={glass._id}>
            <GlassImage
              src={glass.imageUrl}
              alt={glass.code}
              onClick={() => onSelect(glass)}
            />
            <GlassText><strong>{glass.code}</strong></GlassText>
            <GlassText>{glass.brand}</GlassText>
            <LikeButton onClick={() => handleFavorite(glass._id)}>
              ❤️ Ajouter
            </LikeButton>
          </GlassItem>
        ))}
      </Grid>
      {showLoginPrompt && (
        <LoginPromptModal
          onCancel={() => setShowLoginPrompt(false)}
          onConfirm={() => (window.location.href = '/login')}
        />
      )}
    </GalleryContainer>
  );
};

export default GlassesGallery;
