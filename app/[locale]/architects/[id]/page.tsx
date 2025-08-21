import { getClient } from "@/lib/client";
import { GET_ARCHITECT_BY_ID } from "@/lib/queries";
import { notFound } from "next/navigation";
import ArchitectProfileClient from "@/components/ArchitectProfile";
import { Metadata } from "next";

interface ArchitectPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArchitectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const { data } = await getClient().query({
      query: GET_ARCHITECT_BY_ID,
      variables: { id: resolvedParams.id },
    });

    const architect = data.architectById;
    
    if (!architect) {
      return {
        title: "Architect Not Found | dom.mk",
      };
    }

    const getLocalizedText = (en?: string, mk?: string, sq?: string) => {
      switch (resolvedParams.locale) {
        case 'mk': return mk || en || '';
        case 'sq': return sq || en || '';
        default: return en || '';
      }
    };

    const title = `${architect.firstName} ${architect.lastName} - ${architect.companyName || 'Architect'} | dom.mk`;
    const description = getLocalizedText(architect.bio_en, architect.bio_mk, architect.bio_sq)?.substring(0, 160) || 
      `Professional architect specializing in ${architect.specializations.join(', ')}`;

    return {
      title,
      description,
      keywords: [
        architect.firstName,
        architect.lastName,
        architect.companyName,
        ...architect.specializations,
        'architect',
        'Macedonia',
        'design',
        'construction'
      ].filter(Boolean).join(', '),
      openGraph: {
        title,
        description,
        images: architect.profileImage ? [architect.profileImage] : [],
        url: `https://dom.mk/${resolvedParams.locale}/architects/${resolvedParams.id}`,
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: architect.profileImage ? [architect.profileImage] : [],
      },
      alternates: {
        canonical: `https://dom.mk/${resolvedParams.locale}/architects/${resolvedParams.id}`,
        languages: {
          'en': `https://dom.mk/en/architects/${resolvedParams.id}`,
          'mk': `https://dom.mk/mk/architects/${resolvedParams.id}`,
          'sq': `https://dom.mk/sq/architects/${resolvedParams.id}`,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Architect Profile | dom.mk",
    };
  }
}

export default async function ArchitectPage({ params }: ArchitectPageProps) {
  const resolvedParams = await params;
  let architect = null;

  try {
    const { data } = await getClient().query({
      query: GET_ARCHITECT_BY_ID,
      variables: { id: resolvedParams.id },
    });
    
    architect = data.architectById;
  } catch (error) {
    console.error("Error fetching architect:", error);
  }

  if (!architect) {
    notFound();
  }

  return <ArchitectProfileClient architect={architect} locale={resolvedParams.locale} />;
}

// Generate static params for common architect IDs (optional)
export async function generateStaticParams() {
  // You could fetch popular architect IDs here for static generation
  return [];
} 