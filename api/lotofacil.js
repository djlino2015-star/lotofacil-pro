export const config = { runtime: 'edge' };

export default async function handler(req) {
  const h = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: h });
  }

  // Tenta buscar direto da API oficial da Caixa via servidor (sem CORS!)
  // No servidor da Vercel não tem restrição de CORS — funciona perfeitamente
  try {
    const resp = await fetch(
      'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Origin': 'https://loterias.caixa.gov.br',
          'Referer': 'https://loterias.caixa.gov.br/'
        },
        cache: 'no-store'
      }
    );

    if (!resp.ok) throw new Error(`Caixa HTTP ${resp.status}`);

    const data = await resp.json();

    // Extrai os dados no formato da API da Caixa
    const concurso = parseInt(data.numero);
    const dataStr = data.dataApuracao || '—';
    const nums = (data.listaDezenas || []).map(Number).sort((a, b) => a - b);
    const premios = data.listaRateioPremio || [];
    const principal = premios.find(p =>
      p.descricaoFaixa?.includes('15') || p.faixa === 1
    );
    const ganhadores = principal ? parseInt(principal.numeroDeGanhadores) : 0;

    if (nums.length === 15 && concurso > 0) {
      return new Response(JSON.stringify({
        concurso,
        data: dataStr,
        numeros: nums,
        ganhadores,
        fonte: 'caixa'
      }), { status: 200, headers: h });
    }

    throw new Error('Dados incompletos da Caixa');

  } catch (e1) {

    // Fallback: API do guidi.dev.br (também gratuita)
    try {
      const resp2 = await fetch(
        'https://api.guidi.dev.br/loteria/lotofacil/ultimo',
        { cache: 'no-store' }
      );

      if (!resp2.ok) throw new Error(`guidi HTTP ${resp2.status}`);

      const d2 = await resp2.json();
      const nums2 = (d2.dezenas || []).map(Number).sort((a, b) => a - b);
      const conc2 = parseInt(d2.concurso || 0);

      if (nums2.length === 15 && conc2 > 0) {
        return new Response(JSON.stringify({
          concurso: conc2,
          data: d2.data || '—',
          numeros: nums2,
          ganhadores: d2.premiacoes?.[0]?.vencedores || 0,
          fonte: 'guidi'
        }), { status: 200, headers: h });
      }

      throw new Error('Dados incompletos do guidi');

    } catch (e2) {

      // Último fallback: loteriascaixa-api
      try {
        const resp3 = await fetch(
          'https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest',
          { cache: 'no-store' }
        );

        if (!resp3.ok) throw new Error(`heroku HTTP ${resp3.status}`);

        const d3 = await resp3.json();
        const nums3 = (d3.dezenas || []).map(Number).sort((a, b) => a - b);
        const conc3 = parseInt(d3.concurso || 0);

        if (nums3.length === 15 && conc3 > 0) {
          return new Response(JSON.stringify({
            concurso: conc3,
            data: d3.data || '—',
            numeros: nums3,
            ganhadores: d3.premiacoes?.[0]?.vencedores || 0,
            fonte: 'heroku'
          }), { status: 200, headers: h });
        }

        throw new Error('Dados incompletos heroku');

      } catch (e3) {
        return new Response(JSON.stringify({
          erro: 'Todas as fontes falharam',
          e1: e1.message,
          e2: e2.message,
          e3: e3.message
        }), { status: 200, headers: h });
      }
    }
  }
}
