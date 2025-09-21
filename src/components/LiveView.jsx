import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

const ViewContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 4 / 3;
  background: #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ActivationPlaceholder = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActivationButton = styled.button`
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
`;

const LiveView = ({ selectedGlasses, isCameraActive, onActivateCamera, onLandmarksUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayImg = useRef(new Image());
  const [glassesReady, setGlassesReady] = useState(false);

  useEffect(() => {
    if (!selectedGlasses) return setGlassesReady(false);
    setGlassesReady(false);
    overlayImg.current.onload = () => setGlassesReady(true);
    overlayImg.current.src = selectedGlasses.imageUrl;
  }, [selectedGlasses]);

  useEffect(() => {
    if (!isCameraActive) return;

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
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        
        if (onLandmarksUpdate) {
          onLandmarksUpdate(landmarks);
        }

        if (selectedGlasses && glassesReady) {
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

            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.drawImage(img, -glassesWidth / 2, -glassesHeight / 2, glassesWidth, glassesHeight);
        }
      }
      ctx.restore();
    });

    const videoEl = document.createElement('video');
    videoRef.current = videoEl;

    const camera = new Camera(videoEl, {
      onFrame: async () => {
        if (videoEl.readyState >= 3) {
           await faceMesh.send({ image: videoEl });
        }
      },
      width: 640,
      height: 480
    });
    camera.start();

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, [isCameraActive, selectedGlasses, glassesReady, onLandmarksUpdate]);

  return (
    <ViewContainer>
      {isCameraActive ? (
        <Canvas ref={canvasRef} width="640" height="480" />
      ) : (
        <ActivationPlaceholder>
          <h4>Essayage en Direct</h4>
          <p>Cliquez ici pour activer votre caméra</p>
          <ActivationButton onClick={onActivateCamera}>
            Activer la webcam
          </ActivationButton>
        </ActivationPlaceholder>
      )}
    </ViewContainer>
  );
};

export default LiveView;