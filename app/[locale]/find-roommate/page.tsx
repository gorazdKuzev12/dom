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
} from "react-icons/fi";
import { BiSolidBuildingHouse, BiUser } from "react-icons/bi";
import { BsPeopleFill, BsPersonCheck } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import Menu from "@/components/Menu/page";
import Link from "next/link";

export default function FindRoommatePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <Wrapper>
      <Menu />

      <PageHeader>
        <HeaderContent>
          <PageTitle>Find Your Perfect Roommate</PageTitle>
          <PageSubtitle>
            Connect with people looking for shared living spaces
          </PageSubtitle>
          <PostMeButton href="/post-roommate-profile">
            <IoPersonOutline size={20} />
            Post Me as Looking for Room
          </PostMeButton>
        </HeaderContent>
      </PageHeader>

      <Main>
        <Sidebar>
          <FilterTitle>Filters</FilterTitle>
          <Select>
            <option>All Areas</option>
            <option>City Center</option>
            <option>Karpoš</option>
            <option>Aerodrom</option>
            <option>Gazi Baba</option>
          </Select>
          <Input type="number" placeholder="Max budget (€/month)" />
          <FilterLabel>Looking for</FilterLabel>
          <Select>
            <option>Any</option>
            <option>Room in shared apartment</option>
            <option>Entire apartment with roommate</option>
          </Select>
          <FilterLabel>Move-in date</FilterLabel>
          <Input type="date" />
          <FilterLabel>Lifestyle</FilterLabel>
          <CheckboxGroup>
            <CheckboxLabel>
              <input type="checkbox" /> Non-smoker
            </CheckboxLabel>
            <CheckboxLabel>
              <input type="checkbox" /> Pet friendly
            </CheckboxLabel>
            <CheckboxLabel>
              <input type="checkbox" /> Student
            </CheckboxLabel>
            <CheckboxLabel>
              <input type="checkbox" /> Professional
            </CheckboxLabel>
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
                    {i !== 3 ? "Verified" : ""}
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
                      {
                        [
                          "Prefers Karpoš area",
                          "Looking in City Center",
                          "Flexible location",
                          "Prefers Aerodrom",
                        ][i - 1]
                      }
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FiDollarSign />
                    <span>
                      {
                        [
                          "Budget: €200-300/month",
                          "Budget: up to €350/month",
                          "Budget: €150-250/month",
                          "Budget: €300-400/month",
                        ][i - 1]
                      }
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FiCalendar />
                    <span>
                      {
                        [
                          "Available from June 1st",
                          "Available immediately",
                          "Available from July 15th",
                          "Available from June 1st",
                        ][i - 1]
                      }
                    </span>
                  </InfoItem>
                  <InfoItem>
                    <FiHome />
                    <span>
                      {
                        [
                          "Looking for: Room in shared apt",
                          "Looking for: Entire apt with roommate",
                          "Looking for: Room in shared apt",
                          "Looking for: Entire apt with roommate",
                        ][i - 1]
                      }
                    </span>
                  </InfoItem>
                </InfoGrid>
                <Description>
                  {
                    [
                      "I'm a clean and quiet student looking for a shared apartment. I enjoy cooking and occasional social gatherings but respect privacy. Non-smoker and pet-friendly.",
                      "Easy-going professional working remote. I'm tidy, sociable but not a party person. Looking for similar roommate to share expenses in a nice area.",
                      "Part-time student and working. I'm organized, friendly and enjoy both social time and quiet evenings. Prefer living with other females.",
                      "Young professional seeking a roommate to find a new place together. I'm into fitness, cooking, and weekend hiking trips. Looking for someone with similar interests.",
                    ][i - 1]
                  }
                </Description>
                <ContactRow>
                  <ContactButton>📞 View phone</ContactButton>
                  <ContactButton>💬 Message</ContactButton>
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
  padding: 3rem 2rem;
  text-align: center;
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const PostMeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #6e8efb;
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
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FilterLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #444;
`;

const ListArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  color: #222;
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${(props) => (props.verified ? "#4CAF50" : "transparent")};
`;

const Occupation = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;

  svg {
    color: #6e8efb;
    min-width: 16px;
  }
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #444;
  line-height: 1.5;
  margin: 0.5rem 0 1rem;
`;

const ContactRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 1rem;
`;

const ContactButton = styled.button`
  background: none;
  border: 1px solid #6e8efb;
  color: #6e8efb;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6e8efb;
    color: white;
  }
`;
const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  min-width: 120px;
  height: 120px;
  margin: 1.2rem 0 1.2rem 1.2rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OnlineStatus = styled.div`
  position: absolute;
  bottom: 10px;
  right: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#4CAF50" : "#bbb")};
  border: 2px solid white;
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
