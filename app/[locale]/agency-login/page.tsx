"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FiMail, FiLock, FiAlertCircle, FiBriefcase } from "react-icons/fi";
import Menu from "@/components/Menu/page";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/page";

const BenefitsSection = styled.div`
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

const BenefitsTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 1.5rem 0;
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
  font-size: 0.9rem;
  line-height: 1.4;
  color: #444;
`;

const BenefitIcon = styled.span`
  color: #0c4240;
  font-weight: bold;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const MainContent = styled.main`
  padding: 2rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const LoginContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Icon = styled.div`
  width: 64px;
  height: 64px;
  background: #f5f9f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #0c4240;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #444;
  cursor: pointer;
`;

const ForgotPassword = styled.a`
  font-size: 0.9rem;
  color: #0c4240;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0a3533;
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #0a3533;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RegisterPrompt = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const RegisterLink = styled.a`
  color: #0c4240;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #0a3533;
    text-decoration: underline;
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

export default function AgencyLoginPage() {
  const t = useTranslations("AgencyLogin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t("errors.requiredFields"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/agency-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t("errors.invalidCredentials"));
      }

      router.push("/agency-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setLoading(false);
    }
  };

  const benefitKeys = ["dashboard", "listings", "analytics", "leads", "support"];

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <LoginContainer>
          <LoginCard>
            <LoginHeader>
              <Icon>
                <FiBriefcase size={32} />
              </Icon>
              <Title>{t("title")}</Title>
              <Subtitle>{t("subtitle")}</Subtitle>
            </LoginHeader>

            {error && (
              <ErrorMessage>
                <FiAlertCircle size={16} />
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
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

              <FormRow>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <CheckboxLabel htmlFor="rememberMe">
                    {t("form.rememberMe")}
                  </CheckboxLabel>
                </CheckboxWrapper>

                <ForgotPassword href="/forgot-password">
                  {t("form.forgotPassword")}
                </ForgotPassword>
              </FormRow>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? t("form.loggingIn") : t("form.login")}
              </SubmitButton>

              <RegisterPrompt>
                {t("form.noAccount")}{" "}
                <RegisterLink href="/register-agency">
                  {t("form.registerNow")}
                </RegisterLink>
              </RegisterPrompt>
            </Form>
          </LoginCard>

          <BenefitsSection>
            <BenefitsTitle>{t("benefits.title")}</BenefitsTitle>
            <BenefitsList>
              {benefitKeys.map((key) => (
                <BenefitItem key={key}>
                  <BenefitIcon>✓</BenefitIcon>
                  <span>{t(`benefits.items.${key}`)}</span>
                </BenefitItem>
              ))}
            </BenefitsList>
          </BenefitsSection>
        </LoginContainer>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
} 