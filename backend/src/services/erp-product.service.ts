import { erpClient } from "../config/erp.client.js";
import { IProduct } from "../types/products.js";
import { resolveImageUrl } from "../utils/product-image.utils.js";
import { authorizationHeaders, erpRequest } from "./erp-auth.service.js";
import { getOrLoadProductCache } from "./redis-cache.service.js";

// Função para carregar produtos do ERP, transformando-os no formato necessário para o GraphQL.
async function loadProducts() {
  try {
    const products = await erpRequest<{ data: IProduct[] }>(
      async (currentToken) =>
        erpClient.get<{ data: IProduct[] }>("/products", {
          params: { page: 1, pageSize: 10 },
          headers: authorizationHeaders(currentToken),
        }),
    );

    return Promise.all(
      products.data.map(async (product) => ({
        id: String(product.id),
        name: product.name,
        salePrice: Number(product.salePrice),
        currentQuantity: product.currentQuantity,
        imageUrl: await resolveImageUrl(String(product.id), product.imageUrl),
      })),
    );
  } catch (err: any) {
    throw new Error(
      `ERP products failed: ${err.response?.status || err.message}`,
    );
  }
}

//Fnçao para buscar todos os produtos do ERP, utilizando o cache do Redis para otimizar o desempenho.
export function fetchProducts() {
  return getOrLoadProductCache("delivery:products:v1:list", loadProducts);
}

async function loadProductById(id: string) {
  try {
    const product = await erpRequest<IProduct>(async (currentToken) =>
      erpClient.get<IProduct>(`/products/${id}`, {
        headers: authorizationHeaders(currentToken),
      }),
    );

    return {
      id: String(product.id),
      name: product.name,
      salePrice: Number(product.salePrice),
      currentQuantity: product.currentQuantity,
      imageUrl: await resolveImageUrl(String(product.id), product.imageUrl),
    };
  } catch (err: any) {
    if (err.response?.status === 404) return null;

    throw new Error(
      `ERP product ${id} failed: ${err.response?.status || err.message}`,
    );
  }
}

//Funçao para buscar um produto específico do ERP, utilizando o cache do Redis para otimizar o desempenho.
export function fetchProductById(id: string) {
  return loadProductById(id);
}

//Funçao para buscar ou carregar um produto específico do ERP, utilizando o cache do Redis para otimizar o desempenho.
export function fetchCatalogProductById(id: string) {
  return getOrLoadProductCache(
    `delivery:products:v1:${encodeURIComponent(id)}`,
    () => loadProductById(id),
  );
}
