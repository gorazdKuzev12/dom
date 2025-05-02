"use client";

import styled from "styled-components";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <Wrapper>
      <LoginBox>
        <Title>Welcome Back</Title>
        <Subtitle>Login to your account</Subtitle>



        <Divider>or</Divider>

        <Form>
          <InputWrapper>
            <FiMail />
            <Input type="email" placeholder="Email" />
          </InputWrapper>

          <InputWrapper>
            <FiLock />
            <Input type="password" placeholder="Password" />
          </InputWrapper>

          <LoginButton>Login</LoginButton>
          <BottomText>
            Don’t have an account? <a href="#">Sign up</a>
          </BottomText>
        </Form>
        <GoogleButton>
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </GoogleButton>
      </LoginBox>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
`;

const LoginBox = styled.div`
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 0.3rem;
  font-size: 1.8rem;
  color: #111827;
`;

const Subtitle = styled.p`
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  border-radius: 10px;
  width: 100%;
  font-size: 0.95rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
  }

  span {
    color: #111827;
  }
`;

const Divider = styled.div`
  margin: 1.2rem 0;
  font-size: 0.85rem;
  color: #9ca3af;
  position: relative;

  &::before,
  &::after {
    content: "";
    height: 1px;
    background: #d1d5db;
    position: absolute;
    top: 50%;
    width: 40%;
  }

  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  gap: 0.75rem;

  svg {
    color: #6b7280;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  background: transparent;
`;

const LoginButton = styled.button`
  background-color: #111827;
  color: white;
  padding: 0.9rem;
  border: none;
  font-size: 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #000;
  }
`;

const BottomText = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 1rem;

  a {
    color: #111827;
    text-decoration: underline;
    font-weight: 500;

    &:hover {
      color: #000;
    }
  }
`;
