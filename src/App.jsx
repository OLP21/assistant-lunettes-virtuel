
 //src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle'; // Assure-toi que ce fichier existera
import { theme } from './styles/theme';           // Assure-toi que ce fichier existera

import MainLayout from './components/Layout/MainLayout'; // Assure-toi que ce fichier existera
import HomePage from './pages/HomePage';                 // Assure-toi que ce fichier existera
import CapturePage from './pages/CapturePage';           // Assure-toi que ce fichier existera
import QuizPage from './pages/QuizPage';               // Assure-toi que ce fichier existera
import ResultsPage from './pages/ResultsPage';           // Assure-toi que ce fichier existera
// import NotFoundPage from './pages/NotFoundPage'; // Tu pourras créer ça plus tard

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <MainLayout> {/* Header et Footer potentiels ici */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/start-analysis" element={<CapturePage />} />
            <Route path="/preferences-quiz" element={<QuizPage />} />
            <Route path="/recommendations" element={<ResultsPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;