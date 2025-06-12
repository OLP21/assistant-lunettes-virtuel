// src/pages/CapturePage.jsx
import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button'; 
import { FaceMesh} from '@mediapipe/face_mesh'; // à définir parce que je ne sais pas ce facemesh fait
import { Camera } from '@mediapipe/camera_utils'; // importation de la bibliothèque qui permet d'utiliser la cam
import GlassesGallery from '../components/GlassesGallery'; // utilisation du composant GlassesGallery pour vérifier si la nouvelle galerie de lunettes fonctionne
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
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Image + loaded flag
  const overlayImg = useRef(new Image());
  const [glassesReady, setGlassesReady] = useState(false);

  // Refs to hold the latest state for callbacks
  const selectedGlassesRef = useRef(null);
  const glassesReadyRef = useRef(false);
  const lastFaceLandmarksRef = useRef(null);

  // Local state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedGlasses, setSelectedGlasses] = useState(null); // remlacement par une image dynamique
  const [error, setError] = useState(null);
  const [faceShape, setFaceShape] = useState(null);

  // Sync refs with state
  useEffect(() => {
    selectedGlassesRef.current = selectedGlasses;
  }, [selectedGlasses]);
  useEffect(() => {
    glassesReadyRef.current = glassesReady;
  }, [glassesReady]);

  // Preload selected glasses image
  useEffect(() => {
    if (!selectedGlasses) {
      setGlassesReady(false);
      return;
    }
    setGlassesReady(false);
    overlayImg.current.onload = () => setGlassesReady(true);
    overlayImg.current.src = selectedGlasses.imageUrl;
  }, [selectedGlasses]);

  // Camera + FaceMesh setup
  useEffect(() => {
    if (!isCameraActive) return;

    let camera;
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

  // configuration des options FaceMesh
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

    faceMesh.onResults((results) => {
      if (!canvasRef.current || !results.multiFaceLandmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Dimensionnement du canvas
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;

      // Draw camera frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      // Save landmarks for shape detection
      const landmarks = results.multiFaceLandmarks[0];
      lastFaceLandmarksRef.current = landmarks;

      // Draw glasses if selected and loaded
      if (selectedGlassesRef.current && glassesReadyRef.current) {
        const leftTemple = landmarks[234];
        const rightTemple = landmarks[454];
        const dx = rightTemple.x - leftTemple.x;
        const dy = rightTemple.y - leftTemple.y;
        const distance = Math.hypot(
          dx * canvas.width,
          dy * canvas.height
        );
        const angle = Math.atan2(dy, dx);

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const nose = landmarks[168];
        const centerX =
          ((leftTemple.x + rightTemple.x) / 2) * canvas.width;
        const centerY =
          ((leftEye.y + rightEye.y + nose.y) / 3) * canvas.height;

        const glassesWidth = distance * 1.3;
        const img = overlayImg.current;
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const glassesHeight = glassesWidth * aspectRatio;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.globalAlpha = 0.65;
        ctx.drawImage(
          img,
          -glassesWidth / 2,
          -glassesHeight / 2,
          glassesWidth,
          glassesHeight
        );
        ctx.restore();
      }
    });

    // Start the MediaPipe camera
    const videoEl = videoRef.current;
    if (!videoEl) {
      setError("Le composant vidéo n'est pas prêt.");
      return;
    }
    camera = new Camera(videoEl, {
      onFrame: async () => {
        await faceMesh.send({ image: videoEl });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      if (camera) camera.stop();
      faceMesh.close();
    };
  }, [isCameraActive]);

  // Face-shape detection
  const detectFaceShape = () => {
    if (!isCameraActive) {
      setError("Veuillez activer la webcam avant de détecter la forme du visage.");
      return;
    }

    const landmarks = lastFaceLandmarksRef.current;
    if (!landmarks) {
      setError("Aucun visage détecté pour le moment. Essayez de rester face à la webcam.");
      return;
    }

    // Clear previous errors
    setError(null);

    const cw = canvasRef.current.width;
    const ch = canvasRef.current.height;
    const lf = landmarks[70],
      rf = landmarks[300],
      lc = landmarks[234],
      rc = landmarks[454],
      lj = landmarks[127],
      rj = landmarks[356],
      chin = landmarks[152],
      top = landmarks[10];

    const fw = Math.abs((rf.x - lf.x) * cw);
    const cb = Math.abs((rc.x - lc.x) * cw);
    const jw = Math.abs((rj.x - lj.x) * cw);
    const fh = Math.abs((top.y - chin.y) * ch);

    let shape = 'Indéterminé';
    if (Math.abs(fw - cb) < 0.1 * cb && Math.abs(cb - jw) < 0.1 * cb) {
      shape = fh / cb > 1.5 ? 'Oblong' : 'Rond';
    } else if (cb > fw && cb > jw) {
      shape = 'Ovale';
    } else if (jw >= cb && jw > fw) {
      shape = 'Carré';
    } else if (fw > cb && fw > jw) {
      shape = 'Triangle inversé';
    }

    setFaceShape(shape);
  };

  return (
    <PageContainer>
      <Title>Étape 1: Essayage en Direct</Title>

      {error && (
        <PlaceholderText style={{ color: 'red'}}>
          {error}
        </PlaceholderText>
      )}

      {!isCameraActive && (
        <>
          <PlaceholderText>
            Active ta webcam pour commencer l'analyse du visage
          </PlaceholderText>
          <Button
            variant="primary"
            onClick={() => {
              setError(null);
              setIsCameraActive(true);
            }}
          >
            Activer la webcam
          </Button>
        </>
      )}

      <video ref={videoRef} style={{ display: 'none' }} playsInline />

      <Canvas ref={canvasRef} />

      <Button
        variant="secondary"
        onClick={detectFaceShape}
        disabled={!isCameraActive}
      >
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