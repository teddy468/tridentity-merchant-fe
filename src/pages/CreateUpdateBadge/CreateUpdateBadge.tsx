import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../../commons/components/Loading";
import { UPDATE_PRODUCT_URL } from "../../commons/constants/api-urls";
import useFetch from "../../commons/hooks/useFetch";
import CreateUpdateBadgeForm from "../../components/Form/CreateUpdateBadge/CreateUpdateBadgeForm";
import { AppContext } from "../../contexts/AppContext";
import NotFoundPage from "../NotFound";

const CreateUpdateBadge: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId, productId } = useParams<{ storeId: string; productId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const { data, loading } = useFetch<Product>(productId ? UPDATE_PRODUCT_URL(productId) : "");
  if (loading) return <Loading />;

  if (productId && data?.id !== Number(productId)) return <NotFoundPage />;

  return <CreateUpdateBadgeForm storeId={storeId as string} />;
};

export default CreateUpdateBadge;
