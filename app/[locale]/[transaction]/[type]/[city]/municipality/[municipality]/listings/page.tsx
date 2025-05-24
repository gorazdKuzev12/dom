import ZoneListingsPage from "@/components/ZoneListingPage";
import { getClient } from "@/lib/client";
import { LISTINGS_BY_MUNICIPALITY_FILTER } from "@/lib/queries";
import { notFound } from "next/navigation";

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

  const municipalityName = municipality || "Centar";

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
    const { data } = await client.query({
      query: LISTINGS_BY_MUNICIPALITY_FILTER,
      variables: { name: municipalityName, filter },
    });

    return (
      <ZoneListingsPage
        listings={data?.listingsByMunicipalityFilter ?? []}
        municipalityName={municipalityName}
        citySlug={city}
      />
    );
  } catch (error) {
    console.error("Error fetching listings:", error);
    return (
      <div>
        <h1>Error loading listings</h1>
        <p>Municipality "{municipalityName}" in "{city}" may not exist or there might be an issue with the connection.</p>
      </div>
    );
  }
} 