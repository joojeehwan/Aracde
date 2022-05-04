import axios from 'axios';
import { getToken } from './jWT-Token';

<<<<<<< HEAD
const BASE_URL = 'http://k6a203.p.ssafy.io:8080/apiv1/room';

const createRoom = async () => {
  const response = await axios.post(`${BASE_URL}/create`);
  console.log(response);
  return response;
};

const enterRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/enter`,{inviteCode : code});
=======
const BASE_URL = 'http://localhost:8080/apiv1';
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
>>>>>>> feat/#S06P31A203-79/myroom
  console.log(response);
  return response;
};

const exitRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/room/exit`, { inviteCode: code });
  console.log(response);
  return response;
};

const RoomApi = {
<<<<<<< HEAD
=======
  getProfile,
>>>>>>> feat/#S06P31A203-79/myroom
  createRoom,
  enterRoom,
  exitRoom,
};

export default RoomApi;
