export function normalizePostalCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatPostalCode(value: string) {
  const postalCode = normalizePostalCode(value);
  return postalCode.length > 5
    ? `${postalCode.slice(0, 5)}-${postalCode.slice(5)}`
    : postalCode;
}

export function isValidPostalCode(value: string) {
  return normalizePostalCode(value).length === 8;
}
