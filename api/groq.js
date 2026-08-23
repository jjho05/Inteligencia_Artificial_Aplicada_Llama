export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parsear body si viene como string
  let bodyData = req.body;
  if (typeof bodyData === 'string') {
    try {
      bodyData = JSON.parse(bodyData);
    } catch (e) {
      bodyData = {};
    }
  }
  bodyData = bodyData || {};

  // Obtener API Key de Vercel Environment o del payload
  const apiKey = (process.env.GROQ_API_KEY || bodyData.apiKey || '').trim();

  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return res.status(400).json({
      error: 'No se detectó la variable GROQ_API_KEY en Vercel. Por favor verifica que esté agregada en Settings -> Environment Variables de tu proyecto y que hayas hecho un Redeploy.'
    });
  }

  // Mapeo seguro de modelos de Groq
  let modelName = (bodyData.model || 'llama-3.1-8b-instant').trim();
  if (modelName === 'gemma2-9b-it' || modelName.includes('qwen') || modelName.includes('27b')) {
    modelName = 'gemma2-9b-it';
  } else if (modelName.includes('70b') || modelName.includes('120b') || modelName.includes('grande')) {
    modelName = 'llama-3.3-70b-versatile';
  } else {
    modelName = 'llama-3.1-8b-instant';
  }

  const query = bodyData.query || 'Hola';
  const maxTokens = parseInt(bodyData.max_tokens || 500, 10);
  const temperature = parseFloat(bodyData.temperature !== undefined ? bodyData.temperature : 0.3);

  try {
    const t0 = Date.now();
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente de IA avanzado, claro, pedagógico y analítico. Responde en español usando Markdown pulcro, conciso y directo.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: Math.min(maxTokens, 1500),
        temperature: temperature
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok || data.error) {
      const errMsg = (data.error && data.error.message) ? data.error.message : ('Error Groq API Status ' + groqRes.status);
      return res.status(groqRes.status || 500).json({ error: errMsg });
    }

    const t1 = Date.now();
    const latency = ((t1 - t0) / 1000).toFixed(2);
    const content = (data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content : 'Sin respuesta.';
    const promptTokens = data.usage ? data.usage.prompt_tokens : Math.floor(query.length / 3.4);
    const completionTokens = data.usage ? data.usage.completion_tokens : Math.floor(content.length / 3.4);
    const totalTokens = data.usage ? data.usage.total_tokens : (promptTokens + completionTokens);
    const speed = latency > 0 ? Math.round(completionTokens / Math.max(parseFloat(latency), 0.05)) : 0;

    return res.status(200).json({
      content,
      latency,
      totalTokens,
      speed,
      model: modelName
    });
  } catch (err) {
    return res.status(500).json({ error: 'Fallo al contactar servidores de Groq LPU: ' + err.message });
  }
}
