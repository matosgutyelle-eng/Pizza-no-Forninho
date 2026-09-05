export async function onRequestPost({request,env}){
  try{
    const body=await request.json();
    const paymentId=body.data?.id || body.id;
    if(!paymentId) return new Response('ok');
    if(!env.MP_ACCESS_TOKEN) return new Response('ok');
    const r=await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`,{headers:{Authorization:`Bearer ${env.MP_ACCESS_TOKEN}`}});
    if(!r.ok) return new Response('ok');
    const p=await r.json(); const orderId=Number(p.external_reference);
    if(!orderId) return new Response('ok');
    let status='PENDING_PAYMENT';
    if(p.status==='approved') status='CONFIRMED'; else if(['cancelled','rejected'].includes(p.status)) status='CANCELLED'; else if(p.status==='refunded' || p.status==='charged_back') status='CANCELLED';
    await env.DB.prepare('UPDATE orders SET status=?,mp_payment_id=? WHERE id=?').bind(status,String(paymentId),orderId).run();
    return new Response('ok');
  }catch(e){ return new Response('ok'); }
}
