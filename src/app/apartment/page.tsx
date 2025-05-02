"use client";

import styled from "styled-components";
import { useState } from "react";
import {
  Heart,
  Trash2,
  Share,
  MapPin,
  X,
  Home,
  Key,
  DollarSign,
  Square,
  Calendar,
  Eye,
  Info,
  Star,
  Maximize2,
  Grid,
  Coffee,
  Wind,
} from "lucide-react";
import Menu from "@/components/Menu/page";

export default function ApartmentPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Wrapper>
      <Menu />

      <Gallery>
        <ImageGrid>
          <MainImage src="/so.png" />
          <SubImagesGrid>
            <SubImage src="/so.png" />
            <SubImage src="/so.png" />
            <SubImage src="/so.png" />
            <SubImage src="/so.png" overlay>
              <SeeMoreOverlay>
                <Grid size={20} />
                <span>See all 7 photos</span>
              </SeeMoreOverlay>
            </SubImage>
          </SubImagesGrid>
        </ImageGrid>
      </Gallery>

      <ContentContainer>
        <MainContent>
          <Section>
            <Header>
              <Title>Office for rent in Ronda de Sant Pere</Title>
              <Subtitle>
                <MapPin size={16} /> La Dreta de l'Eixample, Barcelona
              </Subtitle>
              <Price>
                €2,880<span>/month</span>
              </Price>
              <PriceDetail>
                <Badge>
                  <Maximize2 size={14} /> 144 m²
                </Badge>
                <Badge>
                  <DollarSign size={14} /> 20.00 €/m²
                </Badge>
              </PriceDetail>
            </Header>
            <ButtonRow>
              <ActionButton primary={saved} onClick={() => setSaved(!saved)}>
                <Heart
                  size={18}
                  fill={saved ? "white" : "none"}
                  color={saved ? "white" : "currentColor"}
                />
                {saved ? "Saved" : "Save"}
              </ActionButton>
              <ActionButton>
                <Trash2 size={18} /> Discard
              </ActionButton>
              <ActionButton>
                <Share size={18} /> Share
              </ActionButton>
            </ButtonRow>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>
              <Info size={18} />
              Property description
            </SectionTitle>
            <Description>
              Office building located in the Eixample district, right on Plaça
              Urquinaona, very close to Plaça Catalunya. In a fully consolidated
              area with all types of services.
              <br />
              <br />
              Office for rent in Eixample Dret in an exclusive, modern office
              building with concierge service, two elevators, and a freight
              elevator.
              <br />
              <br />
              High-quality, fully renovated offices. Configured as an open, very
              bright space.
            </Description>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>
              <Star size={18} />
              Basic features
            </SectionTitle>
            <FeatureGrid>
              <FeatureItem>
                <Square size={16} />
                <span>144 m² built</span>
              </FeatureItem>
              <FeatureItem>
                <Grid size={16} />
                <span>Open-plan layout</span>
              </FeatureItem>
              <FeatureItem>
                <Home size={16} />
                <span>2 bathrooms outside the office</span>
              </FeatureItem>
              <FeatureItem>
                <Info size={16} />
                <span>Second-hand/good condition</span>
              </FeatureItem>
              <FeatureItem>
                <MapPin size={16} />
                <span>8th floor exterior</span>
              </FeatureItem>
              <FeatureItem>
                <Maximize2 size={16} />
                <span>Building of 8 floors</span>
              </FeatureItem>
              <FeatureItem>
                <Square size={16} />
                <span>3 lifts</span>
              </FeatureItem>
            </FeatureGrid>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>
              <Coffee size={18} />
              Amenities
            </SectionTitle>
            <FeatureGrid>
              <FeatureItem>
                <Wind size={16} />
                <span>Heating</span>
              </FeatureItem>
              <FeatureItem>
                <Coffee size={16} />
                <span>Hot water</span>
              </FeatureItem>
              <FeatureItem>
                <Wind size={16} />
                <span>Air conditioning</span>
              </FeatureItem>
              <FeatureItem>
                <Square size={16} />
                <span>Suspended ceiling</span>
              </FeatureItem>
              <FeatureItem>
                <Square size={16} />
                <span>Windows with double glazing</span>
              </FeatureItem>
            </FeatureGrid>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>
              <Grid size={18} />
              Floor Plan
            </SectionTitle>
            <FloorPlan src="/floorplan.png" alt="Floor plan" />
          </Section>

          <Divider />

          <Section>
            <SectionTitle>
              <MapPin size={18} />
              Location
            </SectionTitle>
            <MapContainer>
              <MapPlaceholder>
                <MapPin size={24} />
                Map loading...
              </MapPlaceholder>
              <MapAddress>
                <strong>La Dreta de l'Eixample</strong>
                <p>Ronda de Sant Pere, Barcelona 08010</p>
              </MapAddress>
            </MapContainer>
          </Section>
        </MainContent>

        <Sidebar>
          <ContactCard>
            <ContactTitle>Contact agent</ContactTitle>
            <AgentInfo>
              <AgentPhoto src="/agent.png" alt="Real estate agent" />
              <AgentDetails>
                <AgentName>Maria Garcia</AgentName>
                <AgentCompany>Barcelona Properties</AgentCompany>
              </AgentDetails>
            </AgentInfo>
            <ContactButton>Message</ContactButton>
            <ContactButton secondary>Call +34 93 123 4567</ContactButton>
          </ContactCard>

          <StatsCard>
            <StatItem>
              <Calendar size={16} />
              <span>Listed on April 30, 2025</span>
            </StatItem>
            <StatItem>
              <Eye size={16} />
              <span>93 people viewed this property</span>
            </StatItem>
          </StatsCard>
        </Sidebar>
      </ContentContainer>

      <Footer>
        <FooterContent>
          <FooterLogo>
            <Home size={16} />
            <span>dom.mk</span>
          </FooterLogo>
          <FooterLinks>
            <FooterLink>About</FooterLink>
            <FooterLink>Terms</FooterLink>
            <FooterLink>Privacy</FooterLink>
            <FooterLink>Contact</FooterLink>
          </FooterLinks>
          <FooterCopyright>© 2025 dom.mk. All rights reserved.</FooterCopyright>
        </FooterContent>
      </Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #f8f9fa;
  font-family: "Inter", "Segoe UI", sans-serif;
  color: #333;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #0066ff;
    background: #f0f7ff;
  }
`;

const MenuRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LangSelect = styled.select`
  border: none;
  font-size: 0.9rem;
  background: none;
  color: #444;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const MenuToggle = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;

  &:hover {
    background: #f5f5f5;
  }
`;

const Gallery = styled.div`
  padding: 1.5rem;
  background: white;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.75rem;
  height: 450px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const SubImagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SubImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  ${(props) =>
    props.overlay &&
    `
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 8px;
    }
  `}
`;

const SeeMoreOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
  gap: 0.5rem;
  cursor: pointer;

  span {
    font-weight: 500;
  }
`;

const ContentContainer = styled.div`
  max-width: 1201px;
  margin: 0 auto;
  padding: 0 1.5rem;

  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-top: 12rem;
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 11px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-row: 1;
  }
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const AgentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AgentPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
`;

const AgentDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AgentName = styled.div`
  font-weight: 600;
`;

const AgentCompany = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ContactButton = styled.button`
  background: ${(props) => (props.secondary ? "white" : "#27795b")};
  color: ${(props) => (props.secondary ? "#27795b" : "white")};
  border: ${(props) => (props.secondary ? "1px solid #27795b" : "none")};
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.secondary ? "#eef5ff" : "#0052cc")};
  }
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #555;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Section = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #222;
`;

const Subtitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const Price = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #000000;

  span {
    font-size: 1.1rem;
    font-weight: 500;
    color: #666;
  }
`;

const PriceDetail = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #90f8d22d;
  color: #000000;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #eee;
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ActionButton = styled.button`
  background: ${(props) => (props.primary ? "#3c3c3c" : "#f5f5f5")};
  color: ${(props) => (props.primary ? "white" : "#444")};
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.primary ? "#0052cc" : "#e9e9e9")};
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #222;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin: 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #444;
  font-size: 0.95rem;
`;

const FloorPlan = styled.img`
  width: 100%;
  max-width: 700px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 250px;
  background: #eef2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #666;
  gap: 0.5rem;
`;

const MapAddress = styled.div`
  font-size: 0.95rem;

  p {
    color: #666;
    margin: 0.3rem 0 0 0;
  }
`;

const Footer = styled.footer`
  background: white;
  margin-top: 3rem;
  padding: 2rem 0;
  border-top: 1px solid #eee;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const FooterLogo = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled.a`
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    color: #0066ff;
  }
`;

const FooterCopyright = styled.div`
  font-size: 0.85rem;
  color: #777;
`;
