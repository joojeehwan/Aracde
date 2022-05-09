import axios from 'axios';


// withCredentials 이거 있어야 되나?!
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);

export default fetcher;
