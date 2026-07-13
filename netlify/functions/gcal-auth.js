exports.handler = async (event, context) => {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
    
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/drive.file');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    return {
        statusCode: 302,
        headers: { Location: authUrl }
    };
};