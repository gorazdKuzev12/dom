import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import NeighborhoodsClient from "@/components/MapComponent";
import { GET_MUNICIPALITIES_BY_CITY_NAME } from "@/lib/queries";

export default async function NeighborhoodsPage({ params }) {
  const { city } = params;

  try {
    // Fetch municipalities data using Apollo Client
    const { data } = await getClient().query({
      query: GET_MUNICIPALITIES_BY_CITY_NAME,
      variables: {
        name: city,
      },
    });

    // Prepare municipalities data for the client component
    const municipalities = data.municipalitiesByCityName.map(
      (municipality) => ({
        id: municipality.id,
        name: municipality.name_en, // Using English name as default
        slug: municipality.name_en.toLowerCase().replace(/\s+/g, "-"),
        propertyCount: 0, // This would ideally come from an additional query
        avgPrice: municipality.averagePrice
          ? `€${municipality.averagePrice}/m²`
          : "Price data unavailable",
        image: municipality.image || "/api/placeholder/400/160",
        isPopular: municipality.isPopular,
      })
    );

    return (
      <NeighborhoodsClient cityName={city} neighborhoods={municipalities} />
    );
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    return (
      <div>
        <h1>Error loading neighborhoods</h1>
      </div>
    );
  }
}
