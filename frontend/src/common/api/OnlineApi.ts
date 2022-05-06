import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = 'http://localhost:8080/apiv1/online';

const online = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios.post(`${BASE_URL}/enter`, {}, { headers: { Authorization: token } })
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

}
const offline = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios.post(`${BASE_URL}/out`, {}, { headers: { Authorization: token } })
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

}

const OnlineApi = {
  online,
  offline,
};

export default OnlineApi;