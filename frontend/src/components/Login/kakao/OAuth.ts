const CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_API_ROOT_NOTV1 + '/oauth/callback/kakao';

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
