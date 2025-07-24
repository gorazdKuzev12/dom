"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { FiBriefcase, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiSettings, FiLogOut, FiCheck, FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { GET_AGENCY } from "@/lib/queries";

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

interface MyAgencyClientProps {
  agencyData?: AgencyData | null;
  isAuthenticated?: boolean;
}

export default function MyAgencyClient({ agencyData: initialAgencyData, isAuthenticated: initialAuth }: MyAgencyClientProps) {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(initialAgencyData?.id || null);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth || false);

  // Only check localStorage authentication if no server data provided
  useEffect(() => {
    // If we already have server-provided data, don't check localStorage
    if (initialAgencyData && initialAuth) {
      return;
    }

    const checkAuth = () => {
      const token = localStorage.getItem('agencyToken') || sessionStorage.getItem('agencyToken');
      
      if (!token) {
        router.push('/agency-login');
        return;
      }

      try {
        // Decode JWT token to get agency ID (basic decode, not verification - server will verify)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if token is expired
        if (payload.exp && payload.exp < Date.now() / 1000) {
          // Token expired, redirect to login
          localStorage.removeItem('agencyToken');
          localStorage.removeItem('agencyData');
          sessionStorage.removeItem('agencyToken');
          sessionStorage.removeItem('agencyData');
          router.push('/agency-login');
          return;
        }

        setAgencyId(payload.agencyId);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        // Clear invalid tokens
        localStorage.removeItem('agencyToken');
        localStorage.removeItem('agencyData');
        sessionStorage.removeItem('agencyToken');
        sessionStorage.removeItem('agencyData');
        router.push('/agency-login');
      }
    };

    checkAuth();
  }, [router, initialAgencyData, initialAuth]);

  // Fetch fresh agency data from server (only if not provided by server)
  const shouldFetchFromClient = !initialAgencyData && agencyId && isAuthenticated;
  
  const { data, loading, error, refetch } = useQuery(GET_AGENCY, {
    variables: { id: agencyId },
    skip: !shouldFetchFromClient,
    errorPolicy: 'all',
    onError: (error) => {
      // Handle authentication errors
      if (error.message.includes('Authentication required') || 
          error.message.includes('Access denied') ||
          error.message.includes('jwt expired')) {
        // Clear tokens and redirect to login
        localStorage.removeItem('agencyToken');
        localStorage.removeItem('agencyData');
        sessionStorage.removeItem('agencyToken');
        sessionStorage.removeItem('agencyData');
        router.push('/agency-login');
      }
    }
  });

  const handleLogout = async () => {
    setLogoutLoading(true);
    
    // Clear client-side storage
    localStorage.removeItem('agencyToken');
    localStorage.removeItem('agencyData');
    sessionStorage.removeItem('agencyToken');
    sessionStorage.removeItem('agencyData');
    
    // Clear server-side HTTP-only cookie by making a request
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies
      });
    } catch (error) {
      console.error('Error clearing server-side session:', error);
    }
    
    router.push('/agency-login');
  };

  // Show loading state only if we're fetching from client and don't have server data
  if (shouldFetchFromClient && loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading your agency dashboard...</LoadingText>
      </LoadingContainer>
    );
  }

  // Handle error state (only for client-side fetching)
  if (shouldFetchFromClient && error) {
    return (
      <LoadingContainer>
        <ErrorContainer>
          <ErrorText>Error loading agency data</ErrorText>
          <ErrorText style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            {error.message}
          </ErrorText>
          <RetryButton onClick={() => refetch()}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      </LoadingContainer>
    );
  }

  // Use server-provided data first, then client-fetched data
  const agencyData = initialAgencyData || data?.agency;

  // If we have no authentication or no data at all, show error
  if (!isAuthenticated || !agencyData) {
    return (
      <LoadingContainer>
        <LoadingText>
          {!isAuthenticated ? 'Authentication required' : 'Agency data not found'}
        </LoadingText>
      </LoadingContainer>
    );
  }

  return (
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
            <LogoutButton onClick={handleLogout} disabled={logoutLoading}>
              <FiLogOut size={16} />
              {logoutLoading ? 'Logging out...' : 'Logout'}
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
                {agencyData.specializations.map((spec: string, index: number) => (
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
  );
}

const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const ErrorText = styled.div`
  font-size: 1.1rem;
  color: #dc2626;
  font-weight: 500;
`;

const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #065f46;
    transform: translateY(-1px);
  }
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

  &:hover:not(:disabled) {
    background: #fecaca;
    color: #b91c1c;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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