"use client";

import styled from "styled-components";
import { useTranslations } from "next-intl";
import { Building2, Users, Star, Globe, Phone, Mail } from "lucide-react";
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <Wrapper>
      <Menu />
      
      <HeroSection>
        <HeroContent>
          <HeroTitle data-text={t("hero.title")}>{t("hero.title")}</HeroTitle>
          <HeroSubtitle>{t("hero.subtitle")}</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <Section>
          <SectionTitle>
            <Building2 size={24} />
            {t("mission.title")}
          </SectionTitle>
          <SectionText>{t("mission.description")}</SectionText>
          
          <StatsGrid>
            <StatCard>
              <StatIcon>
                <Building2 size={24} />
              </StatIcon>
              <StatNumber>10,000+</StatNumber>
              <StatLabel>{t("stats.properties")}</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>
                <Users size={24} />
              </StatIcon>
              <StatNumber>50,000+</StatNumber>
              <StatLabel>{t("stats.users")}</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon>
                <Star size={24} />
              </StatIcon>
              <StatNumber>98%</StatNumber>
              <StatLabel>{t("stats.satisfaction")}</StatLabel>
            </StatCard>
          </StatsGrid>
        </Section>

        <Section>
          <ImageGrid>
            <ImageCard>
              <CardImage src="/so.png" alt="Office" />
              <CardOverlay>
                <CardTitle>{t("services.residential")}</CardTitle>
              </CardOverlay>
            </ImageCard>
            <ImageCard>
              <CardImage src="/so.png" alt="Commercial" />
              <CardOverlay>
                <CardTitle>{t("services.commercial")}</CardTitle>
              </CardOverlay>
            </ImageCard>
            <ImageCard>
              <CardImage src="/so.png" alt="Luxury" />
              <CardOverlay>
                <CardTitle>{t("services.luxury")}</CardTitle>
              </CardOverlay>
            </ImageCard>
          </ImageGrid>
        </Section>

        <Section>
          <SectionTitle>
            <Users size={24} />
            {t("team.title")}
          </SectionTitle>
          <SectionText>{t("team.description")}</SectionText>
          
          <TeamGrid>
            {[1, 2, 3, 4].map((member) => (
              <TeamMember key={member}>
                <MemberImage src="/so.png" alt={`Team member ${member}`} />
                <MemberInfo>
                  <MemberName>{t(`team.members.${member}.name`)}</MemberName>
                  <MemberRole>{t(`team.members.${member}.role`)}</MemberRole>
                </MemberInfo>
              </TeamMember>
            ))}
          </TeamGrid>
        </Section>

        <Section>
          <SectionTitle>
            <Globe size={24} />
            {t("contact.title")}
          </SectionTitle>
          <ContactGrid>
            <ContactCard>
              <ContactIcon>
                <Phone size={24} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>{t("contact.phone")}</ContactLabel>
                <ContactValue>+389 70 123 456</ContactValue>
              </ContactInfo>
            </ContactCard>
            <ContactCard>
              <ContactIcon>
                <Mail size={24} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>{t("contact.email")}</ContactLabel>
                <ContactValue>contact@dom.mk</ContactValue>
              </ContactInfo>
            </ContactCard>
            <ContactCard>
              <ContactIcon>
                <Building2 size={24} />
              </ContactIcon>
              <ContactInfo>
                <ContactLabel>{t("contact.address")}</ContactLabel>
                <ContactValue>Skopje City Center, 1000</ContactValue>
              </ContactInfo>
            </ContactCard>
          </ContactGrid>
        </Section>
      </MainContent>

      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const HeroSection = styled.div`
  background: linear-gradient(rgba(12, 66, 64, 0.9), rgba(12, 66, 64, 0.9)),
    url('/so.png') center/cover;
  color: white;
  padding: 8rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(12, 66, 64, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #ffffff 0%, #a8e6cf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 2px;
    top: 2px;
    background: linear-gradient(135deg, #0c4240 0%, #27795b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: -1;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.8rem 1.5rem;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #0c4240;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #0c4240;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #f5f9f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    color: #0c4240;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #0c4240;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MemberImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const MemberInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const MemberName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
`;

const MemberRole = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ContactIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #f5f9f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #0c4240;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #0c4240;
`; 