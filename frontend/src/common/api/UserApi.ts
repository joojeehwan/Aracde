import axios from 'axios';
import {getToken} from './jWT-Token';

const BASE_URL = 'http://k6a203.p.ssafy.io:8080/api/users';

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

const getUserSearchResult = async (name : string ) => {
  const token = getToken();
  if(token !== null){
    const result = await axios.get(`${BASE_URL}/search/norelate?name=${name}`,{headers : {Authorization : token}})
    console.log(result);
    return result;
  }
  return null;
}

const getAddFriendRequestResult = async (email : string) => {
  const token = getToken();
  const body = {
    userEmail : email
  }
  if(token !== null){
    const result = await axios.post(`${BASE_URL}/friend`, body, {headers : {Authorization : token}});
    console.log(result);
    return result;
  }
  return null;
}

const UserApi = {
  getKakaoLoginResult,
  getNaverLoginResult,
  getGoogleLoginResult,
  getUserSearchResult,
  getAddFriendRequestResult
};

export default UserApi;
