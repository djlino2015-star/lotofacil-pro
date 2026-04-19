export const config = { runtime: 'edge' };
export default async function handler(req) {
  const h = {'Access-Control-Allow-Origin':'*','Content-Type':'application/json'};
  const key = process.env.GROK_API_KEY;
  if (!key) return new Response(JSON.stringify({erro:'sem chave'}),{status:500,headers:h});
  try {
    const r = await fetch('https://api.x.ai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:'grok-3-latest',max_tokens:200,messages:[{role:'user',content:'Resultado mais recente Lotofacil brasileira. Responda APENAS JSON sem texto: {"concurso":3665,"data":"19/04/2026","numeros":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"ganhadores":1}'}]})});
    const d = await r.json();
    const t = (d.choices?.[0]?.message?.content||'').replace(/```json|```/g,'').trim();
    const m = t.match(/\{[\s\S]*\}/);
    if (!m) return new Response(JSON.stringify({erro:'no json',t:t.slice(0,100)}),{status:200,headers:h});
    const res = JSON.parse(m[0]);
    if (Array.isArray(res.numeros)&&res.numeros.length===15){res.numeros=res.numeros.map(Number).sort((a,b)=>a-b);return new Response(JSON.stringify(res),{status:200,headers:h});}
    return new Response(JSON.stringify({erro:'invalido',t:t.slice(0,100)}),{status:200,headers:h});
  } catch(e){return new Response(JSON.stringify({erro:e.message}),{status:500,headers:h});}
}