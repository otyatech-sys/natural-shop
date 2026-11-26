import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold">
        Producto no encontrado
      </h1>
      <p className="text-muted-foreground">
        El producto que buscas no existe o ya no está disponible.
      </p>
      <Link href="/" className="text-sm underline underline-offset-4">
        Volver a la tienda
      </Link>
    </main>
  );
}
