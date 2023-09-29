import axios, { AxiosInstance } from "axios";
import { useCallback, useEffect, useState } from "react";
import defaultAxios from "../utils/axios";
import { filterDuplicate, mergeArray } from "../utils/functions/filterDuplicate";
import { getUrlSearchParams } from "../utils/functions/getQueryString";

interface Params extends Omit<PaginationQuery, "page"> {
  [key: string]: string | number | boolean | undefined;
}

interface FetchReturnType<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  refresh: () => void;
  next: () => void;
  hasMore: boolean;
}

const useFetchInfinit = <T extends MixObject>(
  url: string,
  params: Params = {},
  matchKeys?: keyof T | (keyof T)[]
): FetchReturnType<T> => {
  const [data, setData] = useState<T[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const getList = async (page: number = 1, refresh?: boolean) => {
    if (!url) return;
    let service: AxiosInstance = defaultAxios;
    if (url.search("http://") === 0 || url.search("https://") === 0) {
      service = axios;
    }
    setLoading(true);
    try {
      const baseURL = url.split("?")[0];
      const lastURL = url.split("?")[1];
      const queryUrl = getUrlSearchParams({ ...params, paginationMetadataStyle: "body", page });
      const res = await service.get<Pagination<T>>(`${baseURL}?${lastURL ? `${lastURL}&` : ""}${queryUrl}`);
      const { data, metadata } = res.data;
      if (page === 1 && refresh) {
        setData(oldData => mergeArray(oldData, data, matchKeys));
        return setLoading(false);
      }
      if (page === 1) setData(data);
      else setData(oldData => filterDuplicate([...oldData, ...data], matchKeys));
      if (metadata) setHasMore(metadata["x-pages-count"] > metadata["x-page"]);
      setPage(page + 1);
      setError(null);
      setInitialized(true);
    } catch (error: any) {
      setData([]);
      setHasMore(false);
      setError(error?.response?.data?.message || error?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getList();
  }, [url, JSON.stringify(params)]);

  const next = useCallback(() => {
    getList(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, url, JSON.stringify(params)]);

  const refresh = useCallback(() => {
    getList(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    initialized,
    refresh,
    next,
    hasMore,
  };
};

export default useFetchInfinit;
