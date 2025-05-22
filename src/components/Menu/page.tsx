"use client";

import { useState, useTransition, useEffect } from "react";
import styled from "styled-components";
import { FiHome, FiPlusSquare, FiUserPlus, FiMenu, FiX, FiHeart, FiGlobe, FiLogIn, FiBriefcase, FiChevronDown } from "react-icons/fi";
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

  useEffect(() => {
    const updateSavedCount = () => {
      if (typeof window !== 'undefined') {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setSavedCount(favorites.length);
      }
    };

    updateSavedCount();
    window.addEventListener('storage', updateSavedCount);
    return () => window.removeEventListener('storage', updateSavedCount);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      const stripped = pathname.replace(`/${locale}`, "");
      router.push(`/${newLocale}${stripped}`);
    });
  };

  const languages = [
    { value: "mk", label: "MK" },
    { value: "en", label: "EN" },
    { value: "sq", label: "AL" },
  ];

  return (
    <Navbar>
      {/* logo */}
      <LogoWrapper>
        <Logo href={`/${locale}`}>
          <FiHome size={20} />
          dom.mk
        </Logo>
      </LogoWrapper>

      {/* desktop set */}
      <DesktopMenu>
        <NavLinks>
          <MainActions>
            <ActionButton href={`/${locale}/post-property`}>
              <FiPlusSquare size={16} />
              <span>{t("postWithoutLogin")}</span>
            </ActionButton>
            <ActionButton href={`/${locale}/find-roommate`}>
              <FiUserPlus size={16} />
              <span>{t("roommates")}</span>
            </ActionButton>
          </MainActions>

          <SecondaryActions>
            <DropdownWrapper>
              <DropdownButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span>Agency</span>
                <FiBriefcase size={16} />
                <FiChevronDown size={14} />
              </DropdownButton>
              {dropdownOpen && (
                <DropdownMenu>
                  <DropdownItem href={`/${locale}/register-agency`}>
                    {t("registerAgency")}
                  </DropdownItem>
                  <DropdownItem href={`/${locale}/agency-login`}>
                    {t("agencyLogin")}
                  </DropdownItem>
                  <DropdownItem href={`/${locale}/my-agency`}>
                    {t("myAgency")}
                  </DropdownItem>
                </DropdownMenu>
              )}
            </DropdownWrapper>

            <IconButton href={`/${locale}/favorites`} aria-label="Favorites">
              <FiHeart size={16} />
              {savedCount > 0 && <SavedCount>{savedCount}</SavedCount>}
            </IconButton>

            <LanguageSelector>
              <FiGlobe size={14} />
              {languages.map((lang) => (
                <LangButton
                  key={lang.value}
                  onClick={() => handleLocaleChange(lang.value)}
                  active={locale === lang.value}
                  disabled={isPending}
                >
                  {lang.label}
                </LangButton>
              ))}
            </LanguageSelector>
          </SecondaryActions>
        </NavLinks>
      </DesktopMenu>

      {/* mobile burger */}
      <Burger onClick={() => setMobileOpen((o) => !o)} aria-label="menu">
        {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </Burger>

      {/* drawer */}
      {mobileOpen && (
        <Drawer>
          <MobileLink href={`/${locale}/post-property-no-login`}>
            <FiPlusSquare size={18} />
            {t("postWithoutLogin")}
          </MobileLink>
          <MobileLink href={`/${locale}/find-roommate`}>
            <FiUserPlus size={18} />
            {t("roommates")}
          </MobileLink>
          <MobileLink href={`/${locale}/register-agency`}>
            <FiBriefcase size={18} />
            {t("registerAgency")}
          </MobileLink>
          <MobileLink href={`/${locale}/agency-login`}>
            <FiLogIn size={18} />
            {t("agencyLogin")}
          </MobileLink>
          <MobileLink href={`/${locale}/my-agency`}>
            <FiBriefcase size={18} />
            {t("myAgency")}
          </MobileLink>
          <MobileLink href={`/${locale}/favorites`}>
            <FiHeart size={18} />
            {t("favorites")}
            {savedCount > 0 && <SavedCountMobile>{savedCount}</SavedCountMobile>}
          </MobileLink>
          <MobileLangSelector>
            <FiGlobe size={16} />
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
                {lang.label}
              </MobileLangButton>
            ))}
          </MobileLangSelector>
        </Drawer>
      )}
    </Navbar>
  );
}

/* ───────────── styled components ───────────── */

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10000;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
  }
`;

const LogoWrapper = styled.div`
  position: relative;
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0c4240;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: #143823;
    transform: translateY(-1px);
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MainActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SecondaryActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid #eee;
`;

const ActionButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #0c4240;
  background: #f5f9f9;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #e7f1f1;
    transform: translateY(-1px);
  }
`;

const IconButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #0c4240;
  background: #f5f9f9;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: #e7f1f1;
    transform: translateY(-1px);
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 6px;
  background: #f5f9f9;
  color: #0c4240;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-weight: 500;

  span {
    margin-right: 0.1rem;
  }

  &:hover {
    background: #e7f1f1;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0.4rem;
  min-width: 180px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DropdownItem = styled.a`
  display: block;
  padding: 0.5rem 0.8rem;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f9f9;
    color: #0c4240;
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0.3rem;
  border-radius: 6px;
  background: #f5f9f9;

  svg {
    color: #0c4240;
    margin-right: 0.1rem;
  }
`;

const LangButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.15rem 0.3rem;
  font-size: 0.75rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#0c4240' : '#666'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 3px;

  &:hover {
    background: ${props => props.active ? 'transparent' : '#e7f1f1'};
    color: #0c4240;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Burger = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #0c4240;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f9f9;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Drawer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const MobileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  color: #0c4240;
  background: #f5f9f9;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e7f1f1;
  }
`;

const MobileLangSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid #eef2f2;

  svg {
    color: #0c4240;
    margin-right: 0.3rem;
  }
`;

const MobileLangButton = styled(LangButton)`
  flex: 1;
  padding: 0.4rem;
  text-align: center;
  font-size: 0.9rem;
`;

const SavedCount = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4646;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 2px solid white;
`;

const SavedCountMobile = styled(SavedCount)`
  position: static;
  margin-left: 8px;
  margin-right: -4px;
`;
