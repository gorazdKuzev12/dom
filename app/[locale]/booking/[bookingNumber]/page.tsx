"use client";

import { useQuery, ApolloProvider } from "@apollo/client";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Ruler, 
  BedDouble, 
  Bath, 
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  Info
} from "lucide-react";
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";
import { GET_LISTING_BY_BOOKING_NUMBER } from "@/lib/queries";
import { getClient } from "@/lib/client";

function BookingPage() {
  const params = useParams();
  const bookingNumber = params.bookingNumber as string;
  const t = useTranslations("ListingDetails");

  const { data, loading, error } = useQuery(GET_LISTING_BY_BOOKING_NUMBER, {
    variables: { bookingNumber },
    skip: !bookingNumber,
  });

  if (loading) {
    return (
      <PageWrapper>
        <Menu />
        <MainContent>
          <LoadingCard>
            <LoadingText>Loading your listing...</LoadingText>
          </LoadingCard>
        </MainContent>
        <Footer />
      </PageWrapper>
    );
  }

  if (error || !data?.listingByBookingNumber) {
    return (
      <PageWrapper>
        <Menu />
        <MainContent>
          <ErrorCard>
            <ErrorIcon>❌</ErrorIcon>
            <ErrorTitle>Listing Not Found</ErrorTitle>
            <ErrorText>
              No listing found with booking number: <strong>{bookingNumber}</strong>
            </ErrorText>
            <ErrorText>
              Please check your booking number and try again.
            </ErrorText>
            <BackButton href="/post-property">Post New Property</BackButton>
          </ErrorCard>
        </MainContent>
        <Footer />
      </PageWrapper>
    );
  }

  const listing = data.listingByBookingNumber;

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <Header>
          <BookingInfo>
            <BookingLabel>Booking Number:</BookingLabel>
            <BookingNumber>{bookingNumber}</BookingNumber>
          </BookingInfo>
          <Title>{listing.title}</Title>
          <Location>
            <MapPin size={16} />
            {listing.city?.name_en}
            {listing.municipality && `, ${listing.municipality.name_en}`}
          </Location>
        </Header>

        <ContentGrid>
          <MainColumn>
            <ImageGallery>
              {listing.images?.length > 0 ? (
                listing.images.map((image: string, index: number) => (
                  <PropertyImage key={index} src={image} alt={`Property ${index + 1}`} />
                ))
              ) : (
                <PlaceholderImage>
                  <Home size={48} />
                  <span>No images available</span>
                </PlaceholderImage>
              )}
            </ImageGallery>

            <DetailsCard>
              <SectionTitle>Property Details</SectionTitle>
              <DetailsList>
                <DetailItem>
                  <DetailIcon><DollarSign size={16} /></DetailIcon>
                  <DetailLabel>Price:</DetailLabel>
                  <DetailValue>€{listing.price?.toLocaleString()}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailIcon><Ruler size={16} /></DetailIcon>
                  <DetailLabel>Size:</DetailLabel>
                  <DetailValue>{listing.size} m²</DetailValue>
                </DetailItem>
                {listing.rooms && (
                  <DetailItem>
                    <DetailIcon><BedDouble size={16} /></DetailIcon>
                    <DetailLabel>Rooms:</DetailLabel>
                    <DetailValue>{listing.rooms}</DetailValue>
                  </DetailItem>
                )}
                {listing.bathrooms && (
                  <DetailItem>
                    <DetailIcon><Bath size={16} /></DetailIcon>
                    <DetailLabel>Bathrooms:</DetailLabel>
                    <DetailValue>{listing.bathrooms}</DetailValue>
                  </DetailItem>
                )}
                {listing.floor && (
                  <DetailItem>
                    <DetailIcon><Building2 size={16} /></DetailIcon>
                    <DetailLabel>Floor:</DetailLabel>
                    <DetailValue>{listing.floor}{listing.totalFloors ? ` / ${listing.totalFloors}` : ''}</DetailValue>
                  </DetailItem>
                )}
              </DetailsList>
            </DetailsCard>

            {listing.description && (
              <DescriptionCard>
                <SectionTitle>Description</SectionTitle>
                <Description>{listing.description}</Description>
              </DescriptionCard>
            )}

            {listing.amenities?.length > 0 && (
              <AmenitiesCard>
                <SectionTitle>Amenities</SectionTitle>
                <AmenitiesList>
                  {listing.amenities.map((amenity: string) => (
                    <AmenityItem key={amenity}>
                      ✓ {amenity.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </AmenityItem>
                  ))}
                </AmenitiesList>
              </AmenitiesCard>
            )}
          </MainColumn>

          <Sidebar>
            <ContactCard>
              <SectionTitle>Contact Information</SectionTitle>
              <ContactInfo>
                <ContactItem>
                  <ContactIcon><User size={16} /></ContactIcon>
                  <ContactValue>{listing.contactName}</ContactValue>
                </ContactItem>
                <ContactItem>
                  <ContactIcon><Mail size={16} /></ContactIcon>
                  <ContactValue>{listing.contactEmail}</ContactValue>
                </ContactItem>
                <ContactItem>
                  <ContactIcon><Phone size={16} /></ContactIcon>
                  <ContactValue>{listing.contactPhone}</ContactValue>
                </ContactItem>
              </ContactInfo>
            </ContactCard>

            <InfoCard>
              <SectionTitle>Listing Information</SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoLabel>Posted:</InfoLabel>
                  <InfoValue>{new Date(listing.createdAt).toLocaleDateString()}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Expires:</InfoLabel>
                  <InfoValue>{new Date(listing.expiresAt).toLocaleDateString()}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Type:</InfoLabel>
                  <InfoValue>{listing.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Transaction:</InfoLabel>
                  <InfoValue>{listing.transaction}</InfoValue>
                </InfoItem>
              </InfoList>
            </InfoCard>

            <ManageCard>
              <SectionTitle>Manage Your Listing</SectionTitle>
              <ManageText>
                Want to edit or update your listing? Create an account for full control over your properties.
              </ManageText>
              <ManageActions>
                <CreateAccountButton href="/register">Create Account</CreateAccountButton>
                <LoginButton href="/login">Login</LoginButton>
              </ManageActions>
            </ManageCard>
          </Sidebar>
        </ContentGrid>
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

const LoadingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  color: #666;
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  margin: 0 0 1rem 0;
`;

const ErrorText = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const BackButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #0c4240;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #0a3533;
    transform: translateY(-1px);
  }
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const BookingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const BookingLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const BookingNumber = styled.span`
  font-family: monospace;
  font-weight: 700;
  color: #0c4240;
  background: #f0f9ff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 1px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 1rem;

  svg {
    color: #0c4240;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 250px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #64748b;

  svg {
    color: #94a3b8;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const DetailsCard = styled(Card)``;
const DescriptionCard = styled(Card)``;
const AmenitiesCard = styled(Card)``;
const ContactCard = styled(Card)``;
const InfoCard = styled(Card)``;
const ManageCard = styled(Card)``;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 1rem 0;
`;

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailIcon = styled.div`
  color: #0c4240;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #444;
`;

const DetailValue = styled.span`
  color: #666;
`;

const Description = styled.p`
  color: #444;
  line-height: 1.6;
  margin: 0;
`;

const AmenitiesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
`;

const AmenityItem = styled.div`
  color: #444;
  font-size: 0.9rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ContactIcon = styled.div`
  color: #0c4240;
`;

const ContactValue = styled.span`
  color: #444;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #666;
`;

const InfoValue = styled.span`
  color: #444;
`;

const ManageText = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const ManageActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CreateAccountButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: #0c4240;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #0a3533;
    transform: translateY(-1px);
  }
`;

const LoginButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: white;
  color: #0c4240;
  text-decoration: none;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f9f9;
    transform: translateY(-1px);
  }
`;

export default function BookingNumberPage() {
  const client = getClient();
  
  return (
    <ApolloProvider client={client}>
      <BookingPage />
    </ApolloProvider>
  );
} 