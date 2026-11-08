import axios from "axios";
import { ERP_URL } from "../config/erp.config.js";
let token = null;
let tokenExpiresAt = 0;
export async function loginERP() {
    try {
        const response = await axios.post(`${ERP_URL}/login`, {
            user: process.env.ERP_USER,
            password: process.env.ERP_PASSWORD,
        });
        const authenticatedToken = response.data.token;
        if (typeof authenticatedToken !== "string" || !authenticatedToken) {
            throw new Error("ERP login response did not contain a token");
        }
        token = authenticatedToken;
        tokenExpiresAt = Date.now() + 50 * 60 * 1000;
        return token;
    }
    catch (err) {
        throw new Error(`ERP login failed: ${err.response?.status || err.message}`);
    }
}
export async function getERPToken() {
    if (!token || Date.now() >= tokenExpiresAt) {
        return loginERP();
    }
    return token;
}
export async function erpRequest(request) {
    try {
        const response = await request(await getERPToken());
        return response.data;
    }
    catch (err) {
        if (err.response?.status !== 401) {
            throw err;
        }
        token = null;
        tokenExpiresAt = 0;
        const response = await request(await loginERP());
        return response.data;
    }
}
export function authorizationHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}
