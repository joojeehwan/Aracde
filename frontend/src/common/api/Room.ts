import axios from 'axios';
import { getToken } from './jWT-Token';

// const BASE_URL = process.env.REACT_APP_API_ROOT + '/game';
const BASE_URL = 'https://k6a203.p.ssafy.io/apiv1/game';

const createRoom = async () => {
  const response = await axios.post(`${BASE_URL}/room`);
  return response;
};

const enterRoom = async (code: string) => {
  const response = await axios
    .patch(`${BASE_URL}/room`, { inviteCode: code })
    .then((res) => {
      const value = {
        status: 200,
      };
      return value;
    })
    .catch((e) => {
      const value = {
        status: 400,
      };
      return value;
    });
  return response;
};

const exitRoom = async (code: string | null) => {
  if (code === null) return null;
  const response = await axios.patch(`${BASE_URL}/exit`, { inviteCode: code });
  return response;
};

const getUploadImageResult = async (data: FormData) => {
  const response = await axios.post(`${BASE_URL}/upload`, data);
  return response;
};
const getSaveMyFavoriteImageResult = async (data: { userSeq: string | number | null; pictureUrl: string }) => {
  if (data.userSeq !== null) {
    data.userSeq = +data.userSeq;
    const response = await axios.post(`${BASE_URL}/picture`, data);
    return response;
  } else return null;
};

const intoGame = async (userSeq: string | null, code: number) => {
  const token = getToken();
  if (userSeq !== null && token !== null) {
    const user = +userSeq;
    const body = {
      userSeq: user,
      codeIdx: code,
    };
    const result = await axios.patch(`${BASE_URL}/init`, body, { headers: { Authorization: token } });
    return result;
  }
};

const winGame = async (userSeq : string | null, code : number) => {
  const token = getToken();
  if(userSeq !== null && token !== null){
    const user = +userSeq;
    const body = {
      userSeq : user,
      codeIdx : code
    };
    const result = await axios.patch(`${BASE_URL}/win`, body, {headers: {Authorization : token}});
    return result;
  }
}


const RoomApi = {
  createRoom,
  enterRoom,
  exitRoom,
  getUploadImageResult,
  getSaveMyFavoriteImageResult,
  intoGame,
  winGame
};

export default RoomApi;
