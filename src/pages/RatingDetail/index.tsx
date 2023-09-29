import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import RatingDetailComp from "../../components/RatingDetailComp";
import { AppContext } from "../../contexts/AppContext";

const RatingDetail: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <RatingDetailComp />;
};

export default RatingDetail;
