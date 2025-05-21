"use client";

import { useState, useTransition, useEffect } from "react";
import styled from "styled-components";
import { FiHome, FiPlusSquare, FiUserPlus, FiMenu, FiX, FiHeart, FiGlobe } from "react-icons/fi";
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
          <TopLink href={`/${locale}/find-roommate`}>
            <FiUserPlus size={18} />
            <span>{t("roommates")}</span>
          </TopLink>
          <PostButton href={`/${locale}/post-property`}>
            <FiPlusSquare size={18} />
            <span>{t("postProperty")}</span>
          </PostButton>
          <FavoritesButton href={`/${locale}/favorites`} aria-label="Favorites">
            <FiHeart size={18} fill="white" stroke="white" />
            {savedCount > 0 && <SavedCount>{savedCount}</SavedCount>}
          </FavoritesButton>
          <LanguageSelector>
            <FiGlobe size={16} />
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
        </NavLinks>
      </DesktopMenu>

      {/* mobile burger */}
      <Burger onClick={() => setMobileOpen((o) => !o)} aria-label="menu">
        {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </Burger>

      {/* drawer */}
      {mobileOpen && (
        <Drawer>
          <MobileLink
            href={`/${locale}/find-roommate`}
            onClick={() => setMobileOpen(false)}
          >
            <FiUserPlus size={18} />
            {t("roommates")}
          </MobileLink>
          <MobileLink
            href={`/${locale}/post-property`}
            onClick={() => setMobileOpen(false)}
          >
            <FiPlusSquare size={18} />
            {t("postProperty")}
          </MobileLink>
          <MobileLink
            href={`/${locale}/favorites`}
            onClick={() => setMobileOpen(false)}
          >
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
  padding: 0.8rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 10000;

  @media (max-width: 768px) {
    padding: 0.8rem 1.2rem;
  }
`;

const LogoWrapper = styled.div`
  position: relative;
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
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

const baseBtn = `
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
`;

const TopLink = styled.a`
  ${baseBtn};
  color: #0c4240;
  background: #f5f9f9;
  
  &:hover {
    background: #e7f1f1;
    transform: translateY(-1px);
  }
`;

const PostButton = styled.a`
  ${baseBtn};
  color: #ffffff;
  background: #0c4240;
  box-shadow: 0 2px 6px rgba(12, 66, 64, 0.15);
  
  &:hover {
    background: #143823;
    transform: translateY(-1px);
  }
`;

const FavoritesButton = styled.a<{ 'aria-label': string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #0c4240;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(12, 66, 64, 0.15);
  position: relative;

  &:hover {
    background: #143823;
    transform: translateY(-1px);
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
 gap: 0.2rem;
  margin-left: 0.4rem;
  padding: 0.25rem 0.3rem;
  border-radius: 6px;
  background: #f5f9f9;
  transition: all 0.2s ease;

  svg {
    color: #0c4240;
        width: 14px;
    height: 14px;
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
  ${baseBtn};
  color: #0c4240;
  background: #f5f9f9;
  width: 100%;
  justify-content: flex-start;
  
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
  top: -6px;
  right: -6px;
  background: #ff4646;
  color: white;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white;
`;

const SavedCountMobile = styled(SavedCount)`
  position: static;
  margin-left: 8px;
  margin-right: -4px;
`;
