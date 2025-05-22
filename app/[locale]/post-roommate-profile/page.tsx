"use client";

import { useState } from "react";
import styled from "styled-components";
import { FiArrowLeft, FiUpload, FiCheck, FiInfo } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import Menu from "@/components/Menu/page";
import Link from "next/link";
import Footer from "@/components/Footer/page";

export default function PostRoommateProfilePage() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [formStep, setFormStep] = useState(1);

  const handleImageUpload = (e) => {
    // This would normally handle file upload
    setProfilePicture("/profile-placeholder.png");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setFormStep(2);
  };

  return (
    <Wrapper>
      <Menu />

      <PageHeader>
        <HeaderContent>
          <BackLink href="/find-roommate">
            <FiArrowLeft /> Back to Roommate Finder
          </BackLink>
          <PageTitle>Create Your Roommate Profile</PageTitle>
          <PageSubtitle>
            Share details about yourself to find the perfect match
          </PageSubtitle>
        </HeaderContent>
      </PageHeader>

      <Main>
        {formStep === 1 ? (
          <FormContainer onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Profile Picture</SectionTitle>
              <ProfileUploadArea>
                {profilePicture ? (
                  <ProfilePreview src={profilePicture} alt="Profile Preview" />
                ) : (
                  <UploadPlaceholder>
                    <IoPersonOutline size={40} />
                    <span>Upload Photo</span>
                  </UploadPlaceholder>
                )}
                <UploadButton>
                  <FiUpload /> Choose Photo
                  <HiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </UploadButton>
              </ProfileUploadArea>
            </FormSection>

            <FormSection>
              <SectionTitle>Personal Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>First Name *</Label>
                  <Input type="text" required />
                </FormGroup>
                <FormGroup>
                  <Label>Age *</Label>
                  <Input type="number" min="18" max="99" required />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label>Occupation *</Label>
                <Input
                  type="text"
                  placeholder="Student, Professional, etc."
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>About Me *</Label>
                <Textarea
                  placeholder="Describe yourself, your lifestyle, and what you're looking for in a roommate or living arrangement..."
                  rows={4}
                  required
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Housing Preferences</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>I'm Looking For *</Label>
                  <Select required>
                    <option value="">Select an option</option>
                    <option>Room in shared apartment</option>
                    <option>Entire apartment with roommate</option>
                    <option>Either option works for me</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Budget Range (€/month) *</Label>
                  <FormRow>
                    <Input type="number" placeholder="Min" required />
                    <Input type="number" placeholder="Max" required />
                  </FormRow>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label>Preferred Areas *</Label>
                  <Select required>
                    <option value="">Select area</option>
                    <option>City Center</option>
                    <option>Karpoš</option>
                    <option>Aerodrom</option>
                    <option>Gazi Baba</option>
                    <option>Any area is fine</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Move-in Date *</Label>
                  <Input type="date" required />
                </FormGroup>
              </FormRow>
            </FormSection>

            <FormSection>
              <SectionTitle>Lifestyle</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>I am a</Label>
                  <Select>
                    <option>Non-smoker</option>
                    <option>Smoker (outdoors only)</option>
                    <option>Smoker</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Pets</Label>
                  <Select>
                    <option>No pets</option>
                    <option>I have pets</option>
                    <option>I'm pet friendly</option>
                  </Select>
                </FormGroup>
              </FormRow>
              <Label>Lifestyle Habits</Label>
              <CheckboxGrid>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Early riser</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Night owl</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Work from home</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Frequently out</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Enjoy cooking</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Regular guests</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Quiet/private</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input type="checkbox" />
                  <span>Social/outgoing</span>
                </CheckboxLabel>
              </CheckboxGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Contact Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Email *</Label>
                  <Input type="email" required />
                </FormGroup>
                <FormGroup>
                  <Label>Phone Number *</Label>
                  <Input type="tel" required />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <PrivacyNote>
                  <FiInfo />
                  <span>
                    Your contact details will only be visible to verified
                    property owners/agents
                  </span>
                </PrivacyNote>
              </FormGroup>
            </FormSection>

            <SubmitButton type="submit">Post My Roommate Profile</SubmitButton>
          </FormContainer>
        ) : (
          <SuccessContainer>
            <SuccessIcon>
              <FiCheck size={50} />
            </SuccessIcon>
            <SuccessTitle>Your profile has been posted!</SuccessTitle>
            <SuccessMessage>
              Your roommate profile is now live. Property owners and agents
              looking for tenants can now contact you.
            </SuccessMessage>
            <ButtonGroup>
              <ViewProfileButton>View My Profile</ViewProfileButton>
              <BackToListingButton href="/find-roommate">
                Back to Roommate Finder
              </BackToListingButton>
            </ButtonGroup>
          </SuccessContainer>
        )}
      </Main>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8f9;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  padding: 2rem;
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const Main = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #333;
`;

const ProfileUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const UploadPlaceholder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  gap: 0.5rem;
`;

const ProfilePreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #6e8efb;
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #6e8efb;
  color: white;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #5a7de5;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
`;

const Input = styled.input`
  padding: 0.7rem;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.7rem;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.7rem;
  font-size: 0.95rem;
  border: 1px solid #ddd;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.2);
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #444;
  padding: 0.3rem 0;
`;

const PrivacyNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  background: #f5f7fa;
  padding: 0.7rem;
  border-radius: 8px;
  border-left: 3px solid #6e8efb;
`;

const SubmitButton = styled.button`
  background: #6e8efb;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);

  &:hover {
    background: #5a7de5;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(110, 142, 251, 0.4);
  }
`;

const SuccessContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e6f7ef;
  color: #47c479;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuccessTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 700;
  color: #333;
`;

const SuccessMessage = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ViewProfileButton = styled.button`
  background: #6e8efb;
  color: white;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #5a7de5;
  }
`;

const BackToListingButton = styled(Link)`
  background: white;
  color: #6e8efb;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border: 1px solid #6e8efb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f4ff;
  }
`;
