import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoyaltyPointComp from "../../components/LoyaltyPointComp";
import { AppContext } from "../../contexts/AppContext";

const LoyaltyPoint: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <LoyaltyPointComp />;
};

export default LoyaltyPoint;
