import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = process.env.REACT_APP_API_ROOT + '/users';

// 카카오 로그인
const getKakaoLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2, 11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=KAKAO&&state=${state}`);
  console.log(result);
  return result;
};

// 네이버 로그인
const getNaverLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2, 11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=NAVER&&state=${state}`);
  console.log(result);
  return result;
};

// 구글 로그인
const getGoogleLoginResult = async (code: string) => {
  const state = Math.random().toString(36).substring(2, 11);
  const result = await axios.get(`${BASE_URL}/login?code=${code}&&provider=GOOGLE&&state=${state}`);
  console.log(result);
  return result;
};

//유저 검색 결과
const getUserSearchResult = async (name: string) => {
  const token = getToken();
  if (token !== null) {
    const result = await axios.get(`${BASE_URL}/search/norelate?name=${name}`, { headers: { Authorization: token } });
    console.log(result);
    return result;
  }
  return null;
};

// 친구 검색 (게임 초대 요청)
const getSearchUserResultForGame = async (name: any) => {
  const token = getToken();
  if (token !== null) {
    console.log('친구 검색 게임 초대 요청 name : ', name);
    const result = await axios
      .get(`${BASE_URL}/friend/search?name=${name}`, { headers: { Authorization: token } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
    return result;
  }
  return null;
};

// 친구 요청 보내기
const getAddFriendRequestResult = async (userSeq: string) => {
  const token = getToken();
  const body = {
    userSeq,
  };
  if (token !== null) {
    console.log(userSeq);
    const result = await axios.post(`${BASE_URL}/friend`, body, { headers: { Authorization: token } });
    console.log(result);
    return result;
  }
  return null;
};

// 친구 요청 수락 (친구 맺기)
const patchAcceptFriendRequest = async (userSeq: number) => {
  const token = getToken();
  const body = {
    userSeq,
  };
  if (token !== null) {
    console.log(token);
    console.log(userSeq);
    const result = await axios
      .patch(`${BASE_URL}/friend`, body, { headers: { Authorization: token } })
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
    return result;
  }
  return null;
};

// 친구 목록 불러오기
const getFriendList = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .get(`${BASE_URL}/friendList`, { headers: { Authorization: token } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
    return result;
  }
  return null;
};

//친구 삭제하기
const deleteFriend = async (userSeq: number) => {
  const token = getToken();
  if (token !== null) {
    const result = await axios.delete(`${BASE_URL}/friend`, {
      headers: { Authorization: token },
      data: {
        userSeq: userSeq,
      },
    });
    console.log(result);
    return result;
  }
  return null;
};

const getProfile = async () => {
  const token = getToken();
  if (token !== null) {
    return await axios
      .get(`${BASE_URL}/profile`, { headers: { Authorization: token } })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  } else {
    console.log('AccessToken이 존재하지 않습니다.');
  }
};
const UserApi = {
  getKakaoLoginResult,
  getNaverLoginResult,
  getGoogleLoginResult,
  getUserSearchResult,
  getAddFriendRequestResult,
  getFriendList,
  deleteFriend,
  getProfile,
  patchAcceptFriendRequest,
  getSearchUserResultForGame,
};

export default UserApi;
