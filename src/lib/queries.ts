import { gql } from "@apollo/client";

export const GET_ALL_CITIES = gql`
  query GET_ALL_CITIES {
    city {
      id
      name_mk
      name_en
      name_sq
      slug
    }
  }
`;
export const GET_MUNICIPALITIES_BY_CITY_NAME = gql`
  query GET_MUNICIPALITIES_BY_CITY_NAME(
    $name: String!
    $transaction: TransactionType
    $propertyType: PropertyType
  ) {
    municipalitiesByCityName(
      name: $name
      transaction: $transaction
      propertyType: $propertyType
    ) {
      id
      name_mk
      name_en
      name_sq
      isPopular
      averagePrice
      image
      propertyCount
    }
  }
`;
export const LISTINGS_BY_MUNICIPALITY = gql`
  query ListingsByMunicipalityName($name: String!) {
    listingsByMunicipalityName(name: $name) {
      id
      title
      description
      price
      sizeM2
      bedrooms
      bathrooms
      floor
      totalFloors
      type
      images
      createdAt
    }
  }
`;

export const LISTINGS_BY_MUNICIPALITY_FILTER = gql`
  query ListingsByMunicipalityFilter(
    $name: String!
    $filter: ListingFilterInput
  ) {
    listingsByMunicipalityFilter(name: $name, filter: $filter) {
      id
      title
      price
      rooms
      bathrooms
      size
      images
      createdAt
      # …any other fields your card needs
    }
  }
`;
