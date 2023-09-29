import { useParams } from "react-router-dom";
import useFetch from "../../commons/hooks/useFetch";
import CreateUpdateStoreForm from "../../components/Form/CreateUpdateStoreForm/CreateUpdateStoreForm";
import { STORE_ADDRESS_URL, STORE_DETAIL_URL } from "../../commons/constants/api-urls";
import { Loading } from "../../commons/components/Loading";
import NotFoundPage from "../NotFound";
import { useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";

const CreateUpdateStorePage: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const { data, loading } = useFetch<Store>(storeId ? STORE_DETAIL_URL(storeId) : "");
  const { data: addresses, loading: loadingAddress } = useFetch<StoreAddress[]>(
    storeId ? STORE_ADDRESS_URL(storeId) : ""
  );

  if (loading || loadingAddress) return <Loading />;

  if (storeId && data?.id !== Number(storeId)) return <NotFoundPage />;

  return <CreateUpdateStoreForm store={data} address={addresses?.[0]} />;
};

export default CreateUpdateStorePage;
