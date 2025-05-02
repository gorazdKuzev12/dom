"use client";

import styled from "styled-components";
import {
  Home,
  Mail,
  Phone,
  FileText,
  MapPin,
  UploadCloud,
  Check,
  DollarSign,
  Ruler,
  BedDouble,
  Bath,
  Building2,
  Info,
  User,
  AtSign,
  Tag,
  Calendar,
  ArrowRight,
  Image,
} from "lucide-react";
import { useState } from "react";
import Menu from "@/components/Menu/page";

export default function PostBookingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    type: "Apartment",
    listingType: "Rent",
    price: "",
    size: "",
    condition: "New",
    floor: "",
    totalFloors: "",
    rooms: "",
    bathrooms: "",
    parking: false,
    description: "",
    city: "Skopje",
    address: "",
    images: [],
    amenities: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      if (name === "amenities") {
        setForm((prev) => {
          const updatedAmenities = checked
            ? [...prev.amenities, value]
            : prev.amenities.filter((amenity) => amenity !== value);
          return { ...prev, amenities: updatedAmenities };
        });
      } else {
        setForm((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, images: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const amenitiesList = [
    { icon: <Home size={16} />, label: "Balcony" },
    { icon: <Ruler size={16} />, label: "Heating" },
    { icon: <Check size={16} />, label: "Air conditioning" },
    { icon: <BedDouble size={16} />, label: "Furnished" },
    { icon: <Building2 size={16} />, label: "Elevator" },
    { icon: <BedDouble size={16} />, label: "Parking" },
  ];

  return (
    <>
      <Menu />
      <Wrapper>
        {/* Header */}
        <Header>
          <Title>
            <FileText size={24} color="#16a394" /> Post Your Property
          </Title>
          <Subtitle>Fill in the details to list your property</Subtitle>
        </Header>

        {/* Progress Steps */}
        <ProgressContainer>
          <ProgressStep active={true}>
            <ProgressNumber active={true}>1</ProgressNumber>
            <ProgressLabel>Details</ProgressLabel>
          </ProgressStep>
          <ProgressLine />
          <ProgressStep>
            <ProgressNumber>2</ProgressNumber>
            <ProgressLabel>Media</ProgressLabel>
          </ProgressStep>
          <ProgressLine />
          <ProgressStep>
            <ProgressNumber>3</ProgressNumber>
            <ProgressLabel>Publish</ProgressLabel>
          </ProgressStep>
        </ProgressContainer>

        {/* Contact Info */}
        <CardSection>
          <SectionTitle>
            <User size={18} color="#16a394" /> Contact Information
          </SectionTitle>
          <FormGrid columns={1}>
            <InputGroup>
              <InputIcon>
                <User size={16} />
              </InputIcon>
              <Input
                placeholder="Full Name"
                name="name"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputIcon>
                <AtSign size={16} />
              </InputIcon>
              <Input
                placeholder="Email Address"
                name="email"
                type="email"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputIcon>
                <Phone size={16} />
              </InputIcon>
              <Input
                placeholder="Phone Number"
                name="phone"
                type="tel"
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>
        </CardSection>

        {/* Property Details */}
        <CardSection>
          <SectionTitle>
            <Building2 size={18} color="#16a394" /> Property Details
          </SectionTitle>
          <FormGrid columns={1}>
            <InputGroup>
              <InputIcon>
                <Tag size={16} />
              </InputIcon>
              <Input
                placeholder="Title (e.g. Cozy Studio in Centar)"
                name="title"
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>

          <FormGrid columns={2}>
            <SelectGroup>
              <SelectIcon>
                <Home size={16} />
              </SelectIcon>
              <Select name="type" onChange={handleChange}>
                <option>Apartment</option>
                <option>House</option>
                <option>Office</option>
                <option>Land</option>
              </Select>
            </SelectGroup>
            <SelectGroup>
              <SelectIcon>
                <Tag size={16} />
              </SelectIcon>
              <Select name="listingType" onChange={handleChange}>
                <option>Rent</option>
                <option>Buy</option>
              </Select>
            </SelectGroup>
          </FormGrid>

          <FormGrid columns={2}>
            <InputGroup>
              <InputIcon>
                <DollarSign size={16} />
              </InputIcon>
              <InputGroup
                placeholder="Price (€)"
                name="price"
                type="number"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputIcon>
                <Ruler size={16} />
              </InputIcon>
              <Input
                placeholder="Size (m²)"
                name="size"
                type="number"
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>

          <FormGrid columns={3}>
            <SelectGroup>
              <SelectIcon>
                <Info size={16} />
              </SelectIcon>
              <Select name="condition" onChange={handleChange}>
                <option>New</option>
                <option>Renovated</option>
                <option>Needs renovation</option>
              </Select>
            </SelectGroup>
            <InputGroup>
              <InputIcon>
                <Building2 size={16} />
              </InputIcon>
              <Input
                placeholder="Floor"
                name="floor"
                type="number"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputIcon>
                <Building2 size={16} />
              </InputIcon>
              <Input
                placeholder="Total Floors"
                name="totalFloors"
                type="number"
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>

          <FormGrid columns={2}>
            <InputGroup>
              <InputIcon>
                <BedDouble size={16} />
              </InputIcon>
              <Input
                placeholder="Rooms"
                name="rooms"
                type="number"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputIcon>
                <Bath size={16} />
              </InputIcon>
              <Input
                placeholder="Bathrooms"
                name="bathrooms"
                type="number"
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>

          <TextareaGroup>
            <TextareaIcon>
              <Info size={16} />
            </TextareaIcon>
            <TextareaGroup
              placeholder="Describe your property in detail..."
              name="description"
              rows={4}
              onChange={handleChange}
            />
          </TextareaGroup>
        </CardSection>

        {/* Amenities */}
        <CardSection>
          <SectionTitle>
            <Check size={18} color="#16a394" /> Amenities
          </SectionTitle>
          <AmenitiesGrid>
            {amenitiesList.map((amenity) => (
              <AmenityLabel key={amenity.label}>
                <AmenityCheckbox
                  type="checkbox"
                  name="amenities"
                  value={amenity.label}
                  onChange={handleChange}
                />
                <AmenityIcon>{amenity.icon}</AmenityIcon>
                <span>{amenity.label}</span>
              </AmenityLabel>
            ))}
          </AmenitiesGrid>
        </CardSection>

        {/* Image Upload */}
        <CardSection>
          <SectionTitle>
            <Image size={18} color="#16a394" /> Property Images
          </SectionTitle>
          <UploadArea>
            <UploadIcon>
              <UploadCloud size={48} color="#16a394" />
            </UploadIcon>
            <UploadText>
              Drag and drop images here or click to browse
            </UploadText>
            <UploadSubtext>
              Upload up to 10 high-quality images (max 5MB each)
            </UploadSubtext>
            <input
              type="file"
              multiple
              onChange={handleChange}
              style={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
            />
          </UploadArea>
        </CardSection>

        {/* Location */}
        <CardSection>
          <SectionTitle>
            <MapPin size={18} color="#16a394" /> Location
          </SectionTitle>
          <FormGrid columns={2}>
            <SelectGroup>
              <SelectIcon>
                <Building2 size={16} />
              </SelectIcon>
              <Select name="city" onChange={handleChange}>
                <option>Skopje</option>
                <option>Ohrid</option>
                <option>Bitola</option>
                <option>Struga</option>
              </Select>
            </SelectGroup>
            <InputGroup>
              <InputIcon>
                <MapPin size={16} />
              </InputIcon>
              <Input
                placeholder="Address"
                name="address"
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>
          <MapBox>Map loading... (Embed here)</MapBox>
        </CardSection>

        <SubmitButton>
          <span>Submit Listing</span>
          <ArrowRight size={16} />
        </SubmitButton>
      </Wrapper>
    </>
  );
}

// Styled Components
const Wrapper = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.header`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #222;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-left: 2.5rem;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const ProgressNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.active ? "#16a394" : "#e5e5e5")};
  color: ${(props) => (props.active ? "white" : "#888")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  transition: all 0.3s ease;
`;

const ProgressLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
`;

const ProgressLine = styled.div`
  height: 2px;
  background-color: #e5e5e5;
  flex: 1;
  margin: 0 0.5rem;
`;

const CardSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 0.85rem 0.85rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #16a394;
    box-shadow: 0 0 0 2px rgba(22, 163, 148, 0.1);
    background-color: white;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #888;
`;

const SelectGroup = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.85rem 0.85rem 0.85rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f9fafb;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;

  &:focus {
    outline: none;
    border-color: #16a394;
    box-shadow: 0 0 0 2px rgba(22, 163, 148, 0.1);
    background-color: white;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #888;
`;

const TextareaGroup = styled.div`
  position: relative;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

interface NavItemProps {
  active: boolean;
}

const NavItem = styled.button<NavItemProps>`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#222" : "#666")};
  cursor: pointer;
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  color: #222;
  font-weight: 500;
  cursor: pointer;
`;

const LanguageSelector = styled.select`
  border: none;
  background: none;
  font-size: 0.9rem;
  color: #222;
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #222;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1rem;
`;

interface MobileNavItemProps {
  active: boolean;
}
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.a`
  font-size: 1.8rem;
  font-weight: 700;
  color: #222;
  text-decoration: none;
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;
const MobileNavItem = styled.button<MobileNavItemProps>`
  background: none;
  border: none;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: ${(props) => (props.active ? "#222" : "#666")};
`;

const MobileLanguageSelector = styled.select`
  margin: 0.75rem 1rem;
  padding: 0.5rem;
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
const Textarea = styled.textarea`
  width: 100%;
  padding: 0.85rem 0.85rem 0.85rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f9fafb;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #16a394;
    box-shadow: 0 0 0 2px rgba(22, 163, 148, 0.1);
    background-color: white;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const TextareaIcon = styled.div`
  position: absolute;
  top: 0.85rem;
  left: 0.75rem;
  color: #888;
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const AmenityLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9fafb;

  &:hover {
    background-color: #f0f9f8;
    border-color: #16a394;
  }
`;

const AmenityCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #16a394;
`;

const AmenityIcon = styled.div`
  color: #888;
`;

const UploadArea = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: #16a394;
    background-color: #f0f9f8;
  }
`;

const UploadIcon = styled.div`
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: #888;
  font-size: 0.875rem;
`;

const MapBox = styled.div`
  height: 250px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #666;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  background: #16a394;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  align-self: flex-end;
  box-shadow: 0 4px 6px rgba(22, 163, 148, 0.1);

  &:hover {
    background: #0e8a7c;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(22, 163, 148, 0.15);
  }
`;
