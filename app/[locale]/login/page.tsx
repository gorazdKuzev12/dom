"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight } from "react-icons/fi";
import Menu from "@/components/Menu/page";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/lib/queries";
import Link from "next/link";
import Footer from "@/components/Footer/page";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const t = useTranslations("UserLogin");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser] = useMutation(LOGIN_USER);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    // Check if user was redirected from registration
    if (searchParams.get('registered') === 'true') {
      setSuccess("Registration successful! Please login with your credentials.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await loginUser({
        variables: {
          input: {
            email: formData.email,
            password: formData.password,
          }
        }
      });

      if (result.data?.loginUser) {
        // Store the token and user data
        const { token, user } = result.data.loginUser;
        
        if (formData.rememberMe) {
          localStorage.setItem('userToken', token);
          localStorage.setItem('userData', JSON.stringify(user));
        } else {
          sessionStorage.setItem('userToken', token);
          sessionStorage.setItem('userData', JSON.stringify(user));
        }
        
        // Redirect to home page or dashboard
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <LoginContainer>
          <LoginCard>
            <Header>
              <Title>Welcome Back</Title>
              <Subtitle>Sign in to your dom.mk account</Subtitle>
            </Header>

            {success && (
              <SuccessMessage>
                <FiCheck />
                {success}
              </SuccessMessage>
            )}

            {error && (
              <ErrorMessage>
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Email Address</Label>
                <InputWrapper>
                  <InputIcon>
                    <FiMail />
                  </InputIcon>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <InputWrapper>
                  <InputIcon>
                    <FiLock />
                  </InputIcon>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputWrapper>
              </FormGroup>

              <CheckboxGroup>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <CheckboxLabel htmlFor="rememberMe">
                    Remember me for 7 days
                  </CheckboxLabel>
                </CheckboxWrapper>
              </CheckboxGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
                <FiArrowRight />
              </SubmitButton>
            </Form>

            <RegisterLink>
              Don't have an account?{" "}
              <Link href="/register">
                Create one here
              </Link>
            </RegisterLink>
          </LoginCard>
        </LoginContainer>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8fafc;
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

const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: #f8fafc;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0d9488;
    background: white;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: #0d9488;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  accent-color: #0d9488;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #0d9488;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #0f766e;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #475569;

  a {
    color: #0d9488;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #0f766e;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  color: #16a34a;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    flex-shrink: 0;
  }
`; 