import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = process.env.REACT_APP_API_ROOT + '/noti';

//swr fetcher 알람 목록 가져오기
const fetchAlarmWithToken = (url: string, token: string) =>
  axios
    .get(`${url}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((result) => result.data);

// 알람 읽음 처리
// 정리,,,
// 자꾸 하는 실수,,, post엔 body가 있어야 한다,,, 이 바보야,,,
const postReadAlarm = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .post(`${BASE_URL}`, {}, { headers: { Authorization: token } })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.dir(err);
        // console.log(token)
        return err;
      });
    return result;
  }
  return null;
};

// 알람 삭제 처리
const deleteAlarm = async (notiSeq: number) => {
  const token = getToken();
  if (token !== null) {
    const result = await axios.delete(`${BASE_URL}?notiSeq=${notiSeq}`, {
      headers: { Authorization: token },
    });
    console.log(result);
    return result;
  }
  return null;
};

const AlarmApi = {
  fetchAlarmWithToken,
  deleteAlarm,
  postReadAlarm,
};

export default AlarmApi;
