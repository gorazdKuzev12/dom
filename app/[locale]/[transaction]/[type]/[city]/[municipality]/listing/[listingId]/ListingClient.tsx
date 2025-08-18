"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Menu from "@/components/Menu/page";
import { FaFacebookMessenger, FaViber, FaInstagram, FaWhatsapp, FaTelegram, FaCopy } from 'react-icons/fa';
import Footer from "@/components/Footer/page";
import { useRouter } from "next/navigation";

interface Listing {
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
  };
  agency?: {
    id: string;
    companyName: string;
    logo?: string;
  };
  isAgencyListing: boolean;
}

interface ListingClientProps {
  listing: Listing;
  locale: string;
}

export default function ListingClient({ listing, locale }: ListingClientProps) {
  const router = useRouter();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Create array of all images - use actual listing images or fallback to placeholder
  const allImages = listing.images && listing.images.length > 0 
    ? listing.images 
    : ['/so.png']; // Fallback to single placeholder image if no images

  // Check if listing is saved in localStorage on component mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setSaved(favorites.some((fav: any) => fav.id === listing.id));
  }, [listing.id]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showImageGallery) return;
      
      if (e.key === 'Escape') {
        setShowImageGallery(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageGallery, currentImageIndex]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (showImageGallery) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showImageGallery]);

  const handleSave = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (!saved) {
      // Add to favorites
      const favoriteItem = {
        id: listing.id,
        title: listing.title,
        location: `${getMunicipalityName()}, ${getCityName()}`,
        price: listing.price.toString(),
        currency: '€',
        period: listing.transaction === 'RENT' ? 'month' : '',
        size: listing.size.toString(),
        pricePerMeter: (listing.price / listing.size).toFixed(2),
        image: allImages[0] // Use first image from the actual listing images
      };
      favorites.push(favoriteItem);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setSaved(true);
    } else {
      // Remove from favorites
      const newFavorites = favorites.filter((fav: any) => fav.id !== listing.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setSaved(false);
    }

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${listing.title} | dom.mk`;
    const shareText = "Check out this property on dom.mk";

    // Try using Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fall back to custom menu if share fails or user cancels
        setShowShareMenu(true);
      }
    } else {
      // If Web Share API is not available, show custom menu
      setShowShareMenu(true);
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent("Check out this property on dom.mk");
    
    let url = '';
    switch (platform) {
      case 'messenger':
        url = `https://www.facebook.com/dialog/send?link=${shareUrl}&app_id=YOUR_FB_APP_ID&redirect_uri=${shareUrl}`;
        break;
      case 'viber':
        url = `viber://forward?text=${shareTitle}%20${shareUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, copy to clipboard instead
        copyToClipboard();
        return;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
    setShowShareMenu(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    setShowShareMenu(false);
  };

  const openImageGallery = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageGallery(true);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const getCityName = () => {
    if (locale === 'mk') return listing.city.name_mk;
    if (locale === 'sq') return listing.city.name_sq;
    return listing.city.name_en;
  };

  const getMunicipalityName = () => {
    if (!listing.municipality) return '';
    if (locale === 'mk') return listing.municipality.name_mk;
    if (locale === 'sq') return listing.municipality.name_sq;
    return listing.municipality.name_en;
  };

  const formatPropertyType = (type: string) => {
    return type.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAmenity = (amenity: string) => {
    return amenity.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'mk' ? 'mk-MK' : locale === 'sq' ? 'sq-AL' : 'en-US');
  };

  const formatCondition = (condition: string) => {
    return condition.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('heating')) return <Wind size={16} />;
    if (lowerAmenity.includes('water')) return <Coffee size={16} />;
    if (lowerAmenity.includes('air') || lowerAmenity.includes('conditioning')) return <Wind size={16} />;
    return <Square size={16} />;
  };

  return (
    <Wrapper>
      <Menu />

      <Gallery>
        <ImageGrid>
          <MainImageContainer>
            <MainImage 
              src={allImages[0]} 
              onClick={() => openImageGallery(0)}
              style={{ cursor: 'pointer' }}
            />
            {listing.isAgencyListing && listing.agency && (
              <AgencyBadge>
                <AgencyIcon>🏢</AgencyIcon>
                <AgencyName>{listing.agency.companyName}</AgencyName>
              </AgencyBadge>
            )}
          </MainImageContainer>
          <SubImagesGrid>
            <SubImage 
              src={allImages[1] || allImages[0]} 
              onClick={() => openImageGallery(1)}
              style={{ cursor: 'pointer' }}
            />
            <SubImage 
              src={allImages[2] || allImages[0]} 
              onClick={() => openImageGallery(2)}
              style={{ cursor: 'pointer' }}
            />
            <SubImage 
              src={allImages[3] || allImages[0]} 
              onClick={() => openImageGallery(3)}
              style={{ cursor: 'pointer' }}
            />
            <SubImage 
              src={allImages[4] || allImages[0]} 
              overlay
              onClick={() => openImageGallery(4)}
              style={{ cursor: 'pointer' }}
            >
              <SeeMoreOverlay>
                <Grid size={20} />
                <span>See all {allImages.length} photos</span>
              </SeeMoreOverlay>
            </SubImage>
          </SubImagesGrid>
        </ImageGrid>
      </Gallery>

      <ContentContainer>
        <MainContent>
          <Section>
            <Header>
              <Title>{listing.title}</Title>
              <Subtitle>
                <MapPin size={16} /> 
                {listing.address && `${listing.address}, `}
                {getMunicipalityName()}, {getCityName()}
              </Subtitle>
              <Price>
                €{listing.price.toLocaleString()}
                {listing.transaction === 'RENT' && <span>/month</span>}
              </Price>
              <PriceDetail>
                <Badge>
                  <Maximize2 size={14} /> {listing.size} m²
                </Badge>
                <Badge>
                  <DollarSign size={14} /> {(listing.price / listing.size).toFixed(2)} €/m²
                </Badge>
              </PriceDetail>
            </Header>
            <ButtonRow>
              <ActionButton primary={saved} onClick={handleSave}>
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
              <ActionButton onClick={handleShare}>
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
              {listing.description || `${formatPropertyType(listing.type)} ${listing.transaction === 'SALE' ? 'for sale' : 'for rent'} in ${getMunicipalityName()}, ${getCityName()}. This property offers ${listing.size} square meters of space in a great location.`}
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
                <span>{listing.size} m² built</span>
              </FeatureItem>
              {listing.rooms && (
                <FeatureItem>
                  <Home size={16} />
                  <span>{listing.rooms} rooms</span>
                </FeatureItem>
              )}
              {listing.bathrooms && (
                <FeatureItem>
                  <Key size={16} />
                  <span>{listing.bathrooms} bathrooms</span>
                </FeatureItem>
              )}
              <FeatureItem>
                <Info size={16} />
                <span>{formatCondition(listing.condition)} condition</span>
              </FeatureItem>
              {listing.floor && (
                <FeatureItem>
                  <MapPin size={16} />
                  <span>Floor {listing.floor}{listing.totalFloors && ` of ${listing.totalFloors}`}</span>
                </FeatureItem>
              )}
              <FeatureItem>
                <Square size={16} />
                <span>{formatPropertyType(listing.type)}</span>
              </FeatureItem>
            </FeatureGrid>
          </Section>

          {listing.amenities.length > 0 && (
            <>
              <Divider />
              <Section>
                <SectionTitle>
                  <Coffee size={18} />
                  Amenities
                </SectionTitle>
                <FeatureGrid>
                  {listing.amenities.map((amenity, index) => (
                    <FeatureItem key={index}>
                      {getAmenityIcon(amenity)}
                      <span>{formatAmenity(amenity)}</span>
                    </FeatureItem>
                  ))}
                </FeatureGrid>
              </Section>
            </>
          )}

          <Divider />

          <Section>
            <SectionTitle>
              <Grid size={18} />
              Floor Plan
            </SectionTitle>
            <FloorPlan src="/so.png" alt="Floor plan" />
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
                <strong>{getMunicipalityName()}</strong>
                <p>{listing.address && `${listing.address}, `}{getCityName()}</p>
              </MapAddress>
            </MapContainer>
          </Section>
        </MainContent>

        <Sidebar>
          <ContactCard>
            <ContactTitle>Contact agent</ContactTitle>
            <AgentInfo>
              <AgentPhoto src="/so.png" alt="Real estate agent" />
              <AgentDetails>
                <AgentName>{listing.contactName}</AgentName>
                <AgentCompany>dom.mk Properties</AgentCompany>
              </AgentDetails>
            </AgentInfo>
            <ContactButton>Message</ContactButton>
            <ContactButton secondary>Call {listing.contactPhone}</ContactButton>
          </ContactCard>

          <StatsCard>
            <StatItem>
              <Calendar size={16} />
              <span>Listed on {formatDate(listing.createdAt)}</span>
            </StatItem>
            <StatItem>
              <Eye size={16} />
              <span>View this property</span>
            </StatItem>
          </StatsCard>
        </Sidebar>
      </ContentContainer>

      <Footer />

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <GalleryOverlay onClick={() => setShowImageGallery(false)}>
          <GalleryModal onClick={(e) => e.stopPropagation()}>
            <GalleryHeader>
              <GalleryTitle>
                Property Photos ({currentImageIndex + 1} of {allImages.length})
              </GalleryTitle>
              <GalleryCloseButton onClick={() => setShowImageGallery(false)}>
                <X size={24} />
              </GalleryCloseButton>
            </GalleryHeader>

            <GalleryContent>
              <GalleryNavButton 
                direction="left" 
                onClick={goToPrevImage}
                disabled={allImages.length <= 1}
              >
                <ChevronLeft size={32} />
              </GalleryNavButton>

              <GalleryImageContainer>
                <GalleryImage 
                  src={allImages[currentImageIndex]} 
                  alt={`Property photo ${currentImageIndex + 1}`}
                />
              </GalleryImageContainer>

              <GalleryNavButton 
                direction="right" 
                onClick={goToNextImage}
                disabled={allImages.length <= 1}
              >
                <ChevronRight size={32} />
              </GalleryNavButton>
            </GalleryContent>

            <GalleryThumbnails>
              {allImages.map((image, index) => (
                <GalleryThumbnail
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  $active={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </GalleryThumbnails>

            <GalleryFooter>
              <GalleryInfo>
                Use arrow keys to navigate • Press ESC to close
              </GalleryInfo>
            </GalleryFooter>
          </GalleryModal>
        </GalleryOverlay>
      )}

      {showShareMenu && (
        <ShareMenuOverlay onClick={() => setShowShareMenu(false)}>
          <ShareMenuContent onClick={e => e.stopPropagation()}>
            <ShareMenuHeader>
              <h3>Share this property</h3>
              <CloseButton onClick={() => setShowShareMenu(false)}>
                <X size={20} />
              </CloseButton>
            </ShareMenuHeader>
            <ShareButtons>
              <ShareButton onClick={() => handleSocialShare('messenger')}>
                <FaFacebookMessenger size={24} />
                <span>Messenger</span>
              </ShareButton>
              <ShareButton onClick={() => handleSocialShare('viber')}>
                <FaViber size={24} />
                <span>Viber</span>
              </ShareButton>
              <ShareButton onClick={() => handleSocialShare('whatsapp')}>
                <FaWhatsapp size={24} />
                <span>WhatsApp</span>
              </ShareButton>
              <ShareButton onClick={() => handleSocialShare('telegram')}>
                <FaTelegram size={24} />
                <span>Telegram</span>
              </ShareButton>
              <ShareButton onClick={copyToClipboard}>
                <FaCopy size={24} />
                <span>Copy Link</span>
              </ShareButton>
            </ShareButtons>
          </ShareMenuContent>
        </ShareMenuOverlay>
      )}
    </Wrapper>
  );
}

// Styled Components - Exactly copied from apartment page
const Gallery = styled.div`
  padding: 1rem;
  background: white;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.5rem;
  height: 500px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    height: auto;
    gap: 0.75rem;
  }
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const AgencyBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(12, 66, 64, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 3;
`;

const AgencyIcon = styled.span`
  font-size: 0.75rem;
`;

const AgencyName = styled.span`
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubImagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    height: 80px;
  }
`;

interface SubImageProps {
  src: string;
  overlay?: boolean;
}

const SubImage = styled.div<SubImageProps>`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  transition: opacity 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

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

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 0.25rem;
  }
`;

// Image Gallery Modal Styles
const GalleryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  backdrop-filter: blur(4px);
`;

const GalleryModal = styled.div`
  width: 95vw;
  height: 95vh;
  max-width: 1400px;
  background: #1a1a1a;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const GalleryTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const GalleryCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const GalleryContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 0;
`;

interface GalleryNavButtonProps {
  direction: 'left' | 'right';
  disabled?: boolean;
}

const GalleryNavButton = styled.button<GalleryNavButtonProps>`
  position: absolute;
  ${props => props.direction}: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  opacity: ${props => props.disabled ? 0.3 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    ${props => props.direction}: 0.5rem;
  }
`;

const GalleryImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  max-height: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GalleryImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const GalleryThumbnails = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.25rem;
  }
`;

interface GalleryThumbnailProps {
  $active: boolean;
}

const GalleryThumbnail = styled.img<GalleryThumbnailProps>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.$active ? 1 : 0.6};
  border: ${props => props.$active ? '2px solid #27795b' : '2px solid transparent'};
  flex-shrink: 0;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const GalleryFooter = styled.div`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const GalleryInfo = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  text-align: center;
`;

const ContentContainer = styled.div`
  max-width: 1201px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    margin-top: 1rem;
  }
`;

const Wrapper = styled.div`
  background: #f8f9fa;
  font-family: "Inter", "Segoe UI", sans-serif;
  color: #333;
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

interface ContactButtonProps {
  secondary?: boolean;
}

const ContactButton = styled.button<ContactButtonProps>`
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

interface ActionButtonProps {
  primary?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
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

const ShareMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
`;

const ShareMenuContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ShareMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ShareButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f8f8;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  span {
    font-size: 0.9rem;
  }

  svg {
    color: #0c4240;
  }
`; 