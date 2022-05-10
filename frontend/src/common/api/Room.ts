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

const getUploadImageResult = async (data : FormData) => {
  const response = await axios.post(`${BASE_URL}/upload`, data);
  return response;
}
const getSaveMyFavoriteImageResult = async (data : {userSeq : string | number | null, pictureUrl : string}) => {
  if(data.userSeq !== null){
    data.userSeq = +data.userSeq;
    const response = await axios.post(`${BASE_URL}/picture`, data);
    return response
  }
  else return null;
}


const RoomApi = {
  createRoom,
  enterRoom,
  exitRoom,
  getUploadImageResult,
  getSaveMyFavoriteImageResult
};

export default RoomApi;
