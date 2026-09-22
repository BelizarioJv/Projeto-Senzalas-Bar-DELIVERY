import {
  fetchProducts,
  fetchProductById,
  createSale,
} from "../../services/erp.service.js";
import { SaleInput } from "../../types/sale.js";

export const resolvers = {
  Query: {
    products: () => fetchProducts(),
    product: (_: unknown, args: { id: string }) => fetchProductById(args.id),
  },

  Mutation: {
    createSale: (_: unknown, args: { input: SaleInput }) =>
      createSale(args.input),
  },
};
