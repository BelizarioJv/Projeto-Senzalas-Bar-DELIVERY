import {
  fetchProducts,
  fetchProductById,
} from "../../services/erp-product.service.js";

export const resolvers = {
  Query: {
    products: () => fetchProducts(),
    product: (_: unknown, args: { id: string }) => fetchProductById(args.id),
  },

};
