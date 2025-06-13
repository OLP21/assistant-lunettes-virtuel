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
    
    // --- NEW, MORE ROBUST FACE SHAPE LOGIC ---

    // 1. Define all necessary landmark points
    const foreheadLeft = landmarks[103];
    const foreheadRight = landmarks[332];
    const cheekLeft = landmarks[234];
    const cheekRight = landmarks[454];
    const jawLeft = landmarks[127];
    const jawRight = landmarks[356];
    const chin = landmarks[152];
    const faceTop = landmarks[10];

    // Helper function to calculate distance between two 3D points
    const getDistance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);

    // 2. Calculate the four key facial dimensions
    const faceLength = getDistance(faceTop, chin);
    const foreheadWidth = getDistance(foreheadLeft, foreheadRight);
    const cheekWidth = getDistance(cheekLeft, cheekRight); // This will be the widest part for most faces
    const jawlineWidth = getDistance(jawLeft, jawRight);

    let shape = 'Indéterminé';

    // 3. Apply a more detailed set of rules based on proportions
    
    // Rule for Oblong: Face is noticeably longer than it is wide.
    if (faceLength > cheekWidth * 1.25) {
      shape = 'Oblong';
    }
    // Rule for Round: Face length and width are very similar, with a soft jawline.
    else if (Math.abs(faceLength - cheekWidth) / cheekWidth < 0.1 && jawlineWidth < foreheadWidth) {
      shape = 'Rond';
    }
    // Rule for Square: Face length and width are similar, but jaw and forehead are wide.
    else if (Math.abs(faceLength - cheekWidth) / cheekWidth < 0.1 && Math.abs(jawlineWidth - cheekWidth) / cheekWidth < 0.1) {
      shape = 'Carré';
    }
    // Rule for Heart: Forehead is wider than the jawline, face tapers to a smaller chin.
    else if (foreheadWidth > jawlineWidth && cheekWidth > jawlineWidth) {
      shape = 'En cœur';
    }
    // Rule for Triangle: Jawline is wider than the forehead.
    else if (jawlineWidth > foreheadWidth) {
        shape = 'Triangle';
    }
    // Default to Oval: If it doesn't fit the other specific rules, it's likely oval.
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