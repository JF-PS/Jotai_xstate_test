import axios from "axios";
import { useCallback, useState } from "react";

export const useApi = (apiName: string) => {
  // Initialize :
  const [data, setData] = useState({});

  const fetchApi = () => {
    axios.get(`${window.location.href}api/${apiName}`).then((response) => {
      const { data } = response;
      setData((current) => ({ ...current, [apiName]: data }));
    });
  };

  return { fetchApi, data };
};

export default useApi;
