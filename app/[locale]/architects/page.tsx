import ArchitectsPageClient from "@/components/ArchitectsPage";
import { getClient } from "@/lib/client";
import { GET_ALL_ARCHITECTS } from "@/lib/queries";
import Footer from "@/components/Footer/page";

interface ArchitectsPageProps {
  params: {
    locale: string;
  };
}

export default async function ArchitectsPage({ params }: ArchitectsPageProps) {
  let architects = [];

  try {
    const { data } = await getClient().query({
      query: GET_ALL_ARCHITECTS,
      variables: {
        filter: {
          isActive: true,
        },
      },
    });
    architects = data.architects || [];
  } catch (error) {
    console.error("Error fetching architects:", error);
  }

  return (
    <div>
      <ArchitectsPageClient initialArchitects={architects} locale={params.locale} />
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

// Add metadata for SEO
export async function generateMetadata({ params }: ArchitectsPageProps) {
  const locale = params.locale;
  
  const titles = {
    en: "Architects in Macedonia - Professional Architectural Services | DOM.MK",
    mk: "Архитекти во Македонија - Професионални архитектонски услуги | DOM.MK",
    sq: "Arkitektë në Maqedoni - Shërbime Profesionale Arkitekturore | DOM.MK"
  };
  
  const descriptions = {
    en: "Find the best architects in Macedonia. Browse professional portfolios, view completed projects, and connect with verified architectural experts for your next project.",
    mk: "Најдете ги најдобрите архитекти во Македонија. Прегледајте професионални портфолиа, видете завршени проекти и поврзете се со верификувани архитектонски експерти за вашиот следен проект.",
    sq: "Gjeni arkitektët më të mirë në Maqedoni. Shfletoni portfoliot profesionale, shikoni projektet e përfunduara dhe lidhuni me ekspertët e verifikuar arkitekturorë për projektin tuaj të ardhshëm."
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      locale: locale,
    },
  };
} 