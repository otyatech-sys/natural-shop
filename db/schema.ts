import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Every application table enables RLS without policies ("deny all"), so the
// public Supabase key can never read or write them. Data is only accessed from
// the server with Drizzle, as the table owner (ADR 0001).

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Octógonos: official warning labels printed on a Product's package. */
export const warningLabel = pgEnum("warning_label", [
  "high_sugar",
  "high_sodium",
  "high_saturated_fat",
  "contains_trans_fat",
]);

/** Unit of a Variant's Contenido neto. */
export const netContentUnit = pgEnum("net_content_unit", ["g", "ml"]);

export const categories = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  visible: boolean().notNull().default(true),
  ...timestamps,
}).enableRLS();

export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text().notNull().default(""),
    ingredients: text().notNull().default(""),
    allergens: text().notNull().default(""),
    sanitaryRegistration: text("sanitary_registration"),
    warningLabels: warningLabel("warning_labels")
      .array()
      .notNull()
      .default(sql`'{}'`),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    visible: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [index("products_category_id_idx").on(t.categoryId)],
).enableRLS();

export const variants = pgTable(
  "variants",
  {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    /** Contenido neto, e.g. 500 (g) or 1000 (ml). */
    netContentAmount: integer("net_content_amount").notNull(),
    netContentUnit: netContentUnit("net_content_unit").notNull(),
    /** Price in céntimos of PEN, IGV included. */
    priceCents: integer("price_cents").notNull(),
    stock: integer().notNull().default(0),
    /** Peso de envío: real weight with packaging, in grams. */
    shippingWeightGrams: integer("shipping_weight_grams").notNull(),
    visible: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("variants_product_id_idx").on(t.productId),
    check(
      "variants_net_content_amount_positive",
      sql`${t.netContentAmount} > 0`,
    ),
    check("variants_price_cents_positive", sql`${t.priceCents} > 0`),
    check("variants_stock_non_negative", sql`${t.stock} >= 0`),
    check(
      "variants_shipping_weight_grams_positive",
      sql`${t.shippingWeightGrams} > 0`,
    ),
  ],
).enableRLS();
