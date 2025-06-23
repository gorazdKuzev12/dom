"use client";

import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiStar, 
  FiPhone, 
  FiMail, 
  FiGlobe, 
  FiLinkedin, 
  FiInstagram, 
  FiUser,
  FiAward,
  FiCalendar,
  FiBriefcase,
  FiCheckCircle,
  FiEye,
  FiHeart
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Menu from "../Menu/page";

interface Architect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  website?: string;
  linkedIn?: string;
  instagram?: string;
  profileImage?: string;
  portfolioImages: string[];
  bio_en?: string;
  bio_mk?: string;
  bio_sq?: string;
  specializations: string[];
  services: string[];
  projectTypes: string[];
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
  consultationFee?: number;
  projectFeeMin?: number;
  projectFeeMax?: number;
  currency: string;
  isAvailable: boolean;
  isVerified: boolean;
  isPremium: boolean;
  averageRating?: number;
  totalReviews: number;
  yearsExperience?: number;
  companyName?: string;
  position?: string;
  licenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface ArchitectsPageClientProps {
  initialArchitects: Architect[];
  locale: string;
}

export default function ArchitectsPageClient({ initialArchitects, locale }: ArchitectsPageClientProps) {
  const router = useRouter();
  const [architects, setArchitects] = useState<Architect[]>(initialArchitects);
  const [filteredArchitects, setFilteredArchitects] = useState<Architect[]>(initialArchitects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get localized text
  const getText = (text_en?: string, text_mk?: string, text_sq?: string) => {
    switch (locale) {
      case 'mk': return text_mk || text_en || '';
      case 'sq': return text_sq || text_en || '';
      default: return text_en || '';
    }
  };

  // Get translations
  const getTranslations = () => {
    const translations = {
      en: {
        title: "Professional Architects",
        subtitle: "Discover Macedonia's finest architectural talent",
        searchPlaceholder: "Search architects...",
        allCities: "All Cities",
        allSpecializations: "All Specializations",
        filters: "Filters",
        sortBy: "Sort by",
        newest: "Newest",
        experience: "Most Experienced",
        rating: "Highest Rated",
        verified: "Verified",
        premium: "Premium",
        available: "Available",
        yearsExp: "years experience",
        viewProfile: "View Profile",
        contact: "Contact",
        noResults: "No architects found matching your criteria",
        tryDifferent: "Try adjusting your search or filters",
        portfolio: "Portfolio",
        specializations: "Specializations",
        services: "Services",
        consultationFee: "Consultation Fee",
        projectRange: "Project Range",
        per: "per",
        hour: "hour",
        from: "from"
      },
      mk: {
        title: "Професионални Архитекти",
        subtitle: "Откриjте ги најдобрите архитектонски таленти во Македонија",
        searchPlaceholder: "Пребарај архитекти...",
        allCities: "Сите Градови",
        allSpecializations: "Сите Специјализации",
        filters: "Филтри",
        sortBy: "Сортирај по",
        newest: "Најнови",
        experience: "Најискусни",
        rating: "Најдобро Оценети",
        verified: "Верификувани",
        premium: "Премиум",
        available: "Достапни",
        yearsExp: "години искуство",
        viewProfile: "Прегледај Профил",
        contact: "Контакт",
        noResults: "Не се пронајдени архитекти кои одговараат на критериумите",
        tryDifferent: "Обидете се да ги приспособите вашето пребарување или филтри",
        portfolio: "Портфолио",
        specializations: "Специјализации",
        services: "Услуги",
        consultationFee: "Надомест за Консултација",
        projectRange: "Опсег на Проект",
        per: "за",
        hour: "час",
        from: "од"
      },
      sq: {
        title: "Arkitektë Profesionalë",
        subtitle: "Zbuloni talentet më të mira arkitekturore të Maqedonisë",
        searchPlaceholder: "Kërko arkitektë...",
        allCities: "Të gjitha Qytetet",
        allSpecializations: "Të gjitha Specializimet",
        filters: "Filtrat",
        sortBy: "Rendit sipas",
        newest: "Më të Rinj",
        experience: "Më të Përvojshëm",
        rating: "Më të Vlerësuarit",
        verified: "Të Verifikuar",
        premium: "Premium",
        available: "Të Disponueshëm",
        yearsExp: "vite përvojë",
        viewProfile: "Shiko Profilin",
        contact: "Kontakt",
        noResults: "Nuk u gjetën arkitektë që përputhen me kriteret tuaja",
        tryDifferent: "Provoni të përshtatni kërkimin ose filtrat tuaj",
        portfolio: "Portfolio",
        specializations: "Specializimet",
        services: "Shërbimet",
        consultationFee: "Tarifa e Konsultimit",
        projectRange: "Gamën e Projektit",
        per: "për",
        hour: "orë",
        from: "nga"
      }
    };
    return translations[locale as keyof typeof translations] || translations.en;
  };

  const t = getTranslations();

  // Get unique cities and specializations for filters
  const uniqueCities = Array.from(new Set(architects.map(arch => arch.city.name_en)));
  const uniqueSpecializations = Array.from(new Set(architects.flatMap(arch => arch.specializations)));

  // Filter and sort architects
  useEffect(() => {
    let filtered = architects.filter(architect => {
      const searchMatch = searchTerm === "" || 
        architect.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        architect.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        architect.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        architect.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));

      const cityMatch = selectedCity === "" || architect.city.name_en === selectedCity;
      const specializationMatch = selectedSpecialization === "" || 
        architect.specializations.includes(selectedSpecialization);

      return searchMatch && cityMatch && specializationMatch;
    });

    // Sort filtered results
    switch (sortBy) {
      case "experience":
        filtered.sort((a, b) => (b.yearsExperience || 0) - (a.yearsExperience || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredArchitects(filtered);
  }, [architects, searchTerm, selectedCity, selectedSpecialization, sortBy]);

  return (
    <>
      <Menu />
      <Container>
        <HeroSection>
          <HeroTitle>{t.title}</HeroTitle>
          <HeroSubtitle>{t.subtitle}</HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentWrapper>
            <SearchFiltersSection>
              <SearchRow>
                <SearchInput>
                  <SearchIcon />
                  <StyledInput
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </SearchInput>
                
                <FilterSelect
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">{t.allCities}</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </FilterSelect>

                <FilterSelect
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  <option value="">{t.allSpecializations}</option>
                  {uniqueSpecializations.map(spec => (
                    <option key={spec} value={spec}>
                      {spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </FilterSelect>

                <FiltersButton onClick={() => setShowFilters(!showFilters)}>
                  <FiFilter />
                  {t.filters}
                </FiltersButton>
              </SearchRow>

              <SortRow>
                <ResultsInfo>
                  {filteredArchitects.length} {filteredArchitects.length === 1 ? 'architect' : 'architects'} found
                </ResultsInfo>
                
                <SortSelect
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">{t.newest}</option>
                  <option value="experience">{t.experience}</option>
                  <option value="rating">{t.rating}</option>
                </SortSelect>
              </SortRow>
            </SearchFiltersSection>

            {filteredArchitects.length === 0 ? (
              <NoResults>
                <NoResultsIcon>🏗️</NoResultsIcon>
                <NoResultsTitle>{t.noResults}</NoResultsTitle>
                <NoResultsText>{t.tryDifferent}</NoResultsText>
              </NoResults>
            ) : (
              <ArchitectGrid>
                {filteredArchitects.map((architect) => (
                  <ArchitectCard key={architect.id}>
                    <CardHeader>
                      <ProfileImageWrapper>
                        <ProfileImage $imageUrl={architect.profileImage}>
                          {!architect.profileImage && `${architect.firstName[0]}${architect.lastName[0]}`}
                        </ProfileImage>
                      </ProfileImageWrapper>
                    </CardHeader>

                    <CardBody>
                      <ArchitectName>
                        {architect.firstName} {architect.lastName}
                      </ArchitectName>
                      
                      {architect.companyName && (
                        <CompanyName>{architect.companyName}</CompanyName>
                      )}

                      <Location>
                        <FiMapPin />
                        {getText(architect.city.name_en, architect.city.name_mk, architect.city.name_sq)}
                        {architect.municipality && `, ${getText(architect.municipality.name_en, architect.municipality.name_mk, architect.municipality.name_sq)}`}
                      </Location>

                      <BadgeRow>
                        {architect.isVerified && (
                          <Badge $variant="verified">
                            <FiCheckCircle style={{ marginRight: '0.25rem' }} />
                            {t.verified}
                          </Badge>
                        )}
                        {architect.isPremium && (
                          <Badge $variant="premium">
                            <FiAward style={{ marginRight: '0.25rem' }} />
                            {t.premium}
                          </Badge>
                        )}
                        {architect.isAvailable && (
                          <Badge $variant="available">
                            <FiUser style={{ marginRight: '0.25rem' }} />
                            {t.available}
                          </Badge>
                        )}
                      </BadgeRow>

                      {architect.averageRating && (
                        <RatingContainer>
                          <Stars>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                $filled={star <= Math.round(architect.averageRating || 0)}
                              />
                            ))}
                          </Stars>
                          <RatingText>
                            {architect.averageRating?.toFixed(1)} ({architect.totalReviews} reviews)
                          </RatingText>
                        </RatingContainer>
                      )}

                      <StatsRow>
                        {architect.yearsExperience && (
                          <StatItem>
                            <StatValue>{architect.yearsExperience}</StatValue>
                            <StatLabel>{t.yearsExp}</StatLabel>
                          </StatItem>
                        )}
                        {architect.consultationFee && (
                          <StatItem>
                            <StatValue>€{architect.consultationFee}</StatValue>
                            <StatLabel>{t.per} {t.hour}</StatLabel>
                          </StatItem>
                        )}
                        {architect.projectFeeMin && (
                          <StatItem>
                            <StatValue>{t.from} €{architect.projectFeeMin}</StatValue>
                            <StatLabel>project</StatLabel>
                          </StatItem>
                        )}
                      </StatsRow>

                      {architect.specializations.length > 0 && (
                        <SpecializationTags>
                          {architect.specializations.slice(0, 3).map((spec, index) => (
                            <SpecTag key={index}>
                              {spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </SpecTag>
                          ))}
                          {architect.specializations.length > 3 && (
                            <SpecTag>+{architect.specializations.length - 3} more</SpecTag>
                          )}
                        </SpecializationTags>
                      )}

                      {architect.portfolioImages.length > 0 && (
                        <PortfolioPreview>
                          <PortfolioImages>
                            {architect.portfolioImages.slice(0, 4).map((image, index) => (
                              <PortfolioImage key={index} $imageUrl={image} />
                            ))}
                          </PortfolioImages>
                        </PortfolioPreview>
                      )}

                      <ActionButtons>
                        <PrimaryButton onClick={() => router.push(`/${locale}/architects/${architect.id}`)}>
                          <FiEye />
                          {t.viewProfile}
                        </PrimaryButton>
                        <SecondaryButton onClick={() => window.location.href = `mailto:${architect.email}`}>
                          <FiMail />
                          {t.contact}
                        </SecondaryButton>
                      </ActionButtons>
                    </CardBody>
                  </ArchitectCard>
                ))}
              </ArchitectGrid>
            )}
          </ContentWrapper>
        </ContentSection>
      </Container>
    </>
  );
}

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Main Container
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #0c4240 0%,
    #0f5653 25%,
    #126b67 50%,
    #158078 75%,
    #189589 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

// Hero Section
const HeroSection = styled.div`
  position: relative;
  padding: 8rem 2rem 4rem;
  text-align: center;
  color: white;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 6rem 1rem 3rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeIn} 1s ease-out;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 0 0 3rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeIn} 1s ease-out 0.2s both;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

// Content Section
const ContentSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  min-height: 80vh;
  position: relative;
  z-index: 2;
  border-radius: 32px 32px 0 0;
  margin-top: -2rem;
  box-shadow: 
    0 -8px 32px rgba(0, 0, 0, 0.1),
    0 -2px 8px rgba(0, 0, 0, 0.05);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

// Search and Filters
const SearchFiltersSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 
    0 4px 20px rgba(12, 66, 64, 0.08),
    0 1px 4px rgba(12, 66, 64, 0.04);
  border: 1px solid rgba(12, 66, 64, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid rgba(12, 66, 64, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
    background: white;
  }

  &::placeholder {
    color: rgba(12, 66, 64, 0.5);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(12, 66, 64, 0.6);
  font-size: 1.1rem;
  pointer-events: none;
`;

const FilterSelect = styled.select`
  padding: 1rem;
  border: 2px solid rgba(12, 66, 64, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  min-width: 180px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const FiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0f5653;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(12, 66, 64, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const SortRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(12, 66, 64, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const SortSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid rgba(12, 66, 64, 0.1);
  border-radius: 10px;
  background: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }
`;

const ResultsInfo = styled.div`
  color: rgba(12, 66, 64, 0.8);
  font-weight: 500;
`;

// Architect Grid
const ArchitectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
`;

const ArchitectCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(12, 66, 64, 0.08),
    0 2px 8px rgba(12, 66, 64, 0.04);
  border: 1px solid rgba(12, 66, 64, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 20px 48px rgba(12, 66, 64, 0.15),
      0 8px 16px rgba(12, 66, 64, 0.08);
    border-color: rgba(12, 66, 64, 0.1);
  }
`;

const CardHeader = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #0c4240, #189589);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const ProfileImageWrapper = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const ProfileImage = styled.div<{ $imageUrl?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => 
    props.$imageUrl 
      ? `url(${props.$imageUrl}) center/cover` 
      : 'linear-gradient(135deg, #0c4240, #189589)'
  };
  border: 4px solid white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
`;

const CardBody = styled.div`
  padding: 2.5rem 1.5rem 1.5rem;
  text-align: center;
`;

const ArchitectName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
`;

const CompanyName = styled.p`
  margin: 0 0 0.5rem;
  color: rgba(12, 66, 64, 0.8);
  font-weight: 500;
  font-size: 0.9rem;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: rgba(12, 66, 64, 0.7);
  font-size: 0.9rem;
`;

const BadgeRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $variant: 'verified' | 'premium' | 'available' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$variant) {
      case 'verified':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: #15803d;
          border: 1px solid rgba(34, 197, 94, 0.2);
        `;
      case 'premium':
        return `
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          border: 1px solid #f59e0b;
        `;
      case 'available':
        return `
          background: rgba(12, 66, 64, 0.1);
          color: #0c4240;
          border: 1px solid rgba(12, 66, 64, 0.2);
        `;
      default:
        return `
          background: rgba(156, 163, 175, 0.1);
          color: #6b7280;
          border: 1px solid rgba(156, 163, 175, 0.2);
        `;
    }
  }}
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(12, 66, 64, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(12, 66, 64, 0.08);
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-weight: 600;
  color: #0c4240;
  font-size: 1.1rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(12, 66, 64, 0.7);
  margin-top: 0.25rem;
`;

const SpecializationTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  justify-content: center;
`;

const SpecTag = styled.span`
  background: rgba(12, 66, 64, 0.08);
  color: rgba(12, 66, 64, 0.8);
  padding: 0.35rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(12, 66, 64, 0.1);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #0f5653;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(12, 66, 64, 0.3);
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1rem;
  background: white;
  color: #0c4240;
  border: 2px solid #0c4240;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #0c4240;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(12, 66, 64, 0.3);
  }
`;

// Portfolio Preview
const PortfolioPreview = styled.div`
  margin: 1rem 0;
`;

const PortfolioImages = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(12, 66, 64, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #0c4240;
    border-radius: 2px;
  }
`;

const PortfolioImage = styled.div<{ $imageUrl: string }>`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: url(${props => props.$imageUrl}) center/cover;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.05);
    border-color: #0c4240;
  }
`;

// Rating Component
const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const Star = styled(FiStar)<{ $filled: boolean }>`
  color: ${props => props.$filled ? '#fbbf24' : 'rgba(12, 66, 64, 0.2)'};
  fill: ${props => props.$filled ? '#fbbf24' : 'transparent'};
  font-size: 0.9rem;
`;

const RatingText = styled.span`
  font-size: 0.8rem;
  color: rgba(12, 66, 64, 0.7);
  font-weight: 500;
`;

// No Results
const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(12, 66, 64, 0.7);
`;

const NoResultsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: rgba(12, 66, 64, 0.3);
`;

const NoResultsTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: rgba(12, 66, 64, 0.8);
`;

const NoResultsText = styled.p`
  font-size: 1rem;
  margin: 0;
  color: rgba(12, 66, 64, 0.6);
`; 