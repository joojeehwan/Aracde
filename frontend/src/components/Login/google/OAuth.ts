const CLIENT_ID = '656466619660-65vhmq3fem3nq24m8rm84b65p3o5iqff.apps.googleusercontent.com';
const REDIRECT_URI = process.env.REACT_APP_API_ROOT_NOTV1 + '/oauth/callback/google';

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;
