import axios from 'axios';

const BASE_URL = 'https://j6a203.p.ssafy.io/api/users';

const getKakaoLoginResult = async (code: string) => {
  const result = await axios.get(`${BASE_URL}/login/kakao?code=${code}`);
  console.log(result);
  return result;
};

const getNaverLoginResult = async (code: string) => {
  const result = await axios.get(`${BASE_URL}/login/naver?code=${code}`);
  console.log(result);
  return result;
};

const getGoogleLoginResult = async (code: string) => {
  const result = await axios.get(`${BASE_URL}/login/google?code=${code}`);
  console.log(result);
  return result;
};

const LoginApi = {
  getKakaoLoginResult,
  getNaverLoginResult,
  getGoogleLoginResult,
};

export default LoginApi;
