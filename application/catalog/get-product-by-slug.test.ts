import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb, type TestDb } from "@/test/db";
import { categories, products, variants } from "@/db/schema";
import { getProductBySlug } from "./get-product-by-slug";

let db: TestDb;

beforeEach(async () => {
  db = await createTestDb();
});

type VariantInput = Omit<typeof variants.$inferInsert, "productId">;

async function seedProduct(
  product: { name: string; slug: string; visible?: boolean },
  productVariants: VariantInput[],
) {
  const [category] = await db
    .insert(categories)
    .values({ name: "Cereales", slug: "cereales" })
    .returning();
  const [inserted] = await db
    .insert(products)
    .values({ ...product, categoryId: category.id })
    .returning();
  await db
    .insert(variants)
    .values(productVariants.map((v) => ({ ...v, productId: inserted.id })));
}

const granola500g: VariantInput = {
  netContentAmount: 500,
  netContentUnit: "g",
  priceCents: 2490,
  stock: 12,
  shippingWeightGrams: 540,
};

const granola250g: VariantInput = {
  netContentAmount: 250,
  netContentUnit: "g",
  priceCents: 1390,
  stock: 0,
  shippingWeightGrams: 275,
};

describe("getProductBySlug", () => {
  it("devuelve el Producto con sus Variantes y precios con IGV", async () => {
    await seedProduct(
      { name: "Granola de quinua", slug: "granola-de-quinua" },
      [granola500g, granola250g],
    );

    const result = await getProductBySlug(db, "granola-de-quinua");

    expect(result).toMatchObject({
      name: "Granola de quinua",
      slug: "granola-de-quinua",
      variants: [
        { netContent: { amount: 250, unit: "g" }, priceCents: 1390, stock: 0 },
        { netContent: { amount: 500, unit: "g" }, priceCents: 2490, stock: 12 },
      ],
    });
  });

  it("devuelve null si ningún Producto tiene ese slug", async () => {
    expect(await getProductBySlug(db, "no-existe")).toBeNull();
  });

  it("devuelve null si el Producto está oculto", async () => {
    await seedProduct(
      { name: "Granola de quinua", slug: "granola-de-quinua", visible: false },
      [granola500g],
    );

    expect(await getProductBySlug(db, "granola-de-quinua")).toBeNull();
  });

  it("no incluye las Variantes ocultas", async () => {
    await seedProduct(
      { name: "Granola de quinua", slug: "granola-de-quinua" },
      [granola500g, { ...granola250g, visible: false }],
    );

    const result = await getProductBySlug(db, "granola-de-quinua");

    expect(result?.variants).toHaveLength(1);
    expect(result?.variants[0]).toMatchObject({
      netContent: { amount: 500, unit: "g" },
    });
  });
});
