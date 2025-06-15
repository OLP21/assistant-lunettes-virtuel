// src/pages/ResultsPage.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageNavigation from '../components/common/PageNavigation';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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
  const location = useLocation();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const faceShape = localStorage.getItem('faceShape');
    const { likedMap, answers } = location.state || {};
    if (!likedMap || !answers) {
      console.warn('Missing quiz data for recommendations');
      setLoading(false);
      return;
    }

    const liked = Object.keys(likedMap).filter(id => likedMap[id]);

    axios.post('http://localhost:5000/api/recommend', {
      quizAnswers: answers,
      likedGlasses: liked,
      faceShape
    })
    .then(res => setRecommendations(res.data))
    .catch(err => {
      console.error('Recommendation error', err);
      setError('Erreur lors de la récupération des recommandations');
    })
    .finally(() => setLoading(false));
  }, [location.state]);

  return (
    <PageContainer>
      <Title>Votre Sélection Personnalisée</Title>
      {loading ? (
        <PlaceholderText>Chargement des recommandations…</PlaceholderText>
      ) : error ? (
        <PlaceholderText>{error}</PlaceholderText>
      ) : recommendations.length === 0 ? (
        <PlaceholderText>Aucune recommandation disponible.</PlaceholderText>
      ) : (
        recommendations.map(glass => (
          <div key={glass._id} style={{ marginBottom: '1rem' }}>
            <img src={glass.imageUrl} alt={glass.name} style={{ maxWidth: '150px' }} />
            <p>{glass.brand} - {glass.name}</p>
          </div>
        ))
      )}
      <PageNavigation previous='/preferences-quiz'/>
    </PageContainer>
  );
};

export default ResultsPage;
