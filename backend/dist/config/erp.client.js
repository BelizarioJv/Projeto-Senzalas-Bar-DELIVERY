import axios from "axios";
import { ERP_URL } from "./erp.config.js";
export const erpClient = axios.create({
    baseURL: ERP_URL,
});
