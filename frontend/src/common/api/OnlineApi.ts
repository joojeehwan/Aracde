import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = process.env.REACT_APP_API_ROOT + '/online';

// 온라인 api

const setOnline = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .post(`${BASE_URL}/enter`, {}, { headers: { Authorization: token } })
      .then((res) => {
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
    return result;
  }
  return null;
};

// 오프라인 api

const setOffline = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .post(`${BASE_URL}/out`, {}, { headers: { Authorization: token } })
      .then((res) => {
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
    return result;
  }
  return null;
};

const OnlineApi = {
  setOnline,
  setOffline,
};

export default OnlineApi;
