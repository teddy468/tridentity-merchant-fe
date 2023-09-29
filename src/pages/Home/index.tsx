import { FC, useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { useParams } from "react-router-dom";

const HomePage: FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  return <div>HomePage</div>;
};

export default HomePage;
