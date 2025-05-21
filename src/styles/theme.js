// src/styles/theme.js
export const theme = {
    colors: {
      background: '#12121F', // Un bleu nuit très sombre ou gris anthracite
      surface: '#1E1E2D',   // Pour les cartes, les modales
      primary: '#00FFFF',    // Un cyan ou bleu électrique comme accent principal
      secondary: '#9A40D3',  // Un violet ou magenta comme accent secondaire
      text: '#E0E0E0',       // Texte principal clair
      textSecondary: '#A0A0B0', // Texte secondaire plus discret
      success: '#00FFA3',
      error: '#FF4D4D',
    },
    fonts: {
      primary: "'Orbitron', sans-serif", // Police futuriste pour titres (à importer via Google Fonts ou localement)
      secondary: "'Roboto', sans-serif", // Police propre pour corps de texte
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: '8px',
    shadows: {
      subtle: '0 2px 8px rgba(0, 255, 255, 0.1)',
      strong: '0 4px 16px rgba(0, 255, 255, 0.2)',
    },
    
    // Tu pourras ajouter des breakpoints pour le responsive design ici
    // breakpoints: {
    //   mobile: '576px',
    //   tablet: '768px',
    //   desktop: '992px',
    // },
  }; 
