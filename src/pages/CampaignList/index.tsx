import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import CampaignListComp from "../../components/CampaignListComp";
import { AppContext } from "../../contexts/AppContext";

const CampaignList: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <CampaignListComp />;
};

export default CampaignList;
