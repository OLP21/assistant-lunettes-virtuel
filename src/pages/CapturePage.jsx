// Enhanced version of CapturePage.jsx with improved face shape detection logic

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import GlassesGallery from '../components/GlassesGallery';
import { useNavigate } from 'react-router-dom';
import PageNavigation from '../components/common/PageNavigation';

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
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 1.1rem;
`;

const Canvas = styled.canvas`
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CapturePage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayImg = useRef(new Image());
  const [glassesReady, setGlassesReady] = useState(false);
  const selectedGlassesRef = useRef(null);
  const glassesReadyRef = useRef(false);
  const lastFaceLandmarksRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedGlasses, setSelectedGlasses] = useState(null);
  const [error, setError] = useState(null);
  const [faceShape, setFaceShape] = useState(null);

  useEffect(() => { selectedGlassesRef.current = selectedGlasses; }, [selectedGlasses]);
  useEffect(() => { glassesReadyRef.current = glassesReady; }, [glassesReady]);

  useEffect(() => {
    if (!selectedGlasses) return setGlassesReady(false);
    setGlassesReady(false);
    overlayImg.current.onload = () => setGlassesReady(true);
    overlayImg.current.src = selectedGlasses.imageUrl;
  }, [selectedGlasses]);

  useEffect(() => {
    if (!isCameraActive) return;
    let camera;
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      if (!canvasRef.current || !results.multiFaceLandmarks) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      const landmarks = results.multiFaceLandmarks[0];
      lastFaceLandmarksRef.current = landmarks;

      if (selectedGlassesRef.current && glassesReadyRef.current) {
        const leftTemple = landmarks[234], rightTemple = landmarks[454];
        const dx = rightTemple.x - leftTemple.x;
        const dy = rightTemple.y - leftTemple.y;
        const distance = Math.hypot(dx * canvas.width, dy * canvas.height);
        const angle = Math.atan2(dy, dx);
        const leftEye = landmarks[33], rightEye = landmarks[263], nose = landmarks[168];
        const centerX = ((leftTemple.x + rightTemple.x) / 2) * canvas.width;
        const centerY = ((leftEye.y + rightEye.y + nose.y) / 3) * canvas.height;
        const glassesWidth = distance * 1.3;
        const img = overlayImg.current;
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const glassesHeight = glassesWidth * aspectRatio;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.globalAlpha = 0.65;
        ctx.drawImage(img, -glassesWidth / 2, -glassesHeight / 2, glassesWidth, glassesHeight);
        ctx.restore();
      }
    });

    const videoEl = videoRef.current;
    if (!videoEl) return setError("Le composant vidéo n'est pas prêt.");
    camera = new Camera(videoEl, {
      onFrame: async () => await faceMesh.send({ image: videoEl }),
      width: 640,
      height: 480
    });
    camera.start();
    return () => { if (camera) camera.stop(); faceMesh.close(); };
  }, [isCameraActive]);

  const detectFaceShape = () => {
    if (!isCameraActive) return setError("Veuillez activer la webcam avant de détecter la forme du visage.");
    const landmarks = lastFaceLandmarksRef.current;
    if (!landmarks) return setError("Aucun visage détecté pour le moment. Essayez de rester face à la webcam.");
    setError(null);

    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;

    const top = landmarks[10];
    const chin = landmarks[152];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    const leftJaw = landmarks[127];
    const rightJaw = landmarks[356];
    const leftForehead = landmarks[70];
    const rightForehead = landmarks[300];

    const faceHeight = Math.abs((top.y - chin.y) * ch);
    const cheekWidth = Math.abs((rightCheek.x - leftCheek.x) * cw);
    const jawWidth = Math.abs((rightJaw.x - leftJaw.x) * cw);
    const foreheadWidth = Math.abs((rightForehead.x - leftForehead.x) * cw);

    const verticalRatio = faceHeight / cheekWidth;
    const cheekToJawRatio = cheekWidth / jawWidth;
    const cheekToForeheadRatio = cheekWidth / foreheadWidth;

    let shape = 'Indéterminé';
    if (verticalRatio > 1.5 && cheekToJawRatio > 1.1) shape = 'Oblong';
    else if (Math.abs(cheekToJawRatio - 1) < 0.1 && Math.abs(cheekToForeheadRatio - 1) < 0.1) shape = 'Rond';
    else if (cheekToJawRatio < 0.9 && cheekToForeheadRatio < 0.9) shape = 'Carré';
    else if (cheekToForeheadRatio > 1.2) shape = 'Triangle inversé';
    else if (verticalRatio > 1.2 && cheekToJawRatio < 1) shape = 'Ovale';

    setFaceShape(shape);
  };

  return (
    <PageContainer>
      <Title>Étape 1: Essayage en Direct</Title>
      {error && <PlaceholderText style={{ color: 'red' }}>{error}</PlaceholderText>}
      {!isCameraActive && (
        <>
          <PlaceholderText>Active ta webcam pour commencer l'analyse du visage</PlaceholderText>
          <Button variant="primary" onClick={() => { setError(null); setIsCameraActive(true); }}>Activer la webcam</Button>
        </>
      )}
      <video ref={videoRef} style={{ display: 'none' }} playsInline />
      <Canvas ref={canvasRef} />
      <Button variant="secondary" onClick={detectFaceShape} disabled={!isCameraActive}>Détecter la forme du visage</Button>
      {faceShape && <PlaceholderText>Forme du visage détectée : <strong>{faceShape}</strong></PlaceholderText>}
      <GlassesGallery onSelect={setSelectedGlasses} />
      <PageNavigation previous="/" next="/preferences-quiz" />
    </PageContainer>
  );
};

export default CapturePage;
