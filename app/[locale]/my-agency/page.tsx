"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiBriefcase, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiSettings, FiLogOut, FiCheck, FiEdit3 } from "react-icons/fi";
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";
import { useRouter } from "next/navigation";

interface AgencyData {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  zipCode: string;
  contactPerson: string;
  contactRole: string;
  agencySize: "SMALL" | "MEDIUM" | "LARGE";
  logo?: string;
  description: string;
  specializations: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function MyAgencyPage() {
  const router = useRouter();
  const [agencyData, setAgencyData] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('agencyToken') || sessionStorage.getItem('agencyToken');
      const storedAgencyData = localStorage.getItem('agencyData') || sessionStorage.getItem('agencyData');
      
      if (!token || !storedAgencyData) {
        // Not logged in, redirect to login
        router.push('/agency-login');
        return;
      }

      try {
        const parsedData = JSON.parse(storedAgencyData);
        setAgencyData(parsedData);
      } catch (error) {
        console.error('Error parsing agency data:', error);
        router.push('/agency-login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('agencyToken');
    localStorage.removeItem('agencyData');
    sessionStorage.removeItem('agencyToken');
    sessionStorage.removeItem('agencyData');
    router.push('/agency-login');
  };

  if (loading) {
    return (
      <PageWrapper>
        <Menu />
        <LoadingContainer>
          <LoadingText>Loading your agency dashboard...</LoadingText>
        </LoadingContainer>
        <Footer />
      </PageWrapper>
    );
  }

  if (!agencyData) {
    return null; // Will redirect to login
  }

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <DashboardHeader>
          <HeaderContent>
            <AgencyLogo>
              {agencyData.logo ? (
                <LogoImage src={agencyData.logo} alt={agencyData.companyName} />
              ) : (
                <LogoPlaceholder>
                  <FiBriefcase size={40} />
                </LogoPlaceholder>
              )}
            </AgencyLogo>
            <AgencyInfo>
              <AgencyName>
                {agencyData.companyName}
                {agencyData.isVerified && (
                  <VerificationBadge>
                    <FiCheck size={16} />
                    Verified
                  </VerificationBadge>
                )}
              </AgencyName>
              <AgencyDetails>
                <DetailItem>
                  <FiUser size={14} />
                  {agencyData.contactPerson} - {agencyData.contactRole}
                </DetailItem>
                <DetailItem>
                  <FiMail size={14} />
                  {agencyData.email}
                </DetailItem>
                <DetailItem>
                  <FiPhone size={14} />
                  {agencyData.phone}
                </DetailItem>
                <DetailItem>
                  <FiMapPin size={14} />
                  {agencyData.address}, {agencyData.city} {agencyData.zipCode}
                </DetailItem>
                {agencyData.website && (
                  <DetailItem>
                    <FiGlobe size={14} />
                    <WebsiteLink href={agencyData.website} target="_blank" rel="noopener noreferrer">
                      {agencyData.website}
                    </WebsiteLink>
                  </DetailItem>
                )}
              </AgencyDetails>
            </AgencyInfo>
            <HeaderActions>
              <ActionButton>
                <FiEdit3 size={16} />
                Edit Profile
              </ActionButton>
              <ActionButton>
                <FiSettings size={16} />
                Settings
              </ActionButton>
              <LogoutButton onClick={handleLogout}>
                <FiLogOut size={16} />
                Logout
              </LogoutButton>
            </HeaderActions>
          </HeaderContent>
        </DashboardHeader>

        <DashboardBody>
          <StatsGrid>
            <StatCard>
              <StatLabel>Agency Size</StatLabel>
              <StatValue>
                {agencyData.agencySize === 'SMALL' ? 'Small' : 
                 agencyData.agencySize === 'MEDIUM' ? 'Medium' : 'Large'}
              </StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Specializations</StatLabel>
              <StatValue>{agencyData.specializations.length}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Status</StatLabel>
              <StatValue style={{ color: agencyData.isActive ? '#10b981' : '#ef4444' }}>
                {agencyData.isActive ? 'Active' : 'Inactive'}
              </StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Member Since</StatLabel>
              <StatValue>
                {new Date(agencyData.createdAt).toLocaleDateString()}
              </StatValue>
            </StatCard>
          </StatsGrid>

          <ContentGrid>
            <ContentCard>
              <CardHeader>
                <CardTitle>About Agency</CardTitle>
              </CardHeader>
              <CardContent>
                <Description>{agencyData.description}</Description>
              </CardContent>
            </ContentCard>

            <ContentCard>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <SpecializationGrid>
                  {agencyData.specializations.map((spec, index) => (
                    <SpecializationTag key={index}>
                      {spec}
                    </SpecializationTag>
                  ))}
                </SpecializationGrid>
              </CardContent>
            </ContentCard>

            <ContentCard>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActionGrid>
                  <QuickActionButton>
                    <FiBriefcase size={20} />
                    <span>Manage Listings</span>
                  </QuickActionButton>
                  <QuickActionButton>
                    <FiUser size={20} />
                    <span>View Profile</span>
                  </QuickActionButton>
                  <QuickActionButton>
                    <FiSettings size={20} />
                    <span>Account Settings</span>
                  </QuickActionButton>
                  <QuickActionButton>
                    <FiMail size={20} />
                    <span>Contact Support</span>
                  </QuickActionButton>
                </QuickActionGrid>
              </CardContent>
            </ContentCard>
          </ContentGrid>
        </DashboardBody>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  color: #666;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const DashboardHeader = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }
`;

const AgencyLogo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e1e5e9;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LogoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #f5f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0c4240;
`;

const AgencyInfo = styled.div`
  flex: 1;
`;

const AgencyName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    justify-content: center;
  }
`;

const VerificationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #d4edda;
  color: #155724;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const AgencyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  svg {
    color: #0c4240;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const WebsiteLink = styled.a`
  color: #0c4240;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: #f5f9f9;
  color: #0c4240;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e7f1f1;
    transform: translateY(-1px);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fecaca;
    color: #b91c1c;
    transform: translateY(-1px);
  }
`;

const DashboardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #0c4240;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 0;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const SpecializationGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SpecializationTag = styled.span`
  background: #f5f9f9;
  color: #0c4240;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const QuickActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const QuickActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f5f9f9;
  color: #0c4240;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e7f1f1;
    transform: translateY(-2px);
  }

  span {
    text-align: center;
  }
`; 