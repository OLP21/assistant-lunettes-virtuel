// src/components/common/LoginPromptModal.jsx

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const Title = styled.h4`
  margin-bottom: 0.5rem;
`;

const Text = styled.p`
  margin-bottom: 1rem;
  color: #444;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: ${({ primary }) => (primary ? '#007bff' : '#ddd')};
  color: ${({ primary }) => (primary ? 'white' : 'black')};
  &:hover {
    background: ${({ primary }) => (primary ? '#0056b3' : '#ccc')};
  }
`;

export default function LoginPromptModal({ onCancel }) {
  const navigate = useNavigate();

  return (
    <Overlay>
      <Modal>
        <Title>🔒 Connexion requise</Title>
        <Text>Vous devez être connecté pour ajouter aux favoris.</Text>
        <ButtonRow>
          <Button onClick={onCancel}>Annuler</Button>
          <Button primary onClick={() => navigate("/login")}>Se connecter</Button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}
