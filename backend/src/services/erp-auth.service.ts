import axios from "axios";
import { ERP_URL } from "../config/erp.config.js";

let token: string | null = null;
let tokenExpiresAt = 0;

export async function loginERP(): Promise<string> {
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
  } catch (err: any) {
    throw new Error(`ERP login failed: ${err.response?.status || err.message}`);
  }
}

export async function getERPToken(): Promise<string> {
  if (!token || Date.now() >= tokenExpiresAt) {
    return loginERP();
  }

  return token;
}

export async function erpRequest<T>(
  request: (token: string) => Promise<{ data: T }>,
): Promise<T> {
  try {
    const response = await request(await getERPToken());
    return response.data;
  } catch (err: any) {
    if (err.response?.status !== 401) {
      throw err;
    }

    token = null;
    tokenExpiresAt = 0;
    const response = await request(await loginERP());
    return response.data;
  }
}

export function authorizationHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}
