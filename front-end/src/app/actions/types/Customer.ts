export interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface DeliveryAddress {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone: string | null;
  postal_code: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  reference: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
}

export type NewDeliveryAddress = Omit<DeliveryAddress, "id" | "created_at">;
