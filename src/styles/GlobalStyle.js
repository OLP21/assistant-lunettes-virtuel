// src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components'; // Import nécessaire

// ... (la définition de tes styles globaux avec @import et body, h1, etc.)

// ICI EST L'EXPORTATION IMPORTANTE
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@400;500;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.secondary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.primary}; /* Couleur par défaut pour les titres */
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.2;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button {
    font-family: ${({ theme }) => theme.fonts.primary}; /* Appliquer la police primaire aux boutons */
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`; // La backtick fermante doit être ici

// Il NE DOIT PAS y avoir un "export default GlobalStyle;" si tu importes avec des accolades.