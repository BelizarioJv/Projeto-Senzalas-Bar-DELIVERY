"use client";

import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/services/graphQl/graphql-client";
import { PRODUCTS_QUERY } from "@/services/graphQl/queries";
import type { ProductsQueryResponse } from "@/types/product";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response =
        await graphqlClient.request<ProductsQueryResponse>(PRODUCTS_QUERY);

      return {
        products: response.products.map((product) => ({
          ...product,
          id: Number(product.id),
          quantity: product.currentQuantity,
        })),
      };
    },
  });
}
