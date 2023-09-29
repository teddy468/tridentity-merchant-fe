import { Col, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import styles from "./index.module.scss";
import ChatCount from "./ChatCount";
import ConversationList from "./ConversationList";
import ConversationDetail from "./ConversationDetail";

const ChatBoxComp: React.FC = () => {
  const { setCurrentStore, store, currentStore } = useContext(AppContext);
  const { storeId } = useParams<{ storeId: string }>();
  const [selected, setSelected] = useState<Conversation | null>(null);
  useEffect(() => {
    if (currentStore?.id !== storeId) setCurrentStore(store.data.find(item => item.id.toString() === storeId) || null);
  }, [storeId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          {`Chat box`}
          <ChatCount />
        </div>
      </div>
      <Row gutter={[32, 16]} className={styles.chatContainer}>
        <Col span={9} className={styles.chatList}>
          <ConversationList onSelect={setSelected} selected={selected} />
        </Col>
        <Col span={14} className={styles.chatDetail}>
          {selected ? (
            <ConversationDetail conversation={selected} />
          ) : (
            <div className={styles.chatForm}>
              <div className={styles.empty}>Please select a chat on the left</div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ChatBoxComp;
