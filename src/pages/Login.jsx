// src/pages/Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Container   = styled.div`
  display: flex; justify-content: center; align-items: center;
  min-height: calc(100vh - 4rem); padding-top: 4rem;
`;
const FormWrapper = styled.div`
  width: 100%; max-width: 400px; background: #fff;
  padding: 2rem; border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;
const Title       = styled.h2`margin-bottom: 1rem;`;
const Form        = styled.form`display: flex; flex-direction: column; gap: 1rem;`;
const Input       = styled.input`
  width: 100%; padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;
const Button      = styled.button`
  padding: 0.75rem; background: ${({ theme }) => theme.colors.primary};
  color: #fff; border: none; border-radius: 4px;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`;
const Error       = styled.div`
  color: red; font-size: 0.875rem; margin-bottom: 0.5rem;
`;

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');  // or wherever you want after login
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Connexion</Title>
        {error && <Error>{error}</Error>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Chargement…' : 'Se connecter'}
          </Button>
        </Form>
        <p style={{ marginTop: '1rem' }}>
          Pas de compte ? <Link to="/register">Inscrivez-vous</Link>
        </p>
      </FormWrapper>
    </Container>
  );
}
