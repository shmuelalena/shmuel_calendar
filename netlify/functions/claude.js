// Proxy for Groq, Anthropic, and xAI Grok APIs
exports.handler = async (event) => {
  const corsOrigin = process.env.CORS_ALLOW_ORIGIN || '*';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Provider',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!event.body || event.body.length > 200000) {
      return {
        statusCode: 413,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
        },
        body: JSON.stringify({ error: 'Payload too large or empty body' }),
      };
    }

    const body = JSON.parse(event.body);
    const headersIn = event.headers || {};
    const provider = (headersIn['x-provider'] || headersIn['X-Provider'] || 'groq').toLowerCase();
    if (provider !== 'groq' && provider !== 'anthropic' && provider !== 'grok') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
        },
        body: JSON.stringify({ error: 'Unsupported provider' }),
      };
    }

    let url, headers;
    let apiKey;

    if (provider === 'grok') {
      url = 'https://api.x.ai/v1/chat/completions';
      apiKey = process.env.GROK_API_KEY || headersIn['x-api-key'] || headersIn['X-API-Key'];
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
    } else if (provider === 'groq') {
      url = 'https://api.groq.com/openai/v1/chat/completions';
      apiKey = process.env.GROQ_API_KEY || headersIn['x-api-key'] || headersIn['X-API-Key'];
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
    } else {
      url = 'https://api.anthropic.com/v1/messages';
      apiKey = process.env.ANTHROPIC_API_KEY || headersIn['x-api-key'] || headersIn['X-API-Key'];
      headers = {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      };
    }

    if (!apiKey) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
        },
        body: JSON.stringify({ error: 'Missing API key for selected provider' }),
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (_e) {
      data = { raw };
    }

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
