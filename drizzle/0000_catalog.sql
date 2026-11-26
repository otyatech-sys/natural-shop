CREATE TYPE "public"."net_content_unit" AS ENUM('g', 'ml');--> statement-breakpoint
CREATE TYPE "public"."warning_label" AS ENUM('high_sugar', 'high_sodium', 'high_saturated_fat', 'contains_trans_fat');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"ingredients" text DEFAULT '' NOT NULL,
	"allergens" text DEFAULT '' NOT NULL,
	"sanitary_registration" text,
	"warning_labels" "warning_label"[] DEFAULT '{}' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"net_content_amount" integer NOT NULL,
	"net_content_unit" "net_content_unit" NOT NULL,
	"price_cents" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"shipping_weight_grams" integer NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "variants_net_content_amount_positive" CHECK ("variants"."net_content_amount" > 0),
	CONSTRAINT "variants_price_cents_positive" CHECK ("variants"."price_cents" > 0),
	CONSTRAINT "variants_stock_non_negative" CHECK ("variants"."stock" >= 0),
	CONSTRAINT "variants_shipping_weight_grams_positive" CHECK ("variants"."shipping_weight_grams" > 0)
);
--> statement-breakpoint
ALTER TABLE "variants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "variants_product_id_idx" ON "variants" USING btree ("product_id");