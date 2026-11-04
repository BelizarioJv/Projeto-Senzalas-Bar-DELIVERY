"use client";

import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeliveryAddressForm } from "@/hooks/useDeliveryAddressForm";
import { useSearchCep } from "@/hooks/useSearchCep";
import { formatPostalCode, normalizePostalCode } from "@/utils/address";
import type { DeliveryAddress } from "@/app/actions/types/Customer";

export interface DeliveryAddressValues {
  postalCode: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
}

interface DeliveryAddressDialogProps {
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  loading: boolean;
  saving: boolean;
  error: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (address: DeliveryAddress) => void;
  onSave: (address: DeliveryAddressValues) => Promise<void>;
}

export default function DeliveryAddressDialog({
  addresses,
  selectedAddressId,
  loading,
  saving,
  error,
  open,
  onOpenChange,
  onSelect,
  onSave,
}: DeliveryAddressDialogProps) {
  const form = useDeliveryAddressForm();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const cep = watch("postalCode");
  const cepSearch = useSearchCep(setValue);

  const submit = handleSubmit((values) => onSave({
    ...values,
    postalCode: normalizePostalCode(values.postalCode),
    state: values.state.toUpperCase(),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Escolher endereço">
          <MapPin className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Endereço de entrega</DialogTitle>
          <DialogDescription>
            Escolha um endereço salvo ou cadastre um novo.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-52 space-y-2 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Carregando endereços...
            </div>
          )}
          {!loading && addresses.length === 0 && (
            <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              Você ainda não possui endereços cadastrados.
            </p>
          )}
          {addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelect(address)}
              className={`flex w-full items-start gap-3 rounded-md border p-3 text-left ${
                selectedAddressId === address.id
                  ? "border-primary bg-primary/10"
                  : "hover:bg-accent"
              }`}>
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="block text-sm">{address.label}</strong>
                <span className="text-xs text-muted-foreground">
                  {address.street}, {address.number}
                  {address.complement ? `, ${address.complement}` : ""}
                  {" - "}
                  {address.neighborhood}, {address.city}/{address.state}
                </span>
              </span>
            </button>
          ))}
        </div>

        <form className="border-t pt-4" onSubmit={submit}>
          <p className="mb-3 font-medium">Adicionar novo endereço</p>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <Label htmlFor="postal-code">CEP</Label>
              <Input
                id="postal-code"
                inputMode="numeric"
                maxLength={9}
                placeholder="00000-000"
                {...register("postalCode", {
                  required: "Informe o CEP.",
                  validate: (value) =>
                    normalizePostalCode(value).length === 8 ||
                    "Informe um CEP válido.",
                  onChange: (event) =>
                    setValue(
                      "postalCode",
                      formatPostalCode(event.target.value),
                      { shouldValidate: false },
                    ),
                })}
              />
            </div>
            <Button
              type="button"
              className="mt-auto"
              variant="outline"
              disabled={cepSearch.isLoading}
              onClick={() => cepSearch.searchCep(cep)}>
              {cepSearch.isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Buscar CEP"
              )}
            </Button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="dialog-street">Rua / Avenida</Label>
              <Input id="dialog-street" {...register("street", { required: true })} />
            </div>
            <div>
              <Label htmlFor="dialog-number">Número</Label>
              <Input id="dialog-number" {...register("number", { required: true })} />
            </div>
            <div>
              <Label htmlFor="dialog-neighborhood">Bairro</Label>
              <Input
                id="dialog-neighborhood"
                {...register("neighborhood", { required: true })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="dialog-complement">Complemento</Label>
              <Input id="dialog-complement" {...register("complement")} />
            </div>
            <div>
              <Label htmlFor="dialog-city">Cidade</Label>
              <Input id="dialog-city" {...register("city", { required: true })} />
            </div>
            <div>
              <Label htmlFor="dialog-state">Estado</Label>
              <Input
                id="dialog-state"
                maxLength={2}
                {...register("state", { required: true })}
                onChange={(event) =>
                  setValue("state", event.target.value.toUpperCase())
                }
              />
            </div>
          </div>

          {(errors.postalCode || errors.street || cepSearch.error || error) && (
            <p className="mt-3 text-sm text-destructive">
              {errors.postalCode?.message ??
                cepSearch.error ??
                error ??
                "Preencha os campos obrigatórios do endereço."}
            </p>
          )}
          <Button type="submit" className="mt-4 w-full" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Salvar endereço"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
