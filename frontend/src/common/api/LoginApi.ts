import axios from 'axios';

const BASE_URL = 'http://k6a203.p.ssafy.io:8080/apiv1/users';

const getKakaoLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2,11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=KAKAO&&state=${state}`);
  console.log(result);
  return result;
};

const getNaverLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2,11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=NAVER&&state=${state}`);
  console.log(result);
  return result;
};

const getGoogleLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2,11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=GOOGLE&&state=${state}`);
  console.log(result);
  return result;
};

const LoginApi = {
  getKakaoLoginResult,
  getNaverLoginResult,
  getGoogleLoginResult,
};

export default LoginApi;
