async function routeDistance(env, address) {
  if (!env.ORS_API_KEY) throw new Error('Roteamento ainda não configurado.');
  const geoUrl = `https://api.heigit.org/pelias/v1/search?api_key=${encodeURIComponent(env.ORS_API_KEY)}&text=${encodeURIComponent(address)}&size=1`;
  const geo = await fetch(geoUrl, {headers:{'Accept':'application/json'}});
  if (!geo.ok) throw new Error('Não foi possível localizar o endereço.');
  const gj = await geo.json();
  const feat = gj.features?.[0];
  if (!feat) throw new Error('Endereço não encontrado. Confira rua e número.');
  const [lon,lat] = feat.geometry.coordinates;
  const matrix = await fetch('https://api.heigit.org/openrouteservice/v2/directions/driving-car', {method:'POST',headers:{'Authorization':env.ORS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({coordinates:[[Number(env.STORE_LON),Number(env.STORE_LAT)],[lon,lat]],units:'m'})});
  if (!matrix.ok) throw new Error('Não foi possível calcular a rota.');
  const r = await matrix.json();
  const meters = r.routes?.[0]?.summary?.distance;
  if (!Number.isFinite(meters)) throw new Error('Rota não encontrada para esse endereço.');
  return meters;
}
function deliveryFee(m, s) {
  if (m<=300) return Number(s.delivery_0_300);
  if (m<=700) return Number(s.delivery_301_700);
  if (m<=1000) return Number(s.delivery_701_1000);
  if (m<=Number(s.delivery_max_m||1700)) return Number(s.delivery_1001_plus);
  throw new Error('Esse endereço está fora da área de entrega.');
}
async function getSettings(env){ return Object.fromEntries((await env.DB.prepare('SELECT key,value FROM settings').all()).results.map(r=>[r.key,r.value])); }
export async function onRequestPost({request,env}){
  const body=await request.json();
  const s=await getSettings(env);
  if(s.store_open!=='1') return Response.json({error:'A pizzaria está fechada no momento.'},{status:400});
  if(!body.customer_name || !body.phone || !body.items?.length || !['PIX','CARD','CASH'].includes(body.payment_method)) return Response.json({error:'Preencha todos os campos obrigatórios.'},{status:400});
  let distance=0, fee=0;
  if(body.fulfillment==='DELIVERY'){
    if(!body.street || !body.number) return Response.json({error:'Informe rua e número.'},{status:400});
    distance=await routeDistance(env, `${body.street}, ${body.number}, Candeal, Bahia, Brasil`);
    fee=deliveryFee(distance,s);
  }
  // Recalcula os valores no servidor usando o banco.
  let subtotal=0; const items=[];
  for(const item of body.items){
    if(item.type==='PIZZA'){
      const p=await env.DB.prepare('SELECT * FROM pizzas WHERE id=? AND active=1').bind(item.pizza_id).first();
      if(!p) throw new Error('Tamanho de pizza inválido.');
      const max=p.name==='Pequena'?1:2;
      const flavorIds=[...new Set(item.flavor_ids||[])];
      if(flavorIds.length<1 || flavorIds.length>max) throw new Error(`A pizza ${p.name} permite ${max===1?'1':'até 2'} sabor(es).`);
      const placeholders=flavorIds.map(()=>'?').join(',');
      const fs=(await env.DB.prepare(`SELECT * FROM flavors WHERE id IN (${placeholders}) AND active=1 AND available=1`).bind(...flavorIds).all()).results;
      if(fs.length!==flavorIds.length) throw new Error('Um dos sabores está indisponível.');
      let total=Number(p.base_price)+fs.reduce((a,f)=>a+Number(f.extra_price),0);
      let details=fs.map(f=>f.name).join(' / ');
      if(item.edge_id){ const e=await env.DB.prepare('SELECT * FROM edges WHERE id=? AND pizza_id=? AND active=1').bind(item.edge_id,p.id).first(); if(!e) throw new Error('Borda inválida.'); total+=Number(e.extra_price); details+=` | Borda ${e.name}`; }
      subtotal+=total; items.push({type:'PIZZA',name:p.name,details,unit_price:total,total_price:total});
    } else if(item.type==='PRODUCT'){
      const pr=await env.DB.prepare('SELECT * FROM products WHERE id=? AND active=1 AND available=1').bind(item.product_id).first();
      if(!pr) throw new Error('Produto indisponível.');
      const qty=Math.max(1,Math.min(20,Number(item.quantity)||1)); const total=Number(pr.price)*qty; subtotal+=total; items.push({type:'PRODUCT',name:pr.name,details:'',quantity:qty,unit_price:Number(pr.price),total_price:total});
    }
  }
  const total=subtotal+fee;
  let cashAmount=null,change=null;
  if(body.payment_method==='CASH'){
    cashAmount=Number(body.cash_amount); if(!Number.isFinite(cashAmount)||cashAmount<total) return Response.json({error:`Para dinheiro, informe um valor igual ou maior que R$ ${total.toFixed(2).replace('.',',')}.`},{status:400});
    change=cashAmount-total;
  }
  const status=body.payment_method==='CASH'?'CONFIRMED':'PENDING_PAYMENT';
  const ins=await env.DB.prepare(`INSERT INTO orders(customer_name,phone,fulfillment,street,number,reference,distance_m,delivery_fee,subtotal,total,payment_method,cash_amount,change_amount,notes,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(body.customer_name,body.phone,body.fulfillment,body.street||null,body.number||null,body.reference||null,distance,fee,subtotal,total,body.payment_method,cashAmount,change,body.notes||'',status).run();
  const orderId=ins.meta.last_row_id;
  for(const it of items) await env.DB.prepare('INSERT INTO order_items(order_id,item_type,item_name,details,quantity,unit_price,total_price) VALUES(?,?,?,?,?,?,?)').bind(orderId,it.type,it.name,it.details,it.quantity||1,it.unit_price,it.total_price).run();
  let checkoutUrl=null;
  if(body.payment_method==='PIX'||body.payment_method==='CARD'){
    if(!env.MP_ACCESS_TOKEN) return Response.json({error:'Mercado Pago ainda não foi configurado.'},{status:503});
    const pref=await fetch('https://api.mercadopago.com/checkout/preferences',{method:'POST',headers:{Authorization:`Bearer ${env.MP_ACCESS_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({items:[{title:`Pedido Pizza no Forninho #${orderId}`,quantity:1,currency_id:'BRL',unit_price:total}],external_reference:String(orderId),back_urls:{success:`${env.PUBLIC_BASE_URL}/pedido/${orderId}?status=success`,failure:`${env.PUBLIC_BASE_URL}/pedido/${orderId}?status=failure`,pending:`${env.PUBLIC_BASE_URL}/pedido/${orderId}?status=pending`},auto_return:'approved',notification_url:`${env.PUBLIC_BASE_URL}/api/mp-webhook`})});
    if(!pref.ok){ const txt=await pref.text(); throw new Error(`Mercado Pago recusou a preferência: ${txt.slice(0,200)}`); }
    const pj=await pref.json(); checkoutUrl=pj.init_point; await env.DB.prepare('UPDATE orders SET mp_preference_id=? WHERE id=?').bind(pj.id,orderId).run();
  }
  return Response.json({ok:true,order_id:orderId,total,distance_m:distance,delivery_fee:fee,change,checkout_url:checkoutUrl,whatsapp:`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Pedido #${orderId} criado na Pizza no Forninho. ${body.customer_name}`)}`});
}
