async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(value)
  );

  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const password = String(body?.password ?? '').trim();
    const configuredPassword = String(env.ADMIN_PASSWORD ?? '').trim();

    if (!configuredPassword) {
      return Response.json(
        { error: 'ADMIN_PASSWORD não está disponível no ambiente da função.' },
        { status: 500 }
      );
    }

    if (!password || password !== configuredPassword) {
      return Response.json({ error: 'Senha inválida' }, { status: 401 });
    }

    const payload = `${Date.now()}.${crypto.randomUUID()}`;
    const secret = String(env.SESSION_SECRET ?? 'change-me');
    const sig = await sign(payload, secret);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store',
        'Set-Cookie': `admin_session=${payload}.${sig}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
      }
    });
  } catch (error) {
    return Response.json(
      { error: 'Não foi possível processar o login.' },
      { status: 400 }
    );
  }
}
