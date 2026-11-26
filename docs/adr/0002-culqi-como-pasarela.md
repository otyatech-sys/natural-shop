# Culqi como pasarela de pago, aislada detrás de un único módulo

Elegimos Culqi porque es la única pasarela grande que da tarjeta, Yape y Plin a un comercio pequeño, sin mensualidad y con comisión inafecta a IGV (3,44 % + US$0,20 publicada). Se integra con Culqi Checkout (ventana emergente que genera un token en el navegador; nuestro servidor crea el cargo con la llave privada) y, para el QR de billeteras, con órdenes de pago confirmadas por webhook. Como Culqi no tiene SDK oficial para Node ni documenta la verificación de firma de sus webhooks, toda interacción con la pasarela (crear cargo u orden, confirmar, reembolsar) vive en un solo módulo hecho con su API REST, y el servidor vuelve a consultar cada orden a Culqi antes de aceptar un webhook. Ese módulo permite cambiar a Mercado Pago si la afiliación sin RUC no prospera.

## Considered Options

- **Mercado Pago (Checkout Pro)**: alta con DNI, SDK oficial y webhooks firmados con HMAC; descartado por no aceptar Plin y por la comisión fija de S/1,00 + IGV, que encarece los tickets bajos. Queda como plan B.
- **Izipay**: Yape y Plin solo para comercios con más de S/200 000 de ventas mensuales.
- **Niubiz**: sin tarifas públicas y con certificación obligatoria de la integración.
- **Culqi "full code" (API sin Checkout)**: exige PCI DSS SAQ-D.

## Consequences

- Tarjeta y Yape con código se confirman en la respuesta síncrona del cargo que crea nuestro servidor; el QR de billeteras (S/ 6–500), por webhook más reconsulta de la orden.
- Pendientes de confirmar con Culqi antes del lanzamiento: requisitos de afiliación sin RUC, a qué medios se aplica la comisión mínima de S/ 3,50 y si un Pedido mínimo general es compatible con la cláusula 12.17 del contrato.
- Si la API no permite reembolsar un Medio de pago (Yape, QR), el Reembolso se registra como manual.
