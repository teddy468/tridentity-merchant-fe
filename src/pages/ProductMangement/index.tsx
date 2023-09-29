import { useContext, useEffect } from "react";
import ProductManagement from "../../components/ProductManagement";
import { AppContext } from "../../contexts/AppContext";
import { useParams } from "react-router-dom";

const ProductManagementPage: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <ProductManagement />;
};

export default ProductManagementPage;
