// src/components/GlassesGallery.jsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const GalleryContainer = styled.div`
margin-top: 2rem;
`;

const Title = styled.h3`
text-align: left;
margin-bottom: 1rem;
`;

const Grid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
gap: 1.5rem;
`;

const GlassItem = styled.div`
text-align: center;
cursor: pointer;
`;

const GlassImage = styled.img`
height: 80px;
transition: transform 0.2s ease-in-out;
&:hover {
    transform: scale(1.1);
}
`;

const GlassText = styled.p`
margin: 0.2rem 0;
font-size: 0.9rem;
`;

const GlassesGallery = ({ onSelect}) => {
    const [glasses, setGlasses] = useState([]);

    // import dynamique des lunettes via le backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/glasses')
        .then(res => setGlasses(res.data))
        .catch((err) => console.error('Failed to load glasses:', err));
    }, []);
    
    return (
        <GalleryContainer>
            <Title>Galerie de lunettes</Title>
            <Grid>
               {glasses.map(glass => (
                <GlassItem key={glass._id} onClick={() => onSelect(glass)}>
                    <GlassImage src={glass.imageUrl} alt={glass.code}/>
                    <GlassText><strong>{glass.code}</strong></GlassText>
                    <GlassText>{glass.brand}</GlassText>
                </GlassItem>
            ))} 
            </Grid>
      </GalleryContainer>
    );
};

export default GlassesGallery;