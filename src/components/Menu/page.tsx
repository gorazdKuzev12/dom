"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { FiHome, FiPlusSquare, FiUserPlus, FiMenu, FiX, FiHeart, FiGlobe, FiLogIn, FiBriefcase, FiChevronDown, FiLogOut, FiEdit } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

/* ─────────────────── component ─────────────────── */

export default function Menu() {
  const t = useTranslations("Navigation");
  const locale = useLocale() as "mk" | "en" | "sq";
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agencyData, setAgencyData] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    const updateSavedCount = () => {
      if (typeof window !== 'undefined') {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setSavedCount(favorites.length);
      }
    };

    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('agencyToken') || sessionStorage.getItem('agencyToken');
        const storedAgencyData = localStorage.getItem('agencyData') || sessionStorage.getItem('agencyData');
        
        if (token && storedAgencyData) {
          setIsLoggedIn(true);
          setAgencyData(JSON.parse(storedAgencyData));
        } else {
          setIsLoggedIn(false);
          setAgencyData(null);
        }
      }
    };

    updateSavedCount();
    checkAuthStatus();
    
    window.addEventListener('storage', updateSavedCount);
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('storage', updateSavedCount);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      const stripped = pathname.replace(`/${locale}`, "");
      router.push(`/${newLocale}${stripped}`);
    });
    setLangDropdownOpen(false);
  };

  const handleAgencyClick = () => {
    if (isLoggedIn) {
      router.push(`/${locale}/my-agency`);
    } else {
      router.push(`/${locale}/agency-login`);
    }
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('agencyToken');
    localStorage.removeItem('agencyData');
    sessionStorage.removeItem('agencyToken');
    sessionStorage.removeItem('agencyData');
    
    setIsLoggedIn(false);
    setAgencyData(null);
    setDropdownOpen(false);
    
    router.push(`/${locale}/agency-login`);
  };

  const languages = [
    { value: "mk", label: "MK", flag: "🇲🇰", name: "Македонски" },
    { value: "en", label: "EN", flag: "🇬🇧", name: "English" },
    { value: "sq", label: "AL", flag: "🇦🇱", name: "Shqip" },
  ];

  const currentLanguage = languages.find(lang => lang.value === locale);

  return (
    <Navbar scrolled={scrolled}>
      <NavbarInner>
        {/* Logo */}
        <LogoWrapper>
          <AnimatedLogo href={`/${locale}`} isLoaded={isLoaded} scrolled={scrolled}>
            <LogoIcon>
              <FiHome size={24} />
            </LogoIcon>
            <LogoText>
              <LogoTextPrimary>dom</LogoTextPrimary>
              <LogoTextSecondary>.mk</LogoTextSecondary>
            </LogoText>
          </AnimatedLogo>
        </LogoWrapper>

        {/* Desktop Menu */}
        <DesktopMenu>
          <NavLinks>
            <MainActions>
              <AnimatedActionButton href={`/${locale}/post-property`}>
                <ButtonIcon>
                  <FiPlusSquare size={18} />
                </ButtonIcon>
                <ButtonText>
                  <ButtonLabel>{t("postWithoutLogin")}</ButtonLabel>
                  <ButtonSubtitle>List your property</ButtonSubtitle>
                </ButtonText>
                <ButtonRipple />
              </AnimatedActionButton>
              
              <AnimatedActionButton href={`/${locale}/find-roommate`}>
                <ButtonIcon>
                  <FiUserPlus size={18} />
                </ButtonIcon>
                <ButtonText>
                  <ButtonLabel>{t("roommates")}</ButtonLabel>
                  <ButtonSubtitle>Find companions</ButtonSubtitle>
                </ButtonText>
                <ButtonRipple />
              </AnimatedActionButton>
              
              <AnimatedActionButton href={`/${locale}/blog`}>
                <ButtonIcon>
                  <FiEdit size={18} />
                </ButtonIcon>
                <ButtonText>
                  <ButtonLabel>Blog</ButtonLabel>
                  <ButtonSubtitle>Latest insights</ButtonSubtitle>
                </ButtonText>
                <ButtonRipple />
              </AnimatedActionButton>
            </MainActions>

            <SecondaryActions>
              <DropdownWrapper ref={dropdownRef}>
                <AnimatedDropdownButton 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  isOpen={dropdownOpen}
                >
                  <ButtonIcon>
                    <FiBriefcase size={18} />
                  </ButtonIcon>
                  <span>Agency</span>
                  <DropdownArrow isOpen={dropdownOpen}>
                    <FiChevronDown size={16} />
                  </DropdownArrow>
                  <ButtonRipple />
                </AnimatedDropdownButton>
                
                <AnimatedDropdownMenu isOpen={dropdownOpen}>
                  {!isLoggedIn ? (
                    <>
                      <DropdownItem href={`/${locale}/register-agency`}>
                        <FiBriefcase size={16} />
                        <span>{t("registerAgency")}</span>
                      </DropdownItem>
                      <DropdownItem href={`/${locale}/agency-login`}>
                        <FiLogIn size={16} />
                        <span>{t("agencyLogin")}</span>
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem href={`/${locale}/my-agency`}>
                        <FiBriefcase size={16} />
                        <span>{t("myAgency")}</span>
                      </DropdownItem>
                      <AgencyInfo>
                        <AgencyName>{agencyData?.companyName}</AgencyName>
                        <AgencyEmail>{agencyData?.email}</AgencyEmail>
                      </AgencyInfo>
                      <DropdownDivider />
                      <LogoutButton onClick={handleLogout}>
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </LogoutButton>
                    </>
                  )}
                </AnimatedDropdownMenu>
              </DropdownWrapper>

              <AnimatedIconButton href={`/${locale}/favorites`} aria-label="Favorites">
                <FiHeart size={18} />
                {savedCount > 0 && (
                  <AnimatedBadge count={savedCount}>
                    {savedCount}
                  </AnimatedBadge>
                )}
                <ButtonRipple />
              </AnimatedIconButton>

              <LanguageWrapper ref={langDropdownRef}>
                <LanguageButton 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  isOpen={langDropdownOpen}
                >
                  <LanguageFlag>{currentLanguage?.flag}</LanguageFlag>
                  <LanguageLabel>{currentLanguage?.label}</LanguageLabel>
                  <DropdownArrow isOpen={langDropdownOpen}>
                    <FiChevronDown size={14} />
                  </DropdownArrow>
                  <ButtonRipple />
                </LanguageButton>
                
                <LanguageDropdown isOpen={langDropdownOpen}>
                  {languages.map((lang) => (
                    <LanguageOption
                      key={lang.value}
                      onClick={() => handleLocaleChange(lang.value)}
                      active={locale === lang.value}
                      disabled={isPending}
                    >
                      <LanguageFlag>{lang.flag}</LanguageFlag>
                      <LanguageInfo>
                        <LanguageCode>{lang.label}</LanguageCode>
                        <LanguageName>{lang.name}</LanguageName>
                      </LanguageInfo>
                      {locale === lang.value && <ActiveIndicator />}
                    </LanguageOption>
                  ))}
                </LanguageDropdown>
              </LanguageWrapper>
            </SecondaryActions>
          </NavLinks>
        </DesktopMenu>

        {/* Mobile Burger */}
        <MobileBurger 
          onClick={() => setMobileOpen(!mobileOpen)} 
          aria-label="menu"
          isOpen={mobileOpen}
        >
          <BurgerLine isOpen={mobileOpen} line={1} />
          <BurgerLine isOpen={mobileOpen} line={2} />
          <BurgerLine isOpen={mobileOpen} line={3} />
          <ButtonRipple />
        </MobileBurger>
      </NavbarInner>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileOpen}>
        <DrawerContent>
          <MobileMainActions>
            <MobileLink href={`/${locale}/post-property`}>
              <FiPlusSquare size={20} />
              <span>{t("postWithoutLogin")}</span>
            </MobileLink>
            <MobileLink href={`/${locale}/find-roommate`}>
              <FiUserPlus size={20} />
              <span>{t("roommates")}</span>
            </MobileLink>
            <MobileLink href={`/${locale}/blog`}>
              <FiEdit size={20} />
              <span>Blog</span>
            </MobileLink>
          </MobileMainActions>
          
          <MobileDivider />
          
          <MobileSecondaryActions>
            {!isLoggedIn ? (
              <>
                <MobileLink href={`/${locale}/register-agency`}>
                  <FiBriefcase size={20} />
                  <span>{t("registerAgency")}</span>
                </MobileLink>
                <MobileLink href={`/${locale}/agency-login`}>
                  <FiLogIn size={20} />
                  <span>{t("agencyLogin")}</span>
                </MobileLink>
              </>
            ) : (
              <>
                <MobileLink href={`/${locale}/my-agency`}>
                  <FiBriefcase size={20} />
                  <span>{t("myAgency")}</span>
                </MobileLink>
                <MobileAgencyInfo>
                  <AgencyName>{agencyData?.companyName}</AgencyName>
                  <AgencyEmail>{agencyData?.email}</AgencyEmail>
                </MobileAgencyInfo>
                <MobileLogoutButton onClick={handleLogout}>
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </MobileLogoutButton>
              </>
            )}
            
            <MobileLink href={`/${locale}/favorites`}>
              <FiHeart size={20} />
              <span>{t("favorites")}</span>
              {savedCount > 0 && <SavedCountMobile>{savedCount}</SavedCountMobile>}
            </MobileLink>
          </MobileSecondaryActions>
          
          <MobileDivider />
          
          <MobileLangSelector>
            <FiGlobe size={20} />
            <span>Language</span>
            <MobileLangGrid>
              {languages.map((lang) => (
                <MobileLangButton
                  key={lang.value}
                  onClick={() => {
                    handleLocaleChange(lang.value);
                    setMobileOpen(false);
                  }}
                  active={locale === lang.value}
                  disabled={isPending}
                >
                  <LanguageFlag>{lang.flag}</LanguageFlag>
                  <span>{lang.label}</span>
                </MobileLangButton>
              ))}
            </MobileLangGrid>
          </MobileLangSelector>
        </DrawerContent>
      </MobileDrawer>
    </Navbar>
  );
}

/* ───────────── animations ───────────── */

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const logoGlow = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(12, 66, 64, 0.3); }
  50% { text-shadow: 0 0 15px rgba(12, 66, 64, 0.6); }
`;

const rippleEffect = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ───────────── styled components ───────────── */

const Navbar = styled.nav<{ scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 10000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.scrolled ? css`
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  ` : css`
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  `}
`;

const NavbarInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
  }
`;

const LogoWrapper = styled.div`
  position: relative;
`;

const AnimatedLogo = styled.a<{ isLoaded: boolean; scrolled: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
  
  ${props => props.isLoaded && css`
    animation: ${slideInFromLeft} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  `}
  
  ${props => props.scrolled && css`
    transform: scale(0.95);
  `}

  &:hover {
    transform: ${props => props.scrolled ? 'scale(0.98)' : 'scale(1.02)'};
  }
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #0c4240;
  border-radius: 6px;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: #143823;
  }
`;

const LogoText = styled.div`
  display: flex;
  align-items: baseline;
  font-family: 'Inter', 'Playfair Display', serif;
`;

const LogoTextPrimary = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c4240;
  letter-spacing: -0.01em;
`;

const LogoTextSecondary = styled.span`
  font-size: 1.5rem;
  font-weight: 300;
  color: #666;
  margin-left: -0.05em;
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MainActions = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  padding: 0.25rem;
  gap: 0.125rem;
`;

const SecondaryActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 1rem;
`;

const ButtonRipple = styled.span`
  position: absolute;
  border-radius: 50%;
  background: rgba(12, 66, 64, 0.3);
  transform: scale(0);
  pointer-events: none;
`;

const AnimatedActionButton = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: transparent;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  color: #222;
  font-size: 0.85rem;
  font-weight: 500;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }

  &:active {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const ButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #0c4240;
  transition: all 0.2s ease;
`;

const ButtonText = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: inherit;
  line-height: 1;
`;

const ButtonSubtitle = styled.span`
  display: none;
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const AnimatedDropdownButton = styled.button<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #222;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-weight: 500;

  ${props => props.isOpen && css`
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  `}

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }

  svg {
    color: #0c4240;
  }
`;

const DropdownArrow = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.isOpen && css`
    transform: rotate(180deg);
  `}
`;

const AnimatedDropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.5rem;
  min-width: 180px;
  z-index: 1000;
  
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.98)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #222;
  text-decoration: none;
  font-size: 0.85rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }

  svg {
    width: 14px;
    height: 14px;
    color: #0c4240;
  }
`;

const AnimatedIconButton = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: transparent;
  color: #0c4240;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #0c4240;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AnimatedBadge = styled.div<{ count: number }>`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #dc2626;
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  min-width: 14px;
  height: 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.2rem;
  border: 1px solid white;
`;

const LanguageWrapper = styled.div`
  position: relative;
`;

const LanguageButton = styled.button<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #222;
  font-size: 0.8rem;

  ${props => props.isOpen && css`
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  `}

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }

  svg {
    color: #0c4240;
  }
`;

const LanguageFlag = styled.span`
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const LanguageLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: inherit;
`;

const LanguageDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.5rem;
  min-width: 160px;
  z-index: 1000;
  
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.98)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const LanguageOption = styled.button<{ active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  width: 100%;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? 'rgba(0, 0, 0, 0.05)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: ${props => props.active ? '#000' : '#222'};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LanguageInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const LanguageCode = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: inherit;
  line-height: 1;
`;

const LanguageName = styled.span`
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.1rem;
`;

const ActiveIndicator = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #0c4240;
`;

const MobileBurger = styled.button<{ isOpen: boolean }>`
  display: none;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
`;

const BurgerLine = styled.div<{ isOpen: boolean; line: number }>`
  width: 20px;
  height: 1.5px;
  background: #0c4240;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.isOpen && props.line === 1 && css`
    transform: translateY(4.5px) rotate(45deg);
  `}
  
  ${props => props.isOpen && props.line === 2 && css`
    opacity: 0;
  `}
  
  ${props => props.isOpen && props.line === 3 && css`
    transform: translateY(-4.5px) rotate(-45deg);
  `}
`;

const MobileDrawer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 999;
  
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 1025px) {
    display: none;
  }
`;

const DrawerContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileMainActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MobileSecondaryActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MobileDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 0.5rem 0;
`;

const MobileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  color: #222;
  background: transparent;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #0c4240;
  }
`;

const MobileLangSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  > div:first-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
    color: #222;
    font-weight: 500;
    font-size: 0.85rem;

    svg {
      color: #0c4240;
    }
  }
`;

const MobileLangGrid = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const MobileLangButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? 'rgba(0, 0, 0, 0.05)' : 'transparent'};
  color: ${props => props.active ? '#000' : '#222'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.8rem;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SavedCountMobile = styled.div`
  background: #dc2626;
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  min-width: 14px;
  height: 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.2rem;
  margin-left: auto;
`;

const AgencyInfo = styled.div`
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  margin: 0.25rem 0;
`;

const AgencyName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.1rem;
`;

const AgencyEmail = styled.div`
  font-size: 0.7rem;
  color: #666;
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 0.5rem 0;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  color: #dc2626;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;

  &:hover {
    background: rgba(220, 38, 38, 0.05);
  }

  svg {
    width: 14px;
    height: 14px;
    color: #dc2626;
  }
`;

const MobileAgencyInfo = styled.div`
  background: rgba(0, 0, 0, 0.03);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border-left: 3px solid #0c4240;
`;

const MobileLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.05);
  border: 1px solid rgba(220, 38, 38, 0.1);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
  
  &:hover {
    background: rgba(220, 38, 38, 0.08);
  }

  svg {
    width: 18px;
    height: 18px;
    color: #dc2626;
  }
`;
