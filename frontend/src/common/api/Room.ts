import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = 'https://k6a203.p.ssafy.io/apiv1';
const token = getToken();

const getProfile = async () => {
  if (token !== null) {
    return await axios
      .get(`${BASE_URL}/users/profile`, { headers: { Authorization: token } })
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

const createRoom = async () => {
  return await axios
    .post(`${BASE_URL}/room/create`)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const enterRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/room/enter`, { inviteCode: code });
  console.log(response);
  return response;
};

const exitRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/room/exit`, { inviteCode: code });
  console.log(response);
  return response;
};

const RoomApi = {
  getProfile,
  createRoom,
  enterRoom,
  exitRoom,
};

export default RoomApi;
