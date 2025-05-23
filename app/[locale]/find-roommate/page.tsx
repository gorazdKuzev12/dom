import { getClient } from "@/lib/client";
import { GET_ROOMMATES, GET_ALL_CITIES } from "@/lib/queries";
import FindRoommateClient from "@/components/FindRoommateClient";

interface SearchParams {
  cityId?: string;
  municipalityId?: string;
  gender?: string;
  budgetMin?: string;
  budgetMax?: string;
  currency?: string;
  housingType?: string;
  preferredRoomType?: string;
  moveInDate?: string;
  smokingPolicy?: string;
  petPolicy?: string;
  guestPolicy?: string;
  cleanlinessLevel?: string;
  noiseLevel?: string;
  isStudent?: string;
  isProfessional?: string;
  workFromHome?: string;
  ageMin?: string;
  ageMax?: string;
  isLocationFlexible?: string;
  interests?: string;
  languages?: string;
  isVerified?: string;
  isOnline?: string;
}

// Helper function to convert search params to filter object
function buildFilter(searchParams: SearchParams) {
  const filter: any = {};

  if (searchParams.cityId) filter.cityId = searchParams.cityId;
  if (searchParams.municipalityId) filter.municipalityId = searchParams.municipalityId;
  if (searchParams.gender) filter.gender = searchParams.gender;
  if (searchParams.budgetMin) filter.budgetMin = parseFloat(searchParams.budgetMin);
  if (searchParams.budgetMax) filter.budgetMax = parseFloat(searchParams.budgetMax);
  if (searchParams.currency) filter.currency = searchParams.currency;
  if (searchParams.housingType) filter.housingType = searchParams.housingType;
  if (searchParams.preferredRoomType) filter.preferredRoomType = searchParams.preferredRoomType;
  if (searchParams.moveInDate) filter.moveInDate = searchParams.moveInDate;
  if (searchParams.smokingPolicy) filter.smokingPolicy = searchParams.smokingPolicy;
  if (searchParams.petPolicy) filter.petPolicy = searchParams.petPolicy;
  if (searchParams.guestPolicy) filter.guestPolicy = searchParams.guestPolicy;
  if (searchParams.cleanlinessLevel) filter.cleanlinessLevel = searchParams.cleanlinessLevel;
  if (searchParams.noiseLevel) filter.noiseLevel = searchParams.noiseLevel;
  if (searchParams.isStudent) filter.isStudent = searchParams.isStudent === 'true';
  if (searchParams.isProfessional) filter.isProfessional = searchParams.isProfessional === 'true';
  if (searchParams.workFromHome) filter.workFromHome = searchParams.workFromHome === 'true';
  if (searchParams.ageMin) filter.ageMin = parseInt(searchParams.ageMin);
  if (searchParams.ageMax) filter.ageMax = parseInt(searchParams.ageMax);
  if (searchParams.isLocationFlexible) filter.isLocationFlexible = searchParams.isLocationFlexible === 'true';
  if (searchParams.interests) filter.interests = searchParams.interests.split(',');
  if (searchParams.languages) filter.languages = searchParams.languages.split(',');
  if (searchParams.isVerified) filter.isVerified = searchParams.isVerified === 'true';
  if (searchParams.isOnline) filter.isOnline = searchParams.isOnline === 'true';

  return filter;
}

export default async function FindRoommatePage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  const client = getClient();
  
  // Build filter from search params
  const filter = buildFilter(searchParams);
  
  try {
    // Fetch roommates and cities
    const [roommatesData, citiesData] = await Promise.all([
      client.query({
        query: GET_ROOMMATES,
        variables: { filter },
      }),
      client.query({
        query: GET_ALL_CITIES,
      }),
    ]);

    const roommates = roommatesData.data?.roommates || [];
    const cities = citiesData.data?.city || [];

    // Pass data to client component
    return (
      <FindRoommateClient 
        roommates={roommates}
        cities={cities}
      />
    );
  } catch (error) {
    console.error('Error fetching roommates:', error);
    
    // Pass error to client component
    return (
      <FindRoommateClient 
        roommates={[]}
        cities={[]}
        error="Please try again later."
      />
    );
  }
}
