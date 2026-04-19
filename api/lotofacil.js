export const config = { runtime: 'edge' };

export default async function handler(req) {
  const h = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const key = process.env.GROK_API_KEY;
  if (!key) return new Response(JSON.stringify({erro:'sem chave'}), {status:500, headers:h});

  try {
    // Tenta grok-2 e grok-beta como fallback
    const models = ['grok-2-latest', 'grok-beta', 'grok-2-1212'];
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
            max_tokens: 200,
            messages: [{
              role: 'user',
              content: 'What is the most recent Lotofacil (Brazilian lottery) result? Give me ONLY a JSON response with no other text: {"concurso":3665,"data":"19/04/2026","numeros":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"ganhadores":1} - replace with real current numbers in ascending order.'
            }]
          })
        });

        if (!r.ok) {
          lastError = `${model}: HTTP ${r.status}`;
          continue;
        }

        const d = await r.json();
        const t = (d.choices?.[0]?.message?.content || '').replace(/```json|```/g,'').trim();
        
        if (!t) {
          lastError = `${model}: empty response`;
          continue;
        }

        const m = t.match(/\{[\s\S]*\}/);
        if (!m) {
          lastError = `${model}: no json in: ${t.slice(0,100)}`;
          continue;
        }

        const res = JSON.parse(m[0]);
        if (Array.isArray(res.numeros) && res.numeros.length === 15) {
          res.numeros = res.numeros.map(Number).sort((a,b) => a-b);
          res.concurso = parseInt(res.concurso);
          res.modelo = model; // debug info
          return new Response(JSON.stringify(res), {status:200, headers:h});
        }
        lastError = `${model}: invalid numeros`;
      } catch(e) {
        lastError = `${model}: ${e.message}`;
      }
    }

    return new Response(JSON.stringify({erro: 'todos modelos falharam', detalhe: lastError}), {status:200, headers:h});

  } catch(e) {
    return new Response(JSON.stringify({erro: e.message}), {status:500, headers:h});
  }
}