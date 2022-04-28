import axios from 'axios';

const BASE_URL = 'https://j6a203.p.ssafy.io/api/users';

const enterRoom = async (code: string) => {
  const response = await axios.get(`${BASE_URL}/rooms/inviteCode=${code}`)
  console.log(response);
  return response;
}

const exitRoom = async (code: string) => {
  const response = await axios.get(`${BASE_URL}/rooms/exit/inviteCode=${code}`)
  return response;
}

const API = {
  enterRoom,
  exitRoom,
}

export default API;