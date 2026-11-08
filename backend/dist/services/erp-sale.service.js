import { erpClient } from "../config/erp.client.js";
import { authorizationHeaders, erpRequest, } from "./erp-auth.service.js";
export async function createSale(saleData, idempotencyKey) {
    try {
        return await erpRequest((currentToken) => erpClient.post("/delivery", saleData, {
            headers: {
                ...authorizationHeaders(currentToken),
                "Idempotency-Key": idempotencyKey,
            },
        }));
    }
    catch (err) {
        throw new Error(`ERP create sale failed: ${err.response?.status || err.message}`);
    }
}
