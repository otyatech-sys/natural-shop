import { and, asc, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { products, variants } from "@/db/schema";
import type { NetContent } from "./net-content";

export type ProductVariant = {
  id: string;
  netContent: NetContent;
  /** Céntimos of PEN, IGV included. */
  priceCents: number;
  stock: number;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  variants: ProductVariant[];
};

/** The visible Product with that slug and its visible Variants, or null. */
export async function getProductBySlug(
  db: Database,
  slug: string,
): Promise<ProductDetail | null> {
  const [product] = await db
    .select({ id: products.id, name: products.name, slug: products.slug })
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.visible, true)))
    .limit(1);
  if (!product) return null;

  const rows = await db
    .select({
      id: variants.id,
      amount: variants.netContentAmount,
      unit: variants.netContentUnit,
      priceCents: variants.priceCents,
      stock: variants.stock,
    })
    .from(variants)
    .where(and(eq(variants.productId, product.id), eq(variants.visible, true)))
    .orderBy(asc(variants.netContentAmount));

  return {
    ...product,
    variants: rows.map(({ amount, unit, ...rest }) => ({
      ...rest,
      netContent: { amount, unit },
    })),
  };
}
