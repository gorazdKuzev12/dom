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
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import PropertyFilters from "../PropertyFilters";

// Define the Listing type based on your GraphQL schema
interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  size: number;
  rooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  type: string;
  transaction: string;
  images: string[];
  createdAt: string;
  cityId: string;
  municipalityId: string;
}

interface City {
  id: string;
  name_en: string;
  name_mk: string;
  name_sq: string;
  slug: string;
}

interface Municipality {
  id: string;
  name_en: string;
  name_mk: string;
  name_sq: string;
  isPopular?: boolean;
  averagePrice?: number;
  image?: string;
  propertyCount?: number;
}

interface ZoneListingsPageProps {
  listings: Listing[];
  municipalityName: string;
  municipalitySlug: string;
  citySlug: string;
  cities: City[];
  municipalities: Municipality[];
  // Pagination props
  currentPage: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
}

export default function ZoneListingsPage({
  listings,
  municipalityName,
  municipalitySlug,
  citySlug,
  cities,
  municipalities,
  currentPage,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  itemsPerPage,
}: ZoneListingsPageProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Listings');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Buy");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  console.log(municipalityName);
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
  
  console.log(citySlug);

  const handleListingClick = (listing: Listing) => {
    console.log(listing);

    console.log(citySlug);
    // Build the URL format: [locale]/[transaction]/[type]/[city]/[municipality]/listing/[listingId]
    const transaction = listing.transaction === 'SALE' ? 'buy' : 'rent';
    const propertyType = listing.type.toLowerCase().replace('_', '-'); // e.g., apartment (singular)
    const city = citySlug;
    const municipality = municipalitySlug; // Use the original slug, not the localized name
    console.log(municipality);
    const url = `/${locale}/${transaction}/${propertyType}/${city}/${municipality}/listing/${listing.id}`;
    console.log(url);
    router.push(url);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Pagination helper functions
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    if (page === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', page.toString());
    }
    router.push(url.pathname + url.search);
  };

  const getResultsCountText = () => {
    if (totalCount === 0) {
      return t('pagination.noResults', { municipality: municipalityName });
    } else if (totalCount === 1) {
      return t('pagination.singleResult', { municipality: municipalityName });
    } else if (totalPages <= 1) {
      return t('pagination.resultsCount', { 
        count: totalCount, 
        municipality: municipalityName,
        current: 1,
        total: 1
      });
    } else {
      return t('pagination.resultsCount', { 
        count: totalCount, 
        municipality: municipalityName,
        current: currentPage,
        total: totalPages
      });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers at a time
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
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
              <PropertyFilters 
                cities={cities}
                municipalities={municipalities}
                currentCitySlug={citySlug}
                currentMunicipalitySlug={municipalitySlug}
              />

              <ApplyFilterButton onClick={toggleMobileFilters}>
                Show {listings.length} properties
              </ApplyFilterButton>
            </FiltersContent>
          </SidebarContainer>

          {/* Main content area */}
          <ListArea>
            <ResultsHeader>
              <ResultsCount>
                {getResultsCountText()}
              </ResultsCount>
              <SortDropdown>
                <option>Newest first</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </SortDropdown>
            </ResultsHeader>

            {listings.length > 0 ? (
              <PropertiesList>
                {listings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    onClick={() => handleListingClick(listing)}
                  >
                    <CardImageContainer>
                      {listing.images && listing.images.length > 0 ? (
                        <CardImage src="/so.png" alt="Property placeholder" />
                      ) : (
                        <CardImage src="/so.png" alt="Property placeholder" />
                      )}
                    </CardImageContainer>

                    <CardContent>
                      <Subtitle>
                        {listing.type} in {municipalityName}
                      </Subtitle>
                      <Price>{formatPrice(listing.price)}</Price>
                      <Title>{listing.title}</Title>
                      <InfoRow>
                        {listing.size} m²
                        {listing.rooms && ` · ${listing.rooms} rooms`}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPreviousPage}
                >
                  {t('pagination.previous')}
                </PaginationButton>
                
                <PaginationNumbers>
                  {generatePageNumbers().map((pageNum) => (
                    <PageNumber
                      key={pageNum}
                      $active={pageNum === currentPage}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </PageNumber>
                  ))}
                </PaginationNumbers>
                
                <PaginationButton 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  {t('pagination.next')}
                </PaginationButton>
              </PaginationContainer>
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 2rem 0;
`;

const PaginationNumbers = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageNumber = styled.button<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ $active }) => ($active ? '#0c4240' : '#e0e0e0')};
  background: ${({ $active }) => ($active ? '#0c4240' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#333')};
  border-radius: 8px;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#143823' : '#f5f5f5')};
    border-color: #0c4240;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  background: white;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #0c4240;
    color: #0c4240;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: #f9f9f9;
  }
`;
