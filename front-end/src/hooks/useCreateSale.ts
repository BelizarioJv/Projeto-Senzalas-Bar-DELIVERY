"use client";

import { useMutation } from "@tanstack/react-query";
import { createDeliverySale } from "@/services/apiERP/sale.service";
import type { CreateDeliverySaleData } from "@/types/sale";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRef } from "react";

interface UseCreateSaleOptions {
  onSuccess?: () => void;
}

//hook para criar uma venda de delivery
export function useCreateSale(options?: UseCreateSaleOptions) {
  const idempotencyKey = useRef(crypto.randomUUID());

  return useMutation({
    mutationKey: ["delivery-sale", "create"],
    mutationFn: (data: CreateDeliverySaleData) =>
      createDeliverySale(data, idempotencyKey.current),
    onSuccess: () => {
      toast.success("Pedido enviado com sucesso!");
      options?.onSuccess?.();
      idempotencyKey.current = crypto.randomUUID();
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
