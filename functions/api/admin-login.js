async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const password = String(body?.password ?? "").trim();

    if (!env.ADMIN_PASSWORD) {
      return Response.json(
        { error: "ADMIN_PASSWORD não configurada no ambiente de produção." },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" }
        }
      );
    }

    const configuredPassword = String(env.ADMIN_PASSWORD).trim();

    if (password !== configuredPassword) {
      return Response.json(
        { erro
