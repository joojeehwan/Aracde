const CLIENT_ID = '656466619660-65vhmq3fem3nq24m8rm84b65p3o5iqff.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/oauth/callback/google';

//클라이언트 보안 비밀번호 : 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
export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;