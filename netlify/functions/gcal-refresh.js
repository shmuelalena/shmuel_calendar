exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };

    try {
        const { refresh_token } = JSON.parse(event.body);
        if (!refresh_token) return { statusCode: 400, body: 'No refresh token' };

        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

        const fetch = (await import('node-fetch')).default || globalThis.fetch;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                refresh_token,
                grant_type: 'refresh_token'
            })
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};