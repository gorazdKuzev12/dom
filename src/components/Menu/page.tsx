"use client";
import styled from "styled-components";
import { FiHome, FiPlusSquare } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Menu() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (e) => {
    const newLocale = e.target.value;
    startTransition(() => {
      // Get the path without the locale prefix
      const pathWithoutLocale = pathname.replace(`/${locale}`, "");

      // Navigate to the new locale path
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  return (
    <Navbar>
      <LogoContainer>
        <Logo href={`/${locale}`}>
          <FiHome size={20} style={{ marginRight: "6px" }} />
          dom.mk
        </Logo>
      </LogoContainer>

      <DesktopMenu>
        <NavLinks>
          <PostButton href={`/${locale}/post-property`}>
            <FiPlusSquare size={18} />
            <span>{t("postProperty")}</span>
          </PostButton>
        </NavLinks>

        <RightNav>
          <LanguageSelector
            value={locale}
            onChange={handleLocaleChange}
            disabled={isPending}
          >
            <option value="mk">Македонски</option>
            <option value="en">English</option>
            <option value="sq">Shqip</option>
          </LanguageSelector>
        </RightNav>
      </DesktopMenu>
    </Navbar>
  );
}

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.073);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LogoContainer = styled.div``;

const Logo = styled.a`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  font-weight: bold;
  color: #111;
  text-decoration: none;
  transition: color 0.2s ease;

  svg {
    margin-right: 6px;
  }

  &:hover {
    color: #1a482c;
  }
`;
const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PostButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  background: #0c4240;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 2px 8px rgba(26, 72, 44, 0.15);

  &:hover {
    background: #143823;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 72, 44, 0.2);
  }
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
`;

const LanguageSelector = styled.select`
  border: none;
  background: #f8f8f8;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: background 0.2s ease;

  &:focus {
    outline: none;
  }

  &:hover {
    background: #f0f0f0;
  }
`;
