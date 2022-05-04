import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = 'http://localhost:8080/apiv1/users';

const getKakaoLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2, 11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=KAKAO&&state=${state}`);
  console.log(result);
  return result;
};

const getNaverLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2, 11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=NAVER&&state=${state}`);
  console.log(result);
  return result;
};

const getGoogleLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2, 11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=GOOGLE&&state=${state}`);
  console.log(result);
  return result;
};

const getUserSearchResult = async (name: string) => {
  const token = getToken();
  if (token !== null) {
    const result = await axios.get(`${BASE_URL}/search/norelate?name=${name}`, { headers: { Authorization: token } });
    console.log(result);
    return result;
  }
  return null;
};

const getAddFriendRequestResult = async (email: string) => {
  const token = getToken();
  const body = {
    email,
  };
  if (token !== null) {
    const result = await axios.post(`${BASE_URL}/friend`, body, { headers: { Authorization: token } });
    console.log(result);
    return result;
  }
  return null;
};

const getFriendList = async () => {
  const token = getToken()
  if (token !== null) {
    const result = await axios.get(`${BASE_URL}/friendList`, { headers: { Authorization: token } }).then((res) => {
      console.log(res)
      return res
    })
      .then((err) => {
        console.dir(err)
        return err
      })
    return result;
  }
  return null;
}

const deleteFriend = async (userSeq: number) => {
  const token = getToken();
  const body = {
    userSeq,
  };
  if (token !== null) {
    const result = await axios.post(`${BASE_URL}/friend`, body, { headers: { Authorization: token } });
    console.log(result);
    return result;
  }
  return null;
};

const UserApi = {
  getKakaoLoginResult,
  getNaverLoginResult,
  getGoogleLoginResult,
  getUserSearchResult,
  getAddFriendRequestResult,
  getFriendList,
  deleteFriend
};

export default UserApi;
