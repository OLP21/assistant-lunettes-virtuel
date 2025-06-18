import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';

import LiveView from '../components/LiveView';
import FrameSelector from '../components/FrameSelector';
import InfoPanel from '../components/InfoPanel';
import PageNavigation from '../components/common/PageNavigation';
import LoginPromptModal from '../components/common/LoginPromptModal';
import { Link } from 'react-router-dom'; // Assurez-vous que Link est importé si vous l'utilisez

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem 2rem;
  min-height: 100vh;
`;

const StickyColumn = styled.div`
  position: sticky;
  top: 7rem; 
  align-self: start; 
`;

const CapturePage = () => {
  const [allGlasses, setAllGlasses] = useState([]);
  const [selectedGlasses, setSelectedGlasses] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [faceShape, setFaceShape] = useState(null);

  const landmarksRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/glasses')
      .then(res => setAllGlasses(res.data))
      .catch((err) => console.error('Failed to load glasses:', err));
  }, []);

  const handleLandmarksUpdate = (landmarks) => {
    landmarksRef.current = landmarks;
  };

  const handleFavorite = async (glassesId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/user/favorites', { glassesId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Ajouté aux favoris !");
    } catch (err) {
      toast.error("Erreur lors de l'ajout aux favoris.");
    }
  };

  const handleDetectShape = () => {
    if (!landmarksRef.current) {
      toast.error("Veuillez vous placer devant la webcam.");
      return;
    }

    const landmarks = landmarksRef.current;
    
    const getDistance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y); // On utilise la distance 2D pour plus de stabilité

    // 1. Calculer les 4 dimensions clés
    const faceLength = getDistance(landmarks[10], landmarks[152]);
    const foreheadWidth = getDistance(landmarks[54], landmarks[284]);
    const cheekWidth = getDistance(landmarks[234], landmarks[454]);
    const jawlineWidth = getDistance(landmarks[172], landmarks[397]);

    let shape = 'Indéterminé';

    // 2. Appliquer les règles dans un ordre logique
    const cheek_jaw_ratio = jawlineWidth / cheekWidth;
    const cheek_forehead_ratio = foreheadWidth / cheekWidth;
    const length_cheek_ratio = faceLength / cheekWidth;
    
    // Règle 1 : Le visage est-il en Cœur ? (front large, mâchoire étroite)
    if (cheek_forehead_ratio > 1.05 && cheek_jaw_ratio < 0.95) {
      shape = 'En cœur';
    }
    // Règle 2 : Le visage est-il Rond ou Carré ? (longueur et largeur similaires)
    else if (length_cheek_ratio < 1.15) { 
      if (cheek_jaw_ratio > 0.95) {
        shape = 'Carré'; // Mâchoire presque aussi large que les joues
      } else {
        shape = 'Rond'; // Mâchoire plus étroite
      }
    }
    // Règle 3 : Le visage est-il en Triangle ? (mâchoire plus large que le front)
    else if (jawlineWidth > foreheadWidth) {
      shape = 'Triangle';
    }
    // Règle 4 : Le visage est-il Oblong ? (très long ET pas une autre forme)
    else if (length_cheek_ratio > 1.4) {
      shape = 'Oblong';
    }
    // Règle 5 : Par défaut, c'est un visage Ovale (la forme la plus équilibrée)
    else {
      shape = 'Ovale';
    }
    
    setFaceShape(shape);
    toast.success(`Forme du visage détectée : ${shape}`);
  };

  return (
    <>
      <PageContainer>
        <StickyColumn>
          <FrameSelector frames={allGlasses} onSelect={setSelectedGlasses} />
        </StickyColumn>
        
        <LiveView 
          selectedGlasses={selectedGlasses}
          isCameraActive={isCameraActive}
          onActivateCamera={() => setIsCameraActive(true)}
          onLandmarksUpdate={handleLandmarksUpdate}
        />
        
        <StickyColumn>
          <InfoPanel 
            selectedFrame={selectedGlasses}
            onFavorite={handleFavorite}
            onDetectShape={handleDetectShape}
            faceShape={faceShape}
          />
        </StickyColumn>
      </PageContainer>
      <PageNavigation previous="/" next="/preferences-quiz" />

      {showLoginPrompt && (
        <LoginPromptModal onCancel={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default CapturePage;