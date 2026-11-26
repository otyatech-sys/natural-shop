# Natural Shop

Tienda online de un único vendedor que vende productos alimenticios envasados a consumidores finales en Chiclayo (Perú), con entrega a domicilio local.

Cada término indica entre paréntesis el nombre que usa el código.

## Catálogo

**Producto** (`Product`):
Un alimento envasado que la tienda ofrece (p. ej. "Granola de quinua"). No se compra directamente: se compra una de sus Variantes.
_Avoid_: Artículo, ítem

**Variante** (`Variant`):
Una presentación concreta de un Producto, identificada por su Contenido neto, con su propio precio fijo en soles (IGV incluido), su propio Stock y su Peso de envío. Todo Producto tiene al menos una.
_Avoid_: Presentación, tamaño, SKU

**Contenido neto** (`netContent`):
Cantidad de alimento que declara el empaque de una Variante (p. ej. 500 g, 1 L). Es lo que ve el Cliente.
_Avoid_: Peso, tamaño

**Peso de envío** (`shippingWeight`):
Peso real de una Variante con su empaque, en gramos. Solo sirve para calcular envíos; el Cliente no lo ve.
_Avoid_: Peso bruto, peso

**Categoría** (`Category`):
Agrupación del catálogo (p. ej. Cereales, Endulzantes). Cada Producto pertenece a exactamente una.
_Avoid_: Sección, tipo, colección

**Registro sanitario** (`sanitaryRegistration`):
Código DIGESA que autoriza la venta de un Producto en Perú.
_Avoid_: RS, permiso, licencia

**Octógono** (`WarningLabel`):
Advertencia publicitaria oficial que lleva el empaque de un Producto ("ALTO EN AZÚCAR", "ALTO EN SODIO", "ALTO EN GRASAS SATURADAS", "CONTIENE GRASAS TRANS"). El Administrador asigna a cada Producto los Octógonos que trae su empaque; la tienda no los calcula.
_Avoid_: Sello, etiqueta, advertencia

**Stock** (`stock`):
Unidades disponibles de una Variante. Una Variante sin stock no se puede comprar.
_Avoid_: Inventario, existencias

## Personas

**Cliente** (`Customer`):
Persona registrada, con email verificado (por Google o por confirmación de correo) y teléfono de contacto, que hace Pedidos. Registrarse es obligatorio para pagar, no para navegar.
_Avoid_: Usuario, comprador, invitado

**Administrador** (`Admin`):
La persona que gestiona el catálogo, las Zonas de envío y los Pedidos. Hay un solo rol de administración.
_Avoid_: Vendedor, staff

## Venta y entrega

**Carrito** (`Cart`):
Selección de Variantes y cantidades que aún no es un Pedido. Puede existir sin Cliente y pasa a su cuenta al registrarse o iniciar sesión.
_Avoid_: Cesta, bolsa

**Pedido mínimo** (`minimumOrderAmount`):
Importe mínimo de las Variantes de un Carrito, sin contar el envío, para poder pagar. Lo fija el Administrador y es igual para todos los medios de pago.
_Avoid_: Compra mínima, monto mínimo

**Pedido** (`Order`):
Una compra de un Cliente: una o más Variantes con cantidades, una Dirección y un pago online. Conserva los precios y la tarifa de envío tal como estaban al pagar.
_Avoid_: Orden, compra

**Estado del Pedido** (`OrderStatus`):
Etapa del ciclo de vida de un Pedido: Pendiente de pago → Pagado → En preparación → En camino → Entregado, o Cancelado. Un Pedido es Pagado solo cuando la pasarela lo confirma a nuestro servidor, nunca por lo que diga el navegador del Cliente.
_Avoid_: Situación, fase

**Medio de pago** (`PaymentMethod`):
Forma en que el Cliente paga un Pedido: tarjeta, Yape con código de aprobación, o QR de billeteras (Yape o Plin).
_Avoid_: Método de pago, forma de pago

**Reembolso** (`Refund`):
Devolución del importe total de un Pedido Cancelado. Se hace por la pasarela cuando el Medio de pago lo permite; si no, el Administrador lo devuelve por fuera y lo registra como Reembolso manual.
_Avoid_: Devolución, extorno

**Zona de envío** (`ShippingZone`):
Grupo de distritos donde la tienda entrega a domicilio, con una tarifa de envío fija. No se entrega fuera de una Zona de envío.
_Avoid_: Área de cobertura, región

**Dirección** (`Address`):
Lugar de entrega guardado por un Cliente: departamento, provincia y Distrito, dirección y una referencia obligatoria. Un Cliente puede tener varias. El Pedido conserva una copia de la Dirección tal como estaba al pagar.
_Avoid_: Domicilio, ubicación

**Distrito** (`District`):
Distrito político peruano de la dirección de entrega. Determina a qué Zona de envío pertenece un Pedido.
_Avoid_: Barrio, zona, sector

## Atención al consumidor

**Libro de Reclamaciones** (`ComplaintBook`):
Registro legal, obligatorio y público de las Hojas de reclamación que recibe la tienda.
_Avoid_: Buzón de quejas, soporte

**Hoja de reclamación** (`Complaint`):
Una entrada numerada del Libro de Reclamaciones, de tipo reclamo (sobre el producto o servicio) o queja (sobre la atención). Cualquier persona puede presentarla, sea Cliente o no, y debe responderse en 15 días hábiles.
_Avoid_: Ticket, incidencia, reclamo (como nombre de la entrada)
