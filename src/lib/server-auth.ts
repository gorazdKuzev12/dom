import { cookies } from 'next/headers';
import { getClient } from './client';
import { GET_AGENCY } from './queries';

// Server-side function to get agency data using HTTP-only cookies
export async function getServerAgencyData() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('agencyToken')?.value;

    console.log('🍪 Server-side cookie check:', {
      cookieExists: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'None'
    });

    if (!token) {
      console.log('❌ No agency token cookie found');
      return { agency: null, isAuthenticated: false, error: null };
    }

    // Decode JWT to get agency ID (basic decode, server will verify the token)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return { agency: null, isAuthenticated: false, error: 'Token expired' };
    }

    // Fetch agency data from GraphQL with token in headers
    const { data } = await getClient().query({
      query: GET_AGENCY,
      variables: { id: payload.agencyId },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      errorPolicy: 'all'
    });

    return { 
      agency: data?.agency || null, 
      isAuthenticated: true, 
      error: null 
    };

  } catch (error) {
    console.error('Server-side agency fetch error:', error);
    return { 
      agency: null, 
      isAuthenticated: false, 
      error: error.message || 'Failed to fetch agency data' 
    };
  }
} 