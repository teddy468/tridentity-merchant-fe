import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReportComp from "../../components/ReportComp";
import { AppContext } from "../../contexts/AppContext";

const Report: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <ReportComp />;
};

export default Report;
