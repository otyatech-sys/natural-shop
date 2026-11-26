import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedProduct } from "@/lib/catalog";
import { formatNetContent, formatPrice } from "@/lib/format";

export default function ProductPage({
  params,
}: PageProps<"/productos/[slug]">) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Suspense fallback={<ProductSkeleton />}>
        {params.then(({ slug }) => (
          <ProductDetails slug={slug} />
        ))}
      </Suspense>
    </main>
  );
}

async function ProductDetails({ slug }: { slug: string }) {
  const product = await getCachedProduct(slug);
  if (!product) notFound();

  return (
    <article className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        {product.name}
      </h1>
      <section aria-labelledby="variantes" className="flex flex-col gap-3">
        <h2
          id="variantes"
          className="text-sm font-medium text-muted-foreground"
        >
          Variantes
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {product.variants.map((variant) => (
            <li key={variant.id}>
              <Card size="sm">
                <CardContent className="flex items-baseline justify-between gap-4">
                  <span className="text-base font-medium">
                    {formatNetContent(variant.netContent)}
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-lg font-semibold tabular-nums">
                      {formatPrice(variant.priceCents)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      IGV incluido
                    </span>
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-2/3" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </div>
  );
}
