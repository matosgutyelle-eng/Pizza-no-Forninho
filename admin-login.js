async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
}
export async function onRequestPost({ request, env }) {
  const { password } = await request.json();
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) return Response.json({error:'Senha inválida'}, {status:401});
  const payload = `${Date.now()}.${crypto.randomUUID()}`;
  const sig = await sign(payload, env.SESSION_SECRET || 'change-me');
  return new Response(JSON.stringify({ok:true}), {headers:{'Content-Type':'application/json','Set-Cookie':`admin_session=${payload}.${sig}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`}});
}
