"use client";

import { useMutation } from "@tanstack/react-query";
import { createDeliverySale } from "@/services/apiERP/sale.service";
import type { CreateDeliverySaleData } from "@/types/sale";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface UseCreateSaleOptions {
  onSuccess?: () => void;
}

export function useCreateSale(options?: UseCreateSaleOptions) {
  return useMutation({
    mutationKey: ["delivery-sale", "create"],
    mutationFn: (data: CreateDeliverySaleData) => createDeliverySale(data),
    onSuccess: () => {
      toast.success("Pedido enviado com sucesso!");
      options?.onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          error.response?.data?.error ??
          "Não foi possível finalizar o pedido.";

        toast.error(message);
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível finalizar o pedido.",
      );
    },
  });
}
