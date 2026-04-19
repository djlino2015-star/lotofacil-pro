export const config = { runtime: 'edge' };

export default async function handler(req) {
  const h = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const key = process.env.GROK_API_KEY;
  if (!key) return new Response(JSON.stringify({erro:'sem chave'}), {status:500, headers:h});

  // Modelos disponíveis em 2026 na xAI API
  const models = ['grok-3', 'grok-3-mini', 'grok-2', 'grok-2-mini'];
  let lastError = '';

  for (const model of models) {
    try {
      const r = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 150,
          temperature: 0,
          messages: [{
            role: 'user',
            content: 'What is the latest Lotofacil Brazil lottery result? Reply with ONLY valid JSON, no other text: {"concurso":3665,"data":"19/04/2026","numeros":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"ganhadores":1}'
          }]
        })
      });

      const d = await r.json();

      if (!r.ok) {
        lastError = `${model}: ${r.status} - ${JSON.stringify(d).slice(0,100)}`;
        continue;
      }

      const t = (d.choices?.[0]?.message?.content || '').replace(/```json|```/g,'').trim();
      if (!t) { lastError = `${model}: empty`; continue; }

      const m = t.match(/\{[\s\S]*\}/);
      if (!m) { lastError = `${model}: no json - ${t.slice(0,100)}`; continue; }

      const res = JSON.parse(m[0]);
      if (Array.isArray(res.numeros) && res.numeros.length === 15) {
        res.numeros = res.numeros.map(Number).sort((a,b) => a-b);
        res.concurso = parseInt(res.concurso);
        res.modelo = model;
        return new Response(JSON.stringify(res), {status:200, headers:h});
      }
      lastError = `${model}: numeros invalidos`;

    } catch(e) {
      lastError = `${model}: ${e.message}`;
    }
  }

  return new Response(JSON.stringify({erro:'falhou', detalhe: lastError}), {status:200, headers:h});
}