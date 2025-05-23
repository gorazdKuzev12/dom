// src/lib/client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Create a single Apollo Client instance
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
    fetch,
  }),
});

// Export a function that returns the client
export const getClient = () => {
  return client;
};

// Also export the client directly for components that need it
export default client;
