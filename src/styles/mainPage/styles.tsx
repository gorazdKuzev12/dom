import styled from "styled-components";

export const Wrapper = styled.div`
  background: url("/so.png") center center / cover no-repeat;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
`;

export const TopBar = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  display: flex;
  gap: 16px;
  align-items: center;
  backdrop-filter: blur(10px); /* Blur background for contrast */
  background-color: rgba(255, 255, 255, 0.118); /* Soft white background */
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
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
`;

export const LanguageSelect = styled.select`
  padding: 0.2rem 0.6rem;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  background-color: #ffffff4d;
  border-radius: 8px;
`;

export const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Logo = styled.h1`
  font-size: 6.5rem;
  color: #072e29;
  margin-bottom: 2.5rem;
`;

export const SearchBar = styled.div`
  display: flex;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  padding: 2.2rem;
  gap: 0.5rem;
  align-items: center;
`;

export const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
`;

export const ToggleButton = styled.button<{ active?: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: ${({ active }) => (active ? "#eee" : "white")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #f2f2f2;
  }
`;

export const Dropdown = styled.select`
  border: none;
  padding: 0.8rem 1.3rem;
  font-size: 1rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

export const Input = styled.input`
  border: none;
  padding: 0.8rem 1.3rem;
  font-size: 1rem;
  flex: 1;
  min-width: 200px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

export const SearchButton = styled.button`
  background-color: #0c4240;
  color: white;
  padding: 0.6rem 1.5rem;
  border: none;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;

  &:hover {
    background-color: #000;
  }
`;
