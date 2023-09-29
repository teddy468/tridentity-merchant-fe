import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import RatingManagementComp from "../../components/RatingManagementComp";
import { AppContext } from "../../contexts/AppContext";

const RatingManagement: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <RatingManagementComp />;
};

export default RatingManagement;
