"use client";

import { useForm } from "react-hook-form";
import type { DeliveryAddress } from "@/app/actions/types/Customer";

export interface DeliveryAddressFormData {
  postalCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
}

export function useDeliveryAddressForm(address?: DeliveryAddress) {
  return useForm<DeliveryAddressFormData>({
    defaultValues: address
      ? {
          postalCode: address.postal_code,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          complement: address.complement ?? "",
          city: address.city,
          state: address.state,
        }
      : {
          postalCode: "",
          street: "",
          number: "",
          neighborhood: "",
          complement: "",
          city: "",
          state: "",
        },
  });
}
