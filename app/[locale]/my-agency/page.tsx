"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  FileText,
  Grid,
  List,
  Edit,
  Trash2,
  Plus,
  Home,
} from "lucide-react";
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";

// Mock data - replace with actual API calls
const mockAgencyData = {
  name: "Real Estate Pro",
  email: "contact@realestateagency.com",
  phone: "+389 70 123 456",
  website: "www.realestateagency.com",
  address: "Skopje City Center, 1000 Skopje",
  size: "Medium (6-20 agents)",
  description: "Leading real estate agency with over 10 years of experience in the market.",
  logo: "/agency-logo.png", // Add your logo path
};

const mockProperties = [
  {
    id: 1,
    title: "Modern Apartment in Center",
    type: "apartment",
    price: "150,000",
    size: "85",
    location: "Center, Skopje",
    status: "active",
    image: "/property1.jpg",
  },
  // Add more mock properties as needed
];

interface Property {
  id: number;
  title: string;
  type: string;
  price: string;
  size: string;
  location: string;
  status: string;
  image: string;
}

export default function MyAgencyPage() {
  const t = useTranslations("MyAgency");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <Header>
          <Title>
            <Building2 size={24} /> {t("title")}
          </Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Header>

        <ContentContainer>
          {/* Agency Information Card */}
          <AgencyCard>
            <AgencyHeader>
              <AgencyInfo>
                <AgencyName>{mockAgencyData.name}</AgencyName>
                <AgencyMeta>
                  <MetaItem>
                    <Mail size={16} />
                    {mockAgencyData.email}
                  </MetaItem>
                  <MetaItem>
                    <Phone size={16} />
                    {mockAgencyData.phone}
                  </MetaItem>
                  <MetaItem>
                    <Globe size={16} />
                    {mockAgencyData.website}
                  </MetaItem>
                  <MetaItem>
                    <MapPin size={16} />
                    {mockAgencyData.address}
                  </MetaItem>
                  <MetaItem>
                    <Users size={16} />
                    {mockAgencyData.size}
                  </MetaItem>
                </AgencyMeta>
              </AgencyInfo>
              <EditButton>
                <Edit size={16} /> {t("editProfile")}
              </EditButton>
            </AgencyHeader>
            <AgencyDescription>
              <FileText size={16} />
              {mockAgencyData.description}
            </AgencyDescription>
          </AgencyCard>

          {/* Properties Section */}
          <PropertiesSection>
            <SectionHeader>
              <div>
                <SectionTitle>{t("properties.title")}</SectionTitle>
                <SectionSubtitle>{t("properties.subtitle")}</SectionSubtitle>
              </div>
              <HeaderActions>
                <ViewToggle>
                  <ViewButton
                    active={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid size={16} />
                  </ViewButton>
                  <ViewButton
                    active={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                  >
                    <List size={16} />
                  </ViewButton>
                </ViewToggle>
                <AddPropertyButton>
                  <Plus size={16} /> {t("properties.addNew")}
                </AddPropertyButton>
              </HeaderActions>
            </SectionHeader>

            <PropertiesGrid viewMode={viewMode}>
              {mockProperties.map((property) => (
                <PropertyCard key={property.id} viewMode={viewMode}>
                  <PropertyImage src={property.image} alt={property.title} />
                  <PropertyContent>
                    <PropertyTitle>{property.title}</PropertyTitle>
                    <PropertyDetails>
                      <PropertyDetail>
                        <Home size={14} />
                        {property.type}
                      </PropertyDetail>
                      <PropertyDetail>
                        <MapPin size={14} />
                        {property.location}
                      </PropertyDetail>
                      <PropertyPrice>€{property.price}</PropertyPrice>
                      <PropertySize>{property.size} m²</PropertySize>
                    </PropertyDetails>
                    <PropertyActions>
                      <ActionButton>
                        <Edit size={14} /> {t("properties.edit")}
                      </ActionButton>
                      <ActionButton danger>
                        <Trash2 size={14} /> {t("properties.delete")}
                      </ActionButton>
                    </PropertyActions>
                  </PropertyContent>
                </PropertyCard>
              ))}
            </PropertiesGrid>
          </PropertiesSection>
        </ContentContainer>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const MainContent = styled.main`
  padding: 2rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    color: #0c4240;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AgencyCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const AgencyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const AgencyInfo = styled.div`
  flex: 1;
`;

const AgencyName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 1rem 0;
`;

const AgencyMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;

  svg {
    color: #0c4240;
  }
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f5f9f9;
  color: #0c4240;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e7f1f1;
    transform: translateY(-1px);
  }
`;

const AgencyDescription = styled.p`
  color: #666;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;

  svg {
    color: #0c4240;
    margin-top: 4px;
  }
`;

const PropertiesSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  background: #f5f9f9;
  border-radius: 6px;
  padding: 0.25rem;
`;

const ViewButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: ${props => props.active ? "#0c4240" : "transparent"};
  color: ${props => props.active ? "white" : "#0c4240"};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? "#0c4240" : "#e7f1f1"};
  }
`;

const AddPropertyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0a3533;
    transform: translateY(-1px);
  }
`;

const PropertiesGrid = styled.div<{ viewMode: "grid" | "list" }>`
  display: grid;
  grid-template-columns: ${props => props.viewMode === "grid" ? "repeat(auto-fill, minmax(300px, 1fr))" : "1fr"};
  gap: 1.5rem;
`;

const PropertyCard = styled.div<{ viewMode: "grid" | "list" }>`
  background: white;
  border: 1px solid #e1e5eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  display: ${props => props.viewMode === "list" ? "flex" : "block"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PropertyContent = styled.div`
  padding: 1.5rem;
`;

const PropertyTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 1rem 0;
`;

const PropertyDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PropertyDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  svg {
    color: #0c4240;
  }
`;

const PropertyPrice = styled.div`
  font-weight: 600;
  color: #0c4240;
  font-size: 1.1rem;
`;

const PropertySize = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e5eb;
`;

const ActionButton = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.danger ? "#fee2e2" : "#f5f9f9"};
  color: ${props => props.danger ? "#dc2626" : "#0c4240"};
  border: 1px solid ${props => props.danger ? "#fecaca" : "#e1e5eb"};
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.danger ? "#fecaca" : "#e7f1f1"};
    transform: translateY(-1px);
  }
`; 