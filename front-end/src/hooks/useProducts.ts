"use client";

import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { PRODUCTS_QUERY } from "@/lib/queries";
import type { ProductsQueryResponse } from "@/types/product";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => graphqlClient.request<ProductsQueryResponse>(PRODUCTS_QUERY),
  });
}
