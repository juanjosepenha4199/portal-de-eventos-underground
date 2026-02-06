/**
 * Cliente para Nequi Conecta (API oficial).
 * Autenticación: POST /token con OAuth 2.0 client_credentials.
 * Documentación: https://docs.conecta.nequi.com.co/
 *
 * Variables de entorno necesarias:
 * - NEQUI_CLIENT_ID
 * - NEQUI_CLIENT_SECRET
 * - NEQUI_TOKEN_URL (ej. https://api.conecta.nequi.com.co/token — ver doc actual)
 */

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function getTokenUrl(): string {
  const url = process.env.NEQUI_TOKEN_URL || process.env.NEQUI_API_BASE_URL;
  if (url) return url.endsWith("/token") ? url : `${url.replace(/\/$/, "")}/token`;
  return "";
}

export type NequiTokenResponse = {
  access_token: string;
  expires_in: number; // segundos, ej. 3600
  token_type: string; // "Bearer"
};

/**
 * Obtiene el token de acceso para las APIs de Nequi Conecta.
 * Parámetros según la documentación:
 * - grant_type: "client_credentials" (query)
 * - Authorization: "Basic " + base64(client_id:client_secret) (header)
 * - Content-Type: "application/x-www-form-urlencoded" (header)
 */
export async function getNequiToken(): Promise<string | null> {
  const clientId = process.env.NEQUI_CLIENT_ID;
  const clientSecret = process.env.NEQUI_CLIENT_SECRET;
  const tokenUrl = getTokenUrl();

  if (!clientId || !clientSecret || !tokenUrl) {
    console.warn("Nequi Conecta: faltan NEQUI_CLIENT_ID, NEQUI_CLIENT_SECRET o NEQUI_TOKEN_URL");
    return null;
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${tokenUrl}?grant_type=client_credentials`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
  });

  const data = (await res.json().catch(() => ({}))) as NequiTokenResponse & { error?: string };

  if (!res.ok) {
    console.error("Nequi Conecta token error:", res.status, data);
    return null;
  }

  if (!data.access_token) {
    console.error("Nequi Conecta: respuesta sin access_token", data);
    return null;
  }

  const expiresIn = typeof data.expires_in === "string" ? parseInt(data.expires_in, 10) : (data.expires_in ?? 3600);
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return cachedToken.accessToken;
}

/**
 * Ejemplo: llamar un endpoint de Nequi Conecta con el Bearer token.
 * Sustituye NEQUI_API_BASE_URL por la URL base que te den en la documentación.
 */
export async function nequiApiGet<T>(path: string): Promise<T | null> {
  const token = await getNequiToken();
  const baseUrl = process.env.NEQUI_API_BASE_URL || process.env.NEQUI_TOKEN_URL?.replace(/\/token$/, "") || "";
  if (!token || !baseUrl) return null;

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}
