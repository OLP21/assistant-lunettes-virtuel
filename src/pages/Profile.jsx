import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 8rem 2rem 2rem 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
`;

const Panel = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  width: 100%;
`;

const UserInfoPanel = styled(Panel)``;

const FavoritesPanel = styled(Panel)``;

const Row = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  & span { 
    font-weight: 600; 
    display: block;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.25rem;
  }
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const FavoriteItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FavoriteImage = styled.img`
  width: 100%;
  border-radius: 8px;
  
  /* CHANGED: The border property has been removed */
`;

const RemoveButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
    border-color: ${({ theme }) => theme.colors.error};
  }
`;

const LogoutButton = styled.button`
    margin-top: 2rem;
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        border-color: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.secondary};
    }
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

  const handleRemoveFavorite = async (glassId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/user/favorites/${glassId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(currentFavorites => currentFavorites.filter(fav => fav._id !== glassId));
      toast.success("Favori supprimé !");
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <PageContainer>
      <UserInfoPanel>
        <h2>Mon Profil</h2>
        <hr style={{ margin: '1.5rem 0' }} />
        <Row>
          <span>Nom d’utilisateur</span> {user.username}
        </Row>
        <Row>
          <span>Email</span> {user.email}
        </Row>
        <LogoutButton onClick={() => { logout(); navigate('/'); }}>
          Déconnexion
        </LogoutButton>
      </UserInfoPanel>

      <FavoritesPanel>
        <h3>Mes favoris</h3>
        <hr style={{ margin: '1.5rem 0' }} />
        {favorites.length > 0 ? (
          <FavoritesGrid>
            {favorites.map(glass => (
              <FavoriteItem key={glass._id}>
                <FavoriteImage src={glass.imageUrl} alt={glass.code} />
                <div style={{ fontWeight: '600' }}>{glass.brand}</div>
                <div style={{ fontSize: '0.8rem' }}>{glass.code}</div>
                <RemoveButton onClick={() => handleRemoveFavorite(glass._id)}>
                  Supprimer
                </RemoveButton>
              </FavoriteItem>
            ))}
          </FavoritesGrid>
        ) : (
          <p>Vous n'avez pas encore de favoris.</p>
        )}
      </FavoritesPanel>
    </PageContainer>
  );
}