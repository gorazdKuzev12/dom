import ZoneListingsPage from "@/components/ZoneListingPage";
import { getClient } from "@/lib/client";
import { LISTINGS_BY_MUNICIPALITY_FILTER, GET_ALL_CITIES, GET_MUNICIPALITIES_BY_CITY_NAME } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// helpers/enums.ts
export const toEnum = (val?: string) =>
  typeof val === "string" ? val.toUpperCase() : undefined;

// Convert specificDetails to Amenity enum format
const toAmenityEnum = (detail: string): string => {
  // Map frontend values to backend enum values
  const amenityMap: Record<string, string> = {
    balcony: "BALCONY",
    heating: "HEATING",
    "air-conditioning": "AIR_CONDITIONING",
    ac: "AIR_CONDITIONING", // Alternative mapping for AC
    furnished: "FURNISHED",
    elevator: "ELEVATOR",
    parking: "PARKING",
    garden: "GARDEN",
    "swimming-pool": "SWIMMING_POOL",
    pool: "SWIMMING_POOL", // Alternative mapping
    internet: "INTERNET",
    wifi: "INTERNET", // Alternative mapping
    laundry: "LAUNDRY",
    dishwasher: "DISHWASHER",
    security: "SECURITY",
    storage: "STORAGE",
    "pet-friendly": "PET_FRIENDLY",
    "pet_friendly": "PET_FRIENDLY", // Alternative mapping
    pets: "PET_FRIENDLY", // Alternative mapping
    terrace: "TERRACE",
    fireplace: "FIREPLACE",
    "cable-tv": "CABLE_TV",
    "cable_tv": "CABLE_TV", // Alternative mapping
    tv: "CABLE_TV", // Alternative mapping
    "washing-machine": "WASHING_MACHINE",
    "washing_machine": "WASHING_MACHINE", // Alternative mapping
    washer: "WASHING_MACHINE", // Alternative mapping
  };
  
  return amenityMap[detail.toLowerCase()] || detail.toUpperCase();
};

// Helper function to get localized name from multilingual object
const getLocalizedName = (nameObj: { name_en: string; name_mk: string; name_sq: string }, locale: string): string => {
  switch (locale) {
    case 'mk':
      return nameObj.name_mk;
    case 'sq':
      return nameObj.name_sq;
    default:
      return nameObj.name_en;
  }
};

interface PageParams {
  locale: string;
  transaction: string;
  type: string;
  city: string;
  municipality: string;
}

interface SearchParams {
  priceMin?: string;
  priceMax?: string;
  bedrooms?: string;
  bathrooms?: string;
  specificDetails?: string;
  condition?: string;
  listingDate?: string;
  sort?: string;
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



// Multilingual translations
const translations = {
  en: {
    transactions: {
      buy: "Buy",
      rent: "Rent",
      sale: "Buy"
    },
    propertyTypes: {
      apartments: "Apartments",
      apartment: "Apartments",
      house: "Houses",
      homes: "Houses",
      rooms: "Rooms",
      room: "Rooms",
      villas: "Villas",
      villa: "Villas",
      studios: "Studios",
      studio: "Studios",
      land: "Land",
      offices: "Offices",
      office: "Offices",
      garages: "Garages",
      garage: "Garages",
      "storage-rooms": "Storage Rooms",
      "storage-room": "Storage Rooms",
      "commercial-properties": "Commercial Properties",
      "commercial-property": "Commercial Properties",
      commercial: "Commercial Properties",
      buildings: "Buildings",
      building: "Buildings"
    },
    seoTexts: {
      titleTemplate: "{propertyType} for {transaction} in {municipality}, {city} | DOM Real Estate",
      descriptionTemplate: "Find the best {propertyType} for {transaction} in {municipality}, {city}{priceRange}{bedrooms}. Browse verified listings with photos, prices, and detailed information on DOM Real Estate.",
      from: "from",
      to: "to",
      startingFrom: "starting from",
      upTo: "up to",
      with: "with",
      bedroom: "bedroom",
      bedrooms: "bedrooms",
      or: "or"
    }
  },
  mk: {
    transactions: {
      buy: "Купување",
      rent: "Изнајмување",
      sale: "Купување"
    },
    propertyTypes: {
      apartments: "Станови",
      apartment: "Станови",
      house: "Куќи",
      homes: "Куќи",
      rooms: "Соби",
      room: "Соби",
      villas: "Вили",
      villa: "Вили",
      studios: "Студија",
      studio: "Студија",
      land: "Земјиште",
      offices: "Канцеларии",
      office: "Канцеларии",
      garages: "Гаражи",
      garage: "Гаражи",
      "storage-rooms": "Магацински простор",
      "storage-room": "Магацински простор",
      "commercial-properties": "Комерцијални имоти",
      "commercial-property": "Комерцијални имоти",
      commercial: "Комерцијални имоти",
      buildings: "Згради",
      building: "Згради"
    },
    seoTexts: {
      titleTemplate: "{propertyType} за {transaction} во {municipality}, {city} | DOM Недвижности",
      descriptionTemplate: "Најдете ги најдобрите {propertyType} за {transaction} во {municipality}, {city}{priceRange}{bedrooms}. Прегледајте верификувани огласи со слики, цени и детални информации на DOM Недвижности.",
      from: "од",
      to: "до",
      startingFrom: "почнувајќи од",
      upTo: "до",
      with: "со",
      bedroom: "спална соба",
      bedrooms: "спални соби",
      or: "или"
    }
  },
  sq: {
    transactions: {
      buy: "Blerje",
      rent: "Me qira",
      sale: "Blerje"
    },
    propertyTypes: {
      apartments: "Apartamente",
      apartment: "Apartamente",
      house: "Shtëpi",
      homes: "Shtëpi",
      rooms: "Dhoma",
      room: "Dhoma",
      villas: "Vila",
      villa: "Vila",
      studios: "Studio",
      studio: "Studio",
      land: "Tokë",
      offices: "Zyra",
      office: "Zyra",
      garages: "Garazhe",
      garage: "Garazhe",
      "storage-rooms": "Dhoma magazinimi",
      "storage-room": "Dhoma magazinimi",
      "commercial-properties": "Prona komerciale",
      "commercial-property": "Prona komerciale",
      commercial: "Prona komerciale",
      buildings: "Ndërtesa",
      building: "Ndërtesa"
    },
    seoTexts: {
      titleTemplate: "{propertyType} për {transaction} në {municipality}, {city} | DOM Pasuri të Paluajtshme",
      descriptionTemplate: "Gjeni {propertyType} më të mira për {transaction} në {municipality}, {city}{priceRange}{bedrooms}. Shfletoni lajmet e verifikuara me foto, çmime dhe informacione të detajuara në DOM Pasuri të Paluajtshme.",
      from: "nga",
      to: "deri",
      startingFrom: "duke filluar nga",
      upTo: "deri në",
      with: "me",
      bedroom: "dhomë gjumi",
      bedrooms: "dhoma gjumi",
      or: "ose"
    }
  }
};

// Helper function to get readable transaction type
const getReadableTransaction = (transaction: string, locale: string = 'en'): string => {
  const lang = translations[locale as keyof typeof translations] || translations.en;
  return lang.transactions[transaction.toLowerCase() as keyof typeof lang.transactions] || transaction;
};

// Helper function to get readable property type
const getReadablePropertyType = (type: string, locale: string = 'en'): string => {
  const lang = translations[locale as keyof typeof translations] || translations.en;
  return lang.propertyTypes[type.toLowerCase() as keyof typeof lang.propertyTypes] || type;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { municipality, city, transaction, type, locale } = params;
  
  const client = getClient();
  
  // Fetch a sample listing to get city and municipality data
  let cityData, municipalityData;
  
  try {
    // Build a minimal filter to get listings
    const filter = {
      transaction: transactionTypeMap[transaction.toLowerCase()],
      type: propertyTypeMap[type.toLowerCase()],
    };

    const result = await client.query({
      query: LISTINGS_BY_MUNICIPALITY_FILTER,
      variables: { name: municipality, filter },
    });
    
    const listings = result.data?.listingsByMunicipalityFilter || [];
    if (listings.length > 0) {
      cityData = listings[0].city;
      municipalityData = listings[0].municipality;
    }
  } catch (error) {
    console.error('Error fetching city/municipality data:', error);
  }
  
  // Get localized names from database or fallback to slug
  const cityName = cityData ? getLocalizedName(cityData, locale) : city;
  const municipalityName = municipalityData ? getLocalizedName(municipalityData, locale) : municipality;
  
  const readableTransaction = getReadableTransaction(transaction, locale);
  const readablePropertyType = getReadablePropertyType(type, locale);
  
  // Get translations for current locale
  const lang = translations[locale as keyof typeof translations] || translations.en;
  const seoTexts = lang.seoTexts;
  
  // Build price range for meta description
  let priceRange = "";
  if (searchParams.priceMin || searchParams.priceMax) {
    if (searchParams.priceMin && searchParams.priceMax) {
      priceRange = ` ${seoTexts.from} €${searchParams.priceMin} ${seoTexts.to} €${searchParams.priceMax}`;
    } else if (searchParams.priceMin) {
      priceRange = ` ${seoTexts.startingFrom} €${searchParams.priceMin}`;
    } else if (searchParams.priceMax) {
      priceRange = ` ${seoTexts.upTo} €${searchParams.priceMax}`;
    }
  }
  
  // Build bedrooms filter for description
  let bedroomsText = "";
  if (searchParams.bedrooms) {
    const bedrooms = searchParams.bedrooms.split(",");
    if (bedrooms.length === 1) {
      const bedroomWord = bedrooms[0] === "1" ? seoTexts.bedroom : seoTexts.bedrooms;
      bedroomsText = ` ${seoTexts.with} ${bedrooms[0]} ${bedroomWord}`;
    } else {
      bedroomsText = ` ${seoTexts.with} ${bedrooms.slice(0, -1).join(", ")} ${seoTexts.or} ${bedrooms.slice(-1)} ${seoTexts.bedrooms}`;
    }
  }

  const title = seoTexts.titleTemplate
    .replace('{propertyType}', readablePropertyType)
    .replace('{transaction}', readableTransaction)
    .replace('{municipality}', municipalityName)
    .replace('{city}', cityName);
    
  const description = seoTexts.descriptionTemplate
    .replace('{propertyType}', readablePropertyType.toLowerCase())
    .replace('{transaction}', transaction)
    .replace('{municipality}', municipalityName)
    .replace('{city}', cityName)
    .replace('{priceRange}', priceRange)
    .replace('{bedrooms}', bedroomsText);
  
  const url = `https://dom.com.mk/${locale}/${transaction}/${type}/${city}/${municipality}/listings`;
  
  // Generate keywords
  const keywords = [
    `${readablePropertyType.toLowerCase()} ${municipalityName}`,
    `${transaction} ${readablePropertyType.toLowerCase()} ${cityName}`,
    `real estate ${municipalityName}`,
    `property ${transaction} ${cityName}`,
    `${municipalityName} real estate`,
    `DOM real estate`,
    `Macedonia real estate`,
    `North Macedonia property`,
    `${cityName} property listings`,
    `${municipalityName} property market`
  ];

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "DOM Real Estate" }],
    creator: "DOM Real Estate",
    publisher: "DOM Real Estate",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "mk" ? "mk_MK" : locale === "sq" ? "sq_AL" : "en_US",
      url,
      title,
      description,
      siteName: "DOM Real Estate",
              images: [
          {
            url: `/maps/${city}-standart.png`,
            width: 1200,
            height: 630,
            alt: `${municipalityName}, ${cityName} Map - Real Estate Listings`,
            type: "image/png",
          },
        ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/maps/${city}-standart.png`],
      creator: "@DOMRealEstate",
    },
    alternates: {
      canonical: url,
      languages: {
        "en": `https://dom.com.mk/en/${transaction}/${type}/${city}/${municipality}/listings`,
        "mk": `https://dom.com.mk/mk/${transaction}/${type}/${city}/${municipality}/listings`,
        "sq": `https://dom.com.mk/sq/${transaction}/${type}/${city}/${municipality}/listings`,
      },
    },
    other: {
      "geo.region": "MK",
      "geo.placename": `${municipalityName}, ${cityName}`,
      "ICBM": getCityCoordinates(city),
    },
  };
}

// Helper function to get city coordinates for geo meta tags
function getCityCoordinates(city: string): string {
  const coordinates: Record<string, string> = {
    skopje: "41.9973, 21.4280",
    bitola: "41.0297, 21.3347",
    kumanovo: "42.1322, 21.7144",
    prilep: "41.3442, 21.5542",
    tetovo: "42.0105, 20.9717",
    veles: "41.7158, 21.7755",
    stip: "41.7414, 22.1958",
  };
  return coordinates[city.toLowerCase()] || "41.9973, 21.4280";
}

// Generate structured data for real estate listings
function generateStructuredData(
  listings: any[],
  municipalityName: string,
  cityName: string,
  transaction: string,
  propertyType: string,
  locale: string = 'en'
) {
  const readablePropertyType = getReadablePropertyType(propertyType, locale);
  const readableTransaction = getReadableTransaction(transaction, locale);
  const lang = translations[locale as keyof typeof translations] || translations.en;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://dom.com.mk/${locale}/${transaction}/${propertyType}/${cityName}/${municipalityName}/listings`,
        "url": `https://dom.com.mk/${locale}/${transaction}/${propertyType}/${cityName}/${municipalityName}/listings`,
        "name": `${readablePropertyType} for ${readableTransaction} in ${municipalityName}, ${cityName}`,
        "description": `Browse ${readablePropertyType.toLowerCase()} for ${transaction} in ${municipalityName}, ${cityName}. Find your perfect property with DOM Real Estate.`,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": locale === 'mk' ? "Дома" : locale === 'sq' ? "Shtëpia" : "Home",
              "item": `https://dom.com.mk/${locale}`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": cityName,
              "item": `https://dom.com.mk/${locale}/${transaction}/${propertyType}/${cityName}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": municipalityName,
              "item": `https://dom.com.mk/${locale}/${transaction}/${propertyType}/${cityName}/${municipalityName}/listings`
            }
          ]
        }
      },
      {
        "@type": "RealEstateAgent",
        "name": locale === 'mk' ? "DOM Недвижности" : locale === 'sq' ? "DOM Pasuri të Paluajtshme" : "DOM Real Estate",
        "url": "https://dom.com.mk",
        "logo": "https://dom.com.mk/dom.jpg",
        "areaServed": locale === 'mk' ? "Северна Македонија" : locale === 'sq' ? "Maqedonia e Veriut" : "North Macedonia",
        "serviceArea": {
          "@type": "Country",
          "name": locale === 'mk' ? "Северна Македонија" : locale === 'sq' ? "Maqedonia e Veriut" : "North Macedonia"
        }
      },
      {
        "@type": "ItemList",
        "name": `${readablePropertyType} in ${municipalityName}`,
        "description": `List of ${readablePropertyType.toLowerCase()} for ${transaction} in ${municipalityName}, ${cityName}`,
        "numberOfItems": listings.length,
        "itemListElement": listings.slice(0, 10).map((listing, index) => ({
          "@type": "RealEstateListing",
          "position": index + 1,
          "name": listing.title || `${propertyType} in ${municipalityName}`,
          "description": listing.description || `${propertyType} for ${transaction} in ${municipalityName}`,
          "url": `https://dom.com.mk/listing/${listing.id}`,
          "price": listing.price,
          "priceCurrency": "EUR",
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": listing.area,
            "unitCode": "MTK"
          },
          "numberOfRooms": listing.rooms,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": municipalityName,
            "addressRegion": cityName,
            "addressCountry": "MK"
          }
        }))
      }
    ]
  };

  return JSON.stringify(structuredData);
}

export default async function MunicipalityListingsPage({ 
  params, 
  searchParams 
}: { 
  params: PageParams; 
  searchParams: SearchParams;
}) {
  const { municipality, city, transaction, type } = params;
  
  // Convert URL parameters to GraphQL enum values
  const transactionEnum = transactionTypeMap[transaction.toLowerCase()];
  const propertyTypeEnum = propertyTypeMap[type.toLowerCase()];
  
  // Validate parameters
  if (!transactionEnum || !propertyTypeEnum) {
    console.warn(`Invalid parameters: transaction=${transaction}, type=${type}`);
    return notFound();
  }

  // We'll use the English municipality name for the GraphQL query (assuming your resolver expects English names)
  // The localized display name will be handled from the database response
  const municipalityName = municipality;

  // map URL → GraphQL filter
  const filter = {
    transaction: transactionEnum,
    type: propertyTypeEnum,
    condition: toEnum(searchParams.condition),
    // primitives
    priceMin: searchParams.priceMin && +searchParams.priceMin,
    priceMax: searchParams.priceMax && +searchParams.priceMax,
    rooms: searchParams.bedrooms
      ? String(searchParams.bedrooms).split(",").map(Number)
      : undefined,
    bathrooms: searchParams.bathrooms && +searchParams.bathrooms,
    amenities: searchParams.specificDetails
      ? String(searchParams.specificDetails).split(",").map(toAmenityEnum)
      : undefined,
    listingDate: searchParams.listingDate,
    sort: searchParams.sort,
  };

  try {
    const client = getClient();
    
    // Fetch listings, cities, and municipalities in parallel
    const [listingsResult, citiesResult, municipalitiesResult] = await Promise.all([
      client.query({
        query: LISTINGS_BY_MUNICIPALITY_FILTER,
        variables: { name: municipalityName, filter },
      }),
      client.query({
        query: GET_ALL_CITIES,
      }),
      client.query({
        query: GET_MUNICIPALITIES_BY_CITY_NAME,
        variables: { name: city },
      }),
    ]);

    const listings = listingsResult.data?.listingsByMunicipalityFilter ?? [];
    const cities = citiesResult.data?.city ?? [];
    const municipalities = municipalitiesResult.data?.municipalitiesByCityName ?? [];
    
    // Get localized municipality name for display
    let displayMunicipalityName = municipalityName;
    if (listings.length > 0 && listings[0].municipality) {
      displayMunicipalityName = getLocalizedName(listings[0].municipality, params.locale);
    }
    
    const structuredData = generateStructuredData(
      listings,
      displayMunicipalityName,
      city,
      transaction,
      type,
      params.locale
    );

    return (
      <>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        
        {/* Main Content with SEO-friendly structure */}
                <main>
          <ZoneListingsPage
            listings={listings}
            municipalityName={displayMunicipalityName}
            municipalitySlug={municipality}
            citySlug={city}
            cities={cities}
            municipalities={municipalities}
          />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error fetching listings:", error);
    return (
      <main>
        <h1>Error loading listings</h1>
        <p>Municipality "{municipalityName}" in "{city}" may not exist or there might be an issue with the connection.</p>
      </main>
    );
  }
} 