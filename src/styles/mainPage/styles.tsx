import styled from "styled-components";

/* ---------- LAYOUT ---------- */

/* --- Wrapper ----------------------------------------------------------- */
export const Wrapper = styled.div`
  background: url("/so.png") center center / cover no-repeat;
  min-height: 100vh; /* full-screen image everywhere */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  /* reserve space for the fixed TopBar on small screens */
  @media (max-width: 768px) {
    padding-top: 70px; /* ≈ TopBar height + a little air */
  }

  /* Style overrides for React Select components */
  .property-type-select,
  .city-select {
    margin-bottom: 0.5rem;

    @media (min-width: 769px) {
      margin-bottom: 0;
    }
  }
`;

export const TopLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  color: #111;
  text-decoration: none;
  cursor: pointer;
  gap: 8px;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;

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
    width: 40%;
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
`;

export const Logo = styled.h1`
  font-size: 6.5rem;
  color: #072e29;
  margin-bottom: 2.5rem;

  /* Tablet↓ */
  @media (max-width: 768px) {
    font-size: 5rem;
  }

  /* Mobile↓ */
  @media (max-width: 480px) {
    font-size: 5rem;
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
    padding: 1.2rem;
    width: 100%;
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

export const Dropdown = styled.select`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.8rem 1.3rem;
  font-size: 1rem;
  background: #fff;

  /* Mobile↓ */
  @media (max-width: 480px) {
    width: 100%;
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
`;
export const TopBar = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  display: flex;
  gap: 16px;
  align-items: center;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.118);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;

  /* phones & tablets */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 96%;
    justify-content: space-between;
    gap: 8px;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.35);
    z-index: 1000;
  }
`;

/* hide full menu on mobile ------------------------------------------- */
export const LinksDesktop = styled.div`
  display: flex;
  gap: 16px;

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
    backdrop-filter: blur(12px);
    padding: 1rem;
    gap: 1rem;
    flex-direction: column;
    z-index: 999;
    transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-120%)")};
    transition: transform 0.25s ease;
    display: flex;
  }
`;
