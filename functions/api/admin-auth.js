async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
}
export async function requireAdmin(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|; )admin_session=([^;]+)/);
  if (!m) return false;
  const parts = m[1].split('.');
  if (parts.length < 3) return false;
  const payload = parts.slice(0,2).join('.');
  const sig = await sign(payload, env.SESSION_SECRET || 'change-me');
  if (sig !== parts[2]) return false;
  const ts = Number(parts[0]);
  return Number.isFinite(ts) && Date.now()-ts < 86400000;
}
