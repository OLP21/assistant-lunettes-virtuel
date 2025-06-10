// src/pages/CapturePage.jsx
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
  const loggedOnce = useRef(false);
  const lastFaceLandmarksRef = useRef(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedGlasses, setSelectedGlasses] = useState(null);
  const [error, setError] = useState(null);
  const [faceShape, setFaceShape] = useState(null);

  useEffect(() => {
    if (selectedGlasses) {
      overlayImg.current.src = selectedGlasses.imageUrl;
      overlayImg.current.onload = () => {
        console.log("Glasses image loaded");
      };
    }
  }, [selectedGlasses]);

  useEffect(() => {
    if (!isCameraActive) return;

    let camera;
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        faceMesh.onResults(onResults);
        setTimeout(() => {
          if (!videoRef.current) {
            setError("Impossible de démarrer la webcam. Essayez de recharger la page.");
            return;
          }
          camera = new Camera(videoRef.current, {
            onFrame: async () => {
              await faceMesh.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
          });
          camera.start();
        }, 200);
      })
      .catch((error) => {
        setError("Impossible d'accéder à la webcam, veuillez vérifier vos permissions.");
        setIsCameraActive(false);
      });

    function onResults(results) {
      if (!canvasRef.current || !results.multiFaceLandmarks) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        lastFaceLandmarksRef.current = landmarks;

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const leftTemple = landmarks[234];
        const rightTemple = landmarks[454];

        const dx = rightTemple.x - leftTemple.x;
        const dy = rightTemple.y - leftTemple.y;
        const distance = Math.sqrt(dx * dx + dy * dy) * canvas.width;
        const angle = Math.atan2(dy, dx);

        const nose = landmarks[168];
        const centerX = (leftTemple.x + rightTemple.x) / 2 * canvas.width;
        const centerY = (leftEye.y + rightEye.y + nose.y) / 3 * canvas.height;

        if (selectedGlasses) {
          const glassesWidth = distance * 1.3;
          const aspectRatio = overlayImg.current.height / overlayImg.current.width;
          const glassesHeight = glassesWidth * aspectRatio;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          ctx.globalAlpha = 0.65;
          ctx.drawImage(
            overlayImg.current,
            -glassesWidth / 2,
            -glassesHeight / 2,
            glassesWidth,
            glassesHeight
          );
          ctx.restore();
        }
      }
    }

    return () => {
      if (camera) camera.stop();
      faceMesh.close();
    };
  }, [isCameraActive, selectedGlasses]);

  const detectFaceShape = () => {
    if (!lastFaceLandmarksRef.current) {
      setError("Aucun visage détecté pour le moment.");
      return;
    }

    const landmarks = lastFaceLandmarksRef.current;
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    const leftForehead = landmarks[70];
    const rightForehead = landmarks[300];
    const leftCheekbone = landmarks[234];
    const rightCheekbone = landmarks[454];
    const leftJaw = landmarks[127];
    const rightJaw = landmarks[356];
    const chin = landmarks[152];
    const topForehead = landmarks[10];

    const foreheadWidth = Math.abs((rightForehead.x - leftForehead.x) * canvasWidth);
    const cheekboneWidth = Math.abs((rightCheekbone.x - leftCheekbone.x) * canvasWidth);
    const jawWidth = Math.abs((rightJaw.x - leftJaw.x) * canvasWidth);
    const faceHeight = Math.abs((topForehead.y - chin.y) * canvasHeight);

    let shape = 'Indéterminé';

    if (
      Math.abs(foreheadWidth - cheekboneWidth) < 15 &&
      Math.abs(cheekboneWidth - jawWidth) < 15
    ) {
      if (faceHeight / cheekboneWidth > 1.5) {
        shape = "Oblong";
      } else {
        shape = "Rond";
      }
    } else if (
      cheekboneWidth > foreheadWidth &&
      cheekboneWidth > jawWidth
    ) {
      shape = "Ovale";
    } else if (
      jawWidth >= cheekboneWidth &&
      jawWidth > foreheadWidth
    ) {
      shape = "Carré";
    } else if (
      foreheadWidth > cheekboneWidth &&
      foreheadWidth > jawWidth
    ) {
      shape = "Triangle inversé";
    }

    setFaceShape(shape);
  };

  return (
    <PageContainer>
      <Title>Étape 1: Essayage en Direct</Title>

      {error && (
        <PlaceholderText style={{ color: 'red' }}>
          {error}
        </PlaceholderText>
      )}

      {!isCameraActive && !error && (
        <>
          <PlaceholderText>
            Active ta webcam pour commencer l'analyse du visage
          </PlaceholderText>
          <Button variant="primary" onClick={() => setIsCameraActive(true)}>
            Activer la webcam
          </Button>
        </>
      )}

      <video
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
      >
        Votre navigateur ne supporte pas l'élément vidéo.
      </video>

      <Canvas ref={canvasRef} />

      <Button variant="secondary" onClick={detectFaceShape}>
        Détecter la forme du visage
      </Button>

      {faceShape && (
        <PlaceholderText>
          Forme du visage détectée : <strong>{faceShape}</strong>
        </PlaceholderText>
      )}

      <GlassesGallery onSelect={setSelectedGlasses} />
      <PageNavigation previous="/" next="/preferences-quiz" />
    </PageContainer>
  );
};

export default CapturePage;
