import { erpClient } from "../config/erp.client.js";
import { SaleInput } from "../types/sale.js";
import {
  authorizationHeaders,
  erpRequest,
} from "./erp-auth.service.js";

export async function createSale(saleData: SaleInput) {
  try {
    return await erpRequest((currentToken) =>
      erpClient.post("/delivery", saleData, {
        headers: authorizationHeaders(currentToken),
      }),
    );
  } catch (err: any) {
    throw new Error(
      `ERP create sale failed: ${err.response?.status || err.message}`,
    );
  }
}
