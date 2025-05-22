"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FiMail, FiPhone, FiGlobe, FiMapPin, FiUser, FiLock, FiBriefcase, FiUpload, FiCheck, FiInfo, FiArrowRight } from "react-icons/fi";
import Menu from "@/components/Menu/page";
import { useRouter } from "next/navigation";

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  zipCode: string;
  contactPerson: string;
  contactRole: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
  taxId: string;
  agencySize: "small" | "medium" | "large";
  logo: File | null;
  description: string;
  specializations: string[];
  agreeTerms: boolean;
}

export default function RegisterAgencyPage() {
  const t = useTranslations("AgencyRegistration");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
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
    logo: null,
    description: "",
    specializations: [],
    agreeTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setFormData(prev => ({ ...prev, [name]: fileInput.files![0] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => {
      const specializations = prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization];
      return { ...prev, specializations };
    });
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.companyName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
          setError(t("errors.requiredFields"));
          return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          setError(t("errors.invalidEmail"));
          return false;
        }
        break;
      case 2:
        if (!formData.contactPerson || !formData.contactRole || !formData.password || !formData.confirmPassword || !formData.licenseNumber || !formData.taxId) {
          setError(t("errors.requiredFields"));
          return false;
        }
        if (formData.password.length < 8) {
          setError(t("errors.passwordLength"));
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t("errors.passwordMismatch"));
          return false;
        }
        break;
      case 3:
        if (!formData.description || formData.specializations.length === 0) {
          setError(t("errors.requiredFields"));
          return false;
        }
        if (!formData.agreeTerms) {
          setError(t("errors.agreeTerms"));
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
      setError("");
    }
  };

  const prevStep = () => {
    setStep(s => s - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setLoading(true);
    setError("");

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (key === "specializations") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await fetch("/api/register-agency", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to success page or dashboard
      router.push("/agency-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setLoading(false);
    }
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
    <PageWrapper>
      <Menu />
      <MainContent>
        <Header>
          <Title>{t("title")}</Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Header>

        <ContentContainer>
          <FormContainer>
            <ProgressBar>
              <ProgressStep active={step >= 1} completed={step > 1}>
                <StepCircle active={step >= 1} completed={step > 1}>
                  {step > 1 ? <FiCheck size={16} /> : "1"}
                </StepCircle>
                <StepLabel active={step >= 1}>{t("steps.agencyInfo")}</StepLabel>
              </ProgressStep>
              <ProgressLine completed={step > 1} />
              <ProgressStep active={step >= 2} completed={step > 2}>
                <StepCircle active={step >= 2} completed={step > 2}>
                  {step > 2 ? <FiCheck size={16} /> : "2"}
                </StepCircle>
                <StepLabel active={step >= 2}>{t("steps.accountDetails")}</StepLabel>
              </ProgressStep>
              <ProgressLine completed={step > 2} />
              <ProgressStep active={step >= 3}>
                <StepCircle active={step >= 3}>3</StepCircle>
                <StepLabel active={step >= 3}>{t("steps.profileSetup")}</StepLabel>
              </ProgressStep>
            </ProgressBar>

            <FormSection onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <StepContent>
                  <FormGroup>
                    <Label>
                      <FiBriefcase size={16} />
                      {t("form.companyName")}
                    </Label>
                    <Input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder={t("form.companyNamePlaceholder")}
                      required
                    />
                  </FormGroup>

                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FiMail size={16} />
                        {t("form.email")}
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("form.emailPlaceholder")}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <FiPhone size={16} />
                        {t("form.phone")}
                      </Label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("form.phonePlaceholder")}
                        required
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FiGlobe size={16} />
                        {t("form.website")}
                      </Label>
                      <Input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder={t("form.websitePlaceholder")}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <FiMapPin size={16} />
                        {t("form.address")}
                      </Label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={t("form.addressPlaceholder")}
                        required
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>{t("form.city")}</Label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={t("form.cityPlaceholder")}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>{t("form.zipCode")}</Label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder={t("form.zipCodePlaceholder")}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                </StepContent>
              )}

              {step === 2 && (
                <StepContent>
                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FiUser size={16} />
                        {t("form.contactPerson")}
                      </Label>
                      <Input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder={t("form.contactPersonPlaceholder")}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>{t("form.contactRole")}</Label>
                      <Input
                        type="text"
                        name="contactRole"
                        value={formData.contactRole}
                        onChange={handleChange}
                        placeholder={t("form.contactRolePlaceholder")}
                        required
                      />
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>
                      <FiLock size={16} />
                      {t("form.password")}
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t("form.passwordPlaceholder")}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <FiLock size={16} />
                      {t("form.confirmPassword")}
                    </Label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t("form.confirmPasswordPlaceholder")}
                      required
                    />
                  </FormGroup>

                  <FormRow>
                    <FormGroup>
                      <Label>{t("form.licenseNumber")}</Label>
                      <Input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder={t("form.licenseNumberPlaceholder")}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>{t("form.taxId")}</Label>
                      <Input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                        placeholder={t("form.taxIdPlaceholder")}
                        required
                      />
                    </FormGroup>
                  </FormRow>
                </StepContent>
              )}

              {step === 3 && (
                <StepContent>
                  <FormGroup>
                    <Label>{t("form.agencySize")}</Label>
                    <Select
                      name="agencySize"
                      value={formData.agencySize}
                      onChange={handleChange}
                      required
                    >
                      <option value="small">{t("form.agencySizeOptions.small")}</option>
                      <option value="medium">{t("form.agencySizeOptions.medium")}</option>
                      <option value="large">{t("form.agencySizeOptions.large")}</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <FiUpload size={16} />
                      {t("form.logo")}
                    </Label>
                    <FileUpload>
                      <input
                        type="file"
                        name="logo"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <UploadButton type="button">
                        {t("form.uploadLogo")}
                      </UploadButton>
                    </FileUpload>
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("form.description")}</Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={t("form.descriptionPlaceholder")}
                      rows={4}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("form.specializations")}</Label>
                    <SpecializationGrid>
                      {specializations.map((spec) => (
                        <SpecializationItem key={spec}>
                          <Checkbox
                            type="checkbox"
                            id={spec}
                            checked={formData.specializations.includes(spec)}
                            onChange={() => handleSpecializationToggle(spec)}
                          />
                          <label htmlFor={spec}>{spec}</label>
                        </SpecializationItem>
                      ))}
                    </SpecializationGrid>
                  </FormGroup>

                  <FormGroup>
                    <CheckboxWrapper>
                      <Checkbox
                        type="checkbox"
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={(e) =>
                          setFormData({ ...formData, agreeTerms: e.target.checked })
                        }
                        required
                      />
                      <CheckboxLabel htmlFor="agreeTerms">
                        {t("form.agreeTerms")}
                      </CheckboxLabel>
                    </CheckboxWrapper>
                  </FormGroup>
                </StepContent>
              )}

              <ButtonGroup>
                {step > 1 && (
                  <SecondaryButton type="button" onClick={prevStep}>
                    {t("buttons.back")}
                  </SecondaryButton>
                )}
                {step < 3 ? (
                  <PrimaryButton type="button" onClick={nextStep}>
                    {t("buttons.next")}
                    <FiArrowRight size={16} />
                  </PrimaryButton>
                ) : (
                  <PrimaryButton type="submit" onClick={handleSubmit}>
                    {t("buttons.submit")}
                    <FiCheck size={16} />
                  </PrimaryButton>
                )}
              </ButtonGroup>
            </FormSection>
          </FormContainer>

          <Sidebar>
            <BenefitsCard>
              <CardTitle>
                <FiCheck size={20} />
                {t("benefits.title")}
              </CardTitle>
              <BenefitsList>
                {[
                  "exposure",
                  "tools",
                  "analytics",
                  "support",
                  "marketing",
                  "network"
                ].map((key) => (
                  <BenefitItem key={key}>
                    <FiCheck size={16} />
                    <span>{t(`benefits.items.${key}`)}</span>
                  </BenefitItem>
                ))}
              </BenefitsList>
            </BenefitsCard>
          </Sidebar>
        </ContentContainer>
      </MainContent>
      {error && (
        <ErrorMessage>
          <FiInfo size={16} />
          {error}
        </ErrorMessage>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const MainContent = styled.main`
  padding-bottom: 4rem;
`;

const Header = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;

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
  background: #f8f9fa;
  border-bottom: 1px solid #eee;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ProgressStep = styled.div<{ active: boolean; completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: ${props => props.active ? 1 : 0.5};
  transition: opacity 0.3s ease;

  @media (max-width: 640px) {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    gap: 1rem;
  }
`;

const StepCircle = styled.div<{ active: boolean; completed?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props =>
    props.completed ? "#0c4240" : props.active ? "#0c4240" : "#e1e5eb"};
  color: ${props => (props.active ? "white" : "#777")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const StepLabel = styled.div<{ active: boolean }>`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => (props.active ? "#0c4240" : "#777")};
  transition: color 0.3s ease;
`;

const ProgressLine = styled.div<{ completed: boolean }>`
  flex-grow: 1;
  height: 2px;
  background: ${props => (props.completed ? "#0c4240" : "#e1e5eb")};
  margin: 0 0.5rem;
  transition: background 0.3s ease;

  @media (max-width: 640px) {
    display: none;
  }
`;

const FormSection = styled.form`
  padding: 2rem;
`;

const Sidebar = styled.div`
  @media (max-width: 992px) {
    grid-row: 1;
  }
`;

const BenefitsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px;

  @media (max-width: 992px) {
    display: none;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #0c4240;
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
  color: #444;

  svg {
    color: #0c4240;
    flex-shrink: 0;
    margin-top: 0.2rem;
  }

  span {
    flex: 1;
  }
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #444;

  svg {
    color: #0c4240;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 2px rgba(12, 66, 64, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 2px rgba(12, 66, 64, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 2px rgba(12, 66, 64, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const FileUpload = styled.div`
  position: relative;

  input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const UploadButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #f5f9f9;
  border: 1px dashed #0c4240;
  border-radius: 6px;
  color: #0c4240;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e7f1f1;
  }
`;

const SpecializationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const SpecializationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #444;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 0.2rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  line-height: 1.4;
  color: #444;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #0c4240;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background: #0a3533;
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Button)`
  background: #f5f9f9;
  color: #0c4240;
  border: 1px solid #e1e5eb;

  &:hover:not(:disabled) {
    background: #e7f1f1;
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  svg {
    flex-shrink: 0;
  }
`; 