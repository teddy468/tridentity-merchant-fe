import axios, { AxiosInstance } from "axios";
import { useCallback, useEffect, useState } from "react";
import defaultAxios from "../utils/axios";
import { filterDuplicate } from "../utils/functions/filterDuplicate";
import { getUrlSearchParams } from "../utils/functions/getQueryString";

const useFetchList = <T extends MixObject>(url: string, params: Params = {}): FetchReturnType<T> => {
  const [data, setData] = useState<T[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const getList = useCallback(async () => {
    if (!url) return;
    let service: AxiosInstance = defaultAxios;
    if (url.search("http://") === 0 || url.search("https://") === 0) {
      service = axios;
    }
    setLoading(true);
    try {
      const baseURL = url.split("?")[0];
      const lastURL = url.split("?")[1];
      const queryUrl = getUrlSearchParams({ ...params, paginationMetadataStyle: "body" });
      const res = await service.get<Pagination<T>>(`${baseURL}?${lastURL ? `${lastURL}&` : ""}${queryUrl}`);
      setData(res.data.data);
      setError(null);
      setTotal(res.data.metadata ? res.data.metadata["x-total-count"] : 0);
      setInitialized(true);
    } catch (error: any) {
      setData([]);
      setError(error?.response?.data?.message || error?.message);
    }
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...Object.values(params || {})]);

  const update = useCallback(
    async (newData: T[] | UpdateParams<T>, key?: string) => {
      setData(data => {
        if (typeof newData === "function") {
          return filterDuplicate<T>([...newData(data), ...data], key);
        }
        return filterDuplicate<T>([...newData, ...data], key);
      });
    },
    [setData]
  );

  useEffect(() => {
    getList();
  }, [getList]);

  return {
    data,
    loading,
    error,
    initialized,
    total,
    update,
    refresh: getList,
  };
};

export default useFetchList;
