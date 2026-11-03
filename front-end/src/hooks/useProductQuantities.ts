import { useState } from "react";

//Controladores de quantidade de produtos selecionados para compra. Mantém um estado interno que rastreia a quantidade selecionada para cada produto, permitindo incrementar ou decrementar a quantidade dentro dos limites definidos.
export function useProductQuantities() {
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<number, number>
  >({});

  const getSelectedQuantity = (productId: number) =>
    selectedQuantities[productId] ?? 1;

  const incrementQuantity = (productId: number, maxQuantity: number) => {
    setSelectedQuantities((current) => {
      const selectedQuantity = current[productId] ?? 1;

      if (selectedQuantity >= maxQuantity) return current;

      return {
        ...current,
        [productId]: selectedQuantity + 1,
      };
    });
  };

  const decrementQuantity = (productId: number) => {
    setSelectedQuantities((current) => {
      const selectedQuantity = current[productId] ?? 1;

      if (selectedQuantity <= 1) return current;

      return {
        ...current,
        [productId]: selectedQuantity - 1,
      };
    });
  };

  return {
    getSelectedQuantity,
    incrementQuantity,
    decrementQuantity,
  };
}
