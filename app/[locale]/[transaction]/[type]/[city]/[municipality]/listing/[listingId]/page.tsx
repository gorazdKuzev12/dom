import { Metadata } from "next";
import ListingClient from "./ListingClient";

// GraphQL query to fetch listing by ID
const LISTING_QUERY = `
  query GetListing($id: ID!) {
    listingById(id: $id) {
      id
      title
      description
      type
      transaction
      price
      size
      condition
      floor
      totalFloors
      rooms
      bathrooms
      amenities
      address
      images
      contactName
      contactEmail
      contactPhone
      createdAt
      expiresAt
      municipality {
        id
        name_en
        name_mk
        name_sq
      }
      city {
        id
        name_en
        name_mk
        name_sq
        slug
      }
    }
  }
`;

interface PageProps {
  params: Promise<{
    locale: string;
    transaction: string;
    type: string;
    city: string;
    municipality: string;
    listingId: string;
  }>;
}

async function fetchListing(listingId: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql"
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: LISTING_QUERY,
          variables: { id: listingId },
        }),
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch listing");
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      return null;
    }

    return data.data?.listingById || null;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const listing = await fetchListing(resolvedParams.listingId);

  if (!listing) {
    return {
      title: "Listing Not Found | dom.mk",
      description: "The requested property listing could not be found.",
    };
  }

  const { locale } = resolvedParams;
  const municipalityName =
    locale === "mk"
      ? listing.municipality?.name_mk
      : locale === "sq"
      ? listing.municipality?.name_sq
      : listing.municipality?.name_en;

  const cityName =
    locale === "mk"
      ? listing.city?.name_mk
      : locale === "sq"
      ? listing.city?.name_sq
      : listing.city?.name_en;

  const transactionText =
    listing.transaction === "SALE" ? "for Sale" : "for Rent";

  return {
    title: `${listing.title} | ${municipalityName}, ${cityName} | dom.mk`,
    description:
      listing.description ||
      `${listing.type} ${transactionText} in ${municipalityName}, ${cityName}. Price: €${listing.price}. Size: ${listing.size}m². Contact: ${listing.contactPhone}`,
    openGraph: {
      title: listing.title,
      description:
        listing.description ||
        `${listing.type} ${transactionText} in ${municipalityName}`,
      images:
        listing.images && listing.images.length > 0
          ? [listing.images[0]]
          : ["/so.png"],
      url: `https://dom.mk/${locale}/${resolvedParams.transaction}/${resolvedParams.type}/${resolvedParams.city}/${resolvedParams.municipality}/listing/${resolvedParams.listingId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description:
        listing.description ||
        `${listing.type} ${transactionText} in ${municipalityName}`,
      images:
        listing.images && listing.images.length > 0
          ? [listing.images[0]]
          : ["/so.png"],
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const listing = await fetchListing(resolvedParams.listingId);

  // Validate that the URL params match the listing data
  const expectedTransaction = listing.transaction === "SALE" ? "buy" : "rent";
  const expectedPropertyType = listing.type.toLowerCase().replace("_", "-");
  const expectedCity = listing.city?.slug;
  const expectedMunicipality = listing.municipality?.name_en
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  // If URL doesn't match listing data, redirect to correct URL
  if (
    resolvedParams.transaction !== expectedTransaction ||
    !resolvedParams.type.includes(expectedPropertyType) ||
    resolvedParams.city !== expectedCity ||
    !resolvedParams.municipality.includes(
      expectedMunicipality?.replace(/[^\w-]/g, "") || ""
    )
  ) {
    // In a real app, you might want to redirect here
    // For now, we'll just continue to show the listing
  }

  return <ListingClient listing={listing} locale={resolvedParams.locale} />;
}
