import { Avatar, Divider, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AppContext } from "../../contexts/AppContext";
import styles from "./index.module.scss";
import useFetchInfinit from "../../commons/hooks/useFetchInfinit";
import { CONVERSATIONS } from "../../commons/constants/api-urls";
import moment from "moment";
import { SearchInput } from "../../commons/components/SearchInput";

const perPage = 10;

interface Props {
  onSelect: (conversation: Conversation) => void;
  selected: Conversation | null;
}

const ConversationList: React.FC<Props> = ({ onSelect, selected }) => {
  const { currentStore } = useContext(AppContext);
  const [search, setSearch] = useState<string | undefined>("");
  const { data, loading, initialized, hasMore, next, refresh } = useFetchInfinit<Conversation>(
    currentStore?.id ? CONVERSATIONS(currentStore.id) : "",
    { perPage, search_value: search }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <>
      <SearchInput
        onSearch={value => setSearch(value || undefined)}
        className={styles.inputSearch}
        type="search"
        placeholder="Search for conversation"
      />
      <div id="scrollableDiv" className={styles.conversations}>
        {initialized && !data.length && <div className={styles.empty}>No conversation!</div>}
        <InfiniteScroll
          dataLength={data.length}
          next={next}
          hasMore={hasMore}
          loader={loading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={
            data.length > perPage && (
              <Divider plain style={{ color: "white" }}>
                It is all, nothing more 🤐
              </Divider>
            )
          }
          scrollableTarget="scrollableDiv"
        >
          {data.map(item => (
            <div
              className={`${styles.item} ${selected?.id === item.id ? styles.active : ""}`}
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <div className={styles.avatar}>
                {item.user.avatar && <img src={item.user.avatar} title={item.user.username} />}
              </div>
              <div className={styles.user}>
                <div className={styles.title}>
                  <div className={styles.username}>{item.user.username}</div>
                  <div className={styles.time}>{moment(item.update_time).format("MM/DD/YYYY")}</div>
                  {!!item.store_unread_count && (
                    <Avatar size={16} className={styles.count}>
                      {Number(item.store_unread_count)}
                    </Avatar>
                  )}
                </div>
                <div className={`${styles.lastMessage} ${item.store_unread_count ? styles.unread : ""}`}>
                  {!item.latest_message?.message && item.latest_message?.data?.image_url
                    ? item.latest_message?.speaker === "store"
                      ? "You sent a picture"
                      : `${item.user.username} sent a picture`
                    : item.latest_message?.speaker === "store"
                    ? `You: ${item.latest_message?.message}`
                    : item.latest_message?.message}
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default ConversationList;
