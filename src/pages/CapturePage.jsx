// src/pages/CapturePage.jsx
import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; 
import { FaceMesh} from '@mediapipe/face_mesh'; // à définir parce que je ne sais pas ce facemesh fait
import { Camera } from '@mediapipe/camera_utils'; // importation de la bibliothèque qui permet d'utiliser la cam
import Lun7 from '../assets/lunettes/Lun7.png'; // importation de la lunette test

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlaceholderText = styled.p`
color: ${({ theme })=> theme.colors.textSecondary};
margin-bottom: ${({ theme }) => theme.spacing.xl};
font-size: 1.1rem;
`;

const Canvas = styled.canvas`
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.md };
`;

// Définition du composant
const CapturePage = () => { 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const overlayImg = new Image();
  overlayImg.src = Lun7;

useEffect(() => {
  if (!isCameraActive) return;

  const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(onResults);

  const camera = new Camera(videoRef.current, {
    onFrame: async () => {
      await faceMesh.send({image: videoRef.current});
    },
    width: 640,
    height: 480,
  });
  camera.start();

  function onResults(results) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0){
      const landmarks = results.multiFaceLandmarks[0];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];

      const dx = rightEye.x - leftEye.x;
      const dy = rightEye.y - leftEye.y;
      const distance = Math.sqrt(dx * dx + dy * dy) * canvas.width;

      const centerX = (leftEye.x + rightEye.x) / 2 * canvas.width;
      const centerY = (leftEye.y + rightEye.y) / 2 * canvas.height;

      const glassesWidth = distance * 2.2;
      const glassesHeight = (overlayImg.height / overlayImg.width) * glassesWidth;

      ctx.drawImage(overlayImg,
        centerX - glassesWidth / 2,
        centerY - glassesHeight / 2,
        glassesWidth,
        glassesHeight);
    }
  }
}, [isCameraActive]);

  return (
    <PageContainer>
      <Title>Étape 1: Essayage en Direct</Title>

      {!isCameraActive && (
        <>
          <PlaceholderText>
            Active ta webcam pour commencer l'analyse du visage
          </PlaceholderText>
            <Button variant="primary" onClick={() => setIsCameraActive(true)}>
              Activer la webcam
            </Button>
          </>
        )}
        <video ref={videoRef} style={{ display: 'none'}} ></video>
        <Canvas ref={canvasRef}/>

      <Link to="/preferences-quiz" style= {{ marginTop: '2rem'}}>
        <Button variant="outline">Passer au Questionnaire</Button>
      </Link>
    </PageContainer>
  );
};

export default CapturePage; 