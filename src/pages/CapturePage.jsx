// src/pages/CapturePage.jsx

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';

import LiveView from '../components/LiveView';
import FrameSelector from '../components/FrameSelector';
import InfoPanel from '../components/InfoPanel';
import PageNavigation from '../components/common/PageNavigation';
import LoginPromptModal from '../components/common/LoginPromptModal';

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
      .catch(err => console.error('Failed to load glasses:', err));
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
      await axios.post(
        'http://localhost:5000/api/user/favorites',
        { glassesId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    const getDistance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    const faceLength = getDistance(landmarks[10], landmarks[152]);
    const foreheadWidth = getDistance(landmarks[54], landmarks[284]);
    const cheekWidth = getDistance(landmarks[234], landmarks[454]);
    const jawlineWidth = getDistance(landmarks[172], landmarks[397]);

    let shape = 'Indéterminé';

    const cheek_jaw_ratio = jawlineWidth / cheekWidth;
    const cheek_forehead_ratio = foreheadWidth / cheekWidth;
    const length_cheek_ratio = faceLength / cheekWidth;

    // Log distances for debugging
    console.log({
      faceLength,
      foreheadWidth,
      cheekWidth,
      jawlineWidth,
      ratios: {
        cheek_jaw_ratio,
        cheek_forehead_ratio,
        length_cheek_ratio,
      }
    });

    // Heart shape: forehead significantly wider than jaw
    if (cheek_forehead_ratio > 1.05 && cheek_jaw_ratio < 0.95) {
      shape = 'En cœur';
    }
    // Round: short + narrow jaw
    else if (length_cheek_ratio < 1.15 && cheek_jaw_ratio < 0.95) {
      shape = 'Rond';
    }
    // Square: short + strong jaw
    else if (length_cheek_ratio < 1.15 && cheek_jaw_ratio >= 0.95) {
      shape = 'Carré';
    }
    // Triangle: jaw wider than forehead
    else if (jawlineWidth > foreheadWidth && cheek_jaw_ratio > 1.05) {
      shape = 'Triangle';
    }
    // Oblong: long face, not round or square
    else if (length_cheek_ratio >= 1.4 && cheek_jaw_ratio >= 0.9 && cheek_jaw_ratio <= 1.1) {
      shape = 'Oblong';
    }
    // Default: Oval
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
