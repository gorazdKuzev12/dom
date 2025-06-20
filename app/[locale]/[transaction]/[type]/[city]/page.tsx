import { getClient } from "@/lib/client";
import NeighborhoodsClient from "@/components/MapComponent";
import Footer from "@/components/Footer/page";
import { notFound } from "next/navigation";
import { GET_MUNICIPALITIES_BY_CITY_NAME } from "@/lib/queries";

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

    return (
      <div>
        <NeighborhoodsClient 
          cityName={city} 
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