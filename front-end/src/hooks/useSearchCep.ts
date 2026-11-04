"use client";

import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { isValidPostalCode, normalizePostalCode } from "@/utils/address";
import type { DeliveryAddressFormData } from "./useDeliveryAddressForm";

interface ViaCepResponse {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

export function useSearchCep(
  setValue: UseFormSetValue<DeliveryAddressFormData>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchCep = async (postalCode: string) => {
    const normalizedCep = normalizePostalCode(postalCode);
    if (!isValidPostalCode(normalizedCep)) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${normalizedCep}/json/`,
      );
      const data = (await response.json()) as ViaCepResponse;
      if (!response.ok || data.erro) throw new Error("CEP não encontrado.");

      setValue("street", data.logradouro ?? "", { shouldValidate: true });
      setValue("neighborhood", data.bairro ?? "", { shouldValidate: true });
      setValue("city", data.localidade ?? "", { shouldValidate: true });
      setValue("state", data.uf?.toUpperCase() ?? "", { shouldValidate: true });
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Não foi possível buscar o CEP.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { searchCep, isLoading, error, clearError: () => setError("") };
}
