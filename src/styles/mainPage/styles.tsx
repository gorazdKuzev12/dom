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
  background: #fff;
  padding: 2.2rem;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  /* Tablet↓ */
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 3rem;
    width: 100%;
    border-radius: 0px;
  }
`;
export const TopLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  color: #111;
  text-decoration: none;
  cursor: pointer;
  gap: 8px;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;
  text-align: center;

  &:hover {
    background: rgba(0, 0, 0, 0.041);
    color: #000;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  /* Mobile↓ */
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 0.3rem 0.6rem;
    font-weight: 500;
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
  background: ${props => props.active ? '#0c4240' : 'rgba(255, 255, 255, 0.4)'};
  color: ${props => props.active ? '#fff' : '#111'};
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#0c4240' : 'rgba(255, 255, 255, 0.6)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 12px;
  }
`; 

export const Logo = styled.h1`
  font-family: 'Inter', 'Montserrat', sans-serif;
  font-size: 5rem;
  font-weight: 700;
  color: white;
  margin-bottom: var(--space-xl);
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.03em;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    height: 3px;
    width: 60px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: var(--space-lg);
    
    &::after {
      width: 45px;
      bottom: -6px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2.75rem;
    margin-bottom: var(--space-md);
    
    &::after {
      width: 35px;
      bottom: -5px;
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
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  margin-bottom: 0.5rem;

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
  background-color: ${({ active }) => (active ? "#eee" : "#fff")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #f2f2f2;
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
  background-color: #0c4240;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border: none;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000;
  }

  /* Mobile↓ */
  @media (max-width: 480px) {
    width: 100%;
    margin-top: 0.5rem;
  }
`
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
