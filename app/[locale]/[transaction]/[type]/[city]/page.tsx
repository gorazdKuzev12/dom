import { getClient } from "@/lib/client";
import NeighborhoodsClient from "@/components/MapComponent";
import Footer from "@/components/Footer/page";
import { notFound } from "next/navigation";
import { GET_MUNICIPALITIES_BY_CITY_NAME } from "@/lib/queries";
import { Metadata } from "next";

interface PageParams {
  locale: string;
  transaction: string;
  type: string;
  city: string;
}

interface TransactionTypeMap {
  [key: string]: string;
}

interface PropertyTypeMap {
  [key: string]: string;
}

// Mapping URL parameters to GraphQL enums
const transactionTypeMap: TransactionTypeMap = {
  buy: "SALE",
  rent: "RENT"
};

const propertyTypeMap: PropertyTypeMap = {
  apartments: "APARTMENT",
  apartment: "APARTMENT",
  house: "HOUSE",
  homes: "HOUSE",
  rooms: "ROOM",
  room: "ROOM",
  villas: "VILLA",
  villa: "VILLA",
  studios: "STUDIO",
  studio: "STUDIO",
  land: "LAND",
  offices: "OFFICE",
  office: "OFFICE",
  garages: "GARAGE",
  garage: "GARAGE",
  "storage-rooms": "STORAGE_ROOM",
  "storage-room": "STORAGE_ROOM",
  "commercial-properties": "COMMERCIAL",
  "commercial-property": "COMMERCIAL",
  commercial: "COMMERCIAL",
  buildings: "BUILDING",
  building: "BUILDING"
};

// Helper function to create URL-safe slugs
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics/accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing whitespace
};

// Helper function to format transaction type for display
const formatTransactionType = (transaction: string, locale: string): string => {
  const transactionMap: Record<string, Record<string, string>> = {
    buy: {
      en: "for Sale",
      mk: "за Продажба",
      sq: "për Shitje"
    },
    rent: {
      en: "for Rent",
      mk: "за Изнајмување", 
      sq: "për Qira"
    }
  };
  return transactionMap[transaction]?.[locale] || transactionMap[transaction]?.en || "for Sale";
};

// Helper function to format property type for display
const formatPropertyType = (type: string, locale: string): string => {
  const propertyMap: Record<string, Record<string, string>> = {
    apartments: { en: "Apartments", mk: "Станови", sq: "Apartamente" },
    apartment: { en: "Apartments", mk: "Станови", sq: "Apartamente" },
    house: { en: "Houses", mk: "Куќи", sq: "Shtëpi" },
    homes: { en: "Houses", mk: "Куќи", sq: "Shtëpi" },
    rooms: { en: "Rooms", mk: "Соби", sq: "Dhoma" },
    room: { en: "Rooms", mk: "Соби", sq: "Dhoma" },
    villas: { en: "Villas", mk: "Вили", sq: "Vila" },
    villa: { en: "Villas", mk: "Вили", sq: "Vila" },
    studios: { en: "Studios", mk: "Студија", sq: "Studio" },
    studio: { en: "Studios", mk: "Студија", sq: "Studio" },
    land: { en: "Land", mk: "Земјиште", sq: "Tokë" },
    offices: { en: "Offices", mk: "Канцеларии", sq: "Zyra" },
    office: { en: "Offices", mk: "Канцеларии", sq: "Zyra" },
    garages: { en: "Garages", mk: "Гаражи", sq: "Garazhe" },
    garage: { en: "Garages", mk: "Гаражи", sq: "Garazhe" },
    "storage-rooms": { en: "Storage Rooms", mk: "Остави", sq: "Depot" },
    "storage-room": { en: "Storage Rooms", mk: "Остави", sq: "Depot" },
    "commercial-properties": { en: "Commercial Properties", mk: "Комерцијални Простории", sq: "Prona Komerciale" },
    "commercial-property": { en: "Commercial Properties", mk: "Комерцијални Простории", sq: "Prona Komerciale" },
    commercial: { en: "Commercial Properties", mk: "Комерцијални Простории", sq: "Prona Komerciale" },
    buildings: { en: "Buildings", mk: "Згради", sq: "Ndërtesa" },
    building: { en: "Buildings", mk: "Згради", sq: "Ndërtesa" }
  };
  return propertyMap[type]?.[locale] || propertyMap[type]?.en || "Properties";
};

// Helper function to get localized city name
const getLocalizedCityName = (city: string, locale: string): string => {
  const cityMap: Record<string, Record<string, string>> = {
    skopje: { en: "Skopje", mk: "Скопје", sq: "Shkup" },
    bitola: { en: "Bitola", mk: "Битола", sq: "Manastir" },
    kumanovo: { en: "Kumanovo", mk: "Куманово", sq: "Kumanovë" },
    tetovo: { en: "Tetovo", mk: "Тетово", sq: "Tetovë" },
    veles: { en: "Veles", mk: "Велес", sq: "Velesi" },
    prilep: { en: "Prilep", mk: "Прилеп", sq: "Prilep" },
    stip: { en: "Štip", mk: "Штип", sq: "Shtip" }
  };
  
  const cityKey = city.toLowerCase();
  return cityMap[cityKey]?.[locale] || cityMap[cityKey]?.en || city.charAt(0).toUpperCase() + city.slice(1);
};

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { city, transaction, type, locale } = params;
  
  // Get localized city name
  const cityName = getLocalizedCityName(city, locale);
  const transactionText = formatTransactionType(transaction, locale);
  const propertyText = formatPropertyType(type, locale);
  
  // Create SEO-friendly title and description
  const inPreposition = locale === 'mk' ? 'во' : locale === 'sq' ? 'në' : 'in';
  const title = `${propertyText} ${transactionText} ${inPreposition} ${cityName} | DOM Real Estate`;
  const description = `Find the best ${propertyText.toLowerCase()} ${transactionText.toLowerCase()} ${inPreposition} ${cityName}. Browse neighborhoods, compare prices, and discover your perfect property with DOM Real Estate.`;
  
  // Create canonical URL
  const canonicalUrl = `https://dom.mk/${locale}/${transaction}/${type}/${city}`;
  
  return {
    title,
    description,
    keywords: `${cityName}, ${propertyText}, ${transactionText}, real estate, property, Macedonia, ${cityName} real estate, ${cityName} properties`,
    authors: [{ name: "DOM Real Estate" }],
    creator: "DOM Real Estate",
    publisher: "DOM Real Estate",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "DOM Real Estate",
      locale: locale === 'mk' ? 'mk_MK' : locale === 'sq' ? 'sq_AL' : 'en_US',
      type: "website",
      images: [
        {
          url: `/maps/${city.toLowerCase()}-standart.png`,
          width: 1200,
          height: 630,
          alt: `${cityName} neighborhood map`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/maps/${city.toLowerCase()}-standart.png`],
      creator: "@DOMRealEstate",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `https://dom.mk/en/${transaction}/${type}/${city}`,
        'mk': `https://dom.mk/mk/${transaction}/${type}/${city}`,
        'sq': `https://dom.mk/sq/${transaction}/${type}/${city}`,
      },
    },
    other: {
      'geo.region': 'MK',
      'geo.placename': cityName,
      ...(cityName === 'Skopje' && { 'geo.position': '41.9973;21.4280' }),
    },
  };
}

export default async function PropertyListingPage({ params }: { params: PageParams }) {
  const { city, transaction, type } = params;

  // Convert URL parameters to GraphQL enum values
  const transactionEnum = transactionTypeMap[transaction.toLowerCase()];
  const propertyTypeEnum = propertyTypeMap[type.toLowerCase()];
  
  // Validate parameters
  if (!transactionEnum || !propertyTypeEnum) {
    console.warn(`Invalid parameters: transaction=${transaction}, type=${type}`);
    return notFound();
  }

  try {
    // Fetch municipalities data using Apollo Client with filters
    const { data } = await getClient().query({
      query: GET_MUNICIPALITIES_BY_CITY_NAME,
      variables: {
        name: city,
        transaction: transactionEnum,
        propertyType: propertyTypeEnum,
      },
    });

    // If no municipalities found, show 404
    if (!data?.municipalitiesByCityName || data.municipalitiesByCityName.length === 0) {
      console.warn(`No municipalities found for city: ${city}`);
      return notFound();
    }

    // Prepare municipalities data for the client component
    const municipalities = data.municipalitiesByCityName.map(
      (municipality: any) => {
        const name =
          params.locale === "mk"
            ? municipality.name_mk
            : params.locale === "sq"
            ? municipality.name_sq
            : municipality.name_en;

        return {
          id: municipality.id,
          name,
          slug: createSlug(municipality.name_en),
          propertyCount: municipality.propertyCount || 0, // Use the property count from GraphQL
          avgPrice: municipality.averagePrice
            ? `€${municipality.averagePrice}/m²`
            : "Price data unavailable",
          image: municipality.image || "/api/placeholder/400/160",
          isPopular: municipality.isPopular,
        };
      }
    );

    // Get localized city name for display
    const localizedCityName = getLocalizedCityName(city, params.locale);

          return (
        <div>
          <NeighborhoodsClient 
            cityName={localizedCityName}
            citySlug={city}
            neighborhoods={municipalities}
          />
          <Footer />
        </div>
      );
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    return (
      <div>
        <h1>Error loading neighborhoods</h1>
        <p>City "{city}" may not exist or there might be an issue with the connection.</p>
        <Footer />
      </div>
    );
  }
} 