"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiArrowLeft, FiUpload, FiCheck, FiInfo } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/page";
import Link from "next/link";
import Footer from "@/components/Footer/page";
import { CREATE_ROOMMATE, GET_ALL_CITIES, GET_MUNICIPALITIES_BY_CITY_NAME } from "@/lib/queries";

// Form data interface matching the database schema
interface RoommateFormData {
  name: string;
  age: number;
  email: string;
  phone: string;
  profileImage: string;
  occupation: string;
  gender: string;
  description: string;
  
  // Location
  cityId: string;
  municipalityId: string;
  isLocationFlexible: boolean;
  
  // Budget and housing
  budgetMin: number;
  budgetMax: number;
  currency: string;
  housingType: string;
  preferredRoomType: string;
  moveInDate: string;
  
  // Lifestyle
  smokingPolicy: string;
  petPolicy: string;
  guestPolicy: string;
  cleanlinessLevel: string;
  noiseLevel: string;
  
  // Personal
  isStudent: boolean;
  isProfessional: boolean;
  workFromHome: boolean;
  hasOwnFurniture: boolean;
  
  // Arrays
  interests: string[];
  languages: string[];
  
  // Contact
  preferredContact: string;
  availableForCall: string;
}

export default function PostRoommateProfilePage() {
  const router = useRouter();
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  
  // Initial form data
  const [formData, setFormData] = useState<RoommateFormData>({
    name: "",
    age: 18,
    email: "",
    phone: "",
    profileImage: "",
    occupation: "",
    gender: "PREFER_NOT_TO_SAY",
    description: "",
    
    // Location
    cityId: "",
    municipalityId: "",
    isLocationFlexible: false,
    
    // Budget and housing
    budgetMin: 0,
    budgetMax: 0,
    currency: "EUR",
    housingType: "ROOM_IN_SHARED_APARTMENT",
    preferredRoomType: "PRIVATE_ROOM",
    moveInDate: "",
    
    // Lifestyle
    smokingPolicy: "NO_PREFERENCE",
    petPolicy: "NO_PREFERENCE",
    guestPolicy: "OCCASIONALLY",
    cleanlinessLevel: "AVERAGE",
    noiseLevel: "MODERATE",
    
    // Personal
    isStudent: false,
    isProfessional: false,
    workFromHome: false,
    hasOwnFurniture: false,
    
    // Arrays
    interests: [],
    languages: [],
    
    // Contact
    preferredContact: "EMAIL",
    availableForCall: "",
  });

  // GraphQL queries and mutations
  const { data: citiesData } = useQuery(GET_ALL_CITIES);
  const { data: municipalitiesData } = useQuery(GET_MUNICIPALITIES_BY_CITY_NAME, {
    variables: { name: selectedCity },
    skip: !selectedCity,
  });
  
  const [createRoommate] = useMutation(CREATE_ROOMMATE);

  // Update selected city when city changes
  useEffect(() => {
    if (formData.cityId && citiesData?.city) {
      const city = citiesData.city.find((c: any) => c.id === formData.cityId);
      if (city) {
        setSelectedCity(city.name_en);
      }
    }
  }, [formData.cityId, citiesData]);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle array field changes (interests, languages)
  const handleArrayChange = (field: 'interests' | 'languages', value: string) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a storage service
      // For now, we'll just use a placeholder
      handleInputChange('profileImage', '/default-avatar.jpg');
    }
  };

  // Validate form
  const validateForm = () => {
    const required = ['name', 'age', 'email', 'cityId', 'gender', 'currency', 'housingType', 'preferredRoomType', 'smokingPolicy', 'petPolicy', 'guestPolicy', 'cleanlinessLevel', 'noiseLevel', 'preferredContact'];
    
    for (const field of required) {
      if (!formData[field as keyof RoommateFormData]) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }
    
    if (formData.age < 18 || formData.age > 99) {
      alert('Age must be between 18 and 99');
      return false;
    }
    
    if (formData.budgetMin < 0 || formData.budgetMax < 0) {
      alert('Budget values must be positive');
      return false;
    }
    
    if (formData.budgetMin > formData.budgetMax && formData.budgetMax > 0) {
      alert('Minimum budget cannot be higher than maximum budget');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Set expiration date to 30 days from now
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const result = await createRoommate({
        variables: {
          input: {
            ...formData,
            expiresAt,
          }
        }
      });

      if (result.data?.createRoommate) {
        setFormStep(2); // Show success step
      }
    } catch (error) {
      console.error('Error creating roommate profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Share details about yourself to find the perfect roommate match
          </PageSubtitle>
        </HeaderContent>
      </PageHeader>

      <Main>
        {formStep === 1 ? (
          <FormContainer onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <FormSection>
              <SectionTitle>Profile Picture</SectionTitle>
              <ProfileUploadArea>
                {formData.profileImage ? (
                  <ProfilePreview src={formData.profileImage} alt="Profile Preview" />
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

            {/* Personal Information */}
            <FormSection>
              <SectionTitle>Personal Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Full Name *</Label>
                  <Input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Age *</Label>
                  <Input 
                    type="number" 
                    min="18" 
                    max="99" 
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    required 
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label>Gender *</Label>
                  <Select 
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-binary</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Occupation</Label>
                  <Input 
                    type="text" 
                    placeholder="Student, Professional, etc."
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label>About Me *</Label>
                <Textarea
                  placeholder="Describe yourself, your lifestyle, and what you're looking for in a roommate..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </FormGroup>
            </FormSection>

            {/* Location Preferences */}
            <FormSection>
              <SectionTitle>Location Preferences</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>City *</Label>
                  <Select 
                    value={formData.cityId}
                    onChange={(e) => handleInputChange('cityId', e.target.value)}
                    required
                  >
                    <option value="">Select a city</option>
                    {citiesData?.city?.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name_en}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Municipality</Label>
                  <Select 
                    value={formData.municipalityId}
                    onChange={(e) => handleInputChange('municipalityId', e.target.value)}
                    disabled={!selectedCity}
                  >
                    <option value="">Any municipality</option>
                    {municipalitiesData?.municipalitiesByCityName?.map((municipality: any) => (
                      <option key={municipality.id} value={municipality.id}>
                        {municipality.name_en}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>
              
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    id="isLocationFlexible"
                    checked={formData.isLocationFlexible}
                    onChange={(e) => handleInputChange('isLocationFlexible', e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="isLocationFlexible">I'm flexible with location</CheckboxLabel>
                </CheckboxItem>
              </CheckboxGroup>
            </FormSection>

            {/* Housing & Budget Preferences */}
            <FormSection>
              <SectionTitle>Housing & Budget Preferences</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Housing Type *</Label>
                  <Select 
                    value={formData.housingType}
                    onChange={(e) => handleInputChange('housingType', e.target.value)}
                    required
                  >
                    <option value="ROOM_IN_SHARED_APARTMENT">Room in shared apartment</option>
                    <option value="ENTIRE_APARTMENT_SHARED">Entire apartment with roommate</option>
                    <option value="STUDIO_SHARED">Shared studio</option>
                    <option value="HOUSE_SHARED">Shared house</option>
                    <option value="ANY">Any housing type</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Preferred Room Type *</Label>
                  <Select 
                    value={formData.preferredRoomType}
                    onChange={(e) => handleInputChange('preferredRoomType', e.target.value)}
                    required
                  >
                    <option value="PRIVATE_ROOM">Private room</option>
                    <option value="SHARED_ROOM">Shared room</option>
                    <option value="MASTER_BEDROOM">Master bedroom</option>
                    <option value="ANY">Any room type</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label>Budget Range *</Label>
                  <BudgetRow>
                    <BudgetInput
                      type="number"
                      placeholder="Min"
                      value={formData.budgetMin || ''}
                      onChange={(e) => handleInputChange('budgetMin', parseFloat(e.target.value) || 0)}
                    />
                    <BudgetSeparator>-</BudgetSeparator>
                    <BudgetInput
                      type="number"
                      placeholder="Max"
                      value={formData.budgetMax || ''}
                      onChange={(e) => handleInputChange('budgetMax', parseFloat(e.target.value) || 0)}
                    />
                    <Select 
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      style={{ width: '100px', marginLeft: '0.5rem' }}
                    >
                      <option value="EUR">EUR</option>
                      <option value="MKD">MKD</option>
                      <option value="USD">USD</option>
                    </Select>
                  </BudgetRow>
                </FormGroup>
                <FormGroup>
                  <Label>Move-in Date</Label>
                  <Input 
                    type="date" 
                    value={formData.moveInDate}
                    onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            {/* Lifestyle Preferences */}
            <FormSection>
              <SectionTitle>Lifestyle Preferences</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Smoking Policy *</Label>
                  <Select 
                    value={formData.smokingPolicy}
                    onChange={(e) => handleInputChange('smokingPolicy', e.target.value)}
                    required
                  >
                    <option value="NON_SMOKER">Non-smoker</option>
                    <option value="SMOKER_OK">Smoker OK</option>
                    <option value="OUTDOOR_SMOKING_ONLY">Outdoor smoking only</option>
                    <option value="NO_PREFERENCE">No preference</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Pet Policy *</Label>
                  <Select 
                    value={formData.petPolicy}
                    onChange={(e) => handleInputChange('petPolicy', e.target.value)}
                    required
                  >
                    <option value="NO_PETS">No pets</option>
                    <option value="CATS_OK">Cats OK</option>
                    <option value="DOGS_OK">Dogs OK</option>
                    <option value="ALL_PETS_OK">All pets OK</option>
                    <option value="NO_PREFERENCE">No preference</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label>Guest Policy *</Label>
                  <Select 
                    value={formData.guestPolicy}
                    onChange={(e) => handleInputChange('guestPolicy', e.target.value)}
                    required
                  >
                    <option value="NO_GUESTS">No guests</option>
                    <option value="OCCASIONALLY">Occasionally</option>
                    <option value="FREQUENTLY">Frequently</option>
                    <option value="ANYTIME">Anytime</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Cleanliness Level *</Label>
                  <Select 
                    value={formData.cleanlinessLevel}
                    onChange={(e) => handleInputChange('cleanlinessLevel', e.target.value)}
                    required
                  >
                    <option value="VERY_CLEAN">Very clean</option>
                    <option value="CLEAN">Clean</option>
                    <option value="AVERAGE">Average</option>
                    <option value="RELAXED">Relaxed</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label>Noise Level *</Label>
                <Select 
                  value={formData.noiseLevel}
                  onChange={(e) => handleInputChange('noiseLevel', e.target.value)}
                  required
                >
                  <option value="VERY_QUIET">Very quiet</option>
                  <option value="QUIET">Quiet</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LIVELY">Lively</option>
                </Select>
              </FormGroup>
            </FormSection>

            {/* Personal Details */}
            <FormSection>
              <SectionTitle>Personal Details</SectionTitle>
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    id="isStudent"
                    checked={formData.isStudent}
                    onChange={(e) => handleInputChange('isStudent', e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="isStudent">I am a student</CheckboxLabel>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    id="isProfessional"
                    checked={formData.isProfessional}
                    onChange={(e) => handleInputChange('isProfessional', e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="isProfessional">I am a working professional</CheckboxLabel>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    id="workFromHome"
                    checked={formData.workFromHome}
                    onChange={(e) => handleInputChange('workFromHome', e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="workFromHome">I work from home</CheckboxLabel>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    id="hasOwnFurniture"
                    checked={formData.hasOwnFurniture}
                    onChange={(e) => handleInputChange('hasOwnFurniture', e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="hasOwnFurniture">I have my own furniture</CheckboxLabel>
                </CheckboxItem>
              </CheckboxGroup>
              
              <FormRow>
                <FormGroup>
                  <Label>Interests</Label>
                  <Input 
                    type="text" 
                    placeholder="e.g., cooking, reading, sports (separate with commas)"
                    value={formData.interests.join(', ')}
                    onChange={(e) => handleArrayChange('interests', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Languages</Label>
                  <Input 
                    type="text" 
                    placeholder="e.g., English, Macedonian, Albanian (separate with commas)"
                    value={formData.languages.join(', ')}
                    onChange={(e) => handleArrayChange('languages', e.target.value)}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            {/* Contact Information */}
            <FormSection>
              <SectionTitle>Contact Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Email *</Label>
                  <Input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label>Preferred Contact Method *</Label>
                  <Select 
                    value={formData.preferredContact}
                    onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                    required
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="TELEGRAM">Telegram</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Available for calls</Label>
                  <Input 
                    type="text" 
                    placeholder="e.g., 9 AM - 6 PM weekdays"
                    value={formData.availableForCall}
                    onChange={(e) => handleInputChange('availableForCall', e.target.value)}
                  />
                </FormGroup>
              </FormRow>
              
              <PrivacyNote>
                <FiInfo />
                <span>
                  Your contact details will only be visible to other verified users looking for roommates
                </span>
              </PrivacyNote>
            </FormSection>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Post My Roommate Profile'}
            </SubmitButton>
          </FormContainer>
        ) : (
          <SuccessContainer>
            <SuccessIcon>
              <FiCheck size={50} />
            </SuccessIcon>
            <SuccessTitle>Your roommate profile has been posted!</SuccessTitle>
            <SuccessMessage>
              Your roommate profile is now live and visible to other users. 
              People looking for roommates can now contact you based on your preferences.
            </SuccessMessage>
            <ButtonGroup>
              <ViewProfileButton onClick={() => router.push('/find-roommate')}>
                View All Roommates
              </ViewProfileButton>
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
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
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
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const BudgetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BudgetInput = styled(Input)`
  margin-bottom: 0;
  flex: 1;
`;

const BudgetSeparator = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }
`;

const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #6e8efb;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
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
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  background: #6e8efb;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #5a7de5;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SuccessIcon = styled.div`
  color: #10b981;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const SuccessMessage = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
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
  background: transparent;
  color: #6e8efb;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border: 1px solid #6e8efb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #6e8efb;
    color: white;
  }
`;
