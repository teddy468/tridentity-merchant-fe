import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import BadgesManagementComp from "../../components/BadgesManagementComp";
import { AppContext } from "../../contexts/AppContext";

const BadgesManagement: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <BadgesManagementComp />;
};

export default BadgesManagement;
