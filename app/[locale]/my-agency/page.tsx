import ClientWrapper from "./ClientWrapper";
import ApolloWrapper from "@/components/ApolloWraper/page";
import Footer from "@/components/Footer/page";
import { Metadata } from "next";
import Menu from "@/components/Menu/page";
import { getServerAgencyData } from "@/lib/server-auth";

interface PageParams {
  locale: string;
}

// Helper function to get agency info from client-side storage
// This will be used by the client component for initial authentication check
const getStoredAgencyData = () => {
  if (typeof window === "undefined") return null;
  
  const token = localStorage.getItem('agencyToken') || sessionStorage.getItem('agencyToken');
  const storedAgencyData = localStorage.getItem('agencyData') || sessionStorage.getItem('agencyData');
  
  if (!token || !storedAgencyData) return null;
  
  try {
    return JSON.parse(storedAgencyData);
  } catch {
    return null;
  }
};

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = params;
  
  const titles = {
    en: "My Agency Dashboard | DOM Real Estate",
    mk: "Мој Агентски Панел | DOM Real Estate", 
    sq: "Paneli i Agjencisë | DOM Real Estate"
  };
  
  const descriptions = {
    en: "Manage your real estate agency dashboard. View your profile, manage listings, and access agency tools on DOM.",
    mk: "Управувајте со вашиот агентски панел за недвижности. Прегледајте го вашиот профил, управувајте со огласи и пристапете до агентски алатки на DOM.",
    sq: "Menaxhoni panelin e agjencisë tuaj të pasurive të patundshme. Shikoni profilin tuaj, menaxhoni listimet dhe aksesoni mjetet e agjencisë në DOM."
  };

  const title = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  
  return {
    title,
    description,
    keywords: "agency dashboard, real estate agency, manage listings, agency profile, DOM",
    authors: [{ name: "DOM Real Estate" }],
    creator: "DOM Real Estate",
    publisher: "DOM Real Estate",
    robots: {
      index: false, // Private dashboard should not be indexed
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://dom.mk/${locale}/my-agency`,
      siteName: "DOM Real Estate",
      locale: locale === 'mk' ? 'mk_MK' : locale === 'sq' ? 'sq_AL' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
      creator: "@DOMRealEstate",
    },
    alternates: {
      canonical: `https://dom.mk/${locale}/my-agency`,
      languages: {
        'en': 'https://dom.mk/en/my-agency',
        'mk': 'https://dom.mk/mk/my-agency',
        'sq': 'https://dom.mk/sq/my-agency',
      },
    },
  };
}

export default async function MyAgencyPage({ params }: { params: PageParams }) {
  // Try to fetch agency data server-side using HTTP-only cookies
  const { agency, isAuthenticated, error } = await getServerAgencyData();
  
  console.log('🔍 Server-side auth check:', { 
    isAuthenticated, 
    hasAgency: !!agency, 
    error: error || 'None' 
  });
  
  return (
    <div>
      <Menu />
      <ApolloWrapper>
        <ClientWrapper 
          serverAgency={agency}
          serverAuth={isAuthenticated}
          locale={params.locale}
        />
      </ApolloWrapper>
      <Footer />
    </div>
  );
} 