import axios from 'axios';

const BASE_URL = 'http://k6a203.p.ssafy.io:8080/apiv1/room';

const createRoom = async () => {
  const response = await axios.post(`${BASE_URL}/create`);
  console.log(response);
  return response;
};

const enterRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/enter`,{inviteCode : code});
  console.log(response);
  return response;
};

const exitRoom = async (code: string) => {
  const response = await axios.get(`${BASE_URL}/rooms/exit/inviteCode=${code}`);
  console.log(response);
  return response;
};

const RoomApi = {
  createRoom,
  enterRoom,
  exitRoom,
};

export default RoomApi;
