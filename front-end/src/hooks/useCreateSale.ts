"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createDeliveryCheckout,
  createDeliverySale,
} from "@/services/apiERP/sale.service";
import type { CreateDeliverySaleData } from "@/types/sale";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRef } from "react";

interface UseCreateSaleOptions {
  onSuccess?: () => void;
}

interface CreateSaleVariables {
  data: CreateDeliverySaleData;
  checkoutOnline: boolean;
}

//hook para criar uma venda de delivery
export function useCreateSale(options?: UseCreateSaleOptions) {
  const idempotencyKey = useRef(crypto.randomUUID());

  //Mutatation para criar uma venda de delivery redirecionando para o checkout do Mercado Pago caso o método de pagamento seja PIX ou CARTAO_CREDITO
  return useMutation({
    mutationKey: ["delivery-sale", "create"],
    mutationFn: async ({ data, checkoutOnline }: CreateSaleVariables) => {
      if (
        checkoutOnline &&
        (data.payment === "PIX" || data.payment === "CARTAO_CREDITO")
      ) {
        const checkout = await createDeliveryCheckout(
          data,
          idempotencyKey.current,
        );
        window.location.assign(checkout.checkoutUrl);
        return;
      }

      return createDeliverySale(data, idempotencyKey.current);
    },
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
