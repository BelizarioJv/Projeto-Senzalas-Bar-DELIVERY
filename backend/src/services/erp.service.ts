import axios from "axios";
import { IProduct } from "../types/products.js";
import { SaleInput } from "../types/sale.js";

const ERP_URL = process.env.ERP_URL;

const apiErp = axios.create({
  baseURL: ERP_URL,
});

let token: string | null = null;
export async function loginERP() {
  try {
    const response = await axios.post(`${ERP_URL}/login`, {
      user: process.env.ERP_USER,
      password: process.env.ERP_PASSWORD,
    });
    token = response.data.token;
    return token;
  } catch (err: any) {
    throw new Error(`ERP login failed: ${err.response?.status || err.message}`);
  }
}

// Buscar produtos no ERP
export async function fetchProducts() {
  try {
    if (!token) await loginERP();
    const res = await apiErp.get("/products", {
      params: { page: 1, pageSize: 10 },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data.map((p: IProduct) => ({
      id: String(p.id),
      name: p.name,
      salePrice: Number(p.salePrice),
      currentQuantity: p.currentQuantity,
    }));
  } catch (err: any) {
    throw new Error(
      `ERP products failed: ${err.response?.status || err.message}`,
    );
  }
}

// Buscar producto por ID
export async function fetchProductById(id: string) {
  try {
    if (!token) await loginERP();
    const res = await apiErp.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const p = res.data;
    return {
      id: String(p.id),
      name: p.name,
      salePrice: Number(p.salePrice),
      currentQuantity: p.currentQuantity,
    };
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw new Error(
      `ERP product ${id} failed: ${err.response?.status || err.message}`,
    );
  }
}
//Criar venda Delivery no ERP
export async function createSale(saleData: SaleInput) {
  try {
    if (!token) await loginERP();
    const res = await apiErp.post("/sale", saleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(
      `ERP create sale failed: ${err.response?.status || err.message}`,
    );
  }
}
