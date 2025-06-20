import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

  @media (max-width: 640px) {
    padding-bottom: 1.5rem;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  max-width: 1250px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 1.5rem 2rem;
  }

  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #111827;
  margin-top: 2.5rem;
  position: relative;
  text-transform: capitalize;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #1e6b56 0%, #3cc9a9 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    &:after {
      width: 30px;
    }
  }
`;

export const NeighborhoodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
  grid-auto-rows: minmax(260px, auto);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    margin-top: 2rem;
    gap: 1.5rem;
  }
`;

export const NeighborhoodCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  position: relative;
  backdrop-filter: blur(5px); /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.9);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    border-radius: 10px;
    padding: 0.5rem;
  }
`;

export const CardImage = styled.div`
  height: 200px;
  background-size: cover;
  background-position: center;
  max-width: 100%;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 160px; /* Increased for better visibility */
  }
`;

export const CardContent = styled.div`
  padding: 1.25rem;

  @media (max-width: 640px) {
    padding: 1.2rem;
  }
`;

export const NeighborhoodName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const PropertiesCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const AvgPrice = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #111827;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    top: 8px;
    right: 8px;
  }
`;

export const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  background: #0c4240;
  border: none;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.65rem 1rem;
  border-radius: 6px;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(30, 107, 86, 0.2);
  width: 100%;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #0e3a2e 0%, #174a3b 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 107, 86, 0.25);
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.75rem 1.2rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(30, 107, 86, 0.3);
  }
`;

export const MapSection = styled.div`
  margin-top: 1rem;
  position: relative;

  @media (max-width: 640px) {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const MapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
`;

export const MapTitle = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const MapControls = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.3rem;
  border-radius: 8px;

  @media (max-width: 640px) {
    display: none;
  }

  @media (max-width: 480px) and (min-width: 641px) {
    width: 100%;
    justify-content: center;
  }
`;

export const MapButton = styled.button`
  border: none;
  background: transparent;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;

  &:hover {
    color: #111827;
  }

  &.active {
    background-color: #ffffff;
    color: #1e6b56;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    font-weight: 600;
  }

  @media (max-width: 480px) and (min-width: 641px) {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
`;

export const MapContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 43%;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8f9fa;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 640px) {
    display: none;
  }

  @media (max-width: 1024px) and (min-width: 641px) {
    padding-top: 50%;
  }
`;

export const MapOverlay = styled.div`
  position: absolute;
  top: 5rem;
  left: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;

  @media (max-width: 640px) {
    position: static;
    width: 100%;
    max-width: 370px;
    margin: 0 auto;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  }
`;

export const MapSearchInput = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  margin-bottom: 1rem;
  background: #f9fafb;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #1e6b56;
    box-shadow: 0 0 0 3px rgba(30, 107, 86, 0.1);
    background: white;
  }

  input {
    border: none;
    flex: 1;
    font-size: 0.9rem;
    padding: 0 0.5rem;
    outline: none;
    background: transparent;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #4b5563;
    }
  }

  @media (max-width: 480px) {
    input {
      font-size: 0.85rem;
    }
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
  }
`;

export const MapRegionList = styled.div`
  max-height: 290px;
  overflow-y: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

export const MapRegionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 0.25rem;

  &:hover {
    background-color: #f3f4f6;
  }

  &.active {
    background-color: #ecfdf5;
    color: #065f46;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    border-radius: 10px;
  }
`;

export const RegionName = styled.div`
  margin-left: 0.75rem;
  flex: 1;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const PropertyBadge = styled.span`
  background-color: #f3f4f6;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: #4b5563;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
  }
`;

export const MapCanvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.08);
    pointer-events: none;
  }

  /* Hidden on mobile via MapContainer */
`;

export const NeighborhoodMarker = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;

  &:hover .tooltip {
    opacity: 1;
    transform: translateY(-10px);
    visibility: visible;
  }
`;

export const MarkerIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #134e3e 0%, #1e6b56 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &.active {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #e05f15 0%, #f3752b 100%);
    transform: scale(1.15);
    box-shadow: 0 6px 16px rgba(243, 117, 43, 0.4);
    z-index: 200;
  }

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;

    &.active {
      width: 40px;
      height: 40px;
    }
  }
`;

export const MarkerTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  background-color: white;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  pointer-events: none;
  z-index: 200;
  font-weight: 500;
  font-size: 0.85rem;

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid white;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }
`;

export const NeighborhoodDetailOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  z-index: 15;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #333;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transform: ${(props) =>
    props.$visible ? "translateY(0)" : "translateY(-10px)"};
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};

  @media (max-width: 1024px) {
    width: 250px;
    padding: 1.25rem;
  }

  @media (max-width: 768px) {
    display: none; // Hide on smaller screens if sidebar is present
  }
`;

export const DetailName = styled.h3`
  margin: 0 0 0.75rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #111827;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const DetailStat = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #4b5563;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const ViewPropertiesButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(30, 107, 86, 0.2);

  &:hover {
    background: linear-gradient(135deg, #0e3a2e 0%, #174a3b 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 107, 86, 0.25);
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.75rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(30, 107, 86, 0.3);
  }
`;

export const DetailDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 0.75rem 0;

  @media (max-width: 480px) {
    margin: 0.5rem 0;
  }
`;
