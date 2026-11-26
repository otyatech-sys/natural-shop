import "./env";
import { eq } from "drizzle-orm";
import { connect } from "../db/connect";
import { categories, products, variants } from "../db/schema";

/**
 * Development seed data. Idempotent: Categories and Products are matched by
 * slug, and an existing Product is left untouched together with its Variants.
 */
async function main() {
  const { db, close } = connect({ max: 1 });

  try {
    await db
      .insert(categories)
      .values({ name: "Cereales y granolas", slug: "cereales-y-granolas" })
      .onConflictDoNothing({ target: categories.slug });
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, "cereales-y-granolas"));

    const [product] = await db
      .insert(products)
      .values({
        categoryId: category.id,
        name: "Granola de quinua y kiwicha",
        slug: "granola-de-quinua-y-kiwicha",
        description:
          "Granola horneada con quinua y kiwicha peruanas, avena y miel.",
        ingredients: "Avena, quinua, kiwicha, miel de abeja, pasas, almendras.",
        allergens: "Contiene almendras. Puede contener trazas de maní.",
        sanitaryRegistration: "A1234567N/NAXXXX",
        warningLabels: ["high_sugar"],
      })
      .onConflictDoNothing({ target: products.slug })
      .returning({ id: products.id });

    if (product) {
      await db.insert(variants).values([
        {
          productId: product.id,
          netContentAmount: 250,
          netContentUnit: "g",
          priceCents: 1390,
          stock: 20,
          shippingWeightGrams: 275,
        },
        {
          productId: product.id,
          netContentAmount: 500,
          netContentUnit: "g",
          priceCents: 2490,
          stock: 12,
          shippingWeightGrams: 540,
        },
      ]);
      console.log("Seeded: /productos/granola-de-quinua-y-kiwicha");
    } else {
      console.log("Seed data already present; nothing to do.");
    }
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
