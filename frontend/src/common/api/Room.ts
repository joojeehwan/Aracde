import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = process.env.REACT_APP_API_ROOT + '/game';

const createRoom = async () => {
  const response = await axios.post(`${BASE_URL}/room`);
  console.log(response);
  return response;
};

const enterRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/room`, { inviteCode: code });
  console.log(response);
  return response;
};

const exitRoom = async (code: string) => {
  const response = await axios.patch(`${BASE_URL}/game/exit`, { inviteCode: code });
  console.log(response);
  return response;
};

const getUploadImageResult = async (data: FormData) => {
  const response = await axios.post(`${BASE_URL}/upload`, data);
  return response;

}

//게임 초대 
const postInviteFriendAlarm = async (userSeq: any, inviteCode: any, targetUserSeq: any) => {
  const token = getToken();
  const body = {
    inviteCode,
    userSeq,
    targetSeq: targetUserSeq
  };
  if (token !== null) {
    console.log(body)
    const result = await axios.post(`${BASE_URL}/invite`, body, { headers: { Authorization: token } })
      .then((res) => {
        console.log(res)
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

const RoomApi = {
  createRoom,
  enterRoom,
  exitRoom,
  getUploadImageResult,
  postInviteFriendAlarm
};

export default RoomApi;
