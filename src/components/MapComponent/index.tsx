"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { MapPin, Home, Search, X, ChevronRight, Map } from "lucide-react";
import Menu from "@/components/Menu/page";
import { useRouter } from "next/navigation";
import {
  AvgPrice,
  CardContent,
  CardImage,
  DetailDivider,
  DetailName,
  DetailStat,
  MainContent,
  MapButton,
  MapCanvas,
  MapContainer,
  MapControls,
  MapHeader,
  MapOverlay,
  MapRegionItem,
  MapRegionList,
  MapSearchInput,
  MapSection,
  MapTitle,
  MarkerIcon,
  MarkerTooltip,
  NeighborhoodCard,
  NeighborhoodDetailOverlay,
  NeighborhoodMarker,
  NeighborhoodName,
  NeighborhoodsGrid,
  PageContainer,
  PropertiesCount,
  PropertyBadge,
  RegionName,
  Title,
  ViewAllButton,
  ViewPropertiesButton,
} from "@/styles/mapPage/styles";

interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  propertyCount: number;
  avgPrice: string;
  image: string;
  isPopular: boolean;
}

interface NeighborhoodsClientProps {
  cityName: string;
  neighborhoods: Neighborhood[];
}

export default function NeighborhoodsClient({ cityName, neighborhoods }: NeighborhoodsClientProps) {
  const router = useRouter();
  const [mapView, setMapView] = useState("standard");
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNeighborhoodClicked, setActiveNeighborhoodClicked] =
    useState(false);

  console.log("Neighborhoods: ", neighborhoods);

  // Extract transaction and property type from current URL
  const getUrlParams = () => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      // Expected: /[locale]/[transaction]/[type]/[city]
      const locale = pathParts[1];
      const transaction = pathParts[2]; // buy/rent
      const type = pathParts[3]; // apartments/houses/etc
      return { locale, transaction, type };
    }
    return { locale: 'en', transaction: 'buy', type: 'apartments' };
  };

  // Define positions for markers in pixel coordinates based on a reference map size
  const mapReferenceWidth = 800;
  const mapReferenceHeight = 480;

  const neighborhoodPositions: Record<string, { left: string; top: string }> = {};
  neighborhoods.forEach((neighborhood, index) => {
    const totalItems = neighborhoods.length;
    const angleStep = (2 * Math.PI) / totalItems;
    const angle = index * angleStep;

    const radius = 150; // pixel distance from center
    const centerX = mapReferenceWidth / 2;
    const centerY = mapReferenceHeight / 2;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    neighborhoodPositions[neighborhood.id] = {
      left: `${(x / mapReferenceWidth) * 100}%`,
      top: `${(y / mapReferenceHeight) * 100}%`,
    };
  });

  const filteredNeighborhoods = neighborhoods.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleNeighborhoodHover = (id: string) => {
    if (!activeNeighborhoodClicked) {
      setActiveNeighborhood(id);
    }
  };

  const handleNeighborhoodClick = (id: string) => {
    if (id === activeNeighborhood && activeNeighborhoodClicked) {
      setActiveNeighborhood(null);
      setActiveNeighborhoodClicked(false);
    } else {
      setActiveNeighborhood(id);
      setActiveNeighborhoodClicked(true);
    }
  };

  const handleNeighborhoodLeave = () => {
    if (!activeNeighborhoodClicked) {
      setActiveNeighborhood(null);
    }
  };

  const getActiveNeighborhood = () => {
    return neighborhoods.find((n) => n.id === activeNeighborhood);
  };

  const viewAllProperties = () => {
    const { locale, transaction, type } = getUrlParams();
    router.push(`/${locale}/${transaction}/${type}/${cityName.toLowerCase()}`);
  };

  const viewNeighborhoodProperties = (neighborhood: string) => {
    if (!neighborhood) return;
    const activeNeighborhoodData = neighborhoods.find(
      (n) => n.id === neighborhood
    );
    if (activeNeighborhoodData) {
      const { locale, transaction, type } = getUrlParams();
      router.push(
        `/${locale}/${transaction}/${type}/${cityName.toLowerCase()}/municipality/${activeNeighborhoodData.slug}/listings`
      );
    }
  };

  const mapImages = {
    standard: `/skopje-maps2.png`,
    satellite: `/maps/${cityName.toLowerCase()}/satellite.png`,
  };

  return (
    <PageContainer>
      <Menu />

      <MainContent>
        <MapSection>
          <MapHeader>
            <MapTitle>
              <Map size={24} color="#1e6b56" />
              Explore neighborhoods in {cityName}
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

          {/* Filters Section */}
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
                  onMouseEnter={() => handleNeighborhoodHover(neighborhood.id)}
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

          {/* Map Section */}
          <MapContainer>
            <MapCanvas
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

          {/* Neighborhood Detail Overlay */}
          <NeighborhoodDetailOverlay visible={activeNeighborhood !== null}>
            {activeNeighborhood && getActiveNeighborhood() && (
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
                  {getActiveNeighborhood()?.avgPrice ||
                    "Price data unavailable"}
                </DetailStat>

                <DetailDivider />

                <ViewPropertiesButton
                  onClick={() => viewNeighborhoodProperties(activeNeighborhood)}
                >
                  View properties
                  <ChevronRight size={18} />
                </ViewPropertiesButton>
              </>
            )}
          </NeighborhoodDetailOverlay>
        </MapSection>

        <Title>Popular neighborhoods in {cityName}</Title>

        <NeighborhoodsGrid>
          {neighborhoods
            .filter((n) => n.isPopular)
            .map((neighborhood) => (
              <NeighborhoodCard
                key={neighborhood.id}
                onMouseEnter={() => handleNeighborhoodHover(neighborhood.id)}
                onMouseLeave={handleNeighborhoodLeave}
                onClick={() => handleNeighborhoodClick(neighborhood.id)}
              >
                <CardImage style={{ backgroundImage: `url(/skopje.jpg)` }} />{" "}
                <AvgPrice>
                  {neighborhood.avgPrice || "Price data unavailable"}
                </AvgPrice>
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
