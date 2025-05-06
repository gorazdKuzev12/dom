"use client";

import styled from "styled-components";
import { useState } from "react";
import {
  Home,
  Menu,
  X,
  Key,
  DollarSign,
  Square,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image,
  FileText,
  Check,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Info,
} from "lucide-react";

export default function RegisterAgencyPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    zipCode: "",
    contactPerson: "",
    contactRole: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    taxId: "",
    agencySize: "small",
    specializations: [],
    logo: null,
    description: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "agreeTerms") {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle specializations checkboxes
        const updatedSpecializations = [...formData.specializations];
        if (checked) {
          updatedSpecializations.push(value);
        } else {
          const index = updatedSpecializations.indexOf(value);
          if (index > -1) {
            updatedSpecializations.splice(index, 1);
          }
        }
        setFormData({ ...formData, specializations: updatedSpecializations });
      }
    } else if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd submit the form data to your API
    alert("Registration submitted successfully!");
    console.log(formData);
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const specializations = [
    "Residential Sales",
    "Residential Rentals",
    "Commercial Properties",
    "Office Spaces",
    "Vacation Rentals",
    "Luxury Properties",
    "International Properties",
    "Property Management",
  ];

  return (
    <Wrapper>
      <Navbar>
        <Logo href="/">
          <Home size={20} />
          <span>dom.mk</span>
        </Logo>
        <NavLinks>
          <NavItem>
            <DollarSign size={16} /> Buy
          </NavItem>
          <NavItem>
            <Key size={16} /> Rent
          </NavItem>
          <NavItem>
            <Square size={16} /> Sell
          </NavItem>
        </NavLinks>
        <MenuRight>
          <LangSelect>
            <option>English</option>
            <option>Македонски</option>
          </LangSelect>
          <MenuToggle onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </MenuToggle>
        </MenuRight>
      </Navbar>

      {showMenu && (
        <MobileMenu>
          <MobileMenuItem>
            <DollarSign size={16} /> Buy
          </MobileMenuItem>
          <MobileMenuItem>
            <Key size={16} /> Rent
          </MobileMenuItem>
          <MobileMenuItem>
            <Square size={16} /> Sell
          </MobileMenuItem>
        </MobileMenu>
      )}

      <PageHeader>
        <PageTitle>Register Your Real Estate Agency</PageTitle>
        <PageSubtitle>
          Join dom.mk's network of trusted real estate professionals
        </PageSubtitle>
      </PageHeader>

      <ContentContainer>
        <FormContainer>
          <ProgressBar>
            <ProgressStep active={step >= 1} completed={step > 1}>
              <StepCircle active={step >= 1} completed={step > 1}>
                {step > 1 ? <Check size={16} /> : "1"}
              </StepCircle>
              <StepLabel active={step >= 1}>Agency Information</StepLabel>
            </ProgressStep>
            <ProgressLine completed={step > 1} />
            <ProgressStep active={step >= 2} completed={step > 2}>
              <StepCircle active={step >= 2} completed={step > 2}>
                {step > 2 ? <Check size={16} /> : "2"}
              </StepCircle>
              <StepLabel active={step >= 2}>Account Details</StepLabel>
            </ProgressStep>
            <ProgressLine completed={step > 2} />
            <ProgressStep active={step >= 3}>
              <StepCircle active={step >= 3}>
                {step > 3 ? <Check size={16} /> : "3"}
              </StepCircle>
              <StepLabel active={step >= 3}>Profile Setup</StepLabel>
            </ProgressStep>
          </ProgressBar>

          <FormSection>
            {step === 1 && (
              <>
                <SectionTitle>
                  <Building size={20} />
                  Agency Information
                </SectionTitle>
                <FormGroup>
                  <Label htmlFor="companyName">Company Name*</Label>
                  <Input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your agency's legal name"
                    required
                  />
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="email">Business Email*</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="office@youragency.com"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="phone">Business Phone*</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="website">Website</Label>
                  <InputWithIcon>
                    <Globe size={16} />
                    <Input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://youragency.com"
                    />
                  </InputWithIcon>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="address">Office Address*</Label>
                  <InputWithIcon>
                    <MapPin size={16} />
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street Address"
                      required
                    />
                  </InputWithIcon>
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="city">City*</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="zipCode">Zip/Postal Code*</Label>
                    <Input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Zip/Postal Code"
                      required
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="contactPerson">Contact Person*</Label>
                    <InputWithIcon>
                      <User size={16} />
                      <Input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                      />
                    </InputWithIcon>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="contactRole">Role/Position*</Label>
                    <Input
                      type="text"
                      id="contactRole"
                      name="contactRole"
                      value={formData.contactRole}
                      onChange={handleChange}
                      placeholder="e.g. Owner, Manager"
                      required
                    />
                  </FormGroup>
                </FormRow>

                <ButtonContainer>
                  <Button primary onClick={nextStep}>
                    Continue <ArrowRight size={16} />
                  </Button>
                </ButtonContainer>
              </>
            )}

            {step === 2 && (
              <>
                <SectionTitle>
                  <User size={20} />
                  Account Details
                </SectionTitle>

                <FormRow>
                  <FormGroup>
                    <Label htmlFor="password">Password*</Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                    />
                    <HelperText>
                      <Info size={14} />
                      Must be at least 8 characters with letters, numbers, and
                      symbols
                    </HelperText>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="confirmPassword">Confirm Password*</Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="licenseNumber">
                    Real Estate License Number*
                  </Label>
                  <Input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Your agency's license number"
                    required
                  />
                  <HelperText>
                    <Info size={14} />
                    We'll verify this information before approving your account
                  </HelperText>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="taxId">
                    Tax ID / Business Registration Number*
                  </Label>
                  <Input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Business tax identification number"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Agency Size*</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input
                        type="radio"
                        id="small"
                        name="agencySize"
                        value="small"
                        checked={formData.agencySize === "small"}
                        onChange={handleChange}
                      />
                      <label htmlFor="small">Small (1-5 agents)</label>
                    </RadioOption>
                    <RadioOption>
                      <input
                        type="radio"
                        id="medium"
                        name="agencySize"
                        value="medium"
                        checked={formData.agencySize === "medium"}
                        onChange={handleChange}
                      />
                      <label htmlFor="medium">Medium (6-20 agents)</label>
                    </RadioOption>
                    <RadioOption>
                      <input
                        type="radio"
                        id="large"
                        name="agencySize"
                        value="large"
                        checked={formData.agencySize === "large"}
                        onChange={handleChange}
                      />
                      <label htmlFor="large">Large (21+ agents)</label>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <ButtonContainer>
                  <Button secondary onClick={prevStep}>
                    Back
                  </Button>
                  <Button primary onClick={nextStep}>
                    Continue <ArrowRight size={16} />
                  </Button>
                </ButtonContainer>
              </>
            )}

            {step === 3 && (
              <>
                <SectionTitle>
                  <FileText size={20} />
                  Profile Setup
                </SectionTitle>

                <FormGroup>
                  <Label htmlFor="logo">Company Logo</Label>
                  <FileUploadBox>
                    <Image size={24} />
                    <FileUploadText>
                      {formData.logo
                        ? formData.logo.name
                        : "Drag and drop or click to upload"}
                    </FileUploadText>
                    <FileUploadInput
                      type="file"
                      id="logo"
                      name="logo"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <FileUploadButton>Browse Files</FileUploadButton>
                  </FileUploadBox>
                  <HelperText>
                    <Info size={14} />
                    Recommended size: 400x400px, JPG or PNG format
                  </HelperText>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell potential clients about your agency, your values, and what makes you special..."
                    rows={5}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Specializations</Label>
                  <p>Select all areas your agency specializes in:</p>
                  <CheckboxGrid>
                    {specializations.map((spec) => (
                      <CheckboxOption key={spec}>
                        <input
                          type="checkbox"
                          id={spec.replace(/\s+/g, "")}
                          name="specializations"
                          value={spec}
                          checked={formData.specializations.includes(spec)}
                          onChange={handleChange}
                        />
                        <label htmlFor={spec.replace(/\s+/g, "")}>{spec}</label>
                      </CheckboxOption>
                    ))}
                  </CheckboxGrid>
                </FormGroup>

                <FormGroup>
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="agreeTerms">
                      I agree to dom.mk's{" "}
                      <TermsLink>Terms of Service</TermsLink> and{" "}
                      <TermsLink>Privacy Policy</TermsLink>
                    </label>
                  </CheckboxOption>
                </FormGroup>

                <InfoBox>
                  <AlertCircle size={18} />
                  <div>
                    <strong>Before you submit:</strong>
                    <p>
                      Your application will be reviewed by our team. The
                      verification process usually takes 1-2 business days.
                      We'll notify you by email once your agency account is
                      approved.
                    </p>
                  </div>
                </InfoBox>

                <ButtonContainer>
                  <Button secondary onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    primary
                    onClick={handleSubmit}
                    disabled={!formData.agreeTerms}
                  >
                    Submit Registration
                  </Button>
                </ButtonContainer>
              </>
            )}
          </FormSection>
        </FormContainer>

        <Sidebar>
          <InfoCard>
            <InfoCardTitle>
              <HelpCircle size={20} />
              Why Join dom.mk?
            </InfoCardTitle>
            <BenefitsList>
              <BenefitItem>
                <Check size={16} />
                <span>Access to thousands of potential clients</span>
              </BenefitItem>
              <BenefitItem>
                <Check size={16} />
                <span>User-friendly property management system</span>
              </BenefitItem>
              <BenefitItem>
                <Check size={16} />
                <span>Enhanced visibility in search results</span>
              </BenefitItem>
              <BenefitItem>
                <Check size={16} />
                <span>Dedicated agency profile page</span>
              </BenefitItem>
              <BenefitItem>
                <Check size={16} />
                <span>Real-time analytics and reporting</span>
              </BenefitItem>
            </BenefitsList>
          </InfoCard>

          <InfoCard>
            <InfoCardTitle>
              <Info size={20} />
              Need Help?
            </InfoCardTitle>
            <SupportText>
              Have questions about the registration process? Our support team is
              here to help.
            </SupportText>
            <ContactOptions>
              <ContactOption>
                <Mail size={16} />
                <span>support@dom.mk</span>
              </ContactOption>
              <ContactOption>
                <Phone size={16} />
                <span>+389 2 123 4567</span>
              </ContactOption>
            </ContactOptions>
          </InfoCard>
        </Sidebar>
      </ContentContainer>

      <Footer>
        <FooterContent>
          <FooterLogo>
            <Home size={16} />
            <span>dom.mk</span>
          </FooterLogo>
          <FooterLinks>
            <FooterLink>About</FooterLink>
            <FooterLink>Terms</FooterLink>
            <FooterLink>Privacy</FooterLink>
            <FooterLink>Contact</FooterLink>
          </FooterLinks>
          <FooterCopyright>© 2025 dom.mk. All rights reserved.</FooterCopyright>
        </FooterContent>
      </Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #f8f9fa;
  font-family: "Inter", "Segoe UI", sans-serif;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #0066ff;
    background: #f0f7ff;
  }
`;

const MenuRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LangSelect = styled.select`
  border: none;
  font-size: 0.9rem;
  background: none;
  color: #444;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const MenuToggle = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuItem = styled.button`
  background: none;
  border: none;
  text-align: left;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;

  &:hover {
    background: #f5f5f5;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-bottom: 1px solid #eee;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
  flex-grow: 1;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  transition: opacity 0.3s ease;

  @media (max-width: 640px) {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    gap: 1rem;
  }
`;

const StepCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) =>
    props.completed ? "#0066ff" : props.active ? "#0066ff" : "#e1e5eb"};
  color: ${(props) => (props.active ? "white" : "#777")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const StepLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${(props) => (props.active ? "#222" : "#777")};
  transition: color 0.3s ease;
`;

const ProgressLine = styled.div`
  flex-grow: 1;
  height: 2px;
  background: ${(props) => (props.completed ? "#0066ff" : "#e1e5eb")};
  margin: 0 0.5rem;
  transition: background 0.3s ease;

  @media (max-width: 640px) {
    display: none;
  }
`;

const FormSection = styled.form`
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const InputWithIcon = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #777;
  }

  input {
    padding-left: 2.5rem;
  }
`;

const HelperText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="radio"] {
    accent-color: #0066ff;
    width: 16px;
    height: 16px;
  }

  input[type="checkbox"] {
    accent-color: #0066ff;
    width: 16px;
    height: 16px;
  }

  label {
    font-size: 0.95rem;
    cursor: pointer;
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    accent-color: #0066ff;
    width: 16px;
    height: 16px;
  }

  label {
    font-size: 0.95rem;
    cursor: pointer;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const FileUploadBox = styled.div`
  border: 2px dashed #ddd;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0066ff;
    background: #f0f7ff;
  }
`;

const FileUploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const FileUploadText = styled.p`
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
`;

const FileUploadButton = styled.button`
  background: #f0f7ff;
  color: #0066ff;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: ${(props) => (props.primary ? "#0066ff" : "transparent")};
  color: ${(props) => (props.primary ? "white" : "#0066ff")};
  border: 2px solid #0066ff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.primary ? "#0056d2" : "#e6f0ff")};
    border-color: #0056d2;
  }

  &:disabled {
    background: #ccc;
    border-color: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  display: flex;
  gap: 1rem;
  background: #fff8e1;
  border: 1px solid #ffecb3;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
  font-size: 0.95rem;
  color: #444;
`;

const TermsLink = styled.a`
  color: #0066ff;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const InfoCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

const SupportText = styled.p`
  font-size: 0.95rem;
  color: #555;
`;

const ContactOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ContactOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

const Footer = styled.footer`
  background: white;
  padding: 2rem 1.5rem;
  border-top: 1px solid #eee;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
`;

const FooterLogo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #666;

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      color: #0066ff;
    }
  }
`;

const FooterLink = styled.a``;

const FooterCopyright = styled.div`
  font-size: 0.85rem;
  color: #888;
`;
