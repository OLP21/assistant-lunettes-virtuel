// src/components/FrameSelector.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  justify-content: flex-start;
  height: 100%;
  padding-top: 2rem; 
`;

const Title = styled.h3`
  margin-bottom: 6.5rem; 
  font-size: 1.5rem;
  letter-spacing: 1px;
  font-weight: normal; 
`;

const FrameDisplay = styled.div`
  position: relative;
  height: 100px;
  width: 100%;
  max-width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FrameImage = styled.img`
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
`;

const NavOverlay = styled.div`
  position: absolute;
  top: 0;
  left: -45px;
  right: -45px;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
`;

const ArrowButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #000;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Separator = styled.hr`
  width: 80%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  border: none;
  margin: 2rem 0;
`;


const FrameSelector = ({ frames, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // This effect selects the first frame when the component loads
  useEffect(() => {
    if (frames.length > 0) {
      onSelect(frames[0]);
    }
  }, [frames, onSelect]);

  // --- NEW: This effect pre-loads the next and previous images ---
  useEffect(() => {
    if (frames.length <= 1) return; // Don't preload if there's only one or zero images

    // Pre-load the next image
    const nextIndex = (currentIndex + 1) % frames.length;
    const nextImg = new Image();
    nextImg.src = frames[nextIndex].imageUrl;

    // Pre-load the previous image
    const prevIndex = (currentIndex - 1 + frames.length) % frames.length;
    const prevImg = new Image();
    prevImg.src = frames[prevIndex].imageUrl;

  }, [currentIndex, frames]); // Rerun this whenever the index or frame list changes


  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % frames.length;
    setCurrentIndex(nextIndex);
    onSelect(frames[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + frames.length) % frames.length;
    setCurrentIndex(prevIndex);
    onSelect(frames[prevIndex]);
  };

  if (!frames || frames.length === 0) {
    return <SelectorContainer>Loading frames...</SelectorContainer>;
  }

  const currentFrame = frames[currentIndex];

  return (
    <SelectorContainer>
      <Title>MONTURES</Title>
      <FrameDisplay>
        <FrameImage src={currentFrame.imageUrl} alt={currentFrame.code} />
        
        <NavOverlay>
          <ArrowButton onClick={handlePrev} aria-label="Previous Frame">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </ArrowButton>
          <ArrowButton onClick={handleNext} aria-label="Next Frame">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </ArrowButton>
        </NavOverlay>
      </FrameDisplay>
      
      <Separator />

    </SelectorContainer>
  );
};

export default FrameSelector;