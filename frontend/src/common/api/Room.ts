import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = 'https://k6a203.p.ssafy.io/apiv1/game';

const createRoom = async () => {
  const response = await axios.post(`${BASE_URL}/room`);
  console.log(response);
  return response;
};

const enterRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/room`,{inviteCode : code});
  console.log(response);
  return response;
};

const exitRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/game/exit`, { inviteCode: code });
  console.log(response);
  return response;
};

const RoomApi = {
  createRoom,
  enterRoom,
  exitRoom,
};

export default RoomApi;
