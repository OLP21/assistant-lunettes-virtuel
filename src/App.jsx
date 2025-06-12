//src/App.jsx
import Header from './components/Layout/Header'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle'; 
import { theme } from './styles/theme';           

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MainLayout from './components/Layout/MainLayout'; 
import HomePage from './pages/HomePage';                 
import CapturePage from './pages/CapturePage';           
import QuizPage from './pages/QuizPage';               
import ResultsPage from './pages/ResultsPage';           


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <MainLayout> {/* Header et Footer potentiels ici */}
          <Routes>
            <Route path="/header-preview" element={<><Header /><div style={{height: '200px'}}/></>} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/" element={<HomePage />} />
            <Route path="/start-analysis" element={<CapturePage />} />
            <Route path="/preferences-quiz" element={<QuizPage />} />
            <Route path="/recommendations" element={<ResultsPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </MainLayout>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar
          closeOnClick
          pauseOnHover={false}
          theme="light"
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;