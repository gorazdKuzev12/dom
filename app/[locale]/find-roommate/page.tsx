import { getClient } from "@/lib/client";
import { GET_ROOMMATES, GET_ALL_CITIES } from "@/lib/queries";
import FindRoommateClient from "@/components/FindRoommateClient";
import { Metadata } from "next";

interface PageParams {
  locale: string;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = params;
  
  const titles = {
    en: "Find Your Perfect Roommate | DOM Real Estate",
    mk: "Најди го твојот совршен цимер | DOM Real Estate", 
    sq: "Gjej Bashkëbanuesin Tënd të Përkryer | DOM Real Estate"
  };
  
  const descriptions = {
    en: "Connect with compatible roommates in North Macedonia. Filter by location, budget, lifestyle preferences, and more. Find shared apartments, rooms, and housing with trusted roommates on DOM.",
    mk: "Поврзете се со компатибилни цимери во Северна Македонија. Филтрирајте по локација, буџет, животни преференци и повеќе. Најдете заеднички станови, соби и живеалишта со доверливи цимери на DOM.",
    sq: "Lidhu me bashkëbanues të përputhshëm në Maqedoninë e Veriut. Filtro sipas vendndodhjes, buxhetit, preferencave të jetesës dhe më shumë. Gjej apartamente të përbashkëta, dhoma dhe strehim me bashkëbanues të besueshëm në DOM."
  };

  const keywords = {
    en: "find roommate, shared housing, room sharing, apartment sharing, roommate finder, compatible roommates, student housing, professional roommates, North Macedonia roommates",
    mk: "најди цимер, заедничко живеалиште, споделување соба, споделување стан, барање цимер, компатибилни цимери, студентско живеалиште, професионални цимери, цимери Северна Македонија",
    sq: "gjej bashkëbanues, strehim i përbashkët, ndarje dhome, ndarje apartamenti, gjetës bashkëbanuesi, bashkëbanues të përputhshëm, strehim studenti, bashkëbanues profesionalë, bashkëbanues Maqedonia e Veriut"
  };

  const title = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  const keyword = keywords[locale as keyof typeof keywords] || keywords.en;
  
  return {
    title,
    description,
    keywords: keyword,
    authors: [{ name: "DOM Real Estate" }],
    creator: "DOM Real Estate",
    publisher: "DOM Real Estate",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://dom.mk/${locale}/find-roommate`,
      siteName: "DOM Real Estate",
      locale: locale === 'mk' ? 'mk_MK' : locale === 'sq' ? 'sq_AL' : 'en_US',
      type: "website",
      images: [
        {
          url: "/roommate-og-image.jpg", // You can add this image later
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@DOMRealEstate",
      images: ["/roommate-og-image.jpg"],
    },
    alternates: {
      canonical: `https://dom.mk/${locale}/find-roommate`,
      languages: {
        'en': 'https://dom.mk/en/find-roommate',
        'mk': 'https://dom.mk/mk/find-roommate',
        'sq': 'https://dom.mk/sq/find-roommate',
      },
    },
    other: {
      'theme-color': '#667eea',
      'color-scheme': 'light',
    },
    // JSON-LD structured data for better SEO
    verification: {
      google: 'your-google-verification-code', // Add your Google verification code
      yandex: 'your-yandex-verification-code', // Add your Yandex verification code if needed
    },
  };
}

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
  params,
  searchParams 
}: { 
  params: PageParams;
  searchParams: SearchParams 
}) {
  const client = getClient();
  const { locale } = params;
  
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

    // JSON-LD structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": locale === 'mk' ? "DOM - Најди Цимер" : locale === 'sq' ? "DOM - Gjej Bashkëbanues" : "DOM - Find Roommate",
      "description": locale === 'mk' 
        ? "Најдете го вашиот совршен цимер во Северна Македонија. Филтрирајте по локација, буџет и животни преференци."
        : locale === 'sq'
        ? "Gjeni bashkëbanuesin tuaj të përkryer në Maqedoninë e Veriut. Filtroni sipas vendndodhjes, buxhetit dhe preferencave të jetesës."
        : "Find your perfect roommate in North Macedonia. Filter by location, budget, and lifestyle preferences.",
      "url": `https://dom.mk/${locale}/find-roommate`,
      "applicationCategory": "RealEstateApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      },
      "provider": {
        "@type": "Organization",
        "name": "DOM Real Estate",
        "url": "https://dom.mk"
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "Students, Professionals, People looking for shared housing"
      },
      "featureList": [
        "Location-based search",
        "Budget filtering", 
        "Lifestyle compatibility matching",
        "Verified profiles",
        "Multi-language support"
      ]
    };

    // Pass data to client component
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <FindRoommateClient 
          roommates={roommates}
          cities={cities}
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching roommates:', error);
    
    // JSON-LD structured data for better SEO (even on error)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": locale === 'mk' ? "DOM - Најди Цимер" : locale === 'sq' ? "DOM - Gjej Bashkëbanues" : "DOM - Find Roommate",
      "description": locale === 'mk' 
        ? "Најдете го вашиот совршен цимер во Северна Македонија. Филтрирајте по локација, буџет и животни преференци."
        : locale === 'sq'
        ? "Gjeni bashkëbanuesin tuaj të përkryer në Maqedoninë e Veriut. Filtroni sipas vendndodhjes, buxhetit dhe preferencave të jetesës."
        : "Find your perfect roommate in North Macedonia. Filter by location, budget, and lifestyle preferences.",
      "url": `https://dom.mk/${locale}/find-roommate`,
      "applicationCategory": "RealEstateApplication",
      "operatingSystem": "Web",
      "provider": {
        "@type": "Organization",
        "name": "DOM Real Estate",
        "url": "https://dom.mk"
      }
    };
    
    // Pass error to client component
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <FindRoommateClient 
          roommates={[]}
          cities={[]}
          error="Please try again later."
        />
      </>
    );
  }
}
