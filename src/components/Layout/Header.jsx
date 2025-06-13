// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import styled, { css } from 'styled-components'; // Import the 'css' helper
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import loginIconUrl from '../../assets/icons/login.svg';
import registerIconUrl from '../../assets/icons/register.svg';

// ... (HeaderBar, Nav, Logo, etc. are unchanged)
const HeaderBar = styled.header`
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: fixed; top:0; left:0; right:0; z-index:20;
`;

const Nav = styled.nav`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
`;

const Logo = styled(Link)`
  height: 3rem;
  img { height: 100%; }
`;

const CenterLinks = styled.div`
  display: none;
  @media(min-width: 1024px) {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
`;

const StyledLink = styled(Link)`
  color: #333;
  font-weight: 500;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const MenuToggle = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  svg { width: 24px; height: 24px; }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 1rem;
  width: 200px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 4px;
  display: ${p => (p.open ? 'block' : 'none')};
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
  svg { width: 20px; height: 20px; }
`;

/* --- REFACTORED THIS SECTION --- */

// 1. Create a reusable block of styles
const dropdownItemStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #333;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

// 2. Create an explicit component for LINKS
const DropdownLink = styled(Link)`
  ${dropdownItemStyles}
  text-decoration: none;
`;

// 3. Create an explicit component for BUTTONS
const DropdownButton = styled.button`
  ${dropdownItemStyles}
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
`;

const IconImg = styled.img`
  width: 20px;
  height: 20px;
`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navLinks = [
    ['Accueil', '/'],
    ['Try-On', '/start-analysis'],
    ['Quiz', '/preferences-quiz'],
  ];

  return (
    <HeaderBar>
      <Nav>
        {/* ... (Logo, CenterLinks, MenuToggle are unchanged) ... */}
        <Logo to="/"><img src="/logo.png" alt="Vision AI logo" /></Logo>
        <CenterLinks>
          {navLinks.map(([label,to]) => (
            <StyledLink key={to} to={to}>{label}</StyledLink>
          ))}
        </CenterLinks>
        <MenuToggle
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen(open => !open)}
        >
          <Bars3Icon />
        </MenuToggle>
      </Nav>

      <MenuDropdown open={menuOpen}>
        <DropdownHeader>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <XMarkIcon />
          </button>
        </DropdownHeader>
        
        {/* --- UPDATED TO USE THE NEW COMPONENTS --- */}
        {user ? (
          <>
            <DropdownButton
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              <IconImg src={loginIconUrl} alt="" />
              Se déconnecter
            </DropdownButton>
            
            <DropdownLink to="/Profile" onClick={() => setMenuOpen(false)}>
              <IconImg src={registerIconUrl} alt="" />
              Mon Profil
            </DropdownLink>
          </>
        ) : (
          <>
            <DropdownLink to="/Login" onClick={() => setMenuOpen(false)}>
              <IconImg src={loginIconUrl} alt="" />
              Connexion
            </DropdownLink>
            <DropdownLink to="/Register" onClick={() => setMenuOpen(false)}>
              <IconImg src={registerIconUrl} alt="" />
              Inscription
            </DropdownLink>
          </>
        )}
      </MenuDropdown>
    </HeaderBar>
  );
}