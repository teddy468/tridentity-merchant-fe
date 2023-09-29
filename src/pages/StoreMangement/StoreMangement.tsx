import { useContext, useEffect } from "react";
import StoreManagement from "../../components/StoreManagement";
import { AppContext } from "../../contexts/AppContext";

const StoreMangementPage: React.FC = () => {
  const { setCurrentStore } = useContext(AppContext);

  useEffect(() => {
    setCurrentStore(null);
  }, []);

  return <StoreManagement />;
};

export default StoreMangementPage;
