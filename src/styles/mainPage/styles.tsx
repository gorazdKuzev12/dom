import styled from "styled-components";

/* ---------- LAYOUT ---------- */

/* --- Wrapper ----------------------------------------------------------- */
export const Wrapper = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-primary-dark) 0%,
    var(--color-primary) 100%
  );
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* reserve space for the fixed TopBar on small screens */
  @media (max-width: 768px) {
    padding-top: var(--space-2xl);
  }
`;

export const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

export const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-xl);
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

export const SearchBar = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 2.2rem;
  border-radius: 50px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.8s ease;
  }
  
  &:hover {
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.15),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(12, 66, 64, 0.15),
      0 4px 16px rgba(12, 66, 64, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
    border-color: rgba(12, 66, 64, 0.2);
  }

  /* Tablet↓ */
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 3rem;
    width: 100%;
    border-radius: 24px;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:focus-within {
      transform: translateY(-1px);
    }
  }
`;
export const TopLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  font-weight: 500;
  color: rgba(218, 230, 230, 0.95);
  text-decoration: none;
  cursor: pointer;
  gap: 8px;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  position: relative;
  backdrop-filter: blur(8px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.95);
    transform: translateY(-1px);
    
    &::before {
      opacity: 1;
    }
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }

  /* Mobile↓ */
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 0.4rem 0.8rem;
    font-weight: 500;
    color: rgba(17, 17, 17, 0.9);
    
    &:hover {
      color: #0c4240;
      background: rgba(12, 66, 64, 0.08);
    }
  }
`;

export const LanguageSelect = styled.select`
  padding: 0.2rem 0.6rem;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  background-color: #ffffff4d;
  border-radius: 8px;

  /* Mobile↓ */
  @media (max-width: 480px) {
    width: auto;
    padding: 0.4rem 0.8rem; /* Larger touch target */
    font-size: 1rem;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.7); /* More visible */
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }
`;

/* --- Overlay: perfectly centred ------------------------------------- */
export const Overlay = styled.div`
  /* centre on both axes */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem; /* space between logo & search */

  /* keep it nicely contained on phones */
  width: calc(100% - 2rem);
  max-width: 400px;
  z-index: 2;

  /* Mobile specific adjustments */
  @media (max-width: 480px) {
    width: calc(100% - 3rem); /* More horizontal breathing room */
    top: 45%; /* Move up slightly to improve visibility */
  }
`;
export const LanguageContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const LanguageButton = styled.button<{ active: boolean }>`
  background: ${props => 
    props.active 
      ? 'linear-gradient(135deg, #0c4240 0%, #1a5f5c 100%)' 
      : 'rgba(255, 255, 255, 0.15)'
  };
  color: ${props => props.active ? '#fff' : 'rgba(17, 17, 17, 0.8)'};
  border: 1px solid ${props => 
    props.active 
      ? 'transparent' 
      : 'rgba(204, 204, 204, 0.3)'
  };
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  
  &:hover {
    background: ${props => 
      props.active 
        ? 'linear-gradient(135deg, #0a3937 0%, #17524f 100%)' 
        : 'rgba(255, 255, 255, 0.25)'
    };
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 12px;
    color: ${props => props.active ? '#fff' : 'rgba(17, 17, 17, 0.9)'};
    background: ${props => 
      props.active 
        ? 'linear-gradient(135deg, #0c4240 0%, #1a5f5c 100%)' 
        : 'rgba(255, 255, 255, 0.9)'
    };
    border-color: ${props => 
      props.active 
        ? 'transparent' 
        : 'rgba(204, 204, 204, 0.5)'
    };
  }
`; 

export const Logo = styled.h1`
  font-family: 'Inter', 'Playfair Display', serif;
  font-size: 5rem;
  font-weight: 800;
  color: white;
  margin-bottom: var(--space-xl);
  text-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.05em;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  transition: all 0.4s ease;
  cursor: default;
  
  &:hover {
    transform: translateY(-2px);
    text-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0) 100%);
    border-radius: 2px;
    opacity: 0.8;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    width: 85px;
    opacity: 1;
    height: 5px;
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: var(--space-lg);
    
    &::after {
      width: 50px;
      bottom: -8px;
      height: 3px;
    }
    
    &:hover::after {
      width: 60px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2.75rem;
    margin-bottom: var(--space-md);
    letter-spacing: -0.03em;
    
    &::after {
      width: 40px;
      bottom: -6px;
    }
    
    &:hover::after {
      width: 48px;
    }
  }
`;

export const SearchContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-xl);
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`;

/* ---------- CONTROLS ---------- */


export const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid rgba(204, 204, 204, 0.3);
  border-radius: 50px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (min-width: 769px) {
    margin-bottom: 0;
  }

  /* Mobile↓ */
  @media (max-width: 480px) {
    flex-wrap: wrap;
    width: 100%;
  }
`;


export const ToggleButton = styled.button<{ active?: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  background: ${({ active }) => 
    active 
      ? 'linear-gradient(135deg, #0c4240 0%, #1a5f5c 100%)' 
      : 'transparent'
  };
  color: ${({ active }) => (active ? '#fff' : '#666')};
  font-weight: ${({ active }) => (active ? '600' : '500')};
  cursor: pointer;
  font-size: 1rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(12, 66, 64, 0.1),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background: ${({ active }) => 
      active 
        ? 'linear-gradient(135deg, #0a3937 0%, #17524f 100%)' 
        : 'rgba(12, 66, 64, 0.08)'
    };
    color: ${({ active }) => (active ? '#fff' : '#0c4240')};
    transform: translateY(-1px);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(0);
    transition: all 0.1s ease;
  }

  /* Mobile↓ */
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    text-align: center;
  }
`;
export const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--space-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`;

export const Dropdown = styled.select`
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  color: var(--color-neutral-800);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-neutral-300);
  }
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(26, 61, 55, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: var(--space-sm) var(--space-md);
  }
`;

export const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.8rem 1.3rem;
  font-size: 1rem;
  flex: 1;
  min-width: 200px;

  /* Mobile↓ */
  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
    padding: 0.9rem 1.2rem;
    border-radius: 12px;
    background: #f9f9f9;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    font-size: 1.05rem;

    &::placeholder {
      color: #aaa;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(12, 66, 64, 0.2);
    }
  }
`;


export const SearchButton = styled.button`
  background: linear-gradient(135deg, #0c4240 0%, #1a5f5c 100%);
  color: #fff;
  padding: 0.6rem 1.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(12, 66, 64, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(12, 66, 64, 0.4);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    transition: all 0.1s ease;
  }

  /* Mobile↓ */
  @media (max-width: 480px) {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.8rem 1.5rem;
    font-size: 1.05rem;
    
    &:hover {
      transform: translateY(-1px) scale(1.01);
    }
  }
`;
export const TopBar = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.118);
  padding: 0.4rem 1.2rem;
  border-radius: 12px;
  min-width: 320px;
  z-index: 3;

  /* phones & tablets */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transform: none;
    justify-content: center;
    gap: 8px;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    z-index: 1000;
    padding: 0.8rem 1rem;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.08);
    min-width: unset;
  }
`;

/* hide full menu on mobile ------------------------------------------- */
export const LinksDesktop = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* ---------- HAMBURGER ICON (mobile only) ---------------------------- */

export const BurgerButton = styled.button`
  display: none; /* desktop */
  background: none;
  border: none;
  padding: 0.4rem;
  cursor: pointer;

  @media (max-width: 768px) {
    /* mobile */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  /* three bars */
  span,
  span::before,
  span::after {
    content: "";
    display: block;
    width: 22px;
    height: 2px;
    background: #0c4240;
    transition: transform 0.25s ease;
  }

  span::before,
  span::after {
    position: relative;
  }

  span::before {
    top: -6px;
  }
  span::after {
    top: 4px;
  }

  /* rotate bars when open */
  &.open span {
    background: transparent;
  }
  &.open span::before {
    top: 0;
    transform: rotate(45deg);
  }
  &.open span::after {
    top: 0;
    transform: rotate(-45deg);
  }
`;

/* ---------- SLIDE-DOWN MOBILE MENU ---------------------------------- */

export const MobileMenu = styled.div<{ open: boolean }>`
  display: none; /* desktop */

  @media (max-width: 768px) {
    position: fixed;
    top: 60px; /* just below TopBar */
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    padding: 1.5rem;
    gap: 1.2rem;
    flex-direction: column;
    align-items: center;
    z-index: 999;
    transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-120%)")};
    transition: transform 0.3s ease;
    display: flex;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    /* Add animation and styling for links */
    a {
      padding: 0.8rem 1rem;
      border-radius: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      text-align: center;
      width: 100%;
      max-width: 280px;

      &:hover {
        background: rgba(12, 66, 64, 0.08);
      }

      /* Animation delay for staggered appearance */
      opacity: ${({ open }) => (open ? 1 : 0)};
      transform: ${({ open }) =>
        open ? "translateY(0)" : "translateY(-10px)"};
      transition: opacity 0.3s ease, transform 0.3s ease;

      &:nth-child(2) {
        transition-delay: 0.05s;
      }

      &:nth-child(3) {
        transition-delay: 0.1s;
      }

      &:nth-child(4) {
        transition-delay: 0.15s;
      }
    }
  }
`;
