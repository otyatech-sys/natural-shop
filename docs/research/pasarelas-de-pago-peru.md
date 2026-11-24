# Pasarelas de pago en Perú con tarjeta + Yape (y Plin)

Investigado el 2026-11-23 con fuentes primarias. "No confirmado" = no hallado en fuente oficial. Decisión resultante: [ADR 0002](../adr/0002-mercado-pago-como-pasarela.md).

## Resumen

| | Tarjeta | Yape | Plin | Comisión publicada | Mensualidad | SDK Node oficial |
|---|---|---|---|---|---|---|
| **Culqi** (BCP) | Sí | Sí (código de aprobación) | Sí (QR billeteras / PagoEfectivo) | 3.44% + US$0.20, inafecto a IGV | No | No (API REST) |
| **Mercado Pago** | Sí | Sí (OTP Yape) | No | 3.49% + S/1.00 (+IGV) al instante; 3.29% + S/1.00 a 14 días | No | Sí (`mercadopago`) |
| **Izipay** | Sí | Solo si ventas > S/200,000/mes | Igual que Yape | 3.44% + IGV + S/0.69 + IGV | S/0 | No confirmado |
| **Niubiz** | Sí | Sí (si se habilita) | Sí | No publicada | No confirmado | No confirmado |
| PayU Perú | Sí | No confirmado | No confirmado | No confirmado | — | — |

## Culqi

- Medios: tarjetas, Yape, PagoEfectivo, billeteras QR (Yape/Plin), Cuotéalo. https://docs.culqi.com/es/documentacion/
- Yape: celular + código de aprobación (vigencia máx. 2 min), máx. S/2000, solo PEN. Vía Culqi Checkout (token en frontend, cargo en servidor con llave privada) o "full code" (exige PCI DSS SAQ-D). https://docs.culqi.com/es/documentacion/pagos-online/cargo-unico/tokens-yape
- QR billeteras (Yape/Plin): orden + QR, rango S/6–500, confirmación por webhook `order.status.changed`. https://docs.culqi.com/es/documentacion/pagos-online/ordenes-de-pago/billetera-moviles
- Sin SDK Node oficial (sí PHP, Java, Python, .NET, Go, Rust); `culqi-node` es comunitario.
- Webhooks por categorías desde CulqiPanel. Firma y reintentos: no confirmado. https://docs.culqi.com/es/documentacion/pagos-online/webhooks
- Devoluciones parciales/totales gratis por API y panel; después del día de venta se descuenta la comisión. Aplicación a Yape/QR: no confirmado. https://docs.culqi.com/es/documentacion/pagos-online/operaciones/devoluciones
- Comisiones (https://culqi.com/tarifas/, https://culqi.com/productos/online-pasarela-de-pagos/): tarjeta nacional 3.44%, internacional 3.99%, Yape 3.44%, PagoEfectivo/Cuotéalo 3.99%*, + US$0.20 fijo; inafectas a IGV; sin afiliación ni mantenimiento; abono en 2 días hábiles. Tarifas referenciales (T&C Anexo 7: https://culqi.com/static/files/terminos_y_condiciones_culqi_web.pdf).
- **Comisión mínima de S/3.50 para montos < S/87.72 ("sujeto a evaluación")**: a qué medios aplica, no confirmado.
- T&C cláusula 12.17: prohíbe exigir monto mínimo por transacción o recargar según medio de pago.
- Afiliación: persona natural o jurídica con actividad comercial; si basta DNI sin RUC, no confirmado. https://afiliate.culqi.com/culqionline/afiliacion
- Sandbox: entorno "Integración" con llaves y tarjetas de prueba. https://docs.culqi.com/es/documentacion/pagos-online/integracion-vs-produccion

## Mercado Pago Perú

- Medios: tarjetas, Yape, PagoEfectivo, PayCash, en Checkout Pro (redirect) y Checkout API. Plin no aparece. https://www.mercadopago.com.pe/herramientas-para-vender/check-out
- Yape: celular + OTP → token (`mp.yape({otp, phoneNumber}).create()`), pago con `payment_method_id: "yape"` o Orders API `/v1/orders`. Límite S/500/900/2000 según el usuario. Respuesta síncrona. https://www.mercadopago.com.pe/developers/es/docs/checkout-api/integration-configuration/yape
- SDK Node oficial `mercadopago` (github.com/mercadopago/sdk-nodejs, v3.6.2 del 2026-11-11).
- Webhooks con firma HMAC (`x-signature`). https://www.mercadopago.com.pe/developers/en/docs/checkout-api-orders/notifications.md
- Reembolsos totales y parciales por API hasta 180 días; requiere saldo. https://www.mercadopago.com.pe/developers/en/docs/checkout-api-orders/payment-management/refunds-cancellations.md
- Comisiones: 3.49% + S/1.00 al instante; 3.29% + S/1.00 a 14 días; sin costos fijos. "+ IGV" explícito en Link de pago; en checkout, no confirmado (muy probable). https://www.mercadopago.com.pe/herramientas-para-vender/link-de-pago
- Afiliación: cuenta personal con DNI; cuenta negocio con RUC y representante legal. https://www.mercadopago.com.pe/signup/splitter. Si una cuenta personal puede usar Checkout en producción: no confirmado.
- Sandbox: usuarios de prueba; Yape de prueba 111111111 / OTP 123456 (approved), 111111112–111111118 (rechazos).

## Izipay (Interbank)

- Tarjeta, QR, Yape con código (máx. S/2000, solo SDK), Plin Interbank (máx. S/5000), Apple Pay. https://developers.izipay.pe/
- **T&C (12-nov-2026, ap. 12.1): Yape/QR/Plin solo para volumen online > S/200,000 mensuales**; por debajo, solo tarjetas. https://www.izipay.pe/pdf/terminos-y-condiciones
- SDK Web (pop-up, embebido, redirect); IPN con firma. https://developers.izipay.pe/web-core/notifications/
- 3.44% + IGV nacional, 4.09% + IGV extranjeras, + S/0.69 + IGV por transacción. Afiliación con DNI, RUC10 o RUC20.

## Niubiz (Visanet)

- Botón de pago web con Yape (si habilitado), Plin, QR. https://desarrolladores.niubiz.com.pe/docs/bot%C3%B3n-de-pago-1
- Flujo: token de seguridad → token de sesión → checkout.js → autorización server-side. Producción requiere afiliación por call center y certificación.
- Webhooks, reembolsos parciales, tarifas: no confirmado.

## Comparativa de costo por ticket

(TC referencial S/3.85.)

| Ticket | Culqi | Culqi con mínimo S/3.50 | Mercado Pago al instante (+IGV) | Izipay tarjeta (+IGV) |
|---|---|---|---|---|
| S/20 | S/1.46 (7.3%) | S/3.50 (17.5%) | S/2.00 (10.0%) | S/1.63 (8.1%) |
| S/50 | S/2.49 (5.0%) | S/3.50 (7.0%) | S/3.24 (6.5%) | S/2.84 (5.7%) |
| S/150 | S/5.93 (4.0%) | — | S/7.36 (4.9%) | S/6.90 (4.6%) |
