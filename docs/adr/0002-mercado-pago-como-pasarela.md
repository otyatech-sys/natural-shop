# Mercado Pago como pasarela de pago, aislada detrás de un único módulo

Elegimos Mercado Pago (tarjeta + Yape) porque la tienda aún no tiene RUC y Mercado Pago permite operar con DNI; además tiene SDK oficial de Node, webhooks firmados con HMAC y reembolsos por API. Renunciamos a Plin y aceptamos una comisión fija (S/1,00 + IGV) que encarece tickets bajos, mitigada con un pedido mínimo del Carrito. Toda interacción con la pasarela (crear pago, confirmar por webhook, reembolsar) vive en un solo módulo para poder migrar a Culqi cuando exista RUC.

## Considered Options

- **Culqi**: tarjeta + Yape + Plin, comisión sin IGV; descartada por ahora por requisitos de afiliación sin RUC no confirmados y una comisión mínima de S/3,50 de alcance incierto.
- **Izipay**: Yape y Plin solo para comercios con más de S/200 000 de ventas mensuales.
- **Niubiz**: sin tarifas públicas y con certificación obligatoria de la integración.
