import axios, { AxiosInstance } from "axios";
import { useCallback, useEffect, useState } from "react";
import defaultAxios from "../utils/axios";

interface FetchReturnType<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  refresh: () => void;
}

const useFetch = <T>(url: string): FetchReturnType<T> => {
  const [data, setData] = useState<T | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!url) return;
    let service: AxiosInstance = defaultAxios;
    if (url.search("http://") === 0 || url.search("https://") === 0) {
      service = axios;
    }
    setLoading(true);
    try {
      const res = await service.get<T>(url);
      setData(res.data);
      setError(null);
      setInitialized(true);
    } catch (error: any) {
      setData(null);
      setError(error?.response?.data?.message || error?.message);
    }
    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, initialized, refresh: fetch };
};

export default useFetch;
