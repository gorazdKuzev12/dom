import HomePageClient from "@/components/HomePage";
import { getClient } from "@/lib/client";
import { GET_ALL_CITIES } from "@/lib/queries";

export default async function HomePage() {
  // Fetch cities on the server using Apollo Client directly
  let cities = [];

  try {
    const { data } = await getClient().query({
      query: GET_ALL_CITIES,
    });
    cities = data.city || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
  }

  return <HomePageClient initialCities={cities} />;
}
