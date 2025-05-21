"use client";

import { useState, useTransition, useEffect } from "react";
import styled from "styled-components";
import { FiHome, FiPlusSquare, FiUserPlus, FiMenu, FiX, FiHeart } from "react-icons/fi";
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

  const LangButtons = (
    <LanguageContainer>
      {languages.map((lang) => (
        <LanguageButton
          key={lang.value}
          onClick={() => handleLocaleChange(lang.value)}
          active={locale === lang.value}
          disabled={isPending}
        >
          {lang.label}
        </LanguageButton>
      ))}
    </LanguageContainer>
  );

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
        </NavLinks>
        {LangButtons}
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
            <FiHeart size={18} fill="currentColor" />
            {t("favorites")}
            {savedCount > 0 && <SavedCountMobile>{savedCount}</SavedCountMobile>}
          </MobileLink>

          {/* language picker */}
          <LangWrapper>{LangButtons}</LangWrapper>
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
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10000;
`;

const LogoWrapper = styled.div``;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c4240;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #143823;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
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
  display:flex;align-items:center;gap:0.5rem;
  padding:0.45rem 0.7rem;border-radius:6px;
  font-size:0.9rem;font-weight:500;
  text-decoration:none;transition:all 0.2s;
`;

const TopLink = styled.a`
  ${baseBtn};
  color: #0c4240;
  background: #eef6f5;
  &:hover {
    background: #d7ece9;
    transform: translateY(-1px);
  }
`;

const PostButton = styled.a`
  ${baseBtn};
  color: #ffffff;
  background: #0c4240;
  box-shadow: 0 2px 8px rgba(26, 72, 44, 0.15);
  &:hover {
    background: #143823;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 72, 44, 0.22);
  }
`;

const FavoritesButton = styled.a<{ 'aria-label': string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #0c4240;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(26, 72, 44, 0.15);
  position: relative;

  &:hover {
    background: #143823;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px rgba(26, 72, 44, 0.22);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }
`;

const Burger = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #0c4240;
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
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const MobileLink = styled.a`
  ${baseBtn};
  color: #0c4240;
  background: #eef6f5;
  justify-content: flex-start;
  &:hover {
    background: #d7ece9;
  }
`;

const LangWrapper = styled.div`
  padding: 0.5rem 0;
`;

const LanguageContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LanguageButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#0c4240' : 'rgba(255, 255, 255, 0.4)'};
  color: ${props => props.active ? '#fff' : '#111'};
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#0c4240' : 'rgba(255, 255, 255, 0.6)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 2px 4px;
    font-size: 11px;
  }
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid white;
`;

const SavedCountMobile = styled(SavedCount)`
  position: static;
  margin-left: 8px;
  margin-right: -4px;
`;
