"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MyAgencyClient from "@/components/MyAgencyClient";

interface AgencyData {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  zipCode: string;
  contactPerson: string;
  contactRole: string;
  agencySize: "SMALL" | "MEDIUM" | "LARGE";
  logo?: string;
  description: string;
  specializations: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface AgencyListing {
  id: string;
  title: string;
  description?: string;
  type: string;
  transaction: string;
  price: number;
  size: number;
  condition: string;
  floor?: number;
  totalFloors?: number;
  rooms?: number;
  bathrooms?: number;
  amenities: string[];
  address?: string;
  images: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  bookingNumber?: string;
  createdAt: string;
  expiresAt: string;
  city: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
    slug: string;
  };
  municipality?: {
    id: string;
    name_en: string;
    name_mk: string;
    name_sq: string;
    isPopular: boolean;
    averagePrice?: number;
    image?: string;
  };
  isAgencyListing: boolean;
}

interface ClientWrapperProps {
  serverAgency: AgencyData | null;
  serverListings: AgencyListing[] | null;
  serverAuth: boolean;
  locale: string;
}

export default function ClientWrapper({ serverAgency, serverListings, serverAuth, locale }: ClientWrapperProps) {
  const router = useRouter();
  const [checkedLocalStorage, setCheckedLocalStorage] = useState(false);

  useEffect(() => {
    // If no server authentication, check localStorage for existing tokens
    if (!serverAuth && !checkedLocalStorage) {
      const token = localStorage.getItem('agencyToken') || sessionStorage.getItem('agencyToken');
      const storedData = localStorage.getItem('agencyData') || sessionStorage.getItem('agencyData');
      
      console.log('🔄 Checking localStorage fallback:', {
        hasToken: !!token,
        hasStoredData: !!storedData
      });
      
      if (!token || !storedData) {
        console.log('❌ No localStorage data, redirecting to login');
        router.push(`/${locale}/agency-login`);
        return;
      }
      
      setCheckedLocalStorage(true);
    }
  }, [serverAuth, checkedLocalStorage, router, locale]);

  // If we have server data, use it directly
  if (serverAgency && serverAuth) {
    console.log('✅ Using server-provided agency data');
    return (
      <MyAgencyClient 
        agencyData={serverAgency}
        agencyListings={serverListings || []}
        isAuthenticated={true}
      />
    );
  }

  // If no server data but localStorage check completed, let client component handle it
  if (checkedLocalStorage) {
    console.log('🔄 Using client-side authentication fallback');
    return (
      <MyAgencyClient 
        agencyData={null}
        agencyListings={[]}
        isAuthenticated={false}
      />
    );
  }

  // Loading state while checking localStorage
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '400px',
      fontSize: '1.1rem',
      color: '#666'
    }}>
      Checking authentication...
    </div>
  );
} 