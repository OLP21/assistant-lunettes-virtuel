// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding-top: 4rem;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Row = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  & span { font-weight: 600; }
`;

const FavoritesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const FavoriteItem = styled.div`
  width: 100px;
  text-align: center;
`;

const FavoriteImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/user/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setFavorites(res.data))
    .catch(err => console.error("Erreur lors du chargement des favoris:", err));
  }, [user]);

  if (!user) return null; // or a spinner

  return (
    <Container>
      <Card>
        <h2>Mon Profil</h2>
        <Row>
          <span>Nom d’utilisateur:</span> {user.username}
        </Row>
        <Row>
          <span>Email:</span> {user.email}
        </Row>

        <hr style={{ margin: '1.5rem 0' }} />

        {favorites.length > 0 && (
          <>
            <h3>Mes favoris</h3>
            <FavoritesGrid>
              {favorites.map(glass => (
                <FavoriteItem key={glass._id}>
                  <FavoriteImage src={glass.imageUrl} alt={glass.code} />
                  <div>{glass.brand}</div>
                  <div style={{ fontSize: '0.8rem' }}>{glass.code}</div>
                </FavoriteItem>
              ))}
            </FavoritesGrid>
          </>
        )}

        <button onClick={() => { logout(); navigate('/'); }}>
          Déconnexion
        </button>
      </Card>
    </Container>
  );
}
