import { useParams } from "react-router-dom";
import useFetch from "../../commons/hooks/useFetch";
import CreateUpdateProductForm from "../../components/Form/CreateUpdateProductForm/CreateUpdateProductForm";
import { UPDATE_PRODUCT_URL } from "../../commons/constants/api-urls";
import { Loading } from "../../commons/components/Loading";
import NotFoundPage from "../NotFound";
import { useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";

const CreateUpdateProductPage: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId, productId } = useParams<{ storeId: string; productId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);

  const { data, loading } = useFetch<Product>(productId ? UPDATE_PRODUCT_URL(productId) : "");
  if (loading) return <Loading />;

  if (productId && data?.id !== Number(productId)) return <NotFoundPage />;

  return <CreateUpdateProductForm product={data} />;
};

export default CreateUpdateProductPage;
