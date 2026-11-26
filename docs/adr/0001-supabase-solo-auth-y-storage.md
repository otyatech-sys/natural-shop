# Supabase solo para Auth y Storage; los datos se acceden desde el servidor con Drizzle

Usamos Supabase (Postgres, Auth, Storage), pero el navegador nunca consulta las tablas directamente con el cliente de Supabase: todo acceso a datos pasa por Server Components y Server Actions de Next.js usando Drizzle. Así las reglas de negocio (precios, stock, Estados del Pedido) viven en una sola capa tipada en vez de repartirse entre políticas RLS y código. Las tablas tienen RLS activado sin políticas ("denegar todo") como red de seguridad ante una clave pública filtrada.

## Considered Options

- **Cliente de Supabase en el navegador + RLS por tabla**: menos código de servidor, pero duplica reglas entre SQL y TypeScript y hace frágil la lógica de checkout y stock.
