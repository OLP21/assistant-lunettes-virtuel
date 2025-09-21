// src/components/Layout/MainLayout.jsx
import React from 'react';
import styled from 'styled-components';
import Header from './Header';
// Tu pourras importer un Header et un Footer ici plus tard
// import Header from './Header';
// import Footer from './Footer';

const SiteContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1; /* Permet au contenu principal de prendre tout l'espace disponible */
  padding: ${({ theme }) => theme.spacing.md}; /* Un peu de padding général */
  width: 100%;
  max-width: 1400px; /* Limite la largeur max du contenu */
  margin: 0 auto; /* Centre le contenu */
`;

const MainLayout = ({ children }) => {
  return (

    <SiteContainer>
    <Header/>
    <MainContent>
      {children}
    </MainContent>
   
      {/* <Footer /> */}
    </SiteContainer>
    
  );
};

export default MainLayout;