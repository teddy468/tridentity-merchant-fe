import { Avatar } from "antd";
import { useContext, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import styles from "./index.module.scss";
import { UNREAD_CONVERSATION } from "../../commons/constants/api-urls";
import useFetch from "../../commons/hooks/useFetch";

const ChatCount = () => {
  const { currentStore } = useContext(AppContext);
  const { data, refresh } = useFetch<UnreadConversation>(currentStore?.id ? UNREAD_CONVERSATION(currentStore.id) : "");

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (!data?.unread_conversations || !Number(data?.unread_conversations)) return null;

  return (
    <Avatar size={16} className={styles.count}>
      {Number(data.unread_conversations)}
    </Avatar>
  );
};

export default ChatCount;
