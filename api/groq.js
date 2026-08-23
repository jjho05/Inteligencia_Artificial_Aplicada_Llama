export default async function handler(req, res) {
  // Configurar encabezados CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY || (req.body && req.body.apiKey);
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return res.status(400).json({
      error: 'No se encontró una variable GROQ_API_KEY válida en Vercel ni en la petición.'
    });
  }

  const { model, query, max_tokens, temperature } = req.body || {};

  try {
    const t0 = Date.now();
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: query || 'Hola' }],
        max_tokens: parseInt(max_tokens || 500, 10),
        temperature: parseFloat(temperature !== undefined ? temperature : 0.3)
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Groq API Error' });
    }

    const t1 = Date.now();
    const latency = ((t1 - t0) / 1000).toFixed(2);
    const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
    const totalTokens = data.usage ? data.usage.total_tokens : 0;
    const speed = latency > 0 ? Math.round(totalTokens / parseFloat(latency)) : 0;

    return res.status(200).json({
      content,
      latency,
      totalTokens,
      speed
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error en la llamada a Groq LPU' });
  }
}
