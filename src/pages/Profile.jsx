// src/pages/Profile.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in, bounce to /login
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

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

        {/* Future: favorites & history lists */}
        <hr style={{ margin: '1.5rem 0' }} />

        <button onClick={() => { logout(); navigate('/'); }}>
          Déconnexion
        </button>
      </Card>
    </Container>
  );
}
