import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth }    from '../../context/AuthContext';
import { Link }       from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const HeaderBar = styled.header`
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: fixed; top:0; left:0; right:0; z-index:20;
`;
const Nav = styled.nav`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex; align-items: center; justify-content: space-between;
`;
const Logo = styled(Link)` height: 3rem; img { height:100%; } `;
const DesktopLinks = styled.div`
  display: none;
  @media(min-width: 1024px) {
    display: flex; align-items: center; gap: 1.5rem;
  }
`;
const StyledLink = styled(Link)`
  color: #333; font-weight: 500;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;
const AuthButton = styled.button`
  /* same as before */
`;
const MobileToggle = styled.button`
  @media(min-width: 1024px){ display: none; }
`;
const MobileMenu = styled.div`
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 240px;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
  transform: translateX(${props => (props.open ? '0' : '100%')});
  transition: transform 0.3s ease;
  padding: 1rem;
  z-index: 25;
`;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navLinks = [
    ['Accueil','/'], ['Try-On','/start-analysis'], ['Quiz','/preferences-quiz']
  ];

  return (
    <HeaderBar>
      <Nav>
        <Logo to="/"><img src="/logo.png" alt="Logo Vision AI"/></Logo>

        <DesktopLinks>
          {navLinks.map(([label,to]) =>
            <StyledLink key={to} to={to}>{label}</StyledLink>
          )}
          {user
            ? <>
                <StyledLink to="/Profile">Mon Profil</StyledLink>
                <Button onClick={logout}>Déconnexion</Button>
              </>
            : <>
                <AuthButton variant="primary" as={Link} to="/Register">Inscription</AuthButton>
                <Button as={Link} to="/Login">Connexion</Button>
              </>
          }
        </DesktopLinks>

        <MobileToggle onClick={() => setMobileOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </MobileToggle>
      </Nav>

      <MobileMenu open={mobileOpen}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
          <Logo to="/" onClick={() => setMobileOpen(false)}>
            <img src="/logo.png" alt="Logo" />
          </Logo>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
        </div>
        {navLinks.map(([label,to]) => (
          <StyledLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            style={{ display:'block', margin:'0.75rem 0' }}
          >
            {label}
          </StyledLink>
        ))}
        {user
          ? <AuthButton onClick={() => { logout(); setMobileOpen(false); }}>
              Déconnexion
            </AuthButton>
          : <>
              <AuthButton
                variant="primary"
                as={Link}
                to="/Register"
                onClick={() => setMobileOpen(false)}
              >
                Inscription
              </AuthButton>

              <StyledLink
                to="/Login"
                onClick={() => setMobileOpen(false)}
                style={{ display:'block', margin:'0.75rem 0' }}
              >
                Connexion
              </StyledLink>
            </>
        }
      </MobileMenu>
    </HeaderBar>
  );
}
