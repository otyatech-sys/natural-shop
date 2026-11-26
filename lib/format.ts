import type { NetContent } from "@/application/catalog/net-content";

const pen = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});
const decimal = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 });

/** Céntimos of PEN to "S/ 24.90". */
export function formatPrice(cents: number): string {
  return pen.format(cents / 100);
}

/** Contenido neto as printed on the package: "500 g", "1 kg", "1.5 L". */
export function formatNetContent({ amount, unit }: NetContent): string {
  if (amount >= 1000) {
    return `${decimal.format(amount / 1000)} ${unit === "g" ? "kg" : "L"}`;
  }
  return `${decimal.format(amount)} ${unit}`;
}
