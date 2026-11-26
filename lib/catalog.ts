import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/db/client";
import { getProductBySlug } from "@/application/catalog/get-product-by-slug";

/** Cache tag for everything rendered from one Product (ficha, tarjetas). */
export const productTag = (slug: string) => `product:${slug}`;

export async function getCachedProduct(slug: string) {
  "use cache";
  cacheTag("catalog", productTag(slug));
  cacheLife("hours");
  return getProductBySlug(getDb(), slug);
}
