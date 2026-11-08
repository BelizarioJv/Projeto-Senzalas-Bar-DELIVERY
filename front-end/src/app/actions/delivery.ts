"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/services/supabase/server";
import type { DeliveryAddress, NewDeliveryAddress } from "./types/Customer";

async function getAuthenticatedCustomer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Faça login para gerenciar seus endereços.");
  return { supabase, customerId: user.id };
}

export async function getDeliveryAddresses(): Promise<DeliveryAddress[]> {
  const { supabase, customerId } = await getAuthenticatedCustomer();
  const { data, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("customer_id", customerId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveDeliveryAddress(
  address: Omit<NewDeliveryAddress, "customer_id" | "id">,
) {
  const { supabase, customerId } = await getAuthenticatedCustomer();

  if (address.is_default) {
    await supabase
      .from("delivery_addresses")
      .update({ is_default: false })
      .eq("customer_id", customerId);
  }

  const { data, error } = await supabase
    .from("delivery_addresses")
    .insert({
      ...address,
      customer_id: customerId,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/carrinho");
  return data as DeliveryAddress;
}
