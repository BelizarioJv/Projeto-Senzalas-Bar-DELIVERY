import {
  fetchProducts,
  fetchCatalogProductById,
} from "../../services/erp-product.service.js";

//Query resolvers para o GraphQL usando o cache do Redis para otimizar o desempenho das consultas de produtos.
export const resolvers = {
  Query: {
    products: () => fetchProducts(),
    product: (_: unknown, args: { id: string }) =>
      fetchCatalogProductById(args.id),
  },
};
