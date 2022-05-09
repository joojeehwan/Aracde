import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = process.env.REACT_APP_API_ROOT + '/noti';

const getAlarmList = async () => {
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
    console.log("실행되는거니?! 삭제야?!")
    const result = await axios.delete(`${BASE_URL}?notiSeq=${notiSeq}`, {
      headers: { Authorization: token },
    });
    console.log(result);
    return result;
  }
  return null;
};

const AlarmApi = {
  getAlarmList,
  deleteAlarm,
  postReadAlarm,
};

export default AlarmApi;
