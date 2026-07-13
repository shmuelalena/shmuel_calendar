exports.handler = async (event, context) => {
    const code = event.queryStringParameters.code;
    if (!code) return { statusCode: 400, body: 'No code provided' };

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

    try {
        const fetch = (await import('node-fetch')).default || globalThis.fetch;
        
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code'
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return { statusCode: 400, body: JSON.stringify(data) };
        }

        const html = `
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>התחברות הצליחה!</title>
            <style>body { font-family: sans-serif; text-align: center; margin-top: 50px; background: #f7f7f7; }</style>
        </head>
        <body>
            <h2>Google מחובר בהצלחה! 🥳</h2>
            <p>אנא המתן, אתה מועבר חזרה לאפליקציה...</p>
            <script>
                // שמירת הטוקנים בזיכרון של הדפדפן
                localStorage.setItem('s_tok', '${data.access_token}');
                if ('${data.refresh_token}' && '${data.refresh_token}' !== 'undefined') {
                    localStorage.setItem('s_refresh_tok', '${data.refresh_token}');
                }
                localStorage.setItem('s_token_expiry', Date.now() + (${data.expires_in} * 1000));
                
                // חזרה לאפליקציה תוך שנייה
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            </script>
        </body>
        </html>
        `;

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            body: html
        };
    } catch (error) {
         return { statusCode: 500, body: 'Internal Server Error: ' + error.message };
    }
};