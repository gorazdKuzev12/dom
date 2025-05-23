"use client";

import styled from "styled-components";
import { 
  FiMapPin, 
  FiDollarSign, 
  FiCalendar, 
  FiHome, 
  FiPhone,
  FiMail
} from "react-icons/fi";
import { BsPersonCheck } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";
import Link from "next/link";
import RoommateFilters from "@/components/RoommateFilters";
import { useTranslations } from "next-intl";

interface Roommate {
  id: string;
  name: string;
  age: number;
  email: string;
  phone?: string;
  profileImage?: string;
  occupation?: string;
  gender: string;
  isOnline: boolean;
  isVerified: boolean;
  description?: string;
  city: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
  };
  municipality?: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
  };
  isLocationFlexible: boolean;
  budgetMin?: number;
  budgetMax?: number;
  currency: string;
  housingType: string;
  preferredRoomType: string;
  moveInDate?: string;
  smokingPolicy: string;
  petPolicy: string;
  guestPolicy: string;
  cleanlinessLevel: string;
  noiseLevel: string;
  isStudent: boolean;
  isProfessional: boolean;
  workFromHome: boolean;
  hasOwnFurniture: boolean;
  interests: string[];
  languages: string[];
  preferredContact: string;
  availableForCall?: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt?: string;
}

interface City {
  id: string;
  name_en: string;
  name_mk: string;
  name_sq: string;
  slug: string;
}

interface FindRoommateClientProps {
  roommates: Roommate[];
  cities: City[];
  error?: string;
}

// Helper function to format budget
function formatBudget(min?: number, max?: number, currency: string = 'EUR'): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'MKD';
  
  if (min && max) {
    return `${symbol}${min}-${max}`;
  } else if (min) {
    return `${symbol}${min}+`;
  } else if (max) {
    return `Up to ${symbol}${max}`;
  }
  return 'Negotiable';
}

// Helper function to format housing type
function formatHousingType(type: string): string {
  switch (type) {
    case 'ROOM_IN_SHARED_APARTMENT': return 'Room in shared apartment';
    case 'ENTIRE_APARTMENT_SHARED': return 'Entire apartment with roommate';
    case 'STUDIO_SHARED': return 'Shared studio';
    case 'HOUSE_SHARED': return 'Shared house';
    case 'ANY': return 'Any housing type';
    default: return type;
  }
}

export default function FindRoommateClient({ roommates, cities, error }: FindRoommateClientProps) {
  const t = useTranslations();

  if (error) {
    return (
      <Wrapper>
        <Menu />
        <Main>
          <ErrorContainer>
            <ErrorTitle>Error loading roommates</ErrorTitle>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        </Main>
        <Footer />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Menu />

      <PageHeader>
        <HeaderContent>
          <PageTitle>{t("Roommates.title")}</PageTitle>
          <PageSubtitle>{t("Roommates.subtitle")}</PageSubtitle>
          <PostMeButton href="/post-roommate-profile">
            <IoPersonOutline size={20} />
            {t("Roommates.postButton")}
          </PostMeButton>
        </HeaderContent>
      </PageHeader>

      <Main>
        <RoommateFilters cities={cities} />
        
        <ListArea>
          <ResultsHeader>
            <ResultsCount>
              {roommates.length} {roommates.length === 1 ? 'roommate' : 'roommates'} found
            </ResultsCount>
          </ResultsHeader>

          {roommates.length === 0 ? (
            <NoResults>
              <NoResultsTitle>No roommates found</NoResultsTitle>
              <NoResultsText>
                Try adjusting your filters or search in a different area.
              </NoResultsText>
            </NoResults>
          ) : (
            roommates.map((roommate) => (
              <RoommateCard key={roommate.id}>
                <ProfileImageContainer>
                  <ProfileImage 
                    src={roommate.profileImage || '/default-avatar.jpg'} 
                    alt={`${roommate.name} profile`} 
                  />
                  <OnlineStatus active={roommate.isOnline} />
                </ProfileImageContainer>
                
                <CardContent>
                  <NameRow>
                    <Name>
                      {roommate.name}, {roommate.age}
                    </Name>
                    <VerifiedBadge verified={roommate.isVerified}>
                      {roommate.isVerified && (
                        <>
                          <BsPersonCheck size={16} />
                          {t("Roommates.card.verified")}
                        </>
                      )}
                    </VerifiedBadge>
                  </NameRow>
                  
                  {roommate.occupation && (
                    <Occupation>{roommate.occupation}</Occupation>
                  )}
                  
                  <InfoGrid>
                    <InfoItem>
                      <FiMapPin />
                      <span>
                        {roommate.municipality?.name_en || roommate.city.name_en}
                        {roommate.isLocationFlexible && ' (Flexible)'}
                      </span>
                    </InfoItem>
                    
                    <InfoItem>
                      <FiDollarSign />
                      <span>
                        Budget: {formatBudget(roommate.budgetMin, roommate.budgetMax, roommate.currency)}
                      </span>
                    </InfoItem>
                    
                    <InfoItem>
                      <FiHome />
                      <span>
                        {formatHousingType(roommate.housingType)}
                      </span>
                    </InfoItem>
                    
                    {roommate.moveInDate && (
                      <InfoItem>
                        <FiCalendar />
                        <span>
                          Available: {new Date(roommate.moveInDate).toLocaleDateString()}
                        </span>
                      </InfoItem>
                    )}
                  </InfoGrid>

                  {roommate.description && (
                    <Description>{roommate.description}</Description>
                  )}

                  {roommate.interests.length > 0 && (
                    <InterestsContainer>
                      <InterestsLabel>Interests:</InterestsLabel>
                      <Interests>
                        {roommate.interests.slice(0, 3).map((interest, index) => (
                          <InterestTag key={index}>{interest}</InterestTag>
                        ))}
                        {roommate.interests.length > 3 && (
                          <InterestTag>+{roommate.interests.length - 3} more</InterestTag>
                        )}
                      </Interests>
                    </InterestsContainer>
                  )}
                  
                  <ContactRow>
                    {roommate.phone && (
                      <ContactButton href={`tel:${roommate.phone}`}>
                        <FiPhone size={16} />
                        {t("Roommates.card.viewPhone")}
                      </ContactButton>
                    )}
                    <ContactButton href={`mailto:${roommate.email}`}>
                      <FiMail size={16} />
                      {t("Roommates.card.message")}
                    </ContactButton>
                  </ContactRow>
                </CardContent>
              </RoommateCard>
            ))
          )}
        </ListArea>
      </Main>
      
      <Footer />
    </Wrapper>
  );
}

// Styled Components
const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8f9;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #26825c 0%, #075448 100%);
  color: white;
  padding: 2rem 1rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const PostMeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #26825c;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 2rem;
    gap: 2rem;
  }
`;

const ListArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

const ResultsCount = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const NoResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const NoResultsText = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  margin: 2rem auto;
  max-width: 500px;
`;

const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const RoommateCard = styled.div`
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  align-items: flex-start;
  padding: 1.5rem;
  gap: 1.5rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 100px;
  min-width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OnlineStatus = styled.div<{ active: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#10b981" : "#6b7280")};
  border: 2px solid white;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Name = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const VerifiedBadge = styled.div<{ verified: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${(props) => (props.verified ? "#10b981" : "transparent")};
  background: ${(props) => (props.verified ? "#ecfdf5" : "transparent")};
  padding: ${(props) => (props.verified ? "0.25rem 0.5rem" : "0")};
  border-radius: 12px;
`;

const Occupation = styled.div`
  font-size: 0.95rem;
  color: #6b7280;
  font-style: italic;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;

  svg {
    color: #26825c;
    min-width: 16px;
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
`;

const InterestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InterestsLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
`;

const Interests = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const InterestTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ContactRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ContactButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #26825c;
  color: #26825c;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: #26825c;
    color: white;
  }
`; 