import ZoneListingsPage from "@/components/ZoneListingPage";
import { getClient } from "@/lib/client";
import { LISTINGS_BY_MUNICIPALITY_FILTER } from "@/lib/queries";
import { parse } from "querystring";
// helpers/enums.ts
export const toEnum = (val?: string) =>
  typeof val === "string" ? val.toUpperCase() : undefined;

export default async function Page({ params, searchParams }) {
  const municipalityName = params?.municipality || "Centar";

  // turn the /?x=... string into an object

  // map URL → GraphQL filter
  /* Page.tsx – build GraphQL variables */
  const filter = {
    transaction: toEnum(searchParams.listingType), // BUY / RENT
    type: toEnum(searchParams.propertyType), // APARTMENT …
    condition: toEnum(searchParams.condition), // GOOD …
    // primitives
    priceMin: searchParams.priceMin && +searchParams.priceMin,
    priceMax: searchParams.priceMax && +searchParams.priceMax,
    rooms: searchParams.bedrooms
      ? String(searchParams.bedrooms).split(",").map(Number)
      : undefined,
    bathrooms: searchParams.bathrooms && +searchParams.bathrooms,
    amenities: searchParams.specificDetails
      ? String(searchParams.specificDetails).split(",")
      : undefined,
    listingDate: searchParams.listingDate, // unchanged
    sort: searchParams.sort,
  };

  const client = getClient();
  const { data } = await client.query({
    query: LISTINGS_BY_MUNICIPALITY_FILTER,
    variables: { name: municipalityName, filter },
  });

  return (
    <ZoneListingsPage
      listings={data?.listingsByMunicipalityFilter ?? []}
      municipalityName={municipalityName}
    />
  );
}
