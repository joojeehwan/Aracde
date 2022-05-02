import axios from 'axios';

const BASE_URL = 'http://k6a203.p.ssafy.io:8081/api/users';

const createRoom = async () => {
  const response = await axios.get(`${BASE_URL}/rooms`)
  console.log(response);
  return response;
}

const enterRoom = async (code: string) => {
  const response = await axios.get(`${BASE_URL}/rooms/inviteCode=${code}`)
  console.log(response);
  return response;
}

const exitRoom = async (code: string) => {
  const response = await axios.get(`${BASE_URL}/rooms/exit/inviteCode=${code}`)
  console.log(response);
  return response;
}

const API = {
  createRoom,
  enterRoom,
  exitRoom,
}

export default API;