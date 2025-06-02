import { gql } from "@apollo/client";

export const GET_ALL_CITIES = gql`
  query GET_ALL_CITIES {
    city {
      id
      name_mk
      name_en
      name_sq
      slug
    }
  }
`;
export const GET_MUNICIPALITIES_BY_CITY_NAME = gql`
  query GET_MUNICIPALITIES_BY_CITY_NAME(
    $name: String!
    $transaction: TransactionType
    $propertyType: PropertyType
  ) {
    municipalitiesByCityName(
      name: $name
      transaction: $transaction
      propertyType: $propertyType
    ) {
      id
      name_mk
      name_en
      name_sq
      isPopular
      averagePrice
      image
      propertyCount
    }
  }
`;
export const LISTINGS_BY_MUNICIPALITY = gql`
  query ListingsByMunicipalityName($name: String!) {
    listingsByMunicipalityName(name: $name) {
      id
      title
      description
      price
      sizeM2
      bedrooms
      bathrooms
      floor
      totalFloors
      type
      images
      createdAt
    }
  }
`;

export const LISTINGS_BY_MUNICIPALITY_FILTER = gql`
  query ListingsByMunicipalityFilter(
    $name: String!
    $filter: ListingFilterInput
  ) {
    listingsByMunicipalityFilter(name: $name, filter: $filter) {
      id
      title
      price
      rooms
      bathrooms
      size
      images
      createdAt 
      type
      transaction
      cityId
      municipalityId
    }
  }
`;

export const GET_LISTING_BY_ID = gql`
  query GetListingById($id: ID!) {
    listingById(id: $id) {
      id
      title
      description
      type
      transaction
      price
      size
      condition
      floor
      totalFloors
      rooms
      bathrooms
      amenities
      address
      images
      contactName
      contactEmail
      contactPhone
      bookingNumber
      createdAt
      expiresAt
      cityId
      municipalityId
      city {
        id
        name_en
        name_mk
        name_sq
        slug
      }
      municipality {
        id
        name_en
        name_mk
        name_sq
      }
    }
  }
`;

export const GET_LISTING_BY_BOOKING_NUMBER = gql`
  query GetListingByBookingNumber($bookingNumber: String!) {
    listingByBookingNumber(bookingNumber: $bookingNumber) {
      id
      title
      description
      type
      transaction
      price
      size
      condition
      floor
      totalFloors
      rooms
      bathrooms
      amenities
      address
      images
      contactName
      contactEmail
      contactPhone
      bookingNumber
      createdAt
      expiresAt
      cityId
      municipalityId
      city {
        id
        name_en
        name_mk
        name_sq
        slug
      }
      municipality {
        id
        name_en
        name_mk
        name_sq
      }
    }
  }
`;

export const CREATE_LISTING = gql`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
      description
      type
      transaction
      price
      size
      condition
      floor
      totalFloors
      rooms
      bathrooms
      amenities
      address
      images
      contactName
      contactEmail
      contactPhone
      bookingNumber
      createdAt
      expiresAt
      cityId
      municipalityId
    }
  }
`;

export const GET_ROOMMATES = gql`
  query GetRoommates($filter: RoommateFilterInput) {
    roommates(filter: $filter) {
      id
      name
      age
      email
      phone
      profileImage
      occupation
      gender
      isOnline
      isVerified
      description
      city {
        id
        name_en
        name_mk
        name_sq
      }
      municipality {
        id
        name_en
        name_mk
        name_sq
      }
      isLocationFlexible
      budgetMin
      budgetMax
      currency
      housingType
      preferredRoomType
      moveInDate
      smokingPolicy
      petPolicy
      guestPolicy
      cleanlinessLevel
      noiseLevel
      isStudent
      isProfessional
      workFromHome
      hasOwnFurniture
      interests
      languages
      preferredContact
      availableForCall
      createdAt
      expiresAt
      lastSeenAt
    }
  }
`;

export const CREATE_ROOMMATE = gql`
  mutation CreateRoommate($input: CreateRoommateInput!) {
    createRoommate(input: $input) {
      id
      name
      age
      email
      phone
      profileImage
      occupation
      gender
      isOnline
      isVerified
      description
      city {
        id
        name_en
        name_mk
        name_sq
      }
      municipality {
        id
        name_en
        name_mk
        name_sq
      }
      isLocationFlexible
      budgetMin
      budgetMax
      currency
      housingType
      preferredRoomType
      moveInDate
      smokingPolicy
      petPolicy
      guestPolicy
      cleanlinessLevel
      noiseLevel
      isStudent
      isProfessional
      workFromHome
      hasOwnFurniture
      interests
      languages
      preferredContact
      availableForCall
      createdAt
      expiresAt
    }
  }
`;

export const REGISTER_AGENCY = gql`
  mutation RegisterAgency($input: CreateAgencyInput!) {
    registerAgency(input: $input) {
      token
      agency {
        id
        companyName
        email
        phone
        website
        address
        city
        zipCode
        contactPerson
        contactRole
        agencySize
        logo
        description
        specializations
        isVerified
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGIN_AGENCY = gql`
  mutation LoginAgency($input: AgencyLoginInput!) {
    loginAgency(input: $input) {
      token
      agency {
        id
        companyName
        email
        phone
        website
        address
        city
        zipCode
        contactPerson
        contactRole
        agencySize
        logo
        description
        specializations
        isVerified
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: CreateUserInput!) {
    registerUser(input: $input) {
      token
      user {
        id
        name
        email
        phone
        isVerified
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: UserLoginInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        email
        phone
        isVerified
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_AGENCIES = gql`
  query GetAgencies {
    agencies {
      id
      companyName
      email
      phone
      website
      address
      city
      zipCode
      contactPerson
      contactRole
      agencySize
      logo
      description
      specializations
      isVerified
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_AGENCY = gql`
  query GetAgency($id: ID!) {
    agency(id: $id) {
      id
      companyName
      email
      phone
      website
      address
      city
      zipCode
      contactPerson
      contactRole
      agencySize
      logo
      description
      specializations
      isVerified
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
      title_en
      title_mk
      title_sq
      slug_en
      slug_mk
      slug_sq
      isPublished
      createdAt
    }
  }
`;

export const GET_ALL_ARCHITECTS = gql`
  query GetAllArchitects($filter: ArchitectFilterInput) {
    architects(filter: $filter) {
      id
      firstName
      lastName
      email
      phone
      website
      profileImage
      portfolioImages
      bio_en
      bio_mk
      bio_sq
      specializations
      services
      projectTypes
      city {
        id
        name_en
        name_mk
        name_sq
        slug
      }
      municipality {
        id
        name_en
        name_mk
        name_sq
      }
      consultationFee
      projectFeeMin
      projectFeeMax
      currency
      isAvailable
      isVerified
      isPremium
      averageRating
      totalReviews
      yearsExperience
      companyName
      position
      licenseNumber
      createdAt
      updatedAt
    }
  }
`;

export const GET_ARCHITECT_BY_ID = gql`
  query GetArchitectById($id: ID!) {
    architectById(id: $id) {
      id
      firstName
      lastName
      email
      phone
      website
      linkedIn
      instagram
      facebook
      profileImage
      portfolioImages
      bio_en
      bio_mk
      bio_sq
      specializations
      services
      projectTypes
      city {
        id
        name_en
        name_mk
        name_sq
        slug
      }
      municipality {
        id
        name_en
        name_mk
        name_sq
      }
      address
      consultationFee
      projectFeeMin
      projectFeeMax
      currency
      isAvailable
      education
      certifications
      awards
      featuredProjects {
        id
        title_en
        title_mk
        title_sq
        description_en
        description_mk
        description_sq
        projectType
        year
        location
        area
        budget
        currency
        images
        videos
        isPublished
        isFeatured
        createdAt
      }
      isVerified
      isActive
      isPremium
      averageRating
      totalReviews
      yearsExperience
      companyName
      position
      licenseNumber
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ARCHITECT = gql`
  mutation CreateArchitect($input: CreateArchitectInput!) {
    createArchitect(input: $input) {
      id
      firstName
      lastName
      email
      isActive
      createdAt
    }
  }
`;
