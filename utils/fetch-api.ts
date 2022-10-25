import axios from 'axios';

const fetchApi = async (apiName: string) => {
  // `http://localhost:3000/api/${apiName}`
  // `${window.location.href}api/${apiName}`
  const result = await axios.get(`http://localhost:3000/api/${apiName}`);
  return result?.data;
};

export default fetchApi;
