import axios from "axios";

export const deliveryApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DELIVERY_API_URL ?? "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});
