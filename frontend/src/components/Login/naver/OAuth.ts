const CLIENT_ID = 'Jb6yH7fmEzBhClzMoClq';
const REDIRECT_URI = 'http://localhost:3000/oauth/callback/naver';
const CLIENT_SECRET = '086J2INDmq';

export const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=arcade&redirect_uri=${REDIRECT_URI}`;
