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

  // Reférences poure les images ( Ref for glasses overlay image)
  const overlayImg = useRef(new Image());

  const loggedOnce = useRef(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedGlasses, setSelectedGlasses] = useState(null); // remlacement par une image dynamique
  const [error, setError] = useState(null);
  
  

// effet pour gérer la sélection des lunettes
useEffect(() => {  
    if (selectedGlasses) {
      console.log("Selected glasses URL:", selectedGlasses.imageUrl); // Temp
      overlayImg.current.src = selectedGlasses.imageUrl;
      overlayImg.current.onload = () => {
        console.log("Image loaded and ready to draw");
      };
    }
}, [selectedGlasses]);

// Effet pour la gestion de la camera et face mesh
useEffect(() => {
  if (!isCameraActive) return;
  console.log("Camera activated");
  
  let camera;
  const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  // configuration des options FaceMesh
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  // Gestion de l'accèes à la caméra
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(() => {
    console.log("FaceMesh is ready");
    faceMesh.onResults(onResults);

    // test de report de la creation de camera
    //setTimeout(() => {
    //  if (!videoRef.current)

    //})

    //if (!videoRef.current) { // temp
    //  console.error("videoRef is not ready _ DOM not mounted yet");
    //  return;
    //}

    setTimeout(() => { // ajout d'un timeout histoire de laiser le temps au DOM
      if (!videoRef.current) {
      console.error("videoRef is null - DOM not ready");
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
  }, 200)
})
  .catch((error) => {
    console.error("Erreur d'accès à la webcam:", error);
    setError("Impossible d'accéder à la webcam, veuillez vérifier vos permissions.");
    setIsCameraActive(false);
  });


  function onResults(results) {
    console.log("FaceMesh results received", results); // temporary as well

  if (!canvasRef.current || !results.multiFaceLandmarks) return;

  if (!loggedOnce.current) {
    console.log("FaceMesh received first valid result:", results);
    console.log("First landmarks sample:", results.multiFaceLandmarks[0]);
    loggedOnce.current = true;
  }  

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Dimensionnement du canvas
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;

    // clear and draw video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    
    // Dessin des lunettes si le visage est détecté et les lunettes sélectionnées
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0){
      console.log("Landmarks detected:", results.multiFaceLandmarks[0]); // temporaire aussi
      const landmarks = results.multiFaceLandmarks[0];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];

      // Calcul de la position et la taille des lunettes
      /*const dx = rightEye.x - leftEye.x;
      const dy = rightEye.y - leftEye.y;
      const distance = Math.sqrt(dx * dx + dy * dy) * canvas.width;
      */

    const leftTemple = landmarks[234];
    const rightTemple = landmarks[454];
      
    // Distance between temples
    const dx = rightTemple.x - leftTemple.x;
    const dy = rightTemple.y - leftTemple.y;
    const distance = Math.sqrt(dx * dx + dy * dy) * canvas.width;

    // rotation angle of the head

    const angle = Math.atan2(dy, dx);
    const nose = landmarks[168];

    // center point between temples
    const centerX = (leftTemple.x + rightTemple.x) / 2 * canvas.width;
    const centerY = (leftEye.y + rightEye.y + nose.y) / 3 * canvas.height;

       // ajout d'un point de repère pour le nez
      /*const centerX = (leftEye.x + rightEye.x) / 2 * canvas.width;
      const centerY = landmarks[6].y * canvas.height;

      const glassesWidth = distance * 2.1; // increase for wider glasses
      const aspectRatio = overlayImg.current.height / overlayImg.current.width; // ratio de l'image
      const glassesHeight = glassesWidth * aspectRatio;
      */

     // Adjust size based on PNG aspect ration
     const glassesWidth = distance * 1.3;
     const aspectRatio = overlayImg.current.height / overlayImg.current.width;
     const glassesHeight = glassesWidth * aspectRatio;
     

     ctx.save(); // save current canvas transform
     ctx.translate(centerX, centerY);
     ctx.rotate(angle);
     ctx.globalAlpha = 0.65// transparence des lunettes

      // Draw glasses overlay
    ctx.drawImage(
      overlayImg.current,
      - glassesWidth / 2,
      - glassesHeight / 2,
      glassesWidth,
      glassesHeight
    );
    ctx.restore(); // Reset canvas transform
    }
  }

  // Fonction de suppression
return () =>{
  if (camera) camera.stop();
  faceMesh.close();
};
}, [isCameraActive]);

  return (
    <PageContainer>
      <Title>Étape 1: Essayage en Direct</Title>

      {error && (
        <PlaceholderText style={{ color: 'red'}}>
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
        style={{ display: 'none'}} 
        playsInline
        >
          Votre navigateur ne supporrte pas l'élément vidéo.
        </video>
        <Canvas ref={canvasRef}/>

        {/* Ajout du composant GlassesGallery */}
        <GlassesGallery onSelect={setSelectedGlasses}/>

        <PageNavigation previous="/" next="/preferences-quiz"/>

    </PageContainer>
  );
};

export default CapturePage;  