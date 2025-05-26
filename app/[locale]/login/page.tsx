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

const LoginContainer = styled.div`
  width: 100%;
  max-width: 450px;
`;

const LoginCard = styled.div`
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

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #999;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: #007bff;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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
    background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const RegisterLink = styled.div`
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