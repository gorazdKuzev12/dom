"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiHome, FiHeart, FiMapPin, FiMaximize2, FiDollarSign } from "react-icons/fi";
import Menu from "@/components/Menu/page";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Apartment {
  id: string;
  title: string;
  location: string;
  price: string;
  currency: string;
  period: string;
  size: string;
  pricePerMeter: string;
  image: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Apartment[]>([]);
  const router = useRouter();
  const t = useTranslations("Favorites");

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      }
    };

    loadFavorites();

    // Listen for storage events (updates from other tabs)
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  const removeFavorite = (id: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <Wrapper>
      <Menu />
      <Container>
        <Header>
          <Title>
            <FiHeart size={24} />
            {t("savedProperties")}
          </Title>
          <Subtitle>{t("savedPropertiesDesc")}</Subtitle>
        </Header>

        {favorites.length === 0 ? (
          <EmptyState>
            <FiHeart size={48} />
            <h3>{t("noSavedProperties")}</h3>
            <p>{t("startSaving")}</p>
          </EmptyState>
        ) : (
          <Grid>
            {favorites.map((property) => (
              <PropertyCard key={property.id}>
                <ImageContainer>
                  <PropertyImage src={property.image} alt={property.title} />
                  <RemoveButton onClick={() => removeFavorite(property.id)}>
                    <FiHeart size={18} fill="white" />
                  </RemoveButton>
                </ImageContainer>
                <CardContent onClick={() => router.push(`/apartment/${property.id}`)}>
                  <PropertyTitle>{property.title}</PropertyTitle>
                  <Location>
                    <FiMapPin size={14} />
                    {property.location}
                  </Location>
                  <Price>
                    {property.currency}{property.price}
                    <Period>/{property.period}</Period>
                  </Price>
                  <Details>
                    <DetailItem>
                      <FiMaximize2 size={14} />
                      {property.size} m²
                    </DetailItem>
                    <DetailItem>
                      <FiDollarSign size={14} />
                      {property.pricePerMeter} €/m²
                    </DetailItem>
                  </Details>
                </CardContent>
              </PropertyCard>
            ))}
          </Grid>
        )}
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #0c4240;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  svg {
    color: #0c4240;
    opacity: 0.5;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.2rem;
    color: #333;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #666;
    margin: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const PropertyCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const CardContent = styled.div`
  padding: 1rem;
  cursor: pointer;
`;

const PropertyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
`;

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0c4240;
  margin-bottom: 0.5rem;
`;

const Period = styled.span`
  font-size: 0.9rem;
  font-weight: 400;
  color: #666;
`;

const Details = styled.div`
  display: flex;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #666;
  font-size: 0.9rem;
`; 