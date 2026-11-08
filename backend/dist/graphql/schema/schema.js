import { gql } from "graphql-tag";
export const typeDefs = gql `
  # Product related types
  type Product {
    id: ID!
    name: String!
    salePrice: Float!
    currentQuantity: Int!
    imageUrl: String
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

`;
