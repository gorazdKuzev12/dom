import ClientWrapper from "./ClientWrapper";
import ApolloWrapper from "@/components/ApolloWraper/page";
import Footer from "@/components/Footer/page";
import { Metadata } from "next";
import Menu from "@/components/Menu/page";
import { getServerUserData } from "@/lib/server-auth";

interface PageParams {
  locale: string;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = params;
  
  const titles = {
    en: "My Profile | DOM Real Estate",
    mk: "Мој Профил | DOM Real Estate", 
    sq: "Profili Im | DOM Real Estate"
  };
  
  const descriptions = {
    en: "Manage your profile and view your property listings. Access your dashboard on DOM Real Estate platform.",
    mk: "Управувајте со вашиот профил и прегледајте ги вашите огласи за недвижности. Пристапете до вашиот панел на DOM Real Estate платформата.",
    sq: "Menaxhoni profilin tuaj dhe shikoni listimet tuaja të pasurive. Aksesoni panelin tuaj në platformën DOM Real Estate."
  };

  const title = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  
  return {
    title,
    description,
    keywords: "user profile, my listings, property dashboard, user account, DOM",
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
      url: `https://dom.mk/${locale}/my-user`,
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
      canonical: `https://dom.mk/${locale}/my-user`,
      languages: {
        'en': 'https://dom.mk/en/my-user',
        'mk': 'https://dom.mk/mk/my-user',
        'sq': 'https://dom.mk/sq/my-user',
      },
    },
  };
}

export default async function MyUserPage({ params }: { params: PageParams }) {
  // Try to fetch user data and listings server-side using HTTP-only cookies
  const { user, listings, isAuthenticated, error } = await getServerUserData();
  
  console.log('🔍 Server-side user auth check:', { 
    isAuthenticated, 
    hasUser: !!user, 
    listingsCount: listings?.length || 0,
    error: error || 'None' 
  });
  
  return (
    <div>
      <Menu />
      <ApolloWrapper>
        <ClientWrapper 
          serverUser={user}
          serverListings={listings}
          serverAuth={isAuthenticated}
          locale={params.locale}
        />
      </ApolloWrapper>
      <Footer />
    </div>
  );
} 