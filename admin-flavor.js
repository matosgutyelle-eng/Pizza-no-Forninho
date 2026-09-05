import { requireAdmin } from './admin-auth.js';
export async function onRequestPost({ request, env }) {
  if (!await requireAdmin(request, env)) return Response.json({error:'Não autorizado'}, {status:401});
  const b = await request.json();
  if (b.action==='delete') await env.DB.prepare('UPDATE flavors SET active=0 WHERE id=?').bind(b.id).run();
  else if (b.action==='toggle') await env.DB.prepare('UPDATE flavors SET available=? WHERE id=?').bind(b.available?1:0,b.id).run();
  else if (b.action==='upsert') {
    if (b.id) await env.DB.prepare('UPDATE flavors SET name=?,category=?,extra_price=?,description=?,image_url=?,available=? WHERE id=?').bind(b.name,b.category,Number(b.extra_price)||0,b.description||'',b.image_url||'',b.available?1:0,b.id).run();
    else await env.DB.prepare('INSERT INTO flavors(name,category,extra_price,description,image_url,available) VALUES(?,?,?,?,?,?)').bind(b.name,b.category,Number(b.extra_price)||0,b.description||'',b.image_url||'',b.available?1:0).run();
  }
  return Response.json({ok:true});
}
