"use client";

import { useState } from "react";
import styled from "styled-components";
import { FiSearch, FiMapPin, FiMenu, FiUser, FiX } from "react-icons/fi";
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
  const [activeFilter, setActiveFilter] = useState("Buy");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [propertyType, setPropertyType] = useState("All");

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
    router.push(`/${locale}/property/${id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <Wrapper>
      <Menu />

      <Main>
        <Sidebar>
          <FilterTitle>Filters</FilterTitle>
          <PropertyFilters />
        </Sidebar>

        <ListArea>
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
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
                  {listing.featured && <FeaturedBadge>Featured</FeaturedBadge>}
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
                    {listing.bathrooms && ` · ${listing.bathrooms} bathrooms`}
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
            ))
          ) : (
            <EmptyState>
              <EmptyTitle>No properties match your filters</EmptyTitle>
              <EmptyDescription>
                Try adjusting your filters to see more results
              </EmptyDescription>
            </EmptyState>
          )}
        </ListArea>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8f9;
`;

const ZoneTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
`;

const ListingCount = styled.span`
  color: #666;
  font-size: 0.9rem;
  margin-left: auto;
`;

const Main = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  height: fit-content;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const FilterCount = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 1rem;
  text-align: center;
`;

const ListArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  width: 280px;
  height: 210px;

  @media (max-width: 768px) {
    width: 100%;
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
  background: #ff9800;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 1rem;
  flex: 1;
`;

const Subtitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #888;
  margin-bottom: 0.2rem;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.4rem;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 0.4rem;
`;

const InfoRow = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #444;
  margin-top: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContactRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
`;

const ContactButton = styled.button`
  background: none;
  border: none;
  color: #0070f3;
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
`;

const EmptyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
`;
