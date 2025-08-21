import { Metadata } from "next";
import PostPropertyClient from "./PostPropertyClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const titles: Record<string, string> = {
    en: "Post Your Property | dom.mk",
    mk: "Објави имот | dom.mk", 
    sq: "Publiko pronën | dom.mk",
  };

  const descriptions: Record<string, string> = {
    en: "List your property for sale or rent on dom.mk. Free property listing platform in North Macedonia.",
    mk: "Наведи го твојот имот за продажба или под наем на dom.mk. Бесплатна платформа за објавување имоти во Северна Македонија.",
    sq: "Listo pronën tënde për shitje ose me qira në dom.mk. Platformë falas për listimin e pronave në Maqedoninë e Veriut.",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
  };
}

export default function PostPropertyPage() {
  return <PostPropertyClient />;
}