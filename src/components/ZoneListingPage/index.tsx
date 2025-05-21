"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FiSearch,
  FiMapPin,
  FiMenu,
  FiUser,
  FiX,
  FiFilter,
  FiChevronLeft,
} from "react-icons/fi";
import { BiSolidBuildingHouse } from "react-icons/bi";
import Menu from "@/components/Menu/page";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import PropertyFilters from "../PropertyFilters";

// Define the Listing type based on your GraphQL schema
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  sizeM2: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  type: string;
  status: string;
  verified: boolean;
  featured: boolean;
  images: string[];
  createdAt: string;
}

interface ZoneListingsPageProps {
  listings: Listing[];
  municipalityName: string;
}

export default function ZoneListingsPage({
  listings,
  municipalityName,
}: ZoneListingsPageProps) {
  const locale = useLocale();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Buy");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (priceMin) count++;
    if (priceMax) count++;
    if (sizeMin) count++;
    if (sizeMax) count++;
    if (propertyType !== "All") count++;
    setActiveFiltersCount(count);
  }, [priceMin, priceMax, sizeMin, sizeMax, propertyType]);

  // Close mobile filters when resizing above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileFiltersOpen) {
        setMobileFiltersOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileFiltersOpen]);

  // Filter listings based on sidebar inputs
  const filteredListings = listings.filter((listing) => {
    if (
      propertyType !== "All" &&
      listing.type.toLowerCase() !== propertyType.toLowerCase()
    ) {
      return false;
    }

    if (priceMin && listing.price < parseInt(priceMin)) {
      return false;
    }

    if (priceMax && listing.price > parseInt(priceMax)) {
      return false;
    }

    if (sizeMin && listing.sizeM2 < parseInt(sizeMin)) {
      return false;
    }

    if (sizeMax && listing.sizeM2 > parseInt(sizeMax)) {
      return false;
    }

    return true;
  });

  const handleListingClick = (id: string) => {
    router.push(`/${locale}/apartment`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const clearAllFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setSizeMin("");
    setSizeMax("");
    setPropertyType("All");
  };

  return (
    <Wrapper>
      <Menu />

      <PageContent>
        {/* Mobile Filter Bar */}
        <MobileFilterBar>
          <LocationInfo>
            <FiMapPin />
            <span>{municipalityName}</span>
          </LocationInfo>
          <FilterButton onClick={toggleMobileFilters}>
            <FiFilter />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <FilterBadge>{activeFiltersCount}</FilterBadge>
            )}
          </FilterButton>
        </MobileFilterBar>

        <Main mobileFiltersOpen={mobileFiltersOpen}>
          {/* Sidebar for filters */}
          <SidebarContainer mobileFiltersOpen={mobileFiltersOpen}>
            <MobileFilterHeader>
              <BackButton onClick={toggleMobileFilters}>
                <FiChevronLeft size={20} />
              </BackButton>
              <FilterTitle>Filters</FilterTitle>
              <ClearButton onClick={clearAllFilters}>Clear all</ClearButton>
            </MobileFilterHeader>

            <FiltersContent>
              <PropertyFilters />

              <ApplyFilterButton onClick={toggleMobileFilters}>
                Show {filteredListings.length} properties
              </ApplyFilterButton>
            </FiltersContent>
          </SidebarContainer>

          {/* Main content area */}
          <ListArea>
            <ResultsHeader>
              <ResultsCount>
                {filteredListings.length} properties in {municipalityName}
              </ResultsCount>
              <SortDropdown>
                <option>Newest first</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </SortDropdown>
            </ResultsHeader>

            {filteredListings.length > 0 ? (
              <PropertiesList>
                {filteredListings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    onClick={() => handleListingClick(listing.id)}
                  >
                    <CardImageContainer>
                      {listing.images && listing.images.length > 0 ? (
                        <CardImage src="/so.png" alt="Property placeholder" />
                      ) : (
                        <CardImage src="/so.png" alt="Property placeholder" />
                      )}
                      {listing.featured && (
                        <FeaturedBadge>Featured</FeaturedBadge>
                      )}
                    </CardImageContainer>

                    <CardContent>
                      <Subtitle>
                        {listing.type} in {municipalityName}
                      </Subtitle>
                      <Price>{formatPrice(listing.price)}</Price>
                      <Title>{listing.title}</Title>
                      <InfoRow>
                        {listing.sizeM2} m²
                        {listing.bedrooms && ` · ${listing.bedrooms} bedrooms`}
                        {listing.bathrooms &&
                          ` · ${listing.bathrooms} bathrooms`}
                        {listing.floor &&
                          ` · Floor ${listing.floor}/${listing.totalFloors}`}
                      </InfoRow>
                      <Description>{listing.description}</Description>
                      <ContactRow>
                        <ContactButton>📞 View phone</ContactButton>
                        <ContactButton>💬 Contact</ContactButton>
                      </ContactRow>
                    </CardContent>
                  </PropertyCard>
                ))}
              </PropertiesList>
            ) : (
              <EmptyState>
                <EmptyTitle>No properties match your filters</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your filters to see more results
                </EmptyDescription>
                <ResetButton onClick={clearAllFilters}>
                  Reset filters
                </ResetButton>
              </EmptyState>
            )}
          </ListArea>
        </Main>
      </PageContent>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8f9;
`;

const PageContent = styled.div`
  position: relative;
`;

const MobileFilterBar = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 0.8rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 70px;
  z-index: 10;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #333;

  svg {
    color: #0c4240;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f7f9;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
  position: relative;

  svg {
    color: #0c4240;
  }

  &:active {
    background: #e9edf0;
  }
`;

const FilterBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #0c4240;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
`;

const Main = styled.div<{ mobileFiltersOpen: boolean }>`
  display: flex;
  padding: 2rem;
  gap: 2rem;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    transform: ${({ mobileFiltersOpen }) =>
      mobileFiltersOpen ? "translateX(0)" : "translateX(0)"};
  }
`;

const SidebarContainer = styled.div<{ mobileFiltersOpen: boolean }>`
  width: 300px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  height: fit-content;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 85%;
    max-width: 350px;
    z-index: 1000;
    border-radius: 0;
    transform: ${({ mobileFiltersOpen }) =>
      mobileFiltersOpen ? "translateX(0)" : "translateX(-100%)"};
  }
`;

const MobileFilterHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;

  @media (min-width: 769px) {
    display: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  margin-left: -0.5rem;
  cursor: pointer;
  color: #333;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;

  @media (min-width: 769px) {
    padding: 1.5rem 1.5rem 0;
    text-align: left;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #0c4240;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FiltersContent = styled.div`
  padding: 1.5rem;

  @media (max-width: 768px) {
    height: calc(100vh - 60px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
`;

const ApplyFilterButton = styled.button`
  display: none;
  width: 100%;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-weight: 600;
  margin-top: auto;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #143823;
  }

  @media (max-width: 768px) {
    display: block;
    position: sticky;
    bottom: 1.5rem;
    margin-top: 2rem;
  }
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  transition: opacity 0.3s, visibility 0.3s;
`;

const ListArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultsCount = styled.div`
  font-weight: 600;
  color: #333;
`;

const SortDropdown = styled.select`
  border: 1px solid #e0e0e0;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
`;

const PropertiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PropertyCard = styled.div`
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  width: 300px;
  height: 220px;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff9800 0%, #ff7300 100%);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
`;

const CardContent = styled.div`
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Subtitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.2rem;
`;

const Price = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.4rem;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #333;
`;

const InfoRow = styled.div`
  font-size: 0.9rem;
  color: #666;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const ContactRow = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
`;

const ContactButton = styled.button`
  background: none;
  border: none;
  color: #0c4240;
  cursor: pointer;
  padding: 0.3rem 0;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  margin: 2rem 0;
`;

const EmptyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const ResetButton = styled.button`
  background: #0c4240;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #143823;
  }
`;
