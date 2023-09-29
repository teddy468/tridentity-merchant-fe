import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../../commons/components/Loading";
import { STORE_ADDRESS_URL, STORE_DETAIL_URL } from "../../commons/constants/api-urls";
import useFetch from "../../commons/hooks/useFetch";
import CreateAndUpdateVoucher from "../../components/Form/CreateAndUpdateVoucher/CreateAndUpdateVoucher";
import { AppContext } from "../../contexts/AppContext";
import NotFoundPage from "../NotFound";

const CreateAndUpdateVoucherPage: React.FC = () => {
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

  return <CreateAndUpdateVoucher store={data} address={addresses?.[0]} />;
};

export default CreateAndUpdateVoucherPage;
