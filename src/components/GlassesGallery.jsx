// src/components/GlassesGallery.jsx

import react from 'react'; 
import glassesData from '../data/glasses';

const GlassesGallery = ({ onSelect}) => {
    return (
        <div>
            <h3>Galerie de lunettes</h3>
            <div style={{ display: 'flex', lexWrap: 'wrap', gap: '1rem', justifyContent: 'center'}}>
               {glassesData.map((glass) => (
                <img
                key={glass.code}
                src={glass.imageUrl}
                alt={glass.code}
                onClick={() => onSelect(glass)} // selection des lunettes
                style={{
                    height: '80px',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'transform 0.2s ease-in-out',
                }}
                />
            ))} 
            </div>
        </div>
    );
};

export default GlassesGallery;