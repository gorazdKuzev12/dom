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
  query GET_MUNICIPALITIES_BY_CITY_NAME($name: String!) {
    municipalitiesByCityName(name: $name) {
      id
      name_mk
      name_en
      name_sq
      isPopular
      averagePrice
      image
      createdAt
    }
  }
`;
