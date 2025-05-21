"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  FiSearch,
  FiMapPin,
  FiMenu,
  FiUser,
  FiX,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiFilter,
} from "react-icons/fi";
import { BiSolidBuildingHouse, BiUser } from "react-icons/bi";
import { BsPeopleFill, BsPersonCheck } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import Menu from "@/components/Menu/page";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface OnlineStatusProps {
  active: boolean;
}

interface VerifiedBadgeProps {
  verified: boolean;
}

export default function FindRoommatePage() {
  const t = useTranslations();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <Wrapper>
      <Menu />

      <PageHeader>
        <HeaderContent>
          <PageTitle>{t("Roommates.title")}</PageTitle>
          <PageSubtitle>{t("Roommates.subtitle")}</PageSubtitle>
          <PostMeButton href="/post-roommate-profile">
            <IoPersonOutline size={20} />
            {t("Roommates.postButton")}
          </PostMeButton>
        </HeaderContent>
      </PageHeader>

      <Main>
        <MobileFilterButton onClick={() => setShowFilters(!showFilters)}>
          <FiFilter size={20} />
          {t("Roommates.filters.title")}
        </MobileFilterButton>

        <Overlay show={showFilters} onClick={() => setShowFilters(false)} />
        
        <Sidebar show={showFilters}>
          <MobileFilterHeader>
            <FilterTitle>{t("Roommates.filters.title")}</FilterTitle>
            <CloseButton onClick={() => setShowFilters(false)}>
              <FiX size={24} />
            </CloseButton>
          </MobileFilterHeader>

          <Select>
            <option>{t("Roommates.filters.areas")}</option>
            <option>{t("Roommates.filters.cityCenter")}</option>
            <option>{t("Roommates.filters.karpos")}</option>
            <option>{t("Roommates.filters.aerodrom")}</option>
            <option>{t("Roommates.filters.gaziBaba")}</option>
          </Select>

          <FilterLabel>{t("Roommates.filters.maxBudget")}</FilterLabel>
          <Input type="number" placeholder="€" />

          <FilterLabel>{t("Roommates.filters.lookingFor")}</FilterLabel>
          <Select>
            <option>{t("Roommates.filters.any")}</option>
            <option>{t("Roommates.filters.roomInShared")}</option>
            <option>{t("Roommates.filters.entireApartment")}</option>
          </Select>

          <FilterLabel>{t("Roommates.filters.moveInDate")}</FilterLabel>
          <Input type="date" />

          <FilterLabel>{t("Roommates.filters.lifestyle")}</FilterLabel>
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox type="checkbox" id="nonSmoker" />
              <CheckboxLabel htmlFor="nonSmoker">
                {t("Roommates.filters.nonSmoker")}
              </CheckboxLabel>
            </CheckboxItem>
            <CheckboxItem>
              <Checkbox type="checkbox" id="petFriendly" />
              <CheckboxLabel htmlFor="petFriendly">
                {t("Roommates.filters.petFriendly")}
              </CheckboxLabel>
            </CheckboxItem>
            <CheckboxItem>
              <Checkbox type="checkbox" id="student" />
              <CheckboxLabel htmlFor="student">
                {t("Roommates.filters.student")}
              </CheckboxLabel>
            </CheckboxItem>
            <CheckboxItem>
              <Checkbox type="checkbox" id="professional" />
              <CheckboxLabel htmlFor="professional">
                {t("Roommates.filters.professional")}
              </CheckboxLabel>
            </CheckboxItem>
          </CheckboxGroup>
        </Sidebar>

        <ListArea>
          {[1, 2, 3, 4].map((i) => (
            <RoommateCard key={i}>
              <ProfileImageContainer>
                <ProfileImage src={`/profile.jpg`} alt="profile" />
                <OnlineStatus active={i % 2 === 0} />
              </ProfileImageContainer>
              <CardContent>
                <NameRow>
                  <Name>
                    {["Ana, 25", "Marco, 29", "Elena, 23", "Stefan, 27"][i - 1]}
                  </Name>
                  <VerifiedBadge verified={i !== 3}>
                    {i !== 3 ? <BsPersonCheck size={16} /> : null}
                    {i !== 3 ? t("Roommates.card.verified") : ""}
                  </VerifiedBadge>
                </NameRow>
                <Occupation>
                  {
                    [
                      "Graduate Student",
                      "Software Developer",
                      "Marketing Assistant",
                      "Architect",
                    ][i - 1]
                  }
                </Occupation>
                <InfoGrid>
                  <InfoItem>
                    <FiMapPin />
                    <span>
                      {t("Roommates.card.prefers")}{" "}
                      {
                        [
                          t("Roommates.filters.karpos"),
                          t("Roommates.filters.cityCenter"),
                          "Flexible location",
                          t("Roommates.filters.aerodrom"),
                        ][i - 1]
                      }
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FiDollarSign />
                    <span>
                      {t("Roommates.card.budget")}:{" "}
                      {
                        [
                          "€200-300/month",
                          "€350/month",
                          "€150-250/month",
                          "€300-400/month",
                        ][i - 1]
                      }
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FiCalendar />
                    <span>
                      {t("Roommates.card.available")}:{" "}
                      {["June 1st", "Immediately", "July 15th", "June 1st"][i - 1]}
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FiHome />
                    <span>
                      {t("Roommates.card.lookingFor")}:{" "}
                      {
                        [
                          t("Roommates.filters.roomInShared"),
                          t("Roommates.filters.entireApartment"),
                          t("Roommates.filters.roomInShared"),
                          t("Roommates.filters.entireApartment"),
                        ][i - 1]
                      }
                    </span>
                  </InfoItem>
                </InfoGrid>
                <ContactRow>
                  <ContactButton>
                    {t("Roommates.card.viewPhone")}
                  </ContactButton>
                  <ContactButton>
                    {t("Roommates.card.message")}
                  </ContactButton>
                </ContactRow>
              </CardContent>
            </RoommateCard>
          ))}
        </ListArea>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8f9;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #26825c 0%, #075448 100%);
  color: white;
  padding: 2rem 1rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const PostMeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #26825c;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 2rem;
    gap: 2rem;
  }
`;

const MobileFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Sidebar = styled.div<{ show: boolean }>`
  width: 100%;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  height: fit-content;

    @media (max-width: 767px) {    position: fixed;    top: 7%;    right: 0;    bottom: 0;    width: 85%;    max-width: 400px;    z-index: 100;    border-radius: 0;    overflow-y: auto;    transform: translateX(${props => props.show ? "0" : "100%"});    transition: transform 0.3s ease;    box-shadow: ${props => props.show ? "-5px 0 15px rgba(0, 0, 0, 0.1)" : "none"};  }

  @media (min-width: 768px) {
    width: 280px;
    position: sticky;
    top: 2rem;
  }
`;

const FilterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1a1a1a;
  letter-spacing: -0.2px;
`;

const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
`;

const Input = styled.input`  width: 100%;  height: 44px;  padding: 0 12px;  font-size: 14px;  border: 1px solid #e5e7eb;  border-radius: 8px;  margin-bottom: 16px;  color: #1a1a1a;  box-sizing: border-box;  &:focus {    outline: none;    border-color: #26825c;    box-shadow: 0 0 0 3px rgba(38, 130, 92, 0.1);  }`;

const Select = styled.select`  width: 100%;  height: 44px;  padding: 0 12px;  font-size: 14px;  border: 1px solid #e5e7eb;  border-radius: 8px;  margin-bottom: 16px;  color: #1a1a1a;  background-color: white;  appearance: none;  box-sizing: border-box;  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");  background-repeat: no-repeat;  background-position: right 12px center;  background-size: 16px;  &:focus {    outline: none;    border-color: #26825c;    box-shadow: 0 0 0 3px rgba(38, 130, 92, 0.1);  }`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }
`;

const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #26825c;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const ListArea = styled.div`
  flex: 1;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
`;

const RoommateCard = styled.div`
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  align-items: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 100px;
  min-width: 100px;
  height: 100px;
  margin: 1rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OnlineStatus = styled('div')<{ active: boolean }>`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#4CAF50" : "#bbb")};
  border: 2px solid white;
`;

const CardContent = styled.div`
  padding: 1.2rem;
  flex: 1;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2rem;
`;

const Name = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const VerifiedBadge = styled('div')<{ verified: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${(props) => (props.verified ? "#26825c" : "transparent")};
`;

const Occupation = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;

  svg {
    color: #26825c;
    min-width: 16px;
  }
`;

const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const ContactButton = styled.button`
  background: none;
  border: 1px solid #26825c;
  color: #26825c;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: #26825c;
    color: white;
  }
`;

const Overlay = styled.div<{ show: boolean }>`
  display: none;
  
  @media (max-width: 767px) {
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;
