import HomePageClient from "@/components/HomePage";
import { getClient } from "@/lib/client";
import { GET_ALL_CITIES } from "@/lib/queries";
import Footer from "@/components/Footer/page";
import { Metadata } from "next";

interface HomePageProps {
  params: {
    locale: string;
  };
}

// Helper function to get localized content for homepage
const getLocalizedContent = (locale: string) => {
  const content: Record<string, { title: string; description: string; keywords: string }> = {
    en: {
      title: "DOM Real Estate - Find Your Perfect Property in Macedonia",
      description: "Discover the best apartments, houses, and commercial properties for sale and rent in Macedonia. Browse listings in Skopje, Bitola, Kumanovo, Tetovo and more cities.",
      keywords: "real estate Macedonia, apartments for sale, houses for rent, property Macedonia, Skopje real estate, Bitola properties, Kumanovo apartments, Tetovo houses"
    },
    mk: {
      title: "ДОМ Недвижности - Најдете го Вашиот Совршен Имот во Македонија",
      description: "Откријтеги најдобрите станови, куќи и комерцијални простории за продажба и изнајмување во Македонија. Прегледајте огласи во Скопје, Битола, Куманово, Тетово и други градови.",
      keywords: "недвижности Македонија, станови за продажба, куќи за изнајмување, имоти Македонија, недвижности Скопје, имоти Битола, станови Куманово, куќи Тетово"
    },
    sq: {
      title: "DOM Pasuritë e Patundshme - Gjeni Pronën Tuaj të Përsosur në Maqedoni",
      description: "Zbuloni apartamentet, shtëpitë dhe pronat komerciale më të mira për shitje dhe qira në Maqedoni. Shfletoni listimet në Shkup, Manastir, Kumanovë, Tetovë dhe qytete të tjera.",
      keywords: "pasuritë e patundshme Maqedoni, apartamente për shitje, shtëpi për qira, prona Maqedoni, pasuritë e patundshme Shkup, prona Manastir, apartamente Kumanovë, shtëpi Tetovë"
    }
  };
  
  return content[locale] || content.en;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const content = getLocalizedContent(locale);
  
  // Create canonical URL
  const canonicalUrl = `https://dom.mk/${locale}`;
  
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
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
      title: content.title,
      description: content.description,
      url: canonicalUrl,
      siteName: "DOM Real Estate",
      locale: locale === 'mk' ? 'mk_MK' : locale === 'sq' ? 'sq_AL' : 'en_US',
      type: "website",
      images: [
        {
          url: "/dom.jpg",
          width: 1200,
          height: 630,
          alt: "DOM Real Estate - Property listings in Macedonia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/dom.jpg"],
      creator: "@DOMRealEstate",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://dom.mk/en',
        'mk': 'https://dom.mk/mk',
        'sq': 'https://dom.mk/sq',
      },
    },
    other: {
      'geo.region': 'MK',
      'geo.country': 'Macedonia',
      'geo.placename': 'Macedonia',
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
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
