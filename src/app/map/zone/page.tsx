// Combines layout from MapPage + ZonePage with styled cards like Idealista

"use client";

import { useState } from "react";
import styled from "styled-components";
import { FiSearch, FiMapPin, FiMenu, FiUser, FiX } from "react-icons/fi";
import { BiSolidBuildingHouse } from "react-icons/bi";
import Menu from "@/components/Menu/page";

export default function ZoneListingsPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Buy");

  return (
    <Wrapper>
      <Menu />
      

      <Main>
        <Sidebar>
          <FilterTitle>Filters</FilterTitle>
          <Select>
            <option>All</option>
            <option>Offices</option>
            <option>Apartments</option>
          </Select>
          <Input type="number" placeholder="Min price" />
          <Input type="number" placeholder="Max price" />
          <Input type="number" placeholder="Min size (m²)" />
          <Input type="number" placeholder="Max size (m²)" />
        </Sidebar>

        <ListArea>
          {[1, 2, 3, 4].map((i) => (
            <PropertyCard key={i}>
              <CardImage src="/so.png" alt="property" />
              <CardContent>
                <Subtitle>
                  {
                    [
                      "Office on Aragó Street, La Dreta de l'Eixample",
                      "Office on Passeig de Gràcia, Eixample",
                      "Apartment in Karpoš",
                      "Office for Rent in Gazi Baba",
                    ][i - 1]
                  }
                </Subtitle>
                <Price>€{[700000, 1990000, 250000, 1200][i - 1]}</Price>
                <Title>
                  {
                    [
                      "Office in Centar, Skopje",
                      "Luxury Office in Aerodrom",
                      "Apartment in Karpoš",
                      "Rental Office in Gazi Baba",
                    ][i - 1]
                  }
                </Title>
                <InfoRow>
                  {
                    [
                      "440 m² · 1.591 €/m²",
                      "250 m² · 7.960 €/m²",
                      "70 m²",
                      "55 m²/mo",
                    ][i - 1]
                  }
                </InfoRow>
                <Description>
                  {
                    [
                      "Spacious office for sale in a prime location in Skopje, with independent entrance and excellent visibility.",
                      "Elegant office in the most exclusive zone of Skopje, ideal for luxury businesses.",
                      "Bright apartment in a central area close to all amenities.",
                      "Modern rental office ideal for startups or small businesses in Gazi Baba.",
                    ][i - 1]
                  }
                </Description>
                <ContactRow>
                  <a>📞 View phone</a>
                  <a>💬 Contact</a>
                </ContactRow>
              </CardContent>
            </PropertyCard>
          ))}
        </ListArea>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8f9;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.a`
  font-size: 1.8rem;
  font-weight: 700;
  color: #222;
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

interface NavItemProps {
  active: boolean;
}

const NavItem = styled.button<NavItemProps>`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#222" : "#666")};
  cursor: pointer;
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  color: #222;
  font-weight: 500;
  cursor: pointer;
`;

const LanguageSelector = styled.select`
  border: none;
  background: none;
  font-size: 0.9rem;
  color: #222;
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #222;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1rem;
`;

interface MobileNavItemProps {
  active: boolean;
}

const MobileNavItem = styled.button<MobileNavItemProps>`
  background: none;
  border: none;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: ${(props) => (props.active ? "#222" : "#666")};
`;

const MobileLanguageSelector = styled.select`
  margin: 0.75rem 1rem;
  padding: 0.5rem;
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
`;

const CardImage = styled.img`
  width: 280px;
  height: auto;
  object-fit: cover;
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
`;

const ContactRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #0070f3;
`;
