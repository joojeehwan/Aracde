import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = 'http://localhost:8080/apiv1/chat';

// 채팅방 리스트 가져오기
const getChatList = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .get(`${BASE_URL}`, { headers: { Authorization: token } })
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

//대화 상대 검색하기 결과(친구)
const getChatSearchResult = async (name: string) => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .get(`${BASE_URL}/search?name=${name}`, { headers: { Authorization: token } })
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

// 채팅창 생성하기
const createChatRoom = async (targetUserSeq: any) => {
  const token = getToken();
  console.log(targetUserSeq);
  if (token !== null) {
    const result = await axios
      .post(`${BASE_URL}/create`, targetUserSeq, { headers: { Authorization: token } })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
    console.log(result);
    return result;
  }
  return null;
};

const enterChatRoom = async (chatRoomSeq: number) => {
  const token = getToken()
  if (token !== null) {
    const result = await axios
      .get(`${BASE_URL}/enter?chatRoomSeq=${chatRoomSeq}`, { headers: { Authorization: token } })
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

const ChatAPI = {
  createChatRoom,
  enterChatRoom,
  getChatList,
  getChatSearchResult,
};

export default ChatAPI;
