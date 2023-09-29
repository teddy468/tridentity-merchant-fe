import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatBoxComp from "../../components/ChatBoxComp";
import { AppContext } from "../../contexts/AppContext";

const ChatBox: React.FC = () => {
  const { setCurrentStore, store } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  useEffect(() => {
    setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId, setCurrentStore, store]);
  
  return <ChatBoxComp />;
};

export default ChatBox;
