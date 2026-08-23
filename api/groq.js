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

  // Mapeo a los modelos exactos soportados y roles diferenciados
  let requestedModel = (bodyData.model || 'openai/gpt-oss-20b').trim();
  let modelName = 'openai/gpt-oss-20b';
  let systemPrompt = 'Eres un modelo ligero de alta velocidad (SLM 20B). Tu objetivo es dar respuestas ultra-directas, concisas, prácticas y breves (máximo 2 párrafos o viñetas cortas sin preámbulos). No uses emojis.';

  if (requestedModel.includes('120b') || requestedModel.includes('grd') || requestedModel.includes('70b') || requestedModel.includes('grande')) {
    modelName = 'openai/gpt-oss-120b';
    systemPrompt = 'Eres un modelo insignia de máxima capacidad (LLM 120B). Tu objetivo es proporcionar una respuesta formal, exhaustiva, estructurada con directivas técnicas completas, reglas y ejemplos de nivel enterprise. No uses emojis.';
  } else if (requestedModel.includes('qwen') || requestedModel.includes('27b') || requestedModel.includes('qwn')) {
    modelName = 'qwen/qwen3.6-27b';
    systemPrompt = 'Eres un modelo especializado en razonamiento analítico y resolución lógica paso a paso (27B CoT). Desglosa el problema mediante análisis sistemático, principios fundamentales y validación formal de cada paso. No uses emojis.';
  }

  const query = bodyData.query || 'Hola';
  const maxTokens = parseInt(bodyData.max_tokens || 600, 10);
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: Math.min(Math.max(maxTokens, modelName.includes('qwen') ? 800 : 400), 1500),
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
    let content = (data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content : 'Sin respuesta.';

    // Limpiar etiquetas de pensamiento <think> de modelos CoT
    if (content.includes('</think>')) {
      content = content.split('</think>').pop().trim();
    } else if (content.startsWith('<think>')) {
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<think>[\s\S]*/g, '').trim();
    }

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
