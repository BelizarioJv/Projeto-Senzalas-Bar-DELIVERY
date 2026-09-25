export const PRODUCTS_QUERY = `
  query Products {
    products {
      id
      name
      salePrice
      currentQuantity
    }
  }
`;
