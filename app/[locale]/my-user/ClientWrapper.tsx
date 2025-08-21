"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MyUserClient from "@/components/MyUserClient";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserListing {
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
  serverUser: UserData | null;
  serverListings: UserListing[] | null;
  serverAuth: boolean;
  locale: string;
}

export default function ClientWrapper({ serverUser, serverListings, serverAuth, locale }: ClientWrapperProps) {
  const router = useRouter();
  const [checkedLocalStorage, setCheckedLocalStorage] = useState(false);

  useEffect(() => {
    // If no server authentication, check localStorage for existing tokens
    if (!serverAuth && !checkedLocalStorage) {
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
      const storedData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      console.log('🔄 Checking user localStorage fallback:', {
        hasToken: !!token,
        hasStoredData: !!storedData
      });
      
      if (!token || !storedData) {
        console.log('❌ No user localStorage data, redirecting to login');
        router.push(`/${locale}/login`);
        return;
      }
      
      setCheckedLocalStorage(true);
    }
  }, [serverAuth, checkedLocalStorage, router, locale]);

  // If we have server data, use it directly
  if (serverUser && serverAuth) {
    console.log('✅ Using server-provided user data');
    return (
      <MyUserClient 
        userData={serverUser}
        userListings={serverListings || []}
        isAuthenticated={true}
      />
    );
  }

  // If no server data but localStorage check completed, let client component handle it
  if (checkedLocalStorage) {
    console.log('🔄 Using client-side user authentication fallback');
    return (
      <MyUserClient 
        userData={null}
        userListings={[]}
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