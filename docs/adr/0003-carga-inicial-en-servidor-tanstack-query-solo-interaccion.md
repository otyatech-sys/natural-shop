# Carga inicial en el servidor con streaming; TanStack Query solo para interacción

Las páginas obtienen sus datos iniciales en Server Components, con Cache Components (`use cache` + invalidación al editar) para el catálogo y `<Suspense>` con esqueletos para lo que depende del usuario: así el contenido se ve progresivamente y los buscadores reciben la página completa. TanStack Query se usa solo donde hay interacción en el cliente: Carrito con actualización optimista, tablas del panel y espera de la confirmación del pago. No se usa para la carga inicial, para no duplicar en el cliente datos que ya llegan del servidor ni perder el HTML completo para SEO.

## Consequences

- Las lecturas de TanStack Query van a Route Handlers `GET` bajo `/api`; las escrituras, a Server Actions vía `useMutation`.
- No hay librería de estado global en el cliente (Zustand, etc.): el Carrito vive en la base de datos.
