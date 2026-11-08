import { fetchProducts, fetchProductById, } from "../../services/erp-product.service.js";
export const resolvers = {
    Query: {
        products: () => fetchProducts(),
        product: (_, args) => fetchProductById(args.id),
    },
};
