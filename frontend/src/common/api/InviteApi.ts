import axios from 'axios';
import { getToken } from './jWT-Token';

const BASE_URL = process.env.REACT_APP_API_ROOT + '/online';

const online = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .post(`${BASE_URL}/enter`, { headers: { Authorization: token } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
  }
};
const offline = async () => {
  const token = getToken();
  if (token !== null) {
    const result = await axios
      .post(`${BASE_URL}/out`, { headers: { Authorization: token } })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.dir(err);
        return err;
      });
  }
};

const OnlineApi = {
  online,
  offline,
};

export default OnlineApi;
