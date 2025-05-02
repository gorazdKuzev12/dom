"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FiSearch,
  FiMapPin,
  FiMenu,
  FiX,
  FiX as FiClose,
  FiPlusSquare,
} from "react-icons/fi";
import { BiSolidBuildingHouse } from "react-icons/bi";
import Menu from "@/components/Menu/page";

export default function MapPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Buy");
  const [selectedZone, setSelectedZone] = useState(null);
  const [showZoneDetails, setShowZoneDetails] = useState(false);

  // List of zones with their information
  const zones = [
    {
      id: 1,
      name: "Centar",
      properties: 54,
      color: "#5C6B73",
      avgPrice: "€2,100/m²",
      popular: true,
    },
    {
      id: 2,
      name: "Karpoš",
      properties: 32,
      color: "#5C6B73",
      avgPrice: "€1,900/m²",
      popular: true,
    },
    {
      id: 3,
      name: "Aerodrom",
      properties: 47,
      color: "#5C6B73",
      avgPrice: "€1,850/m²",
      popular: true,
    },
    {
      id: 4,
      name: "Čair",
      properties: 21,
      color: "#8D9CA6",
      avgPrice: "€1,300/m²",
      popular: false,
    },
    {
      id: 5,
      name: "Gjorče Petrov",
      properties: 18,
      color: "#8D9CA6",
      avgPrice: "€1,450/m²",
      popular: false,
    },
    {
      id: 6,
      name: "Gazi Baba",
      properties: 26,
      color: "#8D9CA6",
      avgPrice: "€1,250/m²",
      popular: false,
    },
    {
      id: 7,
      name: "Kisela Voda",
      properties: 35,
      color: "#8D9CA6",
      avgPrice: "€1,550/m²",
      popular: false,
    },
    {
      id: 8,
      name: "Butel",
      properties: 14,
      color: "#B8C5D6",
      avgPrice: "€1,100/m²",
      popular: false,
    },
    {
      id: 9,
      name: "Saraj",
      properties: 11,
      color: "#B8C5D6",
      avgPrice: "€900/m²",
      popular: false,
    },
    {
      id: 10,
      name: "Šuto Orizari",
      properties: 9,
      color: "#B8C5D6",
      avgPrice: "€800/m²",
      popular: false,
    },
    {
      id: 11,
      name: "Sopište",
      properties: 7,
      color: "#B8C5D6",
      avgPrice: "€850/m²",
      popular: false,
    },
    {
      id: 12,
      name: "Studenichani",
      properties: 5,
      color: "#B8C5D6",
      avgPrice: "€800/m²",
      popular: false,
    },
  ];

  const totalProperties = zones.reduce(
    (total, zone) => total + zone.properties,
    0
  );

  // Handle zone selection
  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setShowZoneDetails(true);
  };

  // Close zone details panel
  const closeZoneDetails = () => {
    setShowZoneDetails(false);
  };

  // Handle zone selection from the sidebar
  const handleLocationSelect = (zone) => {
    setSelectedZone(zone);
    setShowZoneDetails(true);
  };

  return (
    <Wrapper>
      <Menu />

      <MainContent>
        <Sidebar>
          <SidebarTitle>Properties in Skopje</SidebarTitle>
          <ViewButton>
            <BiSolidBuildingHouse />
            View {totalProperties} properties
          </ViewButton>

          <SearchContainer>
            <SearchTitle>Find by location</SearchTitle>
            <SearchInputWrapper>
              <FiSearch />
              <SearchInput placeholder="Search municipality, neighborhood..." />
            </SearchInputWrapper>

            <LocationList>
              {zones.map((zone) => (
                <LocationItem
                  key={zone.id}
                  onClick={() => handleLocationSelect(zone)}
                  isSelected={selectedZone?.id === zone.id}
                >
                  <LocationIcon color={zone.color}>
                    <FiMapPin />
                  </LocationIcon>
                  <LocationName>{zone.name}</LocationName>
                  <PropertyCount>{zone.properties}</PropertyCount>
                </LocationItem>
              ))}
            </LocationList>
          </SearchContainer>
        </Sidebar>

        <MapContainer>
          <MapContentWrapper>
            <MapHeader>
              <MapTitle>Skopje Real Estate Map</MapTitle>
              <MapSubtitle>Click on a zone to explore properties</MapSubtitle>
            </MapHeader>
            <MapFooter>
              <MapLegend>
                <LegendItem color="#353c40">High demand</LegendItem>
                <LegendItem color="#99aebc">Medium demand</LegendItem>
                <LegendItem color="#c4d2e5">Low demand</LegendItem>
              </MapLegend>
              <MapAttribution>© dom.mk 2025</MapAttribution>
            </MapFooter>
            <MapImageContainer>
              {/* Interactive Map with Clickable Zones */}
              <MapSVGContainer>
                <svg viewBox="0 100 800 600">
                  {/* Background */}
                  <rect x="0" y="0" width="800" height="500" fill="#F5F7FA" />

                  {/* Vardar River */}
                  <path
                    d="M100,300 C200,250 400,350 700,280"
                    stroke="#B8C5D6"
                    strokeWidth="20"
                    fill="none"
                  />

                  {/* Interactive zones - these coordinates are placeholders */}
                  <g>
                    {/* Zone 1: Centar */}
                    <path
                      d="M400,250 L450,230 L480,260 L440,300 L390,280 Z"
                      fill={selectedZone?.id === 1 ? "#394044" : "#DAE1E7"}
                      stroke="#fff"
                      strokeWidth="2"
                      onClick={() => handleZoneClick(zones[0])}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x="420"
                      y="265"
                      fill="#303030"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      Centar
                    </text>

                    {/* Zone 2: Karpoš */}
                    <path
                      d="M320,230 L390,250 L370,300 L310,290 Z"
                      fill={selectedZone?.id === 2 ? "#394044" : "#DAE1E7"}
                      stroke="#fff"
                      strokeWidth="2"
                      onClick={() => handleZoneClick(zones[1])}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x="345"
                      y="270"
                      fill="#000000"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      Karpoš
                    </text>

                    {/* Zone 3: Aerodrom */}
                    <path
                      d="M440,300 L480,280 L520,330 L460,350 Z"
                      fill={selectedZone?.id === 3 ? "#394044" : "#DAE1E7"}
                      stroke="#fff"
                      strokeWidth="2"
                      onClick={() => handleZoneClick(zones[2])}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x="475"
                      y="320"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      Aerodrom
                    </text>

                    {/* Zone 4: Čair */}
                    <path
                      d="M450,180 L500,200 L480,250 L440,220 Z"
                      fill={selectedZone?.id === 4 ? "#8D9CA6" : "#E5EBF1"}
                      stroke="#fff"
                      strokeWidth="2"
                      onClick={() => handleZoneClick(zones[3])}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x="465"
                      y="215"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      Čair
                    </text>

                    {/* Zone 5: Gjorče Petrov */}
                    <path
                      d="M240,220 L310,230 L300,280 L220,270 Z"
                      fill={selectedZone?.id === 5 ? "#8D9CA6" : "#E5EBF1"}
                      stroke="#fff"
                      strokeWidth="2"
                      onClick={() => handleZoneClick(zones[4])}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x="260"
                      y="250"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      Gjorče Petrov
                    </text>

                    {/* Zone 6: Gazi Baba */}
                    <path
                      d="M500,190 L560,170 L570,230 L510,250 Z"
                      fill={selectedZone?.id === 6 ? "#8D9CA6" : "#E5EBF1"}
                      stroke="#fff"
                      strokeWidth="2"
                      onClick={() => handleZoneClick(zones[5])}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x="535"
                      y="210"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      Gazi Baba
                    </text>

                    {/* Zone 7: Kisela Voda */}
                    <path
                      d="M470,350 L520,330 L540,380 L480,400 Z"
                      fill={selectedZone?.id === 7 ? "#8D9CA6" : "#E5EBF1"}
                      stroke="#fff"
                      strokeWidth="2"
                      onClick={() => handleZoneClick(zones[6])}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x="505"
                      y="365"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      Kisela Voda
                    </text>

                    {/* More zones would be added here */}
                  </g>

                  {/* City center marker */}
                  <circle cx="420" y="265" r="5" fill="#3D4F58" />
                </svg>
              </MapSVGContainer>

              {/* Zone Details Panel (shown when a zone is selected) */}
              {showZoneDetails && selectedZone && (
                <ZoneDetailsPanel>
                  <ZoneDetailsHeader>
                    <ZoneDetailsTitle>{selectedZone.name}</ZoneDetailsTitle>
                    <CloseButton onClick={closeZoneDetails}>
                      <FiClose size={20} />
                    </CloseButton>
                  </ZoneDetailsHeader>

                  <ZoneDetailsStat>
                    <ZoneDetailsLabel>Properties:</ZoneDetailsLabel>
                    <ZoneDetailsValue>
                      {selectedZone.properties} listings
                    </ZoneDetailsValue>
                  </ZoneDetailsStat>

                  <ZoneDetailsStat>
                    <ZoneDetailsLabel>Average Price:</ZoneDetailsLabel>
                    <ZoneDetailsValue>{selectedZone.avgPrice}</ZoneDetailsValue>
                  </ZoneDetailsStat>

                  {selectedZone.popular && (
                    <ZonePopularBadge>Popular Area</ZonePopularBadge>
                  )}

                  <ViewZoneButton>
                    View Properties in {selectedZone.name}
                  </ViewZoneButton>
                </ZoneDetailsPanel>
              )}
            </MapImageContainer>
          </MapContentWrapper>
        </MapContainer>
      </MainContent>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7fa;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.a`
  font-size: 1.8rem;
  font-weight: 700;
  color: #3d4f58;
  text-decoration: none;
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavItem = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 1rem;
  color: ${(props) => (props.active ? "#3D4F58" : "#5C6B73")};
  cursor: pointer;
  position: relative;
  padding: 0.5rem 0.25rem;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #3d4f58;
    transform: scaleX(${(props) => (props.active ? 1 : 0)});
    transition: transform 0.2s ease;
  }

  &:hover:after {
    transform: scaleX(1);
  }
`;

const MobileNavItem = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: ${(props) => (props.active ? "#3D4F58" : "#5C6B73")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  width: 100%;

  &:hover {
    background: #f5f7fa;
  }
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  color: #3d4f58;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #5c6b73;
  }
`;

const LanguageSelector = styled.select`
  border: none;
  background: none;
  font-size: 0.9rem;
  color: #5c6b73;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #3d4f58;
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 0.5rem;
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  z-index: 40;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const MobileLanguageSelector = styled.select`
  margin: 0.75rem 1rem;
  padding: 0.5rem;
  border: 1px solid #e5ebf1;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 72px);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 350px;
  background: white;
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid #e5ebf1;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5ebf1;
    height: auto;
  }
`;

const SidebarTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #3d4f58;
  margin-bottom: 1.25rem;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #105544;
  color: white;
  border: none;
  padding: 0.5rem 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 1.5rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease;

  &:hover {
    background: #5c6b73;
  }
`;

const SearchContainer = styled.div`
  margin-top: 1.5rem;
`;

const SearchTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #3d4f58;
  margin-bottom: 1rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.25rem;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #8d9ca6;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  border: 1px solid #e5ebf1;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #f5f7fa;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #5c6b73;
    background: white;
    box-shadow: 0 0 0 2px rgba(61, 79, 88, 0.1);
  }
`;

const LocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #b8c5d6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #8d9ca6;
  }
`;

const LocationItem = styled.div<{ isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: ${(props) => (props.isSelected ? "#F0F4F8" : "transparent")};
  border-left: ${(props) =>
    props.isSelected ? "3px solid #3D4F58" : "3px solid transparent"};

  &:hover {
    background: #f0f4f8;
  }
`;

const LocationIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(props) => `${props.color}20`}; // 20% opacity of the color
  color: ${(props) => props.color};
  flex-shrink: 0;
`;

const LocationName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #3d4f58;
  flex-grow: 1;
`;

const PropertyCount = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #3d4f58;
  background: #e5ebf1;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
`;

const MapContainer = styled.div`
  flex-grow: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const MapContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const MapHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const MapTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.25rem;
`;

const MapSubtitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  color: #8d9ca6;
`;

const MapImageContainer = styled.div`
  flex: 1;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: white;
`;

const MapSVGContainer = styled.div`
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const MapFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const MapLegend = styled.div`
  display: flex;
  gap: 1rem;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #5c6b73;

  &:before {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${(props) => props.color};
  }
`;

const MapAttribution = styled.div`
  font-size: 0.75rem;
  color: #8d9ca6;
`;

// Zone Details Panel Styles
const ZoneDetailsPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  z-index: 10;
`;

const ZoneDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ZoneDetailsTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #3d4f58;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #8d9ca6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;

  &:hover {
    background: #f5f7fa;
    color: #5c6b73;
  }
`;

const ZoneDetailsStat = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5ebf1;
`;

const ZoneDetailsLabel = styled.span`
  font-size: 0.9rem;
  color: #8d9ca6;
`;

const ZoneDetailsValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #3d4f58;
`;

const ZonePopularBadge = styled.div`
  display: inline-block;
  background: #5c6b73;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  margin-top: 1rem;
`;

const ViewZoneButton = styled.button`
  width: 100%;
  background: #105544;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  font-weight: 500;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #5c6b73;
  }
`;
