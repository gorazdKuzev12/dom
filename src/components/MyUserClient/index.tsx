"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FiUser, FiMail, FiPhone, FiSettings, FiLogOut, FiCheck, FiEdit3, FiEye, FiTrash2, FiPlus, FiHome, FiCalendar, FiX, FiSave, FiMapPin, FiShield } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { GET_USER, GET_USER_LISTINGS, UPDATE_USER } from "@/lib/queries";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserListing {
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
  agency?: {
    id: string;
    companyName: string;
    logo?: string;
  };
  isAgencyListing: boolean;
}

interface MyUserClientProps {
  userData?: UserData | null;
  userListings?: UserListing[];
  isAuthenticated?: boolean;
}

export default function MyUserClient({ userData: initialUserData, userListings: initialListings, isAuthenticated: initialAuth }: MyUserClientProps) {
  const t = useTranslations('MyUser');
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(initialUserData?.id || null);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth || false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Only check localStorage authentication if no server data provided
  useEffect(() => {
    // If we already have server-provided data, don't check localStorage
    if (initialUserData && initialAuth) {
      return;
    }

    // Check localStorage for authentication
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    const storedData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

    console.log('🔍 Client-side auth check:', {
      hasToken: !!token,
      hasStoredData: !!storedData
    });

    if (token && storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserId(parsedData.id);
        setIsAuthenticated(true);
        console.log('✅ Found localStorage auth data');
      } catch (error) {
        console.error('❌ Failed to parse stored user data:', error);
        // Clear invalid data and redirect to login
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userData');
        router.push('/login');
      }
    } else {
      console.log('❌ No localStorage auth found');
      router.push('/login');
    }
  }, [initialUserData, initialAuth, router]);

  // Determine if we should fetch from client
  const shouldFetchFromClient = !initialUserData && userId && isAuthenticated;

  console.log('🎯 Query decision:', {
    shouldFetchFromClient,
    hasInitialData: !!initialUserData,
    hasUserId: !!userId,
    isAuthenticated
  });

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !shouldFetchFromClient,
    errorPolicy: 'all',
    onError: (error) => {
      // Handle authentication errors
      if (error.message.includes('Authentication required') || 
          error.message.includes('Access denied') ||
          error.message.includes('jwt expired')) {
        // Clear tokens and redirect to login
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userData');
        router.push('/login');
      }
    }
  });

  const { data: listingsData, loading: listingsLoading } = useQuery(GET_USER_LISTINGS, {
    variables: { userId: userId },
    skip: !shouldFetchFromClient,
    errorPolicy: 'all',
    onError: (error) => {
      console.error('User listings fetch error:', error);
    }
  });

  const [updateUserMutation] = useMutation(UPDATE_USER, {
    onError: (error) => {
      console.error('Update user error:', error);
    }
  });

  const handleLogout = async () => {
    setLogoutLoading(true);
    
    try {
      // Clear all stored data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userData');
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleEditProfile = () => {
    const currentData = initialUserData || data?.user;
    if (currentData) {
      setEditFormData({
        name: currentData.name || "",
        email: currentData.email || "",
        phone: currentData.phone || "",
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateSubmit = async () => {
    setUpdateLoading(true);
    try {
      const currentData = initialUserData || data?.user;
      if (!currentData) {
        throw new Error('No user data available');
      }

      await updateUserMutation({
        variables: {
          id: currentData.id,
          input: editFormData
        },
        // Update the cache with the new data
        update: (cache, { data: mutationData }) => {
          if (mutationData?.updateUser) {
            // Update the GET_USER query cache
            cache.writeQuery({
              query: GET_USER,
              variables: { id: currentData.id },
              data: { user: mutationData.updateUser }
            });
          }
        }
      });

      console.log('✅ User profile updated successfully');
      setShowEditModal(false);
      
      // Optionally refetch the user data to ensure consistency
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Use server-provided data first, then client-fetched data
  const userData = initialUserData || data?.user;
  const listings = initialListings || listingsData?.userListings || [];

  // If we have no authentication or no data at all, show error
  if (!isAuthenticated || !userData) {
    return (
      <LoadingContainer>
        <LoadingText>
          {!isAuthenticated ? t('messages.authRequired') : t('messages.userNotFound')}
        </LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <MainContent>
      <DashboardHeader>
        <HeaderContent>
          <UserAvatar>
            <FiUser size={40} />
          </UserAvatar>
          
          <UserInfo>
            <UserName>{userData.name}</UserName>
            <UserEmail>{userData.email}</UserEmail>
            {userData.isVerified && (
              <VerifiedBadge>
                <FiShield size={12} />
                {t('verifiedUser')}
              </VerifiedBadge>
            )}
          </UserInfo>
          
          <HeaderActions>
            <ActionButton onClick={handleEditProfile}>
              <FiEdit3 size={16} />
              {t('editProfile')}
            </ActionButton>
            <LogoutButton onClick={handleLogout} disabled={logoutLoading}>
              <FiLogOut size={16} />
              {logoutLoading ? t('loggingOut') : t('logout')}
            </LogoutButton>
          </HeaderActions>
        </HeaderContent>
      </DashboardHeader>

      <DashboardContent>
        <StatsSection>
          <StatCard>
            <StatIcon><FiHome /></StatIcon>
            <StatValue>{listings.length}</StatValue>
            <StatLabel>{t('stats.activeListings')}</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon><FiCalendar /></StatIcon>
            <StatValue>{new Date(userData.createdAt).toLocaleDateString()}</StatValue>
            <StatLabel>{t('stats.memberSince')}</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon><FiCheck /></StatIcon>
            <StatValue>{userData.isVerified ? t('stats.verified') : t('stats.pending')}</StatValue>
            <StatLabel>{t('stats.accountStatus')}</StatLabel>
          </StatCard>
        </StatsSection>

        <ListingsSection>
          <SectionHeader>
            <SectionTitle>
              <FiHome size={20} />
              {t('listings.title')} ({listings.length})
            </SectionTitle>
            <AddButton onClick={() => router.push('/post-property')}>
              <FiPlus size={16} />
              {t('listings.addNew')}
            </AddButton>
          </SectionHeader>

          {listings.length === 0 ? (
            <EmptyState>
              <EmptyIcon><FiHome size={48} /></EmptyIcon>
              <EmptyTitle>{t('listings.empty.title')}</EmptyTitle>
              <EmptyDescription>
                {t('listings.empty.description')}
              </EmptyDescription>
              <AddButton onClick={() => router.push('/post-property')}>
                <FiPlus size={16} />
                {t('listings.empty.button')}
              </AddButton>
            </EmptyState>
          ) : (
            <ListingsGrid>
              {listings.map((listing: UserListing) => (
                <ListingCard key={listing.id}>
                  <ListingImage>
                    {listing.images.length > 0 ? (
                      <img src={listing.images[0]} alt={listing.title} />
                    ) : (
                      <PlaceholderImage>
                        <FiHome size={24} />
                      </PlaceholderImage>
                    )}
                    {listing.isAgencyListing && listing.agency && (
                      <AgencyBadge>
                        <AgencyIcon>🏢</AgencyIcon>
                        <AgencyName>{listing.agency.companyName}</AgencyName>
                      </AgencyBadge>
                    )}
                  </ListingImage>
                  
                  <ListingContent>
                    <ListingTitle>{listing.title}</ListingTitle>
                    <ListingPrice>€{listing.price.toLocaleString()}</ListingPrice>
                    <ListingDetails>
                      {listing.rooms && <span>{listing.rooms} rooms</span>}
                      {listing.size && <span>{listing.size}m²</span>}
                      <span>{listing.type}</span>
                    </ListingDetails>
                    <ListingLocation>
                      <FiMapPin size={12} />
                      {listing.city.name_en}
                      {listing.municipality && `, ${listing.municipality.name_en}`}
                    </ListingLocation>
                    <ListingActions>
                      <ActionBtn>
                        <FiEye size={14} />
                        {t('listings.actions.view')}
                      </ActionBtn>
                      <ActionBtn>
                        <FiEdit3 size={14} />
                        {t('listings.actions.edit')}
                      </ActionBtn>
                      <ActionBtn danger>
                        <FiTrash2 size={14} />
                        {t('listings.actions.delete')}
                      </ActionBtn>
                    </ListingActions>
                  </ListingContent>
                </ListingCard>
              ))}
            </ListingsGrid>
          )}
        </ListingsSection>
      </DashboardContent>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{t('editModal.title')}</ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>
            
            <ModalContent>
              <FormGroup>
                <Label>{t('editModal.name')}</Label>
                <Input
                  type="text"
                  value={editFormData?.name || ''}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>{t('editModal.email')}</Label>
                <Input
                  type="email"
                  value={editFormData?.email || ''}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>{t('editModal.phone')}</Label>
                <Input
                  type="tel"
                  value={editFormData?.phone || ''}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                />
              </FormGroup>
            </ModalContent>
            
            <ModalActions>
              <CancelButton onClick={() => setShowEditModal(false)}>
                {t('editModal.cancel')}
              </CancelButton>
              <SaveButton onClick={handleUpdateSubmit} disabled={updateLoading}>
                <FiSave size={16} />
                {updateLoading ? t('editModal.saving') : t('editModal.save')}
              </SaveButton>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </MainContent>
  );
}

// Styled Components
const MainContent = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
`;

const DashboardHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 2rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #0c4240 0%, #1a5f5c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const UserEmail = styled.p`
  color: #666;
  margin: 0 0 0.5rem 0;
`;

const VerifiedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #1a5f5c;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #0c4240;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ListingsSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #0c4240 0%, rgb(48, 155, 151) 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(12, 66, 64, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  color: #ccc;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #999;
  margin-bottom: 2rem;
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;

const ListingCard = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const ListingImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
`;

const ListingContent = styled.div`
  padding: 1rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ListingPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0c4240;
  margin-bottom: 0.5rem;
`;

const ListingDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;

  span {
    padding: 0.25rem 0.5rem;
    background: #f8f9fa;
    border-radius: 4px;
  }
`;

const ListingLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ListingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionBtn = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.danger ? '#dc3545' : '#0c4240'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.danger ? '#c82333' : '#1a5f5c'};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  color: #666;
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
`;

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #f8f9fa;
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #0c4240;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #5a6268;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1a5f5c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AgencyBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(12, 66, 64, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
`;

const AgencyIcon = styled.span`
  font-size: 0.7rem;
`;

const AgencyName = styled.span`
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`; 