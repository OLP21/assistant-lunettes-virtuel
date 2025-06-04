// src/components/common/PageNavigation.jsx

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const NavContainer = styled.div`
position: fixed;
bottom: 0;
left: 0;
width: 100%;
background: ${({ theme }) => theme.colors.surface};
padding: ${({ theme }) => theme.spacing.md};
display: flex;
justify-content: space-between;
border-top: 1px solid ${({ theme }) => theme.colors.border ||'#ccc'};
z-index: 1000;
`;

const PageNavigation = ({previous, next}) => {
    const navigate = useNavigate();
    return(
        <NavContainer>
            {previous && (
                <Button variant="outline" onClick={() => navigate(previous)}>
                    Précédent
                </Button>
            )}
            {next && (
                <Button variant="primary" onClick={() => navigate(next)}>
                Suivant
                </Button>
            )}
        </NavContainer>
    );
};

export default  PageNavigation;