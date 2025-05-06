"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ArrowLeft,
  MapPin,
  Home,
  Search,
  X,
  ChevronRight,
  Map,
  MessageSquare,
} from "lucide-react";
import Menu from "@/components/Menu/page";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  max-width: 1250px;
  margin: 0 auto;
  width: 100%;
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const TitleActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #134e3e 0%, #1e6b56 100%);
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
`;

const BackButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 50%;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #111827;
  margin-top: 2.5rem;
  position: relative;

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
`;

const NeighborhoodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
  grid-auto-rows: minmax(260px, auto);
`;

const NeighborhoodCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
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
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const NeighborhoodName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const PropertiesCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.9rem;
`;

const AvgPrice = styled.div`
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
`;

const MapSection = styled.div`
  margin-top: 1rem;
`;

const MapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MapTitle = styled.h2`
  font-size: 1.4rem;
  margin: 0;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MapControls = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.3rem;
  border-radius: 8px;
`;

const MapButton = styled.button`
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
`;

const MapContainer = styled.div`
  height: 480px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8f9fa;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  width: 260px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
`;

const MapSearchInput = styled.div`
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
`;

const MapRegionList = styled.div`
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
`;

const MapRegionItem = styled.div`
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
`;

const RegionName = styled.div`
  margin-left: 0.75rem;
  flex: 1;
`;

const PropertyBadge = styled.span`
  background-color: #f3f4f6;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: #4b5563;
  font-weight: 500;
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background-image: url("/skopje-map.png");
  background-size: cover;
  background-position: center;
  position: relative;

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
  filter: brightness(0.7) contrast(1.3) saturate(1.2);
`;

const NeighborhoodMarker = styled.div`
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

const MarkerIcon = styled.div`
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
`;

const MarkerTooltip = styled.div`
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
`;

const NeighborhoodDetailOverlay = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  width: 280px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: all 0.3s ease;
  pointer-events: ${(props) => (props.visible ? "all" : "none")};
  transform: ${(props) =>
    props.visible ? "translateX(0)" : "translateX(20px)"};
`;

const DetailName = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #111827;
`;

const DetailStat = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #4b5563;
  font-size: 1rem;
`;

const ViewPropertiesButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #134e3e 0%, #1e6b56 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(30, 107, 86, 0.2);

  &:hover {
    background: linear-gradient(135deg, #0e3a2e 0%, #174a3b 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 107, 86, 0.25);
  }
`;

const DetailDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const QuickActionButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;

  span {
    font-size: 0.8rem;
    color: #4b5563;
    font-weight: 500;
  }

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

export default function NeighborhoodsPage() {
  const router = useRouter();

  // Sample data - would come from API in real application
  const neighborhoods = [
    {
      id: 1,
      name: "Karpoš",
      slug: "karpos",
      propertyCount: 142,
      avgPrice: "€1,250/m²",
      image: "/api/placeholder/400/160",
    },
    {
      id: 2,
      name: "Centar",
      slug: "centar",
      propertyCount: 98,
      avgPrice: "€1,600/m²",
      image: "/skopje.jpg",
    },
    {
      id: 3,
      name: "Aerodrom",
      propertyCount: 76,
      avgPrice: "€1,350/m²",
      image: "/aero.jpg",
    },
    {
      id: 4,
      name: "Čair",
      propertyCount: 53,
      avgPrice: "€980/m²",
      image: "/api/placeholder/400/160",
    },
    {
      id: 5,
      name: "Gazi Baba",
      propertyCount: 39,
      avgPrice: "€1,100/m²",
      image: "/api/placeholder/400/160",
    },
    {
      id: 6,
      name: "Kisela Voda",
      propertyCount: 65,
      avgPrice: "€1,200/m²",
      image: "/api/placeholder/400/160",
    },
  ];

  // In a real application, you would upload an actual map image of Skopje
  // For now we're using a placeholder, but you would replace this with your actual map image
  const mapImages = {
    standard: "/skopje-map.png", // Replace with your standard map image
    satellite: "/skopje-map.png", // Replace with your satellite map image
  };

  const [activeNeighborhood, setActiveNeighborhood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapView, setMapView] = useState("standard"); // 'standard' or 'satellite'
  const params = useParams();
  const cityName = params.city; // 'prilep' in your case
  // Track if neighborhood is actively selected (not just hovered)
  const [activeNeighborhoodClicked, setActiveNeighborhoodClicked] =
    useState(false);

  // Define hardcoded positions for the example
  const neighborhoodPositions = {
    1: { left: "40%", top: "40%" },
    2: { left: "50%", top: "45%" },
    3: { left: "65%", top: "50%" },
    4: { left: "55%", top: "35%" },
    5: { left: "70%", top: "30%" },
    6: { left: "58%", top: "60%" },
    7: { left: "35%", top: "30%" },
    8: { left: "20%", top: "60%" },
  };

  const filteredNeighborhoods = neighborhoods.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleNeighborhoodHover = (id) => {
    // Only set active neighborhood on hover if not already clicked
    if (!activeNeighborhoodClicked) {
      setActiveNeighborhood(id);
    }
  };

  const handleNeighborhoodClick = (id) => {
    if (id === activeNeighborhood && activeNeighborhoodClicked) {
      // If clicking the already active neighborhood, deselect it
      setActiveNeighborhood(null);
      setActiveNeighborhoodClicked(false);
    } else {
      // Otherwise, select the new neighborhood
      setActiveNeighborhood(id);
      setActiveNeighborhoodClicked(true);
    }
  };

  const handleNeighborhoodLeave = () => {
    // Only clear if not clicked
    if (!activeNeighborhoodClicked) {
      setActiveNeighborhood(null);
    }
  };

  const getActiveNeighborhood = () => {
    return neighborhoods.find((n) => n.id === activeNeighborhood);
  };

  const viewAllProperties = () => {
    // In a real application, this would navigate to a properties listing page
    console.log("View all properties clicked");
  };

  const viewNeighborhoodProperties = (neighborhood) => {
    console.log("View properties for:", neighborhood);
    // “skopje” is fixed here; replace with a prop if the city can change
    router.push(`/city/skopje/municipality/${neighborhood.slug}/listings`);
  };

  return (
    <PageContainer>
      <Menu />

      <MainContent>
        <MapSection>
          <MapHeader>
            <MapTitle>
              <Map size={24} color="#1e6b56" />
              Explore neighborhoods
            </MapTitle>
            <MapControls>
              <MapButton
                className={mapView === "standard" ? "active" : ""}
                onClick={() => setMapView("standard")}
              >
                Standard
              </MapButton>
              <MapButton
                className={mapView === "satellite" ? "active" : ""}
                onClick={() => setMapView("satellite")}
              >
                Satellite
              </MapButton>
            </MapControls>
          </MapHeader>
          <MapContainer>
            <MapOverlay>
              <ViewAllButton onClick={viewAllProperties}>
                <Home size={16} />
                View all properties
              </ViewAllButton>
              <MapSearchInput>
                <Search size={16} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search neighborhoods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={clearSearch}>
                    <X size={16} />
                  </button>
                )}
              </MapSearchInput>

              <MapRegionList>
                {filteredNeighborhoods.map((neighborhood) => (
                  <MapRegionItem
                    key={neighborhood.id}
                    className={
                      activeNeighborhood === neighborhood.id ? "active" : ""
                    }
                    onMouseEnter={() =>
                      handleNeighborhoodHover(neighborhood.id)
                    }
                    onMouseLeave={handleNeighborhoodLeave}
                    onClick={() => handleNeighborhoodClick(neighborhood.id)}
                  >
                    <MapPin
                      size={16}
                      color={
                        activeNeighborhood === neighborhood.id
                          ? "#065f46"
                          : "#4b5563"
                      }
                    />
                    <RegionName>{neighborhood.name}</RegionName>
                    <PropertyBadge>{neighborhood.propertyCount}</PropertyBadge>
                  </MapRegionItem>
                ))}
              </MapRegionList>
            </MapOverlay>

            {/* Neighborhood Detail Overlay */}
            <NeighborhoodDetailOverlay visible={activeNeighborhood !== null}>
              {activeNeighborhood && (
                <>
                  <DetailName>{getActiveNeighborhood()?.name}</DetailName>
                  <DetailStat>
                    <Home
                      size={18}
                      style={{ marginRight: "10px", color: "#1e6b56" }}
                    />
                    {getActiveNeighborhood()?.propertyCount} properties
                  </DetailStat>
                  <DetailStat>
                    <strong>Average price:</strong>{" "}
                    {getActiveNeighborhood()?.avgPrice}
                  </DetailStat>

                  <DetailDivider />

                  <ViewPropertiesButton
                    onClick={() =>
                      viewNeighborhoodProperties(activeNeighborhood)
                    }
                  >
                    View properties
                    <ChevronRight size={18} />
                  </ViewPropertiesButton>
                </>
              )}
            </NeighborhoodDetailOverlay>

            <MapCanvas
              className={mapView === "satellite" ? "satellite" : ""}
              style={{
                backgroundImage: `url(${
                  mapView === "satellite"
                    ? mapImages.satellite
                    : mapImages.standard
                })`,
              }}
            >
              {neighborhoods.map((neighborhood) => (
                <NeighborhoodMarker
                  key={neighborhood.id}
                  style={neighborhoodPositions[neighborhood.id]}
                  onMouseEnter={() => handleNeighborhoodHover(neighborhood.id)}
                  onMouseLeave={handleNeighborhoodLeave}
                  onClick={() => handleNeighborhoodClick(neighborhood.id)}
                >
                  <MarkerIcon
                    className={
                      activeNeighborhood === neighborhood.id ? "active" : ""
                    }
                  >
                    <Home
                      size={activeNeighborhood === neighborhood.id ? 22 : 18}
                    />
                  </MarkerIcon>
                  <MarkerTooltip className="tooltip">
                    {neighborhood.name} • {neighborhood.propertyCount}{" "}
                    properties
                  </MarkerTooltip>
                </NeighborhoodMarker>
              ))}
            </MapCanvas>
          </MapContainer>
        </MapSection>
        <Title>Popular neighborhoods in Skopje</Title>

        <NeighborhoodsGrid>
          {neighborhoods.map((neighborhood) => (
            <NeighborhoodCard
              key={neighborhood.id}
              onMouseEnter={() => handleNeighborhoodHover(neighborhood.id)}
              onMouseLeave={handleNeighborhoodLeave}
              onClick={() => handleNeighborhoodClick(neighborhood.id)}
            >
              <CardImage
                style={{ backgroundImage: `url(${neighborhood.image})` }}
              />
              <AvgPrice>{neighborhood.avgPrice}</AvgPrice>
              <CardContent>
                <NeighborhoodName>{neighborhood.name}</NeighborhoodName>
                <PropertiesCount>
                  <Home size={16} color="#1e6b56" />
                  {neighborhood.propertyCount} properties
                </PropertiesCount>
              </CardContent>
            </NeighborhoodCard>
          ))}
        </NeighborhoodsGrid>
      </MainContent>
    </PageContainer>
  );
}
