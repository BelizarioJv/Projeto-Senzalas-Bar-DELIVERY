import axios from "axios";

// Instância do axios para se comunicar com a API de delivery
export const deliveryApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DELIVERY_API_URL ?? "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});
