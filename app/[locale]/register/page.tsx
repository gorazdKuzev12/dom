"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FiMail, FiPhone, FiUser, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight } from "react-icons/fi";
import Menu from "@/components/Menu/page";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/lib/queries";
import Link from "next/link";
import Footer from "@/components/Footer/page";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const t = useTranslations("UserRegistration");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser] = useMutation(REGISTER_USER);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("errors.requiredFields"));
      return false;
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t("errors.invalidEmail"));
      return false;
    }
    
    if (formData.password.length < 8) {
      setError(t("errors.passwordTooShort"));
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return false;
    }
    
    if (!formData.agreeTerms) {
      setError(t("errors.agreeTermsRequired"));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const result = await registerUser({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone || null,
          }
        }
      });

      if (result.data?.registerUser) {
        // Store the token and user data
        const { token, user } = result.data.registerUser;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        // Redirect to login page with success message
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <RegisterContainer>
          <RegisterCard>
            <Header>
              <Title>{t("title")}</Title>
              <Subtitle>{t("subtitle")}</Subtitle>
            </Header>

            {error && (
              <ErrorMessage>
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <FiUser size={16} />
                  {t("form.fullName")}
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("form.fullNamePlaceholder")}
                  required
                />
              </FormGroup>

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
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>
                    <FiLock size={16} />
                    {t("form.password")}
                  </Label>
                  <PasswordWrapper>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t("form.passwordPlaceholder")}
                      required
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                  </PasswordWrapper>
                </FormGroup>

                <FormGroup>
                  <Label>{t("form.confirmPassword")}</Label>
                  <PasswordWrapper>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t("form.confirmPasswordPlaceholder")}
                      required
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                  </PasswordWrapper>
                </FormGroup>
              </FormRow>

              <CheckboxGroup>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <CheckboxLabel htmlFor="agreeTerms">
                    {t("form.agreeTerms")}
                  </CheckboxLabel>
                </CheckboxWrapper>
              </CheckboxGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? t("form.creating") : t("form.submit")}
                <FiArrowRight />
              </SubmitButton>
            </Form>

            <LoginLink>
              {t("form.alreadyHaveAccount")} {" "}
              <Link href="/login">{t("form.signInHere")}</Link>
            </LoginLink>
          </RegisterCard>
        </RegisterContainer>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: rgb(239, 239, 239);
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterContainer = styled.div`
  width: 100%;
  max-width: 600px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
  }
`;

const CheckboxGroup = styled.div`
  margin: 0.5rem 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
  width: 1rem;
  height: 1rem;
  accent-color: #007bff;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  background: #0c4240;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #0a3533;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(12, 66, 64, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`; 