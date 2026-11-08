"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDeliveryAddresses,
  saveDeliveryAddress,
} from "@/app/actions/delivery";
import type { DeliveryAddress, NewDeliveryAddress } from "@/app/actions/types/Customer";
import type { DeliveryAddressValues } from "@/components/DeliveryAddressDialog";

export type DeliveryPaymentMethod = "pix" | "card" | "cash";

const emptyAddress = {
  postalCode: "",
  street: "",
  number: "",
  neighborhood: "",
  complement: "",
  city: "",
  state: "",
};

export function useDeliveryCheckout() {
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] =
    useState<DeliveryPaymentMethod>("pix");
  const [selectedAddress, setSelectedAddress] =
    useState<DeliveryAddress | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const addressesQuery = useQuery({
    queryKey: ["delivery-addresses"],
    queryFn: getDeliveryAddresses,
  });

  const saveAddressMutation = useMutation({
    mutationFn: (address: Omit<NewDeliveryAddress, "customer_id" | "id">) =>
      saveDeliveryAddress(address),
    onSuccess: async (savedAddress) => {
      queryClient.setQueryData<DeliveryAddress[]>(
        ["delivery-addresses"],
        (current = []) => [
          savedAddress,
          ...current.filter((address) => address.id !== savedAddress.id),
        ],
      );
      setSelectedAddress(savedAddress);
      setAddressDialogOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["delivery-addresses"],
      });
    },
  });

  useEffect(() => {
    if (selectedAddress || !addressesQuery.data) return;

    const defaultAddress =
      addressesQuery.data.find((address) => address.is_default) ??
      addressesQuery.data[0];

    if (defaultAddress) setSelectedAddress(defaultAddress);
  }, [addressesQuery.data, selectedAddress]);

  const selectAddress = (address: DeliveryAddress) => {
    setSelectedAddress(address);
  };

  const addAddress = async (values: DeliveryAddressValues) => {
    await saveAddressMutation.mutateAsync({
      label: values.street,
      recipient_name: "Cliente",
      phone: null,
      postal_code: values.postalCode,
      street: values.street,
      number: values.number,
      complement: values.complement || null,
      neighborhood: values.neighborhood,
      city: values.city,
      state: values.state,
      reference: null,
      latitude: null,
      longitude: null,
      is_default: addressesQuery.data?.length === 0,
    });
  };

  const address = selectedAddress
    ? {
        postalCode: selectedAddress.postal_code,
        street: selectedAddress.street,
        number: selectedAddress.number,
        neighborhood: selectedAddress.neighborhood,
        complement: selectedAddress.complement ?? "",
        city: selectedAddress.city,
        state: selectedAddress.state,
      }
    : emptyAddress;

  return {
    paymentMethod,
    setPaymentMethod,
    addresses: addressesQuery.data ?? [],
    selectedAddressId: selectedAddress?.id ?? "",
    address,
    addressDialogOpen,
    setAddressDialogOpen,
    loadingAddresses: addressesQuery.isLoading,
    addressError:
      addressesQuery.error?.message ??
      saveAddressMutation.error?.message ??
      "",
    savingAddress: saveAddressMutation.isPending,
    selectAddress,
    addAddress,
  };
}
