"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { useMutation, useQuery, ApolloProvider } from "@apollo/client";
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
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";
import { CREATE_LISTING, GET_ALL_CITIES } from "@/lib/queries";
import { getClient } from "@/lib/client";

interface FormData {
  name: string;
  email: string;
  phone: string;
  title: string;
  type: string;
  listingType: string;
  price: string;
  size: string;
  condition: string;
  floor: string;
  totalFloors: string;
  rooms: string;
  bathrooms: string;
  description: string;
  city: string;
  municipality: string;
  address: string;
  images: File[];
  amenities: string[];
}

interface ListingResult {
  id: string;
  bookingNumber?: string;
  title: string;
}

interface StyledProps {
  active?: boolean;
  completed?: boolean;
}

interface FormGridProps {
  columns?: number;
}

interface InputProps {
  autoFilled?: boolean;
}

function PostPropertyForm() {
  const t = useTranslations("PostProperty");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listingResult, setListingResult] = useState<ListingResult | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  // GraphQL hooks
  const [createListing] = useMutation(CREATE_LISTING);
  const { data: citiesData } = useQuery(GET_ALL_CITIES);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    title: "",
    type: "APARTMENT",
    listingType: "RENT",
    price: "",
    size: "",
    condition: "NEW",
    floor: "",
    totalFloors: "",
    rooms: "",
    bathrooms: "",
    description: "",
    city: "",
    municipality: "",
    address: "",
    images: [],
    amenities: [],
  });

  // Check for user authentication and populate form data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userToken = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
      const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (userToken && storedUserData) {
        const user = JSON.parse(storedUserData);
        setIsUserLoggedIn(true);
        setUserData(user);
        
        // Auto-populate contact information
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      } else {
        setIsUserLoggedIn(false);
        setUserData(null);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (name === "amenities") {
        setFormData(prev => {
          const updatedAmenities = checkbox.checked
            ? [...prev.amenities, value]
            : prev.amenities.filter(amenity => amenity !== value);
          return { ...prev, amenities: updatedAmenities };
        });
      } else {
        setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
      }
    } else if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files) {
        setFormData(prev => ({ ...prev, images: Array.from(fileInput.files!) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone) {
          setError(t("errors.required"));
          return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          setError(t("errors.invalidEmail"));
          return false;
        }
        break;
      case 2:
        if (!formData.title || !formData.price || !formData.size || !formData.description || !formData.city) {
          setError(t("errors.required"));
          return false;
        }
        break;
      case 3:
        if (formData.images.length === 0) {
          setError(t("errors.minPhotos"));
          return false;
        }
        if (formData.images.length > 10) {
          setError(t("errors.maxPhotos"));
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

  // Upload images to a service (placeholder - replace with your image upload service)
  const uploadImages = async (images: File[]): Promise<string[]> => {
    // This is a placeholder. In a real app, you'd upload to cloudinary, AWS S3, etc.
    return images.map((_, index) => `/placeholder-image-${index + 1}.jpg`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setLoading(true);
    setError("");

    try {
      // Upload images first
      const imageUrls = await uploadImages(formData.images);
      
      // Find the selected city
      const selectedCity = citiesData?.city?.find(
        (city: any) => city.name_en.toLowerCase() === formData.city.toLowerCase()
      );
      
      if (!selectedCity) {
        throw new Error("Selected city not found");
      }

      // Prepare the input for GraphQL mutation
      const input = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        transaction: formData.listingType,
        price: parseFloat(formData.price),
        size: parseFloat(formData.size),
        condition: formData.condition,
        floor: formData.floor ? parseInt(formData.floor) : null,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        amenities: formData.amenities,
        address: formData.address,
        images: imageUrls,
        contactName: formData.name,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        cityId: selectedCity.id,
        municipalityId: formData.municipality || null,
      };

      // Create the listing
      const { data } = await createListing({ variables: { input } });
      
      if (data?.createListing) {
        // Store the result and show success page
        setListingResult({
          id: data.createListing.id,
          bookingNumber: data.createListing.bookingNumber,
          title: data.createListing.title,
        });
        setStep(4); // Move to success step
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setLoading(false);
    }
  };

  // All 18 amenities matching the backend
  const allAmenities = [
    "BALCONY",
    "HEATING", 
    "AIR_CONDITIONING",
    "FURNISHED",
    "ELEVATOR",
    "PARKING",
    "GARDEN",
    "SWIMMING_POOL",
    "INTERNET",
    "LAUNDRY",
    "DISHWASHER", 
    "SECURITY",
    "STORAGE",
    "PET_FRIENDLY",
    "TERRACE",
    "FIREPLACE",
    "CABLE_TV",
    "WASHING_MACHINE"
  ];

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <Header>
          <Title>
            <FileText size={24} /> {t("title")}
          </Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Header>

        <ContentContainer>
          {/* Full Control Section */}
          <FullControlSection>
            {isUserLoggedIn ? (
              <LoggedInCard>
                <ControlHeader>
                  <ControlIcon>👤</ControlIcon>
                  <ControlInfo>
                    <ControlTitle>Full Control Mode</ControlTitle>
                    <ControlSubtitle>Logged in as {userData?.name}</ControlSubtitle>
                  </ControlInfo>
                  <ControlBadge>✓ Verified</ControlBadge>
                </ControlHeader>
                <ControlFeatures>
                  <FeatureItem>✓ Contact info auto-filled</FeatureItem>
                  <FeatureItem>✓ Edit listings anytime</FeatureItem>
                  <FeatureItem>✓ View analytics</FeatureItem>
                  <FeatureItem>✓ Manage all properties</FeatureItem>
                </ControlFeatures>
              </LoggedInCard>
            ) : (
                             <GuestCard>
                 <ControlHeader>
                   <ControlIcon>🔓</ControlIcon>
                   <ControlInfo>
                     <ControlTitle>Post Without Login - No Account Required!</ControlTitle>
                     <ControlSubtitle>
                       You can post your property instantly without creating an account. 
                       We'll give you a unique booking number to access and manage your listing anytime.
                     </ControlSubtitle>
                   </ControlInfo>
                 </ControlHeader>
                 <GuestFeatures>
                   <GuestFeatureItem>✓ Post immediately - no registration needed</GuestFeatureItem>
                   <GuestFeatureItem>✓ Get a unique booking number for access</GuestFeatureItem>
                   <GuestFeatureItem>✓ Manage your listing with the booking number</GuestFeatureItem>
                   <GuestFeatureItem>✓ Upgrade to full account anytime later</GuestFeatureItem>
                 </GuestFeatures>
                 <GuestActions>
                   <LoginForControlButton href="/login">
                     Login for Full Control
                   </LoginForControlButton>
                   <CreateAccountForControlButton href="/register">
                     Create Account
                   </CreateAccountForControlButton>
                 </GuestActions>
               </GuestCard>
            )}
          </FullControlSection>

          <FormContainer>
            <ProgressBar>
              <ProgressStep active={step >= 1} completed={step > 1}>
                <StepCircle active={step >= 1} completed={step > 1}>
                  {step > 1 ? <Check size={16} /> : "1"}
                </StepCircle>
                <StepLabel active={step >= 1}>{t("steps.details")}</StepLabel>
              </ProgressStep>
              <ProgressLine completed={step > 1} />
              <ProgressStep active={step >= 2} completed={step > 2}>
                <StepCircle active={step >= 2} completed={step > 2}>
                  {step > 2 ? <Check size={16} /> : "2"}
                </StepCircle>
                <StepLabel active={step >= 2}>{t("steps.media")}</StepLabel>
              </ProgressStep>
              <ProgressLine completed={step > 2} />
              <ProgressStep active={step >= 3}>
                <StepCircle active={step >= 3}>3</StepCircle>
                <StepLabel active={step >= 3}>{t("steps.publish")}</StepLabel>
              </ProgressStep>
            </ProgressBar>

            <Form onSubmit={handleSubmit}>
              {error && (
                <ErrorMessage>
                  <Info size={16} />
                  {error}
                </ErrorMessage>
              )}

              {/* Step 1: Contact and Basic Info */}
              {step === 1 && (
                <StepContent>
                  <CardSection>
                    <SectionTitle>
                      <User size={18} /> {t("contactInfo.title")}
                      {isUserLoggedIn && <AutoFilledBadge>Auto-filled</AutoFilledBadge>}
                    </SectionTitle>
                    <FormGrid>
                      <FormGroup>
                        <Label>
                          <User size={16} />
                          {t("contactInfo.fullName")}
                        </Label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t("contactInfo.fullNamePlaceholder")}
                          required
                          disabled={isUserLoggedIn}
                          autoFilled={isUserLoggedIn}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>
                          <Mail size={16} />
                          {t("contactInfo.email")}
                        </Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t("contactInfo.emailPlaceholder")}
                          required
                          disabled={isUserLoggedIn}
                          autoFilled={isUserLoggedIn}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>
                          <Phone size={16} />
                          {t("contactInfo.phone")}
                        </Label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t("contactInfo.phonePlaceholder")}
                          required
                          disabled={isUserLoggedIn}
                          autoFilled={isUserLoggedIn}
                        />
                      </FormGroup>
                    </FormGrid>
                  </CardSection>

                  {/* Login Benefits Section */}
                  <LoginBenefitsCard>
                    <BenefitsHeader>
                      <BenefitsIcon>🚀</BenefitsIcon>
                      <BenefitsTitle>No Login Required - Post Instantly!</BenefitsTitle>
                    </BenefitsHeader>
                    <BenefitsText>
                      <strong>Good news!</strong> You can post your property right now without creating an account. 
                      We'll give you a booking number to manage everything. But if you want even more control, 
                      creating an account gives you:
                    </BenefitsText>
                    <BenefitsList>
                      <BenefitItem>✓ Edit and update your listings anytime from dashboard</BenefitItem>
                      <BenefitItem>✓ View detailed analytics and visitor statistics</BenefitItem>
                      <BenefitItem>✓ Save and organize favorite properties</BenefitItem>
                      <BenefitItem>✓ Manage multiple listings in one place</BenefitItem>
                      <BenefitItem>✓ Get priority support and notifications</BenefitItem>
                      <BenefitItem>✓ No need to remember booking numbers</BenefitItem>
                    </BenefitsList>
                    <BenefitsNote>
                      💡 <em>You can always create an account later and link your existing listings!</em>
                    </BenefitsNote>
                    <BenefitsActions>
                      <LoginButton href="/login">Login</LoginButton>
                      <RegisterButton href="/register">Create Account</RegisterButton>
                    </BenefitsActions>
                  </LoginBenefitsCard>
                </StepContent>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <StepContent>
                  <CardSection>
                    <SectionTitle>
                      <Building2 size={18} /> {t("propertyDetails.title")}
                    </SectionTitle>
                    <FormGrid>
                      <FormGroup>
                        <Label>
                          <Tag size={16} />
                          {t("propertyDetails.listingTitle")}
                        </Label>
                        <Input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder={t("propertyDetails.listingTitlePlaceholder")}
                          required
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid>
                      <FormGroup>
                        <Label>
                          <Home size={16} />
                          {t("propertyDetails.propertyType")}
                        </Label>
                        <Select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          required
                        >
                          <option value="APARTMENT">{t("propertyDetails.types.apartment")}</option>
                          <option value="HOUSE">{t("propertyDetails.types.house")}</option>
                          <option value="ROOM">Room</option>
                          <option value="OFFICE">{t("propertyDetails.types.office")}</option>
                          <option value="VILLA">Villa</option>
                          <option value="GARAGE">Garage</option>
                          <option value="STORAGE_ROOM">Storage Room</option>
                          <option value="COMMERCIAL">Commercial</option>
                          <option value="LAND">{t("propertyDetails.types.land")}</option>
                          <option value="BUILDING">Building</option>
                          <option value="HOLIDAY">Holiday Property</option>
                          <option value="STUDIO">Studio</option>
                        </Select>
                      </FormGroup>

                      <FormGroup>
                        <Label>
                          <Tag size={16} />
                          {t("propertyDetails.listingType")}
                        </Label>
                        <Select
                          name="listingType"
                          value={formData.listingType}
                          onChange={handleChange}
                          required
                        >
                          <option value="RENT">{t("propertyDetails.listingTypes.rent")}</option>
                          <option value="SALE">{t("propertyDetails.listingTypes.buy")}</option>
                        </Select>
                      </FormGroup>
                    </FormGrid>

                    <FormGrid>
                      <FormGroup>
                        <Label>
                          <DollarSign size={16} />
                          {t("propertyDetails.price")}
                        </Label>
                        <Input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder={t("propertyDetails.pricePlaceholder")}
                          required
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>
                          <Ruler size={16} />
                          {t("propertyDetails.size")}
                        </Label>
                        <Input
                          type="number"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          placeholder={t("propertyDetails.sizePlaceholder")}
                          required
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid>
                      <FormGroup>
                        <Label>
                          <Info size={16} />
                          {t("propertyDetails.condition")}
                        </Label>
                        <Select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                        >
                          <option value="NEW">{t("propertyDetails.conditions.new")}</option>
                          <option value="RENOVATED">{t("propertyDetails.conditions.renovated")}</option>
                          <option value="NEEDS_RENOVATION">{t("propertyDetails.conditions.needsRenovation")}</option>
                        </Select>
                      </FormGroup>

                      <FormGroup>
                        <Label>
                          <Building2 size={16} />
                          {t("propertyDetails.floor")}
                        </Label>
                        <Input
                          type="number"
                          name="floor"
                          value={formData.floor}
                          onChange={handleChange}
                          placeholder={t("propertyDetails.floorPlaceholder")}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>
                          <Building2 size={16} />
                          {t("propertyDetails.totalFloors")}
                        </Label>
                        <Input
                          type="number"
                          name="totalFloors"
                          value={formData.totalFloors}
                          onChange={handleChange}
                          placeholder={t("propertyDetails.totalFloorsPlaceholder")}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid>
                      <FormGroup>
                        <Label>
                          <BedDouble size={16} />
                          {t("propertyDetails.rooms")}
                        </Label>
                        <Input
                          type="number"
                          name="rooms"
                          value={formData.rooms}
                          onChange={handleChange}
                          placeholder={t("propertyDetails.roomsPlaceholder")}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>
                          <Bath size={16} />
                          {t("propertyDetails.bathrooms")}
                        </Label>
                        <Input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleChange}
                          placeholder={t("propertyDetails.bathroomsPlaceholder")}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGroup>
                      <Label>
                        <FileText size={16} />
                        {t("description.title")}
                      </Label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder={t("description.placeholder")}
                        rows={4}
                        required
                      />
                    </FormGroup>
                  </CardSection>

                  <CardSection>
                    <SectionTitle>
                      <MapPin size={18} /> {t("location.title")}
                    </SectionTitle>
                    <FormGrid>
                      <FormGroup>
                        <Label>
                          <MapPin size={16} />
                          {t("location.city")}
                        </Label>
                        <Select
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        >
                          <option value="">{t("location.selectCity")}</option>
                          {citiesData?.city?.map((city: any) => (
                            <option key={city.id} value={city.name_en}>
                              {city.name_en}
                            </option>
                          ))}
                        </Select>
                      </FormGroup>

                      <FormGroup>
                        <Label>
                          <Building2 size={16} />
                          Municipality (Optional)
                        </Label>
                        <Input
                          type="text"
                          name="municipality"
                          value={formData.municipality}
                          onChange={handleChange}
                          placeholder="Enter municipality"
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGroup>
                      <Label>
                        <MapPin size={16} />
                        {t("location.address")}
                      </Label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={t("location.addressPlaceholder")}
                      />
                    </FormGroup>
                  </CardSection>

                  <CardSection>
                    <SectionTitle>
                      <Check size={18} /> {t("amenities.title")}
                    </SectionTitle>
                    <AmenitiesGrid>
                      {allAmenities.map((amenity) => (
                        <AmenityItem key={amenity}>
                          <Checkbox
                            type="checkbox"
                            id={amenity}
                            name="amenities"
                            value={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onChange={handleChange}
                          />
                          <AmenityLabel htmlFor={amenity}>
                            {t(`amenities.${amenity.toLowerCase()}`)}
                          </AmenityLabel>
                        </AmenityItem>
                      ))}
                    </AmenitiesGrid>
                  </CardSection>
                </StepContent>
              )}

              {/* Step 3: Media Upload */}
              {step === 3 && (
                <StepContent>
                  <CardSection>
                    <SectionTitle>
                      <Image size={18} /> {t("media.title")}
                    </SectionTitle>
                    <UploadArea>
                      <input
                        type="file"
                        name="images"
                        onChange={handleChange}
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload"
                      />
                      <UploadContent>
                        <UploadCloud size={48} />
                        <UploadText>{t("media.dragDrop")}</UploadText>
                        <UploadSubtext>
                          {t("media.maxSize")}
                          <br />
                          {t("media.formats")}
                        </UploadSubtext>
                        <UploadButton htmlFor="image-upload">
                          {formData.images.length > 0
                            ? `${formData.images.length} images selected`
                            : "Choose Files"}
                        </UploadButton>
                      </UploadContent>
                    </UploadArea>
                  </CardSection>
                </StepContent>
              )}

              {/* Step 4: Success */}
              {step === 4 && listingResult && (
                <StepContent>
                  <SuccessCard>
                    <SuccessIcon>🎉</SuccessIcon>
                    <SuccessTitle>Property Posted Successfully!</SuccessTitle>
                    <SuccessSubtitle>Your listing "{listingResult.title}" is now live</SuccessSubtitle>
                    
                    {isUserLoggedIn ? (
                      <LoggedInSuccessCard>
                        <LoggedInSuccessTitle>✓ Full Control Active</LoggedInSuccessTitle>
                        <LoggedInSuccessText>
                          Your listing is linked to your account. You can edit, update, and manage it anytime from your dashboard.
                        </LoggedInSuccessText>
                        <ManageListingButton href={`/my-listings`}>
                          Manage My Listings
                        </ManageListingButton>
                      </LoggedInSuccessCard>
                    ) : (
                      listingResult.bookingNumber && (
                        <BookingNumberCard>
                          <BookingNumberLabel>🎫 Your Unique Booking Number:</BookingNumberLabel>
                          <BookingNumber>{listingResult.bookingNumber}</BookingNumber>
                          <BookingNumberNote>
                            <strong>Important:</strong> Save this booking number! You posted without creating an account, 
                            so this number is your key to access and manage your listing. You can:
                          </BookingNumberNote>
                          <BookingNumberFeatures>
                            <BookingFeatureItem>• View your listing anytime at /booking/{listingResult.bookingNumber}</BookingFeatureItem>
                            <BookingFeatureItem>• Share this number with others to help manage your property</BookingFeatureItem>
                            <BookingFeatureItem>• Use it to prove ownership of the listing</BookingFeatureItem>
                            <BookingFeatureItem>• Keep it safe - no password recovery needed!</BookingFeatureItem>
                          </BookingNumberFeatures>
                        </BookingNumberCard>
                      )
                    )}

                    <SuccessActions>
                      <ViewListingButton href={`/listing/${listingResult.id}`}>
                        View Your Listing
                      </ViewListingButton>
                      <PostAnotherButton onClick={() => window.location.reload()}>
                        Post Another Property
                      </PostAnotherButton>
                    </SuccessActions>

                    {!isUserLoggedIn && (
                      <AccountPrompt>
                        <AccountPromptTitle>Want to manage your listings easily?</AccountPromptTitle>
                        <AccountPromptText>
                          Create an account to edit, update, and track all your properties in one place.
                        </AccountPromptText>
                        <AccountPromptActions>
                          <CreateAccountButton href="/register">Create Free Account</CreateAccountButton>
                          <LoginPromptButton href="/login">I Already Have an Account</LoginPromptButton>
                        </AccountPromptActions>
                      </AccountPrompt>
                    )}
                  </SuccessCard>
                </StepContent>
              )}

              {step < 4 && (
                <ButtonGroup>
                  {step > 1 && (
                    <SecondaryButton type="button" onClick={prevStep}>
                      {t("buttons.back")}
                    </SecondaryButton>
                  )}
                  {step < 3 ? (
                    <PrimaryButton type="button" onClick={nextStep}>
                      {t("buttons.next")}
                      <ArrowRight size={16} />
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton type="submit" disabled={loading}>
                      {loading ? "..." : t("buttons.publish")}
                      <Check size={16} />
                    </PrimaryButton>
                  )}
                </ButtonGroup>
              )}
            </Form>
          </FormContainer>
        </ContentContainer>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

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

const Header = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    color: #0c4240;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
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

const ProgressStep = styled.div<StyledProps>`
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

const StepCircle = styled.div<StyledProps>`
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

const StepLabel = styled.div<StyledProps>`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => (props.active ? "#0c4240" : "#777")};
  transition: color 0.3s ease;
`;

const ProgressLine = styled.div<StyledProps>`
  flex-grow: 1;
  height: 2px;
  background: ${props => (props.completed ? "#0c4240" : "#e1e5eb")};
  margin: 0 0.5rem;
  transition: background 0.3s ease;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Form = styled.form`
  padding: 2rem;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CardSection = styled.section`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
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

const FormGrid = styled.div<FormGridProps>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
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

const Input = styled.input<InputProps>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: ${props => props.autoFilled ? '#f0f9ff' : 'white'};
  position: relative;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 2px rgba(12, 66, 64, 0.1);
  }

  &:disabled {
    background: #f0f9ff;
    border-color: #86efac;
    color: #16a34a;
    cursor: not-allowed;
    
    &::placeholder {
      color: #16a34a;
    }
  }

  &::placeholder {
    color: #aaa;
  }
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
  min-height: 120px;
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

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #0c4240;
  cursor: pointer;
`;

const AmenityLabel = styled.label`
  font-size: 0.95rem;
  color: #444;
  cursor: pointer;
`;

const UploadArea = styled.div`
  border: 2px dashed #e1e5eb;
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #0c4240;
    background: #f5f9f9;
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;

  svg {
    color: #0c4240;
  }
`;

const UploadText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #444;
`;

const UploadSubtext = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #f5f9f9;
  color: #0c4240;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e7f1f1;
    transform: translateY(-1px);
  }
`;

// Login Benefits Card Styles
const LoginBenefitsCard = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const BenefitsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const BenefitsIcon = styled.div`
  font-size: 1.5rem;
`;

const BenefitsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0;
`;

const BenefitsText = styled.p`
  color: #475569;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const BenefitItem = styled.li`
  color: #475569;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const BenefitsNote = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  margin: 1rem 0;
  font-size: 0.85rem;
  color: #1e40af;
`;

const BenefitsActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const LoginButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #0c4240;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0a3533;
    transform: translateY(-1px);
  }
`;

const RegisterButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  color: #0c4240;
  text-decoration: none;
  border: 1px solid #0c4240;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f9ff;
    transform: translateY(-1px);
  }
`;

// Success Page Styles
const SuccessCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
`;

const SuccessSubtitle = styled.p`
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 1rem;
`;

const BookingNumberCard = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
`;

const BookingNumberLabel = styled.div`
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 0.5rem;
`;

const BookingNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c4240;
  font-family: monospace;
  letter-spacing: 2px;
  margin-bottom: 0.75rem;
`;

const BookingNumberNote = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const BookingNumberFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BookingFeatureItem = styled.div`
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.4;
`;

const SuccessActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const ViewListingButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #0c4240;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0a3533;
    transform: translateY(-1px);
  }
`;

const PostAnotherButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #0c4240;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f9f9;
    transform: translateY(-1px);
  }
`;

const AccountPrompt = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const AccountPromptTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0c4240;
  margin: 0 0 0.5rem 0;
`;

const AccountPromptText = styled.p`
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const AccountPromptActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const CreateAccountButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #0c4240;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0a3533;
    transform: translateY(-1px);
  }
`;

const LoginPromptButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  color: #0c4240;
  text-decoration: none;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f9f9;
    transform: translateY(-1px);
  }
`;

// Full Control Section Styles
const FullControlSection = styled.div`
  margin-bottom: 2rem;
`;

const LoggedInCard = styled.div`
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const GuestCard = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fbbf24;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ControlHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ControlIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
`;

const ControlInfo = styled.div`
  flex: 1;
`;

const ControlTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0c4240;
  margin: 0 0 0.25rem 0;
`;

const ControlSubtitle = styled.p`
  font-size: 0.9rem;
  color: #475569;
  margin: 0;
`;

const ControlBadge = styled.div`
  background: #22c55e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ControlFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FeatureItem = styled.div`
  color: #16a34a;
  font-size: 0.9rem;
  font-weight: 500;
`;

const GuestFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const GuestFeatureItem = styled.div`
  color: #d97706;
  font-size: 0.9rem;
  font-weight: 500;
`;

const GuestActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const LoginForControlButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #0c4240;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(12, 66, 64, 0.2);

  &:hover {
    background: #0a3533;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(12, 66, 64, 0.3);
  }
`;

const CreateAccountForControlButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #0c4240;
  text-decoration: none;
  border: 2px solid #0c4240;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #0c4240;
    color: white;
    transform: translateY(-2px);
  }
`;

const AutoFilledBadge = styled.span`
  background: #22c55e;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Logged-in Success Styles
const LoggedInSuccessCard = styled.div`
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
`;

const LoggedInSuccessTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #16a34a;
  margin: 0 0 0.5rem 0;
`;

const LoggedInSuccessText = styled.p`
  color: #15803d;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const ManageListingButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #16a34a;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #15803d;
    transform: translateY(-1px);
  }
`;

export default function PostPropertyPage() {
  const client = getClient();
  
  return (
    <ApolloProvider client={client}>
      <PostPropertyForm />
    </ApolloProvider>
  );
}
