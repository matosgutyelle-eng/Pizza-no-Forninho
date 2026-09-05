import { requireAdmin } from './admin-auth.js';
export async function onRequestPost({ request, env }) {
  if (!await requireAdmin(request, env)) return Response.json({error:'Não autorizado'}, {status:401});
  const body = await request.json();
  for (const [key,value] of Object.entries(body)) {
    await env.DB.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,String(value)).run();
  }
  return Response.json({ok:true});
}
