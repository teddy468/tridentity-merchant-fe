import { createContext, useCallback, useEffect, useState } from "react";
import { MERCHANT, REFRESH_TOKEN_KEY, TOKEN_KEY } from "../commons/constants";
import useFetchList from "../commons/hooks/useFetchList";
import { handleRefreshToken } from "../commons/utils/axios";
import { getMerchantLocal } from "../commons/utils/functions/getUserFromToken";
import { ALL_ATTRIBUTES_URL, CATEGORIES_URL, MERCHANT_STORES_URL } from "../commons/constants/api-urls";
import useFetch from "../commons/hooks/useFetch";
import { MODES } from "../commons/constants/user";

interface AppState {
  user: Partial<User> | null;
  setUser: React.Dispatch<React.SetStateAction<Partial<User> | null>>;
  logout: () => void;
  store: FetchReturnType<Store>;
  currentStore: Store | null;
  setCurrentStore: (store: Store | null) => void;
  categories: Category[];
  configAttributes: Attribute[];
}

const initialList: FetchReturnType<Store> = {
  data: [],
  loading: false,
  error: null,
  initialized: false,
  total: 0,
  update: () => null,
  refresh: () => null,
};

export const AppContext = createContext<AppState>({
  user: {},
  setUser: () => {},
  logout: () => {},
  store: { ...initialList },
  currentStore: null,
  setCurrentStore: () => {},
  categories: [],
  configAttributes: [],
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = props => {
  const [user, setUser] = useState<Partial<User> | null>({});
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const store = useFetchList<Store>(user?.merchantIds ? MERCHANT_STORES_URL(user.merchantIds[0]) : "", {
    pageSize: 100,
    perPage: 100,
  });
  const { data: categories } = useFetch<Category[]>(CATEGORIES_URL);
  const { data: configAttributes } = useFetch<Attribute[]>(ALL_ATTRIBUTES_URL);
  useEffect(() => {
    const getUserFromRefreshToken = async () => {
      const refresh_token = await handleRefreshToken();
      if (refresh_token) {
        const user = getMerchantLocal();

        if (!user) {
          logout();
          return;
        }

        if (user.merchant_role.id === MODES.USER) {
          setUser(user);
          // setCurrent when merchant member login
          setCurrentStore(user.merchantStoreAuthorities[0].merchantStore);
        } else {
          setUser(user);
        }
      } else {
        logout();
      }
    };
    getUserFromRefreshToken();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(MERCHANT);
    setUser(null);
  }, []);

  const appState = {
    user,
    setUser,
    logout,
    currentStore,
    setCurrentStore,
    store,
    categories: categories || [],
    configAttributes: configAttributes || [],
  };
  return <AppContext.Provider value={appState}>{props.children}</AppContext.Provider>;
};
