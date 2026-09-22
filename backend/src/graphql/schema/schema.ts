import gql from "graphql-tag";

export const typeDefs = gql`
  // Product related types
  type Product {
    id: ID!
    name: String!
    salePrice: Float!
    currentQuantity: Int!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  // Sale related types
  type SaleItem {
    productId: ID!
    quantity: Int!
    price: Float!
    subtotal: Float!
  }

  type Sale {
    id: ID!
    total: Float!
    payment: PaymentMethod!
    observation: String
    products: [SaleItem!]!
  }

  enum PaymentMethod {
  DINHEIRO
  PIX
  CARTAO_CREDITO
  CARTAO_DEBITO
}
  
input SaleItemInput {
  productId: ID!
  quantity: Int!
}

input CreateSaleInput {
  payment: PaymentMethod!
  observation: String
  customerId: ID
  products: [SaleItemInput!]!
}

type Mutation {
  createSale(input: CreateSaleInput!): Sale!
}

  
`;
