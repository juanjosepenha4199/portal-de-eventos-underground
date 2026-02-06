# Cómo conectar pagos reales con Nequi

Tienes **dos caminos** para aceptar pagos con Nequi en Colombia: la **API oficial (Nequi Conecta)** o una **pasarela que ya integra Nequi** (por ejemplo EBANX).

---

## Token de Nequi Conecta (POST /token)

En la documentación de Nequi Conecta verás el endpoint **POST /token** para obtener el token de autenticación. Así se usa en este proyecto.

### Parámetros que pide la documentación

| Parámetro      | Dónde      | Valor / Cómo generarlo |
|----------------|------------|--------------------------|
| **grant_type** | Query      | `client_credentials`     |
| **Authorization** | Header | `Basic` + credenciales en Base64. Debe generarse como: `Basic ${base64(client_id:client_secret)}`. |
| **Content-Type**  | Header | `application/x-www-form-urlencoded` |

Es decir:

1. En el portal de Nequi Conecta obtienes **Client ID** y **Client Secret**.
2. Construyes la cadena `client_id:client_secret` y la codificas en **Base64**.
3. Envías un **POST** al endpoint `/token` con:
   - Query: `grant_type=client_credentials`
   - Header: `Authorization: Basic <tu_base64>`
   - Header: `Content-Type: application/x-www-form-urlencoded`

### Respuesta correcta (200)

```json
{
  "access_token": "eyJ...",
  "expires_in": "3600",
  "token_type": "Bearer"
}
```

Ese `access_token` es el que usas en el resto de las APIs de Nequi Conecta, en el header:  
`Authorization: Bearer <access_token>`.

### Si recibes 403

El mensaje **"Access Key, Secret Key o API Key invalidos"** indica que:

- El **Client ID** o **Client Secret** son incorrectos, o
- Estás usando credenciales de otro ambiente (pruebas vs producción), o
- La URL del token no es la correcta para tu ambiente.

Revisa en [conecta.nequi.com.co](https://conecta.nequi.com.co) que estés usando las credenciales y la URL que te asignaron (pruebas o producción).

### Uso en este proyecto

En el código hay un cliente que hace ese **POST /token** por ti. Solo tienes que configurar las variables de entorno (ver más abajo en “Opción 1: Nequi Conecta”).

---

## Opción 1: Nequi Conecta (oficial)

Es la integración directa con Nequi/Bancolombia. Da acceso a QR, push, etc., pero exige registro y certificación.

### Pasos

1. **Entra al portal de desarrolladores**  
   - [Nequi Conecta](https://conecta.nequi.com.co/)  
   - Documentación: [docs.conecta.nequi.com.co](https://docs.conecta.nequi.com.co/)

2. **Registro y acceso**  
   - Creas cuenta en Nequi Conecta.  
   - Solicitas acceso a **pruebas** (suelen responder en 1 día hábil).  
   - Creas **API Keys** en el portal (Access Key ID, Secret Key, API Key).  
   - Para probar en dispositivo: descargan la [app de pruebas Android](https://s3.amazonaws.com/app-devs/nequi-0.0.1.apk) (solo Android, no compatible con la app de Play Store).

3. **Autenticación**  
   - Hoy las APIs usan **AWS Signature Version 4** y **API Key**.  
   - En las peticiones suelen usar:  
     - `Content-Type: application/json`  
     - `x-api-key`  
     - Firma tipo AWS-Sv4.  
   - Nequi está migrando a **OAuth 2.0**; cuando esté activo, la documentación indicará cómo obtener y usar el token.

4. **APIs útiles para pagos**  
   - **Generar código QR**: para que el usuario escanee y pague.  
   - **Pagos con notificación Push**: el usuario recibe una notificación en la app para aprobar el pago.  
   - **Consulta de estado**: para saber si el pago fue aprobado o falló.

5. **Certificación para producción**  
   - Envío de casos de prueba (por ejemplo en JSON) y evidencia de UX.  
   - Contacto: `certificacion@conecta.nequi.com`.  
   - Tras aprobar, te dan credenciales de producción y soporte por un tiempo.

6. **Ambientes**  
   - Pruebas: `https://api.sandbox.nequi.com/...`  
   - Producción: según lo indique Nequi en la documentación.

**Resumen**: Nequi Conecta es la opción “oficial” y más completa, pero implica proceso de certificación y mantener la integración con su autenticación (hoy AWS-Sv4, luego OAuth 2.0).

### Variables de entorno para Nequi Conecta (token)

En este proyecto el archivo **`lib/nequi-conecta.ts`** ya implementa el **POST /token** que ves en la documentación. Configura en `.env`:

- `NEQUI_CLIENT_ID` y `NEQUI_CLIENT_SECRET` (los que te dan en Conecta).
- `NEQUI_TOKEN_URL`: URL completa del endpoint POST /token que aparezca en tu documentación (puede ser distinta en pruebas y producción).

Opcional: `NEQUI_API_BASE_URL` para el resto de APIs (p. ej. pagos con QR). La URL exacta la verás en la doc cuando tengas acceso.

---

## Opción 2: EBANX (pasarela que soporta Nequi)

EBANX permite aceptar Nequi sin certificarte directamente con Nequi: te registras en EBANX y usas su API.

### Pasos

1. **Darte de alta en EBANX**  
   - [Merchant Signup / contacto](https://www.ebanx.com/en/contact/).  
   - Te asignan un **integration key** (sandbox y producción).

2. **Crear un pago Nequi**  
   - Endpoint: `POST https://sandbox.ebanx.com/ws/direct` (pruebas) o `https://api.ebanx.com/ws/direct` (producción).  
   - Body de ejemplo:

   ```json
   {
     "integration_key": "TU_INTEGRATION_KEY",
     "payment": {
       "payment_type_code": "nequi",
       "country": "co",
       "amount_total": 25000.00,
       "currency_code": "COP",
       "merchant_payment_code": "orden-unica-123",
       "name": "Nombre del cliente",
       "email": "cliente@ejemplo.com",
       "phone_number": "3100000000",
       "redirect_url": "https://tudominio.com/cart/gracias"
     }
   }
   ```

3. **Respuesta**  
   - Recibes `status: "PE"` (pendiente), `redirect_url` y `qr_code_value`.  
   - **Opciones:**  
     - Redirigir al usuario a `redirect_url` (página de EBANX con QR e instrucciones).  
     - O mostrar en tu propia página el QR usando `qr_code_value` (generando la imagen QR en backend o frontend).

4. **Completar el pago**  
   - El usuario escanea el QR con la app Nequi o recibe un push (si dio teléfono).  
   - EBANX envía **notificaciones** cuando el estado cambia (pendiente → confirmado o cancelado).

5. **Webhook / estado**  
   - Debes exponer una URL que reciba las notificaciones de EBANX (igual que con Stripe).  
   - Cuando el pago pase a **confirmado (CO)**, crear las entradas (tickets) en tu base de datos y, si aplica, vaciar el carrito.

**Documentación EBANX**:  
- [Guía Nequi en EBANX](https://docs.ebanx.com/docs/payments/guides/accept-payments/api/colombia/nequi/)  
- [Direct API reference](https://docs.ebanx.com/api)

---

## Cómo encajarlo en este proyecto

En el código ya tienes:

- **Carrito** con ítems y total en COP.  
- **Checkout** con dos métodos: “Stripe” y “Nequi” (hoy Nequi está simulado).

Para **Nequi real** puedes hacer una de estas dos cosas:

### A) Usar EBANX como backend de “Pagar con Nequi”

1. Añadir variables de entorno, por ejemplo:  
   `EBANX_INTEGRATION_KEY`, `EBANX_MODE=sandbox|production`.
2. Crear una ruta (por ejemplo `POST /api/checkout/nequi`) que:  
   - Reciba los ítems del carrito y el usuario.  
   - Llame a `POST .../ws/direct` de EBANX con `payment_type_code: "nequi"`, `amount_total` en COP, `merchant_payment_code` único (por ejemplo `cart-{userId}-{timestamp}`).  
   - Guarde en BD una “orden” o “sesión de pago” asociada a ese `merchant_payment_code` y a los `eventId` del carrito.  
   - Devuelva al front `redirect_url` y/o `qr_code_value`.
3. En el front, al elegir “Pagar con Nequi”:  
   - Llamar a esa API.  
   - O redirigir a `redirect_url`, o mostrar una página “Escanea el QR con Nequi” usando `qr_code_value`.
4. Crear una ruta **webhook** que EBANX llame cuando el pago cambie de estado.  
   - Cuando el estado sea “CO” (confirmado), buscar la orden por `merchant_payment_code`, crear los `Ticket` correspondientes y marcar la orden como pagada.

### B) Usar Nequi Conecta (API oficial)

1. Obtener credenciales y acceso en [conecta.nequi.com.co](https://conecta.nequi.com.co/).  
2. Implementar en el backend:  
   - Autenticación (AWS-Sv4 o OAuth 2.0 cuando esté disponible).  
   - Llamada al servicio de Nequi para “Generar código QR” (o Push) con el monto en COP y un ID de transacción tuyo.  
3. Mostrar en el front el QR (o la pantalla de “Te enviamos un push a Nequi”).  
4. Consultar estado del pago (polling o webhook si Nequi lo ofrece) y, al confirmar, crear los tickets igual que en (A).

---

## Resumen rápido

| Criterio              | Nequi Conecta (oficial) | EBANX (pasarela)     |
|-----------------------|--------------------------|----------------------|
| Registro              | Nequi Conecta + certificación | EBANX (merchant signup) |
| Integración técnica   | Más trabajo (firma AWS / OAuth) | API REST estándar   |
| QR / Push             | Sí (según doc)           | Sí vía EBANX         |
| Moneda                | COP                      | COP (y USD si aplica)|
| Producción            | Tras certificación       | Tras alta en EBANX   |

Recomendación práctica: si quieres **conectar Nequi rápido**, usa **EBANX** y sustituye la “simulación” de Nequi por la llamada a su API y el webhook. Si necesitas la integración **directa con Nequi** (por contrato o requisitos del negocio), sigue **Nequi Conecta** y la documentación en [docs.conecta.nequi.com.co](https://docs.conecta.nequi.com.co/).

---

## Conexión EBANX ya preparada en este proyecto

El código ya está preparado para usar **EBANX** en cuanto tengas la clave.

### 1. Variables de entorno

En tu `.env`:

```env
EBANX_INTEGRATION_KEY=tu_integration_key_de_ebanx
EBANX_MODE=sandbox
```

- **Sandbox**: pruebas con [datos de prueba de EBANX](https://docs.ebanx.com/docs/resources/sandbox-simulation/test-customer-data).
- **Producción**: cuando EBANX te dé la key de producción, pon `EBANX_MODE=production`.

### 2. Flujo actual

- Al elegir **“Pagar con Nequi”** en el carrito, si `EBANX_INTEGRATION_KEY` está definida:
  - Se crea un pago Nequi en EBANX.
  - Se guarda un registro en `PendingNequiPayment` (código de pago, usuario, ítems).
  - Se devuelve `redirectUrl`: el usuario es redirigido a la página de EBANX para escanear el QR con Nequi (o recibir el push).
- Si **no** está definida la key, se usa la simulación actual (entradas creadas al instante).

### 3. Webhook EBANX

Cuando el usuario paga (o cancela), EBANX envía una notificación a tu servidor.

1. En el **Dashboard EBANX** → Account Settings → Integrations → **Notification URL** configura:
   - `https://tudominio.com/api/webhooks/ebanx`
2. Esa ruta (`app/api/webhooks/ebanx/route.ts`) recibe el aviso, consulta el pago con `/ws/query` y, si el estado es **CO (confirmado)**, crea las entradas y borra el pago pendiente.

En local no puedes recibir webhooks de EBANX; necesitas un túnel (ngrok, etc.) o desplegar en un servidor con URL pública.

### 4. Resumen de archivos

| Archivo | Uso |
|--------|-----|
| `lib/ebanx.ts` | Cliente para crear pagos Nequi vía EBANX `/ws/direct`. |
| `app/api/checkout/route.ts` | Si existe `EBANX_INTEGRATION_KEY`, crea pago real y devuelve `redirectUrl`. |
| `app/api/webhooks/ebanx/route.ts` | Recibe notificación, consulta estado y crea tickets si está confirmado. |
| `docs/INTEGRACION_NEQUI.md` | Esta guía. |
