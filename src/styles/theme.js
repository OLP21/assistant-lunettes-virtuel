// src/styles/theme.js
export const theme = {
  colors: {
    background: '#FFFFFF',    // White background (no change)
    surface: '#F5F5F5',        // Light grey for cards (no change)
    
    primary: '#000000',         // CHANGED: Blue is now Black for main buttons, links, and titles.
    secondary: '#555555',       // CHANGED: Purple is now a dark grey for hover effects.
    
    text: '#121212',           // Dark text for contrast (no change)
    textSecondary: '#4A4A4A',  // Lighter grey for secondary text (no change)

    success: '#00FFA3',         // You can keep these or make them greyscale if you prefer
    error: '#FF4D4D',

    // Adding a new color for button borders and neutral backgrounds
    border: '#DDDDDD'
  },
  fonts: {
    primary: "'Orbitron', sans-serif", 
    secondary: "'Roboto', sans-serif", 
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
    subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',
    strong: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
};