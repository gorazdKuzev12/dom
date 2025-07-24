"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FiBriefcase, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiSettings, FiLogOut, FiCheck, FiEdit3, FiEye, FiTrash2, FiPlus, FiHome, FiCalendar, FiX, FiSave } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { GET_AGENCY, UPDATE_AGENCY } from "@/lib/queries";

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

interface AgencyListing {
  id: string;
  title: string;
  description?: string;
  type: string;
  transaction: string;
  price: number;
  size: number;
  condition: string;
  floor?: number;
  totalFloors?: number;
  rooms?: number;
  bathrooms?: number;
  amenities: string[];
  address?: string;
  images: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  bookingNumber?: string;
  createdAt: string;
  expiresAt: string;
  city: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
    slug: string;
  };
  municipality?: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
    isPopular: boolean;
    averagePrice?: number;
    image?: string;
  };
  isAgencyListing: boolean;
}

interface MyAgencyClientProps {
  agencyData?: AgencyData | null;
  agencyListings?: AgencyListing[];
  isAuthenticated?: boolean;
}

export default function MyAgencyClient({ agencyData: initialAgencyData, agencyListings: initialListings, isAuthenticated: initialAuth }: MyAgencyClientProps) {
  const t = useTranslations('MyAgency');
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [agencyId, setAgencyId] = useState<string | null>(initialAgencyData?.id || null);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth || false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

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

  // Update agency mutation
  const [updateAgency] = useMutation(UPDATE_AGENCY, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Update agency error:', error);
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

  const handleEditProfile = () => {
    if (agencyData) {
      setEditFormData({
        companyName: agencyData.companyName,
        phone: agencyData.phone,
        website: agencyData.website || '',
        address: agencyData.address,
        city: agencyData.city,
        zipCode: agencyData.zipCode,
        contactPerson: agencyData.contactPerson,
        contactRole: agencyData.contactRole,
        agencySize: agencyData.agencySize,
        logo: agencyData.logo || '',
        description: agencyData.description,
        specializations: agencyData.specializations
      });
      setShowEditModal(true);
    }
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateAgency = async () => {
    if (!agencyData?.id || !editFormData) return;

    setUpdateLoading(true);
    try {
      const result = await updateAgency({
        variables: {
          id: agencyData.id,
          input: editFormData
        }
      });

      if (result.data?.updateAgency) {
        // Update localStorage/sessionStorage with new data
        const updatedAgency = result.data.updateAgency;
        const token = localStorage.getItem('agencyToken') || sessionStorage.getItem('agencyToken');
        
        if (localStorage.getItem('agencyToken')) {
          localStorage.setItem('agencyData', JSON.stringify(updatedAgency));
        } else if (sessionStorage.getItem('agencyToken')) {
          sessionStorage.setItem('agencyData', JSON.stringify(updatedAgency));
        }

        setShowEditModal(false);
        setEditFormData(null);
        
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating agency:', error);
    } finally {
      setUpdateLoading(false);
    }
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
            <ActionButton onClick={handleEditProfile}>
              <FiEdit3 size={16} />
              {t('editProfile')}
            </ActionButton>
            <ActionButton>
              <FiSettings size={16} />
              {t('settings')}
            </ActionButton>
            <LogoutButton onClick={handleLogout} disabled={logoutLoading}>
              <FiLogOut size={16} />
              {logoutLoading ? t('loggingOut') : t('logout')}
            </LogoutButton>
          </HeaderActions>
        </HeaderContent>
      </DashboardHeader>

      <DashboardBody>
        <StatsGrid>
          <StatCard>
            <StatLabel>{t('stats.activeListings')}</StatLabel>
            <StatValue>{initialListings?.length || 0}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>{t('stats.agencySize')}</StatLabel>
            <StatValue>
              {agencyData.agencySize === 'SMALL' ? t('sizes.small') : 
               agencyData.agencySize === 'MEDIUM' ? t('sizes.medium') : t('sizes.large')}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>{t('stats.specializations')}</StatLabel>
            <StatValue>{agencyData.specializations.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>{t('stats.status')}</StatLabel>
            <StatValue style={{ color: agencyData.isActive ? '#10b981' : '#ef4444' }}>
              {agencyData.isActive ? t('stats.active') : t('stats.inactive')}
            </StatValue>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <ContentCard>
            <CardHeader>
              <CardTitle>{t('sections.aboutAgency')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Description>{agencyData.description}</Description>
            </CardContent>
          </ContentCard>

          <ContentCard>
            <CardHeader>
              <CardTitle>{t('stats.specializations')}</CardTitle>
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


        </ContentGrid>

        {/* Agency Listings Section */}
        <ListingsSection>
          <ListingsHeader>
            <ListingsTitle>
              <FiHome size={24} />
              {t('sections.yourListings')} ({initialListings?.length || 0})
            </ListingsTitle>
            <AddListingButton href="/post-property">
              <FiPlus size={16} />
              {t('sections.addNewListing')}
            </AddListingButton>
          </ListingsHeader>

          {initialListings && initialListings.length > 0 ? (
            <ListingsGrid>
              {initialListings.map((listing) => (
                <ListingCard key={listing.id}>
                  <ListingImageContainer>
                    {listing.images && listing.images.length > 0 ? (
                      <ListingImage 
                        src={listing.images[0]} 
                        alt={listing.title}
                      />
                    ) : (
                      <ListingImagePlaceholder>
                        <FiHome size={40} />
                      </ListingImagePlaceholder>
                    )}
                    <ListingBadge $transaction={listing.transaction}>
                      {listing.transaction === 'SALE' ? t('listings.forSale') : t('listings.forRent')}
                    </ListingBadge>
                  </ListingImageContainer>

                  <ListingContent>
                    <ListingTitle>{listing.title}</ListingTitle>
                    <ListingPrice>
                      €{listing.price.toLocaleString()}
                      {listing.transaction === 'RENT' && '/month'}
                    </ListingPrice>
                    
                    <ListingDetails>
                      <ListingDetail>
                        <FiMapPin size={14} />
                        {listing.municipality?.name_en || listing.city.name_en}
                      </ListingDetail>
                      <ListingDetail>
                        <FiHome size={14} />
                        {listing.size}m² • {listing.rooms} rooms
                      </ListingDetail>
                      <ListingDetail>
                        <FiCalendar size={14} />
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </ListingDetail>
                    </ListingDetails>

                    <ListingActions>
                      <ListingActionButton $variant="view">
                        <FiEye size={16} />
                        {t('listings.view')}
                      </ListingActionButton>
                      <ListingActionButton $variant="edit">
                        <FiEdit3 size={16} />
                        {t('listings.edit')}
                      </ListingActionButton>
                      <ListingActionButton $variant="delete">
                        <FiTrash2 size={16} />
                        {t('listings.delete')}
                      </ListingActionButton>
                    </ListingActions>
                  </ListingContent>
                </ListingCard>
              ))}
            </ListingsGrid>
          ) : (
            <EmptyListings>
              <EmptyListingsIcon>
                <FiHome size={60} />
              </EmptyListingsIcon>
              <EmptyListingsTitle>{t('listings.noListings')}</EmptyListingsTitle>
              <EmptyListingsText>
                {t('listings.noListingsText')}
              </EmptyListingsText>
              <AddListingButton href="/post-property">
                <FiPlus size={16} />
                {t('listings.addFirstListing')}
              </AddListingButton>
            </EmptyListings>
          )}
        </ListingsSection>
      </DashboardBody>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <FiEdit3 size={24} />
                {t('editModal.title')}
              </ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGrid>
                <FormGroup>
                  <FormLabel>{t('editModal.companyName')}</FormLabel>
                  <FormInput
                    type="text"
                    value={editFormData?.companyName || ''}
                    onChange={(e) => handleEditFormChange('companyName', e.target.value)}
                    placeholder={t('editModal.companyNamePlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.phone')}</FormLabel>
                  <FormInput
                    type="tel"
                    value={editFormData?.phone || ''}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    placeholder={t('editModal.phonePlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.website')}</FormLabel>
                  <FormInput
                    type="url"
                    value={editFormData?.website || ''}
                    onChange={(e) => handleEditFormChange('website', e.target.value)}
                    placeholder={t('editModal.websitePlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.address')}</FormLabel>
                  <FormInput
                    type="text"
                    value={editFormData?.address || ''}
                    onChange={(e) => handleEditFormChange('address', e.target.value)}
                    placeholder={t('editModal.addressPlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.city')}</FormLabel>
                  <FormInput
                    type="text"
                    value={editFormData?.city || ''}
                    onChange={(e) => handleEditFormChange('city', e.target.value)}
                    placeholder={t('editModal.cityPlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.zipCode')}</FormLabel>
                  <FormInput
                    type="text"
                    value={editFormData?.zipCode || ''}
                    onChange={(e) => handleEditFormChange('zipCode', e.target.value)}
                    placeholder={t('editModal.zipCodePlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.contactPerson')}</FormLabel>
                  <FormInput
                    type="text"
                    value={editFormData?.contactPerson || ''}
                    onChange={(e) => handleEditFormChange('contactPerson', e.target.value)}
                    placeholder={t('editModal.contactPersonPlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.contactRole')}</FormLabel>
                  <FormInput
                    type="text"
                    value={editFormData?.contactRole || ''}
                    onChange={(e) => handleEditFormChange('contactRole', e.target.value)}
                    placeholder={t('editModal.contactRolePlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.agencySize')}</FormLabel>
                  <FormSelect
                    value={editFormData?.agencySize || 'SMALL'}
                    onChange={(e) => handleEditFormChange('agencySize', e.target.value)}
                  >
                    <option value="SMALL">{t('sizes.small')}</option>
                    <option value="MEDIUM">{t('sizes.medium')}</option>
                    <option value="LARGE">{t('sizes.large')}</option>
                  </FormSelect>
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t('editModal.logoUrl')}</FormLabel>
                  <FormInput
                    type="url"
                    value={editFormData?.logo || ''}
                    onChange={(e) => handleEditFormChange('logo', e.target.value)}
                    placeholder={t('editModal.logoUrlPlaceholder')}
                  />
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <FormLabel>{t('editModal.description')}</FormLabel>
                <FormTextarea
                  value={editFormData?.description || ''}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  placeholder={t('editModal.descriptionPlaceholder')}
                  rows={4}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>{t('editModal.specializations')}</FormLabel>
                <SpecializationsContainer>
                  {[
                    { key: 'residentialSales', value: 'Residential Sales' },
                    { key: 'residentialRentals', value: 'Residential Rentals' },
                    { key: 'commercialProperties', value: 'Commercial Properties' },
                    { key: 'officeSpaces', value: 'Office Spaces' },
                    { key: 'vacationRentals', value: 'Vacation Rentals' },
                    { key: 'luxuryProperties', value: 'Luxury Properties' },
                    { key: 'propertyManagement', value: 'Property Management' }
                  ].map((spec) => (
                    <SpecializationCheckbox key={spec.value}>
                      <input
                        type="checkbox"
                        checked={editFormData?.specializations?.includes(spec.value) || false}
                        onChange={(e) => {
                          const current = editFormData?.specializations || [];
                          if (e.target.checked) {
                            handleEditFormChange('specializations', [...current, spec.value]);
                          } else {
                            handleEditFormChange('specializations', current.filter((s: string) => s !== spec.value));
                          }
                        }}
                      />
                      <span>{t(`specializationsList.${spec.key}`)}</span>
                    </SpecializationCheckbox>
                  ))}
                </SpecializationsContainer>
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={() => setShowEditModal(false)}>
                {t('editModal.cancel')}
              </CancelButton>
              <SaveButton onClick={handleUpdateAgency} disabled={updateLoading}>
                <FiSave size={16} />
                {updateLoading ? t('editModal.saving') : t('editModal.saveChanges')}
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
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

// Listings Section Styles
const ListingsSection = styled.div`
  margin-top: 2rem;
`;

const ListingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const ListingsTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const AddListingButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0c4240;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #065f46;
    transform: translateY(-2px);
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ListingImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const ListingImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ListingImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #f5f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0c4240;
`;

const ListingBadge = styled.div<{ $transaction: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$transaction === 'SALE' ? '#dc2626' : '#0c4240'};
  color: white;
`;

const ListingContent = styled.div`
  padding: 1.5rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const ListingPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #0c4240;
  margin-bottom: 1rem;
`;

const ListingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ListingDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;

  svg {
    color: #0c4240;
    flex-shrink: 0;
  }
`;

const ListingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ListingActionButton = styled.button<{ $variant: 'view' | 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;

  ${props => {
    switch (props.$variant) {
      case 'view':
        return `
          background: #f5f9f9;
          color: #0c4240;
          &:hover {
            background: #e7f1f1;
          }
        `;
      case 'edit':
        return `
          background: #fef3c7;
          color: #92400e;
          &:hover {
            background: #fde68a;
          }
        `;
      case 'delete':
        return `
          background: #fee2e2;
          color: #dc2626;
          &:hover {
            background: #fecaca;
          }
        `;
      default:
        return '';
    }
  }}
`;

// Empty State Styles
const EmptyListings = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const EmptyListingsIcon = styled.div`
  color: #9ca3af;
  margin-bottom: 1rem;
`;

const EmptyListingsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const EmptyListingsText = styled.p`
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 0 2rem;
  border-bottom: 1px solid #e1e5e9;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 0 2rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #e1e5e9;
  margin-top: 2rem;
`;

// Form Styles
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const FormSelect = styled.select`
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SpecializationsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const SpecializationCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #0c4240;
  }

  input {
    accent-color: #0c4240;
  }

  span {
    font-size: 0.9rem;
    color: #333;
  }
`;

const CancelButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e5e5;
    color: #333;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #065f46;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`; 