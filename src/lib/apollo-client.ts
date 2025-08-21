// src/lib/apollo-client.ts
"use client";

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// Create HTTP link with credentials for cookies
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
  credentials: 'include', // Include cookies in requests
});

// Create auth link to add JWT token to headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  let token = null;
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('agencyToken') || sessionStorage.getItem('agencyToken');
  }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

export default client;
