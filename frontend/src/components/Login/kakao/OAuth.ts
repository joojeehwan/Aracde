const CLIENT_ID = 'b72153259a249f6c1e50dd7fb421627a';
const REDIRECT_URI = process.env.REACT_APP_API_ROOT_NOTV1 + '/oauth/callback/kakao';

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
