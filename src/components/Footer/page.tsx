"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  ChevronRight,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <SectionTitle>dom.mk</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <MapPin size={14} />
              Skopje, North Macedonia
            </ContactItem>
            <ContactItem>
              <Phone size={14} />
              +389 70 123 456
            </ContactItem>
            <ContactItem>
              <Mail size={14} />
              contact@dom.mk
            </ContactItem>
          </ContactInfo>
          <SocialLinks>
            <SocialButton href="https://facebook.com" target="_blank" aria-label="Facebook">
              <Facebook size={16} />
            </SocialButton>
            <SocialButton href="https://instagram.com" target="_blank" aria-label="Instagram">
              <Instagram size={16} />
            </SocialButton>
            <SocialButton href="https://twitter.com" target="_blank" aria-label="Twitter">
              <Twitter size={16} />
            </SocialButton>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <SectionTitle>{t("quickLinks.title")}</SectionTitle>
          <LinkList>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/about">{t("quickLinks.about")}</Link>
            </LinkItem>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/contact">{t("quickLinks.contact")}</Link>
            </LinkItem>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/terms">{t("quickLinks.terms")}</Link>
            </LinkItem>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/privacy">{t("quickLinks.privacy")}</Link>
            </LinkItem>
          </LinkList>
        </FooterSection>

        <FooterSection>
          <SectionTitle>{t("services.title")}</SectionTitle>
          <LinkList>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/post-property">{t("services.postProperty")}</Link>
            </LinkItem>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/find-roommate">{t("services.findRoommate")}</Link>
            </LinkItem>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/register-agency">{t("services.registerAgency")}</Link>
            </LinkItem>
            <LinkItem>
              <ChevronRight size={12} />
              <Link href="/favorites">{t("services.savedProperties")}</Link>
            </LinkItem>
          </LinkList>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} dom.mk. {t("copyright")}
        </Copyright>
        <MadeWith>
          {t("madeWith")} <Heart size={12} />
        </MadeWith>
      </FooterBottom>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  background: #0c4240;
  color: white;
  padding: 2rem 0 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.5rem;
    padding: 0 1rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;

  svg {
    color: #4fd1c5;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: #4fd1c5;
    transform: translateY(-2px);
  }
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const LinkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;

  svg {
    color: #4fd1c5;
  }

  a {
    color: inherit;
    text-decoration: none;
    font-size: 0.85rem;
  }

  &:hover {
    color: white;
    transform: translateX(4px);
  }
`;

const FooterBottom = styled.div`
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    padding: 1rem;
  }
`;

const Copyright = styled.div``;

const MadeWith = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  svg {
    color: #ff6b6b;
  }
`; 