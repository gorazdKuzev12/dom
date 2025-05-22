import HomePageClient from "@/components/HomePage";
import { getClient } from "@/lib/client";
import { GET_ALL_CITIES } from "@/lib/queries";
import Footer from "@/components/Footer/page";

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

  return (
    <div>
      <HomePageClient initialCities={cities} />
      <Footer />
    </div>
  );
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'mk' },
    { locale: 'sq' }
  ];
}
