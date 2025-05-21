import HomePageClient from "@/components/HomePage";
import { getClient } from "@/lib/client";
import { GET_ALL_CITIES } from "@/lib/queries";

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
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

// Generate static params for all supported locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'mk' },
    { locale: 'al' }
  ];
}
