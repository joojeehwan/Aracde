import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = 'http://localhost:8080/apiv1/chat';

const createChatRoom = async (targetUserSeq: number) => {
  const token = getToken();
  const body = {
    targetUserSeq
  }
  if (token !== null) {
    const response = await axios.post(`${BASE_URL}/create`, body, { headers: { Authorization: token } });
    console.log(response);
    return response;

  }
  return null;
};

const enterChatRoom = async (code: string) => {
  const response = await axios.get(`${BASE_URL}/rooms/inviteCode=${code}`);
  console.log(response);
  return response;
};


const ChatAPI = {
  createChatRoom,
  enterChatRoom,
};

export default ChatAPI;
