export async function onRequestGet({ env }) {
  const settingsRows = await env.DB.prepare('SELECT key,value FROM settings').all();
  const settings = Object.fromEntries(settingsRows.results.map(r => [r.key, r.value]));
  const pizzas = (await env.DB.prepare('SELECT * FROM pizzas WHERE active=1 ORDER BY sort_order,id').all()).results;
  const flavors = (await env.DB.prepare('SELECT * FROM flavors WHERE active=1 ORDER BY category,sort_order,id').all()).results;
  const products = (await env.DB.prepare('SELECT * FROM products WHERE active=1 ORDER BY category,sort_order,id').all()).results;
  const edges = (await env.DB.prepare('SELECT * FROM edges WHERE active=1 ORDER BY pizza_id,id').all()).results;
  return Response.json({ settings, pizzas, flavors, products, edges });
}
