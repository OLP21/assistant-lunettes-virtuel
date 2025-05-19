// src/components/common/Button.jsx
import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  background: transparent;
  border: 2px solid ${({ theme, variant }) => variant === 'outline' ? theme.colors.primary : 'transparent'};
  background-color: ${({ theme, variant }) => variant === 'solid' ? theme.colors.primary : 'transparent'};
  color: ${({ theme, variant }) => variant === 'solid' ? theme.colors.background : theme.colors.primary};
  padding: ${({ theme, size }) => {
    if (size === 'large') return `${theme.spacing.md} ${theme.spacing.xl}`;
    if (size === 'small') return `${theme.spacing.xs} ${theme.spacing.sm}`;
    return `${theme.spacing.sm} ${theme.spacing.lg}`;
  }};
  font-size: ${({ size }) => (size === 'large' ? '1.2rem' : '1rem')};
  font-weight: bold;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  outline: none;
  text-align: center;

  &:hover {
    background-color: ${({ theme, variant }) => variant === 'solid' ? theme.colors.secondary : theme.colors.primary};
    color: ${({ theme }) => theme.colors.background}; // Texte devient couleur de fond au survol pour contraste
    border-color: ${({ theme, variant }) => variant === 'solid' ? theme.colors.secondary : theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.strong};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.subtle};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background-color: ${({ theme, variant }) => variant === 'solid' ? theme.colors.primary : 'transparent'};
        color: ${({ theme, variant }) => variant === 'solid' ? theme.colors.background : theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: none;
        transform: none;
      }
    `}
`;

const Button = ({ children, onClick, type = 'button', variant = 'solid', size = 'medium', disabled = false, ...props }) => {
  return (
    <StyledButton onClick={onClick} type={type} variant={variant} size={size} disabled={disabled} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;