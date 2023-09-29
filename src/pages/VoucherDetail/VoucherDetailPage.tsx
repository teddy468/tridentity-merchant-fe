import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import VoucherDetail from "../../components/VoucherDetail/VoucherDetail";
import { AppContext } from "../../contexts/AppContext";

const VoucherDetailPage = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  return <VoucherDetail />;
};

export default VoucherDetailPage;
