import { erpClient } from "../config/erp.client.js";
import { authorizationHeaders, erpRequest, } from "../services/erp-auth.service.js";
export async function resolveImageUrl(productId, imageUrl) {
    if (!imageUrl)
        return null;
    if (/^https?:\/\//i.test(imageUrl))
        return imageUrl;
    if (!imageUrl.startsWith("s3://"))
        return imageUrl;
    return erpRequest(async (token) => {
        const response = await erpClient.get(`/products/${productId}/image-url`, {
            headers: authorizationHeaders(token),
        });
        return { data: response.data.imageUrl ?? null };
    });
}
