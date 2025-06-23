"use client";

import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  FiArrowLeft,
  FiMapPin, 
  FiStar, 
  FiPhone, 
  FiMail, 
  FiGlobe, 
  FiLinkedin, 
  FiInstagram, 
  FiUser,
  FiAward,
  FiCalendar,
  FiBriefcase,
  FiCheckCircle,
  FiEye,
  FiHeart,
  FiDownload,
  FiShare2,
  FiMessageCircle,
  FiClock,
  FiDollarSign,
  FiCamera
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Menu from "../Menu/page";

interface Architect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  website?: string;
  linkedIn?: string;
  instagram?: string;
  facebook?: string;
  profileImage?: string;
  portfolioImages: string[];
  bio_en?: string;
  bio_mk?: string;
  bio_sq?: string;
  specializations: string[];
  services: string[];
  projectTypes: string[];
  city: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
    slug: string;
  };
  municipality?: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
  };
  consultationFee?: number;
  projectFeeMin?: number;
  projectFeeMax?: number;
  currency: string;
  isAvailable: boolean;
  isVerified: boolean;
  isPremium: boolean;
  averageRating?: number;
  totalReviews: number;
  yearsExperience?: number;
  companyName?: string;
  position?: string;
  licenseNumber?: string;
  education?: string[];
  certifications?: string[];
  awards?: string[];
  featuredProjects?: Array<{
    id: string;
    title_en: string;
    title_mk: string;
    title_sq: string;
    description_en?: string;
    description_mk?: string;
    description_sq?: string;
    projectType: string;
    year?: number;
    location?: string;
    area?: number;
    budget?: number;
    currency: string;
    images: string[];
    videos: string[];
    isPublished: boolean;
    isFeatured: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ArchitectProfileClientProps {
  architect: Architect;
  locale: string;
}

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const parallaxFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

// Main Container
const Container = styled.div`
  min-height: 100vh;
  background: #0c4240;
  position: relative;
  overflow-x: hidden;
`;

// Hero Section
const HeroSection = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0c4240 0%, #189589 100%);
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    url('/so.png') center/cover,
    linear-gradient(135deg, rgba(12, 66, 64, 0.95) 0%, rgba(24, 149, 137, 0.9) 100%);
  filter: blur(1px);
  transform: scale(1.1);
  z-index: 1;
`;

const ArchitecturalPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M25 25h50v50H25z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 0h25v25H0z' /%3E%3Cpath d='M75 75h25v25H75z' /%3E%3Cpath d='M50 0L75 25L50 50L25 25z' /%3E%3C/g%3E%3C/svg%3E") repeat,
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: ${parallaxFloat} 20s ease-in-out infinite;
  z-index: 2;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  animation: ${slideInUp} 1s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 3rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-5px);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(-3px);
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  animation: ${float} 6s ease-in-out infinite;
`;

const ProfileImage = styled.div<{ $imageUrl?: string }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${props => 
    props.$imageUrl 
      ? `url(${props.$imageUrl}) center/cover` 
      : 'linear-gradient(135deg, #0c4240, #189589)'
  };
  border: 6px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  font-weight: bold;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 2rem;
  }
`;

const PremiumBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  border: 3px solid white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: ${float} 4s ease-in-out infinite;
`;

const VerifiedBadge = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  border: 3px solid white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: ${float} 4s ease-in-out infinite 0.5s;
`;

const ProfileInfo = styled.div`
  flex: 1;
  color: white;
`;

const ArchitectName = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Position = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem;
  font-weight: 500;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatusRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatusBadge = styled.div<{ $variant: 'verified' | 'premium' | 'available' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  ${props => {
    switch (props.$variant) {
      case 'verified':
        return `
          background: rgba(34, 197, 94, 0.2);
          color: #ffffff;
        `;
      case 'premium':
        return `
          background: rgba(251, 191, 36, 0.2);
          color: #ffffff;
        `;
      case 'available':
        return `
          background: rgba(59, 130, 246, 0.2);
          color: #ffffff;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        `;
    }
  }}
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  padding: 2rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PrimaryAction = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  color: #0c4240;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 255, 255, 0.4);
  }
`;

const SecondaryAction = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }
`;

const IconAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px) scale(1.05);
  }
`;

// Tabs Section
const TabsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(12, 66, 64, 0.1);
  position: sticky;
  top: 80px;
  z-index: 10;
`;

const TabsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 1.5rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: ${props => props.$active ? '#0c4240' : 'rgba(12, 66, 64, 0.6)'};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.$active ? '100%' : '0'};
    height: 3px;
    background: linear-gradient(135deg, #0c4240, #189589);
    transition: all 0.3s ease;
    border-radius: 3px 3px 0 0;
  }

  &:hover {
    color: #0c4240;
    
    &::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }
`;

// Main Content
const MainContent = styled.div`
  background: rgba(255, 255, 255, 0.98);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

// Overview Section
const OverviewSection = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(12, 66, 64, 0.08);
  border: 1px solid rgba(12, 66, 64, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 1.5rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #0c4240, #189589);
    border-radius: 3px;
  }
`;

const Bio = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(12, 66, 64, 0.8);
  margin: 0;
`;

const TagsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SpecTag = styled.span`
  background: linear-gradient(135deg, rgba(12, 66, 64, 0.08), rgba(24, 149, 137, 0.05));
  color: #0c4240;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(12, 66, 64, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0c4240, #189589);
    color: white;
    transform: translateY(-2px);
  }
`;

const ServicesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(12, 66, 64, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(12, 66, 64, 0.08);
  font-weight: 500;
  color: rgba(12, 66, 64, 0.8);
  transition: all 0.3s ease;

  svg {
    color: #22c55e;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(12, 66, 64, 0.05);
    transform: translateX(5px);
  }
`;

// Featured Projects
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(12, 66, 64, 0.1);
  border: 1px solid rgba(12, 66, 64, 0.05);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(12, 66, 64, 0.15);
  }
`;

const ProjectImage = styled.div<{ $imageUrl: string }>`
  height: 200px;
  background: url(${props => props.$imageUrl}) center/cover;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
  }
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 1rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(12, 66, 64, 0.6);

  svg {
    color: rgba(12, 66, 64, 0.5);
  }
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(12, 66, 64, 0.7);
  margin: 0;
`;

// Sidebar Components
const PricingCard = styled.div`
  background: linear-gradient(135deg, #0c4240, #189589);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  position: sticky;
  top: 160px;
`;

const PricingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;

  svg {
    font-size: 1.4rem;
  }
`;

const PriceItem = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 2rem;
  }
`;

const PriceLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
`;

const PriceValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const QuoteButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: white;
  color: #0c4240;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
  }
`;

const CredentialsCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(12, 66, 64, 0.08);
  border: 1px solid rgba(12, 66, 64, 0.05);
`;

const CredentialsHeader = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 1.5rem;
`;

const CredSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CredTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(12, 66, 64, 0.8);
  margin: 0 0 1rem;
`;

const CredItem = styled.div`
  font-size: 0.9rem;
  color: rgba(12, 66, 64, 0.7);
  margin-bottom: 0.75rem;
  padding-left: 1rem;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #189589;
    font-weight: bold;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

// Portfolio Section
const PortfolioSection = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
`;

// Artistic Gallery Section
const ArtisticGallerySection = styled.div`
  background: linear-gradient(135deg, rgba(12, 66, 64, 0.02), rgba(24, 149, 137, 0.02));
  border-radius: 30px;
  padding: 3rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(12, 66, 64, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 30% 70%, rgba(12, 66, 64, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(24, 149, 137, 0.03) 0%, transparent 50%);
    animation: ${parallaxFloat} 30s ease-in-out infinite;
  }
`;

const GalleryTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0c4240;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(135deg, #0c4240, #189589);
    border-radius: 2px;
  }
`;

const FloatingImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const FloatingImage = styled.div<{ $imageUrl: string; $size: 'small' | 'medium' | 'large'; $delay: string }>`
  height: ${props => {
    switch (props.$size) {
      case 'large': return '300px';
      case 'medium': return '200px';
      case 'small': return '150px';
      default: return '200px';
    }
  }};
  border-radius: 20px;
  background: url(${props => props.$imageUrl}) center/cover;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  animation: ${float} 6s ease-in-out infinite ${props => props.$delay};
  box-shadow: 0 10px 30px rgba(12, 66, 64, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(12, 66, 64, 0.7) 0%,
      rgba(24, 149, 137, 0.3) 100%
    );
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(12, 66, 64, 0.25);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    height: ${props => {
      switch (props.$size) {
        case 'large': return '200px';
        case 'medium': return '150px';
        case 'small': return '120px';
        default: return '150px';
      }
    }};
  }
`;

// Enhanced Section Components
const ImageBackdrop = styled.div<{ $imageUrl: string }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: url(${props => props.$imageUrl}) center/cover;
  border-radius: 0 20px 20px 0;
  opacity: 0.1;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(12, 66, 64, 0.8) 0%, transparent 100%);
  }
`;

const SectionContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CircularBackgroundPattern = styled.div`
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: 
    radial-gradient(circle, rgba(24, 149, 137, 0.1) 0%, transparent 70%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23189589' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3Ccircle cx='45' cy='15' r='1'/%3E%3Ccircle cx='15' cy='45' r='1'/%3E%3Ccircle cx='45' cy='45' r='1'/%3E%3C/g%3E%3C/svg%3E") repeat;
  opacity: 0.6;
  animation: ${parallaxFloat} 20s ease-in-out infinite reverse;
`;

// Artistic Portfolio Preview
const ArtisticPortfolioSection = styled.div`
  background: white;
  border-radius: 25px;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 40px rgba(12, 66, 64, 0.1);
  border: 1px solid rgba(12, 66, 64, 0.05);
  position: relative;
  overflow: hidden;
`;

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  grid-auto-rows: 150px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 120px;
  }
`;

const MasonryItem = styled.div<{ $height: 'short' | 'medium' | 'tall'; $imageUrl: string }>`
  border-radius: 16px;
  background: url(${props => props.$imageUrl}) center/cover;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  grid-row: span ${props => {
    switch (props.$height) {
      case 'tall': return '2';
      case 'medium': return '1.5';
      case 'short': return '1';
      default: return '1';
    }
  }};

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 40px rgba(12, 66, 64, 0.2);
    z-index: 2;

    div {
      opacity: 1;
    }
  }
`;

const OverlayText = styled.span`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

// Enhanced Tags
const SpecTagEnhanced = styled.span<{ $index: number }>`
  background: linear-gradient(135deg, rgba(12, 66, 64, 0.08), rgba(24, 149, 137, 0.05));
  color: #0c4240;
  padding: 1rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(12, 66, 64, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${slideInUp} 0.6s ease-out ${props => props.$index * 0.1}s both;

  &:hover {
    background: linear-gradient(135deg, #0c4240, #189589);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(12, 66, 64, 0.2);
  }
`;

const TagIcon = styled.span`
  font-size: 1.2rem;
`;

// Services Artistic Section
const ServicesArtisticSection = styled.div`
  background: white;
  border-radius: 25px;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 40px rgba(12, 66, 64, 0.1);
  border: 1px solid rgba(12, 66, 64, 0.05);
  position: relative;
  overflow: hidden;
`;

const ServicesImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ServiceImageCard = styled.div<{ $imageUrl: string }>`
  height: 200px;
  border-radius: 16px;
  background: url(${props => props.$imageUrl}) center/cover;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(12, 66, 64, 0.2);

    div {
      opacity: 1;
    }
  }
`;

const ServiceOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(12, 66, 64, 0.8) 0%,
    rgba(24, 149, 137, 0.6) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: all 0.3s ease;
`;

const ServiceIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ServiceText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
`;

const ServiceItemEnhanced = styled.div<{ $index: number }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(12, 66, 64, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(12, 66, 64, 0.08);
  font-weight: 500;
  color: rgba(12, 66, 64, 0.8);
  transition: all 0.3s ease;
  animation: ${slideInUp} 0.6s ease-out ${props => props.$index * 0.1}s both;

  svg {
    color: #22c55e;
    flex-shrink: 0;
    font-size: 1.2rem;
  }

  &:hover {
    background: rgba(12, 66, 64, 0.08);
    transform: translateX(8px);
    border-color: rgba(12, 66, 64, 0.15);
  }
`;

// Enhanced Projects
const ProjectsGridEnhanced = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
`;

const ProjectCardEnhanced = styled.div<{ $index: number }>`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(12, 66, 64, 0.1);
  border: 1px solid rgba(12, 66, 64, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideInUp} 0.8s ease-out ${props => props.$index * 0.2}s both;

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 25px 50px rgba(12, 66, 64, 0.15);

    div:first-child div {
      opacity: 1;
    }
  }
`;

const ProjectImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const ProjectImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(12, 66, 64, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
`;

const ProjectViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #0c4240;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
  }
`;

// Creative Process Section
const CreativeProcessSection = styled.div`
  background: linear-gradient(135deg, rgba(12, 66, 64, 0.02), rgba(24, 149, 137, 0.02));
  border-radius: 30px;
  padding: 4rem 3rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(12, 66, 64, 0.05);
`;

const ProcessSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const ProcessStep = styled.div<{ $delay: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  animation: ${slideInUp} 0.8s ease-out ${props => props.$delay} both;
`;

const ProcessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const ProcessTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #0c4240;
  margin-bottom: 1rem;
`;

const ProcessImage = styled.div<{ $imageUrl: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: url(${props => props.$imageUrl}) center/cover;
  border: 4px solid rgba(12, 66, 64, 0.1);
  box-shadow: 0 8px 25px rgba(12, 66, 64, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(12, 66, 64, 0.25);
  }
`;

const ProcessConnector = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #0c4240, #189589);
  position: relative;

  &::after {
    content: '→';
    position: absolute;
    right: -15px;
    top: -10px;
    color: #189589;
    font-size: 1.2rem;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    width: 2px;
    height: 60px;
    background: linear-gradient(180deg, #0c4240, #189589);

    &::after {
      content: '↓';
      right: -10px;
      top: 45px;
    }
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PortfolioImage = styled.div<{ $imageUrl: string }>`
  height: 250px;
  border-radius: 16px;
  background: url(${props => props.$imageUrl}) center/cover;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;

  &:hover {
    transform: scale(1.02);
    
    div {
      opacity: 1;
    }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(12, 66, 64, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  opacity: 0;
  transition: all 0.3s ease;
`;

// Contact Section
const ContactSection = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(12, 66, 64, 0.08);
  border: 1px solid rgba(12, 66, 64, 0.05);
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 2rem;
`;

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactMethod = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(12, 66, 64, 0.03);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(12, 66, 64, 0.08);
    transform: translateX(5px);
  }
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #0c4240, #189589);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-size: 0.85rem;
  color: rgba(12, 66, 64, 0.6);
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #0c4240;
`;

const ContactForm = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(12, 66, 64, 0.08);
  border: 1px solid rgba(12, 66, 64, 0.05);
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 2rem;
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

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(12, 66, 64, 0.8);
`;

const FormInput = styled.input`
  padding: 1rem;
  border: 2px solid rgba(12, 66, 64, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }
`;

const FormSelect = styled.select`
  padding: 1rem;
  border: 2px solid rgba(12, 66, 64, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  padding: 1rem;
  border: 2px solid rgba(12, 66, 64, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #0c4240, #189589);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(12, 66, 64, 0.3);
  }
`;

// Image Modal
const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

export default function ArchitectProfileClient({ architect, locale }: ArchitectProfileClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get localized text
  const getText = (text_en?: string, text_mk?: string, text_sq?: string) => {
    switch (locale) {
      case 'mk': return text_mk || text_en || '';
      case 'sq': return text_sq || text_en || '';
      default: return text_en || '';
    }
  };

  // Get translations
  const getTranslations = () => {
    const translations = {
      en: {
        backToArchitects: "Back to Architects",
        overview: "Overview",
        portfolio: "Portfolio",
        contact: "Contact",
        reviews: "Reviews",
        about: "About",
        experience: "Experience",
        specializations: "Specializations",
        services: "Services",
        education: "Education",
        certifications: "Certifications",
        awards: "Awards",
        featuredProjects: "Featured Projects",
        consultationFee: "Consultation Fee",
        projectRange: "Project Range",
        yearsExp: "Years Experience",
        projects: "Projects",
        clients: "Happy Clients",
        rating: "Rating",
        verified: "Verified Professional",
        premium: "Premium Member",
        available: "Available",
        contactNow: "Contact Now",
        downloadPortfolio: "Download Portfolio",
        shareProfile: "Share Profile",
        sendMessage: "Send Message",
        viewProject: "View Project",
        projectDetails: "Project Details",
        projectType: "Project Type",
        year: "Year",
        location: "Location",
        area: "Area",
        budget: "Budget",
        getQuote: "Get Quote",
        scheduleConsultation: "Schedule Consultation",
        per: "per",
        hour: "hour",
        from: "from",
        sqm: "m²"
      },
      mk: {
        backToArchitects: "Назад кон Архитекти",
        overview: "Преглед",
        portfolio: "Портфолио",
        contact: "Контакт",
        reviews: "Рецензии",
        about: "За",
        experience: "Искуство",
        specializations: "Специјализации",
        services: "Услуги",
        education: "Образование",
        certifications: "Сертификати",
        awards: "Награди",
        featuredProjects: "Избрани Проекти",
        consultationFee: "Надомест за Консултација",
        projectRange: "Опсег на Проект",
        yearsExp: "Години Искуство",
        projects: "Проекти",
        clients: "Задоволни Клиенти",
        rating: "Рејтинг",
        verified: "Верификуван Професионалец",
        premium: "Премиум Член",
        available: "Достапен",
        contactNow: "Контактирај Сега",
        downloadPortfolio: "Преземи Портфолио",
        shareProfile: "Сподели Профил",
        sendMessage: "Прати Порака",
        viewProject: "Прегледај Проект",
        projectDetails: "Детали за Проектот",
        projectType: "Тип на Проект",
        year: "Година",
        location: "Локација",
        area: "Површина",
        budget: "Буџет",
        getQuote: "Добиј Понуда",
        scheduleConsultation: "Закажи Консултација",
        per: "за",
        hour: "час",
        from: "од",
        sqm: "м²"
      },
      sq: {
        backToArchitects: "Kthehu te Arkitektët",
        overview: "Përmbledhje",
        portfolio: "Portfolio",
        contact: "Kontakt",
        reviews: "Recensione",
        about: "Rreth",
        experience: "Përvojë",
        specializations: "Specializimet",
        services: "Shërbimet",
        education: "Arsimi",
        certifications: "Certifikimet",
        awards: "Çmimet",
        featuredProjects: "Projektet e Zgjedhura",
        consultationFee: "Tarifa e Konsultimit",
        projectRange: "Gamën e Projektit",
        yearsExp: "Vite Përvojë",
        projects: "Projekte",
        clients: "Klientë të Kënaqur",
        rating: "Vlerësimi",
        verified: "Profesionist i Verifikuar",
        premium: "Anëtar Premium",
        available: "I Disponueshëm",
        contactNow: "Kontakto Tani",
        downloadPortfolio: "Shkarko Portfolio",
        shareProfile: "Ndaj Profilin",
        sendMessage: "Dërgo Mesazh",
        viewProject: "Shiko Projektin",
        projectDetails: "Detajet e Projektit",
        projectType: "Lloji i Projektit",
        year: "Viti",
        location: "Vendndodhja",
        area: "Sipërfaqja",
        budget: "Buxheti",
        getQuote: "Merr Ofertë",
        scheduleConsultation: "Cakto Konsultim",
        per: "për",
        hour: "orë",
        from: "nga",
        sqm: "m²"
      }
    };
    return translations[locale as keyof typeof translations] || translations.en;
  };

  const t = getTranslations();

  // Auto-rotate portfolio images
  useEffect(() => {
    if (architect.portfolioImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          (prev + 1) % architect.portfolioImages.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [architect.portfolioImages.length]);

  return (
    <>
      <Menu />
      <Container>
        {/* Hero Section with Artistic Background */}
        <HeroSection>
          <HeroBackground />
          <ArchitecturalPattern />
          <HeroContent>
            <BackButton onClick={() => router.back()}>
              <FiArrowLeft />
              {t.backToArchitects}
            </BackButton>
            
            <ProfileSection>
              <ProfileImageWrapper>
                <ProfileImage $imageUrl={architect.profileImage}>
                  {!architect.profileImage && `${architect.firstName[0]}${architect.lastName[0]}`}
                </ProfileImage>
                {architect.isPremium && <PremiumBadge><FiAward /></PremiumBadge>}
                {architect.isVerified && <VerifiedBadge><FiCheckCircle /></VerifiedBadge>}
              </ProfileImageWrapper>
              
              <ProfileInfo>
                <ArchitectName>
                  {architect.firstName} {architect.lastName}
                </ArchitectName>
                {architect.position && architect.companyName && (
                  <Position>{architect.position} at {architect.companyName}</Position>
                )}
                <Location>
                  <FiMapPin />
                  {getText(architect.city.name_en, architect.city.name_mk, architect.city.name_sq)}
                  {architect.municipality && `, ${getText(architect.municipality.name_en, architect.municipality.name_mk, architect.municipality.name_sq)}`}
                </Location>
                
                <StatusRow>
                  {architect.isVerified && (
                    <StatusBadge $variant="verified">
                      <FiCheckCircle />
                      {t.verified}
                    </StatusBadge>
                  )}
                  {architect.isPremium && (
                    <StatusBadge $variant="premium">
                      <FiAward />
                      {t.premium}
                    </StatusBadge>
                  )}
                  {architect.isAvailable && (
                    <StatusBadge $variant="available">
                      <FiClock />
                      {t.available}
                    </StatusBadge>
                  )}
                </StatusRow>
              </ProfileInfo>
            </ProfileSection>

            <StatsGrid>
              {architect.yearsExperience && (
                <StatCard>
                  <StatValue>{architect.yearsExperience}</StatValue>
                  <StatLabel>{t.yearsExp}</StatLabel>
                </StatCard>
              )}
              <StatCard>
                <StatValue>{architect.featuredProjects?.length || architect.portfolioImages.length}</StatValue>
                <StatLabel>{t.projects}</StatLabel>
              </StatCard>
              {architect.averageRating && (
                <StatCard>
                  <StatValue>{architect.averageRating.toFixed(1)}</StatValue>
                  <StatLabel>{t.rating}</StatLabel>
                </StatCard>
              )}
              <StatCard>
                <StatValue>{architect.totalReviews}</StatValue>
                <StatLabel>Reviews</StatLabel>
              </StatCard>
            </StatsGrid>

            <ActionButtons>
              <PrimaryAction>
                <FiMessageCircle />
                {t.contactNow}
              </PrimaryAction>
              <SecondaryAction>
                <FiCalendar />
                {t.scheduleConsultation}
              </SecondaryAction>
              <IconAction>
                <FiShare2 />
              </IconAction>
              <IconAction>
                <FiDownload />
              </IconAction>
            </ActionButtons>
          </HeroContent>
        </HeroSection>

        {/* Navigation Tabs */}
        <TabsSection>
          <TabsContainer>
            {['overview', 'portfolio', 'contact'].map((tab) => (
              <Tab
                key={tab}
                $active={activeSection === tab}
                onClick={() => setActiveSection(tab)}
              >
                {t[tab as keyof typeof t]}
              </Tab>
            ))}
          </TabsContainer>
        </TabsSection>

        {/* Main Content */}
        <MainContent>
          <ContentWrapper>
            {activeSection === 'overview' && (
              <OverviewSection>
                <ContentGrid>
                  <MainColumn>
                    {/* Artistic Hero Gallery */}
                    <ArtisticGallerySection>
                      <GalleryTitle>Visual Journey</GalleryTitle>
                      <FloatingImagesGrid>
                        <FloatingImage 
                          $imageUrl="/skopje.jpg" 
                          $size="large"
                          $delay="0s"
                          onClick={() => setSelectedImage("/skopje.jpg")}
                        />
                        <FloatingImage 
                          $imageUrl="/dom.jpg" 
                          $size="medium"
                          $delay="0.5s"
                          onClick={() => setSelectedImage("/dom.jpg")}
                        />
                        <FloatingImage 
                          $imageUrl="/aero.jpg" 
                          $size="small"
                          $delay="1s"
                          onClick={() => setSelectedImage("/aero.jpg")}
                        />
                        <FloatingImage 
                          $imageUrl="/dom1.jpg" 
                          $size="medium"
                          $delay="1.5s"
                          onClick={() => setSelectedImage("/dom1.jpg")}
                        />
                      </FloatingImagesGrid>
                    </ArtisticGallerySection>

                    {/* About Section with Background Imagery */}
                    <Section>
                      <ImageBackdrop $imageUrl="/profile.jpg" />
                      <SectionContent>
                        <SectionTitle>{t.about}</SectionTitle>
                        <Bio>
                          {getText(architect.bio_en, architect.bio_mk, architect.bio_sq)}
                        </Bio>
                      </SectionContent>
                    </Section>

                    {/* Artistic Portfolio Preview */}
                    <ArtisticPortfolioSection>
                      <SectionTitle>Creative Portfolio</SectionTitle>
                      <MasonryGrid>
                        {(architect.portfolioImages.length > 0 
                          ? architect.portfolioImages.slice(0, 6)
                          : ["/skopje.jpg", "/dom.jpg", "/aero.jpg", "/stip.jpg", "/profile.jpg", "/dom1.jpg"]
                        ).map((image, index) => (
                          <MasonryItem 
                            key={index}
                            $height={index % 3 === 0 ? 'tall' : index % 2 === 0 ? 'medium' : 'short'}
                            $imageUrl={image}
                            onClick={() => setSelectedImage(image)}
                          >
                            <ImageOverlay>
                              <FiCamera />
                              <OverlayText>View Full Size</OverlayText>
                            </ImageOverlay>
                          </MasonryItem>
                        ))}
                      </MasonryGrid>
                    </ArtisticPortfolioSection>

                    {/* Specializations with Visual Elements */}
                    <Section>
                      <CircularBackgroundPattern />
                      <SectionContent>
                        <SectionTitle>{t.specializations}</SectionTitle>
                        <TagsGrid>
                          {architect.specializations.map((spec, index) => (
                            <SpecTagEnhanced key={index} $index={index}>
                              <TagIcon>🏗️</TagIcon>
                              {spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </SpecTagEnhanced>
                          ))}
                        </TagsGrid>
                      </SectionContent>
                    </Section>

                    {/* Services with Image Grid */}
                    <ServicesArtisticSection>
                      <SectionTitle>{t.services}</SectionTitle>
                      <ServicesImageGrid>
                        <ServiceImageCard $imageUrl="/stip.jpg">
                          <ServiceOverlay>
                            <ServiceIcon><FiCheckCircle /></ServiceIcon>
                            <ServiceText>Architectural Design</ServiceText>
                          </ServiceOverlay>
                        </ServiceImageCard>
                        <ServiceImageCard $imageUrl="/ChatGPT Image Apr 30, 2025, 02_04_13 PM.png">
                          <ServiceOverlay>
                            <ServiceIcon><FiCheckCircle /></ServiceIcon>
                            <ServiceText>Interior Planning</ServiceText>
                          </ServiceOverlay>
                        </ServiceImageCard>
                        <ServiceImageCard $imageUrl="/skopje.jpg">
                          <ServiceOverlay>
                            <ServiceIcon><FiCheckCircle /></ServiceIcon>
                            <ServiceText>Urban Development</ServiceText>
                          </ServiceOverlay>
                        </ServiceImageCard>
                        <ServiceImageCard $imageUrl="/aero.jpg">
                          <ServiceOverlay>
                            <ServiceIcon><FiCheckCircle /></ServiceIcon>
                            <ServiceText>Consultation</ServiceText>
                          </ServiceOverlay>
                        </ServiceImageCard>
                      </ServicesImageGrid>
                      
                      <ServicesList>
                        {architect.services.map((service, index) => (
                          <ServiceItemEnhanced key={index} $index={index}>
                            <FiCheckCircle />
                            {service.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </ServiceItemEnhanced>
                        ))}
                      </ServicesList>
                    </ServicesArtisticSection>

                    {/* Featured Projects Enhanced */}
                    {architect.featuredProjects && architect.featuredProjects.length > 0 && (
                      <Section>
                        <SectionTitle>{t.featuredProjects}</SectionTitle>
                        <ProjectsGridEnhanced>
                          {architect.featuredProjects.slice(0, 3).map((project, index) => (
                            <ProjectCardEnhanced key={project.id} $index={index}>
                              <ProjectImageWrapper>
                                <ProjectImage $imageUrl={project.images[0]} />
                                <ProjectImageOverlay>
                                  <ProjectViewButton>
                                    <FiEye />
                                    View Project
                                  </ProjectViewButton>
                                </ProjectImageOverlay>
                              </ProjectImageWrapper>
                              <ProjectInfo>
                                <ProjectTitle>
                                  {getText(project.title_en, project.title_mk, project.title_sq)}
                                </ProjectTitle>
                                <ProjectMeta>
                                  <MetaItem>
                                    <FiCalendar />
                                    {project.year}
                                  </MetaItem>
                                  {project.location && (
                                    <MetaItem>
                                      <FiMapPin />
                                      {project.location}
                                    </MetaItem>
                                  )}
                                  {project.area && (
                                    <MetaItem>
                                      <FiEye />
                                      {project.area} {t.sqm}
                                    </MetaItem>
                                  )}
                                </ProjectMeta>
                                <ProjectDescription>
                                  {getText(project.description_en, project.description_mk, project.description_sq)?.substring(0, 120)}...
                                </ProjectDescription>
                              </ProjectInfo>
                            </ProjectCardEnhanced>
                          ))}
                        </ProjectsGridEnhanced>
                      </Section>
                    )}

                    {/* Creative Process Visualization */}
                    <CreativeProcessSection>
                      <SectionTitle>Creative Process</SectionTitle>
                      <ProcessSteps>
                        <ProcessStep $delay="0s">
                          <ProcessIcon>💡</ProcessIcon>
                          <ProcessTitle>Concept</ProcessTitle>
                          <ProcessImage $imageUrl="/dom.jpg" />
                        </ProcessStep>
                        <ProcessConnector />
                        <ProcessStep $delay="0.5s">
                          <ProcessIcon>📐</ProcessIcon>
                          <ProcessTitle>Design</ProcessTitle>
                          <ProcessImage $imageUrl="/profile.jpg" />
                        </ProcessStep>
                        <ProcessConnector />
                        <ProcessStep $delay="1s">
                          <ProcessIcon>🏗️</ProcessIcon>
                          <ProcessTitle>Build</ProcessTitle>
                          <ProcessImage $imageUrl="/stip.jpg" />
                        </ProcessStep>
                        <ProcessConnector />
                        <ProcessStep $delay="1.5s">
                          <ProcessIcon>✨</ProcessIcon>
                          <ProcessTitle>Deliver</ProcessTitle>
                          <ProcessImage $imageUrl="/aero.jpg" />
                        </ProcessStep>
                      </ProcessSteps>
                    </CreativeProcessSection>
                  </MainColumn>

                  <Sidebar>
                    {/* Pricing Card */}
                    <PricingCard>
                      <PricingHeader>
                        <FiDollarSign />
                        Pricing
                      </PricingHeader>
                      {architect.consultationFee && (
                        <PriceItem>
                          <PriceLabel>{t.consultationFee}</PriceLabel>
                          <PriceValue>€{architect.consultationFee} {t.per} {t.hour}</PriceValue>
                        </PriceItem>
                      )}
                      {architect.projectFeeMin && (
                        <PriceItem>
                          <PriceLabel>{t.projectRange}</PriceLabel>
                          <PriceValue>
                            {t.from} €{architect.projectFeeMin}
                            {architect.projectFeeMax && ` - €${architect.projectFeeMax}`}
                          </PriceValue>
                        </PriceItem>
                      )}
                      <QuoteButton>
                        <FiMessageCircle />
                        {t.getQuote}
                      </QuoteButton>
                    </PricingCard>

                    {/* Education & Credentials */}
                    {(architect.education?.length || architect.certifications?.length || architect.awards?.length) && (
                      <CredentialsCard>
                        <CredentialsHeader>Credentials</CredentialsHeader>
                        
                        {architect.education && architect.education.length > 0 && (
                          <CredSection>
                            <CredTitle>{t.education}</CredTitle>
                            {architect.education.map((edu, index) => (
                              <CredItem key={index}>{edu}</CredItem>
                            ))}
                          </CredSection>
                        )}

                        {architect.certifications && architect.certifications.length > 0 && (
                          <CredSection>
                            <CredTitle>{t.certifications}</CredTitle>
                            {architect.certifications.map((cert, index) => (
                              <CredItem key={index}>{cert}</CredItem>
                            ))}
                          </CredSection>
                        )}

                        {architect.awards && architect.awards.length > 0 && (
                          <CredSection>
                            <CredTitle>{t.awards}</CredTitle>
                            {architect.awards.map((award, index) => (
                              <CredItem key={index}>{award}</CredItem>
                            ))}
                          </CredSection>
                        )}
                      </CredentialsCard>
                    )}
                  </Sidebar>
                </ContentGrid>
              </OverviewSection>
            )}

            {activeSection === 'portfolio' && (
              <PortfolioSection>
                <PortfolioGrid>
                  {architect.portfolioImages.map((image, index) => (
                    <PortfolioImage
                      key={index}
                      $imageUrl={image}
                      onClick={() => setSelectedImage(image)}
                    >
                      <ImageOverlay>
                        <FiCamera />
                      </ImageOverlay>
                    </PortfolioImage>
                  ))}
                </PortfolioGrid>
              </PortfolioSection>
            )}

            {activeSection === 'contact' && (
              <ContactSection>
                <ContactGrid>
                  <ContactInfo>
                    <ContactTitle>Get in Touch</ContactTitle>
                    <ContactMethods>
                      {architect.phone && (
                        <ContactMethod href={`tel:${architect.phone}`}>
                          <ContactIcon><FiPhone /></ContactIcon>
                          <ContactDetails>
                            <ContactLabel>Phone</ContactLabel>
                            <ContactValue>{architect.phone}</ContactValue>
                          </ContactDetails>
                        </ContactMethod>
                      )}
                      
                      <ContactMethod href={`mailto:${architect.email}`}>
                        <ContactIcon><FiMail /></ContactIcon>
                        <ContactDetails>
                          <ContactLabel>Email</ContactLabel>
                          <ContactValue>{architect.email}</ContactValue>
                        </ContactDetails>
                      </ContactMethod>

                      {architect.website && (
                        <ContactMethod href={architect.website} target="_blank">
                          <ContactIcon><FiGlobe /></ContactIcon>
                          <ContactDetails>
                            <ContactLabel>Website</ContactLabel>
                            <ContactValue>{architect.website}</ContactValue>
                          </ContactDetails>
                        </ContactMethod>
                      )}

                      {architect.linkedIn && (
                        <ContactMethod href={architect.linkedIn} target="_blank">
                          <ContactIcon><FiLinkedin /></ContactIcon>
                          <ContactDetails>
                            <ContactLabel>LinkedIn</ContactLabel>
                            <ContactValue>Professional Profile</ContactValue>
                          </ContactDetails>
                        </ContactMethod>
                      )}
                    </ContactMethods>
                  </ContactInfo>

                  <ContactForm>
                    <FormTitle>Send Message</FormTitle>
                    <Form>
                      <FormGroup>
                        <FormLabel>Name</FormLabel>
                        <FormInput placeholder="Your name" />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Email</FormLabel>
                        <FormInput type="email" placeholder="your@email.com" />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Project Type</FormLabel>
                        <FormSelect>
                          <option>Select project type</option>
                          <option>Residential Design</option>
                          <option>Commercial Design</option>
                          <option>Renovation</option>
                          <option>Consultation</option>
                        </FormSelect>
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Message</FormLabel>
                        <FormTextarea placeholder="Tell me about your project..." rows={5} />
                      </FormGroup>
                      <SubmitButton>
                        <FiMessageCircle />
                        Send Message
                      </SubmitButton>
                    </Form>
                  </ContactForm>
                </ContactGrid>
              </ContactSection>
            )}
          </ContentWrapper>
        </MainContent>

        {/* Image Modal */}
        {selectedImage && (
          <ImageModal onClick={() => setSelectedImage(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setSelectedImage(null)}>×</CloseButton>
              <ModalImage src={selectedImage} alt="Portfolio" />
            </ModalContent>
          </ImageModal>
        )}
      </Container>
    </>
  );
} 