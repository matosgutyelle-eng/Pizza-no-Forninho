import { requireAdmin } from './admin-auth.js';
export async function onRequestGet({ request, env }) {
  if (!await requireAdmin(request, env)) return Response.json({error:'Não autorizado'}, {status:401});
  const settings = Object.fromEntries((await env.DB.prepare('SELECT key,value FROM settings').all()).results.map(r=>[r.key,r.value]));
  const orders = (await env.DB.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 100').all()).results;
  return Response.json({settings, orders});
}
