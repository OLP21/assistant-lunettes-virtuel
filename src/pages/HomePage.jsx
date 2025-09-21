// src/pages/HomePage.jsx
import React, { useRef, useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Assuming this is your base button
import bgVideo from '../../public/assets/videos/background.mp4';

const FlushMainContent = createGlobalStyle`
  main {
    padding: 0 !important;
    max-width: none !important;
    margin: 0 !important;
  }
`;

const Hero = styled.section`
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  text-align: center;
`;

const VideoBg = styled.video`
  position: absolute;
  inset: 0;
  object-fit: cover;
  z-index: -1;
`;

const Title = styled.h1`
  color: #fff;
  font-size: clamp(3rem, 8vw, 5rem);
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const HeroButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  /* --- APPLYING NEW STYLES --- */
  background: transparent;
  border: 2px solid #fff;
  color: #fff; /* Ensure text remains white */

  &:hover {
    background: rgba(255, 255, 255, 0.1); /* Subtle background fill on hover */
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #fff;
    transform: translateX(-101%);
    transition: transform 0.4s ease;
  }

  &:hover::after {
    transform: translateX(0);
  }
`;


const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 700px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CTANote = styled.p`
  font-size: 0.9rem;
`;

export default function HomePage() {
  const revealRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (revealRef.current) obs.observe(revealRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <FlushMainContent />
      <Hero>
        <VideoBg autoPlay muted loop src={bgVideo} />
        <Title>Vision AI</Title>
        <StyledLink to="/start-analysis">
          <HeroButton variant="solid" size="large">
            Commencer l’Expérience
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
            </svg>
          </HeroButton>
        </StyledLink>
      </Hero>
      <ContentSection
        ref={revealRef}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        <Subtitle>
          Découvrez la paire parfaite grâce à notre intelligence artificielle.
          Une analyse morphologique et stylistique pour un choix éclairé et personnalisé.
        </Subtitle>
        <CTANote>
          Préparez votre webcam ou une photo de face pour une analyse optimale.
        </CTANote>
      </ContentSection>
    </>
  );
}